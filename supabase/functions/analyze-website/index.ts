
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.9';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      throw new Error('URL is required');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    console.log(`Starting analysis for URL: ${url}`);

    // Simulate website analysis (in a real implementation, you'd scrape the site)
    const analysisResult = await analyzeWebsite(url);
    
    // Store analysis in database
    const { data: analysisData, error: insertError } = await supabase
      .from('website_analyses')
      .insert({
        url: url,
        title: analysisResult.title,
        score: analysisResult.score,
        analysis_data: analysisResult
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    // Store training data for different features
    const trainingPromises = analysisResult.issues.map(async (issue: any) => {
      return supabase
        .from('training_data')
        .insert({
          website_id: analysisData.id,
          feature_type: issue.type,
          feature_data: { issue: issue.description, severity: issue.severity },
          quality_score: getQualityScore(issue.severity)
        });
    });

    await Promise.all(trainingPromises);

    console.log('Analysis completed and stored successfully');

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeWebsite(url: string) {
  // Simulate website analysis with realistic data
  const domain = new URL(url).hostname;
  
  // Generate realistic scores based on common patterns
  const baseScore = 60 + Math.floor(Math.random() * 30);
  
  const issues = generateRealisticIssues();
  const suggestions = issues.map(issue => `Improve ${issue.type}: ${issue.description}`);
  
  return {
    url,
    title: `Analysis for ${domain}`,
    score: baseScore,
    issues,
    suggestions,
    codeSuggestions: generateCodeSuggestions(),
    comparison: {
      competitors: [
        { name: 'Amazon AWS', score: 75, category: 'cloud' },
        { name: 'Google Cloud', score: 82, category: 'cloud' },
        { name: 'Shopify', score: 78, category: 'ecommerce' }
      ],
      betterThan: Math.floor(Math.random() * 40) + 30,
      position: 'top 25%'
    }
  };
}

function generateRealisticIssues() {
  const issueTypes = ['accessibility', 'performance', 'ux', 'code'];
  const severities = ['low', 'medium', 'high'];
  
  const possibleIssues = [
    { type: 'accessibility', description: 'Missing alt text on images', severity: 'medium' },
    { type: 'performance', description: 'Large image files slowing page load', severity: 'high' },
    { type: 'ux', description: 'Inconsistent button styles', severity: 'low' },
    { type: 'code', description: 'Unused CSS classes detected', severity: 'low' },
    { type: 'accessibility', description: 'Low color contrast on text', severity: 'high' },
    { type: 'performance', description: 'Too many HTTP requests', severity: 'medium' },
    { type: 'ux', description: 'Mobile navigation issues', severity: 'medium' }
  ];
  
  // Return 3-5 random issues
  const numIssues = 3 + Math.floor(Math.random() * 3);
  return possibleIssues
    .sort(() => Math.random() - 0.5)
    .slice(0, numIssues);
}

function generateCodeSuggestions() {
  return [
    {
      file: 'styles.css',
      issue: 'Missing focus styles for accessibility',
      before: '.button {\n  background: #007bff;\n  color: white;\n}',
      after: '.button {\n  background: #007bff;\n  color: white;\n}\n\n.button:focus {\n  outline: 2px solid #0056b3;\n  outline-offset: 2px;\n}',
      explanation: 'Adding focus styles improves keyboard navigation accessibility',
      type: 'accessibility' as const
    }
  ];
}

function getQualityScore(severity: string): number {
  switch (severity) {
    case 'high': return 30;
    case 'medium': return 60;
    case 'low': return 80;
    default: return 70;
  }
}
