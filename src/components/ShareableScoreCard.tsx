
import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Instagram, X } from 'lucide-react';

interface ShareableScoreCardProps {
  score: number;
  onClose: () => void;
  onDownload: () => void;
}

const ShareableScoreCard: React.FC<ShareableScoreCardProps> = ({ score, onClose, onDownload }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for Instagram (1080x1080)
    canvas.width = 1080;
    canvas.height = 1080;

    // Background gradient (same colors as original)
    const gradient = ctx.createLinearGradient(0, 0, 1080, 0);
    gradient.addColorStop(0, '#4b5563'); // gray-600
    gradient.addColorStop(1, '#334155'); // slate-700
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Add sketchy border effect
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 8;
    ctx.setLineDash([20, 15]);
    
    // Draw multiple sketchy border lines for hand-drawn effect
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.rect(40 + i * 2, 40 + i * 2, 1000 - i * 4, 1000 - i * 4);
      ctx.stroke();
    }
    
    ctx.setLineDash([]); // Reset line dash

    // Title "Design Score" with sketchy font effect
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px serif';
    ctx.textAlign = 'left';
    
    // Add text shadow for depth
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillText('Design Score', 102, 202);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Design Score', 100, 200);

    // Main score with larger, bolder text
    ctx.font = 'bold 180px serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillText(`${score}/100`, 102, 402);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${score}/100`, 100, 400);

    // Draw sketchy donut chart
    const centerX = 750;
    const centerY = 300;
    const radius = 140;
    const innerRadius = 90;

    // Background circle (sketchy)
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 12;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(centerX + Math.random() * 4 - 2, centerY + Math.random() * 4 - 2, radius + i, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Score arc (green, sketchy)
    const scoreAngle = (score / 100) * 2 * Math.PI - Math.PI / 2;
    ctx.strokeStyle = '#10b981'; // green-500
    ctx.lineWidth = 25;
    
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.arc(centerX + Math.random() * 3 - 1.5, centerY + Math.random() * 3 - 1.5, radius - 12 + i * 2, -Math.PI / 2, scoreAngle);
      ctx.stroke();
    }

    // Inner circle text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillText(`${score}%`, centerX + 2, centerY + 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${score}%`, centerX, centerY);

    ctx.font = '24px serif';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('Overall Score', centerX, centerY + 40);

    // Add sketchy decorative elements inspired by the reference
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    
    // Draw some sketchy arrows and decorative elements
    const drawSketchyArrow = (x: number, y: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(20, 0);
      ctx.moveTo(15, -8);
      ctx.lineTo(20, 0);
      ctx.lineTo(15, 8);
      ctx.stroke();
      ctx.restore();
    };

    // Add some decorative sketchy arrows
    drawSketchyArrow(200, 500, Math.PI / 4);
    drawSketchyArrow(400, 600, -Math.PI / 6);
    drawSketchyArrow(800, 500, Math.PI / 3);

    // Draw sketchy dots pattern
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    for (let i = 0; i < 20; i++) {
      const x = 100 + Math.random() * 300;
      const y = 700 + Math.random() * 200;
      ctx.beginPath();
      ctx.arc(x, y, 2 + Math.random() * 3, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Add "Better than X% of websites" text
    ctx.fillStyle = '#ffffff';
    ctx.font = '36px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Better than 75% of websites', 540, 700);

    // Add small sketchy chart elements
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    
    // Small bar chart sketch
    for (let i = 0; i < 5; i++) {
      const barHeight = 30 + Math.random() * 40;
      ctx.fillStyle = i === 2 ? '#10b981' : 'rgba(255,255,255,0.3)';
      ctx.fillRect(200 + i * 25, 800 - barHeight, 20, barHeight);
      
      // Add sketchy outline
      ctx.strokeRect(200 + i * 25, 800 - barHeight, 20, barHeight);
    }

    // UX Ray branding
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = 'bold 28px serif';
    ctx.textAlign = 'center';
    ctx.fillText('UX Ray Analysis', 540, 950);

    // Add some hand-drawn style imperfections
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 1080, Math.random() * 1080);
      ctx.lineTo(Math.random() * 1080, Math.random() * 1080);
      ctx.stroke();
    }

  }, [score]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create download link
    const link = document.createElement('a');
    link.download = `ux-ray-score-${score}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    onDownload();
  };

  const handleShareInstagram = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      
      if (navigator.share && navigator.canShare({ files: [new File([blob], 'ux-ray-score.png', { type: 'image/png' })] })) {
        navigator.share({
          title: 'UX Ray Design Score',
          text: `My website scored ${score}/100 in UX analysis!`,
          files: [new File([blob], 'ux-ray-score.png', { type: 'image/png' })]
        });
      } else {
        // Fallback: download the image
        handleDownload();
      }
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Share Your Design Score</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-center mb-6">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto border-2 border-gray-200 rounded-lg"
              style={{ maxHeight: '400px' }}
            />
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Image
            </Button>
            <Button onClick={handleShareInstagram} variant="outline" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              Share to Instagram
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 text-center mt-4">
            Perfect 1080x1080 format for Instagram posts
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShareableScoreCard;
