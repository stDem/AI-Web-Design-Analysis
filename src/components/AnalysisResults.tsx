
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ScoreCard from './ScoreCard';
import CategoryScoreGrid from './CategoryScoreGrid';
import IssueCard from './IssueCard';

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

interface CategoryScores {
  ux: number;
  code: number;
  performance: number;
  accessibility: number;
}

interface AnalysisResultsProps {
  results: {
    score: number;
    comparison?: {
      competitors: Array<{ 
        name: string; 
        score: number; 
        category: string;
        url?: string;
        description?: string;
      }>;
      betterThan: number;
      position: string;
      category: string;
      suggestedAnalysis?: Array<{
        name: string;
        url: string;
        reason: string;
        popularity: string;
      }>;
    };
    issues: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }>;
    suggestions: string[];
    codeSuggestions?: CodeSuggestion[];
  };
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCodeSuggestions, setExpandedCodeSuggestions] = useState<Set<number>>(new Set());
  const [editingCode, setEditingCode] = useState<{ issueIndex: number; code: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<number>>(new Set());
  const [analyzingCompetitor, setAnalyzingCompetitor] = useState<string | null>(null);
  const [competitorAnalysis, setCompetitorAnalysis] = useState<{[key: string]: CategoryScores}>({});

  // Combine issues with suggestions and code improvements
  const issuesWithSuggestions: IssueWithSuggestion[] = results.issues.map((issue, index) => ({
    ...issue,
    suggestion: results.suggestions[index] || `Consider addressing this ${issue.type} issue to improve overall quality.`,
    codeSuggestion: results.codeSuggestions?.[index]
  }));

  // Chart data for the main donut chart - reordered as requested
  const categoryScores: CategoryScores = {
    ux: 78,
    code: 81,
    performance: 72,
    accessibility: 85
  };

  // Reordered category data: User Experience, Code Quality, Performance, Accessibility with lighter colors
  const categoryData = [
    {
      id: 'ux' as keyof CategoryScores,
      label: 'User Experience',
      score: categoryScores.ux,
      issues: issuesWithSuggestions.filter(issue => issue.type === 'ux')
    },
    {
      id: 'code' as keyof CategoryScores,
      label: 'Code Quality',
      score: categoryScores.code,
      issues: issuesWithSuggestions.filter(issue => issue.type === 'code')
    },
    {
      id: 'performance' as keyof CategoryScores,
      label: 'Performance',
      score: categoryScores.performance,
      issues: issuesWithSuggestions.filter(issue => issue.type === 'performance')
    },
    {
      id: 'accessibility' as keyof CategoryScores,
      label: 'Accessibility',
      score: categoryScores.accessibility,
      issues: issuesWithSuggestions.filter(issue => issue.type === 'accessibility')
    }
  ];

  const filteredIssues = selectedCategory 
    ? categoryData.find(cat => cat.id === selectedCategory)?.issues || []
    : issuesWithSuggestions;

  const handleAnalyzeCompetitor = async (competitorName: string, competitorUrl?: string) => {
    setAnalyzingCompetitor(competitorName);
    
    // Simulate competitor analysis with realistic category scores
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysis: CategoryScores = {
      ux: Math.floor(Math.random() * 30) + 70,
      code: Math.floor(Math.random() * 30) + 65,
      performance: Math.floor(Math.random() * 30) + 60,
      accessibility: Math.floor(Math.random() * 30) + 75
    };
    
    setCompetitorAnalysis(prev => ({
      ...prev,
      [competitorName]: analysis
    }));
    
    setAnalyzingCompetitor(null);
  };

  const toggleCodeSuggestion = (index: number) => {
    const newExpanded = new Set(expandedCodeSuggestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCodeSuggestions(newExpanded);
  };

  const handleCopyCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(index);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleEditCode = (issueIndex: number, code: string) => {
    setEditingCode({ issueIndex, code });
  };

  const handleSaveEdit = () => {
    if (editingCode) {
      console.log(`Saved edited code for issue ${editingCode.issueIndex}:`, editingCode.code);
      setEditingCode(null);
    }
  };

  const handleApplyCodeSuggestion = (index: number) => {
    setAppliedSuggestions(prev => new Set([...prev, index]));
    console.log(`Applied code suggestion for issue ${index}`);
  };

  return (
    <div className="space-y-6">
      <ScoreCard 
        score={results.score}
        comparison={results.comparison}
        competitorAnalysis={competitorAnalysis}
        onAnalyzeCompetitor={handleAnalyzeCompetitor}
        analyzingCompetitor={analyzingCompetitor}
      />

      <CategoryScoreGrid 
        categoryScores={categoryScores}
        issuesWithSuggestions={issuesWithSuggestions}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        competitorAnalysis={competitorAnalysis}
      />

      {/* Enhanced Issues with Collapsible Code Suggestions */}
      <Card className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 transform rotate-1"
            style={{ 
              boxShadow: '4px 4px 8px rgba(0,0,0,0.1)',
              fontFamily: '"Comic Sans MS", cursive'
            }}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Issues & Improvement Suggestions</span>
            <Badge variant="outline" className="ml-auto border-2 border-dashed border-gray-400">
              {filteredIssues.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
          {filteredIssues.map((issue, index) => (
            <IssueCard
              key={index}
              issue={issue}
              index={index}
              expandedCodeSuggestions={expandedCodeSuggestions}
              onToggleCodeSuggestion={toggleCodeSuggestion}
              copiedCode={copiedCode}
              onCopyCode={handleCopyCode}
              editingCode={editingCode}
              onEditCode={handleEditCode}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={() => setEditingCode(null)}
              appliedSuggestions={appliedSuggestions}
              onApplyCodeSuggestion={handleApplyCodeSuggestion}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;
