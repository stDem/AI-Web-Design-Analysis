
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, MousePointer, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';

interface Annotation {
  x: number;
  y: number;
  content: string;
  type: 'improvement' | 'issue' | 'good';
}

interface WebsiteViewerProps {
  url: string;
  annotations: Annotation[];
}

const WebsiteViewer: React.FC<WebsiteViewerProps> = ({ url, annotations }) => {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [selectedAnnotation, setSelectedAnnotation] = useState<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getAnnotationIcon = (type: string) => {
    switch (type) {
      case 'improvement': return <Lightbulb className="h-3 w-3" />;
      case 'issue': return <AlertTriangle className="h-3 w-3" />;
      case 'good': return <CheckCircle className="h-3 w-3" />;
      default: return <MousePointer className="h-3 w-3" />;
    }
  };

  const getAnnotationColor = (type: string) => {
    switch (type) {
      case 'improvement': return 'bg-blue-500 hover:bg-blue-600';
      case 'issue': return 'bg-red-500 hover:bg-red-600';
      case 'good': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'improvement': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'issue': return 'bg-red-100 text-red-800 border-red-200';
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 transform -rotate-1"
          style={{ 
            boxShadow: '4px 4px 8px rgba(0,0,0,0.1)',
            fontFamily: '"Comic Sans MS", cursive'
          }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-blue-500" />
            <span>Live Website Preview</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnnotations(!showAnnotations)}
            className="border-2 border-dashed border-gray-400"
          >
            {showAnnotations ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Notes
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Notes
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Website iframe */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white">
            <iframe
              ref={iframeRef}
              src={url}
              className="w-full h-96 border-0"
              title="Website Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>

          {/* Annotations overlay */}
          {showAnnotations && (
            <div className="absolute inset-0 pointer-events-none">
              {annotations.map((annotation, index) => (
                <div key={index} className="absolute">
                  <button
                    className={`w-6 h-6 rounded-full ${getAnnotationColor(annotation.type)} text-white flex items-center justify-center text-xs font-bold pointer-events-auto shadow-lg border-2 border-white transition-all duration-200 hover:scale-110`}
                    style={{
                      left: `${annotation.x}px`,
                      top: `${annotation.y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => setSelectedAnnotation(selectedAnnotation === index ? null : index)}
                  >
                    {index + 1}
                  </button>
                  
                  {/* Annotation popup */}
                  {selectedAnnotation === index && (
                    <div 
                      className="absolute z-10 bg-white border-2 border-dashed border-gray-300 rounded-lg p-3 shadow-lg max-w-xs pointer-events-auto"
                      style={{
                        left: `${annotation.x + 20}px`,
                        top: `${annotation.y - 10}px`,
                        fontFamily: '"Comic Sans MS", cursive'
                      }}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        {getAnnotationIcon(annotation.type)}
                        <Badge variant="outline" className={`${getBadgeColor(annotation.type)} border-2 border-dashed text-xs`}>
                          {annotation.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{annotation.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Annotations list */}
        {showAnnotations && annotations.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Improvement Notes:</h4>
            {annotations.map((annotation, index) => (
              <div 
                key={index}
                className={`flex items-start space-x-3 p-2 rounded border-2 border-dashed cursor-pointer transition-all duration-200 ${
                  selectedAnnotation === index 
                    ? 'bg-blue-50 border-blue-300' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedAnnotation(selectedAnnotation === index ? null : index)}
              >
                <div className={`w-5 h-5 rounded-full ${getAnnotationColor(annotation.type)} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getAnnotationIcon(annotation.type)}
                    <Badge variant="outline" className={`${getBadgeColor(annotation.type)} border border-dashed text-xs`}>
                      {annotation.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{annotation.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebsiteViewer;
