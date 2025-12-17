'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import IdeaCard from '@/components/IdeaCard';
import VariantModal from '@/components/VariantModal';
import AnalysisPanel from '@/components/AnalysisPanel';
import BusinessModelPanel from '@/components/BusinessModelPanel';
import MonetizationPanel from '@/components/MonetizationPanel';
import GoToMarketPanel from '@/components/GoToMarketPanel';
import AIDebatePanel from '@/components/AIDebatePanel';
import IdeaMixer from '@/components/IdeaMixer';
import IdeaLibrary from '@/components/IdeaLibrary';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Variant {
  title: string;
  summary: string;
  description: string;
  scores: {
    impact: number;
    cost: number;
    feasibility: number;
  };
  strengths: string[];
  tradeoffs: string[];
}

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

interface BusinessInsights {
  businessModel: {
    primaryModel: string;
    targetMarket: string;
    revenueStreams: string[];
    customerSegments: string[];
    competitiveAdvantage: string;
  };
  monetization: {
    pricing: {
      model: string;
      range: string;
    };
    ltv: string;
    cac: string;
    breakeven: string;
    revenueBreakdown?: {
      name: string;
      value: number;
      color: string;
    }[];
  };
  goToMarket: {
    strategy: string;
    timeline: string;
    channels: string[];
    milestones: {
      phase: string;
      duration: string;
      status: 'pending' | 'active' | 'completed';
    }[];
    risks: string[];
  };
}

export default function ToolPage() {
  const [idea, setIdea] = useState('');
  const [goal, setGoal] = useState('balanced');
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [businessInsights, setBusinessInsights] = useState<BusinessInsights | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  // Real-time analysis as user types
  const analyzeIdea = useCallback(async (text: string) => {
    if (text.length < 20) {
      setAnalysis(null);
      return;
    }

    setAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: text }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setAnalyzing(false);
    }
  }, []);

  // Debounce the analysis
  useEffect(() => {
    const timer = setTimeout(() => {
      analyzeIdea(idea);
    }, 1000);

    return () => clearTimeout(timer);
  }, [idea, analyzeIdea]);

  const handleEvolve = async () => {
    if (!idea.trim()) return;

    setLoading(true);
    setVariants([]);
    setInsightsLoading(true);

    try {
      const [evolveResponse, insightsResponse] = await Promise.all([
        fetch('/api/evolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idea, goal }),
        }),
        fetch('/api/business-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idea, goal }),
        }),
      ]);

      if (evolveResponse.ok) {
        const data = await evolveResponse.json();
        setVariants(data.variants);
      } else {
        console.error('Failed to evolve idea');
      }

      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json();
        setBusinessInsights(insightsData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setInsightsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold text-slate-800">OptiMind</span>
          </div>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Idea</h2>
              <p className="text-slate-600 text-sm mb-4">
                Describe your idea in detail. The more context you provide, the better the analysis.
              </p>

              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Example: A mobile app that helps college students find study groups based on their courses and learning styles..."
                className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-slate-700 placeholder-gray-400"
              />

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Optimization Goal</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50">
                    <input
                      type="radio"
                      name="goal"
                      value="impact"
                      checked={goal === 'impact'}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-5 h-5 text-indigo-600"
                    />
                    <div>
                      <div className="font-medium text-slate-800">Maximize Impact</div>
                      <div className="text-sm text-slate-600">Focus on reach and effectiveness</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50">
                    <input
                      type="radio"
                      name="goal"
                      value="cost"
                      checked={goal === 'cost'}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-5 h-5 text-indigo-600"
                    />
                    <div>
                      <div className="font-medium text-slate-800">Minimize Cost</div>
                      <div className="text-sm text-slate-600">Optimize for budget efficiency</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50">
                    <input
                      type="radio"
                      name="goal"
                      value="balanced"
                      checked={goal === 'balanced'}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-5 h-5 text-indigo-600"
                    />
                    <div>
                      <div className="font-medium text-slate-800">Balanced</div>
                      <div className="text-sm text-slate-600">Equal weight to all factors</div>
                    </div>
                  </label>
                </div>
              </div>

              <button
                onClick={handleEvolve}
                disabled={!idea.trim() || loading}
                className="w-full mt-6 py-4 px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Evolving Your Idea...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Evolve Idea
                  </>
                )}
              </button>
            </div>

            {/* Real-time Analysis */}
            <AnalysisPanel analysis={analysis} loading={analyzing} />
            
            {/* AI Debate Panel */}
            {idea && idea.length > 50 && (
              <AIDebatePanel idea={idea} />
            )}
            
            {/* Idea Mixer */}
            {idea && (
              <IdeaMixer 
                currentIdea={idea}
                onMixedIdea={(mixedIdea) => setIdea(mixedIdea)}
              />
            )}
          </div>

          {/* Right Panel - Results */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Evolved Variants</h2>
              <p className="text-slate-600 text-sm">
                AI-generated alternatives optimized for different objectives
              </p>
            </div>

            {loading && <LoadingSpinner />}

            {!loading && variants.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 border border-gray-200 text-center mb-6">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400">Your evolved variants will appear here</p>
              </div>
            )}

            {!loading && variants.length > 0 && (
              <>
                <div className="space-y-4 animate-fadeIn mb-6">
                  {variants.map((variant, index) => (
                    <IdeaCard
                      key={index}
                      title={variant.title}
                      summary={variant.summary}
                      description={variant.description}
                      scores={variant.scores}
                      onClick={() => setSelectedVariant(variant)}
                    />
                  ))}
                </div>

                {/* Business Insights Section */}
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100">
                    <h3 className="text-lg font-bold text-indigo-900 mb-1">Business Insights</h3>
                    <p className="text-sm text-indigo-700">Detailed analysis for your idea</p>
                  </div>

                  <BusinessModelPanel 
                    data={businessInsights?.businessModel || null}
                    loading={insightsLoading}
                  />

                  <MonetizationPanel
                    data={businessInsights?.monetization || null}
                    loading={insightsLoading}
                  />

                  <GoToMarketPanel
                    data={businessInsights?.goToMarket || null}
                    loading={insightsLoading}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Idea Library */}
      <IdeaLibrary />

      {/* Modal */}
      <VariantModal
        variant={selectedVariant}
        onClose={() => setSelectedVariant(null)}
      />
    </div>
  );
}
