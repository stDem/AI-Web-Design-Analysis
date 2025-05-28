import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, Code, Accessibility, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CodeSuggestion {
  file: string;
  issue: string;
  before: string;
  after: string;
  explanation: string;
  type: 'performance' | 'accessibility' | 'maintainability' | 'security';
}

interface AnalysisResultsProps {
  results: {
    score: number;
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Design Score</h3>
              <p className="text-purple-100">Overall design quality assessment</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{results.score}/100</div>
              <Progress value={results.score} className="w-32 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Issues Found */}
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Issues Found</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.issues.map((issue, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border bg-white/50">
                <div className="flex items-center space-x-2 mt-0.5">
                  {getTypeIcon(issue.type)}
                  {getSeverityIcon(issue.severity)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                      {issue.severity.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {issue.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{issue.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Improvement Suggestions */}
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>Improvement Suggestions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border bg-white/50">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{suggestion}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Categories */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <Accessibility className="h-8 w-8 mx-auto text-purple-600 mb-2" />
            <h4 className="font-semibold text-sm">Accessibility</h4>
            <p className="text-2xl font-bold text-purple-600 mt-1">85%</p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
            <h4 className="font-semibold text-sm">Performance</h4>
            <p className="text-2xl font-bold text-yellow-600 mt-1">72%</p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <h4 className="font-semibold text-sm">User Experience</h4>
            <p className="text-2xl font-bold text-blue-600 mt-1">78%</p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <Code className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <h4 className="font-semibold text-sm">Code Quality</h4>
            <p className="text-2xl font-bold text-green-600 mt-1">81%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisResults;
