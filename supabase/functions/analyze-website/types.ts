
export interface AnalysisResult {
  score: number;
  comparison: {
    competitors: Array<{ 
      name: string; 
      score: number; 
      category: string;
      url?: string;
      description?: string;
    }>;
    betterThan: number;
    position: string;
    category: string;
    suggestedAnalysis?: Array<{
      name: string;
      url: string;
      reason: string;
      popularity: string;
    }>;
  };
  categoryScores: {
    ux: number;
    accessibility: number;
    performance: number;
    code: number;
  };
  issues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    location?: string;
  }>;
  suggestions: string[];
  annotations: Array<{
    x: number;
    y: number;
    note: string;
    type: 'improvement' | 'issue' | 'suggestion';
    element: string;
  }>;
  codeSuggestions?: Array<{
    file: string;
    issue: string;
    type: 'performance' | 'accessibility' | 'maintainability' | 'security';
    before: string;
    after: string;
    explanation: string;
  }>;
}

export interface CompetitorAnalysis {
  category: string;
  competitors: Array<{
    name: string;
    score: number;
    category: string;
    url?: string;
    description?: string;
  }>;
  suggestedAnalysis: Array<{
    name: string;
    url: string;
    reason: string;
    popularity: string;
  }>;
}
