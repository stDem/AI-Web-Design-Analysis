
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
  const websiteInfo = await extractWebsiteInfo(websiteContent, title, description);
  
  // Step 2: Find competitors using free AI models
  const competitors = await findCompetitorsWithFreeAI(
    websiteContent,
    title,
    description,
    url,
    websiteInfo,
    currentDomain
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
  description: string
): Promise<{
  category: string;
  keywords: string[];
  businessType: string;
  targetAudience: string;
  mainFeatures: string[];
}> {
  // Try Groq API first
  const groqApiKey = Deno.env.get('GROQ_API_KEY');
  if (groqApiKey) {
    try {
      return await analyzeWithGroq(content, title, description, groqApiKey);
    } catch (error) {
      console.error('Groq analysis failed:', error);
    }
  }
  
  // Fallback to content analysis
  return analyzeWebsiteContentFallback(content, title, description);
}

async function analyzeWithGroq(
  content: string,
  title: string,
  description: string,
  groqApiKey: string
): Promise<{
  category: string;
  keywords: string[];
  businessType: string;
  targetAudience: string;
  mainFeatures: string[];
}> {
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
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are a business analyst expert at categorizing websites and identifying competitive landscapes. Always respond with valid JSON.' },
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
  
  throw new Error('Failed to analyze with Groq');
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

async function findCompetitorsWithFreeAI(
  websiteContent: string,
  title: string,
  description: string,
  url: string,
  websiteInfo: any,
  currentDomain: string
): Promise<DiscoveredCompetitor[]> {
  // Try Groq API first
  const groqApiKey = Deno.env.get('GROQ_API_KEY');
  if (groqApiKey) {
    try {
      return await findCompetitorsWithGroq(
        websiteContent,
        title,
        description,
        url,
        websiteInfo,
        currentDomain,
        groqApiKey
      );
    } catch (error) {
      console.error('Groq competitor discovery failed:', error);
    }
  }
  
  console.log('No free AI API available, returning minimal placeholder results');
  return generateMinimalPlaceholderResults(websiteInfo.category);
}

async function findCompetitorsWithGroq(
  websiteContent: string,
  title: string,
  description: string,
  url: string,
  websiteInfo: any,
  currentDomain: string,
  groqApiKey: string
): Promise<DiscoveredCompetitor[]> {
  const competitorPrompt = `
  You are a competitive intelligence expert. Based on this website analysis, identify 5-6 REAL competitors that actually exist and compete directly in the same market space.

  Website: ${url}
  Title: ${title}
  Description: ${description}
  Category: ${websiteInfo.category}
  Business Type: ${websiteInfo.businessType}
  Target Audience: ${websiteInfo.targetAudience}
  Main Features: ${websiteInfo.mainFeatures.join(', ')}
  Keywords: ${websiteInfo.keywords.join(', ')}
  Content Sample: ${websiteContent.substring(0, 2000)}
  
  IMPORTANT REQUIREMENTS:
  1. Only suggest REAL websites that actually exist and are accessible
  2. Focus on DIRECT competitors, not just similar industries
  3. Avoid suggesting the input website itself (${currentDomain})
  4. Include actual working website URLs (must start with https://)
  5. Provide specific relevance reasons based on the analyzed website content
  6. Return exactly 5-6 competitors, not less
  7. Make sure each competitor is genuinely relevant to the analyzed website
  
  Analyze the website content deeply to understand:
  - What specific services/products they offer
  - Who their target market is
  - What makes them unique
  - What their main value proposition is
  
  Then find competitors who target the same market with similar offerings.

  Provide response in this exact JSON format:
  {
    "competitors": [
      {
        "name": "Actual Competitor Name",
        "url": "https://real-competitor-url.com",
        "description": "Detailed description of what this competitor does and their key offerings",
        "relevanceReason": "Specific explanation of why this is a direct competitor based on the analyzed website's content, features, and target market",
        "estimatedTraffic": "Very High/High/Medium/Low",
        "score": 75-95
      }
    ]
  }
  `;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { 
          role: 'system', 
          content: 'You are a competitive intelligence expert with extensive knowledge of businesses across all industries. You excel at identifying real, existing competitors based on detailed business analysis. Always provide exactly 5-6 competitors with real, working URLs. Always respond with valid JSON.' 
        },
        { role: 'user', content: competitorPrompt }
      ],
      max_tokens: 3000,
      temperature: 0.2
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
        // Filter out the current domain and validate URLs
        try {
          const competitorDomain = new URL(comp.url).hostname.toLowerCase().replace('www.', '');
          return competitorDomain !== currentDomain && comp.url.startsWith('https://');
        } catch {
          return false; // Invalid URL
        }
      });
      
      console.log(`Groq discovered ${competitors.length} valid competitors`);
      
      // If we got valid competitors, return them
      if (competitors.length >= 3) {
        return competitors.slice(0, 6);
      }
    }
  } else {
    const errorText = await response.text();
    console.error('Groq competitor discovery API error:', errorText);
  }

  throw new Error('Failed to discover competitors with Groq');
}

function generateMinimalPlaceholderResults(category: string): DiscoveredCompetitor[] {
  // Return minimal placeholder results when AI is unavailable
  return [
    {
      name: "Competitor analysis requires free API setup",
      score: 0,
      category: category,
      url: "#",
      description: "To enable dynamic competitor discovery, please add a GROQ_API_KEY to your Supabase secrets. Groq provides fast, free AI inference for competitor analysis.",
      relevanceReason: "Free AI API setup required for competitor discovery",
      estimatedTraffic: "Unknown"
    }
  ];
}
