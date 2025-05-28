
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Plus, Edit3, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Annotation {
  id: string;
  x: number;
  y: number;
  note: string;
  type: 'improvement' | 'issue' | 'suggestion';
}

interface AnnotationCanvasProps {
  imageUrl: string;
}

const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({ imageUrl }) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: '1',
      x: 200,
      y: 150,
      note: 'Improve color contrast for better accessibility',
      type: 'issue'
    },
    {
      id: '2',
      x: 400,
      y: 300,
      note: 'Consider adding more whitespace around this button',
      type: 'suggestion'
    }
  ]);
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);

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

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Design Annotations</span>
          </div>
          <Button
            variant={isAddingAnnotation ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAddingAnnotation(!isAddingAnnotation)}
            className={isAddingAnnotation ? "bg-purple-600 text-white" : ""}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            ref={canvasRef}
            className={`relative bg-gray-100 rounded-lg overflow-hidden ${
              isAddingAnnotation ? 'cursor-crosshair' : 'cursor-default'
            }`}
            onClick={handleCanvasClick}
            style={{ minHeight: '400px' }}
          >
            {/* Placeholder for the actual design/image */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Design will appear here</p>
                <p className="text-sm text-gray-500">Click "Add Note" then click on areas to annotate</p>
              </div>
            </div>

            {/* Annotations */}
            {annotations.map((annotation) => (
              <div
                key={annotation.id}
                className="absolute"
                style={{ left: annotation.x, top: annotation.y }}
              >
                {/* Annotation marker */}
                <div className={`w-6 h-6 rounded-full ${getAnnotationColor(annotation.type)} flex items-center justify-center text-white text-xs font-bold shadow-lg cursor-pointer`}>
                  {annotations.indexOf(annotation) + 1}
                </div>
                
                {/* Annotation popup */}
                <div className="absolute top-8 left-0 bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-48 z-10">
                  {editingId === annotation.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Enter your note..."
                        className="text-sm"
                        rows={2}
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
                      <p className="text-sm text-gray-700 mb-2">{annotation.note}</p>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingId(annotation.id);
                            setNewNote(annotation.note);
                          }}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAnnotation(annotation.id)}
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

          {/* Annotation Legend */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Issues</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Suggestions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Improvements</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnotationCanvas;
