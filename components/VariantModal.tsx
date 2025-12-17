'use client';

import { X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

interface VariantData {
  title: string;
  summary: string;
  description: string;
  strengths: string[];
  tradeoffs: string[];
  scores: {
    impact: number;
    cost: number;
    feasibility: number;
  };
}

interface VariantModalProps {
  variant: VariantData | null;
  onClose: () => void;
}

export default function VariantModal({ variant, onClose }: VariantModalProps) {
  useEffect(() => {
    if (variant) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [variant]);

  if (!variant) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{variant.title}</h2>
            <p className="text-sm text-indigo-600 font-medium mt-1">{variant.summary}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Description</h3>
            <p className="text-slate-600 leading-relaxed">{variant.description}</p>
          </div>

          {/* Strengths */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Strengths
            </h3>
            <ul className="space-y-2">
              {variant.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2" />
                  <span className="text-slate-600 flex-1">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trade-offs */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Trade-offs
            </h3>
            <ul className="space-y-2">
              {variant.tradeoffs.map((tradeoff, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2" />
                  <span className="text-slate-600 flex-1">{tradeoff}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Scores Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Metrics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{variant.scores.impact}</div>
                <div className="text-xs text-slate-600 mt-1">Impact</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{variant.scores.cost}</div>
                <div className="text-xs text-slate-600 mt-1">Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{variant.scores.feasibility}</div>
                <div className="text-xs text-slate-600 mt-1">Feasibility</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
