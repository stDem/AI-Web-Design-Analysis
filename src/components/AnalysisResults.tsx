import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, Code, Accessibility, Zap, ChevronDown, ChevronUp, Copy, Check, Edit, Trophy, Share2, Users, Target, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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

interface AnalysisResultsProps {
  results: {
    score: number;
    comparison?: {
      competitors: Array<{ name: string; score: number; category: string }>;
      betterThan: number;
      position: string;
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
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());
  const [editingCode, setEditingCode] = useState<{ issueIndex: number; code: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('');

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'performance': return 'bg-yellow-100 text-yellow-800';
      case 'accessibility': return 'bg-purple-100 text-purple-800';
      case 'maintainability': return 'bg-blue-100 text-blue-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Combine issues with suggestions and code improvements
  const issuesWithSuggestions: IssueWithSuggestion[] = results.issues.map((issue, index) => ({
    ...issue,
    suggestion: results.suggestions[index] || `Consider addressing this ${issue.type} issue to improve overall quality.`,
    codeSuggestion: results.codeSuggestions?.[index]
  }));

  // Chart data for the design score
  const chartData = [
    { name: 'Score', value: results.score, fill: '#8b5cf6' },
    { name: 'Remaining', value: 100 - results.score, fill: '#e5e7eb' }
  ];

  const categoryScores = {
    ux: 78,
    accessibility: 85,
    performance: 72,
    code: 81
  };

  const competitorData = {
    'Airbnb': { ux: 85, accessibility: 87, performance: 88, code: 89 },
    'Stripe': { ux: 82, accessibility: 89, performance: 93, code: 88 },
    'Shopify': { ux: 79, accessibility: 84, performance: 86, code: 84 },
    'Figma': { ux: 88, accessibility: 85, performance: 90, code: 86 },
    'Microsoft': { ux: 80, accessibility: 92, performance: 85, code: 87 },
    'BBC': { ux: 76, accessibility: 89, performance: 82, code: 85 },
    'Gov.uk': { ux: 75, accessibility: 91, performance: 84, code: 86 },
    'Apple': { ux: 84, accessibility: 87, performance: 89, code: 88 },
    'Google': { ux: 81, accessibility: 86, performance: 95, code: 90 },
    'Cloudflare': { ux: 78, accessibility: 85, performance: 93, code: 89 },
    'Amazon': { ux: 79, accessibility: 84, performance: 88, code: 87 },
    'Netflix': { ux: 83, accessibility: 83, performance: 90, code: 86 },
    'GitHub': { ux: 82, accessibility: 88, performance: 87, code: 89 },
    'Linear': { ux: 85, accessibility: 86, performance: 88, code: 86 },
    'Vercel': { ux: 80, accessibility: 87, performance: 89, code: 88 },
    'Notion': { ux: 86, accessibility: 82, performance: 84, code: 84 }
  };

  const categoryData = [
    {
      id: 'ux',
      label: 'User Experience',
      score: categoryScores.ux,
      icon: Users,
      color: 'blue',
      issues: issuesWithSuggestions.filter(issue => issue.type === 'ux')
    },
    {
      id: 'accessibility',
      label: 'Accessibility',
      score: categoryScores.accessibility,
      icon: Accessibility,
      color: 'purple',
      issues: issuesWithSuggestions.filter(issue => issue.type === 'accessibility')
    },
    {
      id: 'performance',
      label: 'Performance',
      score: categoryScores.performance,
      icon: Zap,
      color: 'yellow',
      issues: issuesWithSuggestions.filter(issue => issue.type === 'performance')
    },
    {
      id: 'code',
      label: 'Code Quality',
      score: categoryScores.code,
      icon: Code,
      color: 'green',
      issues: issuesWithSuggestions.filter(issue => issue.type === 'code')
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

  const getCompetitorScore = (categoryId: string) => {
    if (!selectedCompetitor || !competitorData[selectedCompetitor as keyof typeof competitorData]) return null;
    return competitorData[selectedCompetitor as keyof typeof competitorData][categoryId as keyof typeof competitorData[keyof typeof competitorData]];
  };

  const filteredIssues = selectedCategory 
    ? categoryData.find(cat => cat.id === selectedCategory)?.issues || []
    : issuesWithSuggestions;

  const toggleIssueExpansion = (index: number) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedIssues(newExpanded);
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

  const handleApplyCode = (issueIndex: number) => {
    console.log(`Applied code suggestion for issue ${issueIndex}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'UX Ray Analysis Results',
        text: `My website scored ${results.score}/100 in UX analysis! Better than ${results.comparison?.betterThan}% of websites.`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleCompetitorSelect = (categoryId: string, competitorName: string) => {
    setSelectedCompetitor(prev => ({
      ...prev,
      [categoryId]: competitorName
    }));
  };

  const getCompetitorData = (categoryId: string) => {
    const category = categoryData.find(cat => cat.id === categoryId);
    const competitorName = selectedCompetitor[categoryId];
    if (!category || !competitorName) return null;
    
    return category.competitors.find(comp => comp.name === competitorName);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Design Score with Chart and Comparison */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-3xl font-bold">Design Score</h3>
                <Button 
                  variant="outline" 
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              <p className="text-purple-100 mb-4">Overall design quality assessment with competitive analysis</p>
              <div className="text-5xl font-bold mb-2">{results.score}/100</div>
              <Progress value={results.score} className="w-64 h-3 mb-4" />
              
              {results.comparison && (
                <div className="bg-white/10 rounded-lg p-4 mt-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Trophy className="h-5 w-5 text-yellow-300" />
                    <span className="font-semibold">Competitive Analysis</span>
                  </div>
                  <p className="text-sm mb-4">
                    Your website scores better than <strong>{results.comparison.betterThan}%</strong> of analyzed websites
                  </p>
                  
                  {/* Centralized Competitor Selection */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-4 w-4" />
                      <span className="text-sm font-medium">Compare with competitor:</span>
                    </div>
                    <Select value={selectedCompetitor} onValueChange={setSelectedCompetitor}>
                      <SelectTrigger className="w-48 bg-white/20 border-white/30 text-white">
                        <SelectValue placeholder="Select competitor" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(competitorData).map((competitor) => (
                          <SelectItem key={competitor} value={competitor}>
                            {competitor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    {results.comparison.competitors.map((competitor, index) => (
                      <div key={index} className="bg-white/10 rounded p-2">
                        <div className="font-medium">{competitor.name}</div>
                        <div className="text-white/80">{competitor.score}/100</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

      {/* Interactive Category Score Boxes with Automatic Competitor Comparison */}
      <div className="grid md:grid-cols-4 gap-4">
        {categoryData.map((category) => {
          const IconComponent = category.icon;
          const competitorScore = getCompetitorScore(category.id);
          
          return (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''
              } ${getColorClasses(category.color, category.score)}`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              <CardContent className="p-4">
                <div className="text-center mb-3">
                  <IconComponent className="h-8 w-8 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">{category.label}</h4>
                  <p className="text-2xl font-bold mt-1">{category.score}%</p>
                  <div className="text-xs mt-2 opacity-75">
                    {category.issues.length} issues found
                  </div>
                </div>

                {/* Automatic Competitor Comparison */}
                {selectedCompetitor && competitorScore && (
                  <div className="bg-black/10 rounded p-2 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">vs {selectedCompetitor}</span>
                      <span className={`font-bold ${
                        category.score > competitorScore ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {category.score > competitorScore ? '+' : ''}
                        {category.score - competitorScore}%
                      </span>
                    </div>
                    {category.score > competitorScore ? (
                      <p className="text-green-600 font-medium text-[10px]">
                        🎉 You're performing better!
                      </p>
                    ) : (
                      <p className="text-red-600 font-medium text-[10px]">
                        📈 Room for improvement
                      </p>
                    )}
                  </div>
                )}
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

      {/* Issues with Paired Suggestions */}
      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Issues & Improvement Suggestions</span>
            <Badge variant="outline" className="ml-auto">
              {filteredIssues.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
          {filteredIssues.map((issue, index) => (
            <div key={index} className="border rounded-lg bg-white/50">
              {/* Issue Header */}
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center space-x-2 mt-0.5">
                    {getTypeIcon(issue.type)}
                    {getSeverityIcon(issue.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                        {issue.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {issue.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 font-medium mb-2">{issue.description}</p>
                    
                    {/* Improvement Suggestion */}
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-green-800">Improvement Suggestion</span>
                        </div>
                        {issue.codeSuggestion && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleIssueExpansion(index)}
                            className="text-green-700 hover:text-green-900"
                          >
                            <Code className="h-4 w-4 mr-1" />
                            {expandedIssues.has(index) ? (
                              <>Hide Code <ChevronUp className="h-4 w-4 ml-1" /></>
                            ) : (
                              <>Show Code <ChevronDown className="h-4 w-4 ml-1" /></>
                            )}
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-green-700 mt-2">{issue.suggestion}</p>
                    </div>

                    {/* Code Improvement (Collapsible) */}
                    {issue.codeSuggestion && (
                      <Collapsible open={expandedIssues.has(index)} onOpenChange={() => toggleIssueExpansion(index)}>
                        <CollapsibleContent>
                          <div className="mt-4 border-t pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className={getTypeColor(issue.codeSuggestion.type)}>
                                  {issue.codeSuggestion.type}
                                </Badge>
                                <span className="font-medium text-sm">{issue.codeSuggestion.file}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditCode(index, issue.codeSuggestion!.after)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleApplyCode(index)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Apply
                                </Button>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-3">
                              {/* Before Code */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="text-sm font-medium text-red-600">Before</label>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleCopyCode(issue.codeSuggestion!.before, index * 2)}
                                  >
                                    {copiedCode === index * 2 ? (
                                      <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                                <pre className="bg-red-50 border border-red-200 rounded p-3 text-sm overflow-x-auto">
                                  <code>{issue.codeSuggestion.before}</code>
                                </pre>
                              </div>

                              {/* After Code */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="text-sm font-medium text-green-600">After</label>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleCopyCode(
                                      editingCode?.issueIndex === index ? editingCode.code : issue.codeSuggestion!.after, 
                                      index * 2 + 1
                                    )}
                                  >
                                    {copiedCode === index * 2 + 1 ? (
                                      <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                                {editingCode?.issueIndex === index ? (
                                  <div className="space-y-2">
                                    <Textarea
                                      value={editingCode.code}
                                      onChange={(e) => setEditingCode({ ...editingCode, code: e.target.value })}
                                      className="font-mono text-sm min-h-[100px]"
                                    />
                                    <div className="flex space-x-2">
                                      <Button size="sm" onClick={handleSaveEdit}>
                                        Save Changes
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => setEditingCode(null)}>
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <pre className="bg-green-50 border border-green-200 rounded p-3 text-sm overflow-x-auto">
                                    <code>{issue.codeSuggestion.after}</code>
                                  </pre>
                                )}
                              </div>
                            </div>

                            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                              <p className="text-sm text-blue-800">
                                <strong>Explanation:</strong> {issue.codeSuggestion.explanation}
                              </p>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;
