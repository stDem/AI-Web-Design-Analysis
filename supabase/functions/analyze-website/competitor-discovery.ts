
interface CompetitorCandidate {
  name: string;
  url: string;
  domain: string;
  description: string;
  relevanceScore: number;
  estimatedTraffic?: string;
  keyFeatures?: string[];
}

interface DiscoveredCompetitor {
  name: string;
  score: number;
  category: string;
  url: string;
  description: string;
  relevanceReason: string;
}

export async function discoverCompetitors(
  websiteContent: string,
  title: string,
  description: string,
  url: string,
  openAIApiKey: string | null
): Promise<{
  competitors: DiscoveredCompetitor[];
  category: string;
  suggestedAnalysis: Array<{
    name: string;
    url: string;
    reason: string;
    popularity: string;
  }>;
}> {
  console.log('Starting competitor discovery for:', url);
  
  // Extract domain to avoid self-comparison
  const currentDomain = new URL(url).hostname.toLowerCase().replace('www.', '');
  
  // Step 1: Extract key information from the website
  const websiteInfo = await extractWebsiteInfo(websiteContent, title, description, openAIApiKey);
  
  // Step 2: Find competitors using AI-powered analysis
  const competitors = await findCompetitorsWithAI(
    websiteContent,
    title,
    description,
    url,
    websiteInfo,
    currentDomain,
    openAIApiKey
  );
  
  // Step 3: Create suggested analysis list
  const suggestedAnalysis = competitors.slice(0, 3).map(comp => ({
    name: comp.name,
    url: comp.url,
    reason: comp.relevanceReason,
    popularity: comp.estimatedTraffic || 'Medium'
  }));
  
  console.log('Competitor discovery completed:', competitors.length, 'competitors found');
  
  return {
    competitors,
    category: websiteInfo.category,
    suggestedAnalysis
  };
}

async function extractWebsiteInfo(
  content: string,
  title: string,
  description: string,
  openAIApiKey: string | null
): Promise<{
  category: string;
  keywords: string[];
  businessType: string;
  targetAudience: string;
  mainFeatures: string[];
}> {
  if (!openAIApiKey) {
    return analyzeWebsiteContentFallback(content, title, description);
  }
  
  const analysisPrompt = `
  Analyze this website and extract key business information:
  
  Title: ${title}
  Description: ${description}
  Content: ${content.substring(0, 3000)}
  
  Provide analysis in this JSON format:
  {
    "category": "specific industry category (e.g., 'E-commerce Fashion', 'SaaS Project Management', 'Restaurant Delivery')",
    "keywords": ["5-8 relevant keywords for competitor search"],
    "businessType": "brief description of what this business does",
    "targetAudience": "who are the primary users/customers",
    "mainFeatures": ["3-5 key features or services offered"]
  }
  
  Be specific and accurate based on the actual content provided.
  `;
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a business analyst expert at categorizing websites and identifying competitive landscapes.' },
          { role: 'user', content: analysisPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.1
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (error) {
    console.error('Website analysis failed:', error);
  }
  
  return analyzeWebsiteContentFallback(content, title, description);
}

function analyzeWebsiteContentFallback(
  content: string,
  title: string,
  description: string
): {
  category: string;
  keywords: string[];
  businessType: string;
  targetAudience: string;
  mainFeatures: string[];
} {
  const contentLower = content.toLowerCase();
  const titleLower = title.toLowerCase();
  const descLower = description?.toLowerCase() || '';
  
  let category = 'General Business';
  let keywords: string[] = [];
  let businessType = 'Web service';
  let targetAudience = 'General users';
  let mainFeatures: string[] = [];
  
  // More comprehensive content analysis
  if (contentLower.includes('shop') || contentLower.includes('buy') || contentLower.includes('cart') || contentLower.includes('store')) {
    category = 'E-commerce';
    keywords = ['online store', 'ecommerce', 'retail', 'shopping platform'];
    businessType = 'Online retail platform';
    targetAudience = 'Online shoppers';
    mainFeatures = ['Product catalog', 'Shopping cart', 'Payment processing'];
  } else if (contentLower.includes('whatsapp') || contentLower.includes('messenger') || contentLower.includes('chat') || contentLower.includes('messaging')) {
    category = 'Communication/Messaging';
    keywords = ['messaging app', 'communication platform', 'chat service', 'instant messaging'];
    businessType = 'Messaging and communication platform';
    targetAudience = 'General users, businesses';
    mainFeatures = ['Instant messaging', 'Voice calls', 'Video calls', 'Group chats'];
  } else if (contentLower.includes('youtube') || contentLower.includes('video') || contentLower.includes('stream') || contentLower.includes('watch')) {
    category = 'Video/Media Streaming';
    keywords = ['video platform', 'streaming service', 'content sharing', 'entertainment'];
    businessType = 'Video streaming and sharing platform';
    targetAudience = 'Content creators and viewers';
    mainFeatures = ['Video streaming', 'Content upload', 'Subscriptions', 'Live streaming'];
  } else if (contentLower.includes('restaurant') || contentLower.includes('food') || contentLower.includes('menu') || contentLower.includes('dining')) {
    category = 'Restaurant/Food Service';
    keywords = ['restaurant', 'food delivery', 'dining', 'cuisine', 'food service'];
    businessType = 'Food service business';
    targetAudience = 'Food enthusiasts and diners';
    mainFeatures = ['Menu display', 'Online ordering', 'Reservations'];
  } else if (contentLower.includes('blog') || contentLower.includes('article') || contentLower.includes('news') || contentLower.includes('content')) {
    category = 'Content/Media';
    keywords = ['content platform', 'publishing', 'articles', 'media', 'blog'];
    businessType = 'Content publishing platform';
    targetAudience = 'Readers and content consumers';
    mainFeatures = ['Article publishing', 'Content management', 'Reader engagement'];
  } else if (contentLower.includes('dashboard') || contentLower.includes('analytics') || contentLower.includes('saas') || contentLower.includes('software')) {
    category = 'SaaS/Software';
    keywords = ['software platform', 'business tools', 'productivity', 'saas', 'enterprise software'];
    businessType = 'Software as a Service platform';
    targetAudience = 'Business professionals';
    mainFeatures = ['Dashboard interface', 'Data analytics', 'User management'];
  }
  
  return { category, keywords, businessType, targetAudience, mainFeatures };
}

async function findCompetitorsWithAI(
  websiteContent: string,
  title: string,
  description: string,
  url: string,
  websiteInfo: any,
  currentDomain: string,
  openAIApiKey: string | null
): Promise<DiscoveredCompetitor[]> {
  if (!openAIApiKey) {
    return getFallbackCompetitors(websiteInfo, currentDomain);
  }

  const competitorPrompt = `
  Based on this website analysis, identify 5-6 real competitors:
  
  Website: ${url}
  Title: ${title}
  Description: ${description}
  Category: ${websiteInfo.category}
  Business Type: ${websiteInfo.businessType}
  Target Audience: ${websiteInfo.targetAudience}
  Main Features: ${websiteInfo.mainFeatures.join(', ')}
  Content Sample: ${websiteContent.substring(0, 1000)}
  
  Find REAL competitors that actually exist and compete in the same space. Include their actual URLs.
  
  Provide response in this JSON format:
  {
    "competitors": [
      {
        "name": "Actual Competitor Name",
        "url": "https://real-competitor-url.com",
        "description": "What this competitor does and why it's relevant",
        "relevanceReason": "Specific reason why this is a direct competitor",
        "estimatedTraffic": "High/Medium/Low",
        "score": 75-95
      }
    ]
  }
  
  Make sure to:
  1. Only suggest REAL websites that actually exist
  2. Avoid suggesting the input website itself
  3. Focus on direct competitors, not just similar industries
  4. Include actual website URLs (not example.com)
  5. Provide specific relevance reasons
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a competitive analysis expert who identifies real, existing competitors for businesses. You have knowledge of actual websites and companies across industries.' },
          { role: 'user', content: competitorPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.2
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const aiResponse = JSON.parse(jsonMatch[0]);
        return aiResponse.competitors.map((comp: any) => ({
          name: comp.name,
          score: comp.score || Math.floor(Math.random() * 20) + 75,
          category: websiteInfo.category,
          url: comp.url,
          description: comp.description,
          relevanceReason: comp.relevanceReason,
          estimatedTraffic: comp.estimatedTraffic
        })).filter((comp: any) => {
          // Filter out the current domain
          try {
            const competitorDomain = new URL(comp.url).hostname.toLowerCase().replace('www.', '');
            return competitorDomain !== currentDomain;
          } catch {
            return false; // Invalid URL
          }
        });
      }
    }
  } catch (error) {
    console.error('AI competitor discovery failed:', error);
  }

  // Fallback to category-based competitors
  return getFallbackCompetitors(websiteInfo, currentDomain);
}

function getFallbackCompetitors(websiteInfo: any, currentDomain: string): DiscoveredCompetitor[] {
  const category = websiteInfo.category;
  let competitors: DiscoveredCompetitor[] = [];

  // Category-specific real competitors
  if (category.includes('Communication') || category.includes('Messaging')) {
    competitors = [
      {
        name: "Telegram",
        score: Math.floor(Math.random() * 10) + 85,
        category,
        url: "https://telegram.org",
        description: "Secure messaging platform with advanced features",
        relevanceReason: "Direct competitor in instant messaging space",
        estimatedTraffic: "Very High"
      },
      {
        name: "Discord",
        score: Math.floor(Math.random() * 10) + 80,
        category,
        url: "https://discord.com",
        description: "Communication platform for communities and gaming",
        relevanceReason: "Popular messaging platform with community features",
        estimatedTraffic: "High"
      },
      {
        name: "Slack",
        score: Math.floor(Math.random() * 10) + 82,
        category,
        url: "https://slack.com",
        description: "Business communication and collaboration platform",
        relevanceReason: "Leading business messaging solution",
        estimatedTraffic: "High"
      }
    ];
  } else if (category.includes('Video') || category.includes('Media')) {
    competitors = [
      {
        name: "Vimeo",
        score: Math.floor(Math.random() * 10) + 78,
        category,
        url: "https://vimeo.com",
        description: "Video hosting platform for creators",
        relevanceReason: "Direct competitor in video streaming and hosting",
        estimatedTraffic: "High"
      },
      {
        name: "TikTok",
        score: Math.floor(Math.random() * 10) + 88,
        category,
        url: "https://tiktok.com",
        description: "Short-form video sharing platform",
        relevanceReason: "Major competitor in video content and social media",
        estimatedTraffic: "Very High"
      },
      {
        name: "Twitch",
        score: Math.floor(Math.random() * 10) + 85,
        category,
        url: "https://twitch.tv",
        description: "Live streaming platform for gaming and entertainment",
        relevanceReason: "Leading platform for live video streaming",
        estimatedTraffic: "Very High"
      }
    ];
  } else if (category.includes('E-commerce')) {
    competitors = [
      {
        name: "Shopify",
        score: Math.floor(Math.random() * 10) + 88,
        category,
        url: "https://shopify.com",
        description: "Leading e-commerce platform",
        relevanceReason: "Industry leader in e-commerce solutions",
        estimatedTraffic: "Very High"
      },
      {
        name: "WooCommerce",
        score: Math.floor(Math.random() * 10) + 85,
        category,
        url: "https://woocommerce.com",
        description: "WordPress e-commerce plugin",
        relevanceReason: "Popular e-commerce platform for WordPress sites",
        estimatedTraffic: "High"
      }
    ];
  } else {
    // Default high-quality competitors for general business
    competitors = [
      {
        name: "Notion",
        score: Math.floor(Math.random() * 10) + 88,
        category: "Productivity/SaaS",
        url: "https://notion.so",
        description: "All-in-one workspace for notes, docs, and collaboration",
        relevanceReason: "Popular productivity and collaboration platform",
        estimatedTraffic: "Very High"
      },
      {
        name: "Airtable",
        score: Math.floor(Math.random() * 10) + 85,
        category: "Productivity/SaaS",
        url: "https://airtable.com",
        description: "Database and spreadsheet hybrid platform",
        relevanceReason: "Leading no-code database solution",
        estimatedTraffic: "High"
      },
      {
        name: "Linear",
        score: Math.floor(Math.random() * 10) + 82,
        category: "Project Management",
        url: "https://linear.app",
        description: "Modern project management and issue tracking",
        relevanceReason: "Popular among tech teams for project management",
        estimatedTraffic: "Medium"
      }
    ];
  }

  // Filter out current domain
  return competitors.filter(comp => {
    try {
      const competitorDomain = new URL(comp.url).hostname.toLowerCase().replace('www.', '');
      return competitorDomain !== currentDomain;
    } catch {
      return false;
    }
  });
}
