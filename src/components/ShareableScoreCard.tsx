
import React, { useRef } from 'react';
import { Share2, Download, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ShareableScoreCardProps {
  score: number;
  betterThan?: number;
  onShare: () => void;
}

const ShareableScoreCard: React.FC<ShareableScoreCardProps> = ({ 
  score, 
  betterThan,
  onShare 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadForInstagram = async () => {
    if (!cardRef.current) return;

    try {
      // Create a canvas element for Instagram-sized image (1080x1080)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 1080;
      canvas.height = 1080;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
      gradient.addColorStop(0, '#1e293b');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1080);

      // Add sketchy border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.setLineDash([20, 10]);
      ctx.strokeRect(60, 60, 960, 960);

      // Add title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 72px "Comic Sans MS", cursive';
      ctx.textAlign = 'center';
      ctx.fillText('UX Ray Analysis', 540, 200);

      // Add score
      ctx.font = 'bold 180px "Comic Sans MS", cursive';
      ctx.fillText(`${score}/100`, 540, 400);

      // Add performance text
      if (betterThan) {
        ctx.font = 'bold 48px "Comic Sans MS", cursive';
        ctx.fillText(`Better than ${betterThan}% of websites!`, 540, 500);
      }

      // Add decorative elements
      ctx.font = '60px serif';
      ctx.fillText('⭐', 200, 300);
      ctx.fillText('🚀', 880, 300);
      ctx.fillText('✨', 200, 700);
      ctx.fillText('🎯', 880, 700);

      // Add bottom text
      ctx.font = 'bold 36px "Comic Sans MS", cursive';
      ctx.fillText('Analyzed with UXRay.ai', 540, 900);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `ux-analysis-score-${score}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Failed to generate Instagram image:', error);
    }
  };

  const getScoreMessage = () => {
    if (score >= 90) return "Outstanding! 🏆";
    if (score >= 80) return "Excellent work! ⭐";
    if (score >= 70) return "Great job! 🚀";
    if (score >= 60) return "Good progress! 👍";
    return "Room for improvement! 💪";
  };

  return (
    <Card 
      ref={cardRef}
      className="relative bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 text-white border-4 border-dashed border-white/30 transform -rotate-1 hover:rotate-0 transition-transform duration-300"
      style={{ 
        boxShadow: '8px 8px 16px rgba(0,0,0,0.3)',
        fontFamily: '"Comic Sans MS", "Marker Felt", cursive',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #0f172a 100%)'
      }}
    >
      {/* Decorative corners */}
      <div className="absolute -top-2 -left-2 text-yellow-300 text-2xl transform rotate-12">★</div>
      <div className="absolute -top-2 -right-2 text-blue-300 text-2xl transform -rotate-12">✦</div>
      <div className="absolute -bottom-2 -left-2 text-green-300 text-2xl transform -rotate-12">●</div>
      <div className="absolute -bottom-2 -right-2 text-purple-300 text-2xl transform rotate-12">♦</div>

      <CardContent className="p-8 text-center relative">
        {/* Header with share buttons */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-400" />
            <span className="text-sm font-bold opacity-80">UX ANALYSIS</span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/40 text-white hover:bg-white/30 border-2 border-dashed"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-green-600/80 border-green-400 text-white hover:bg-green-600 border-2 border-dashed"
              onClick={handleDownloadForInstagram}
            >
              <Download className="h-4 w-4 mr-1" />
              Instagram
            </Button>
          </div>
        </div>

        {/* Main score display */}
        <div className="mb-6">
          <h2 className="text-4xl font-bold mb-4 transform -rotate-1">
            Design Score
          </h2>
          
          {/* Score circle with sketchy style */}
          <div className="relative inline-block">
            <div 
              className="w-48 h-48 mx-auto border-8 border-dashed border-white/60 rounded-full bg-white/10 flex items-center justify-center transform rotate-2"
              style={{
                boxShadow: 'inset 0 0 30px rgba(255,255,255,0.1)',
              }}
            >
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">{score}</div>
                <div className="text-xl opacity-80">/100</div>
              </div>
            </div>
            
            {/* Floating achievement message */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold border-2 border-dashed border-yellow-600 transform rotate-3">
              {getScoreMessage()}
            </div>
          </div>
        </div>

        {/* Performance comparison */}
        {betterThan && (
          <div className="bg-white/15 rounded-lg p-4 border-2 border-dashed border-white/30 mb-6 transform rotate-1">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="font-bold text-lg">Performance Rank</span>
            </div>
            <p className="text-2xl font-bold text-green-300">
              Better than {betterThan}% of websites!
            </p>
            <p className="text-sm opacity-80 mt-1">
              Your site is in the top {100 - betterThan}%
            </p>
          </div>
        )}

        {/* Fun facts section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-500/20 p-3 rounded-lg border-2 border-dashed border-blue-400 transform -rotate-1">
            <div className="text-2xl font-bold text-blue-300">{score >= 80 ? '🚀' : '📈'}</div>
            <div className="text-xs font-bold">
              {score >= 80 ? 'ROCKET READY' : 'IMPROVING'}
            </div>
          </div>
          <div className="bg-green-500/20 p-3 rounded-lg border-2 border-dashed border-green-400 transform rotate-1">
            <div className="text-2xl font-bold text-green-300">🎯</div>
            <div className="text-xs font-bold">USER FOCUSED</div>
          </div>
        </div>

        {/* Brand footer */}
        <div className="border-t-2 border-dashed border-white/30 pt-4">
          <p className="text-sm font-bold opacity-70">
            Analyzed with ❤️ by UXRay.ai
          </p>
        </div>

        {/* Sketchy underline decoration */}
        <div className="absolute bottom-2 left-8 right-8 h-1 bg-white/20 transform rotate-1 rounded-full"></div>
      </CardContent>
    </Card>
  );
};

export default ShareableScoreCard;
