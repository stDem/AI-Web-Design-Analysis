
import { supabase } from "@/integrations/supabase/client";

export interface AnalysisRequest {
  url: string;
}

export interface AnalysisResult {
  url: string;
  title: string;
  score: number;
  issues: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  suggestions: string[];
  codeSuggestions?: Array<{
    file: string;
    issue: string;
    before: string;
    after: string;
    explanation: string;
    type: 'performance' | 'accessibility' | 'maintainability' | 'security';
  }>;
  comparison?: {
    competitors: Array<{ name: string; score: number; category: string }>;
    betterThan: number;
    position: string;
  };
}

export class AnalysisService {
  static async analyzeWebsite(url: string): Promise<AnalysisResult> {
    console.log(`Analyzing website: ${url}`);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-website', {
        body: { url }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Analysis failed: ${error.message}`);
      }

      return data as AnalysisResult;
    } catch (error) {
      console.error('Analysis service error:', error);
      throw error;
    }
  }

  static async getAnalysisHistory(): Promise<any[]> {
    const { data, error } = await supabase
      .from('website_analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching analysis history:', error);
      return [];
    }

    return data || [];
  }

  static async getCompetitiveData(category?: string): Promise<any[]> {
    let query = supabase
      .from('competitive_data')
      .select('*');

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching competitive data:', error);
      return [];
    }

    return data || [];
  }
}
