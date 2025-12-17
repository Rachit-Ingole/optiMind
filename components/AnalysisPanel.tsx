'use client';

import { Lightbulb, TrendingUp, Users, Target } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';

interface AnalysisData {
  clarity: number;
  marketFit: number;
  competition: string[];
  suggestions: string[];
  marketData?: {
    category: string;
    demand: number;
    competition: number;
  }[];
  radarData?: {
    subject: string;
    score: number;
  }[];
}

interface AnalysisPanelProps {
  analysis: AnalysisData | null;
  loading: boolean;
}

export default function AnalysisPanel({ analysis, loading }: AnalysisPanelProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Start typing to see real-time analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Clarity Score */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-800">Idea Clarity</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${analysis.clarity}%` }}
            />
          </div>
          <span className="text-2xl font-bold text-indigo-600">{analysis.clarity}%</span>
        </div>
      </div>

      {/* Market Analysis Chart */}
      {analysis.marketData && analysis.marketData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-800">Market Analysis</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analysis.marketData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="demand" fill="#6366F1" name="Demand" />
              <Bar dataKey="competition" fill="#93C5FD" name="Competition" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Radar Chart */}
      {analysis.radarData && analysis.radarData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-800">Idea Assessment</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={analysis.radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#6366F1"
                fill="#6366F1"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Competition Analysis */}
      {analysis.competition && analysis.competition.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-800">Competition</h3>
          </div>
          <ul className="space-y-2">
            {analysis.competition.map((competitor, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2" />
                <span className="text-slate-600 text-sm flex-1">{competitor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-slate-800">AI Suggestions</h3>
          </div>
          <ul className="space-y-2">
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                <span className="text-slate-600 text-sm flex-1">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
