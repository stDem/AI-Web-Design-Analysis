
import { AnalysisResult } from './types.ts';

export async function analyzeWithGroq(
  htmlContent: string,
  title: string,
  url: string,
  category: string,
  groqApiKey: string | null
): Promise<Partial<AnalysisResult> | null> {
  if (!groqApiKey) {
    return null;
  }

  const analysisPrompt = `
  You are a UX/UI expert conducting a DETAILED analysis of this specific website's HTML structure and content.

  WEBSITE INFORMATION:
  - Title: ${title}
  - URL: ${url}
  - Category: ${category}
  
  ACTUAL HTML CONTENT TO ANALYZE:
  ${htmlContent.substring(0, 12000)}

  CRITICAL INSTRUCTIONS FOR ANNOTATIONS:
  1. You MUST base your analysis ONLY on the actual HTML content provided above
  2. For annotations, analyze the HTML structure to determine realistic screen positions
  3. Look for actual elements like navigation bars, headers, buttons, forms, images
  4. Calculate approximate pixel positions based on typical website layouts:
     - Header/navigation: y: 0-100
     - Main content area: y: 100-500
     - Footer area: y: 500+
     - Left content: x: 50-400
     - Center content: x: 400-800
     - Right content: x: 800+
  5. Each annotation must reference a SPECIFIC element found in the HTML
  6. Provide 3-5 annotations maximum, focusing on the most important issues

  SPECIFIC ANALYSIS REQUIREMENTS:
  - Count actual images and check for missing alt attributes
  - Examine heading structure (h1, h2, h3, etc.) for proper hierarchy
  - Look for form elements and their accessibility features
  - Check for semantic HTML usage vs div soup
  - Identify inline styles vs external CSS
  - Look for JavaScript framework indicators (React, Vue, etc.)
  - Examine meta tags for SEO and performance
  - Check for actual performance issues (large inline CSS, blocking scripts)

  Provide analysis in this JSON format:
  {
    "designScore": number (0-100, based on actual HTML quality),
    "categoryScores": {
      "ux": number (based on actual navigation and content structure found),
      "accessibility": number (based on actual WCAG compliance issues found),
      "performance": number (based on actual HTML structure and resource loading),
      "code": number (based on actual HTML/CSS quality and semantic markup)
    },
    "issues": [
      {
        "type": "accessibility|performance|ux|code",
        "severity": "high|medium|low",
        "description": "SPECIFIC issue found in the HTML (e.g., 'Image at line 45 missing alt attribute')",
        "location": "EXACT element, class name, or HTML structure identified"
      }
    ],
    "suggestions": [
      "SPECIFIC actionable improvements referencing actual HTML elements found (e.g., 'Add alt text to the 3 images in the hero section', 'Replace div.navigation with semantic <nav> element')"
    ],
    "annotations": [
      {
        "x": number (realistic screen position based on typical layout - consider element position in HTML structure),
        "y": number (realistic screen position based on content structure - header elements around y:50-100, main content y:150-400, footer y:500+),
        "note": "Specific improvement for actual element found in HTML",
        "type": "improvement|issue|suggestion",
        "element": "ACTUAL HTML element or class name found in the code (e.g., 'nav.main-menu', 'button.cta-primary', 'img.hero-image')"
      }
    ],
    "codeSuggestions": [
      {
        "file": "inferred file type based on HTML structure (e.g., 'index.html', 'styles.css', 'main.js')",
        "issue": "SPECIFIC code issue found in the HTML",
        "type": "performance|accessibility|maintainability|security",
        "before": "ACTUAL problematic HTML/CSS pattern found or reasonably inferred",
        "after": "IMPROVED code suggestion",
        "explanation": "Why this specific change improves the website based on the HTML analysis"
      }
    ]
  }

  ANNOTATION POSITIONING EXAMPLES:
  - If you find a navigation bar in the HTML header, place annotation around x:200-600, y:50-80
  - If you find a main heading or hero section, place around x:300-500, y:120-200
  - If you find buttons or CTAs in the main content, place around x:200-600, y:200-400
  - If you find footer content, place around x:300-500, y:500-600
  - Consider the flow of HTML elements from top to bottom when assigning y coordinates

  REMEMBER: Every annotation must reference a REAL element you can identify in the provided HTML code!
  `;

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Updated to a currently supported model
        messages: [
          { 
            role: 'system', 
            content: 'You are a senior UX/UI analyst who provides detailed, specific analysis based on actual HTML content. You never give generic advice - every suggestion must reference real elements found in the provided HTML code. Be forensic in your analysis and precise with annotation positioning based on typical website layouts.' 
          },
          { role: 'user', content: analysisPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.1 // Lower temperature for more consistent, analytical responses
      }),
    });

    if (groqResponse.ok) {
      const groqData = await groqResponse.json();
      const content = groqData.choices[0].message.content;
      
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error('Failed to parse Groq response JSON:', parseError);
          console.log('Raw Groq response:', content);
        }
      }
    } else {
      console.error('Groq API error:', await groqResponse.text());
    }
  } catch (error) {
    console.error('Groq analysis failed:', error);
  }

  return null;
}
