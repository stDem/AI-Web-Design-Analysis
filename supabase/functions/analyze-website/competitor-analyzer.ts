
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
    
    IMPORTANT ANALYSIS GUIDELINES:
    1. Read the ACTUAL content carefully - don't make assumptions based on domain names
    2. Look for key business indicators: product descriptions, service offerings, user interfaces
    3. If it's a messaging/chat app (like WhatsApp), categorize as "Social Media/Communication"
    4. If it's an e-commerce site, look for shopping features, products, checkout processes
    5. If it's a restaurant, look for menus, food descriptions, dining information
    6. Base competitors on the ACTUAL business model shown in the content
    
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
    
    CRITICAL: Base your analysis on the ACTUAL website content and business model shown. Don't use generic competitors that don't match the specific industry or function.
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
              content: 'You are a market research expert that analyzes website content to identify accurate competitors. Always base your analysis on the actual website content provided, not generic assumptions. Pay special attention to the actual business model and user interface elements shown in the content.' 
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
          try {
            aiAnalysis = JSON.parse(jsonMatch[0]);
            console.log('AI competitor analysis successful:', aiAnalysis);
            
            // Validate AI analysis has meaningful competitors
            if (aiAnalysis && aiAnalysis.category && aiAnalysis.competitors && 
                aiAnalysis.competitors.length > 0 && 
                aiAnalysis.competitors[0].name !== 'Generic Competitor') {
              return aiAnalysis;
            }
          } catch (parseError) {
            console.error('Failed to parse AI analysis JSON:', parseError);
          }
        }
      }
    }
  } catch (error) {
    console.error('AI competitor analysis failed:', error);
  }

  // Enhanced fallback analysis with better content detection
  return getEnhancedCompetitorAnalysis(content, url, title, description);
}

function getEnhancedCompetitorAnalysis(content: string, url: string, title: string, description: string): CompetitorAnalysis {
  let category = 'Business/Corporate';
  let competitors: Array<{name: string, score: number, category: string, url?: string, description?: string}> = [];
  let suggestedAnalysis: Array<{name: string, url: string, reason: string, popularity: string}> = [];

  // More sophisticated content analysis
  const combinedText = `${title} ${description} ${content}`.toLowerCase();
  const urlLower = url.toLowerCase();
  
  // Enhanced detection patterns with more specific keywords
  
  // Communication/Messaging Apps (WhatsApp, etc.)
  if (combinedText.includes('whatsapp') || combinedText.includes('message') || combinedText.includes('chat') || 
      combinedText.includes('messaging') || combinedText.includes('communicate') || combinedText.includes('conversation') ||
      combinedText.includes('text') || combinedText.includes('call') || combinedText.includes('voice') ||
      urlLower.includes('whatsapp') || urlLower.includes('telegram') || urlLower.includes('signal')) {
    category = 'Social Media/Communication';
    competitors = [
      { name: 'Telegram', score: 92, category: 'messaging app', url: 'https://telegram.org', description: 'Cloud-based messaging platform' },
      { name: 'Signal', score: 89, category: 'secure messaging', url: 'https://signal.org', description: 'Privacy-focused messaging app' },
      { name: 'Discord', score: 87, category: 'communication platform', url: 'https://discord.com', description: 'Voice and text communication for communities' },
      { name: 'Slack', score: 85, category: 'team communication', url: 'https://slack.com', description: 'Workplace messaging platform' }
    ];
    suggestedAnalysis = [
      { name: 'Telegram', url: 'https://telegram.org', reason: 'Direct competitor in messaging with similar features and user base', popularity: 'Messaging App Leader' }
    ];
  }
  // Video/Streaming Platforms (YouTube, etc.)
  else if (combinedText.includes('youtube') || combinedText.includes('video') || combinedText.includes('watch') || 
           combinedText.includes('subscribe') || combinedText.includes('channel') || combinedText.includes('upload') ||
           combinedText.includes('streaming') || combinedText.includes('playlist') || 
           urlLower.includes('youtube') || urlLower.includes('vimeo') || urlLower.includes('twitch')) {
    category = 'Media/Entertainment';
    competitors = [
      { name: 'Vimeo', score: 85, category: 'video platform', url: 'https://vimeo.com', description: 'Professional video hosting platform' },
      { name: 'TikTok', score: 94, category: 'short-form video', url: 'https://tiktok.com', description: 'Short-form mobile video platform' },
      { name: 'Twitch', score: 88, category: 'live streaming', url: 'https://twitch.tv', description: 'Live streaming platform for gaming and content' },
      { name: 'Dailymotion', score: 76, category: 'video sharing', url: 'https://dailymotion.com', description: 'European video sharing platform' }
    ];
    suggestedAnalysis = [
      { name: 'Vimeo', url: 'https://vimeo.com', reason: 'Direct competitor in video hosting with professional focus', popularity: 'Video Platform Alternative' }
    ];
  }
  // E-commerce detection
  else if (combinedText.includes('shop') || combinedText.includes('buy') || combinedText.includes('cart') || 
           combinedText.includes('product') || combinedText.includes('ecommerce') || combinedText.includes('store') ||
           combinedText.includes('checkout') || combinedText.includes('payment') || combinedText.includes('price') ||
           combinedText.includes('order') || urlLower.includes('shop') || urlLower.includes('store')) {
    category = 'E-commerce';
    competitors = [
      { name: 'Shopify', score: 92, category: 'platform', url: 'https://shopify.com', description: 'Leading e-commerce platform provider' },
      { name: 'Amazon', score: 95, category: 'marketplace', url: 'https://amazon.com', description: 'Global e-commerce marketplace' },
      { name: 'BigCommerce', score: 85, category: 'platform', url: 'https://bigcommerce.com', description: 'Enterprise e-commerce platform' },
      { name: 'WooCommerce', score: 82, category: 'wordpress plugin', url: 'https://woocommerce.com', description: 'WordPress e-commerce solution' }
    ];
    suggestedAnalysis = [
      { name: 'Shopify', url: 'https://shopify.com', reason: 'Industry leader in e-commerce platform design and user experience', popularity: 'E-commerce Platform Leader' }
    ];
  }
  // Restaurant/Food detection
  else if (combinedText.includes('restaurant') || combinedText.includes('food') || combinedText.includes('menu') || 
           combinedText.includes('dining') || combinedText.includes('kitchen') || combinedText.includes('recipe') ||
           combinedText.includes('delivery') || combinedText.includes('cafe') || combinedText.includes('cuisine') ||
           combinedText.includes('meal') || combinedText.includes('chef') || combinedText.includes('reservation')) {
    category = 'Restaurant/Food Service';
    competitors = [
      { name: 'OpenTable', score: 89, category: 'reservation platform', url: 'https://opentable.com', description: 'Restaurant reservation platform' },
      { name: 'DoorDash', score: 88, category: 'food delivery', url: 'https://doordash.com', description: 'Food delivery marketplace' },
      { name: 'Uber Eats', score: 86, category: 'food delivery', url: 'https://ubereats.com', description: 'Food delivery service' },
      { name: 'Resy', score: 84, category: 'reservations', url: 'https://resy.com', description: 'Restaurant booking platform' }
    ];
    suggestedAnalysis = [
      { name: 'OpenTable', url: 'https://opentable.com', reason: 'Industry leader in restaurant technology with excellent UX design', popularity: 'Restaurant Platform Leader' }
    ];
  }
  // SaaS/Software detection
  else if (combinedText.includes('saas') || combinedText.includes('software') || combinedText.includes('api') || 
           combinedText.includes('platform') || combinedText.includes('dashboard') || combinedText.includes('analytics') ||
           combinedText.includes('crm') || combinedText.includes('subscription') || combinedText.includes('cloud') ||
           urlLower.includes('app') || urlLower.includes('api')) {
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
  // Social Media detection
  else if (combinedText.includes('social') || combinedText.includes('community') || combinedText.includes('network') ||
           combinedText.includes('profile') || combinedText.includes('follow') || combinedText.includes('share') ||
           combinedText.includes('post') || combinedText.includes('feed') || combinedText.includes('like') ||
           urlLower.includes('facebook') || urlLower.includes('twitter') || urlLower.includes('instagram')) {
    category = 'Social Media/Community';
    competitors = [
      { name: 'Facebook', score: 92, category: 'social network', url: 'https://facebook.com', description: 'Leading social networking platform' },
      { name: 'Instagram', score: 90, category: 'photo sharing', url: 'https://instagram.com', description: 'Visual social media platform' },
      { name: 'LinkedIn', score: 88, category: 'professional network', url: 'https://linkedin.com', description: 'Professional networking platform' },
      { name: 'X (Twitter)', score: 85, category: 'microblogging', url: 'https://x.com', description: 'Real-time social networking platform' }
    ];
    suggestedAnalysis = [
      { name: 'Facebook', url: 'https://facebook.com', reason: 'Benchmark for social media platform design and user engagement', popularity: 'Social Media Leader' }
    ];
  }
  // Education detection
  else if (combinedText.includes('education') || combinedText.includes('learning') || combinedText.includes('course') ||
           combinedText.includes('university') || combinedText.includes('school') || combinedText.includes('tutorial') ||
           combinedText.includes('training') || combinedText.includes('academy') || combinedText.includes('student')) {
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
           combinedText.includes('money') || combinedText.includes('loan') || combinedText.includes('wallet')) {
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
           combinedText.includes('breaking') || combinedText.includes('headline') ||
           urlLower.includes('news') || urlLower.includes('blog')) {
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
        { name: 'Code for America', score: 82, category: 'civic engagement', url: 'https://codeforamerica.org', description: 'Civic technology platform' }
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
