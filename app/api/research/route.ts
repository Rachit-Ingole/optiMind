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

    // First, check if the idea is research-oriented
    const classificationPrompt = `Analyze if this idea is research-oriented (academic, scientific, technical research).
Respond with JSON:
{
  "isResearch": boolean,
  "researchArea": "specific field if research-oriented",
  "keywords": ["relevant research keywords"]
}

Idea: "${idea}"`;

    const classificationResult = await model.generateContent(classificationPrompt);
    const classificationText = classificationResult.response.text();
    
    let jsonText = classificationText;
    if (classificationText.includes('```json')) {
      jsonText = classificationText.split('```json')[1].split('```')[0].trim();
    } else if (classificationText.includes('```')) {
      jsonText = classificationText.split('```')[1].split('```')[0].trim();
    }

    const classification = JSON.parse(jsonText);

    if (!classification.isResearch) {
      return NextResponse.json({
        isResearch: false,
        message: "This idea doesn't appear to be research-oriented."
      });
    }

    // Generate research paper suggestions
    const researchPrompt = `Based on this research idea, suggest relevant academic papers and research directions.

Idea: "${idea}"
Research Area: ${classification.researchArea}

Provide response in JSON format:
{
  "researchArea": "field of study",
  "suggestedPapers": [
    {
      "title": "paper title",
      "authors": "author names",
      "year": "year",
      "relevance": "why this paper is relevant",
      "keyFindings": "main findings",
      "url": "arxiv or doi link format"
    }
  ],
  "researchDirections": ["suggested research directions"],
  "methodologies": ["relevant research methodologies"],
  "keyResearchers": ["notable researchers in this field"],
  "relatedConferences": ["relevant academic conferences"],
  "fundingOpportunities": ["potential funding sources"]
}`;

    const researchResult = await model.generateContent(researchPrompt);
    const researchText = researchResult.response.text();
    
    let researchJsonText = researchText;
    if (researchText.includes('```json')) {
      researchJsonText = researchText.split('```json')[1].split('```')[0].trim();
    } else if (researchText.includes('```')) {
      researchJsonText = researchText.split('```')[1].split('```')[0].trim();
    }

    const researchData = JSON.parse(researchJsonText);

    return NextResponse.json({
      isResearch: true,
      ...researchData
    });
  } catch (error) {
    console.error('Research error:', error);
    
    return NextResponse.json({
      isResearch: false,
      error: 'Failed to fetch research data'
    });
  }
}
