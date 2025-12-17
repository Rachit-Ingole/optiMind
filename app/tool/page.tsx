'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Sparkles, Loader2, Zap, TrendingUp, DollarSign, Target } from 'lucide-react';
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
import RoastMode from '@/components/RoastMode';
import ResearchPanel from '@/components/ResearchPanel';

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
  
  // New state for tab navigation
  const [activeTab, setActiveTab] = useState<'evolution' | 'roast' | 'research'>('evolution');

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
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Analysis Mode</h3>
                
                {/* Tab Navigation */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setActiveTab('evolution')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      activeTab === 'evolution'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Evolution
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('roast')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      activeTab === 'roast'
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" />
                      Roast
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('research')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      activeTab === 'research'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Target className="w-4 h-4" />
                      Research
                    </span>
                  </button>
                </div>
                
                {/* Evolution Mode Options */}
                {activeTab === 'evolution' && (
                  <div className="space-y-3 animate-fadeIn">
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
                )}
                
                {/* Roast Mode Description */}
                {activeTab === 'roast' && (
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg animate-fadeIn">
                    <p className="text-slate-700 font-medium">🔥 Brutal Honesty Mode</p>
                    <p className="text-sm text-slate-600 mt-1">
                      Get unfiltered, savage feedback on your idea. No sugar-coating, just reality.
                    </p>
                  </div>
                )}
                
                {/* Research Mode Description */}
                {activeTab === 'research' && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg animate-fadeIn">
                    <p className="text-slate-700 font-medium">🎓 Academic Research Mode</p>
                    <p className="text-sm text-slate-600 mt-1">
                      Discover relevant research papers, methodologies, and academic resources.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {activeTab === 'evolution' && (
                  <button
                    onClick={handleEvolve}
                    disabled={!idea.trim() || loading}
                    className="w-full py-4 px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
                )}
              </div>
            </div>

            {/* Real-time Analysis - Show for Evolution Mode */}
            {activeTab === 'evolution' && (
              <AnalysisPanel analysis={analysis} loading={analyzing} />
            )}
            
            {/* Roast Results - Show for Roast Mode */}
            {activeTab === 'roast' && idea && idea.length > 20 && (
              <RoastMode idea={idea} />
            )}
            
            {/* Research Results - Show for Research Mode */}
            {activeTab === 'research' && idea && idea.length > 20 && (
              <ResearchPanel idea={idea} />
            )}
            
            {/* AI Debate Panel - Show for Evolution Mode */}
            {activeTab === 'evolution' && idea && idea.length > 50 && (
              <AIDebatePanel idea={idea} />
            )}
            
            {/* Idea Mixer - Show for Evolution Mode */}
            {activeTab === 'evolution' && idea && (
              <IdeaMixer 
                currentIdea={idea}
                onMixedIdea={(mixedIdea) => setIdea(mixedIdea)}
              />
            )}
          </div>

          {/* Right Panel - Results */}
          <div>
            {/* Evolution Mode Results */}
            {activeTab === 'evolution' && (
              <>
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
              </>
            )}
            
            {/* Roast Mode Results */}
            {activeTab === 'roast' && (
              <>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg shadow-md p-6 border-2 border-orange-200 mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-orange-600" />
                    Brutal Reality Check
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Unfiltered, savage feedback on your idea. Truth hurts, but it helps.
                  </p>
                </div>

                {!idea || idea.length < 20 ? (
                  <div className="bg-white rounded-lg shadow-md p-12 border border-gray-200 text-center">
                    <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-400">Enter your idea (at least 20 characters) to get roasted</p>
                  </div>
                ) : (
                  <div className="animate-fadeIn">
                    <RoastMode idea={idea} />
                  </div>
                )}
              </>
            )}
            
            {/* Research Mode Results */}
            {activeTab === 'research' && (
              <>
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-md p-6 border-2 border-purple-200 mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <Target className="w-6 h-6 text-purple-600" />
                    Academic Research
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Relevant papers, methodologies, and academic resources for your idea
                  </p>
                </div>

                {!idea || idea.length < 20 ? (
                  <div className="bg-white rounded-lg shadow-md p-12 border border-gray-200 text-center">
                    <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-400">Enter your idea (at least 20 characters) to find research</p>
                  </div>
                ) : (
                  <div className="animate-fadeIn">
                    <ResearchPanel idea={idea} />
                  </div>
                )}
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
