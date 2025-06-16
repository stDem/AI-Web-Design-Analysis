
import React, { useRef } from 'react';
import { Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ShareableScoreCardProps {
  score: number;
  betterThan?: number;
}

const ShareableScoreCard: React.FC<ShareableScoreCardProps> = ({ score, betterThan }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const downloadForInstagram = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for Instagram (1080x1080)
    canvas.width = 1080;
    canvas.height = 1080;

    // Background with sketchy paper texture
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 1080, 1080);

    // Add sketchy border
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 8;
    ctx.setLineDash([20, 10]);
    ctx.strokeRect(40, 40, 1000, 1000);
    ctx.setLineDash([]);

    // Title - sketchy style
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Design Score', 80, 180);

    // Add underline sketch
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(80, 200);
    ctx.lineTo(480, 205);
    ctx.stroke();

    // Large score
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 180px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${score}`, 80, 400);

    ctx.fillStyle = '#6b7280';
    ctx.font = 'bold 120px Arial';
    ctx.fillText('/100', 280, 400);

    // Draw sketchy circle chart
    const centerX = 700;
    const centerY = 300;
    const radius = 120;

    // Background circle (sketchy)
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Score arc (sketchy)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, (-Math.PI / 2) + (2 * Math.PI * score / 100));
    ctx.stroke();

    // Score text in center
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${score}%`, centerX, centerY + 10);

    // Sketchy arrows and doodles
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 6;
    
    // Arrow pointing to score
    ctx.beginPath();
    ctx.moveTo(300, 500);
    ctx.lineTo(400, 550);
    ctx.lineTo(380, 530);
    ctx.moveTo(400, 550);
    ctx.lineTo(380, 570);
    ctx.stroke();

    // "GOOD!" text with sketchy style
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('GOOD!', 420, 575);

    // Better than percentage
    if (betterThan) {
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 42px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Better than ${betterThan}%`, 80, 680);
      ctx.fillText('of websites', 80, 730);

      // Sketchy star
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      const starX = 500;
      const starY = 680;
      for (let i = 0; i < 5; i++) {
        const angle = (i * 144 - 90) * Math.PI / 180;
        const x = starX + Math.cos(angle) * 25;
        const y = starY + Math.sin(angle) * 25;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }

    // Add sketchy decorative elements
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 3;
    
    // Sketchy lines around
    ctx.beginPath();
    ctx.moveTo(100, 800);
    ctx.lineTo(300, 820);
    ctx.moveTo(600, 800);
    ctx.lineTo(900, 815);
    ctx.stroke();

    // Small sketchy charts
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 4;
    
    // Mini bar chart
    const barX = 150;
    const barY = 850;
    for (let i = 0; i < 4; i++) {
      const height = 30 + Math.random() * 40;
      ctx.fillStyle = i === 2 ? '#10b981' : '#94a3b8';
      ctx.fillRect(barX + i * 25, barY - height, 20, height);
    }

    // Branding
    ctx.fillStyle = '#6b7280';
    ctx.font = '28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('UX Ray Analysis', 540, 980);

    // Download the image
    const link = document.createElement('a');
    link.download = `design-score-${score}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50 border-2 border-dashed border-blue-300 transform -rotate-1" 
            style={{ 
              boxShadow: '6px 6px 12px rgba(0,0,0,0.1)',
              fontFamily: '"Comic Sans MS", cursive'
            }}>
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-800" 
                style={{ fontFamily: '"Marker Felt", "Comic Sans MS", cursive' }}>
              Instagram Ready!
            </h3>
            <div className="text-6xl">📱</div>
          </div>
          
          <div className="bg-white/80 rounded-lg p-6 border-2 border-dashed border-gray-300 transform rotate-1">
            <div className="text-4xl font-bold text-green-600 mb-2">{score}/100</div>
            <div className="text-lg text-gray-700 mb-2">Design Score</div>
            {betterThan && (
              <div className="text-sm text-blue-600 font-medium">
                Better than {betterThan}% of websites! 🎉
              </div>
            )}
          </div>

          <Button 
            onClick={downloadForInstagram}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg border-2 border-dashed border-purple-300 transform hover:scale-105 transition-all duration-200"
            style={{ 
              boxShadow: '4px 4px 8px rgba(0,0,0,0.1)',
              fontFamily: '"Comic Sans MS", cursive'
            }}
          >
            <Share className="h-5 w-5 mr-2" />
            Download for Instagram
          </Button>
          
          <div className="text-xs text-gray-500 italic">
            Perfect 1080x1080 square format with sketchy design elements
          </div>
        </div>
      </Card>

      <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }}
        width={1080} 
        height={1080}
      />
    </div>
  );
};

export default ShareableScoreCard;
