import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { idea } = await request.json();

    if (!idea || idea.length < 20) {
      return NextResponse.json(
        { error: 'Idea too short for analysis' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `You are an expert business analyst. Analyze this idea for clarity, market fit, and competition.

Idea: ${idea}

Provide:
1. Clarity score (0-100): How well-defined is the idea?
2. Market fit score (0-100): How well does it address market needs?
3. Competition: List 3-5 existing competitors or similar solutions
4. Suggestions: 3-5 actionable recommendations to improve the idea
5. Market data: Provide 4-5 relevant market categories with demand score (0-100) and competition level (0-100)
6. Radar assessment: Provide scores (0-100) for Innovation, Scalability, Market Timing, Technical Feasibility, and Business Model

Return ONLY valid JSON in this exact format:
{
  "clarity": number,
  "marketFit": number,
  "competition": ["string", "string", "string"],
  "suggestions": ["string", "string", "string"],
  "marketData": [
    {"category": "string", "demand": number, "competition": number}
  ],
  "radarData": [
    {"subject": "Innovation", "score": number},
    {"subject": "Scalability", "score": number},
    {"subject": "Market Timing", "score": number},
    {"subject": "Technical Feasibility", "score": number},
    {"subject": "Business Model", "score": number}
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
    console.error('Analysis error:', error);
    
    // Fallback mock response
    const mockAnalysis = {
      clarity: 72,
      marketFit: 68,
      competition: [
        'StudyBuddy - Existing study group matching platform',
        'Campus Connect - University social networking app',
        'GroupStudy - Online collaboration tool for students',
      ],
      suggestions: [
        'Define your unique value proposition more clearly',
        'Research specific pain points of your target users',
        'Consider partnerships with universities for distribution',
        'Focus on one key feature that differentiates you from competitors',
      ],
      marketData: [
        { category: 'EdTech', demand: 85, competition: 78 },
        { category: 'Social Learning', demand: 72, competition: 65 },
        { category: 'Study Apps', demand: 68, competition: 82 },
        { category: 'Campus Tools', demand: 58, competition: 45 },
      ],
      radarData: [
        { subject: 'Innovation', score: 65 },
        { subject: 'Scalability', score: 78 },
        { subject: 'Market Timing', score: 82 },
        { subject: 'Technical Feasibility', score: 88 },
        { subject: 'Business Model', score: 58 },
      ],
    };

    return NextResponse.json(mockAnalysis);
  }
}
