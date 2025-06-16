import React from 'react';
import { Trophy, Star, AlertTriangle, CheckCircle, TrendingUp, Users, Shield, Zap, Code, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import InstagramShareableScore from './InstagramShareableScore';
import CompetitiveAnalysis from './CompetitiveAnalysis';
import CodeSuggestions from './CodeSuggestions';

interface AnalysisResultsProps {
  results: {
    score: number;
    comparison?: {
      competitors: Array<{
        name: string;
        score: number;
        url: string;
        category: string;
      }>;
      betterThan: number;
      position: string;
      category: string;
      suggestedAnalysis?: string;
    };
    categoryScores?: {
      ux: number;
      accessibility: number;
      performance: number;
      code: number;
    };
    issues: Array<{
      type: string;
      severity: 'high' | 'medium' | 'low';
      description: string;
      location?: string;
    }>;
    suggestions: string[];
    annotations?: Array<{
      x: number;
      y: number;
      note: string;
      type: 'improvement' | 'issue' | 'suggestion';
      element?: string;
    }>;
    codeSuggestions?: Array<{
      file: string;
      issue: string;
      type: 'performance' | 'accessibility' | 'maintainability' | 'security';
      before: string;
      after: string;
      explanation: string;
    }>;
  };
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ux': return <Users className="h-5 w-5 text-blue-600" />;
      case 'accessibility': return <Shield className="h-5 w-5 text-green-600" />;
      case 'performance': return <Zap className="h-5 w-5 text-yellow-600" />;
      case 'code': return <Code className="h-5 w-5 text-purple-600" />;
      default: return <Star className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-8" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
      {/* Header with Overall Score */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 hand-drawn-line">
          ANALYSIS COMPLETE!
        </h2>
        
        {/* Instagram Shareable Score Card */}
        <div className="mb-8">
          <InstagramShareableScore 
            score={results.score} 
            categoryScores={results.categoryScores}
            websiteUrl={window.location.href}
          />
        </div>
      </div>

      {/* Category Breakdown */}
      {results.categoryScores && (
        <div className="sketch-card p-6 doodle-decoration">
          <h3 className="flex items-center space-x-2 text-xl font-bold mb-6">
            <BarChart3 className="h-5 w-5" />
            <span>CATEGORY BREAKDOWN</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(results.categoryScores).map(([category, score]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(category)}
                    <span className="font-medium capitalize">{category === 'ux' ? 'User Experience' : category}</span>
                  </div>
                  <span className={`font-bold ${getScoreColor(score)}`}>{score}/100</span>
                </div>
                <div className="sketch-progress-bar h-3">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issues and Suggestions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Issues */}
        <div className="sketch-card p-6 doodle-decoration">
          <h3 className="flex items-center space-x-2 text-lg font-bold mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>ISSUES FOUND ({results.issues.length})</span>
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {results.issues.map((issue, index) => (
              <div key={index} className="sketch-border bg-red-50 p-3">
                <div className="flex items-start space-x-2">
                  {getSeverityIcon(issue.severity)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{issue.description}</p>
                    {issue.location && (
                      <p className="text-xs text-gray-500 mt-1">Location: {issue.location}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="sketch-card p-6 doodle-decoration">
          <h3 className="flex items-center space-x-2 text-lg font-bold mb-4">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span>SUGGESTIONS ({results.suggestions.length})</span>
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {results.suggestions.map((suggestion, index) => (
              <div key={index} className="sketch-border bg-green-50 p-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Competitive Analysis */}
      {results.comparison && (
        <CompetitiveAnalysis comparison={results.comparison} />
      )}

      {/* Code Suggestions */}
      {results.codeSuggestions && results.codeSuggestions.length > 0 && (
        <CodeSuggestions codeSuggestions={results.codeSuggestions} />
      )}
    </div>
  );
};

export default AnalysisResults;
