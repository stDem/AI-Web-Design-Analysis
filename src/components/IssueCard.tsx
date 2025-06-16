
import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Accessibility, Zap, TrendingUp, Code } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CodeSuggestionSection from './CodeSuggestionSection';

interface CodeSuggestion {
  file: string;
  issue: string;
  before: string;
  after: string;
  explanation: string;
  type: 'performance' | 'accessibility' | 'maintainability' | 'security';
}

interface IssueWithSuggestion {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
  codeSuggestion?: CodeSuggestion;
}

interface IssueCardProps {
  issue: IssueWithSuggestion;
  index: number;
  expandedCodeSuggestions: Set<number>;
  onToggleCodeSuggestion: (index: number) => void;
  copiedCode: number | null;
  onCopyCode: (code: string, index: number) => void;
  editingCode: { issueIndex: number; code: string } | null;
  onEditCode: (issueIndex: number, code: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  appliedSuggestions: Set<number>;
  onApplyCodeSuggestion: (index: number) => void;
}

const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  index,
  expandedCodeSuggestions,
  onToggleCodeSuggestion,
  copiedCode,
  onCopyCode,
  editingCode,
  onEditCode,
  onSaveEdit,
  onCancelEdit,
  appliedSuggestions,
  onApplyCodeSuggestion
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'accessibility': return <Accessibility className="h-4 w-4" />;
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'ux': return <TrendingUp className="h-4 w-4" />;
      case 'code': return <Code className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white/70">
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex items-center space-x-2 mt-0.5">
            {getTypeIcon(issue.type)}
            {getSeverityIcon(issue.severity)}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className={`${getSeverityColor(issue.severity)} border-2 border-dashed`}>
                {issue.severity.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="capitalize border-2 border-dashed border-gray-300">
                {issue.type}
              </Badge>
            </div>
            <p className="text-sm text-gray-700 font-medium mb-2">{issue.description}</p>
            
            <div className="bg-green-50 border-2 border-dashed border-green-200 rounded p-3 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-800">Improvement Suggestion</span>
                </div>
              </div>
              <p className="text-sm text-green-700 mt-2">{issue.suggestion}</p>
            </div>

            {issue.codeSuggestion && (
              <CodeSuggestionSection
                codeSuggestion={issue.codeSuggestion}
                index={index}
                isExpanded={expandedCodeSuggestions.has(index)}
                onToggle={() => onToggleCodeSuggestion(index)}
                copiedCode={copiedCode}
                onCopyCode={onCopyCode}
                editingCode={editingCode}
                onEditCode={onEditCode}
                onSaveEdit={onSaveEdit}
                onCancelEdit={() => onCancelEdit()}
                appliedSuggestions={appliedSuggestions}
                onApplyCodeSuggestion={onApplyCodeSuggestion}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
