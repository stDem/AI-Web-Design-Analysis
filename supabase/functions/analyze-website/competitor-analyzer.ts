
import { discoverCompetitors } from './competitor-discovery.ts';

export async function analyzeCompetitors(
  htmlContent: string,
  title: string,
  description: string,
  url: string
): Promise<{
  competitors: Array<{ 
    name: string; 
    score: number; 
    category: string;
    url?: string;
    description?: string;
  }>;
  category: string;
  suggestedAnalysis?: Array<{
    name: string;
    url: string;
    reason: string;
    popularity: string;
  }>;
}> {
  console.log('Starting dynamic competitor analysis for:', url);
  
  // Get OpenAI API key for enhanced analysis
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  try {
    // Use the new dynamic competitor discovery
    const result = await discoverCompetitors(
      htmlContent,
      title,
      description,
      url,
      openAIApiKey
    );
    
    console.log('Dynamic competitor analysis completed:', result.competitors.length, 'competitors found');
    return result;
    
  } catch (error) {
    console.error('Dynamic competitor analysis failed:', error);
    
    // Return minimal fallback instead of predefined arrays
    return {
      competitors: [{
        name: "Analysis temporarily unavailable",
        score: 0,
        category: "General",
        description: "Competitor analysis is temporarily unavailable. Please try again later."
      }],
      category: "General Business",
      suggestedAnalysis: []
    };
  }
}
