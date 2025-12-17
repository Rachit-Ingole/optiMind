import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { idea } = await request.json();

    if (!idea) {
      return NextResponse.json(
        { error: 'Idea is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `You are a brutally honest idea critic. Roast this idea mercilessly but constructively. Be harsh but provide real insights.

Idea: "${idea}"

Provide your roast in this JSON format:
{
  "overallRating": "number 1-10",
  "savageRoast": "A brutally honest, no-holds-barred critique (2-3 sentences)",
  "majorFlaws": ["list of critical problems"],
  "marketReality": "harsh truth about market viability",
  "whoWillActuallyUse": "realistic assessment of actual users",
  "whyItWillFail": "main reasons for failure",
  "redeeming qualities": ["IF there are any good points"],
  "adviceIfYouInsist": "If they still want to pursue it, what to do",
  "similarFailures": ["examples of similar ideas that failed"],
  "verdict": "one brutal sentence summary"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON from markdown code blocks if present
    let jsonText = text;
    if (text.includes('```json')) {
      jsonText = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
      jsonText = text.split('```')[1].split('```')[0].trim();
    }

    const roastData = JSON.parse(jsonText);

    return NextResponse.json(roastData);
  } catch (error) {
    console.error('Roast error:', error);
    
    // Fallback roast
    return NextResponse.json({
      overallRating: 3,
      savageRoast: "This idea has been done before, and honestly, yours doesn't bring anything new to the table. It's like reinventing the wheel, but making it square.",
      majorFlaws: [
        "Lacks differentiation from existing solutions",
        "Unclear value proposition",
        "Market is already saturated",
        "Execution challenges not addressed"
      ],
      marketReality: "The market is crowded and dominated by established players with deep pockets.",
      whoWillActuallyUse: "Probably just your friends being polite, and they'll stop after a week.",
      whyItWillFail: "Competition is fierce, customer acquisition costs are high, and there's no compelling reason for users to switch.",
      redeemingQualities: ["Shows initiative", "Identifies a problem"],
      adviceIfYouInsist: "Find a specific niche, talk to 100 potential customers, and prove there's actual demand before building anything.",
      similarFailures: ["Countless startups in this space that burned through funding"],
      verdict: "Another 'me too' idea in an oversaturated market."
    });
  }
}
