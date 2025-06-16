import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, Code, Accessibility, Zap, ChevronDown, ChevronUp, Copy, Check, Edit, Trophy, Share2, Users, Target, Sparkles, Play, ExternalLink, Instagram, Download } from 'lucide-react';
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

  const handleShareToInstagram = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for Instagram square format
    canvas.width = 1080;
    canvas.height = 1080;

    // Background with paper texture
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add paper dots pattern
    ctx.fillStyle = 'rgba(0,0,0,0.03)';
    for (let x = 0; x < canvas.width; x += 20) {
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Main border (sketchy style)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 8;
    ctx.setLineDash([]);
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 64px "Comic Sans MS", cursive';
    ctx.textAlign = 'center';
    ctx.fillText('UX RAY ANALYSIS', canvas.width / 2, 150);

    // Main score circle
    const centerX = canvas.width / 2;
    const centerY = 350;
    const radius = 120;

    // Score circle background
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Score text
    ctx.fillStyle = '#333';
    ctx.font = 'bold 72px "Comic Sans MS", cursive';
    ctx.textAlign = 'center';
    ctx.fillText(`${results.score}`, centerX, centerY + 10);
    ctx.font = 'bold 32px "Comic Sans MS", cursive';
    ctx.fillText('/100', centerX, centerY + 50);

    // Category scores
    const categories = [
      { label: 'User Experience', score: categoryScores.ux, x: 200, y: 550 },
      { label: 'Code Quality', score: categoryScores.code, x: 880, y: 550 },
      { label: 'Performance', score: categoryScores.performance, x: 200, y: 700 },
      { label: 'Accessibility', score: categoryScores.accessibility, x: 880, y: 700 }
    ];

    categories.forEach(cat => {
      // Category box
      ctx.fillStyle = '#fff';
      ctx.fillRect(cat.x - 120, cat.y - 40, 240, 80);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.strokeRect(cat.x - 120, cat.y - 40, 240, 80);

      // Category text
      ctx.fillStyle = '#333';
      ctx.font = 'bold 24px "Comic Sans MS", cursive';
      ctx.textAlign = 'center';
      ctx.fillText(cat.label, cat.x, cat.y - 10);
      ctx.font = 'bold 32px "Comic Sans MS", cursive';
      ctx.fillText(`${cat.score}%`, cat.x, cat.y + 20);
    });

    // Competitive info
    if (results.comparison) {
      ctx.fillStyle = '#333';
      ctx.font = 'bold 28px "Comic Sans MS", cursive';
      ctx.textAlign = 'center';
      ctx.fillText(`Better than ${results.comparison.betterThan}% of websites!`, centerX, 820);
    }

    // Branding
    ctx.font = 'bold 24px "Comic Sans MS", cursive';
    ctx.fillText('Analyzed with UX RAY AI', centerX, 950);

    // Download the image
    const link = document.createElement('a');
    link.download = 'ux-ray-score.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Instagram-Ready Design Score Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-4 border-dashed border-gray-800 transform -rotate-1 hover:rotate-0 transition-transform duration-300"
            style={{ 
              boxShadow: '12px 12px 24px rgba(0,0,0,0.15), inset 0 0 0 3px white',
              fontFamily: '"Comic Sans MS", "Marker Felt", cursive'
            }}>
        
        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4 text-2xl">✨</div>
        <div className="absolute top-4 right-4 text-2xl">🎨</div>
        <div className="absolute bottom-4 left-4 text-2xl">🚀</div>
        <div className="absolute bottom-4 right-4 text-2xl">💎</div>

        <CardContent className="p-8">
          <div className="text-center mb-8">
            {/* Main Title with enhanced styling */}
            <div className="inline-block bg-white px-6 py-3 rounded-full border-3 border-dashed border-gray-800 mb-4 transform rotate-1">
              <h2 className="text-3xl font-bold text-gray-800 tracking-wider">
                🎯 UX RAY ANALYSIS 🎯
              </h2>
            </div>
            
            {/* Giant Score Display */}
            <div className="relative inline-block mb-6">
              <div className="w-64 h-64 rounded-full bg-white border-8 border-dashed border-gray-800 flex items-center justify-center transform -rotate-2 hover:rotate-0 transition-transform duration-300 mx-auto"
                   style={{ boxShadow: '8px 8px 16px rgba(0,0,0,0.1)' }}>
                <div className="text-center">
                  <div className="text-6xl font-bold text-gray-800 mb-2">{results.score}</div>
                  <div className="text-2xl font-bold text-gray-600">/100</div>
                  <div className="text-lg text-gray-500 mt-1">DESIGN SCORE</div>
                </div>
              </div>
              
              {/* Floating achievement badges */}
              <div className="absolute -top-4 -right-4 bg-yellow-300 rounded-full p-3 border-3 border-dashed border-gray-800 transform rotate-12">
                <Trophy className="h-8 w-8 text-yellow-800" />
              </div>
              
              {results.score >= 80 && (
                <div className="absolute -bottom-4 -left-4 bg-green-300 rounded-full p-3 border-3 border-dashed border-gray-800 transform -rotate-12">
                  <Sparkles className="h-8 w-8 text-green-800" />
                </div>
              )}
            </div>

            {/* Share Buttons Row */}
            <div className="flex justify-center space-x-4 mb-8">
              <Button 
                onClick={handleShareToInstagram}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-3 border-dashed border-gray-800 px-6 py-3 text-lg font-bold transform hover:scale-105 transition-transform duration-200"
                style={{ fontFamily: '"Comic Sans MS", cursive' }}
              >
                <Download className="h-5 w-5 mr-2" />
                Download for Instagram
              </Button>
              
              <Button 
                onClick={handleShare}
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white border-3 border-dashed border-gray-800 px-6 py-3 text-lg font-bold transform hover:scale-105 transition-transform duration-200"
                style={{ fontFamily: '"Comic Sans MS", cursive' }}
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share Results
              </Button>
            </div>

            {/* Competitive Achievement Banner */}
            {results.comparison && (
              <div className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 border-4 border-dashed border-gray-800 rounded-lg p-6 mb-6 transform rotate-1">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <Trophy className="h-8 w-8 text-orange-800" />
                  <span className="text-2xl font-bold text-gray-800">ACHIEVEMENT UNLOCKED!</span>
                  <Trophy className="h-8 w-8 text-orange-800" />
                </div>
                <p className="text-xl font-bold text-gray-800">
                  🏆 Better than <span className="text-3xl text-orange-800">{results.comparison.betterThan}%</span> of websites! 🏆
                </p>
                <p className="text-lg text-gray-700 mt-2">
                  You're in the <strong>top {100 - results.comparison.betterThan}%</strong> - Keep it up! 🚀
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Category Score Boxes with Instagram-style design */}
      <div className="grid md:grid-cols-4 gap-4">
        {categoryData.map((category, index) => {
          const IconComponent = category.icon;
          const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2'];
          const gradients = [
            'from-blue-100 to-blue-200',
            'from-green-100 to-green-200', 
            'from-yellow-100 to-yellow-200',
            'from-purple-100 to-purple-200'
          ];
          
          return (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-110 border-4 border-dashed border-gray-800 bg-gradient-to-br ${gradients[index]} ${rotations[index]} hover:rotate-0 ${
                selectedCategory === category.id ? 'ring-4 ring-blue-500 scale-105' : ''
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              style={{ 
                boxShadow: '6px 6px 12px rgba(0,0,0,0.15)',
                fontFamily: '"Comic Sans MS", cursive'
              }}
            >
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="bg-white rounded-full p-4 border-3 border-dashed border-gray-800 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-gray-800" />
                  </div>
                  <h4 className="font-bold text-lg text-gray-800 mb-2">{category.label}</h4>
                  <div className="text-3xl font-bold text-gray-800 mb-2">{category.score}%</div>
                  
                  {/* Score emoji indicator */}
                  <div className="text-2xl mb-2">
                    {category.score >= 90 ? '🔥' : 
                     category.score >= 80 ? '✨' : 
                     category.score >= 70 ? '👍' : 
                     category.score >= 60 ? '📈' : '🎯'}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {category.issues.length} improvement{category.issues.length !== 1 ? 's' : ''} found
                  </div>

                  {/* Competitor Analysis Results */}
                  {Object.keys(competitorAnalysis).length > 0 && (
                    <div className="mt-4 pt-3 border-t-2 border-dashed border-gray-400">
                      <div className="text-xs font-bold mb-2 text-gray-700">vs Competitors:</div>
                      <div className="space-y-1">
                        {Object.entries(competitorAnalysis).map(([competitorName, analysis]) => {
                          const competitorScore = analysis[category.id];
                          const isAhead = category.score > competitorScore;
                          
                          return (
                            <div key={competitorName} className="flex items-center justify-between text-xs">
                              <span className="truncate font-medium">{competitorName}:</span>
                              <div className="flex items-center space-x-1">
                                <span className={`font-bold ${isAhead ? 'text-green-700' : 'text-red-700'}`}>
                                  {competitorScore}%
                                </span>
                                <span className="text-lg">
                                  {isAhead ? '🎉' : '💪'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
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
