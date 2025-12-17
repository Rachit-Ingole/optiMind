'use client';

import { useState } from 'react';
import { Flame, Loader2, AlertTriangle, Skull, XCircle } from 'lucide-react';

interface RoastData {
  overallRating: number;
  savageRoast: string;
  majorFlaws: string[];
  marketReality: string;
  whoWillActuallyUse: string;
  whyItWillFail: string;
  redeemingQualities: string[];
  adviceIfYouInsist: string;
  similarFailures: string[];
  verdict: string;
}

interface Props {
  idea: string;
}

export default function RoastMode({ idea }: Props) {
  const [roastData, setRoastData] = useState<RoastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRoast, setShowRoast] = useState(false);

  const handleRoast = async () => {
    if (!idea || idea.length < 20) return;

    setLoading(true);
    setShowRoast(true);

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });

      if (response.ok) {
        const data = await response.json();
        setRoastData(data);
      }
    } catch (error) {
      console.error('Roast error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating <= 3) return 'text-red-600';
    if (rating <= 6) return 'text-orange-600';
    return 'text-yellow-600';
  };

  const getRatingBg = (rating: number) => {
    if (rating <= 3) return 'bg-red-100 border-red-300';
    if (rating <= 6) return 'bg-orange-100 border-orange-300';
    return 'bg-yellow-100 border-yellow-300';
  };

  if (!showRoast) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-lg p-6 border-2 border-red-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-red-900 mb-2 flex items-center gap-2">
              🔥 Roast Mode
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">BRUTAL</span>
            </h3>
            <p className="text-red-700 mb-4">
              Get a brutally honest, no-holds-barred critique of your idea. Warning: This will hurt, but it's what you need to hear.
            </p>
            <button
              onClick={handleRoast}
              disabled={!idea || idea.length < 20}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg"
            >
              <Flame className="w-5 h-5" />
              Roast My Idea
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-lg p-6 border-2 border-red-200 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-red-900">Roast Mode</h3>
            <p className="text-sm text-red-600">Brutal honesty activated</p>
          </div>
        </div>
        <button
          onClick={() => setShowRoast(false)}
          className="text-red-600 hover:text-red-800 p-2"
        >
          <XCircle className="w-6 h-6" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-red-600 mb-4" />
          <p className="text-red-700 font-medium">Preparing brutal honesty...</p>
        </div>
      ) : roastData ? (
        <div className="space-y-4">
          {/* Overall Rating */}
          <div className={`p-6 rounded-lg border-2 ${getRatingBg(roastData.overallRating)}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-gray-900">Overall Rating</h4>
              <div className={`text-4xl font-bold ${getRatingColor(roastData.overallRating)}`}>
                {roastData.overallRating}/10
              </div>
            </div>
            <div className="w-full bg-white rounded-full h-4">
              <div
                className="bg-gradient-to-r from-red-500 to-orange-500 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${roastData.overallRating * 10}%` }}
              />
            </div>
          </div>

          {/* Savage Roast */}
          <div className="bg-white rounded-lg p-6 border-2 border-red-300 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Skull className="w-5 h-5 text-red-600" />
              <h4 className="text-lg font-bold text-red-900">The Truth Hurts</h4>
            </div>
            <p className="text-gray-800 text-lg italic leading-relaxed">
              "{roastData.savageRoast}"
            </p>
          </div>

          {/* Major Flaws */}
          <div className="bg-white rounded-lg p-6 border-2 border-red-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h4 className="text-lg font-bold text-gray-900">Major Flaws</h4>
            </div>
            <ul className="space-y-2">
              {roastData.majorFlaws.map((flaw, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-red-500 font-bold mt-1">✗</span>
                  <span className="text-gray-700">{flaw}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Market Reality */}
          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <h4 className="text-lg font-bold text-red-900 mb-2">Market Reality Check</h4>
            <p className="text-gray-800">{roastData.marketReality}</p>
          </div>

          {/* Who Will Actually Use */}
          <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
            <h4 className="text-lg font-bold text-orange-900 mb-2">Who Will Actually Use This?</h4>
            <p className="text-gray-800">{roastData.whoWillActuallyUse}</p>
          </div>

          {/* Why It Will Fail */}
          <div className="bg-red-100 rounded-lg p-6 border border-red-300">
            <h4 className="text-lg font-bold text-red-900 mb-2">Why This Will Fail</h4>
            <p className="text-gray-800">{roastData.whyItWillFail}</p>
          </div>

          {/* Redeeming Qualities */}
          {roastData.redeemingQualities.length > 0 && (
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h4 className="text-lg font-bold text-green-900 mb-3">Redeeming Qualities (If Any)</h4>
              <ul className="space-y-2">
                {roastData.redeemingQualities.map((quality, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold mt-1">✓</span>
                    <span className="text-gray-700">{quality}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Advice */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h4 className="text-lg font-bold text-blue-900 mb-2">If You Still Insist...</h4>
            <p className="text-gray-800">{roastData.adviceIfYouInsist}</p>
          </div>

          {/* Similar Failures */}
          {roastData.similarFailures.length > 0 && (
            <div className="bg-gray-100 rounded-lg p-6 border border-gray-300">
              <h4 className="text-lg font-bold text-gray-900 mb-3">Similar Ideas That Failed</h4>
              <ul className="space-y-2">
                {roastData.similarFailures.map((failure, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-gray-500">💀</span>
                    <span className="text-gray-700">{failure}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Final Verdict */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-6 text-white shadow-lg">
            <h4 className="text-lg font-bold mb-2">Final Verdict</h4>
            <p className="text-lg font-medium italic">"{roastData.verdict}"</p>
          </div>

          {/* Retry Button */}
          <button
            onClick={() => {
              setShowRoast(false);
              setRoastData(null);
            }}
            className="w-full py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Close Roast Mode
          </button>
        </div>
      ) : null}
    </div>
  );
}
