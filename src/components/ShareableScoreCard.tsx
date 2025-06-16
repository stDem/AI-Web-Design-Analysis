
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

    // Paper-like background with texture
    ctx.fillStyle = '#F8F9FA';
    ctx.fillRect(0, 0, 1080, 1080);

    // Add paper grain texture
    for (let i = 0; i < 800; i++) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.03})`;
      ctx.fillRect(Math.random() * 1080, Math.random() * 1080, Math.random() * 2, Math.random() * 2);
    }

    // Hand-drawn outer border (multiple wobbly lines)
    ctx.strokeStyle = '#2D3748';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    // Draw multiple overlapping border lines for sketchy effect
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      const offset = Math.random() * 3;
      // Top line with wobbles
      ctx.moveTo(40 + offset, 40 + Math.random() * 3);
      for (let x = 40; x < 1040; x += 20) {
        ctx.lineTo(x + Math.random() * 4 - 2, 40 + Math.random() * 6 - 3);
      }
      ctx.lineTo(1040 + offset, 40 + Math.random() * 3);
      
      // Right line with wobbles
      for (let y = 40; y < 1040; y += 20) {
        ctx.lineTo(1040 + Math.random() * 6 - 3, y + Math.random() * 4 - 2);
      }
      ctx.lineTo(1040 + offset, 1040 + Math.random() * 3);
      
      // Bottom line with wobbles
      for (let x = 1040; x > 40; x -= 20) {
        ctx.lineTo(x + Math.random() * 4 - 2, 1040 + Math.random() * 6 - 3);
      }
      ctx.lineTo(40 + offset, 1040 + Math.random() * 3);
      
      // Left line with wobbles
      for (let y = 1040; y > 40; y -= 20) {
        ctx.lineTo(40 + Math.random() * 6 - 3, y + Math.random() * 4 - 2);
      }
      ctx.lineTo(40 + offset, 40 + Math.random() * 3);
      
      ctx.stroke();
    }

    // Sketchy title with hand-drawn underline
    ctx.fillStyle = '#1A202C';
    ctx.font = 'bold 65px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('UX RAY ANALYSIS', 80, 140);
    
    // Hand-drawn underline for title (wobbly)
    ctx.strokeStyle = '#4A5568';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 160);
    for (let x = 80; x < 520; x += 15) {
      ctx.lineTo(x + Math.random() * 3 - 1.5, 160 + Math.random() * 4 - 2);
    }
    ctx.stroke();

    // Hand-drawn box for main score
    ctx.strokeStyle = '#2D3748';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    
    // Draw sketchy rectangle with wobbly lines
    ctx.beginPath();
    ctx.moveTo(80, 200);
    for (let x = 80; x < 450; x += 25) {
      ctx.lineTo(x + Math.random() * 4 - 2, 200 + Math.random() * 3 - 1.5);
    }
    ctx.lineTo(450, 200);
    for (let y = 200; y < 320; y += 20) {
      ctx.lineTo(450 + Math.random() * 3 - 1.5, y + Math.random() * 4 - 2);
    }
    ctx.lineTo(450, 320);
    for (let x = 450; x > 80; x -= 25) {
      ctx.lineTo(x + Math.random() * 4 - 2, 320 + Math.random() * 3 - 1.5);
    }
    ctx.lineTo(80, 320);
    for (let y = 320; y > 200; y -= 20) {
      ctx.lineTo(80 + Math.random() * 3 - 1.5, y + Math.random() * 4 - 2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Score text
    ctx.fillStyle = '#1A202C';
    ctx.font = 'bold 90px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${score}`, 265, 280);
    ctx.font = '35px Arial';
    ctx.fillText('/100', 340, 250);

    // Hand-drawn donut chart
    const centerX = 650;
    const centerY = 260;
    const radius = 100;

    // Background circle (sketchy with multiple overlapping circles)
    ctx.strokeStyle = '#CBD5E0';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const segments = 24;
      for (let j = 0; j <= segments; j++) {
        const angle = (j / segments) * 2 * Math.PI;
        const x = centerX + (radius + Math.random() * 4 - 2) * Math.cos(angle);
        const y = centerY + (radius + Math.random() * 4 - 2) * Math.sin(angle);
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Score arc (sketchy green)
    ctx.strokeStyle = '#38A169';
    ctx.lineWidth = 18;
    const scoreAngle = (score / 100) * 2 * Math.PI;
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      const segments = Math.floor((score / 100) * 24);
      for (let j = 0; j <= segments; j++) {
        const angle = (j / 24) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + (radius + Math.random() * 3 - 1.5) * Math.cos(angle);
        const y = centerY + (radius + Math.random() * 3 - 1.5) * Math.sin(angle);
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Center score text
    ctx.fillStyle = '#1A202C';
    ctx.font = 'bold 42px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${score}%`, centerX, centerY + 8);

    // Hand-drawn "Better than" section
    if (betterThan) {
      ctx.strokeStyle = '#38A169';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(56, 161, 105, 0.1)';
      
      // Sketchy box for "better than"
      ctx.beginPath();
      ctx.moveTo(80, 360);
      for (let x = 80; x < 480; x += 30) {
        ctx.lineTo(x + Math.random() * 4 - 2, 360 + Math.random() * 3 - 1.5);
      }
      ctx.lineTo(480, 360);
      for (let y = 360; y < 430; y += 15) {
        ctx.lineTo(480 + Math.random() * 3 - 1.5, y + Math.random() * 4 - 2);
      }
      ctx.lineTo(480, 430);
      for (let x = 480; x > 80; x -= 30) {
        ctx.lineTo(x + Math.random() * 4 - 2, 430 + Math.random() * 3 - 1.5);
      }
      ctx.lineTo(80, 430);
      for (let y = 430; y > 360; y -= 15) {
        ctx.lineTo(80 + Math.random() * 3 - 1.5, y + Math.random() * 4 - 2);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#22543D';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Better than ${betterThan}%`, 100, 390);
      ctx.font = '20px Arial';
      ctx.fillText('of analyzed websites', 100, 415);
    }

    // Hand-drawn features section with sketchy checkboxes
    const features = [
      'AI-Powered Analysis',
      'WCAG Compliance Check', 
      'Performance Optimization',
      'UX Pattern Recognition'
    ];

    ctx.fillStyle = '#2D3748';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    
    features.forEach((feature, index) => {
      const y = 500 + index * 35;
      
      // Draw sketchy checkbox
      ctx.strokeStyle = '#38A169';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Wobbly square
      ctx.moveTo(80, y - 15);
      ctx.lineTo(95 + Math.random() * 2, y - 15 + Math.random() * 2);
      ctx.lineTo(95 + Math.random() * 2, y + Math.random() * 2);
      ctx.lineTo(80 + Math.random() * 2, y + Math.random() * 2);
      ctx.closePath();
      ctx.stroke();
      
      // Sketchy checkmark
      ctx.beginPath();
      ctx.moveTo(83, y - 5);
      ctx.lineTo(88 + Math.random(), y - 2 + Math.random());
      ctx.lineTo(92 + Math.random(), y - 10 + Math.random());
      ctx.stroke();
      
      ctx.fillText(feature, 110, y - 2);
    });

    // Add sketchy decorative elements
    drawSketchyArrow(ctx, 520, 400, 50);
    drawSketchyChart(ctx, 600, 480);
    drawSketchyStars(ctx, 720, 520);

    // Website info section with hand-drawn border
    ctx.strokeStyle = '#4A5568';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'rgba(247, 250, 252, 0.9)';
    
    // Large sketchy box for website info
    ctx.beginPath();
    ctx.moveTo(80, 680);
    for (let x = 80; x < 1000; x += 40) {
      ctx.lineTo(x + Math.random() * 5 - 2.5, 680 + Math.random() * 4 - 2);
    }
    ctx.lineTo(1000, 680);
    for (let y = 680; y < 820; y += 25) {
      ctx.lineTo(1000 + Math.random() * 4 - 2, y + Math.random() * 5 - 2.5);
    }
    ctx.lineTo(1000, 820);
    for (let x = 1000; x > 80; x -= 40) {
      ctx.lineTo(x + Math.random() * 5 - 2.5, 820 + Math.random() * 4 - 2);
    }
    ctx.lineTo(80, 820);
    for (let y = 820; y > 680; y -= 25) {
      ctx.lineTo(80 + Math.random() * 4 - 2, y + Math.random() * 5 - 2.5);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#1A202C';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('About UX RAY', 110, 720);
    
    ctx.font = '22px Arial';
    ctx.fillText('🤖 Powered by GPT-4 Vision & Claude 3.5', 110, 750);
    ctx.fillText('📊 Comprehensive Design Analysis Tool', 110, 775);
    ctx.fillText('🚀 Get actionable insights to improve your UX', 110, 800);

    // Hand-drawn footer with wobbly line
    ctx.strokeStyle = '#718096';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 860);
    for (let x = 100; x < 980; x += 30) {
      ctx.lineTo(x + Math.random() * 3 - 1.5, 860 + Math.random() * 4 - 2);
    }
    ctx.stroke();

    ctx.fillStyle = '#4A5568';
    ctx.font = '26px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Generated by UX RAY • uxray.ai', 540, 920);

    // Add sketchy corner decorations
    drawSketchyCornerDecoration(ctx, 900, 100);
    drawSketchyCornerDecoration(ctx, 150, 900);
  };

  const drawSketchyArrow = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.strokeStyle = '#4A5568';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    // Wobbly arrow line
    ctx.moveTo(x, y);
    for (let i = 0; i < 5; i++) {
      const segmentX = x + (size / 5) * (i + 1);
      const segmentY = y - (size / 2 / 5) * (i + 1);
      ctx.lineTo(segmentX + Math.random() * 3 - 1.5, segmentY + Math.random() * 3 - 1.5);
    }
    // Wobbly arrow head
    const endX = x + size;
    const endY = y - size / 2;
    ctx.moveTo(endX - 15 + Math.random() * 2, endY - 8 + Math.random() * 2);
    ctx.lineTo(endX + Math.random() * 2, endY + Math.random() * 2);
    ctx.lineTo(endX - 15 + Math.random() * 2, endY + 8 + Math.random() * 2);
    ctx.stroke();
  };

  const drawSketchyChart = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.strokeStyle = '#4A5568';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#E2E8F0';
    const bars = [20, 35, 28, 42, 32];
    bars.forEach((height, i) => {
      // Draw wobbly bars
      ctx.beginPath();
      ctx.moveTo(x + i * 25, y);
      for (let h = 0; h < height; h += 5) {
        ctx.lineTo(x + i * 25 + Math.random() * 2, y - h + Math.random() * 2);
      }
      ctx.lineTo(x + i * 25 + 15 + Math.random() * 2, y - height + Math.random() * 2);
      for (let h = height; h > 0; h -= 5) {
        ctx.lineTo(x + i * 25 + 15 + Math.random() * 2, y - h + Math.random() * 2);
      }
      ctx.lineTo(x + i * 25 + 15, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  };

  const drawSketchyStars = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = '#F6E05E';
    ctx.font = '28px Arial';
    for (let i = 0; i < 5; i++) {
      const starX = x + i * 25 + Math.random() * 3 - 1.5;
      const starY = y + Math.random() * 3 - 1.5;
      ctx.fillText('★', starX, starY);
    }
  };

  const drawSketchyCornerDecoration = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.strokeStyle = '#A0AEC0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Small decorative wobbly lines
    for (let i = 0; i < 4; i++) {
      const startX = x + i * 8 + Math.random() * 2;
      const startY = y + Math.random() * 2;
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + 12 + Math.random() * 3, startY + 12 + Math.random() * 3);
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
                        stroke="#CBD5E0"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray="4,2"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="#38A169"
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
