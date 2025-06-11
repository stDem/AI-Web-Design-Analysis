
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
    Analyze this website content and identify its category and top competitors based on the ACTUAL content, business model, and target audience:
    
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

  // Enhanced fallback analysis based on content keywords and URL analysis
  return getEnhancedCompetitorAnalysis(content, url, title, description);
}

function getEnhancedCompetitorAnalysis(content: string, url: string, title: string, description: string): CompetitorAnalysis {
  let category = 'Business/Corporate';
  let competitors: Array<{name: string, score: number, category: string, url?: string, description?: string}> = [];
  let suggestedAnalysis: Array<{name: string, url: string, reason: string, popularity: string}> = [];

  // More sophisticated content analysis
  const combinedText = `${title} ${description} ${content}`.toLowerCase();
  
  // E-commerce detection
  if (combinedText.includes('shop') || combinedText.includes('buy') || combinedText.includes('cart') || 
      combinedText.includes('product') || combinedText.includes('ecommerce') || combinedText.includes('store') ||
      combinedText.includes('checkout') || combinedText.includes('payment') || url.includes('shop')) {
    category = 'E-commerce';
    competitors = [
      { name: 'Shopify', score: 92, category: 'platform', url: 'https://shopify.com', description: 'Leading e-commerce platform provider' },
      { name: 'Amazon', score: 95, category: 'marketplace', url: 'https://amazon.com', description: 'Global e-commerce marketplace' },
      { name: 'BigCommerce', score: 85, category: 'platform', url: 'https://bigcommerce.com', description: 'Enterprise e-commerce platform' },
      { name: 'Etsy', score: 78, category: 'marketplace', url: 'https://etsy.com', description: 'Handmade and vintage marketplace' }
    ];
    suggestedAnalysis = [
      { name: 'Shopify', url: 'https://shopify.com', reason: 'Best practices in e-commerce platform design and user experience', popularity: 'E-commerce Platform Leader' }
    ];
  }
  // SaaS/Software detection
  else if (combinedText.includes('saas') || combinedText.includes('software') || combinedText.includes('api') || 
           combinedText.includes('platform') || combinedText.includes('dashboard') || combinedText.includes('analytics') ||
           combinedText.includes('crm') || combinedText.includes('subscription') || url.includes('app')) {
    category = 'SaaS/Software';
    competitors = [
      { name: 'Salesforce', score: 94, category: 'crm', url: 'https://salesforce.com', description: 'Leading CRM platform' },
      { name: 'HubSpot', score: 89, category: 'marketing', url: 'https://hubspot.com', description: 'Inbound marketing platform' },
      { name: 'Slack', score: 87, category: 'communication', url: 'https://slack.com', description: 'Team communication platform' },
      { name: 'Notion', score: 85, category: 'productivity', url: 'https://notion.so', description: 'All-in-one workspace platform' }
    ];
    suggestedAnalysis = [
      { name: 'Salesforce', url: 'https://salesforce.com', reason: 'Industry standard for enterprise SaaS platform design', popularity: 'CRM Market Leader' }
    ];
  }
  // Media/Entertainment detection
  else if (combinedText.includes('video') || combinedText.includes('streaming') || combinedText.includes('music') ||
           combinedText.includes('entertainment') || combinedText.includes('media') || combinedText.includes('podcast') ||
           url.includes('youtube') || url.includes('netflix') || url.includes('spotify')) {
    category = 'Media/Entertainment';
    competitors = [
      { name: 'YouTube', score: 96, category: 'video platform', url: 'https://youtube.com', description: 'Leading video sharing platform' },
      { name: 'Netflix', score: 93, category: 'streaming', url: 'https://netflix.com', description: 'Premium streaming service' },
      { name: 'Spotify', score: 91, category: 'music streaming', url: 'https://spotify.com', description: 'Music streaming platform' },
      { name: 'Twitch', score: 88, category: 'live streaming', url: 'https://twitch.tv', description: 'Live streaming platform' }
    ];
    suggestedAnalysis = [
      { name: 'YouTube', url: 'https://youtube.com', reason: 'Best practices in video platform UX and content discovery', popularity: 'Video Platform Leader' }
    ];
  }
  // Food/Restaurant detection
  else if (combinedText.includes('restaurant') || combinedText.includes('food') || combinedText.includes('menu') || 
           combinedText.includes('dining') || combinedText.includes('kitchen') || combinedText.includes('recipe') ||
           combinedText.includes('delivery') || combinedText.includes('cafe')) {
    category = 'Restaurant/Food Service';
    competitors = [
      { name: 'OpenTable', score: 89, category: 'reservation platform', url: 'https://opentable.com', description: 'Restaurant reservation platform' },
      { name: 'DoorDash', score: 88, category: 'food delivery', url: 'https://doordash.com', description: 'Food delivery marketplace' },
      { name: 'Uber Eats', score: 86, category: 'food delivery', url: 'https://ubereats.com', description: 'Food delivery service' },
      { name: 'Grubhub', score: 82, category: 'food delivery', url: 'https://grubhub.com', description: 'Online food ordering platform' }
    ];
    suggestedAnalysis = [
      { name: 'OpenTable', url: 'https://opentable.com', reason: 'Industry leader in restaurant technology with excellent UX design', popularity: 'Restaurant Platform Leader' }
    ];
  }
  // Social Media detection
  else if (combinedText.includes('social') || combinedText.includes('community') || combinedText.includes('network') ||
           combinedText.includes('profile') || combinedText.includes('follow') || combinedText.includes('share') ||
           url.includes('facebook') || url.includes('twitter') || url.includes('instagram')) {
    category = 'Social Media/Community';
    competitors = [
      { name: 'Facebook', score: 92, category: 'social network', url: 'https://facebook.com', description: 'Leading social networking platform' },
      { name: 'Instagram', score: 90, category: 'photo sharing', url: 'https://instagram.com', description: 'Visual social media platform' },
      { name: 'LinkedIn', score: 88, category: 'professional network', url: 'https://linkedin.com', description: 'Professional networking platform' },
      { name: 'Discord', score: 85, category: 'community', url: 'https://discord.com', description: 'Community communication platform' }
    ];
    suggestedAnalysis = [
      { name: 'Facebook', url: 'https://facebook.com', reason: 'Benchmark for social media platform design and user engagement', popularity: 'Social Media Leader' }
    ];
  }
  // Education detection
  else if (combinedText.includes('education') || combinedText.includes('learning') || combinedText.includes('course') ||
           combinedText.includes('university') || combinedText.includes('school') || combinedText.includes('tutorial') ||
           combinedText.includes('training') || combinedText.includes('academy')) {
    category = 'Education/Learning';
    competitors = [
      { name: 'Coursera', score: 90, category: 'online courses', url: 'https://coursera.org', description: 'Online learning platform' },
      { name: 'Udemy', score: 87, category: 'online courses', url: 'https://udemy.com', description: 'Skill development platform' },
      { name: 'Khan Academy', score: 85, category: 'free education', url: 'https://khanacademy.org', description: 'Free educational content' },
      { name: 'edX', score: 88, category: 'university courses', url: 'https://edx.org', description: 'University-level online courses' }
    ];
    suggestedAnalysis = [
      { name: 'Coursera', url: 'https://coursera.org', reason: 'Leading example of educational platform design and user experience', popularity: 'Online Learning Leader' }
    ];
  }
  // Finance detection
  else if (combinedText.includes('finance') || combinedText.includes('bank') || combinedText.includes('investment') ||
           combinedText.includes('trading') || combinedText.includes('crypto') || combinedText.includes('payment') ||
           combinedText.includes('money') || combinedText.includes('loan')) {
    category = 'Finance/Fintech';
    competitors = [
      { name: 'PayPal', score: 91, category: 'payments', url: 'https://paypal.com', description: 'Digital payment platform' },
      { name: 'Stripe', score: 89, category: 'payment processing', url: 'https://stripe.com', description: 'Developer payment platform' },
      { name: 'Coinbase', score: 86, category: 'cryptocurrency', url: 'https://coinbase.com', description: 'Cryptocurrency exchange' },
      { name: 'Robinhood', score: 84, category: 'trading', url: 'https://robinhood.com', description: 'Commission-free trading platform' }
    ];
    suggestedAnalysis = [
      { name: 'Stripe', url: 'https://stripe.com', reason: 'Gold standard for fintech platform design and developer experience', popularity: 'Payment Platform Leader' }
    ];
  }
  // News/Media detection
  else if (combinedText.includes('news') || combinedText.includes('article') || combinedText.includes('journalism') ||
           combinedText.includes('blog') || combinedText.includes('magazine') || combinedText.includes('publication') ||
           url.includes('news') || url.includes('blog')) {
    category = 'News/Media';
    competitors = [
      { name: 'Medium', score: 88, category: 'publishing platform', url: 'https://medium.com', description: 'Content publishing platform' },
      { name: 'Substack', score: 85, category: 'newsletter platform', url: 'https://substack.com', description: 'Newsletter publishing platform' },
      { name: 'WordPress', score: 82, category: 'blogging platform', url: 'https://wordpress.com', description: 'Content management system' },
      { name: 'Ghost', score: 80, category: 'publishing platform', url: 'https://ghost.org', description: 'Modern publishing platform' }
    ];
    suggestedAnalysis = [
      { name: 'Medium', url: 'https://medium.com', reason: 'Excellent design standards for content-focused platforms', popularity: 'Publishing Platform Leader' }
    ];
  }
  else {
    // Enhanced generic business analysis based on URL patterns
    const domain = url.toLowerCase();
    if (domain.includes('.gov') || combinedText.includes('government')) {
      category = 'Government/Public Service';
      competitors = [
        { name: 'GovTech', score: 85, category: 'digital government', url: 'https://govtech.com', description: 'Government technology solutions' },
        { name: 'Civic Tech', score: 82, category: 'civic engagement', url: 'https://codeforamerica.org', description: 'Civic technology platform' }
      ];
    } else if (domain.includes('.org') || combinedText.includes('nonprofit')) {
      category = 'Nonprofit/Organization';
      competitors = [
        { name: 'Network for Good', score: 83, category: 'nonprofit tech', url: 'https://networkforgood.com', description: 'Nonprofit technology platform' },
        { name: 'DonorPerfect', score: 80, category: 'fundraising', url: 'https://donorperfect.com', description: 'Donor management system' }
      ];
    } else {
      // Default business competitors
      competitors = [
        { name: 'Squarespace', score: 85, category: 'website builder', url: 'https://squarespace.com', description: 'Professional website builder platform' },
        { name: 'Wix', score: 78, category: 'website builder', url: 'https://wix.com', description: 'Popular drag-and-drop website builder' },
        { name: 'WordPress.com', score: 82, category: 'cms', url: 'https://wordpress.com', description: 'Content management system' },
        { name: 'Webflow', score: 87, category: 'design platform', url: 'https://webflow.com', description: 'Visual web development platform' }
      ];
    }
    
    if (!suggestedAnalysis.length) {
      suggestedAnalysis = [
        { name: 'Squarespace', url: 'https://squarespace.com', reason: 'Excellent design standards and user experience for business websites', popularity: 'Website Design Leader' }
      ];
    }
  }

  return { category, competitors, suggestedAnalysis };
}
