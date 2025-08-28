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
    console.log('manage-collections function called:', req.method, req.url);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
    // Check if request has body
    const contentLength = req.headers.get('content-length');
    const contentType = req.headers.get('content-type');
    
    console.log('Content-Type:', contentType);
    console.log('Content-Length:', contentLength);
    
    let requestData = {};
    if (contentLength !== '0' && contentType?.includes('application/json')) {
      const rawBody = await req.text();
      console.log('Raw request body:', rawBody);
      
      if (rawBody.trim()) {
        try {
          requestData = JSON.parse(rawBody);
        } catch (parseError) {
          console.error('Failed to parse JSON:', parseError);
          return new Response(
            JSON.stringify({ error: 'Invalid JSON in request body' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      } else {
        console.error('Request body is empty');
        return new Response(
          JSON.stringify({ error: 'Request body is empty' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    } else {
      console.error('No content or invalid content type');
      return new Response(
        JSON.stringify({ error: 'Request must have JSON body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const { action, collectionId, imageId, name, description } = requestData;
    
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
      case 'create_collection':
        if (!name) {
          return new Response(
            JSON.stringify({ error: 'Collection name is required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        const { data: newCollection, error: createError } = await supabase
          .from('image_collections')
          .insert({
            user_id: user.id,
            name,
            description: description || null,
          })
          .select()
          .single();

        if (createError) {
          console.error('Create collection error:', createError);
          return new Response(
            JSON.stringify({ error: 'Failed to create collection', details: createError.message }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        result = { collection: newCollection };
        break;

      case 'add_to_collection':
        if (!collectionId || !imageId) {
          return new Response(
            JSON.stringify({ error: 'Collection ID and Image ID are required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        const { data: collectionItem, error: addError } = await supabase
          .from('image_collection_items')
          .insert({
            user_id: user.id,
            collection_id: collectionId,
            image_id: imageId,
          })
          .select()
          .single();

        if (addError) {
          console.error('Add to collection error:', addError);
          return new Response(
            JSON.stringify({ 
              error: 'Failed to add image to collection', 
              details: addError.message 
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        result = { collectionItem };
        break;

      case 'remove_from_collection':
        if (!collectionId || !imageId) {
          return new Response(
            JSON.stringify({ error: 'Collection ID and Image ID are required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        const { error: removeError } = await supabase
          .from('image_collection_items')
          .delete()
          .eq('collection_id', collectionId)
          .eq('image_id', imageId)
          .eq('user_id', user.id);

        if (removeError) {
          console.error('Remove from collection error:', removeError);
          return new Response(
            JSON.stringify({ 
              error: 'Failed to remove image from collection', 
              details: removeError.message 
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        result = { success: true };
        break;

      case 'get_collections':
        const { data: collections, error: getError } = await supabase
          .from('image_collections')
          .select(`
            *,
            image_collection_items(count)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (getError) {
          console.error('Get collections error:', getError);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch collections', details: getError.message }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        result = { collections };
        break;

      case 'get_collection_images':
        if (!collectionId) {
          return new Response(
            JSON.stringify({ error: 'Collection ID is required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        const { data: collectionImages, error: getImagesError } = await supabase
          .from('image_collection_items')
          .select(`
            *,
            generated_images(*)
          `)
          .eq('collection_id', collectionId)
          .eq('user_id', user.id)
          .order('added_at', { ascending: false });

        if (getImagesError) {
          console.error('Get collection images error:', getImagesError);
          return new Response(
            JSON.stringify({ 
              error: 'Failed to fetch collection images', 
              details: getImagesError.message 
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        result = { images: collectionImages };
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