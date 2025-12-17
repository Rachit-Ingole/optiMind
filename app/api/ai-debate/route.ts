import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { idea } = await request.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `You are facilitating a debate between two AI agents about this idea:

"${idea}"

Agent 1 (Optimist): Argues FOR the idea, highlighting opportunities and potential
Agent 2 (Skeptic): Argues AGAINST the idea, highlighting risks and challenges

Generate a 6-message debate (3 messages per agent, alternating). Each message should be 2-3 sentences.

Return ONLY valid JSON:
{
  "messages": [
    {"role": "user", "content": "Optimist's first argument"},
    {"role": "assistant", "content": "Skeptic's counter-argument"},
    {"role": "user", "content": "Optimist's response"},
    {"role": "assistant", "content": "Skeptic's response"},
    {"role": "user", "content": "Optimist's final point"},
    {"role": "assistant", "content": "Skeptic's final point"}
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return NextResponse.json(JSON.parse(jsonMatch[0]));
    }

    throw new Error('No valid JSON');
  } catch (error) {
    console.error('Debate error:', error);
    
    return NextResponse.json({
      messages: [
        {
          role: 'user',
          content: 'This idea taps into a real pain point for students. The market is huge with millions of college students globally struggling to find compatible study partners. AI-powered matching could be a game-changer!'
        },
        {
          role: 'assistant',
          content: 'But consider the chicken-and-egg problem: you need critical mass for effective matching. Most campus-focused apps fail because they can\'t reach enough users quickly. Without scale, the matching quality suffers, users churn, and you\'re left with nothing.'
        },
        {
          role: 'user',
          content: 'Fair point, but that\'s exactly why the AI matching is crucial. Even with smaller groups, intelligent algorithms can create better matches than random connections. Plus, partnering with universities for initial rollout solves the critical mass problem faster than traditional consumer apps.'
        },
        {
          role: 'assistant',
          content: 'University partnerships sound good in theory, but they\'re notoriously slow to negotiate and implement. Educational institutions are risk-averse and have lengthy approval processes. Meanwhile, you\'re burning cash on development with no revenue stream. How do you sustain until you get traction?'
        },
        {
          role: 'user',
          content: 'Start with a freemium model targeting individual students first while pursuing partnerships in parallel. The product can generate revenue from premium features immediately. Use early adopters as social proof when approaching universities. It\'s a dual-track strategy that mitigates the timeline risk.'
        },
        {
          role: 'assistant',
          content: 'The freemium model has low conversion rates in education - students are notoriously price-sensitive. You\'ll spend heavily on user acquisition but convert maybe 2-5%. With competition from free alternatives like Discord or WhatsApp groups, convincing students to pay for yet another app is an uphill battle.'
        }
      ]
    });
  }
}
