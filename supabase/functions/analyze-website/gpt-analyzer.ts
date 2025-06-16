
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

  CRITICAL INSTRUCTIONS:
  1. You MUST base your analysis ONLY on the actual HTML content provided above
  2. Count and reference specific HTML elements you find (e.g., "Found 3 images without alt text", "Navigation has 7 links")
  3. Identify actual CSS classes, IDs, and element structures present in the HTML
  4. Look for real accessibility issues in the markup (missing alt attributes, improper heading hierarchy, missing form labels)
  5. Analyze the actual content structure, not generic assumptions
  6. Your suggestions must reference specific elements or patterns found in the HTML

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
        "x": number (realistic screen position based on typical layout),
        "y": number (realistic screen position based on content structure),
        "note": "Specific improvement for actual element found in HTML",
        "type": "improvement|issue|suggestion",
        "element": "ACTUAL HTML element or class name found in the code"
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

  EXAMPLES of what I expect:
  - Instead of "Improve navigation", say "Replace the div.menu with semantic <nav> element and add ARIA labels to the 5 navigation links found"
  - Instead of "Add alt text", say "Add alt text to the 3 <img> elements in the hero section (lines 23, 34, 41)"
  - Instead of "Improve performance", say "Move the 250 lines of inline CSS to external stylesheet and add async loading to the 4 JavaScript files"

  REMEMBER: Your analysis must be based on the ACTUAL HTML content provided, not generic web development advice!
  `;

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
            content: 'You are a senior UX/UI analyst who provides detailed, specific analysis based on actual HTML content. You never give generic advice - every suggestion must reference real elements found in the provided HTML code. Be forensic in your analysis.' 
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
