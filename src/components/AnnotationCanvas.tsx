
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Plus, Edit3, Trash2, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Annotation {
  id?: string;
  x: number;
  y: number;
  note: string;
  type: 'improvement' | 'issue' | 'suggestion';
  element?: string;
}

interface AnnotationCanvasProps {
  imageUrl?: string;
  websiteUrl?: string;
  annotations?: Annotation[];
}

const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({ 
  imageUrl, 
  websiteUrl, 
  annotations: initialAnnotations = []
}) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load annotations from props when they change
  useEffect(() => {
    if (initialAnnotations && initialAnnotations.length > 0) {
      const annotationsWithIds = initialAnnotations.map((ann, index) => ({
        ...ann,
        id: ann.id || `annotation-${index}`
      }));
      setAnnotations(annotationsWithIds);
    }
  }, [initialAnnotations]);

  // Auto load website when websiteUrl is provided
  useEffect(() => {
    if (websiteUrl) {
      setIsLoading(true);
      setIframeError(false);
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  }, [websiteUrl]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isAddingAnnotation || iframeError) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      x,
      y,
      note: 'New annotation',
      type: 'improvement'
    };

    setAnnotations([...annotations, newAnnotation]);
    setEditingId(newAnnotation.id);
    setNewNote('New annotation');
    setIsAddingAnnotation(false);
  };

  const saveAnnotation = () => {
    setAnnotations(annotations.map(ann => 
      ann.id === editingId ? { ...ann, note: newNote } : ann
    ));
    setEditingId(null);
    setNewNote('');
  };

  const deleteAnnotation = (id: string) => {
    setAnnotations(annotations.filter(ann => ann.id !== id));
  };

  const getAnnotationColor = (type: string) => {
    switch (type) {
      case 'issue': return 'bg-red-500';
      case 'suggestion': return 'bg-blue-500';
      case 'improvement': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const refreshWebsite = () => {
    if (iframeRef.current && websiteUrl) {
      setIsLoading(true);
      setIframeError(false);
      // Add timestamp to bypass cache
      const urlWithTimestamp = websiteUrl.includes('?') 
        ? `${websiteUrl}&_t=${Date.now()}` 
        : `${websiteUrl}?_t=${Date.now()}`;
      iframeRef.current.src = urlWithTimestamp;
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  const openInNewTab = () => {
    if (websiteUrl) {
      window.open(websiteUrl, '_blank');
    }
  };

  const handleIframeError = () => {
    console.log('Iframe failed to load:', websiteUrl);
    setIframeError(true);
    setIsLoading(false);
  };

  const handleIframeLoad = () => {
    console.log('Iframe loaded successfully:', websiteUrl);
    setIsLoading(false);
    setIframeError(false);
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-2 border-dashed border-gray-300 transform -rotate-1"
          style={{ 
            boxShadow: '4px 4px 8px rgba(0,0,0,0.1)',
            fontFamily: '"Comic Sans MS", cursive'
          }}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Design Annotations</span>
            {annotations.length > 0 && (
              <span className="text-sm text-gray-500">({annotations.length} notes)</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={isAddingAnnotation ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAddingAnnotation(!isAddingAnnotation)}
              className={isAddingAnnotation ? "bg-purple-600 text-white border-2 border-dashed" : "border-2 border-dashed border-gray-400"}
              disabled={iframeError && websiteUrl}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
            {websiteUrl && (
              <>
                <Button variant="outline" onClick={refreshWebsite} disabled={isLoading} 
                        className="border-2 border-dashed border-gray-400">
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
                <Button variant="outline" onClick={openInNewTab}
                        className="border-2 border-dashed border-gray-400">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Website View with Annotations */}
          <div
            ref={canvasRef}
            className={`relative bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 ${
              isAddingAnnotation && !iframeError ? 'cursor-crosshair' : 'cursor-default'
            }`}
            onClick={handleCanvasClick}
            style={{ minHeight: '600px', height: '600px' }}
          >
            {websiteUrl ? (
              <>
                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 mx-auto text-gray-400 mb-2 animate-spin" />
                      <p className="text-gray-600">Loading website...</p>
                    </div>
                  </div>
                )}
                
                {iframeError ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
                    <div className="text-center p-8 max-w-md">
                      <AlertTriangle className="h-16 w-16 mx-auto text-orange-500 mb-4" />
                      <h3 className="text-lg font-bold text-gray-800 mb-2">Cannot Display Website</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        This website cannot be displayed in a frame due to security restrictions.
                      </p>
                      <div className="space-y-2">
                        <Button onClick={openInNewTab} className="w-full border-2 border-dashed border-gray-400">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in New Tab
                        </Button>
                        <Button onClick={refreshWebsite} variant="outline" className="w-full border-2 border-dashed border-gray-400">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        You can still analyze this website - the results will be available even though we can't display it here.
                      </p>
                    </div>
                  </div>
                ) : (
                  <iframe
                    ref={iframeRef}
                    src={websiteUrl}
                    className="w-full h-full border-0"
                    title="Website Preview"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                  />
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">No website to display</p>
                  <p className="text-sm text-gray-500">Analyze a website URL to view it here</p>
                  <p className="text-sm text-gray-500 mt-2">Click "Add Note" then click on areas to annotate</p>
                </div>
              </div>
            )}

            {/* Annotations Overlay - only show if iframe is working or no website */}
            {(!websiteUrl || !iframeError) && (
              <div className="absolute inset-0 pointer-events-none">
                {annotations.map((annotation, index) => (
                  <div
                    key={annotation.id || index}
                    className="absolute pointer-events-auto"
                    style={{ left: annotation.x, top: annotation.y }}
                  >
                    {/* Annotation marker */}
                    <div className={`w-6 h-6 rounded-full ${getAnnotationColor(annotation.type)} flex items-center justify-center text-white text-xs font-bold shadow-lg cursor-pointer transform hover:scale-110 transition-transform border-2 border-white`}>
                      {index + 1}
                    </div>
                    
                    {/* Annotation popup */}
                    <div className="absolute top-8 left-0 bg-white rounded-lg shadow-xl border-2 border-dashed border-gray-300 p-3 min-w-64 z-10 max-w-sm">
                      {editingId === annotation.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Enter your note..."
                            className="text-sm border-2 border-dashed border-gray-300"
                            rows={3}
                          />
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={saveAnnotation}
                                    className="border-2 border-dashed border-gray-400">
                              Save
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setEditingId(null)}
                                    className="border-2 border-dashed border-gray-400">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className={`w-3 h-3 rounded-full ${getAnnotationColor(annotation.type)}`}></div>
                            <span className="text-xs font-medium text-gray-500 capitalize">
                              {annotation.type}
                            </span>
                            {annotation.element && (
                              <span className="text-xs text-gray-400">
                                • {annotation.element}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-3 leading-relaxed">{annotation.note}</p>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingId(annotation.id || '');
                                setNewNote(annotation.note);
                              }}
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAnnotation(annotation.id || '')}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Annotation Legend and Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Issues ({annotations.filter(a => a.type === 'issue').length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Suggestions ({annotations.filter(a => a.type === 'suggestion').length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Improvements ({annotations.filter(a => a.type === 'improvement').length})</span>
              </div>
            </div>
            
            {websiteUrl && (
              <div className="text-xs text-gray-500 max-w-md truncate">
                Currently viewing: {websiteUrl}
                {iframeError && <span className="text-orange-500 ml-2">(Display blocked)</span>}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnotationCanvas;
