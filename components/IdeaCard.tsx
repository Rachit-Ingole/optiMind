'use client';

import { TrendingUp, DollarSign, CheckCircle } from 'lucide-react';

interface Scores {
  impact: number;
  cost: number;
  feasibility: number;
}

interface IdeaCardProps {
  title: string;
  summary: string;
  description: string;
  scores: Scores;
  onClick: () => void;
}

export default function IdeaCard({
  title,
  summary,
  description,
  scores,
  onClick,
}: IdeaCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-150 cursor-pointer p-6 border border-gray-200 hover:border-indigo-300 transform hover:-translate-y-1"
    >
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-indigo-600 font-medium mb-3">{summary}</p>
      <p className="text-slate-600 text-sm mb-4 line-clamp-3">{description}</p>

      <div className="space-y-3 mb-4">
        {/* Impact Score */}
        <div className="flex items-center gap-3">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-medium text-slate-700 w-20">Impact</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${scores.impact}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-700 w-8 text-right">
            {scores.impact}
          </span>
        </div>

        {/* Cost Score */}
        <div className="flex items-center gap-3">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="text-xs font-medium text-slate-700 w-20">Cost</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${scores.cost}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-700 w-8 text-right">
            {scores.cost}
          </span>
        </div>

        {/* Feasibility Score */}
        <div className="flex items-center gap-3">
          <CheckCircle className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-medium text-slate-700 w-20">Feasibility</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${scores.feasibility}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-700 w-8 text-right">
            {scores.feasibility}
          </span>
        </div>
      </div>

      <button className="w-full py-2 px-4 bg-indigo-50 text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-100 transition-colors">
        View Details
      </button>
    </div>
  );
}
