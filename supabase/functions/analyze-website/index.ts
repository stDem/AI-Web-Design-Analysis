
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from './cors.ts';
import { fetchWebsiteContent } from './fetcher.ts';
import { analyzeWithGPT } from './gpt-analyzer.ts';
import { generateFallbackAnalysis } from './result-generator.ts';
import { analyzeCompetitors } from './competitor-analyzer.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    console.log('Analyzing website:', url);

    // Fetch website content
    const { content: htmlContent, title, description } = await fetchWebsiteContent(url);
    console.log('Website content fetched, length:', htmlContent.length);

    // Get competitor analysis
    const competitorAnalysis = await analyzeCompetitors(htmlContent, title, description, url);

    // Get GPT analysis with actual content
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const gptAnalysis = await analyzeWithGPT(
      htmlContent,
      title,
      url,
      competitorAnalysis.category,
      openAIApiKey
    );

    // Generate final results with real content analysis
    const analysisResults = generateFallbackAnalysis(gptAnalysis, htmlContent, title, url);

    // Add competitor data to results
    analysisResults.comparison = {
      ...analysisResults.comparison,
      competitors: competitorAnalysis.competitors,
      category: competitorAnalysis.category,
      suggestedAnalysis: competitorAnalysis.suggestedAnalysis
    };

    console.log('Analysis completed for:', url);
    
    return new Response(JSON.stringify(analysisResults), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-website function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Analysis failed', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
