
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, Code, Accessibility, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import CodeSuggestions from './CodeSuggestions';

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
  const [showCodeSuggestions, setShowCodeSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  // Chart data for the design score
  const chartData = [
    { name: 'Score', value: results.score, fill: '#8b5cf6' },
    { name: 'Remaining', value: 100 - results.score, fill: '#e5e7eb' }
  ];

  const categoryScores = {
    accessibility: 85,
    performance: 72,
    ux: 78,
    code: 81
  };

  const categoryData = [
    {
      id: 'accessibility',
      label: 'Accessibility',
      score: categoryScores.accessibility,
      icon: Accessibility,
      color: 'purple',
      issues: results.issues.filter(issue => issue.type === 'accessibility'),
      suggestions: results.suggestions.filter((_, index) => index % 4 === 0)
    },
    {
      id: 'performance',
      label: 'Performance',
      score: categoryScores.performance,
      icon: Zap,
      color: 'yellow',
      issues: results.issues.filter(issue => issue.type === 'performance'),
      suggestions: results.suggestions.filter((_, index) => index % 4 === 1)
    },
    {
      id: 'ux',
      label: 'User Experience',
      score: categoryScores.ux,
      icon: TrendingUp,
      color: 'blue',
      issues: results.issues.filter(issue => issue.type === 'ux'),
      suggestions: results.suggestions.filter((_, index) => index % 4 === 2)
    },
    {
      id: 'code',
      label: 'Code Quality',
      score: categoryScores.code,
      icon: Code,
      color: 'green',
      issues: results.issues.filter(issue => issue.type === 'code'),
      suggestions: results.suggestions.filter((_, index) => index % 4 === 3)
    }
  ];

  const getColorClasses = (color: string, score: number) => {
    const baseColors = {
      purple: score >= 80 ? 'bg-purple-600 text-white' : score >= 60 ? 'bg-purple-100 text-purple-800' : 'bg-purple-50 text-purple-600',
      yellow: score >= 80 ? 'bg-yellow-600 text-white' : score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-50 text-yellow-600',
      blue: score >= 80 ? 'bg-blue-600 text-white' : score >= 60 ? 'bg-blue-100 text-blue-800' : 'bg-blue-50 text-blue-600',
      green: score >= 80 ? 'bg-green-600 text-white' : score >= 60 ? 'bg-green-100 text-green-800' : 'bg-green-50 text-green-600'
    };
    return baseColors[color as keyof typeof baseColors];
  };

  const filteredIssues = selectedCategory 
    ? results.issues.filter(issue => issue.type === selectedCategory)
    : results.issues;

  const filteredSuggestions = selectedCategory
    ? categoryData.find(cat => cat.id === selectedCategory)?.suggestions || []
    : results.suggestions;

  return (
    <div className="space-y-6">
      {/* Enhanced Design Score with Chart */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-2">Design Score</h3>
              <p className="text-purple-100 mb-4">Overall design quality assessment</p>
              <div className="text-5xl font-bold mb-2">{results.score}/100</div>
              <Progress value={results.score} className="w-64 h-3" />
            </div>
            <div className="w-32 h-32">
              <ChartContainer
                config={{
                  score: { label: "Score", color: "#8b5cf6" }
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Category Score Boxes */}
      <div className="grid md:grid-cols-4 gap-4">
        {categoryData.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''
              } ${getColorClasses(category.color, category.score)}`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              <CardContent className="p-4 text-center">
                <IconComponent className="h-8 w-8 mx-auto mb-2" />
                <h4 className="font-semibold text-sm">{category.label}</h4>
                <p className="text-2xl font-bold mt-1">{category.score}%</p>
                <div className="text-xs mt-2 opacity-75">
                  {category.issues.length} issues • {category.suggestions.length} suggestions
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedCategory && (
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Showing results for: <strong>{categoryData.find(cat => cat.id === selectedCategory)?.label}</strong>
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)} className="ml-2">
              Show All
            </Button>
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Issues Found */}
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Issues Found</span>
              <Badge variant="outline" className="ml-auto">
                {filteredIssues.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {filteredIssues.map((issue, index) => (
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
              <Badge variant="outline" className="ml-auto">
                {filteredSuggestions.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border bg-white/50">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{suggestion}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Code Improvement Suggestions - Collapsible */}
      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-blue-500" />
              <span>Code Improvement Suggestions</span>
              <Badge variant="outline">
                {results.codeSuggestions?.length || 0}
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCodeSuggestions(!showCodeSuggestions)}
              className="flex items-center space-x-2"
            >
              <span>{showCodeSuggestions ? 'Hide' : 'Show'}</span>
              {showCodeSuggestions ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        {showCodeSuggestions && results.codeSuggestions && (
          <CardContent>
            <CodeSuggestions suggestions={results.codeSuggestions} />
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AnalysisResults;
