
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
    console.log('No OpenAI API key available, using content-based competitor discovery');
    return getContentBasedCompetitors(websiteInfo, websiteContent, title, currentDomain);
  }

  const competitorPrompt = `
  Based on this website analysis, identify 5-6 real competitors that actually exist and compete directly:
  
  Website: ${url}
  Title: ${title}
  Description: ${description}
  Category: ${websiteInfo.category}
  Business Type: ${websiteInfo.businessType}
  Target Audience: ${websiteInfo.targetAudience}
  Main Features: ${websiteInfo.mainFeatures.join(', ')}
  Keywords: ${websiteInfo.keywords.join(', ')}
  Content Sample: ${websiteContent.substring(0, 1500)}
  
  Find REAL competitors that actually exist and compete in the same space. Research actual companies, not generic examples.
  
  Provide response in this JSON format:
  {
    "competitors": [
      {
        "name": "Actual Competitor Name",
        "url": "https://real-competitor-url.com",
        "description": "What this competitor does and why it's relevant",
        "relevanceReason": "Specific reason why this is a direct competitor based on the analyzed website",
        "estimatedTraffic": "Very High/High/Medium/Low",
        "score": 75-95
      }
    ]
  }
  
  Important requirements:
  1. Only suggest REAL websites that actually exist
  2. Avoid suggesting the input website itself (${currentDomain})
  3. Focus on direct competitors, not just similar industries
  4. Include actual working website URLs
  5. Provide specific relevance reasons based on the website content
  6. Return exactly 5-6 competitors, not less
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
          { role: 'system', content: 'You are a competitive analysis expert who identifies real, existing competitors for businesses. You have extensive knowledge of actual websites and companies across all industries. Always return 5-6 competitors.' },
          { role: 'user', content: competitorPrompt }
        ],
        max_tokens: 2500,
        temperature: 0.3
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const aiResponse = JSON.parse(jsonMatch[0]);
        const competitors = aiResponse.competitors.map((comp: any) => ({
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
        
        // If we got fewer than 4 competitors, supplement with content-based ones
        if (competitors.length < 4) {
          const additionalCompetitors = getContentBasedCompetitors(websiteInfo, websiteContent, title, currentDomain);
          const combined = [...competitors, ...additionalCompetitors];
          return combined.slice(0, 6); // Limit to 6 total
        }
        
        return competitors;
      }
    } else {
      const errorText = await response.text();
      console.error('AI competitor discovery API error:', errorText);
    }
  } catch (error) {
    console.error('AI competitor discovery failed:', error);
  }

  // Fallback to content-based discovery
  console.log('Using content-based competitor discovery as fallback');
  return getContentBasedCompetitors(websiteInfo, websiteContent, title, currentDomain);
}

function getContentBasedCompetitors(
  websiteInfo: any, 
  content: string, 
  title: string, 
  currentDomain: string
): DiscoveredCompetitor[] {
  const category = websiteInfo.category;
  const contentLower = content.toLowerCase();
  const titleLower = title.toLowerCase();
  
  // Create a knowledge base of real competitors for different industries
  const competitorKnowledge: Record<string, DiscoveredCompetitor[]> = {
    'messaging': [
      { name: "Telegram", url: "https://telegram.org", description: "Secure messaging platform with advanced features", relevanceReason: "Direct competitor in instant messaging space", estimatedTraffic: "Very High", score: 88, category },
      { name: "Discord", url: "https://discord.com", description: "Communication platform for communities and gaming", relevanceReason: "Popular messaging platform with community features", estimatedTraffic: "Very High", score: 85, category },
      { name: "Slack", url: "https://slack.com", description: "Business communication and collaboration platform", relevanceReason: "Leading business messaging solution", estimatedTraffic: "High", score: 87, category },
      { name: "Microsoft Teams", url: "https://teams.microsoft.com", description: "Enterprise communication and collaboration", relevanceReason: "Major competitor in business messaging", estimatedTraffic: "Very High", score: 86, category },
      { name: "Zoom", url: "https://zoom.us", description: "Video conferencing and communication platform", relevanceReason: "Leading video communication solution", estimatedTraffic: "Very High", score: 84, category }
    ],
    'video': [
      { name: "Vimeo", url: "https://vimeo.com", description: "Video hosting platform for creators", relevanceReason: "Direct competitor in video streaming and hosting", estimatedTraffic: "High", score: 82, category },
      { name: "TikTok", url: "https://tiktok.com", description: "Short-form video sharing platform", relevanceReason: "Major competitor in video content and social media", estimatedTraffic: "Very High", score: 90, category },
      { name: "Twitch", url: "https://twitch.tv", description: "Live streaming platform for gaming and entertainment", relevanceReason: "Leading platform for live video streaming", estimatedTraffic: "Very High", score: 88, category },
      { name: "Dailymotion", url: "https://dailymotion.com", description: "Video sharing and streaming platform", relevanceReason: "Alternative video hosting platform", estimatedTraffic: "Medium", score: 75, category },
      { name: "Wistia", url: "https://wistia.com", description: "Professional video hosting for businesses", relevanceReason: "Business-focused video platform", estimatedTraffic: "Medium", score: 78, category }
    ],
    'ecommerce': [
      { name: "Shopify", url: "https://shopify.com", description: "Leading e-commerce platform", relevanceReason: "Industry leader in e-commerce solutions", estimatedTraffic: "Very High", score: 92, category },
      { name: "WooCommerce", url: "https://woocommerce.com", description: "WordPress e-commerce plugin", relevanceReason: "Popular e-commerce platform for WordPress sites", estimatedTraffic: "High", score: 87, category },
      { name: "BigCommerce", url: "https://bigcommerce.com", description: "Enterprise e-commerce platform", relevanceReason: "Scalable e-commerce solution", estimatedTraffic: "High", score: 85, category },
      { name: "Magento", url: "https://magento.com", description: "Open-source e-commerce platform", relevanceReason: "Flexible e-commerce framework", estimatedTraffic: "Medium", score: 82, category },
      { name: "Square Online", url: "https://squareup.com/us/en/online-store", description: "Integrated e-commerce and POS solution", relevanceReason: "All-in-one commerce platform", estimatedTraffic: "High", score: 83, category }
    ],
    'default': [
      { name: "Notion", url: "https://notion.so", description: "All-in-one workspace for notes, docs, and collaboration", relevanceReason: "Popular productivity and collaboration platform", estimatedTraffic: "Very High", score: 89, category: "Productivity/SaaS" },
      { name: "Airtable", url: "https://airtable.com", description: "Database and spreadsheet hybrid platform", relevanceReason: "Leading no-code database solution", estimatedTraffic: "High", score: 86, category: "Productivity/SaaS" },
      { name: "Linear", url: "https://linear.app", description: "Modern project management and issue tracking", relevanceReason: "Popular among tech teams for project management", estimatedTraffic: "Medium", score: 84, category: "Project Management" },
      { name: "Figma", url: "https://figma.com", description: "Collaborative design and prototyping platform", relevanceReason: "Leading design collaboration tool", estimatedTraffic: "Very High", score: 91, category: "Design Tools" },
      { name: "Canva", url: "https://canva.com", description: "Online graphic design platform", relevanceReason: "Popular design tool for non-designers", estimatedTraffic: "Very High", score: 88, category: "Design Tools" }
    ]
  };
  
  // Determine which competitor set to use based on content analysis
  let selectedCompetitors: DiscoveredCompetitor[] = competitorKnowledge['default'];
  
  if (contentLower.includes('whatsapp') || contentLower.includes('telegram') || contentLower.includes('chat') || contentLower.includes('messaging') || category.includes('Communication')) {
    selectedCompetitors = competitorKnowledge['messaging'];
  } else if (contentLower.includes('youtube') || contentLower.includes('video') || contentLower.includes('stream') || category.includes('Video')) {
    selectedCompetitors = competitorKnowledge['video'];
  } else if (contentLower.includes('shop') || contentLower.includes('store') || contentLower.includes('ecommerce') || category.includes('E-commerce')) {
    selectedCompetitors = competitorKnowledge['ecommerce'];
  }
  
  // Filter out current domain and return 5-6 competitors
  const filteredCompetitors = selectedCompetitors.filter(comp => {
    try {
      const competitorDomain = new URL(comp.url).hostname.toLowerCase().replace('www.', '');
      return competitorDomain !== currentDomain;
    } catch {
      return false;
    }
  });
  
  return filteredCompetitors.slice(0, 6);
}
