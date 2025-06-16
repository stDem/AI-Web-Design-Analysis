
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

    // Use a free screenshot service that doesn't require API keys
    const screenshotUrl = `https://mini.s-shot.ru/1024x768/PNG/?${encodeURIComponent(url)}`;
    
    console.log('Using screenshot URL:', screenshotUrl);

    // Test if the screenshot service is working by making a request
    try {
      const testResponse = await fetch(screenshotUrl, { method: 'HEAD' });
      if (testResponse.ok) {
        return new Response(
          JSON.stringify({ 
            screenshot_url: screenshotUrl,
            success: true 
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    } catch (error) {
      console.log('Primary screenshot service failed, trying backup');
    }

    // Fallback to another free service
    const fallbackUrl = `https://image.thum.io/get/width/1200/crop/800/${encodeURIComponent(url)}`;
    
    return new Response(
      JSON.stringify({ 
        screenshot_url: fallbackUrl,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    
    // Return a placeholder screenshot as last resort
    const { url } = await req.json().catch(() => ({ url: '' }));
    const placeholderUrl = url ? 
      `https://via.placeholder.com/1200x800/f8f9fa/6c757d?text=Screenshot+of+${encodeURIComponent(url.replace('https://', '').replace('http://', '').split('/')[0])}` :
      'https://via.placeholder.com/1200x800/f8f9fa/6c757d?text=Screenshot+Error';
    
    return new Response(
      JSON.stringify({ 
        screenshot_url: placeholderUrl,
        success: false,
        error: error.message 
      }),
      {
        status: 200, // Return 200 so the app can still function
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
