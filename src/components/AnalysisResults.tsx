import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, Code, Accessibility, Zap, ChevronDown, ChevronUp, Copy, Check, Edit, Trophy, Users, Target, Sparkles, Play, ExternalLink, BarChart3, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ShareableScoreCard from './ShareableScoreCard';

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
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());
  const [expandedCodeSuggestions, setExpandedCodeSuggestions] = useState<Set<number>>(new Set());
  const [editingCode, setEditingCode] = useState<{ issueIndex: number; code: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<number>>(new Set());
  const [analyzingCompetitor, setAnalyzingCompetitor] = useState<string | null>(null);
  const [competitorAnalysis, setCompetitorAnalysis] = useState<{[key: string]: CategoryScores}>({});

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
      icon: Users,
      color: 'blue',
      issues: issuesWithSuggestions.filter(issue => issue.type === 'ux')
    },
    {
      id: 'code' as keyof CategoryScores,
      label: 'Code Quality',
      score: categoryScores.code,
      icon: Code,
      color: 'green',
      issues: issuesWithSuggestions.filter(issue => issue.type === 'code')
    },
    {
      id: 'performance' as keyof CategoryScores,
      label: 'Performance',
      score: categoryScores.performance,
      icon: Zap,
      color: 'yellow',
      issues: issuesWithSuggestions.filter(issue => issue.type === 'performance')
    },
    {
      id: 'accessibility' as keyof CategoryScores,
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
      {/* Enhanced Design Score - No Hover Effects, More Stable */}
      <Card className="bg-gradient-to-r from-gray-600 to-slate-700 text-white border-2 border-dashed border-gray-400 transform -rotate-1"
            style={{ 
              boxShadow: '6px 6px 12px rgba(0,0,0,0.15), inset 0 0 0 2px rgba(255,255,255,0.1)',
              fontFamily: '"Comic Sans MS", "Marker Felt", cursive'
            }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-3xl font-bold relative" style={{ fontFamily: '"Marker Felt", "Comic Sans MS", cursive' }}>
                  Design Score
                  {/* Sketchy underline */}
                  <div className="absolute -bottom-1 left-0 w-full h-1 bg-white/30 transform -skew-x-12"></div>
                </h3>
                <ShareableScoreCard 
                  score={results.score} 
                  betterThan={results.comparison?.betterThan}
                />
              </div>
              <div className="text-5xl font-bold mb-4 relative">
                {results.score}/100
                {/* Sketchy arrow pointing to score */}
                <div className="absolute -right-16 top-2 text-yellow-300 text-2xl transform rotate-12">
                  ↗
                </div>
              </div>
              
              {/* Sketchy decorative elements */}
              <div className="flex items-center space-x-4 text-yellow-300 mb-4">
                <span className="text-xl animate-pulse">★</span>
                <div className="flex-1 h-0.5 bg-white/20 transform skew-x-12"></div>
                <span className="text-lg">📊</span>
                <div className="flex-1 h-0.5 bg-white/20 transform -skew-x-12"></div>
                <span className="text-xl animate-pulse">★</span>
              </div>
            </div>
            
            {/* Main Donut Chart - Stable, No Hover Effects */}
            <div className="w-96 h-80 bg-white/10 rounded-lg p-6 border-2 border-dashed border-white/20">
              <h4 className="text-xl font-semibold mb-4 text-center relative">
                Overall Score
                {/* Sketchy highlight */}
                <div className="absolute inset-0 bg-white/5 rounded transform -rotate-1"></div>
              </h4>
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
                      strokeWidth={3}
                      stroke="#ffffff"
                      strokeDasharray="5,2"
                    >
                    </Pie>
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length && payload[0].name === 'Score') {
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-dashed border-gray-300">
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
              
              {/* Score text overlay with sketchy style */}
              <div className="relative -mt-40 text-center pointer-events-none">
                <div className="text-4xl font-bold text-white relative">
                  {results.score}%
                  {/* Sketchy circle around percentage */}
                  <div className="absolute inset-0 border-2 border-yellow-300 border-dashed rounded-full transform rotate-12 scale-150 opacity-30"></div>
                </div>
                <div className="text-base text-white/70">Overall Score</div>
              </div>
            </div>
          </div>
          
          {results.comparison && (
            <div className="bg-white/10 rounded-lg p-6 border-2 border-dashed border-white/20 relative overflow-hidden">
              {/* Background sketchy pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 left-4 text-white text-xs">★</div>
                <div className="absolute top-6 right-8 text-white text-xs">→</div>
                <div className="absolute bottom-4 left-12 text-white text-xs">📈</div>
                <div className="absolute bottom-2 right-4 text-white text-xs">★</div>
              </div>
              
              <div className="flex items-center space-x-2 mb-4 relative z-10">
                <Trophy className="h-6 w-6 text-yellow-300 animate-bounce" />
                <span className="font-semibold text-lg">Competitive Analysis</span>
                <div className="flex-1 h-0.5 bg-white/20 transform skew-x-6"></div>
              </div>
              
              {/* Enhanced Competitive Performance Display */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4 mb-4 border-2 border-dashed border-green-300/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-6 w-6 text-green-300" />
                    <span className="text-xl font-bold text-green-300">
                      Better than {results.comparison.betterThan}%
                    </span>
                  </div>
                  <BarChart3 className="h-6 w-6 text-green-300" />
                </div>
                
                {/* Visual Progress Bar */}
                <div className="relative mb-3">
                  <div className="w-full bg-white/20 rounded-full h-4 border-2 border-dashed border-white/40">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full border-2 border-dashed border-green-200 relative"
                      style={{ width: `${results.comparison.betterThan}%` }}
                    >
                      <div className="absolute -right-2 -top-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-white/70 mt-1">
                    <span>0%</span>
                    <span className="font-bold text-green-300">{results.comparison.betterThan}%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <p className="text-sm text-white/90">
                  Your website outperforms <strong className="text-yellow-300">{results.comparison.betterThan}%</strong> of analyzed websites in the <strong className="text-blue-300">{results.comparison.category}</strong> category
                </p>
              </div>
              
              {/* Enhanced Competitors Section with Full Click Area - No Progress Bars */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="h-5 w-5 text-blue-300" />
                  <span className="text-base font-medium">Compare with competitors:</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {results.comparison.competitors.map((competitor, index) => {
                    const isAhead = results.score > competitor.score;
                    const scoreDiff = results.score - competitor.score;
                    
                    return (
                      <div
                        key={index}
                        className="group p-4 rounded-lg bg-white/20 border-2 border-dashed border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-rotate-1"
                        onClick={() => handleAnalyzeCompetitor(competitor.name, competitor.url)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-bold text-base text-white">{competitor.name}</div>
                          <div className="flex items-center space-x-2">
                            {competitor.url && (
                              <ExternalLink className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                            )}
                            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        
                        <div className="text-2xl font-bold mb-3 text-center">{competitor.score}/100</div>
                        
                        <div className="text-center">
                          {isAhead ? (
                            <div className="flex items-center justify-center space-x-1 text-green-300 text-sm">
                              <CheckCircle className="h-4 w-4" />
                              <span>You're ahead (+{scoreDiff})</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-1 text-red-300 text-sm">
                              <TrendingDown className="h-4 w-4" />
                              <span>Room for improvement ({scoreDiff})</span>
                            </div>
                          )}
                        </div>
                        
                        {analyzingCompetitor === competitor.name && (
                          <div className="mt-2 text-center">
                            <div className="inline-flex items-center space-x-2 text-blue-300 text-sm">
                              <div className="animate-spin rounded-full h-3 w-3 border border-blue-300 border-t-transparent"></div>
                              <span>Analyzing...</span>
                            </div>
                          </div>
                        )}
                      </div>
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

                {/* Competitor Analysis Results in Category Cards */}
                {Object.keys(competitorAnalysis).length > 0 && (
                  <div className="mt-4 pt-3 border-t border-current/20">
                    <div className="text-xs font-medium mb-2">vs Competitors:</div>
                    <div className="space-y-1">
                      {Object.entries(competitorAnalysis).map(([competitorName, analysis]) => {
                        const competitorScore = analysis[category.id];
                        const isAhead = category.score > competitorScore;
                        
                        return (
                          <div key={competitorName} className="flex items-center justify-between text-xs">
                            <span className="truncate">{competitorName}:</span>
                            <div className="flex items-center space-x-1">
                              <span className={`font-medium ${isAhead ? 'text-green-600' : 'text-red-600'}`}>
                                {competitorScore}%
                              </span>
                              <span className={isAhead ? 'text-green-600' : 'text-red-600'}>
                                {isAhead ? '↓' : '↑'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

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
