
import { CompetitorAnalysis } from './types.ts';

export async function analyzeCompetitorsWithAI(
  htmlContent: string, 
  title: string, 
  description: string, 
  url: string,
  openAIApiKey: string | null
): Promise<CompetitorAnalysis> {
  const content = (title + ' ' + description + ' ' + htmlContent.substring(0, 4000)).toLowerCase();
  
  // Use AI to analyze the website and find competitors
  let aiAnalysis;
  try {
    const competitorPrompt = `
    Analyze this website content and identify its category and top competitors based on the actual content, business model, and target audience:
    
    Title: ${title}
    URL: ${url}
    Description: ${description}
    Content Sample: ${content.substring(0, 2000)}
    
    Please analyze the ACTUAL content and provide relevant competitors in this JSON format:
    {
      "category": "specific industry category based on content analysis",
      "competitors": [
        {
          "name": "Real Competitor Name",
          "score": number (realistic score 70-95),
          "category": "specific subcategory",
          "url": "https://actual-competitor-website.com",
          "description": "what they actually do based on the analyzed content"
        }
      ],
      "suggestedAnalysis": [
        {
          "name": "Top Relevant Competitor",
          "url": "https://competitor.com", 
          "reason": "specific reason why this competitor is most relevant for comparison",
          "popularity": "actual market position"
        }
      ]
    }
    
    IMPORTANT: Base your analysis on the ACTUAL website content. Don't use generic competitors. Find competitors that actually match the business model, target audience, and content theme of the analyzed website.
    `;

    if (openAIApiKey) {
      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'You are a market research expert that analyzes website content to identify accurate competitors. Always base your analysis on the actual website content provided, not generic assumptions.' 
            },
            { role: 'user', content: competitorPrompt }
          ],
          max_tokens: 1500,
          temperature: 0.1
        }),
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        const aiContent = aiData.choices[0].message.content;
        
        // Extract JSON from response
        const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiAnalysis = JSON.parse(jsonMatch[0]);
          console.log('AI competitor analysis successful:', aiAnalysis);
        }
      }
    }
  } catch (error) {
    console.error('AI competitor analysis failed:', error);
  }

  // If AI analysis succeeded and has relevant data, use it
  if (aiAnalysis && aiAnalysis.category && aiAnalysis.competitors && aiAnalysis.competitors.length > 0) {
    return aiAnalysis;
  }

  // Enhanced fallback analysis based on content keywords
  return getFallbackCompetitorAnalysis(content);
}

function getFallbackCompetitorAnalysis(keywords: string): CompetitorAnalysis {
  let category = 'Business/Corporate';
  let competitors: Array<{name: string, score: number, category: string, url?: string, description?: string}> = [];
  let suggestedAnalysis: Array<{name: string, url: string, reason: string, popularity: string}> = [];

  if (keywords.includes('restaurant') || keywords.includes('food') || keywords.includes('menu') || keywords.includes('dining') || keywords.includes('kitchen')) {
    category = 'Restaurant/Food Service';
    competitors = [
      { name: 'OpenTable', score: 89, category: 'reservation platform', url: 'https://opentable.com', description: 'Restaurant reservation and management platform' },
      { name: 'Resy', score: 85, category: 'reservation platform', url: 'https://resy.com', description: 'Modern restaurant booking platform' },
      { name: 'Yelp', score: 82, category: 'review platform', url: 'https://yelp.com', description: 'Restaurant discovery and review platform' },
      { name: 'DoorDash', score: 88, category: 'food delivery', url: 'https://doordash.com', description: 'Food delivery and restaurant marketplace' }
    ];
    suggestedAnalysis = [
      { name: 'OpenTable', url: 'https://opentable.com', reason: 'Industry leader in restaurant reservation systems with excellent UX design', popularity: 'Restaurant Platform Leader' }
    ];
  } else if (keywords.includes('ecommerce') || keywords.includes('shop') || keywords.includes('buy') || keywords.includes('cart') || keywords.includes('product')) {
    category = 'E-commerce';
    competitors = [
      { name: 'Shopify', score: 92, category: 'platform', url: 'https://shopify.com', description: 'Leading e-commerce platform provider' },
      { name: 'WooCommerce', score: 78, category: 'platform', url: 'https://woocommerce.com', description: 'WordPress e-commerce plugin' },
      { name: 'BigCommerce', score: 85, category: 'platform', url: 'https://bigcommerce.com', description: 'Enterprise e-commerce platform' },
      { name: 'Squarespace', score: 81, category: 'website builder', url: 'https://squarespace.com', description: 'Website builder with e-commerce features' }
    ];
    suggestedAnalysis = [
      { name: 'Shopify', url: 'https://shopify.com', reason: 'Best practices in e-commerce platform design and user experience', popularity: 'E-commerce Platform Leader' }
    ];
  } else if (keywords.includes('saas') || keywords.includes('software') || keywords.includes('api') || keywords.includes('platform') || keywords.includes('dashboard')) {
    category = 'SaaS/Software';
    competitors = [
      { name: 'Stripe', score: 94, category: 'payments', url: 'https://stripe.com', description: 'Developer-focused payment platform' },
      { name: 'Slack', score: 90, category: 'communication', url: 'https://slack.com', description: 'Team communication platform' },
      { name: 'Notion', score: 88, category: 'productivity', url: 'https://notion.so', description: 'All-in-one workspace platform' },
      { name: 'Linear', score: 86, category: 'project management', url: 'https://linear.app', description: 'Modern project management tool' }
    ];
    suggestedAnalysis = [
      { name: 'Stripe', url: 'https://stripe.com', reason: 'Gold standard for developer-focused SaaS platform design', popularity: 'Developer Platform Leader' }
    ];
  } else {
    // Generic business competitors
    competitors = [
      { name: 'Squarespace', score: 85, category: 'website builder', url: 'https://squarespace.com', description: 'Professional website builder platform' },
      { name: 'Wix', score: 78, category: 'website builder', url: 'https://wix.com', description: 'Popular drag-and-drop website builder' },
      { name: 'WordPress.com', score: 82, category: 'cms', url: 'https://wordpress.com', description: 'Content management system' },
      { name: 'Webflow', score: 87, category: 'design platform', url: 'https://webflow.com', description: 'Visual web development platform' }
    ];
    suggestedAnalysis = [
      { name: 'Squarespace', url: 'https://squarespace.com', reason: 'Excellent design standards and user experience for business websites', popularity: 'Website Design Leader' }
    ];
  }

  return { category, competitors, suggestedAnalysis };
}
