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
    const { action, imageId, isFavorite } = await req.json();
    
    if (!action) {
      return new Response(
        JSON.stringify({ error: 'Action is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
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

    let result;

    switch (action) {
      case 'get_images':
        const { data: images, error: getError } = await supabase
          .from('generated_images')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (getError) {
          console.error('Get images error:', getError);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch images', details: getError.message }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        result = { images };
        break;

      case 'toggle_favorite':
        if (!imageId) {
          return new Response(
            JSON.stringify({ error: 'Image ID is required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        const { data: updatedImage, error: favoriteError } = await supabase
          .from('generated_images')
          .update({ is_favorite: isFavorite })
          .eq('id', imageId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (favoriteError) {
          console.error('Toggle favorite error:', favoriteError);
          return new Response(
            JSON.stringify({ 
              error: 'Failed to update favorite status', 
              details: favoriteError.message 
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        result = { image: updatedImage };
        break;

      case 'delete_image':
        if (!imageId) {
          return new Response(
            JSON.stringify({ error: 'Image ID is required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        // First remove from all collections
        await supabase
          .from('image_collection_items')
          .delete()
          .eq('image_id', imageId)
          .eq('user_id', user.id);

        // Then delete the image record
        const { error: deleteError } = await supabase
          .from('generated_images')
          .delete()
          .eq('id', imageId)
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('Delete image error:', deleteError);
          return new Response(
            JSON.stringify({ 
              error: 'Failed to delete image', 
              details: deleteError.message 
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        result = { success: true };
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }

    return new Response(
      JSON.stringify({ success: true, ...result }),
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