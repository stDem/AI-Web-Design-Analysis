
import { CompetitorAnalysis } from './types.ts';

export async function analyzeCompetitorsWithAI(
  htmlContent: string, 
  title: string, 
  description: string, 
  url: string,
  openAIApiKey: string | null
): Promise<CompetitorAnalysis> {
  console.log('Starting competitor analysis for:', url);
  console.log('Content length:', htmlContent.length);
  console.log('Title:', title);
  console.log('Description:', description);
  
  // Use AI to analyze the website and find competitors based on actual content
  if (openAIApiKey) {
    try {
      const contentSample = htmlContent.substring(0, 3000);
      const competitorPrompt = `
      Analyze this website and identify its EXACT category and top competitors based on the ACTUAL content, business model, and functionality:
      
      URL: ${url}
      Title: ${title}
      Description: ${description}
      Content Sample: ${contentSample}
      
      CRITICAL ANALYSIS REQUIREMENTS:
      1. Read the ACTUAL website content carefully - don't assume based on domain names
      2. Identify the PRIMARY business function from the content (what does this site actually do?)
      3. Look for specific features, services, or products mentioned in the content
      4. Identify the target audience and use cases from the content
      5. Base competitors on the ACTUAL business model shown in the content
      
      CONTENT ANALYSIS GUIDELINES:
      - If it's a messaging/communication app (like WhatsApp, Telegram) → Social Media/Communication
      - If it's a video platform (like YouTube, Vimeo) → Media/Entertainment  
      - If it's an e-commerce site with products/shopping → E-commerce
      - If it's a university/educational institution → Education/Learning
      - If it's a restaurant with menus/food → Restaurant/Food Service
      - If it's a software/SaaS platform → SaaS/Software
      - If it's a social network → Social Media/Community
      - If it's a news/blog site → News/Media
      - If it's a financial service → Finance/Fintech
      
      Provide your analysis in this exact JSON format:
      {
        "category": "specific industry category based on actual content analysis",
        "competitors": [
          {
            "name": "Actual Competitor Name",
            "score": number (70-95),
            "category": "specific subcategory",
            "url": "https://real-competitor-site.com",
            "description": "what they actually do based on the website's business model"
          }
        ],
        "suggestedAnalysis": [
          {
            "name": "Most Relevant Competitor",
            "url": "https://competitor.com", 
            "reason": "specific reason why this competitor is most relevant for comparison",
            "popularity": "market position"
          }
        ]
      }
      
      IMPORTANT: Base your analysis ONLY on the actual website content provided. Do not use generic assumptions.
      `;

      console.log('Making AI request for competitor analysis');
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
              content: 'You are a market research expert that analyzes website content to identify accurate competitors. You must analyze the ACTUAL website content provided, not make assumptions based on domain names. Focus on the real business model and functionality shown in the content.' 
            },
            { role: 'user', content: competitorPrompt }
          ],
          max_tokens: 1500,
          temperature: 0.2
        }),
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        const aiContent = aiData.choices[0].message.content;
        console.log('AI response received:', aiContent);
        
        // Extract JSON from response
        const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const aiAnalysis = JSON.parse(jsonMatch[0]);
            console.log('AI competitor analysis successful:', aiAnalysis);
            
            // Validate AI analysis has meaningful competitors
            if (aiAnalysis && aiAnalysis.category && aiAnalysis.competitors && 
                aiAnalysis.competitors.length > 0 && 
                aiAnalysis.competitors[0].name !== 'Generic Competitor') {
              return aiAnalysis;
            } else {
              console.log('AI analysis invalid, using enhanced fallback');
            }
          } catch (parseError) {
            console.error('Failed to parse AI analysis JSON:', parseError);
          }
        } else {
          console.log('No JSON found in AI response, using enhanced fallback');
        }
      } else {
        console.error('AI API request failed:', aiResponse.status);
      }
    } catch (error) {
      console.error('AI competitor analysis failed:', error);
    }
  } else {
    console.log('No OpenAI API key provided, using enhanced content analysis');
  }

  // Enhanced fallback analysis with actual content analysis
  return getContentBasedCompetitorAnalysis(htmlContent, url, title, description);
}

function getContentBasedCompetitorAnalysis(htmlContent: string, url: string, title: string, description: string): CompetitorAnalysis {
  console.log('Using content-based competitor analysis');
  
  const combinedText = `${title} ${description} ${htmlContent}`.toLowerCase();
  const urlLower = url.toLowerCase();
  
  console.log('Analyzing content for patterns...');
  
  // WhatsApp/Messaging App Detection
  if (urlLower.includes('whatsapp') || urlLower.includes('web.whatsapp') || 
      combinedText.includes('whatsapp') || combinedText.includes('send messages') ||
      (combinedText.includes('message') && combinedText.includes('chat') && combinedText.includes('web'))) {
    console.log('Detected: WhatsApp/Messaging Platform');
    return {
      category: 'Social Media/Communication',
      competitors: [
        { name: 'Telegram', score: 92, category: 'messaging app', url: 'https://telegram.org', description: 'Cloud-based messaging platform with channels and bots' },
        { name: 'Signal', score: 89, category: 'secure messaging', url: 'https://signal.org', description: 'Privacy-focused encrypted messaging app' },
        { name: 'Discord', score: 87, category: 'communication platform', url: 'https://discord.com', description: 'Voice, video and text communication for communities' },
        { name: 'Slack', score: 85, category: 'team communication', url: 'https://slack.com', description: 'Business messaging and collaboration platform' }
      ],
      suggestedAnalysis: [
        { name: 'Telegram', url: 'https://telegram.org', reason: 'Direct competitor in web-based messaging with similar features and cross-platform support', popularity: 'Top Messaging App' }
      ]
    };
  }

  // YouTube/Video Platform Detection
  if (urlLower.includes('youtube') || combinedText.includes('youtube') ||
      (combinedText.includes('video') && (combinedText.includes('watch') || combinedText.includes('subscribe') || combinedText.includes('channel')))) {
    console.log('Detected: YouTube/Video Platform');
    return {
      category: 'Media/Entertainment',
      competitors: [
        { name: 'Vimeo', score: 85, category: 'video platform', url: 'https://vimeo.com', description: 'Professional video hosting and streaming platform' },
        { name: 'TikTok', score: 94, category: 'short-form video', url: 'https://tiktok.com', description: 'Short-form mobile video sharing platform' },
        { name: 'Twitch', score: 88, category: 'live streaming', url: 'https://twitch.tv', description: 'Live streaming platform for gaming and entertainment' },
        { name: 'Dailymotion', score: 76, category: 'video sharing', url: 'https://dailymotion.com', description: 'European video sharing and discovery platform' }
      ],
      suggestedAnalysis: [
        { name: 'Vimeo', url: 'https://vimeo.com', reason: 'Professional video platform competitor with high-quality content focus', popularity: 'Premium Video Platform' }
      ]
    };
  }

  // University/Educational Institution Detection
  if (urlLower.includes('.edu') || urlLower.includes('university') || urlLower.includes('uni') ||
      combinedText.includes('university') || combinedText.includes('college') || combinedText.includes('academic') ||
      combinedText.includes('students') || combinedText.includes('faculty') || combinedText.includes('campus') ||
      combinedText.includes('degree') || combinedText.includes('bachelor') || combinedText.includes('master')) {
    console.log('Detected: University/Educational Institution');
    return {
      category: 'Education/Higher Education',
      competitors: [
        { name: 'Harvard University', score: 95, category: 'ivy league', url: 'https://harvard.edu', description: 'Prestigious private research university' },
        { name: 'MIT', score: 94, category: 'technology university', url: 'https://mit.edu', description: 'Leading technology and engineering university' },
        { name: 'Stanford University', score: 93, category: 'research university', url: 'https://stanford.edu', description: 'Top-ranked research university in California' },
        { name: 'University of Oxford', score: 92, category: 'international university', url: 'https://ox.ac.uk', description: 'Historic research university in the UK' }
      ],
      suggestedAnalysis: [
        { name: 'MIT', url: 'https://mit.edu', reason: 'Leading example of university website design and digital presence', popularity: 'Top Global University' }
      ]
    };
  }

  // Restaurant/Food Service Detection
  if (combinedText.includes('restaurant') || combinedText.includes('menu') || combinedText.includes('food') ||
      combinedText.includes('dining') || combinedText.includes('cuisine') || combinedText.includes('chef') ||
      combinedText.includes('reservation') || combinedText.includes('table') || combinedText.includes('delivery') ||
      combinedText.includes('kitchen') || combinedText.includes('meal') || combinedText.includes('recipe')) {
    console.log('Detected: Restaurant/Food Service');
    return {
      category: 'Restaurant/Food Service',
      competitors: [
        { name: 'OpenTable', score: 89, category: 'reservation platform', url: 'https://opentable.com', description: 'Restaurant reservation and discovery platform' },
        { name: 'Yelp', score: 86, category: 'restaurant discovery', url: 'https://yelp.com', description: 'Restaurant reviews and local business discovery' },
        { name: 'Resy', score: 84, category: 'reservation system', url: 'https://resy.com', description: 'Premium restaurant booking and dining platform' },
        { name: 'Zomato', score: 82, category: 'food delivery', url: 'https://zomato.com', description: 'Restaurant discovery and food delivery platform' }
      ],
      suggestedAnalysis: [
        { name: 'OpenTable', url: 'https://opentable.com', reason: 'Industry leader in restaurant technology and online presence', popularity: 'Restaurant Platform Leader' }
      ]
    };
  }

  // E-commerce Detection
  if (combinedText.includes('shop') || combinedText.includes('buy') || combinedText.includes('cart') || 
      combinedText.includes('product') || combinedText.includes('store') || combinedText.includes('checkout') ||
      combinedText.includes('payment') || combinedText.includes('price') || combinedText.includes('order')) {
    console.log('Detected: E-commerce Platform');
    return {
      category: 'E-commerce',
      competitors: [
        { name: 'Amazon', score: 95, category: 'marketplace', url: 'https://amazon.com', description: 'Global e-commerce marketplace and platform' },
        { name: 'Shopify', score: 92, category: 'platform', url: 'https://shopify.com', description: 'Leading e-commerce platform provider' },
        { name: 'eBay', score: 88, category: 'auction marketplace', url: 'https://ebay.com', description: 'Online auction and marketplace platform' },
        { name: 'Etsy', score: 85, category: 'handmade marketplace', url: 'https://etsy.com', description: 'Marketplace for handmade and vintage items' }
      ],
      suggestedAnalysis: [
        { name: 'Shopify', url: 'https://shopify.com', reason: 'Industry standard for e-commerce platform design and functionality', popularity: 'E-commerce Leader' }
      ]
    };
  }

  // SaaS/Software Detection
  if (combinedText.includes('saas') || combinedText.includes('software') || combinedText.includes('api') || 
      combinedText.includes('platform') || combinedText.includes('dashboard') || combinedText.includes('analytics') ||
      combinedText.includes('app') || combinedText.includes('tool') || combinedText.includes('service')) {
    console.log('Detected: SaaS/Software Platform');
    return {
      category: 'SaaS/Software',
      competitors: [
        { name: 'Salesforce', score: 94, category: 'crm platform', url: 'https://salesforce.com', description: 'Leading customer relationship management platform' },
        { name: 'Microsoft 365', score: 93, category: 'productivity suite', url: 'https://microsoft.com', description: 'Cloud-based productivity and collaboration tools' },
        { name: 'Google Workspace', score: 91, category: 'collaboration platform', url: 'https://workspace.google.com', description: 'Business productivity and collaboration suite' },
        { name: 'Slack', score: 87, category: 'communication platform', url: 'https://slack.com', description: 'Business communication and collaboration platform' }
      ],
      suggestedAnalysis: [
        { name: 'Salesforce', url: 'https://salesforce.com', reason: 'Industry benchmark for SaaS platform design and user experience', popularity: 'SaaS Market Leader' }
      ]
    };
  }

  // News/Media Detection
  if (combinedText.includes('news') || combinedText.includes('article') || combinedText.includes('journalism') ||
      combinedText.includes('blog') || combinedText.includes('publication') || combinedText.includes('breaking') ||
      combinedText.includes('headline') || combinedText.includes('reporter') || combinedText.includes('media')) {
    console.log('Detected: News/Media Platform');
    return {
      category: 'News/Media',
      competitors: [
        { name: 'CNN', score: 90, category: 'news network', url: 'https://cnn.com', description: 'Major news network and digital platform' },
        { name: 'BBC', score: 92, category: 'public broadcaster', url: 'https://bbc.com', description: 'British public service broadcaster' },
        { name: 'The New York Times', score: 89, category: 'newspaper', url: 'https://nytimes.com', description: 'Leading American newspaper and digital publication' },
        { name: 'Medium', score: 85, category: 'publishing platform', url: 'https://medium.com', description: 'Online publishing and blogging platform' }
      ],
      suggestedAnalysis: [
        { name: 'BBC', url: 'https://bbc.com', reason: 'Excellent standard for news website design and digital journalism', popularity: 'Global News Leader' }
      ]
    };
  }

  // Default: Business/Corporate Website
  console.log('Using default business/corporate category');
  return {
    category: 'Business/Corporate',
    competitors: [
      { name: 'Squarespace', score: 85, category: 'website builder', url: 'https://squarespace.com', description: 'Professional website builder platform' },
      { name: 'Wix', score: 78, category: 'website builder', url: 'https://wix.com', description: 'Popular drag-and-drop website builder' },
      { name: 'WordPress.com', score: 82, category: 'cms platform', url: 'https://wordpress.com', description: 'Content management system and hosting' },
      { name: 'Webflow', score: 87, category: 'design platform', url: 'https://webflow.com', description: 'Visual web development platform' }
    ],
    suggestedAnalysis: [
      { name: 'Squarespace', url: 'https://squarespace.com', reason: 'Industry standard for professional website design and user experience', popularity: 'Website Design Leader' }
    ]
  };
}
