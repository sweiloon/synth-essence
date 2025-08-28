import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, imageUrls, generationType = 'text-to-image' } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const kieApiKey = Deno.env.get('KIE_AI_API_KEY');
    if (!kieApiKey) {
      console.error('KIE_AI_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Prepare API request for KIE AI Flux API
    const apiUrl = 'https://api.kie.ai/api/v1/flux/kontext/generate';
    let requestBody: any = { 
      prompt,
      aspectRatio: '1:1',
      model: 'flux-kontext-pro'
    };

    // Add input image for image-to-image generation
    if (generationType === 'image-to-image' && imageUrls && imageUrls.length > 0) {
      requestBody.inputImage = imageUrls[0];
    }

    console.log('Making request to Kie AI:', { apiUrl, requestBody });

    // Call Kie AI API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${kieApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Kie AI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate image', 
          details: errorText,
          status: response.status 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const result = await response.json();
    console.log('Kie AI API response:', result);

    // Handle task-based response from Kie AI
    if (result.code !== 200 || !result.data?.taskId) {
      console.error('Invalid response from Kie AI:', result);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid response from Kie AI API',
          details: result.msg || 'Unknown error'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const taskId = result.data.taskId;
    console.log('Task ID received:', taskId);

    // Poll for completion
    let imageUrl = null;
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout

    while (!imageUrl && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const statusResponse = await fetch(`https://api.kie.ai/api/v1/flux/kontext/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${kieApiKey}`,
        },
      });

      if (statusResponse.ok) {
        const statusResult = await statusResponse.json();
        console.log('Status check:', statusResult);
        
        if (statusResult.code === 200 && statusResult.data?.status === 'completed' && statusResult.data?.images?.[0]) {
          imageUrl = statusResult.data.images[0];
          break;
        } else if (statusResult.data?.status === 'failed') {
          throw new Error('Image generation failed');
        }
      }
      
      attempts++;
    }

    if (!imageUrl) {
      throw new Error('Image generation timeout');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Save generated image to database
    const { data: savedImage, error: dbError } = await supabase
      .from('generated_images')
      .insert({
        user_id: user.id,
        prompt,
        image_url: imageUrl,
        original_image_url: imageUrls?.[0] || null,
        generation_type: generationType,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save image', details: dbError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        image: savedImage,
        generatedUrl: imageUrl 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});