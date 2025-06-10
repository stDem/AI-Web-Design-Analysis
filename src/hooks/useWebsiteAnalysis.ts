
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisResult {
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

export const useWebsiteAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeWebsite = async (url: string) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      console.log('Starting analysis for:', url);
      
      const { data, error: functionError } = await supabase.functions.invoke('analyze-website', {
        body: { url }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data) {
        setAnalysisResults(data);
        console.log('Analysis completed:', data);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeWebsite,
    isAnalyzing,
    analysisResults,
    error,
    setAnalysisResults
  };
};
