
import { AnalysisResult } from './types.ts';

export async function analyzeWithGPT(
  htmlContent: string,
  title: string,
  url: string,
  category: string,
  openAIApiKey: string | null
): Promise<Partial<AnalysisResult> | null> {
  if (!openAIApiKey) {
    return null;
  }

  const analysisPrompt = `
  Analyze this website HTML and provide a comprehensive UX/UI analysis based on REAL content and structure:
  
  Website Title: ${title}
  URL: ${url}
  Category: ${category}
  
  HTML Content (first 8000 chars): ${htmlContent.substring(0, 8000)}
  
  Please analyze the ACTUAL content and provide specific, actionable feedback in this JSON format:
  {
    "designScore": number (0-100),
    "categoryScores": {
      "ux": number (0-100),
      "accessibility": number (0-100), 
      "performance": number (0-100),
      "code": number (0-100)
    },
    "issues": [
      {
        "type": "ux|accessibility|performance|code",
        "severity": "high|medium|low",
        "description": "specific issue found in the actual HTML/content",
        "location": "specific element, class, or section identified"
      }
    ],
    "suggestions": [
      "specific, actionable improvements based on the actual website content and structure"
    ],
    "annotations": [
      {
        "x": number,
        "y": number,
        "note": "specific improvement suggestion for this location",
        "type": "improvement|issue|suggestion",
        "element": "actual HTML element or component found"
      }
    ],
    "codeSuggestions": [
      {
        "file": "actual file name or type found/inferred",
        "issue": "specific code issue identified",
        "type": "performance|accessibility|maintainability|security",
        "before": "actual problematic code pattern found or inferred",
        "after": "improved code suggestion",
        "explanation": "why this change improves the website"
      }
    ]
  }
  
  IMPORTANT:
  - Base ALL analysis on the actual HTML content provided
  - Identify real accessibility issues (missing alt text, poor contrast, missing labels)
  - Find actual performance issues (large images, blocking scripts, excessive DOM nodes)
  - Suggest specific UX improvements based on the actual layout and content
  - Provide realistic scores based on what you actually observe
  - Give concrete, actionable suggestions, not generic advice
  `;

  try {
    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a UX/UI expert who analyzes websites based on their actual HTML content. Provide specific, actionable feedback based on real observations, not generic advice.' 
          },
          { role: 'user', content: analysisPrompt }
        ],
        max_tokens: 3000,
        temperature: 0.2
      }),
    });

    if (gptResponse.ok) {
      const gptData = await gptResponse.json();
      const content = gptData.choices[0].message.content;
      
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (error) {
    console.error('GPT analysis failed:', error);
  }

  return null;
}
