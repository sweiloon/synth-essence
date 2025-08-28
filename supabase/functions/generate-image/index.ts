import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, imageUrls, generationType = 'text-to-image', checkProgress = false, taskId } = await req.json();
    
    // Handle progress check request
    if (checkProgress && taskId) {
      const kieApiKey = Deno.env.get('KIE_AI_API_KEY');
      if (!kieApiKey) {
        return new Response(
          JSON.stringify({ error: 'API key not configured' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      const statusResponse = await fetch(`https://api.kie.ai/api/v1/flux/kontext/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${kieApiKey}`,
        },
      });

      if (statusResponse.ok) {
        const statusResult = await statusResponse.json();
        console.log('Progress check:', statusResult);
        
        if (statusResult.code === 200) {
          const status = statusResult.data?.status || 'processing';
          const progress = statusResult.data?.progress || 0;
          
          return new Response(
            JSON.stringify({
              status,
              progress,
              imageUrl: statusResult.data?.images?.[0] || null,
              taskId
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      
      return new Response(
        JSON.stringify({ status: 'processing', progress: 0, taskId }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
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

    // Return task ID immediately for progress tracking
    return new Response(
      JSON.stringify({ 
        success: true,
        taskId,
        status: 'processing'
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