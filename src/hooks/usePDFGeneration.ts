
import { useCallback } from 'react';

interface AnalysisResults {
  score: number;
  comparison?: {
    betterThan: number;
    position: string;
    category: string;
  };
  accessibility: {
    score: number;
    issues: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }>;
  };
  performance: {
    score: number;
    issues: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }>;
  };
  ux: {
    score: number;
    issues: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }>;
  };
  codeQuality: {
    score: number;
    issues: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }>;
  };
  suggestions: string[];
  competitiveAnalysis?: {
    competitors: Array<{
      name: string;
      score: number;
      strengths: string[];
      weaknesses: string[];
    }>;
  };
}

export const usePDFGeneration = () => {
  const generatePDF = useCallback(async (analysisResults: AnalysisResults, websiteUrl: string) => {
    try {
      console.log('Starting PDF generation for:', websiteUrl);
      
      // Collect all issues from different categories
      const allIssues = [
        ...analysisResults.accessibility.issues,
        ...analysisResults.performance.issues,
        ...analysisResults.ux.issues,
        ...analysisResults.codeQuality.issues
      ];

      // Create a comprehensive HTML report
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>UX Ray Analysis Report</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 40px; 
              color: #333; 
              line-height: 1.6;
            }
            .header { 
              border-bottom: 3px solid #6366f1; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
              text-align: center;
            }
            .logo {
              font-size: 2em;
              font-weight: bold;
              color: #6366f1;
              margin-bottom: 10px;
            }
            .score-section { 
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); 
              padding: 30px; 
              border-radius: 12px; 
              margin: 30px 0; 
              text-align: center;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .score { 
              font-size: 64px; 
              font-weight: bold; 
              color: #6366f1; 
              margin-bottom: 10px;
            }
            .comparison { 
              background: #ecfdf5; 
              padding: 20px; 
              border-radius: 8px; 
              margin: 20px 0; 
              border-left: 4px solid #10b981;
            }
            .categories {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin: 30px 0;
            }
            .category {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .category-score {
              font-size: 2em;
              font-weight: bold;
              color: #6366f1;
            }
            .issues { 
              margin: 30px 0; 
            }
            .issue { 
              margin: 15px 0; 
              padding: 15px; 
              border-left: 4px solid #ef4444; 
              background: #fef2f2; 
              border-radius: 0 8px 8px 0;
            }
            .issue.medium { 
              border-color: #f59e0b; 
              background: #fffbeb; 
            }
            .issue.low { 
              border-color: #10b981; 
              background: #f0fdf4; 
            }
            .suggestions { 
              background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%); 
              padding: 25px; 
              border-radius: 12px; 
              margin: 30px 0;
            }
            .competitive-analysis {
              background: #fefce8;
              padding: 25px;
              border-radius: 12px;
              margin: 30px 0;
            }
            .competitor {
              background: white;
              padding: 15px;
              margin: 10px 0;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            h1, h2, h3 { color: #1f2937; }
            .severity-high { color: #dc2626; font-weight: bold; }
            .severity-medium { color: #d97706; font-weight: bold; }
            .severity-low { color: #059669; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🐟 UX RAY</div>
            <h1>Design Analysis Report</h1>
            <p><strong>Website:</strong> ${websiteUrl}</p>
            <p><strong>Analysis Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="score-section">
            <div class="score">${analysisResults.score}/100</div>
            <h2>Overall Design Score</h2>
            ${analysisResults.comparison ? `
              <div class="comparison">
                <strong>🏆 Better than ${analysisResults.comparison.betterThan}%</strong> of websites in the ${analysisResults.comparison.category} category
              </div>
            ` : ''}
          </div>

          <div class="categories">
            <div class="category">
              <h3>♿ Accessibility</h3>
              <div class="category-score">${analysisResults.accessibility.score}/100</div>
              <p>${analysisResults.accessibility.issues.length} issues found</p>
            </div>
            <div class="category">
              <h3>⚡ Performance</h3>
              <div class="category-score">${analysisResults.performance.score}/100</div>
              <p>${analysisResults.performance.issues.length} issues found</p>
            </div>
            <div class="category">
              <h3>🎨 User Experience</h3>
              <div class="category-score">${analysisResults.ux.score}/100</div>
              <p>${analysisResults.ux.issues.length} issues found</p>
            </div>
            <div class="category">
              <h3>💻 Code Quality</h3>
              <div class="category-score">${analysisResults.codeQuality.score}/100</div>
              <p>${analysisResults.codeQuality.issues.length} issues found</p>
            </div>
          </div>
          
          ${allIssues.length > 0 ? `
            <div class="issues">
              <h2>🔍 Issues Found (${allIssues.length})</h2>
              ${allIssues.map(issue => `
                <div class="issue ${issue.severity}">
                  <strong>${issue.type.toUpperCase()} - <span class="severity-${issue.severity}">${issue.severity.toUpperCase()}</span></strong>
                  <p>${issue.description}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${analysisResults.competitiveAnalysis ? `
            <div class="competitive-analysis">
              <h2>🏁 Competitive Analysis</h2>
              ${analysisResults.competitiveAnalysis.competitors.map(competitor => `
                <div class="competitor">
                  <h4>${competitor.name} - Score: ${competitor.score}/100</h4>
                  <p><strong>Strengths:</strong> ${competitor.strengths.join(', ')}</p>
                  <p><strong>Areas for improvement:</strong> ${competitor.weaknesses.join(', ')}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${analysisResults.suggestions && analysisResults.suggestions.length > 0 ? `
            <div class="suggestions">
              <h2>💡 Recommendations</h2>
              <ul>
                ${analysisResults.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <div style="margin-top: 50px; text-align: center; color: #6b7280; font-size: 0.9em;">
            <p>Generated by UX Ray - AI-Powered Design Analysis</p>
            <p>Visit our website for more insights and analysis tools</p>
          </div>
        </body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ux-ray-analysis-${websiteUrl.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().getTime()}.html`;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      URL.revokeObjectURL(url);

      console.log('PDF generation completed successfully');
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return false;
    }
  }, []);

  return { generatePDF };
};
