
import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2, Download } from 'lucide-react';

interface ShareableScoreCardProps {
  score: number;
  betterThan?: number;
}

const ShareableScoreCard: React.FC<ShareableScoreCardProps> = ({ score, betterThan }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateShareableImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for Instagram (1080x1080)
    canvas.width = 1080;
    canvas.height = 1080;

    // Paper-like background with subtle texture
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, '#F9FAFB');
    gradient.addColorStop(0.5, '#F3F4F6');
    gradient.addColorStop(1, '#E5E7EB');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Add paper texture noise
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = `rgba(156, 163, 175, ${Math.random() * 0.1})`;
      ctx.fillRect(Math.random() * 1080, Math.random() * 1080, 1, 1);
    }

    // Sketchy outer border (multiple overlapping lines for hand-drawn effect)
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(50 + Math.random() * 2, 50 + Math.random() * 2);
      ctx.lineTo(1030 + Math.random() * 2, 50 + Math.random() * 2);
      ctx.lineTo(1030 + Math.random() * 2, 1030 + Math.random() * 2);
      ctx.lineTo(50 + Math.random() * 2, 1030 + Math.random() * 2);
      ctx.lineTo(50 + Math.random() * 2, 50 + Math.random() * 2);
      ctx.stroke();
    }

    // Title with sketchy underline
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('UX RAY ANALYSIS', 80, 150);
    
    // Sketchy underline for title
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 170);
    ctx.lineTo(550 + Math.random() * 10, 172 + Math.random() * 4);
    ctx.stroke();

    // Main score with sketchy box
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 4;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    // Draw sketchy rectangle for score
    ctx.beginPath();
    ctx.moveTo(80, 220);
    ctx.lineTo(480 + Math.random() * 5, 222);
    ctx.lineTo(482, 350 + Math.random() * 3);
    ctx.lineTo(78 + Math.random() * 3, 352);
    ctx.lineTo(80, 220);
    ctx.fill();
    ctx.stroke();

    // Score text
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${score}`, 280, 320);
    ctx.font = '40px Arial';
    ctx.fillText('/100', 380, 295);

    // Draw sketchy donut chart
    const centerX = 700;
    const centerY = 300;
    const radius = 120;

    // Background circle (sketchy with multiple overlapping circles)
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 20;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(centerX + Math.random() * 2, centerY + Math.random() * 2, radius + Math.random() * 3, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Score arc (sketchy green with slight variations)
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 20;
    const endAngle = (score / 100) * 2 * Math.PI - Math.PI / 2;
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.arc(centerX + Math.random() * 2, centerY + Math.random() * 2, radius + Math.random() * 2, -Math.PI / 2, endAngle);
      ctx.stroke();
    }

    // Center score text
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${score}%`, centerX, centerY + 5);

    // Better than section with sketchy box
    if (betterThan) {
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
      // Sketchy box for "better than"
      ctx.beginPath();
      ctx.moveTo(80, 400);
      ctx.lineTo(500 + Math.random() * 5, 402);
      ctx.lineTo(502, 480 + Math.random() * 3);
      ctx.lineTo(78 + Math.random() * 3, 482);
      ctx.lineTo(80, 400);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#065F46';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Better than ${betterThan}%`, 100, 435);
      ctx.font = '24px Arial';
      ctx.fillText('of analyzed websites', 100, 465);
    }

    // Add sketchy features section
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('✓ AI-Powered Analysis', 80, 550);
    ctx.fillText('✓ WCAG Compliance Check', 80, 590);
    ctx.fillText('✓ Performance Optimization', 80, 630);
    ctx.fillText('✓ UX Pattern Recognition', 80, 670);

    // Add decorative sketchy elements
    drawSketchyArrow(ctx, 550, 450, 60);
    drawSketchyChart(ctx, 650, 550);
    drawSketchyStars(ctx, 750, 600);

    // Website info section with sketchy border
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(243, 244, 246, 0.8)';
    ctx.beginPath();
    ctx.moveTo(80, 720);
    ctx.lineTo(1000 + Math.random() * 5, 722);
    ctx.lineTo(1002, 850 + Math.random() * 3);
    ctx.lineTo(78 + Math.random() * 3, 852);
    ctx.lineTo(80, 720);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('About UX RAY', 100, 760);
    
    ctx.font = '20px Arial';
    ctx.fillText('🤖 Powered by GPT-4 Vision & Claude 3.5', 100, 790);
    ctx.fillText('📊 Comprehensive Design Analysis Tool', 100, 815);
    ctx.fillText('🚀 Get actionable insights to improve your UX', 100, 840);

    // Sketchy footer
    ctx.fillStyle = '#6B7280';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Generated by UX RAY • uxray.ai', 540, 950);
    
    // Add decorative dashed line above footer
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(100, 900);
    ctx.lineTo(980, 902);
    ctx.stroke();
    ctx.setLineDash([]);

    // Add some sketchy decorative elements in corners
    drawSketchyCornerDecoration(ctx, 900, 100);
    drawSketchyCornerDecoration(ctx, 100, 900);
  };

  const drawSketchyArrow = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Main arrow line with slight wobble
    ctx.moveTo(x, y);
    ctx.lineTo(x + size + Math.random() * 2, y - size / 2 + Math.random() * 2);
    // Arrow head
    ctx.moveTo(x + size * 0.7, y - size / 2 - 10);
    ctx.lineTo(x + size, y - size / 2);
    ctx.lineTo(x + size * 0.7, y - size / 2 + 10);
    ctx.stroke();
  };

  const drawSketchyChart = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 2;
    const bars = [25, 45, 35, 55, 40];
    bars.forEach((height, i) => {
      // Draw sketchy bars with slight variations
      ctx.beginPath();
      ctx.moveTo(x + i * 30, y);
      ctx.lineTo(x + i * 30 + Math.random() * 2, y - height + Math.random() * 2);
      ctx.lineTo(x + i * 30 + 20 + Math.random() * 2, y - height + Math.random() * 2);
      ctx.lineTo(x + i * 30 + 20, y);
      ctx.lineTo(x + i * 30, y);
      ctx.stroke();
    });
  };

  const drawSketchyStars = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = '#FEF08A';
    ctx.font = '32px Arial';
    for (let i = 0; i < 5; i++) {
      ctx.fillText('★', x + i * 30 + Math.random() * 2, y + Math.random() * 2);
    }
  };

  const drawSketchyCornerDecoration = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Small decorative lines
    for (let i = 0; i < 3; i++) {
      ctx.moveTo(x + i * 10, y);
      ctx.lineTo(x + i * 10 + 15 + Math.random() * 3, y + 15 + Math.random() * 3);
    }
    ctx.stroke();
  };

  const downloadImage = () => {
    generateShareableImage();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `ux-ray-score-${score}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareToInstagram = () => {
    generateShareableImage();
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob && navigator.share) {
        const file = new File([blob], `ux-ray-score-${score}.png`, { type: 'image/png' });
        navigator.share({
          files: [file],
          title: 'My UX Ray Design Score',
          text: `My website scored ${score}/100 in AI-powered UX analysis! 🚀 Get your score at uxray.ai`
        }).catch(console.error);
      } else {
        // Fallback: download the image
        downloadImage();
      }
    }, 'image/png');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/20 border-white/30 text-white hover:bg-white/30 border-2 border-dashed"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-gray-800">Share Your UX Ray Score</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Preview */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full h-auto max-w-sm mx-auto border-2 border-dashed border-gray-300 rounded"
              style={{ aspectRatio: '1/1' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 rounded-lg border-2 border-dashed border-gray-300 w-full h-full flex flex-col justify-center sketch-border"
                   style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                
                <h3 className="text-lg font-bold mb-2 hand-drawn-line">UX RAY ANALYSIS</h3>
                <div className="text-4xl font-bold mb-3">{score}/100</div>
                
                {/* Mini donut chart representation */}
                <div className="flex justify-center mb-3">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="#D1D5DB"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray="4,2"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="#10B981"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={`${(score / 100) * 163.4} 163.4`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">{score}%</span>
                    </div>
                  </div>
                </div>

                {betterThan && (
                  <div className="sketch-border bg-green-50 p-2 mb-3 text-xs">
                    <p className="text-green-800">
                      <strong>Better than {betterThan}%</strong><br />
                      of websites analyzed
                    </p>
                  </div>
                )}

                <div className="text-xs space-y-1 mb-3">
                  <p>✓ AI-Powered Analysis</p>
                  <p>✓ WCAG Compliance</p>
                  <p>✓ Performance Check</p>
                </div>
                
                {/* Decorative sketchy elements */}
                <div className="flex justify-center space-x-3 text-yellow-400 text-xs">
                  <span>★</span>
                  <span>→</span>
                  <span>📊</span>
                  <span>🚀</span>
                  <span>★</span>
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  Generated by UX RAY
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            <Button 
              onClick={shareToInstagram}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share to Instagram
            </Button>
            <Button 
              onClick={downloadImage}
              variant="outline"
              className="border-2 border-dashed border-gray-300"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareableScoreCard;
