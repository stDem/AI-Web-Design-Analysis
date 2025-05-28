
import React, { useState } from 'react';
import { Code, Copy, Check, Edit, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface CodeSuggestion {
  file: string;
  issue: string;
  before: string;
  after: string;
  explanation: string;
  type: 'performance' | 'accessibility' | 'maintainability' | 'security';
}

interface CodeSuggestionsProps {
  suggestions: CodeSuggestion[];
}

const CodeSuggestions: React.FC<CodeSuggestionsProps> = ({ suggestions }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedCode, setEditedCode] = useState('');
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<number>>(new Set());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'performance': return 'bg-yellow-100 text-yellow-800';
      case 'accessibility': return 'bg-purple-100 text-purple-800';
      case 'maintainability': return 'bg-blue-100 text-blue-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApplySuggestion = (index: number) => {
    setAppliedSuggestions(prev => new Set([...prev, index]));
    console.log(`Applied suggestion for ${suggestions[index].file}`);
  };

  const handleCopyCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleEditSuggestion = (index: number) => {
    setEditingIndex(index);
    setEditedCode(suggestions[index].after);
  };

  const handleSaveEdit = (index: number) => {
    console.log(`Saved edited code for ${suggestions[index].file}:`, editedCode);
    setEditingIndex(null);
    setEditedCode('');
  };

  const handleDownloadPatch = (suggestion: CodeSuggestion) => {
    const patch = `--- ${suggestion.file}\n+++ ${suggestion.file}\n@@ -1,3 +1,3 @@\n-${suggestion.before}\n+${suggestion.after}`;
    const blob = new Blob([patch], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${suggestion.file.replace('/', '_')}.patch`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Code className="h-5 w-5 text-blue-500" />
          <span>Code Improvement Suggestions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getTypeColor(suggestion.type)}>
                  {suggestion.type}
                </Badge>
                <span className="font-medium text-sm">{suggestion.file}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadPatch(suggestion)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditSuggestion(index)}
                  disabled={editingIndex === index}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApplySuggestion(index)}
                  disabled={appliedSuggestions.has(index)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {appliedSuggestions.has(index) ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    'Apply'
                  )}
                </Button>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-3">{suggestion.issue}</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Before Code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-red-600">Before</label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyCode(suggestion.before, index * 2)}
                  >
                    {copiedIndex === index * 2 ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <pre className="bg-red-50 border border-red-200 rounded p-3 text-sm overflow-x-auto">
                  <code>{suggestion.before}</code>
                </pre>
              </div>

              {/* After Code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-green-600">After</label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyCode(editingIndex === index ? editedCode : suggestion.after, index * 2 + 1)}
                  >
                    {copiedIndex === index * 2 + 1 ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {editingIndex === index ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editedCode}
                      onChange={(e) => setEditedCode(e.target.value)}
                      className="font-mono text-sm min-h-[100px]"
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleSaveEdit(index)}>
                        Save Changes
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingIndex(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <pre className="bg-green-50 border border-green-200 rounded p-3 text-sm overflow-x-auto">
                    <code>{suggestion.after}</code>
                  </pre>
                )}
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>Explanation:</strong> {suggestion.explanation}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CodeSuggestions;
