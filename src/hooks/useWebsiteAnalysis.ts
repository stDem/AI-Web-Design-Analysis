
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AnalysisResult {
  id: string;
  score: number;
  comparison: {
    competitors: Array<{ name: string; score: number; category: string }>;
    betterThan: number;
    position: string;
  };
  issues: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  suggestions: string[];
  codeSuggestions: Array<{
    file: string;
    issue: string;
    before: string;
    after: string;
    explanation: string;
    type: 'performance' | 'accessibility' | 'maintainability' | 'security';
  }>;
  categoryScores: {
    ux: number;
    accessibility: number;
    performance: number;
    code: number;
  };
  annotations: Array<{
    x: number;
    y: number;
    content: string;
    type: 'improvement' | 'issue' | 'good';
  }>;
  url: string;
  title: string;
}

export const useWebsiteAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeWebsite = async (url: string) => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      console.log('Starting website analysis for:', url);
      
      const { data, error } = await supabase.functions.invoke('analyze-website', {
        body: { url }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.success) {
        setResults(data.data);
        toast({
          title: "Analysis Complete",
          description: `Website analysis completed with a score of ${data.data.score}/100`,
        });
      } else {
        throw new Error(data?.error || 'Analysis failed');
      }

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Something went wrong during analysis",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearResults = () => {
    setResults(null);
  };

  return {
    analyzeWebsite,
    clearResults,
    isAnalyzing,
    results
  };
};
