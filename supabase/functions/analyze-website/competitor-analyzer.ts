
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
  // Determine category based on content analysis
  const content = htmlContent.toLowerCase();
  let category = 'general';
  let competitors = [];
  let suggestedAnalysis = [];
  
  if (content.includes('ecommerce') || content.includes('shop') || content.includes('cart') || content.includes('product')) {
    category = 'E-commerce';
    competitors = [
      {
        name: "Amazon",
        score: Math.floor(Math.random() * 10) + 90, // 90-100
        category,
        url: "https://amazon.com",
        description: "Global e-commerce leader with excellent UX"
      },
      {
        name: "Shopify", 
        score: Math.floor(Math.random() * 10) + 85, // 85-95
        category,
        url: "https://shopify.com", 
        description: "Leading e-commerce platform with modern design"
      },
      {
        name: "Etsy",
        score: Math.floor(Math.random() * 15) + 80, // 80-95
        category,
        url: "https://etsy.com",
        description: "Creative marketplace with strong user experience"
      }
    ];
    suggestedAnalysis = [
      {
        name: "Amazon",
        url: "https://amazon.com",
        reason: "Market leader with excellent checkout and product discovery patterns",
        popularity: "Very High"
      },
      {
        name: "Shopify Stores",
        url: "https://themes.shopify.com", 
        reason: "Best practices for e-commerce design and conversion optimization",
        popularity: "High"
      }
    ];
  } else if (content.includes('blog') || content.includes('article') || content.includes('news') || content.includes('post')) {
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
        name: "Ghost",
        score: Math.floor(Math.random() * 15) + 80,
        category,
        url: "https://ghost.org",
        description: "Modern publishing platform focused on performance"
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
  } else if (content.includes('portfolio') || content.includes('designer') || content.includes('creative') || content.includes('work')) {
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
  } else if (content.includes('saas') || content.includes('software') || content.includes('app') || content.includes('dashboard')) {
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
  } else if (content.includes('restaurant') || content.includes('food') || content.includes('menu') || content.includes('cafe')) {
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
        name: "Resy",
        score: Math.floor(Math.random() * 15) + 75,
        category,
        url: "https://resy.com",
        description: "Modern reservation platform with great UX"
      }
    ];
    suggestedAnalysis = [
      {
        name: "Toast",
        url: "https://pos.toasttab.com",
        reason: "Restaurant technology leader with excellent design",
        popularity: "High"
      },
      {
        name: "Square Restaurants",
        url: "https://squareup.com/us/en/restaurants", 
        reason: "Clean, conversion-focused restaurant website design",
        popularity: "High"
      }
    ];
  } else {
    // Default competitors for general websites
    competitors = [
      {
        name: "Apple",
        score: Math.floor(Math.random() * 5) + 95,
        category: "General",
        url: "https://apple.com",
        description: "Industry leader in design and user experience"
      },
      {
        name: "Google", 
        score: Math.floor(Math.random() * 5) + 90,
        category: "General",
        url: "https://google.com", 
        description: "Clean, accessible design with excellent performance"
      },
      {
        name: "Airbnb",
        score: Math.floor(Math.random() * 10) + 85,
        category: "General",
        url: "https://airbnb.com",
        description: "Great user experience and visual design"
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

  return {
    competitors,
    category,
    suggestedAnalysis
  };
}
