import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, Code, Accessibility, Zap, ChevronDown, ChevronUp, Copy, Check, Edit, Trophy, Share2, Users, Target, Sparkles, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import CompetitiveAnalysis from './CompetitiveAnalysis';

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
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());
  const [expandedCodeSuggestions, setExpandedCodeSuggestions] = useState<Set<number>>(new Set());
  const [editingCode, setEditingCode] = useState<{ issueIndex: number; code: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('');
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<number>>(new Set());

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

  // Chart data for the main donut chart - reordered as requested
  const categoryScores = {
    ux: 78,
    code: 81,
    performance: 72,
    accessibility: 85
  };

  const competitorData = {
    'Amazon AWS': { ux: 68, accessibility: 72, performance: 85, code: 78 },
    'Google Cloud': { ux: 71, accessibility: 76, performance: 88, code: 82 },
    'Microsoft Azure': { ux: 69, accessibility: 74, performance: 86, code: 80 },
    'Shopify': { ux: 79, accessibility: 84, performance: 86, code: 84 },
    'Stripe': { ux: 82, accessibility: 89, performance: 93, code: 88 },
    'Figma': { ux: 88, accessibility: 85, performance: 90, code: 86 }
  };

  // Reordered category data: User Experience, Code Quality, Performance, Accessibility with lighter colors
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
      id: 'code',
      label: 'Code Quality',
      score: categoryScores.code,
      icon: Code,
      color: 'green',
      issues: issuesWithSuggestions.filter(issue => issue.type === 'code')
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
      id: 'accessibility',
      label: 'Accessibility',
      score: categoryScores.accessibility,
      icon: Accessibility,
      color: 'purple',
      issues: issuesWithSuggestions.filter(issue => issue.type === 'accessibility')
    }
  ];

  const getColorClasses = (color: string, score: number) => {
    const baseColors = {
      purple: score >= 80 ? 'bg-purple-100 text-purple-800' : score >= 60 ? 'bg-purple-50 text-purple-600' : 'bg-purple-25 text-purple-500',
      yellow: score >= 80 ? 'bg-yellow-100 text-yellow-800' : score >= 60 ? 'bg-yellow-50 text-yellow-600' : 'bg-yellow-25 text-yellow-500',
      blue: score >= 80 ? 'bg-blue-100 text-blue-800' : score >= 60 ? 'bg-blue-50 text-blue-600' : 'bg-blue-25 text-blue-500',
      green: score >= 80 ? 'bg-green-100 text-green-800' : score >= 60 ? 'bg-green-50 text-green-600' : 'bg-green-25 text-green-500'
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

  const handleApplyCode = (issueIndex: number) => {
    console.log(`Applied code suggestion for issue ${issueIndex}`);
  };

  const handleApplyCodeSuggestion = (index: number) => {
    setAppliedSuggestions(prev => new Set([...prev, index]));
    console.log(`Applied code suggestion for issue ${index}`);
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

  return (
    <div className="space-y-6">
      {/* Enhanced Design Score with Bigger Main Donut Chart */}
      <Card className="bg-gradient-to-r from-gray-600 to-slate-700 text-white border-2 border-dashed border-gray-400 transform -rotate-1"
            style={{ 
              boxShadow: '6px 6px 12px rgba(0,0,0,0.15)',
              fontFamily: '"Comic Sans MS", "Marker Felt", cursive'
            }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-3xl font-bold" style={{ fontFamily: '"Marker Felt", "Comic Sans MS", cursive' }}>
                  Design Score
                </h3>
                <Button 
                  variant="outline" 
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 border-2 border-dashed"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              <div className="text-5xl font-bold mb-4">{results.score}/100</div>
            </div>
            
            {/* Main Donut Chart - Made Bigger */}
            <div className="w-96 h-80 bg-white/10 rounded-lg p-6 border-2 border-dashed border-white/20">
              <h4 className="text-xl font-semibold mb-4 text-center">Overall Score</h4>
              <ChartContainer
                config={{
                  score: { label: "Score", color: "#ffffff" }
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Score', value: results.score, fill: '#10b981' },
                        { name: 'Remaining', value: 100 - results.score, fill: '#374151' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      startAngle={90}
                      endAngle={450}
                      dataKey="value"
                    >
                    </Pie>
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length && payload[0].name === 'Score') {
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border">
                              <p className="font-medium text-gray-900">Your Score</p>
                              <p className="text-sm text-gray-600">{payload[0].value}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              {/* Score text overlay */}
              <div className="relative -mt-40 text-center pointer-events-none">
                <div className="text-4xl font-bold text-white">{results.score}%</div>
                <div className="text-base text-white/70">Overall Score</div>
              </div>
            </div>
          </div>
          
          {results.comparison && (
            <div className="bg-white/10 rounded-lg p-4 border-2 border-dashed border-white/20">
              <div className="flex items-center space-x-2 mb-3">
                <Trophy className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Competitive Analysis</span>
              </div>
              <p className="text-sm mb-4">
                Your website scores better than <strong>{results.comparison.betterThan}%</strong> of analyzed websites
              </p>
              
              {/* Competitor Score Cards */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-medium">Compare with competitors:</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(competitorData).map(([competitor, scores]) => {
                    const overallScore = Math.round((scores.ux + scores.accessibility + scores.performance + scores.code) / 4);
                    const isSelected = selectedCompetitor === competitor;
                    
                    return (
                      <button
                        key={competitor}
                        onClick={() => setSelectedCompetitor(isSelected ? '' : competitor)}
                        className={`p-3 rounded-lg text-left transition-all duration-200 border-2 border-dashed ${
                          isSelected 
                            ? 'bg-white/30 border-white/50 shadow-lg' 
                            : 'bg-white/10 border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <div className="font-medium text-sm">{competitor}</div>
                        <div className="text-lg font-bold">{overallScore}/100</div>
                        {results.score > overallScore ? (
                          <div className="text-xs text-green-300">
                            ✓ You're ahead
                          </div>
                        ) : (
                          <div className="text-xs text-red-300">
                            ↑ Room for improvement
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interactive Category Score Boxes with Much Lighter Colors */}
      <div className="grid md:grid-cols-4 gap-4">
        {categoryData.map((category) => {
          const IconComponent = category.icon;
          const competitorScore = getCompetitorScore(category.id);
          
          return (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 border-2 border-dashed ${
                selectedCategory === category.id ? 'ring-2 ring-blue-500' : 'border-gray-300'
              } ${getColorClasses(category.color, category.score)} transform hover:-rotate-1`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              style={{ 
                boxShadow: '4px 4px 8px rgba(0,0,0,0.1)',
                fontFamily: '"Comic Sans MS", cursive'
              }}
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
                  <div className="bg-black/10 rounded p-2 text-xs border border-dashed border-black/20">
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

      {/* Competitive Analysis Section - NEW */}
      {results.comparison && (
        <CompetitiveAnalysis 
          comparison={results.comparison} 
          currentScore={results.score}
        />
      )}

      {selectedCategory && (
        <div className="text-center p-2 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
          <p className="text-sm text-blue-700" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
            Showing results for: <strong>{categoryData.find(cat => cat.id === selectedCategory)?.label}</strong>
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)} className="ml-2">
              Show All
            </Button>
          </p>
        </div>
      )}

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
            <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg bg-white/70">
              {/* Issue Header */}
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
                    
                    {/* Improvement Suggestion */}
                    <div className="bg-green-50 border-2 border-dashed border-green-200 rounded p-3 mb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-green-800">Improvement Suggestion</span>
                        </div>
                      </div>
                      <p className="text-sm text-green-700 mt-2">{issue.suggestion}</p>
                    </div>

                    {/* Collapsible Code Suggestion if available */}
                    {issue.codeSuggestion && (
                      <Collapsible 
                        open={expandedCodeSuggestions.has(index)}
                        onOpenChange={() => toggleCodeSuggestion(index)}
                      >
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" className="w-full justify-between border-2 border-dashed border-gray-300 mb-2">
                            <div className="flex items-center space-x-2">
                              <Code className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium">Code Improvement</span>
                              <Badge variant="outline" className={`${getTypeColor(issue.codeSuggestion.type)} border-2 border-dashed text-xs`}>
                                {issue.codeSuggestion.type}
                              </Badge>
                            </div>
                            {expandedCodeSuggestions.has(index) ? 
                              <ChevronUp className="h-4 w-4" /> : 
                              <ChevronDown className="h-4 w-4" />
                            }
                          </Button>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="space-y-3">
                          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-800">File: {issue.codeSuggestion.file}</span>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyCode(issue.codeSuggestion!.after, index)}
                                >
                                  {copiedCode === index ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingCode({ issueIndex: index, code: issue.codeSuggestion!.after })}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleApplyCodeSuggestion(index)}
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
                            
                            <p className="text-sm text-gray-700 mb-3">{issue.codeSuggestion.explanation}</p>
                            
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs font-medium text-red-600 mb-1">Before:</p>
                                <code className="block bg-red-50 p-2 rounded text-xs border border-red-200">
                                  {issue.codeSuggestion.before}
                                </code>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-green-600 mb-1">After:</p>
                                {editingCode && editingCode.issueIndex === index ? (
                                  <div className="space-y-2">
                                    <Textarea
                                      value={editingCode.code}
                                      onChange={(e) => setEditingCode({ ...editingCode, code: e.target.value })}
                                      className="font-mono text-xs min-h-[100px] bg-green-50 border border-green-200"
                                    />
                                    <div className="flex space-x-2">
                                      <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700 text-white">
                                        Save Changes
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => setEditingCode(null)}>
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <code className="block bg-green-50 p-2 rounded text-xs border border-green-200">
                                    {issue.codeSuggestion.after}
                                  </code>
                                )}
                              </div>
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
