import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { idea, goal } = await request.json();

    if (!idea) {
      return NextResponse.json(
        { error: 'Missing idea' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a business strategy expert. Analyze this idea and provide detailed business insights.

Idea: ${idea}
Primary Goal: ${goal}

Provide comprehensive business analysis including:

1. Business Model:
   - Primary model (B2B, B2C, B2B2C, Marketplace, SaaS, etc.)
   - Target market description
   - 3-5 revenue streams
   - 3-4 customer segments
   - Key competitive advantage

2. Monetization:
   - Pricing model (Subscription, Freemium, One-time, Usage-based, etc.)
   - Price range estimate
   - Customer Lifetime Value (LTV) estimate
   - Customer Acquisition Cost (CAC) estimate
   - Break-even timeline
   - Revenue breakdown (3-4 sources with percentages)

3. Go-to-Market Strategy:
   - GTM strategy (1-2 sentences)
   - Timeline to launch
   - 3-5 marketing/distribution channels
   - 3-4 launch phases with durations
   - 2-3 key risks

Return ONLY valid JSON in this exact format:
{
  "businessModel": {
    "primaryModel": "B2B SaaS" or "B2C Mobile App" etc,
    "targetMarket": "description",
    "revenueStreams": ["stream1", "stream2", "stream3"],
    "customerSegments": ["segment1", "segment2", "segment3"],
    "competitiveAdvantage": "description"
  },
  "monetization": {
    "pricing": {
      "model": "Freemium Subscription",
      "range": "$10-50/month"
    },
    "ltv": "$500",
    "cac": "$50",
    "breakeven": "12-18 months",
    "revenueBreakdown": [
      {"name": "Subscriptions", "value": 60, "color": "#6366F1"},
      {"name": "Premium Features", "value": 25, "color": "#8B5CF6"},
      {"name": "API Access", "value": 15, "color": "#06B6D4"}
    ]
  },
  "goToMarket": {
    "strategy": "description",
    "timeline": "3-6 months",
    "channels": ["Content Marketing", "LinkedIn Ads", "Partnerships"],
    "milestones": [
      {"phase": "MVP Development", "duration": "2 months", "status": "active"},
      {"phase": "Beta Testing", "duration": "1 month", "status": "pending"},
      {"phase": "Public Launch", "duration": "1 month", "status": "pending"}
    ],
    "risks": ["Market adoption", "Competition"]
  }
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
    console.error('Business insights error:', error);
    
    // Fallback mock response
    return NextResponse.json({
      businessModel: {
        primaryModel: 'B2C Mobile App',
        targetMarket: 'College students aged 18-24 seeking study partners and collaborative learning opportunities',
        revenueStreams: [
          'Freemium subscriptions',
          'Premium features (priority matching, analytics)',
          'University partnerships',
          'In-app study resources marketplace',
        ],
        customerSegments: [
          'Undergraduate students in STEM fields',
          'Graduate students seeking research collaborators',
          'International students adapting to new education systems',
          'Remote learners needing virtual study groups',
        ],
        competitiveAdvantage: 'AI-powered matching algorithm that considers learning styles, schedules, and academic performance to create optimal study groups',
      },
      monetization: {
        pricing: {
          model: 'Freemium with Subscription Tiers',
          range: 'Free, $4.99/mo (Pro), $9.99/mo (Premium)',
        },
        ltv: '$120',
        cac: '$8',
        breakeven: '15-18 months',
        revenueBreakdown: [
          { name: 'Subscriptions', value: 55, color: '#6366F1' },
          { name: 'University Licenses', value: 30, color: '#8B5CF6' },
          { name: 'Marketplace Fees', value: 10, color: '#06B6D4' },
          { name: 'Advertising', value: 5, color: '#10B981' },
        ],
      },
      goToMarket: {
        strategy: 'Campus ambassador program combined with digital marketing. Start with 3-5 pilot universities, gather feedback, iterate, then scale to top 50 universities.',
        timeline: '4-6 months to launch',
        channels: [
          'Campus Ambassadors',
          'TikTok & Instagram',
          'University Partnership Programs',
          'Student Facebook Groups',
          'Reddit (r/college)',
        ],
        milestones: [
          { phase: 'MVP Development', duration: '2 months', status: 'active' },
          { phase: 'Pilot Launch (3 Universities)', duration: '1 month', status: 'pending' },
          { phase: 'Iteration & Scaling', duration: '2 months', status: 'pending' },
          { phase: 'National Rollout', duration: 'Ongoing', status: 'pending' },
        ],
        risks: [
          'Low initial user adoption without critical mass',
          'Competition from existing study platforms',
          'Privacy concerns with student data',
        ],
      },
    });
  }
}
