
import { useCallback } from 'react';

interface AnalysisData {
  score: number;
  comparison?: {
    betterThan: number;
    position: string;
    category: string;
  };
  issues: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  suggestions: string[];
}

export const usePDFGeneration = () => {
  const generatePDF = useCallback(async (analysisData: AnalysisData, websiteUrl: string) => {
    try {
      // Create a simplified HTML report
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>UX Ray Analysis Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { border-bottom: 3px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
            .score-section { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .score { font-size: 48px; font-weight: bold; color: #6366f1; }
            .comparison { background: #ecfdf5; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .issues { margin: 20px 0; }
            .issue { margin: 10px 0; padding: 10px; border-left: 4px solid #ef4444; background: #fef2f2; }
            .issue.medium { border-color: #f59e0b; background: #fffbeb; }
            .issue.low { border-color: #10b981; background: #f0fdf4; }
            .suggestions { background: #f0f9ff; padding: 20px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>UX Ray Analysis Report</h1>
            <p><strong>Website:</strong> ${websiteUrl}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="score-section">
            <div class="score">${analysisData.score}/100</div>
            <h2>Overall Design Score</h2>
            ${analysisData.comparison ? `
              <div class="comparison">
                <strong>Better than ${analysisData.comparison.betterThan}%</strong> of websites in the ${analysisData.comparison.category} category
              </div>
            ` : ''}
          </div>
          
          <div class="issues">
            <h2>Issues Found (${analysisData.issues.length})</h2>
            ${analysisData.issues.map(issue => `
              <div class="issue ${issue.severity}">
                <strong>${issue.type.toUpperCase()} - ${issue.severity.toUpperCase()}</strong>
                <p>${issue.description}</p>
              </div>
            `).join('')}
          </div>
          
          <div class="suggestions">
            <h2>Recommendations</h2>
            <ul>
              ${analysisData.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
            </ul>
          </div>
        </body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ux-ray-analysis-${new Date().getTime()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return false;
    }
  }, []);

  const shareAnalysis = useCallback(async (analysisData: AnalysisData, websiteUrl: string) => {
    const success = await generatePDF(analysisData, websiteUrl);
    
    if (success && navigator.share) {
      try {
        await navigator.share({
          title: 'UX Ray Analysis Results',
          text: `My website scored ${analysisData.score}/100 in UX analysis! Check out the detailed report.`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else if (success) {
      // Fallback: copy link to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert('Analysis downloaded! Link copied to clipboard.');
    } else {
      alert('Failed to generate analysis report.');
    }
  }, [generatePDF]);

  return { generatePDF, shareAnalysis };
};
