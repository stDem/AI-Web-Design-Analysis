
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    console.log('Capturing screenshot for:', url);

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Use Screenshot API service (free tier available)
    const screenshotApiUrl = `https://shot.screenshotapi.net/screenshot`;
    
    const screenshotResponse = await fetch(screenshotApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        width: 1200,
        height: 800,
        output: 'image',
        file_type: 'png',
        wait_for_event: 'load',
        delay: 2000,
        fresh: true,
        full_page: false,
        mobile: false,
        retina: false
      })
    });

    if (!screenshotResponse.ok) {
      console.error('Screenshot API error:', await screenshotResponse.text());
      
      // Fallback to a different service or placeholder
      const fallbackUrl = `https://api.urlbox.io/v1/ca482d7e-9417-4569-90fe-80f7c5e1c781/png?url=${encodeURIComponent(url)}&width=1200&height=800&delay=2000`;
      
      return new Response(
        JSON.stringify({ 
          screenshot_url: fallbackUrl,
          success: true 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get the image data
    const imageBuffer = await screenshotResponse.arrayBuffer();
    
    // Convert to base64 for easier handling
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
    const dataUrl = `data:image/png;base64,${base64Image}`;

    console.log('Screenshot captured successfully');
    
    return new Response(
      JSON.stringify({ 
        screenshot_url: dataUrl,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    
    // Return a fallback screenshot service URL
    const { url } = await req.json().catch(() => ({ url: '' }));
    const fallbackUrl = url ? 
      `https://api.screenshotone.com/take?access_key=demo&url=${encodeURIComponent(url)}&viewport_width=1200&viewport_height=800&device_scale_factor=1&format=png&full_page=false&block_ads=true&block_cookie_banners=true` :
      '';
    
    return new Response(
      JSON.stringify({ 
        screenshot_url: fallbackUrl,
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
