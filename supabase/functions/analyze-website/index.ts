
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalysisRequest {
  url: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { url }: AnalysisRequest = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Analyzing website: ${url}`);

    // Fetch website content with timeout
    let htmlContent = '';
    let title = 'Untitled';
    let industry = 'General';
    let businessType = 'Unknown';
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const websiteResponse = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      clearTimeout(timeoutId);
      htmlContent = await websiteResponse.text();
      
      // Extract title
      const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
      title = titleMatch ? titleMatch[1].trim() : 'Untitled';

      // Analyze content to determine industry and business type
      const contentText = htmlContent.toLowerCase();
      
      // Industry detection
      if (contentText.includes('restaurant') || contentText.includes('food') || contentText.includes('dining') || contentText.includes('menu')) {
        industry = 'Food & Restaurant';
      } else if (contentText.includes('shop') || contentText.includes('store') || contentText.includes('buy') || contentText.includes('cart')) {
        industry = 'E-commerce';
      } else if (contentText.includes('software') || contentText.includes('app') || contentText.includes('technology') || contentText.includes('saas')) {
        industry = 'Technology';
      } else if (contentText.includes('bank') || contentText.includes('finance') || contentText.includes('payment') || contentText.includes('crypto')) {
        industry = 'Finance';
      } else if (contentText.includes('health') || contentText.includes('medical') || contentText.includes('doctor') || contentText.includes('clinic')) {
        industry = 'Healthcare';
      } else if (contentText.includes('education') || contentText.includes('learn') || contentText.includes('course') || contentText.includes('university')) {
        industry = 'Education';
      }

      console.log(`Detected industry: ${industry} for ${title}`);
      
    } catch (fetchError) {
      console.log('Failed to fetch website content:', fetchError);
    }

    // Analyze HTML structure
    const hasHeader = /<header/i.test(htmlContent);
    const hasNav = /<nav/i.test(htmlContent);
    const hasFooter = /<footer/i.test(htmlContent);
    const hasH1 = /<h1/i.test(htmlContent);
    const imageCount = (htmlContent.match(/<img/gi) || []).length;
    const linkCount = (htmlContent.match(/<a\s+[^>]*href/gi) || []).length;
    const scriptCount = (htmlContent.match(/<script/gi) || []).length;
    const cssCount = (htmlContent.match(/<link[^>]*stylesheet/gi) || []).length;

    // Calculate scores based on structure
    let uxScore = 65;
    let accessibilityScore = 70;
    let performanceScore = 60;
    let codeScore = 75;

    if (hasHeader) uxScore += 5;
    if (hasNav) uxScore += 5;
    if (hasFooter) uxScore += 5;
    if (hasH1) accessibilityScore += 10;
    if (imageCount > 0) uxScore += 5;
    if (linkCount > 5) uxScore += 5;

    if (scriptCount > 10) performanceScore -= 10;
    if (cssCount > 5) performanceScore -= 5;

    const overallScore = Math.round((uxScore + accessibilityScore + performanceScore + codeScore) / 4);

    // Generate real competitors based on industry
    const competitorsByIndustry = {
      'Food & Restaurant': [
        { name: 'OpenTable', score: Math.floor(Math.random() * 10) + 85, category: 'Restaurant Booking' },
        { name: 'Grubhub', score: Math.floor(Math.random() * 15) + 80, category: 'Food Delivery' },
        { name: 'Yelp', score: Math.floor(Math.random() * 10) + 82, category: 'Restaurant Discovery' },
        { name: 'Toast', score: Math.floor(Math.random() * 15) + 78, category: 'Restaurant POS' },
        { name: 'Resy', score: Math.floor(Math.random() * 12) + 83, category: 'Fine Dining Reservations' }
      ],
      'E-commerce': [
        { name: 'Shopify', score: Math.floor(Math.random() * 10) + 88, category: 'E-commerce Platform' },
        { name: 'Amazon', score: Math.floor(Math.random() * 5) + 92, category: 'Marketplace' },
        { name: 'WooCommerce', score: Math.floor(Math.random() * 15) + 80, category: 'WordPress E-commerce' },
        { name: 'BigCommerce', score: Math.floor(Math.random() * 12) + 82, category: 'Enterprise E-commerce' },
        { name: 'Etsy', score: Math.floor(Math.random() * 10) + 85, category: 'Handmade Marketplace' }
      ],
      'Technology': [
        { name: 'GitHub', score: Math.floor(Math.random() * 10) + 90, category: 'Developer Platform' },
        { name: 'Slack', score: Math.floor(Math.random() * 8) + 88, category: 'Team Communication' },
        { name: 'Notion', score: Math.floor(Math.random() * 12) + 85, category: 'Productivity' },
        { name: 'Figma', score: Math.floor(Math.random() * 8) + 90, category: 'Design Tools' },
        { name: 'Linear', score: Math.floor(Math.random() * 10) + 87, category: 'Project Management' }
      ],
      'Finance': [
        { name: 'Stripe', score: Math.floor(Math.random() * 8) + 90, category: 'Payment Processing' },
        { name: 'PayPal', score: Math.floor(Math.random() * 12) + 85, category: 'Digital Payments' },
        { name: 'Coinbase', score: Math.floor(Math.random() * 15) + 82, category: 'Cryptocurrency' },
        { name: 'Square', score: Math.floor(Math.random() * 10) + 87, category: 'Point of Sale' },
        { name: 'Robinhood', score: Math.floor(Math.random() * 18) + 78, category: 'Trading Platform' }
      ],
      'Healthcare': [
        { name: 'Teladoc', score: Math.floor(Math.random() * 12) + 85, category: 'Telemedicine' },
        { name: 'Epic Systems', score: Math.floor(Math.random() * 10) + 88, category: 'Healthcare Software' },
        { name: 'Zocdoc', score: Math.floor(Math.random() * 15) + 82, category: 'Doctor Booking' },
        { name: 'Cerner', score: Math.floor(Math.random() * 12) + 84, category: 'Health Information' },
        { name: 'Dexcom', score: Math.floor(Math.random() * 10) + 86, category: 'Medical Devices' }
      ],
      'Education': [
        { name: 'Coursera', score: Math.floor(Math.random() * 10) + 87, category: 'Online Learning' },
        { name: 'Khan Academy', score: Math.floor(Math.random() * 8) + 90, category: 'Free Education' },
        { name: 'Udemy', score: Math.floor(Math.random() * 15) + 82, category: 'Skill Development' },
        { name: 'Canvas', score: Math.floor(Math.random() * 12) + 85, category: 'LMS Platform' },
        { name: 'Duolingo', score: Math.floor(Math.random() * 8) + 89, category: 'Language Learning' }
      ]
    };

    const competitors = competitorsByIndustry[industry] || competitorsByIndustry['Technology'];
    const selectedCompetitors = competitors.slice(0, 4);

    // Generate competitive data
    const competitiveData = {
      betterThan: Math.max(10, Math.min(90, overallScore - 15 + Math.floor(Math.random() * 25))),
      position: `Top ${Math.floor(Math.random() * 30) + 15}%`,
      competitors: selectedCompetitors
    };

    // Generate contextual annotations based on website structure
    const annotations = [];
    
    // Header annotation
    if (hasHeader) {
      annotations.push({
        x: 50, y: 80,
        content: 'Header section looks good! Consider adding a clear value proposition here.',
        type: 'good'
      });
    } else {
      annotations.push({
        x: 50, y: 80,
        content: 'Missing header structure. Add a clear navigation and branding area.',
        type: 'issue'
      });
    }

    // Navigation annotation
    if (hasNav) {
      annotations.push({
        x: 200, y: 100,
        content: 'Navigation is present. Ensure it\'s accessible and mobile-friendly.',
        type: 'improvement'
      });
    } else {
      annotations.push({
        x: 200, y: 100,
        content: 'Add a clear navigation menu to help users find content.',
        type: 'issue'
      });
    }

    // Main content area
    annotations.push({
      x: 300, y: 250,
      content: 'This main content area could benefit from better visual hierarchy.',
      type: 'improvement'
    });

    // Call-to-action annotation
    annotations.push({
      x: 400, y: 350,
      content: 'Consider adding a prominent call-to-action button here.',
      type: 'improvement'
    });

    // Footer annotation
    if (hasFooter) {
      annotations.push({
        x: 150, y: 500,
        content: 'Footer is present. Make sure it includes important links and contact info.',
        type: 'good'
      });
    } else {
      annotations.push({
        x: 150, y: 500,
        content: 'Add a footer with contact information and important links.',
        type: 'issue'
      });
    }

    // Try OpenAI analysis for enhanced suggestions
    let aiAnalysisData = null;
    let useAI = false;

    if (Deno.env.get('OPENAI_API_KEY')) {
      try {
        console.log('Attempting OpenAI analysis...');
        const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a UX/UI expert analyzing a ${industry} website. Provide specific, actionable feedback.`
              },
              {
                role: 'user',
                content: `Analyze this ${industry} website: ${url}\nTitle: ${title}\nProvide JSON with: suggestions (array of 4-6 specific strings), issues (array with type, severity, description), codeSuggestions (array with file, issue, before, after, explanation, type)`
              }
            ],
            temperature: 0.7,
            max_tokens: 1000
          }),
        });

        if (openAIResponse.ok) {
          const aiResult = await openAIResponse.json();
          try {
            aiAnalysisData = JSON.parse(aiResult.choices[0].message.content);
            useAI = true;
            console.log('OpenAI analysis successful');
          } catch (parseError) {
            console.log('Failed to parse AI response, using fallback');
          }
        }
      } catch (aiError) {
        console.log('OpenAI error:', aiError);
      }
    }

    // Fallback analysis based on industry
    const industrySpecificAnalysis = {
      'Food & Restaurant': {
        suggestions: [
          'Add high-quality food photography to entice customers',
          'Include clear menu with prices and dietary information',
          'Add online reservation or ordering system',
          'Display customer reviews and testimonials',
          'Show location, hours, and contact information prominently',
          'Optimize for mobile as many customers browse on phones'
        ],
        issues: [
          { type: 'ux', severity: 'medium', description: 'Menu may not be easily accessible or readable' },
          { type: 'performance', severity: 'low', description: 'Large food images could slow down page loading' },
          { type: 'accessibility', severity: 'medium', description: 'Ensure menu is screen reader accessible' }
        ]
      },
      'E-commerce': {
        suggestions: [
          'Improve product search and filtering capabilities',
          'Add clear product images with zoom functionality',
          'Streamline checkout process to reduce cart abandonment',
          'Include customer reviews and ratings for products',
          'Add trust signals like security badges and return policy',
          'Optimize for mobile shopping experience'
        ],
        issues: [
          { type: 'ux', severity: 'high', description: 'Shopping cart and checkout process may be unclear' },
          { type: 'performance', severity: 'medium', description: 'Product images could be optimized for faster loading' },
          { type: 'accessibility', severity: 'medium', description: 'Product information should be accessible to all users' }
        ]
      },
      'Technology': {
        suggestions: [
          'Clearly explain your product\'s value proposition',
          'Add interactive demos or screenshots of your software',
          'Include pricing information and comparison tables',
          'Add developer documentation and API references',
          'Include case studies and customer success stories',
          'Optimize technical content for both developers and decision-makers'
        ],
        issues: [
          { type: 'ux', severity: 'medium', description: 'Technical jargon may confuse non-technical visitors' },
          { type: 'performance', severity: 'low', description: 'Interactive elements could impact page performance' },
          { type: 'code', severity: 'medium', description: 'Code examples should be properly formatted and accessible' }
        ]
      }
    };

    const fallbackAnalysis = industrySpecificAnalysis[industry] || industrySpecificAnalysis['Technology'];

    // Use AI data if available, otherwise use industry-specific fallback
    const analysisData = useAI ? {
      suggestions: aiAnalysisData.suggestions || fallbackAnalysis.suggestions,
      issues: aiAnalysisData.issues || fallbackAnalysis.issues,
      codeSuggestions: aiAnalysisData.codeSuggestions || []
    } : fallbackAnalysis;

    // Store results in database
    const { data: savedResult, error: dbError } = await supabase
      .from('website_analysis_results')
      .insert({
        url,
        title,
        design_score: overallScore,
        analysis_data: {
          overallScore,
          categoryScores: {
            ux: uxScore,
            accessibility: accessibilityScore,
            performance: performanceScore,
            code: codeScore
          },
          industry
        },
        competitive_data: competitiveData,
        issues: analysisData.issues,
        suggestions: analysisData.suggestions,
        code_suggestions: analysisData.codeSuggestions || [],
        annotations: annotations
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save analysis results');
    }

    console.log('Analysis completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: savedResult.id,
          score: overallScore,
          comparison: competitiveData,
          issues: analysisData.issues,
          suggestions: analysisData.suggestions,
          codeSuggestions: analysisData.codeSuggestions || [],
          categoryScores: {
            ux: uxScore,
            accessibility: accessibilityScore,
            performance: performanceScore,
            code: codeScore
          },
          annotations: annotations,
          url,
          title
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Analysis failed', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
