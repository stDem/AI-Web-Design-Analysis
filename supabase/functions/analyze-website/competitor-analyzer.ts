
export async function analyzeCompetitors(
  htmlContent: string,
  title: string,
  description: string,
  url: string
): Promise<{
  competitors: Array<{ 
    name: string; 
    score: number; 
    category: string;
    url?: string;
    description?: string;
  }>;
  category: string;
  suggestedAnalysis?: Array<{
    name: string;
    url: string;
    reason: string;
    popularity: string;
  }>;
}> {
  // Extract domain from the current URL to avoid suggesting the same website
  const currentDomain = new URL(url).hostname.toLowerCase().replace('www.', '');
  
  // Determine category based on content analysis
  const content = htmlContent.toLowerCase();
  const titleLower = title.toLowerCase();
  const descriptionLower = description?.toLowerCase() || '';
  const urlLower = url.toLowerCase();
  
  let category = 'general';
  let competitors = [];
  let suggestedAnalysis = [];
  
  // Helper function to filter out current website from competitors
  const filterCurrentWebsite = (competitorList: any[]) => {
    return competitorList.filter(comp => {
      if (!comp.url) return true;
      const competitorDomain = new URL(comp.url).hostname.toLowerCase().replace('www.', '');
      return competitorDomain !== currentDomain;
    });
  };
  
  // More comprehensive category detection
  if (content.includes('whatsapp') || content.includes('telegram') || content.includes('messenger') || 
      content.includes('chat') || content.includes('messaging') || titleLower.includes('whatsapp') ||
      urlLower.includes('whatsapp') || urlLower.includes('telegram')) {
    category = 'Communication/Messaging';
    competitors = [
      {
        name: "Telegram",
        score: Math.floor(Math.random() * 10) + 88,
        category,
        url: "https://web.telegram.org",
        description: "Fast, secure messaging platform with excellent web interface"
      },
      {
        name: "Discord", 
        score: Math.floor(Math.random() * 10) + 85,
        category,
        url: "https://discord.com", 
        description: "Modern communication platform with great UX"
      },
      {
        name: "Signal",
        score: Math.floor(Math.random() * 15) + 80,
        category,
        url: "https://signal.org",
        description: "Privacy-focused messaging with clean design"
      },
      {
        name: "Slack",
        score: Math.floor(Math.random() * 10) + 82,
        category,
        url: "https://slack.com",
        description: "Business communication platform with excellent UX"
      }
    ];
    suggestedAnalysis = [
      {
        name: "Telegram Web",
        url: "https://web.telegram.org",
        reason: "Direct competitor with excellent responsive design and messaging UX patterns",
        popularity: "Very High"
      },
      {
        name: "Discord",
        url: "https://discord.com", 
        reason: "Modern communication interface with great user experience design",
        popularity: "High"
      }
    ];
  } else if (content.includes('youtube') || content.includes('video') || content.includes('watch') || 
             titleLower.includes('youtube') || urlLower.includes('youtube')) {
    category = 'Video/Streaming';
    competitors = [
      {
        name: "Netflix",
        score: Math.floor(Math.random() * 10) + 90,
        category,
        url: "https://netflix.com",
        description: "Leading streaming platform with excellent UX"
      },
      {
        name: "Vimeo", 
        score: Math.floor(Math.random() * 10) + 85,
        category,
        url: "https://vimeo.com", 
        description: "Professional video platform with clean design"
      },
      {
        name: "Twitch",
        score: Math.floor(Math.random() * 15) + 82,
        category,
        url: "https://twitch.tv",
        description: "Live streaming platform with engaging interface"
      },
      {
        name: "Dailymotion",
        score: Math.floor(Math.random() * 10) + 78,
        category,
        url: "https://dailymotion.com",
        description: "Video sharing platform with modern interface"
      }
    ];
    suggestedAnalysis = [
      {
        name: "Netflix",
        url: "https://netflix.com",
        reason: "Industry leader in video streaming UX and content discovery",
        popularity: "Very High"
      },
      {
        name: "Vimeo",
        url: "https://vimeo.com", 
        reason: "Clean, professional video platform design patterns",
        popularity: "High"
      }
    ];
  } else if (content.includes('amazon') || content.includes('shop') || content.includes('cart') || 
             content.includes('buy') || content.includes('product') || titleLower.includes('amazon') ||
             urlLower.includes('amazon') || content.includes('ecommerce')) {
    category = 'E-commerce';
    competitors = [
      {
        name: "eBay",
        score: Math.floor(Math.random() * 10) + 85,
        category,
        url: "https://ebay.com",
        description: "Global marketplace with comprehensive shopping experience"
      },
      {
        name: "Shopify", 
        score: Math.floor(Math.random() * 10) + 88,
        category,
        url: "https://shopify.com", 
        description: "Leading e-commerce platform with modern design"
      },
      {
        name: "Etsy",
        score: Math.floor(Math.random() * 15) + 80,
        category,
        url: "https://etsy.com",
        description: "Creative marketplace with strong user experience"
      },
      {
        name: "Alibaba",
        score: Math.floor(Math.random() * 10) + 83,
        category,
        url: "https://alibaba.com",
        description: "Global B2B marketplace with comprehensive features"
      }
    ];
    suggestedAnalysis = [
      {
        name: "eBay",
        url: "https://ebay.com",
        reason: "Direct e-commerce competitor with excellent search and discovery patterns",
        popularity: "Very High"
      },
      {
        name: "Shopify Stores",
        url: "https://themes.shopify.com", 
        reason: "Best practices for e-commerce design and conversion optimization",
        popularity: "High"
      }
    ];
  } else if (content.includes('blog') || content.includes('article') || content.includes('news') || 
             content.includes('post') || titleLower.includes('blog')) {
    category = 'Content/Blog';
    competitors = [
      {
        name: "Medium",
        score: Math.floor(Math.random() * 10) + 88,
        category,
        url: "https://medium.com",
        description: "Clean, readable content platform"
      },
      {
        name: "WordPress.com", 
        score: Math.floor(Math.random() * 10) + 82,
        category,
        url: "https://wordpress.com", 
        description: "Popular blogging platform with great themes"
      },
      {
        name: "Substack",
        score: Math.floor(Math.random() * 15) + 80,
        category,
        url: "https://substack.com",
        description: "Modern newsletter and publishing platform"
      },
      {
        name: "Ghost",
        score: Math.floor(Math.random() * 10) + 84,
        category,
        url: "https://ghost.org",
        description: "Professional publishing platform with clean design"
      }
    ];
    suggestedAnalysis = [
      {
        name: "Medium",
        url: "https://medium.com",
        reason: "Excellent typography and reading experience patterns",
        popularity: "Very High"
      },
      {
        name: "The New York Times",
        url: "https://nytimes.com", 
        reason: "Professional news layout and accessibility standards",
        popularity: "High"
      }
    ];
  } else if (content.includes('portfolio') || content.includes('designer') || content.includes('creative') || 
             content.includes('work') || titleLower.includes('portfolio')) {
    category = 'Portfolio';
    competitors = [
      {
        name: "Behance",
        score: Math.floor(Math.random() * 10) + 85,
        category,
        url: "https://behance.net",
        description: "Creative portfolio showcase platform"
      },
      {
        name: "Dribbble", 
        score: Math.floor(Math.random() * 10) + 83,
        category,
        url: "https://dribbble.com", 
        description: "Design community with beautiful portfolios"
      },
      {
        name: "Adobe Portfolio",
        score: Math.floor(Math.random() * 15) + 78,
        category,
        url: "https://portfolio.adobe.com",
        description: "Professional portfolio builder with modern templates"
      },
      {
        name: "DeviantArt",
        score: Math.floor(Math.random() * 10) + 76,
        category,
        url: "https://deviantart.com",
        description: "Creative community with portfolio features"
      }
    ];
    suggestedAnalysis = [
      {
        name: "Awwwards",
        url: "https://awwwards.com",
        reason: "Award-winning web design examples and trends",
        popularity: "High"
      },
      {
        name: "Behance",
        url: "https://behance.net", 
        reason: "Creative showcase patterns and visual hierarchy",
        popularity: "Very High"
      }
    ];
  } else if (content.includes('saas') || content.includes('software') || content.includes('app') || 
             content.includes('dashboard') || content.includes('platform')) {
    category = 'SaaS/Software';
    competitors = [
      {
        name: "Slack",
        score: Math.floor(Math.random() * 10) + 88,
        category,
        url: "https://slack.com",
        description: "Excellent SaaS UX and onboarding"
      },
      {
        name: "Notion", 
        score: Math.floor(Math.random() * 10) + 86,
        category,
        url: "https://notion.so", 
        description: "Clean interface with powerful functionality"
      },
      {
        name: "Figma",
        score: Math.floor(Math.random() * 10) + 85,
        category,
        url: "https://figma.com",
        description: "Modern design tool with intuitive interface"
      },
      {
        name: "Airtable",
        score: Math.floor(Math.random() * 10) + 82,
        category,
        url: "https://airtable.com",
        description: "Database platform with excellent user experience"
      }
    ];
    suggestedAnalysis = [
      {
        name: "Stripe",
        url: "https://stripe.com",
        reason: "Excellent developer-focused design and documentation",
        popularity: "Very High"
      },
      {
        name: "Linear",
        url: "https://linear.app", 
        reason: "Modern SaaS interface design and performance",
        popularity: "High"
      }
    ];
  } else if (content.includes('restaurant') || content.includes('food') || content.includes('menu') || 
             content.includes('cafe') || titleLower.includes('restaurant')) {
    category = 'Restaurant/Food';
    competitors = [
      {
        name: "OpenTable",
        score: Math.floor(Math.random() * 10) + 82,
        category,
        url: "https://opentable.com",
        description: "Leading restaurant booking platform"
      },
      {
        name: "Yelp", 
        score: Math.floor(Math.random() * 10) + 78,
        category,
        url: "https://yelp.com", 
        description: "Popular restaurant discovery platform"
      },
      {
        name: "DoorDash",
        score: Math.floor(Math.random() * 15) + 75,
        category,
        url: "https://doordash.com",
        description: "Food delivery platform with modern UX"
      },
      {
        name: "Uber Eats",
        score: Math.floor(Math.random() * 10) + 77,
        category,
        url: "https://ubereats.com",
        description: "Food delivery service with clean interface"
      }
    ];
    suggestedAnalysis = [
      {
        name: "OpenTable",
        url: "https://opentable.com",
        reason: "Restaurant industry leader with excellent booking UX",
        popularity: "High"
      },
      {
        name: "Uber Eats",
        url: "https://ubereats.com", 
        reason: "Clean, conversion-focused food delivery design",
        popularity: "High"
      }
    ];
  } else {
    // Default competitors for general websites - try to detect from URL patterns
    if (urlLower.includes('google') || titleLower.includes('google')) {
      category = 'Search/Tech';
      competitors = [
        {
          name: "Bing",
          score: Math.floor(Math.random() * 10) + 80,
          category,
          url: "https://bing.com",
          description: "Microsoft's search engine with modern interface"
        },
        {
          name: "DuckDuckGo", 
          score: Math.floor(Math.random() * 10) + 75,
          category,
          url: "https://duckduckgo.com", 
          description: "Privacy-focused search with clean design"
        },
        {
          name: "Yahoo",
          score: Math.floor(Math.random() * 15) + 70,
          category,
          url: "https://yahoo.com",
          description: "Classic web portal with comprehensive features"
        },
        {
          name: "Yandex",
          score: Math.floor(Math.random() * 10) + 72,
          category,
          url: "https://yandex.com",
          description: "Russian search engine with modern design"
        }
      ];
      suggestedAnalysis = [
        {
          name: "Bing",
          url: "https://bing.com",
          reason: "Direct search competitor with modern interface design",
          popularity: "High"
        },
        {
          name: "DuckDuckGo",
          url: "https://duckduckgo.com", 
          reason: "Clean, minimalist search interface patterns",
          popularity: "Medium"
        }
      ];
    } else {
      // Default general competitors
      competitors = [
        {
          name: "Apple",
          score: Math.floor(Math.random() * 5) + 95,
          category: "General",
          url: "https://apple.com",
          description: "Industry leader in design and user experience"
        },
        {
          name: "Microsoft", 
          score: Math.floor(Math.random() * 5) + 88,
          category: "General",
          url: "https://microsoft.com", 
          description: "Clean, accessible design with excellent performance"
        },
        {
          name: "Airbnb",
          score: Math.floor(Math.random() * 10) + 85,
          category: "General",
          url: "https://airbnb.com",
          description: "Great user experience and visual design"
        },
        {
          name: "Stripe",
          score: Math.floor(Math.random() * 10) + 87,
          category: "General",
          url: "https://stripe.com",
          description: "Excellent developer-focused design and documentation"
        }
      ];
      suggestedAnalysis = [
        {
          name: "Apple",
          url: "https://apple.com",
          reason: "Gold standard for clean, accessible web design",
          popularity: "Very High"
        },
        {
          name: "Stripe",
          url: "https://stripe.com", 
          reason: "Excellent example of developer-focused design",
          popularity: "High"
        }
      ];
    }
  }

  // Filter out the current website from competitors and suggested analysis
  competitors = filterCurrentWebsite(competitors);
  suggestedAnalysis = suggestedAnalysis.filter(suggestion => {
    if (!suggestion.url) return true;
    const suggestionDomain = new URL(suggestion.url).hostname.toLowerCase().replace('www.', '');
    return suggestionDomain !== currentDomain;
  });

  return {
    competitors,
    category,
    suggestedAnalysis
  };
}
