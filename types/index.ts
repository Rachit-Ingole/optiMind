export interface Scores {
  impact: number;
  cost: number;
  feasibility: number;
}

export interface Variant {
  title: string;
  summary: string;
  description: string;
  scores: Scores;
  strengths: string[];
  tradeoffs: string[];
}

export interface MarketDataPoint {
  category: string;
  demand: number;
  competition: number;
}

export interface RadarDataPoint {
  subject: string;
  score: number;
}

export interface AnalysisData {
  clarity: number;
  marketFit: number;
  competition: string[];
  suggestions: string[];
  marketData?: MarketDataPoint[];
  radarData?: RadarDataPoint[];
}

export interface EvolveRequest {
  idea: string;
  goal: 'impact' | 'cost' | 'balanced';
}

export interface EvolveResponse {
  variants: Variant[];
}

export interface AnalyzeRequest {
  idea: string;
}

export type AnalyzeResponse = AnalysisData;
