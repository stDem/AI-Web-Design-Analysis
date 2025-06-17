
import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
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

interface AnnotationOverlayProps {
  annotations: Annotation[];
  editingId: string | null;
  newNote: string;
  onEditStart: (id: string, note: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onDelete: (id: string) => void;
  onNoteChange: (note: string) => void;
}

const getAnnotationColor = (type: string) => {
  switch (type) {
    case 'issue': return 'bg-red-500';
    case 'suggestion': return 'bg-blue-500';
    case 'improvement': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({
  annotations,
  editingId,
  newNote,
  onEditStart,
  onEditSave,
  onEditCancel,
  onDelete,
  onNoteChange
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {annotations.map((annotation, index) => (
        <div
          key={annotation.id || index}
          className="absolute pointer-events-auto"
          style={{ left: annotation.x, top: annotation.y }}
        >
          {/* Annotation marker */}
          <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full ${getAnnotationColor(annotation.type)} flex items-center justify-center text-white text-xs font-bold shadow-lg cursor-pointer transform hover:scale-110 transition-transform border-2 border-white`}>
            {index + 1}
          </div>
          
          {/* Annotation popup */}
          <div className="absolute top-6 md:top-8 left-0 bg-white rounded-lg shadow-xl border-2 border-dashed border-gray-300 p-2 md:p-3 min-w-48 md:min-w-64 z-10 max-w-xs md:max-w-sm">
            {editingId === annotation.id ? (
              <div className="space-y-2">
                <Textarea
                  value={newNote}
                  onChange={(e) => onNoteChange(e.target.value)}
                  placeholder="Enter your note..."
                  className="text-xs md:text-sm border-2 border-dashed border-gray-300"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={onEditSave}
                    className="border-2 border-dashed border-gray-400 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
                  >
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onEditCancel}
                    className="border-2 border-dashed border-gray-400 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${getAnnotationColor(annotation.type)}`}></div>
                  <span className="text-xs font-medium text-gray-500 capitalize">
                    {annotation.type}
                  </span>
                  {annotation.element && (
                    <span className="text-xs text-gray-400">
                      • {annotation.element}
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-gray-700 mb-2 md:mb-3 leading-relaxed break-words">{annotation.note}</p>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditStart(annotation.id || '', annotation.note)}
                    className="p-1 md:p-2"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(annotation.id || '')}
                    className="text-red-500 hover:text-red-700 p-1 md:p-2"
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
  );
};

export default AnnotationOverlay;
