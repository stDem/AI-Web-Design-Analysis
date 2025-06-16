
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Edit, Play, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface CodeSuggestion {
  file: string;
  issue: string;
  before: string;
  after: string;
  explanation: string;
  type: 'performance' | 'accessibility' | 'maintainability' | 'security';
}

interface CodeSuggestionSectionProps {
  codeSuggestion: CodeSuggestion;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  copiedCode: number | null;
  onCopyCode: (code: string, index: number) => void;
  editingCode: { issueIndex: number; code: string } | null;
  onEditCode: (issueIndex: number, code: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  appliedSuggestions: Set<number>;
  onApplyCodeSuggestion: (index: number) => void;
}

const CodeSuggestionSection: React.FC<CodeSuggestionSectionProps> = ({
  codeSuggestion,
  index,
  isExpanded,
  onToggle,
  copiedCode,
  onCopyCode,
  editingCode,
  onEditCode,
  onSaveEdit,
  onCancelEdit,
  appliedSuggestions,
  onApplyCodeSuggestion
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'performance': return 'bg-yellow-100 text-yellow-800';
      case 'accessibility': return 'bg-purple-100 text-purple-800';
      case 'maintainability': return 'bg-blue-100 text-blue-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between border-2 border-dashed border-gray-300 mb-2">
          <div className="flex items-center space-x-2">
            <Code className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Code Improvement</span>
            <Badge variant="outline" className={`${getTypeColor(codeSuggestion.type)} border-2 border-dashed text-xs`}>
              {codeSuggestion.type}
            </Badge>
          </div>
          {isExpanded ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
          }
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-3">
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-800">File: {codeSuggestion.file}</span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopyCode(codeSuggestion.after, index)}
              >
                {copiedCode === index ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditCode(index, codeSuggestion.after)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                onClick={() => onApplyCodeSuggestion(index)}
                disabled={appliedSuggestions.has(index)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {appliedSuggestions.has(index) ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Apply
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-3">{codeSuggestion.explanation}</p>
          
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-red-600 mb-1">Before:</p>
              <code className="block bg-red-50 p-2 rounded text-xs border border-red-200">
                {codeSuggestion.before}
              </code>
            </div>
            <div>
              <p className="text-xs font-medium text-green-600 mb-1">After:</p>
              {editingCode && editingCode.issueIndex === index ? (
                <div className="space-y-2">
                  <Textarea
                    value={editingCode.code}
                    onChange={(e) => onEditCode(index, e.target.value)}
                    className="font-mono text-xs min-h-[100px] bg-green-50 border border-green-200"
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={onSaveEdit} className="bg-green-600 hover:bg-green-700 text-white">
                      Save Changes
                    </Button>
                    <Button size="sm" variant="outline" onClick={onCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <code className="block bg-green-50 p-2 rounded text-xs border border-green-200">
                  {codeSuggestion.after}
                </code>
              )}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CodeSuggestionSection;
