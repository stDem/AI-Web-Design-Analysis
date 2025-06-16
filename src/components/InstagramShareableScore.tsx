
import React from 'react';
import { Star, Trophy, Zap, Shield, Users, Code, Share2, Download } from 'lucide-react';

interface InstagramShareableScoreProps {
  score: number;
  categoryScores?: {
    ux: number;
    accessibility: number;
    performance: number;
    code: number;
  };
  websiteUrl?: string;
}

const InstagramShareableScore: React.FC<InstagramShareableScoreProps> = ({ 
  score, 
  categoryScores,
  websiteUrl 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🚀';
    if (score >= 80) return '✨';
    if (score >= 70) return '👍';
    if (score >= 60) return '📈';
    return '🔧';
  };

  const downloadAsImage = () => {
    // This would implement actual image generation for Instagram sharing
    alert('Download functionality would be implemented here!');
  };

  const shareToInstagram = () => {
    if (navigator.share) {
      navigator.share({
        title: `My UX Ray Score: ${score}/100!`,
        text: `Just analyzed my website with UX Ray AI and got ${score}/100! 🎯 #UXRay #WebDesign #AI`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="relative max-w-lg mx-auto">
      {/* Instagram-ready square card */}
      <div className="aspect-square bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-1 rounded-3xl sketch-border transform rotate-1">
        <div className="h-full bg-white rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 text-2xl opacity-20">✦</div>
          <div className="absolute top-4 right-4 text-2xl opacity-20">★</div>
          <div className="absolute bottom-4 left-4 text-2xl opacity-20">◆</div>
          <div className="absolute bottom-4 right-4 text-2xl opacity-20">♦</div>

          {/* Logo */}
          <div className="sketch-border bg-white p-2 mb-4 transform -rotate-2">
            <img 
              src="/lovable-uploads/0a0e0bd1-96e1-4c3d-89a5-6f2379d8ddff.png" 
              alt="UX Ray Logo" 
              className="w-12 h-12 object-contain"
            />
          </div>

          {/* Main Score */}
          <div className="relative mb-4">
            <div className={`sketch-score-circle w-32 h-32 flex items-center justify-center transform -rotate-1 ${getScoreColor(score)}`}>
              <div className="text-center">
                <div className="text-4xl font-bold">{score}</div>
                <div className="text-sm font-medium">/100</div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 text-3xl">{getScoreEmoji(score)}</div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 mb-2 hand-drawn-line">
            UX RAY SCORE
          </h2>
          
          {/* Website URL */}
          {websiteUrl && (
            <p className="text-xs text-gray-600 mb-4 truncate max-w-full px-2">
              {websiteUrl.replace('https://', '').replace('http://', '')}
            </p>
          )}

          {/* Category Mini Scores */}
          {categoryScores && (
            <div className="grid grid-cols-2 gap-3 w-full mb-4">
              <div className="sketch-border bg-blue-50 p-2 text-center transform rotate-1">
                <Users className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                <div className="text-sm font-bold">{categoryScores.ux}</div>
                <div className="text-xs text-gray-600">UX</div>
              </div>
              <div className="sketch-border bg-green-50 p-2 text-center transform -rotate-1">
                <Shield className="h-4 w-4 mx-auto mb-1 text-green-600" />
                <div className="text-sm font-bold">{categoryScores.accessibility}</div>
                <div className="text-xs text-gray-600">A11Y</div>
              </div>
              <div className="sketch-border bg-yellow-50 p-2 text-center transform rotate-1">
                <Zap className="h-4 w-4 mx-auto mb-1 text-yellow-600" />
                <div className="text-sm font-bold">{categoryScores.performance}</div>
                <div className="text-xs text-gray-600">PERF</div>
              </div>
              <div className="sketch-border bg-purple-50 p-2 text-center transform -rotate-1">
                <Code className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                <div className="text-sm font-bold">{categoryScores.code}</div>
                <div className="text-xs text-gray-600">CODE</div>
              </div>
            </div>
          )}

          {/* Branding */}
          <div className="text-xs text-gray-500 font-bold">
            POWERED BY AI • UXRAY.AI
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center space-x-3 mt-4">
        <button 
          onClick={shareToInstagram}
          className="sketch-button bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
        >
          <Share2 className="h-4 w-4 mr-2" />
          SHARE
        </button>
        <button 
          onClick={downloadAsImage}
          className="sketch-button bg-gray-800 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          DOWNLOAD
        </button>
      </div>
    </div>
  );
};

export default InstagramShareableScore;
