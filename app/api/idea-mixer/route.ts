import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { idea1, idea2 } = await request.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `You are an innovation expert. Combine these two ideas into a single hybrid concept:

Idea 1: ${idea1}

Idea 2: ${idea2}

Create a new innovative idea that:
1. Combines the best elements of both
2. Creates synergies between them
3. Addresses gaps in both original ideas
4. Is practical and actionable

Describe the mixed idea in 3-4 sentences, clearly explaining how the concepts merge.

Return ONLY valid JSON:
{
  "mixedIdea": "detailed description of the hybrid idea"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return NextResponse.json(JSON.parse(jsonMatch[0]));
    }

    throw new Error('No valid JSON');
  } catch (error) {
    console.error('Mixer error:', error);
    
    return NextResponse.json({
      mixedIdea: 'A gamified study platform that combines AI-powered peer matching with Netflix-style content recommendations. Students get matched with compatible study partners based on learning styles, but also receive personalized study resource recommendations (videos, articles, practice problems) based on their progress and goals. The platform uses engagement metrics to continuously improve both matching and content algorithms, creating a comprehensive learning ecosystem.'
    });
  }
}
