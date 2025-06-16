
import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, Camera, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WebsiteViewerProps {
  websiteUrl?: string;
  screenshotUrl: string;
  isLoading: boolean;
  isCapturingScreenshot: boolean;
  onIframeLoad: () => void;
  onIframeError: () => void;
  onCaptureScreenshot: () => void;
  onCanvasClick: (e: React.MouseEvent) => void;
  isAddingAnnotation: boolean;
}

const WebsiteViewer: React.FC<WebsiteViewerProps> = ({
  websiteUrl,
  screenshotUrl,
  isLoading,
  isCapturingScreenshot,
  onIframeLoad,
  onIframeError,
  onCaptureScreenshot,
  onCanvasClick,
  isAddingAnnotation
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeError, setIframeError] = useState(false);

  const handleIframeError = () => {
    console.log('Iframe failed to load:', websiteUrl);
    setIframeError(true);
    onIframeError();
    // Automatically capture screenshot when iframe fails
    setTimeout(() => {
      onCaptureScreenshot();
    }, 500);
  };

  const handleIframeLoad = () => {
    console.log('Iframe loaded successfully:', websiteUrl);
    setIframeError(false);
    onIframeLoad();
  };

  // Reset iframe error when URL changes
  useEffect(() => {
    if (websiteUrl) {
      setIframeError(false);
    }
  }, [websiteUrl]);

  if (!websiteUrl) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">No website to display</p>
          <p className="text-sm text-gray-500">Analyze a website URL to view it here</p>
          <p className="text-sm text-gray-500 mt-2">Click "Add Note" then click on areas to annotate</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && !screenshotUrl && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 mx-auto text-gray-400 mb-2 animate-spin" />
            <p className="text-gray-600">Loading website...</p>
          </div>
        </div>
      )}
      
      {screenshotUrl ? (
        // Display screenshot
        <div className="relative w-full h-full">
          <img 
            src={screenshotUrl} 
            alt="Website Screenshot" 
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              console.error('Screenshot failed to load');
              // Try alternative screenshot approach
              const fallbackUrl = `https://via.placeholder.com/1200x800/f8f9fa/6c757d?text=Screenshot+of+${encodeURIComponent(websiteUrl.replace('https://', '').replace('http://', '').split('/')[0])}`;
              (e.target as HTMLImageElement).src = fallbackUrl;
            }}
          />
          <div className="absolute top-4 right-4 bg-green-100 border border-green-300 rounded-lg px-3 py-2 text-xs text-green-700">
            Screenshot Mode - Click to annotate
          </div>
        </div>
      ) : isCapturingScreenshot ? (
        // Show capturing screenshot state
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <Camera className="h-16 w-16 mx-auto text-blue-500 mb-4 animate-pulse" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Capturing Screenshot</h3>
            <p className="text-sm text-gray-600 mb-4">
              Taking a screenshot for annotation...
            </p>
          </div>
        </div>
      ) : (
        // Try to show iframe, with error handling
        <>
          <iframe
            ref={iframeRef}
            src={websiteUrl}
            className="w-full h-full border-0"
            title="Website Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
          {iframeError && (
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
              <div className="text-center p-8 max-w-md">
                <AlertTriangle className="h-16 w-16 mx-auto text-orange-500 mb-4" />
                <h3 className="text-lg font-bold text-gray-800 mb-2">Taking Screenshot</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Website cannot be displayed in frame. Capturing screenshot for annotation...
                </p>
                <Button onClick={onCaptureScreenshot} className="w-full border-2 border-dashed border-gray-400" disabled={isCapturingScreenshot}>
                  <Camera className="h-4 w-4 mr-2" />
                  {isCapturingScreenshot ? 'Capturing...' : 'Retry Screenshot'}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default WebsiteViewer;
