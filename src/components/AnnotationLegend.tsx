
import React from 'react';

interface Annotation {
  id?: string;
  x: number;
  y: number;
  note: string;
  type: 'improvement' | 'issue' | 'suggestion';
  element?: string;
}

interface AnnotationLegendProps {
  annotations: Annotation[];
  websiteUrl?: string;
  screenshotUrl: string;
}

const AnnotationLegend: React.FC<AnnotationLegendProps> = ({ 
  annotations, 
  websiteUrl, 
  screenshotUrl 
}) => {
  return (
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
          {screenshotUrl && <span className="text-green-500 ml-2">(Screenshot mode)</span>}
        </div>
      )}
    </div>
  );
};

export default AnnotationLegend;
