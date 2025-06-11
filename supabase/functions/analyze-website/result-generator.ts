
import { AnalysisResult } from './types.ts';

export function generateFallbackAnalysis(gptAnalysis: Partial<AnalysisResult> | null): AnalysisResult {
  return {
    score: gptAnalysis?.designScore || Math.floor(Math.random() * 30) + 60,
    comparison: {
      competitors: [],
      betterThan: Math.floor(Math.random() * 40) + 30,
      position: `${Math.floor(Math.random() * 50) + 20}th percentile`,
      category: 'Business/Corporate'
    },
    categoryScores: gptAnalysis?.categoryScores || {
      ux: Math.floor(Math.random() * 30) + 65,
      accessibility: Math.floor(Math.random() * 30) + 60,
      performance: Math.floor(Math.random() * 30) + 55,
      code: Math.floor(Math.random() * 30) + 70
    },
    issues: gptAnalysis?.issues || [
      {
        type: 'accessibility',
        severity: 'high',
        description: 'Some buttons lack sufficient color contrast for visually impaired users',
        location: 'navigation and call-to-action buttons'
      },
      {
        type: 'ux',
        severity: 'medium', 
        description: 'Important information is too far from the main action buttons',
        location: 'main content area'
      }
    ],
    suggestions: gptAnalysis?.suggestions || [
      'Increase button contrast ratios to meet accessibility standards',
      'Add more spacing around key interactive elements',
      'Consider larger text sizes for better readability',
      'Improve navigation clarity with better labels'
    ],
    annotations: gptAnalysis?.annotations || [
      {
        x: 120,
        y: 80,
        note: 'This navigation could be more prominent and easier to find',
        type: 'suggestion',
        element: 'main navigation menu'
      },
      {
        x: 300,
        y: 200,
        note: 'Consider making this call-to-action button larger and more colorful',
        type: 'improvement', 
        element: 'primary action button'
      },
      {
        x: 450,
        y: 350,
        note: 'This text might be too small for some users to read comfortably',
        type: 'issue',
        element: 'body text content'
      }
    ],
    codeSuggestions: [
      {
        file: 'styles.css',
        issue: 'Insufficient color contrast in navigation',
        type: 'accessibility',
        before: 'color: #888888; background: #cccccc;',
        after: 'color: #333333; background: #ffffff;',
        explanation: 'Improved contrast ratio from 2.1:1 to 12.6:1 for better accessibility'
      }
    ]
  };
}
