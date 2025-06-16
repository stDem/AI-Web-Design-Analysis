
import React, { useRef } from 'react';
import { Share2, Download, Sparkles, Trophy, TrendingUp } from 'lucide-react';
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

    // Create a canvas for Instagram-optimized image (1080x1080)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1080;

    // Background with sketchy texture
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#6b7280');
    gradient.addColorStop(1, '#475569');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add sketchy texture pattern
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 100; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw main score circle (sketchy style)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 50;
    const radius = 200;

    // Sketchy circle background
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 8;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 20, 0, 2 * Math.PI);
    ctx.stroke();

    // Score arc (green)
    const scoreAngle = (score / 100) * 2 * Math.PI;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 25;
    ctx.setLineDash([15, 5]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + scoreAngle);
    ctx.stroke();

    // Remaining arc (dark)
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 25;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2 + scoreAngle, 3 * Math.PI / 2);
    ctx.stroke();

    // Score text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 120px Comic Sans MS, cursive';
    ctx.textAlign = 'center';
    ctx.fillText(`${score}%`, centerX, centerY + 20);

    ctx.font = 'bold 40px Comic Sans MS, cursive';
    ctx.fillText('Overall Score', centerX, centerY + 80);

    // Title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px Comic Sans MS, cursive';
    ctx.textAlign = 'center';
    ctx.fillText('Design Score', centerX, 150);

    // Subtitle with achievement
    if (betterThan) {
      ctx.font = 'bold 36px Comic Sans MS, cursive';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`🏆 Better than ${betterThan}% of websites!`, centerX, 900);
    }

    // Sketchy decorative elements
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    
    // Draw some sketchy arrows and stars
    const drawSketchyArrow = (x: number, y: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 30, y - 30);
      ctx.moveTo(x + 30, y - 30);
      ctx.lineTo(x + 20, y - 35);
      ctx.moveTo(x + 30, y - 30);
      ctx.lineTo(x + 35, y - 20);
      ctx.stroke();
    };

    drawSketchyArrow(150, 300);
    drawSketchyArrow(930, 400);
    drawSketchyArrow(100, 700);

    // Add UX Ray branding
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = 'bold 32px Comic Sans MS, cursive';
    ctx.fillText('📊 UX Ray Analysis', centerX, 1000);

    // Download the image
    const link = document.createElement('a');
    link.download = `ux-ray-score-${score}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  return (
    <Card 
      ref={cardRef}
      className="bg-gradient-to-br from-gray-600 to-slate-700 text-white border-2 border-dashed border-gray-400 transform -rotate-1 overflow-hidden relative"
      style={{ 
        boxShadow: '8px 8px 16px rgba(0,0,0,0.2)',
        fontFamily: '"Comic Sans MS", "Marker Felt", cursive'
      }}
    >
      {/* Sketchy background elements */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="sketchy-lines" patternUnits="userSpaceOnUse" width="40" height="40">
              <path d="M0,20 Q10,15 20,20 T40,20" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
              <path d="M20,0 Q25,10 20,20 T20,40" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sketchy-lines)"/>
        </svg>
      </div>

      <CardContent className="p-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-4xl font-bold relative">
                Design Score
                {/* Sketchy underline */}
                <svg className="absolute -bottom-2 left-0 w-full h-4" viewBox="0 0 200 20">
                  <path 
                    d="M5,15 Q50,5 100,15 T195,15" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    fill="none" 
                    opacity="0.6"
                    strokeDasharray="5,3"
                  />
                </svg>
              </h3>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 border-2 border-dashed transform hover:rotate-2 transition-all duration-200"
                  onClick={handleDownloadForInstagram}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Instagram
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 border-2 border-dashed transform hover:-rotate-1 transition-all duration-200"
                  onClick={onShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            
            {/* Enhanced score display */}
            <div className="relative mb-4">
              <div className="text-6xl font-bold flex items-baseline space-x-2">
                <span className="relative">
                  {score}
                  {/* Sketchy highlight */}
                  <svg className="absolute -top-4 -left-4 w-20 h-20" viewBox="0 0 80 80">
                    <circle 
                      cx="40" 
                      cy="40" 
                      r="35" 
                      stroke="#fbbf24" 
                      strokeWidth="3" 
                      fill="none" 
                      opacity="0.7"
                      strokeDasharray="8,4"
                      className="animate-pulse"
                    />
                  </svg>
                </span>
                <span className="text-3xl opacity-80">/100</span>
                <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Enhanced donut chart area */}
          <div className="w-80 h-72 bg-white/10 rounded-lg p-6 border-2 border-dashed border-white/20 relative transform hover:rotate-1 transition-all duration-300">
            <h4 className="text-xl font-semibold mb-4 text-center">Overall Score</h4>
            
            {/* Sketchy donut chart representation */}
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="#374151"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray="10,5"
                  opacity="0.8"
                />
                {/* Score arc */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="#10b981"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray={`${(score / 100) * 502}, 502`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))'
                  }}
                />
              </svg>
              
              {/* Center score text with sketchy style */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-white relative">
                  {score}%
                  {/* Sketchy circle around percentage */}
                  <svg className="absolute -inset-6 w-24 h-24" viewBox="0 0 96 96">
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      stroke="rgba(255,255,255,0.3)" 
                      strokeWidth="2" 
                      fill="none" 
                      strokeDasharray="6,4"
                      className="animate-spin"
                      style={{ animationDuration: '10s' }}
                    />
                  </svg>
                </div>
                <div className="text-sm text-white/70 mt-1">Overall Score</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Achievement section with sketchy elements */}
        {betterThan && (
          <div className="bg-white/10 rounded-lg p-4 border-2 border-dashed border-white/20 relative overflow-hidden">
            {/* Decorative sketchy elements */}
            <svg className="absolute top-2 right-2 w-8 h-8" viewBox="0 0 32 32">
              <path 
                d="M16,2 L20,12 L30,12 L22,18 L26,28 L16,22 L6,28 L10,18 L2,12 L12,12 Z" 
                fill="#fbbf24" 
                opacity="0.6"
                stroke="#fbbf24"
                strokeWidth="1"
                strokeDasharray="2,1"
              />
            </svg>
            
            <div className="flex items-center space-x-3">
              <Trophy className="h-6 w-6 text-yellow-300 animate-bounce" />
              <div>
                <p className="font-semibold text-lg">
                  🎉 Awesome Achievement!
                </p>
                <p className="text-sm opacity-90">
                  Your website scores better than <strong>{betterThan}%</strong> of analyzed websites
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-300" />
            </div>
            
            {/* Progress bar with sketchy style */}
            <div className="mt-3 relative">
              <div className="w-full bg-white/20 rounded-full h-3 border border-dashed border-white/30">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${betterThan}%` }}
                >
                  {/* Sketchy progress indicator */}
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Floating sketchy decorations */}
      <div className="absolute top-4 left-4 opacity-30">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M5,20 Q15,10 25,20 Q35,30 25,35 Q15,30 5,20" stroke="white" strokeWidth="2" fill="none" strokeDasharray="3,2"/>
        </svg>
      </div>
      
      <div className="absolute bottom-4 right-4 opacity-30">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M10,10 L30,10 L30,30 L10,30 Z" stroke="white" strokeWidth="2" fill="none" strokeDasharray="4,3" transform="rotate(15 20 20)"/>
        </svg>
      </div>
    </Card>
  );
};

export default ShareableScoreCard;
