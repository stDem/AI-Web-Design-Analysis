
import { discoverCompetitors } from './competitor-discovery.ts';

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
  console.log('Starting dynamic competitor analysis for:', url);
  
  // Get OpenAI API key for enhanced analysis
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  try {
    // Use the new dynamic competitor discovery
    const result = await discoverCompetitors(
      htmlContent,
      title,
      description,
      url,
      openAIApiKey
    );
    
    console.log('Dynamic competitor analysis completed:', result.competitors.length, 'competitors found');
    return result;
    
  } catch (error) {
    console.error('Dynamic competitor analysis failed, falling back to static analysis:', error);
    
    // Fallback to the original static analysis if dynamic fails
    return getFallbackCompetitors(htmlContent, title, description, url);
  }
}

// Fallback function with original logic (simplified)
function getFallbackCompetitors(
  htmlContent: string,
  title: string,
  description: string,
  url: string
): {
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
} {
  // Extract domain from the current URL to avoid suggesting the same website
  const currentDomain = new URL(url).hostname.toLowerCase().replace('www.', '');
  
  const content = htmlContent.toLowerCase();
  const titleLower = title.toLowerCase();
  const descriptionLower = description?.toLowerCase() || '';
  
  let category = 'General Business';
  let competitors = [];
  let suggestedAnalysis = [];
  
  // Simplified category detection with better competitors
  if (content.includes('ecommerce') || content.includes('shop') || content.includes('store')) {
    category = 'E-commerce';
    competitors = [
      {
        name: "Shopify",
        score: Math.floor(Math.random() * 10) + 88,
        category,
        url: "https://shopify.com",
        description: "Leading e-commerce platform with modern design"
      },
      {
        name: "WooCommerce", 
        score: Math.floor(Math.random() * 10) + 85,
        category,
        url: "https://woocommerce.com", 
        description: "Popular WordPress e-commerce solution"
      },
      {
        name: "BigCommerce",
        score: Math.floor(Math.random() * 15) + 80,
        category,
        url: "https://bigcommerce.com",
        description: "Enterprise e-commerce platform"
      }
    ];
    suggestedAnalysis = [
      {
        name: "Shopify",
        url: "https://shopify.com",
        reason: "Industry leader in e-commerce platform design and user experience",
        popularity: "Very High"
      }
    ];
  } else {
    // Default high-quality competitors
    competitors = [
      {
        name: "Apple",
        score: Math.floor(Math.random() * 5) + 95,
        category: "General",
        url: "https://apple.com",
        description: "Industry leader in design and user experience"
      },
      {
        name: "Stripe", 
        score: Math.floor(Math.random() * 5) + 90,
        category: "General",
        url: "https://stripe.com", 
        description: "Excellent developer-focused design and documentation"
      },
      {
        name: "Linear",
        score: Math.floor(Math.random() * 10) + 85,
        category: "General",
        url: "https://linear.app",
        description: "Modern SaaS interface design and performance"
      }
    ];
    suggestedAnalysis = [
      {
        name: "Apple",
        url: "https://apple.com",
        reason: "Gold standard for clean, accessible web design",
        popularity: "Very High"
      }
    ];
  }

  // Filter out the current website from competitors
  competitors = competitors.filter(comp => {
    if (!comp.url) return true;
    const competitorDomain = new URL(comp.url).hostname.toLowerCase().replace('www.', '');
    return competitorDomain !== currentDomain;
  });

  return {
    competitors,
    category,
    suggestedAnalysis
  };
}
