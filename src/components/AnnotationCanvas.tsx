
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Plus, RefreshCw, ExternalLink, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useScreenshotCapture } from '@/hooks/useScreenshotCapture';
import AnnotationOverlay from './AnnotationOverlay';
import WebsiteViewer from './WebsiteViewer';
import AnnotationLegend from './AnnotationLegend';

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
  const canvasRef = useRef<HTMLDivElement>(null);
  const { screenshotUrl, isCapturingScreenshot, captureScreenshot, clearScreenshot } = useScreenshotCapture();

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
      clearScreenshot();
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  }, [websiteUrl]);

  // Auto-capture screenshot when iframe fails or when component mounts with a URL
  useEffect(() => {
    if (websiteUrl && !screenshotUrl && !isLoading) {
      // Try iframe first, but also prepare screenshot as backup
      setTimeout(() => {
        captureScreenshot(websiteUrl);
      }, 3000);
    }
  }, [websiteUrl, isLoading]);

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

  const handleEditStart = (id: string, note: string) => {
    setEditingId(id);
    setNewNote(note);
  };

  const handleEditSave = () => {
    setAnnotations(annotations.map(ann => 
      ann.id === editingId ? { ...ann, note: newNote } : ann
    ));
    setEditingId(null);
    setNewNote('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setNewNote('');
  };

  const handleDelete = (id: string) => {
    setAnnotations(annotations.filter(ann => ann.id !== id));
  };

  const handleCaptureScreenshot = () => {
    if (websiteUrl) {
      captureScreenshot(websiteUrl);
    }
  };

  const handleRefreshWebsite = () => {
    if (websiteUrl) {
      setIsLoading(true);
      clearScreenshot();
      
      // Also capture a fresh screenshot
      setTimeout(() => {
        captureScreenshot(websiteUrl);
        setIsLoading(false);
      }, 3000);
    }
  };

  const handleOpenInNewTab = () => {
    if (websiteUrl) {
      window.open(websiteUrl, '_blank');
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-2 border-dashed border-gray-300 transform md:-rotate-1"
          style={{ 
            boxShadow: '4px 4px 8px rgba(0,0,0,0.1)',
            fontFamily: '"Comic Sans MS", cursive'
          }}>
      <CardHeader className="p-3 md:p-6">
        <CardTitle className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
            <span className="text-sm md:text-base">Design Annotations</span>
            {annotations.length > 0 && (
              <span className="text-xs md:text-sm text-gray-500">({annotations.length} notes)</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={isAddingAnnotation ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAddingAnnotation(!isAddingAnnotation)}
              className={`${isAddingAnnotation ? "bg-purple-600 text-white border-2 border-dashed" : "border-2 border-dashed border-gray-400"} text-xs md:text-sm px-2 md:px-3 py-1 md:py-2`}
            >
              <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Add Note
            </Button>
            {websiteUrl && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCaptureScreenshot} 
                  disabled={isCapturingScreenshot}
                  className="border-2 border-dashed border-gray-400 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
                >
                  <Camera className={`h-3 w-3 md:h-4 md:w-4 ${isCapturingScreenshot ? 'animate-pulse' : ''}`} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefreshWebsite} 
                  disabled={isLoading} 
                  className="border-2 border-dashed border-gray-400 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
                >
                  <RefreshCw className={`h-3 w-3 md:h-4 md:w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleOpenInNewTab}
                  className="border-2 border-dashed border-gray-400 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
                >
                  <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-6">
        <div className="space-y-3 md:space-y-4">
          {/* Website View with Annotations */}
          <div
            ref={canvasRef}
            className={`relative bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 ${
              isAddingAnnotation ? 'cursor-crosshair' : 'cursor-default'
            }`}
            onClick={handleCanvasClick}
            style={{ minHeight: '400px', height: '400px' }}
          >
            <WebsiteViewer
              websiteUrl={websiteUrl}
              screenshotUrl={screenshotUrl}
              isLoading={isLoading}
              isCapturingScreenshot={isCapturingScreenshot}
              onIframeLoad={() => setIsLoading(false)}
              onIframeError={() => setIsLoading(false)}
              onCaptureScreenshot={handleCaptureScreenshot}
              onCanvasClick={handleCanvasClick}
              isAddingAnnotation={isAddingAnnotation}
            />

            <AnnotationOverlay
              annotations={annotations}
              editingId={editingId}
              newNote={newNote}
              onEditStart={handleEditStart}
              onEditSave={handleEditSave}
              onEditCancel={handleEditCancel}
              onDelete={handleDelete}
              onNoteChange={setNewNote}
            />
          </div>

          <AnnotationLegend
            annotations={annotations}
            websiteUrl={websiteUrl}
            screenshotUrl={screenshotUrl}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnotationCanvas;
