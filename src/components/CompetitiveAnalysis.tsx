import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, ExternalLink, TrendingUp, Target, Users, Zap, Eye, ArrowRight } from 'lucide-react';

interface CompetitiveAnalysisProps {
  comparison: {
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
  currentScore: number;
}

const CompetitiveAnalysis: React.FC<CompetitiveAnalysisProps> = ({ comparison, currentScore }) => {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('');

  const handleAnalyzeCompetitor = (url: string, name: string) => {
    // Open competitor URL in new tab for manual analysis
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.log(`Analysis requested for: ${name}`);
      // Could trigger a new analysis of the competitor URL here
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceMessage = (currentScore: number, competitorScore: number) => {
    const diff = currentScore - competitorScore;
    if (diff > 10) return { message: 'Significantly ahead', color: 'text-green-600' };
    if (diff > 0) return { message: 'Performing better', color: 'text-green-600' };
    if (diff > -10) return { message: 'Competitive position', color: 'text-yellow-600' };
    return { message: 'Room for improvement', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* Category and Position Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200"
            style={{ 
              boxShadow: '4px 4px 8px rgba(0,0,0,0.1)',
              fontFamily: '"Comic Sans MS", cursive'
            }}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Competitive Position</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{comparison.category}</div>
              <p className="text-sm text-gray-600">Industry Category</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{comparison.betterThan}%</div>
              <p className="text-sm text-gray-600">Better Than</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{comparison.position}</div>
              <p className="text-sm text-gray-600">Market Position</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Analysis Section */}
      {comparison.suggestedAnalysis && comparison.suggestedAnalysis.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-dashed border-purple-200"
              style={{ 
                boxShadow: '4px 4px 8px rgba(0,0,0,0.1)',
                fontFamily: '"Comic Sans MS", cursive'
              }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-purple-600" />
              <span>Recommended Competitive Analysis</span>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Top competitors suggested for detailed analysis based on your website category
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comparison.suggestedAnalysis.map((suggestion, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border-2 border-dashed border-purple-100 hover:border-purple-300 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-lg text-purple-800">{suggestion.name}</h4>
                        <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                          {suggestion.popularity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{suggestion.reason}</p>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleAnalyzeCompetitor(suggestion.url, suggestion.name)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          size="sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit {suggestion.name}
                        </Button>
                        <span className="text-xs text-gray-500">{suggestion.url}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-purple-400 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Competitor Comparison Grid */}
      <Card className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300"
            style={{ 
              boxShadow: '4px 4px 8px rgba(0,0,0,0.1)',
              fontFamily: '"Comic Sans MS", cursive'
            }}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Competitor Benchmarks</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Compare your design score against industry leaders
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Your Website Score */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-dashed border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-green-800">Your Website</h4>
                  <p className="text-sm text-green-600">Current Performance</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{currentScore}/100</div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Your Score
                  </Badge>
                </div>
              </div>
            </div>

            {/* Competitor Scores */}
            {comparison.competitors.map((competitor, index) => {
              const isAhead = currentScore > competitor.score;
              const scoreDiff = currentScore - competitor.score;
              
              return (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{competitor.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {competitor.category}
                        </Badge>
                      </div>
                      {competitor.description && (
                        <p className="text-xs text-gray-600 mb-2">{competitor.description}</p>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          isAhead ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isAhead ? '✓ You\'re ahead' : '↑ Room for improvement'}
                        </span>
                        {isAhead && <TrendingUp className="h-3 w-3 text-green-500" />}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-xl font-bold px-2 py-1 rounded ${
                        competitor.score >= 90 ? 'text-green-600 bg-green-100' :
                        competitor.score >= 80 ? 'text-blue-600 bg-blue-100' :
                        competitor.score >= 70 ? 'text-yellow-600 bg-yellow-100' :
                        'text-red-600 bg-red-100'
                      }`}>
                        {competitor.score}/100
                      </div>
                      {competitor.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAnalyzeCompetitor(competitor.url!, competitor.name)}
                          className="mt-1 text-xs"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Visit
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Score comparison bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Performance Comparison</span>
                      <span>{scoreDiff > 0 ? '+' : ''}{scoreDiff} points</span>
                    </div>
                    <div className="relative">
                      <Progress value={competitor.score} className="h-2 bg-gray-200" />
                      <div 
                        className="absolute top-0 h-2 bg-green-500 rounded opacity-50"
                        style={{ width: `${Math.min(currentScore, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitiveAnalysis;
