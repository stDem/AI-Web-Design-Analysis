
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useScreenshotCapture = () => {
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);

  const captureScreenshot = async (websiteUrl: string) => {
    if (!websiteUrl) return;
    
    setIsCapturingScreenshot(true);
    try {
      console.log('Capturing screenshot for:', websiteUrl);
      
      const { data, error } = await supabase.functions.invoke('capture-screenshot', {
        body: { url: websiteUrl }
      });

      if (error) {
        console.error('Screenshot function error:', error);
        // Fallback to a demo service
        const fallbackUrl = `https://api.screenshotone.com/take?access_key=demo&url=${encodeURIComponent(websiteUrl)}&viewport_width=1200&viewport_height=800&device_scale_factor=1&format=png&full_page=false&block_ads=true&block_cookie_banners=true`;
        setScreenshotUrl(fallbackUrl);
      } else if (data?.screenshot_url) {
        setScreenshotUrl(data.screenshot_url);
        console.log('Screenshot captured successfully');
      } else {
        console.error('No screenshot URL in response');
        // Fallback
        const fallbackUrl = `https://via.placeholder.com/1200x800/f8f9fa/6c757d?text=Screenshot+of+${encodeURIComponent(websiteUrl.replace('https://', '').replace('http://', '').split('/')[0])}`;
        setScreenshotUrl(fallbackUrl);
      }
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      // Fallback
      const fallbackUrl = `https://via.placeholder.com/1200x800/f8f9fa/6c757d?text=Screenshot+Error`;
      setScreenshotUrl(fallbackUrl);
    } finally {
      setIsCapturingScreenshot(false);
    }
  };

  const clearScreenshot = () => {
    setScreenshotUrl('');
  };

  return {
    screenshotUrl,
    isCapturingScreenshot,
    captureScreenshot,
    clearScreenshot
  };
};
