
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, MousePointer, Lightbulb, AlertTriangle, CheckCircle, Target } from 'lucide-react';

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
  const [hoveredAnnotation, setHoveredAnnotation] = useState<number | null>(null);
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
      case 'improvement': return 'bg-blue-500 hover:bg-blue-600 border-blue-300';
      case 'issue': return 'bg-red-500 hover:bg-red-600 border-red-300';
      case 'good': return 'bg-green-500 hover:bg-green-600 border-green-300';
      default: return 'bg-gray-500 hover:bg-gray-600 border-gray-300';
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

  const handleAnnotationClick = (index: number) => {
    setSelectedAnnotation(selectedAnnotation === index ? null : index);
  };

  const handleAnnotationHover = (index: number | null) => {
    setHoveredAnnotation(index);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-2 border-dashed border-purple-300 transform -rotate-1 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-dashed border-purple-200">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-purple-800">
            <Target className="h-5 w-5 text-purple-600" />
            <span className="font-bold">Website with Smart Annotations</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnnotations(!showAnnotations)}
            className="border-2 border-dashed border-purple-400 text-purple-700 hover:bg-purple-50"
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
        <p className="text-sm text-purple-600 mt-2">
          Click on the numbered annotations below to see specific improvement suggestions for each website section.
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative">
          {/* Website iframe with improved styling */}
          <div className="border-4 border-dashed border-purple-300 rounded-xl overflow-hidden bg-white shadow-inner">
            <div className="bg-purple-100 px-4 py-2 border-b-2 border-dashed border-purple-200">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="bg-white px-3 py-1 rounded-full text-xs text-gray-600 border border-purple-200">
                  {url}
                </div>
              </div>
            </div>
            <iframe
              ref={iframeRef}
              src={url}
              className="w-full h-96 border-0"
              title="Website Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>

          {/* Enhanced annotations overlay */}
          {showAnnotations && (
            <div className="absolute inset-0 top-12 pointer-events-none">
              {annotations.map((annotation, index) => (
                <div key={index} className="absolute">
                  {/* Annotation marker with enhanced styling */}
                  <button
                    className={`w-8 h-8 rounded-full ${getAnnotationColor(annotation.type)} text-white flex items-center justify-center text-sm font-bold pointer-events-auto shadow-lg border-4 border-white transition-all duration-300 hover:scale-125 hover:z-30 ${
                      selectedAnnotation === index ? 'scale-125 z-30 ring-4 ring-purple-300' : ''
                    } ${
                      hoveredAnnotation === index ? 'scale-110' : ''
                    }`}
                    style={{
                      left: `${annotation.x}px`,
                      top: `${annotation.y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => handleAnnotationClick(index)}
                    onMouseEnter={() => handleAnnotationHover(index)}
                    onMouseLeave={() => handleAnnotationHover(null)}
                  >
                    {index + 1}
                  </button>
                  
                  {/* Enhanced annotation popup with better positioning */}
                  {selectedAnnotation === index && (
                    <div 
                      className="absolute z-40 bg-white border-3 border-dashed border-purple-300 rounded-xl p-4 shadow-2xl max-w-sm pointer-events-auto backdrop-blur-sm bg-white/95"
                      style={{
                        left: `${annotation.x + 30}px`,
                        top: `${annotation.y - 20}px`,
                        transform: annotation.x > 300 ? 'translateX(-100%)' : 'translateX(0)'
                      }}
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <div className={`w-6 h-6 rounded-full ${getAnnotationColor(annotation.type)} text-white flex items-center justify-center text-sm font-bold`}>
                          {index + 1}
                        </div>
                        {getAnnotationIcon(annotation.type)}
                        <Badge variant="outline" className={`${getBadgeColor(annotation.type)} border-2 border-dashed text-xs font-semibold`}>
                          {annotation.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{annotation.content}</p>
                      <div className="absolute -left-2 top-6 w-4 h-4 bg-white border-l-3 border-b-3 border-dashed border-purple-300 transform rotate-45"></div>
                    </div>
                  )}

                  {/* Connection line to show which part of the website is being annotated */}
                  {selectedAnnotation === index && (
                    <div 
                      className="absolute z-20 pointer-events-none"
                      style={{
                        left: `${annotation.x}px`,
                        top: `${annotation.y}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="w-32 h-32 border-4 border-dashed border-purple-400 rounded-lg bg-purple-100/20 animate-pulse"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced annotations list */}
        {showAnnotations && annotations.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="text-lg font-bold text-purple-800 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Targeted Improvement Notes:
            </h4>
            {annotations.map((annotation, index) => (
              <div 
                key={index}
                className={`flex items-start space-x-4 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
                  selectedAnnotation === index 
                    ? 'bg-purple-50 border-purple-400 shadow-lg transform scale-105' 
                    : 'bg-gray-50 border-gray-300 hover:bg-purple-25 hover:border-purple-200 hover:shadow-md'
                }`}
                onClick={() => handleAnnotationClick(index)}
                onMouseEnter={() => handleAnnotationHover(index)}
                onMouseLeave={() => handleAnnotationHover(null)}
              >
                <div className={`w-8 h-8 rounded-full ${getAnnotationColor(annotation.type)} text-white flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-md`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getAnnotationIcon(annotation.type)}
                    <Badge variant="outline" className={`${getBadgeColor(annotation.type)} border-2 border-dashed text-xs font-semibold`}>
                      {annotation.type}
                    </Badge>
                    <span className="text-xs text-gray-500">Click to highlight on website</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{annotation.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 p-3 bg-purple-50 border-2 border-dashed border-purple-200 rounded-lg">
          <p className="text-xs text-purple-600 text-center">
            💡 These annotations are positioned to target specific sections of your website for maximum improvement impact
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteViewer;
