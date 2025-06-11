
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
  Analyze this website HTML and provide a comprehensive UX/UI analysis:
  
  Website Title: ${title}
  URL: ${url}
  Category: ${category}
  
  HTML Content (first 8000 chars): ${htmlContent.substring(0, 8000)}
  
  Please provide analysis in this JSON format:
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
        "description": "detailed description",
        "location": "specific element or section"
      }
    ],
    "suggestions": [
      "user-friendly improvement suggestions without technical jargon"
    ],
    "annotations": [
      {
        "x": number,
        "y": number,
        "note": "simple improvement note",
        "type": "improvement|issue|suggestion",
        "element": "description of what element this refers to"
      }
    ]
  }
  
  Focus on real usability issues, accessibility problems, and design improvements that would benefit end users.
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
            content: 'You are a UX/UI expert analyzing websites. Provide practical, user-focused feedback in JSON format.' 
          },
          { role: 'user', content: analysisPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.3
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
