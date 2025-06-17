import React from 'react';
import { Trophy, TrendingUp, BarChart3, CheckCircle, TrendingDown, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ShareableScoreCard from './ShareableScoreCard';

interface CompetitorData {
  name: string;
  score: number;
  category: string;
  url?: string;
  description?: string;
}

interface ComparisonData {
  competitors: CompetitorData[];
  betterThan: number;
  position: string;
  category: string;
  suggestedAnalysis?: Array<{
    name: string;
    url: string;
    reason: string;
    popularity: string;
  }>;
}

interface ScoreCardProps {
  score: number;
  comparison?: ComparisonData;
  competitorAnalysis: {[key: string]: any};
  onAnalyzeCompetitor: (name: string, url?: string) => void;
  analyzingCompetitor: string | null;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ 
  score, 
  comparison, 
  competitorAnalysis,
  onAnalyzeCompetitor,
  analyzingCompetitor
}) => {
  return (
    <Card className="bg-gradient-to-r from-gray-600 to-slate-700 text-white border-2 border-dashed border-gray-400 transform -rotate-1"
          style={{ 
            boxShadow: '6px 6px 12px rgba(0,0,0,0.15), inset 0 0 0 2px rgba(255,255,255,0.1)',
            fontFamily: '"Comic Sans MS", "Marker Felt", cursive'
          }}>
      <CardContent className="p-3 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 md:mb-6 space-y-4 lg:space-y-0">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4 space-y-2 sm:space-y-0">
              <h3 className="text-xl md:text-3xl font-bold relative" style={{ fontFamily: '"Marker Felt", "Comic Sans MS", cursive' }}>
                Design Score
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-white/30 transform -skew-x-12"></div>
              </h3>
              <div className="relative">
                <ShareableScoreCard 
                  score={score} 
                  betterThan={comparison?.betterThan}
                />
              </div>
            </div>
            <div className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 relative">
              {score}/100
              <div className="absolute -right-8 md:-right-16 top-1 md:top-2 text-yellow-300 text-lg md:text-2xl transform rotate-12">
                ↗
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-yellow-300 mb-3 md:mb-4">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
              </div>
              <div className="flex-1 h-0.5 md:h-1 bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-blue-400/30 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-20 animate-pulse"></div>
              </div>
              <div className="text-xs md:text-sm">🎨</div>
              <div className="flex-1 h-0.5 md:h-1 bg-gradient-to-r from-blue-400/30 via-green-400/30 to-yellow-400/30 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 opacity-20 animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-red-400 to-pink-400 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-80 xl:w-96 h-64 md:h-80 bg-slate-600/50 rounded-lg p-3 md:p-6 border border-slate-400/30 relative backdrop-blur-sm">
            <h4 className="text-base md:text-xl font-semibold mb-3 md:mb-4 text-center text-white/90">
              Overall Score
            </h4>
            
            <div className="relative w-full h-full flex items-center justify-center">
              <svg width="180" height="180" className="md:w-[220px] md:h-[220px] transform -rotate-90">
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  fill="none"
                  stroke="#4B5563"
                  strokeWidth="12"
                  strokeLinecap="round"
                  opacity="0.3"
                  className="md:cx-[110] md:cy-[110] md:r-[85] md:stroke-[16]"
                />
                
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeDasharray={`${(score / 100) * 439.8} 439.8`}
                  strokeLinecap="round"
                  className="md:cx-[110] md:cy-[110] md:r-[85] md:stroke-[16] transition-all duration-1000 ease-out"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))',
                    strokeDasharray: window.innerWidth >= 768 ? `${(score / 100) * 534.1} 534.1` : `${(score / 100) * 439.8} 439.8`
                  }}
                />
                
                {Array.from({ length: 20 }, (_, i) => {
                  const angle = (i * 18) * Math.PI / 180;
                  const centerX = window.innerWidth >= 768 ? 110 : 90;
                  const centerY = window.innerWidth >= 768 ? 110 : 90;
                  const outerRadius = window.innerWidth >= 768 ? 100 : 80;
                  const innerRadius = window.innerWidth >= 768 ? 95 : 75;
                  const x1 = centerX + Math.cos(angle) * outerRadius;
                  const y1 = centerY + Math.sin(angle) * outerRadius;
                  const x2 = centerX + Math.cos(angle) * innerRadius;
                  const y2 = centerY + Math.sin(angle) * innerRadius;
                  
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#64748B"
                      strokeWidth="2"
                      opacity="0.4"
                    />
                  );
                })}
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl md:text-4xl font-bold text-white mb-1">
                  {score}%
                </div>
                <div className="text-xs md:text-sm text-white/70">
                  Overall Score
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {comparison && (
          <div className="bg-white/10 rounded-lg p-3 md:p-6 border-2 border-dashed border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 left-4 text-white text-xs">★</div>
              <div className="absolute top-6 right-8 text-white text-xs">→</div>
              <div className="absolute bottom-4 left-12 text-white text-xs">📈</div>
              <div className="absolute bottom-2 right-4 text-white text-xs">★</div>
            </div>
            
            <div className="flex items-center space-x-2 mb-3 md:mb-4 relative z-10">
              <Trophy className="h-4 w-4 md:h-6 md:w-6 text-yellow-300 animate-bounce" />
              <span className="font-semibold text-sm md:text-lg">Competitive Analysis</span>
              <div className="flex-1 h-0.5 bg-white/20 transform skew-x-6"></div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-3 md:p-4 mb-3 md:mb-4 border-2 border-dashed border-green-300/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 md:mb-3 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-green-300" />
                  <span className="text-base md:text-xl font-bold text-green-300">
                    Better than {comparison.betterThan}%
                  </span>
                </div>
                <BarChart3 className="h-4 w-4 md:h-6 md:w-6 text-green-300" />
              </div>
              
              <div className="relative mb-2 md:mb-3">
                <div className="w-full bg-white/20 rounded-full h-3 md:h-4 border-2 border-dashed border-white/40">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full border-2 border-dashed border-green-200 relative"
                    style={{ width: `${comparison.betterThan}%` }}
                  >
                    <div className="absolute -right-1 md:-right-2 -top-0.5 md:-top-1 w-4 h-4 md:w-6 md:h-6 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-white/70 mt-1">
                  <span>0%</span>
                  <span className="font-bold text-green-300">{comparison.betterThan}%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <p className="text-xs md:text-sm text-white/90">
                Your website outperforms <strong className="text-yellow-300">{comparison.betterThan}%</strong> of analyzed websites in the <strong className="text-blue-300">{comparison.category}</strong> category
              </p>
            </div>
            
            <div className="mb-3 md:mb-4">
              <div className="flex items-center space-x-2 mb-3 md:mb-4">
                <div className="h-4 w-4 md:h-5 md:w-5 text-blue-300">🎯</div>
                <span className="text-sm md:text-base font-medium">Compare with competitors:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {comparison.competitors.map((competitor, index) => {
                  const isAhead = score > competitor.score;
                  const scoreDiff = score - competitor.score;
                  
                  return (
                    <div
                      key={index}
                      className="group p-3 md:p-4 rounded-lg bg-white/20 border-2 border-dashed border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-rotate-1"
                      onClick={() => onAnalyzeCompetitor(competitor.name, competitor.url)}
                    >
                      <div className="flex items-center justify-between mb-2 md:mb-3">
                        <div className="font-bold text-sm md:text-base text-white truncate pr-2">{competitor.name}</div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {competitor.url && (
                            <ExternalLink className="h-3 w-3 md:h-4 md:w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                          )}
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      
                      <div className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-center">{competitor.score}/100</div>
                      
                      <div className="text-center">
                        {isAhead ? (
                          <div className="flex items-center justify-center space-x-1 text-green-300 text-xs md:text-sm">
                            <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
                            <span>You're ahead (+{scoreDiff})</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-1 text-red-300 text-xs md:text-sm">
                            <TrendingDown className="h-3 w-3 md:h-4 md:w-4" />
                            <span>Room for improvement ({scoreDiff})</span>
                          </div>
                        )}
                      </div>
                      
                      {analyzingCompetitor === competitor.name && (
                        <div className="mt-2 text-center">
                          <div className="inline-flex items-center space-x-2 text-blue-300 text-xs md:text-sm">
                            <div className="animate-spin rounded-full h-2.5 w-2.5 md:h-3 md:w-3 border border-blue-300 border-t-transparent"></div>
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
  );
};

export default ScoreCard;
