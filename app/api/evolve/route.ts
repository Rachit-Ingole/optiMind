import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { idea, goal } = await request.json();

    if (!idea || !goal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `You are an expert innovation consultant. Analyze this idea and generate 3 evolved variants optimized for different goals.

Original Idea: ${idea}

Primary Goal: ${goal}

Generate 3 variants:
1. Impact-Optimized: Maximum reach and effectiveness
2. Cost-Optimized: Budget-friendly and resource-efficient  
3. Balanced: Equal weight to impact, cost, and feasibility

For each variant, provide:
- title (concise, 5-7 words)
- summary (one sentence)
- description (2-3 sentences explaining the approach)
- strengths (3-4 bullet points)
- tradeoffs (2-3 bullet points)
- scores (0-100 for impact, cost efficiency, and feasibility)

Return ONLY valid JSON in this exact format:
{
  "variants": [
    {
      "title": "string",
      "summary": "string",
      "description": "string",
      "strengths": ["string", "string", "string"],
      "tradeoffs": ["string", "string"],
      "scores": {
        "impact": number,
        "cost": number,
        "feasibility": number
      }
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON in response');
    }

    const data = JSON.parse(jsonMatch[0]);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Evolution error:', error);
    
    // Fallback mock response
    return NextResponse.json({
      variants: [
        {
          title: 'High-Impact Community Platform',
          summary: 'Viral growth through gamification and social sharing',
          description:
            'Build a feature-rich platform with social networking capabilities, achievement systems, and viral sharing mechanisms to maximize user acquisition and engagement.',
          strengths: [
            'Exponential user growth potential through network effects',
            'High engagement rates with gamification elements',
            'Strong brand visibility and market presence',
            'Multiple monetization opportunities',
          ],
          tradeoffs: [
            'Higher initial development costs ($150K-200K)',
            'Longer time to market (6-9 months)',
            'Requires larger team and ongoing maintenance',
          ],
          scores: { impact: 92, cost: 45, feasibility: 68 },
        },
        {
          title: 'Lean MVP Launch Strategy',
          summary: 'Minimal viable product with core features only',
          description:
            'Start with essential functionality using no-code tools and existing platforms. Focus on validating the core value proposition with minimal investment.',
          strengths: [
            'Launch in 4-6 weeks with $10K-20K budget',
            'Quick market validation and user feedback',
            'Low financial risk and easy pivoting',
            'Can bootstrap or self-fund initially',
          ],
          tradeoffs: [
            'Limited feature set may reduce initial appeal',
            'Scalability challenges as user base grows',
            'May need to rebuild for long-term growth',
          ],
          scores: { impact: 58, cost: 88, feasibility: 92 },
        },
        {
          title: 'Balanced Growth Platform',
          summary: 'Phased rollout balancing quality and efficiency',
          description:
            'Develop core features with modern tech stack, launch regionally, then expand. Combines solid architecture with controlled costs through iterative releases.',
          strengths: [
            'Sustainable development pace and budget',
            'Quality codebase ready for scaling',
            'Manageable team size (3-5 developers)',
            'Good user experience without bloat',
          ],
          tradeoffs: [
            'Moderate time to market (3-4 months)',
            'May miss some early adopter opportunities',
            'Regional launch limits initial reach',
          ],
          scores: { impact: 75, cost: 72, feasibility: 82 },
        },
      ],
    });
  }
}
