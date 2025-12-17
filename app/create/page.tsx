'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Globe,
  Lock,
  Save,
  Zap,
  Target,
} from 'lucide-react';
import IdeaCard from '@/components/IdeaCard';
import VariantModal from '@/components/VariantModal';
import AnalysisPanel from '@/components/AnalysisPanel';
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
  marketData?: any[];
  radarData?: any[];
}

export default function CreatePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [repoName, setRepoName] = useState('');
  const [description, setDescription] = useState('');
  const [idea, setIdea] = useState('');
  const [goal, setGoal] = useState('balanced');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Tab navigation for different modes
  const [activeTab, setActiveTab] = useState<'evolution' | 'roast' | 'research'>('evolution');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/create');
    }
  }, [status, router]);

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

    try {
      const response = await fetch('/api/evolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, goal }),
      });

      if (response.ok) {
        const data = await response.json();
        setVariants(data.variants);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!repoName.trim() || !description.trim() || !idea.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: repoName,
          description,
          visibility,
          category,
          tags,
          content: {
            originalIdea: idea,
            goal,
            variants,
            analysis,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/repo/${data.repo._id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save repository');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save repository');
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold text-slate-800">Create Repository</span>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !repoName || !description || !idea}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Repository Details - Full Width */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Repository Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repository Name *
              </label>
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="my-awesome-idea"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
              >
                <option value="general">General</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="sustainability">Sustainability</option>
                <option value="social-impact">Social Impact</option>
                <option value="research">Research</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of your idea..."
              className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="public"
                    checked={visibility === 'public'}
                    onChange={(e) =>
                      setVisibility(e.target.value as 'public')
                    }
                    className="w-4 h-4 text-indigo-600"
                  />
                  <Globe className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Public</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="private"
                    checked={visibility === 'private'}
                    onChange={(e) =>
                      setVisibility(e.target.value as 'private')
                    }
                    className="w-4 h-4 text-indigo-600"
                  />
                  <Lock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">Private</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (max 5)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add a tag..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  disabled={tags.length >= 5}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim() || tags.length >= 5}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(idx)}
                        className="text-indigo-500 hover:text-indigo-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Two Column Layout for Idea and Results */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Idea Input */}
          <div className="space-y-6">
            {/* Idea Input */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Idea *</h2>
              <p className="text-slate-600 text-sm mb-4">
                Describe your idea in detail
              </p>

              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Example: A mobile app that helps college students find study groups..."
                className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-400"
                required
              />

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Analysis Mode
                </h3>
                
                {/* Tab Navigation */}
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
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
                    type="button"
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
                    type="button"
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
                    <p className="text-sm text-slate-600 mb-3">Optimization Goal:</p>
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
                      <div className="font-medium text-slate-800">
                        Maximize Impact
                      </div>
                      <div className="text-sm text-slate-600">
                        Focus on reach and effectiveness
                      </div>
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
                      <div className="font-medium text-slate-800">
                        Minimize Cost
                      </div>
                      <div className="text-sm text-slate-600">
                        Optimize for budget efficiency
                      </div>
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
                      <div className="text-sm text-slate-600">
                        Equal weight to all factors
                      </div>
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

              {activeTab === 'evolution' && (
                <button
                  type="button"
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
                    Generate Variants
                  </>
                )}
                </button>
              )}
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
          </div>

          {/* Right Panel - Results */}
          <div>
            {/* Evolution Mode Results */}
            {activeTab === 'evolution' && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Evolved Variants
                  </h2>
                  <p className="text-slate-600 text-sm">
                    AI-generated alternatives (optional)
                  </p>
                </div>

                {loading && <LoadingSpinner />}

                {!loading && variants.length === 0 && (
                  <div className="bg-white rounded-lg shadow-md p-12 border border-gray-200 text-center">
                    <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Click "Generate Variants" to see optimized versions
                    </p>
                  </div>
                )}

                {!loading && variants.length > 0 && (
                  <div className="space-y-4 animate-fadeIn">
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
                    Preview your idea's roast before saving
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
                    Preview research resources before saving
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

      {/* Modal */}
      <VariantModal
        variant={selectedVariant}
        onClose={() => setSelectedVariant(null)}
      />
    </div>
  );
}
