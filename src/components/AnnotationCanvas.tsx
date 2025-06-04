
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Plus, Edit3, Trash2, ExternalLink, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

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
  const [currentUrl, setCurrentUrl] = useState(websiteUrl || '');
  const [viewMode, setViewMode] = useState<'website' | 'placeholder'>('website');
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    if (websiteUrl) {
      setCurrentUrl(websiteUrl);
      setViewMode('website');
    }
  }, [websiteUrl]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isAddingAnnotation) return;

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

  const loadWebsite = () => {
    if (!currentUrl) return;
    setIsLoading(true);
    setViewMode('website');
    
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const refreshWebsite = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const openInNewTab = () => {
    if (currentUrl) {
      window.open(currentUrl, '_blank');
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
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
              className={isAddingAnnotation ? "bg-purple-600 text-white" : ""}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Website URL Controls */}
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <Input
              placeholder="Enter website URL to view and annotate"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={loadWebsite} disabled={!currentUrl || isLoading}>
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Load'}
            </Button>
            {viewMode === 'website' && currentUrl && (
              <>
                <Button variant="outline" onClick={refreshWebsite} disabled={isLoading}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={openInNewTab}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Website View with Annotations */}
          <div
            ref={canvasRef}
            className={`relative bg-gray-100 rounded-lg overflow-hidden ${
              isAddingAnnotation ? 'cursor-crosshair' : 'cursor-default'
            }`}
            onClick={handleCanvasClick}
            style={{ minHeight: '600px', height: '600px' }}
          >
            {viewMode === 'website' && currentUrl ? (
              <>
                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 mx-auto text-gray-400 mb-2 animate-spin" />
                      <p className="text-gray-600">Loading website...</p>
                    </div>
                  </div>
                )}
                <iframe
                  ref={iframeRef}
                  src={currentUrl}
                  className="w-full h-full border-0"
                  title="Website Preview"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    setViewMode('placeholder');
                  }}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Load a website to view and annotate</p>
                  <p className="text-sm text-gray-500">Enter a URL above and click "Load"</p>
                  <p className="text-sm text-gray-500 mt-2">Click "Add Note" then click on areas to annotate</p>
                </div>
              </div>
            )}

            {/* Annotations Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {annotations.map((annotation, index) => (
                <div
                  key={annotation.id || index}
                  className="absolute pointer-events-auto"
                  style={{ left: annotation.x, top: annotation.y }}
                >
                  {/* Annotation marker */}
                  <div className={`w-6 h-6 rounded-full ${getAnnotationColor(annotation.type)} flex items-center justify-center text-white text-xs font-bold shadow-lg cursor-pointer transform hover:scale-110 transition-transform`}>
                    {index + 1}
                  </div>
                  
                  {/* Annotation popup */}
                  <div className="absolute top-8 left-0 bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-64 z-10 max-w-sm">
                    {editingId === annotation.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Enter your note..."
                          className="text-sm"
                          rows={3}
                        />
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={saveAnnotation}>
                            Save
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
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
            
            {currentUrl && (
              <div className="text-xs text-gray-500 max-w-md truncate">
                Currently viewing: {currentUrl}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnotationCanvas;
