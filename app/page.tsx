import Link from 'next/link';
import { Sparkles, Zap, Target, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold text-slate-800">OptiMind</span>
          </div>
          <Link
            href="/tool"
            className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Powered by Google Gemini AI
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              OptiMind
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-slate-600 font-medium mb-4">
            AI Idea Evolution Engine
          </p>
          
          <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas with AI-powered analysis and optimization. Get instant clarity, 
            competitive insights, and three evolved variants optimized for impact, cost, and balance.
          </p>

          {/* CTA Button */}
          <Link
            href="/tool"
            className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transform hover:scale-105 transition-all duration-150 shadow-lg hover:shadow-xl"
          >
            Start Evolving
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Real-time Analysis</h3>
              <p className="text-slate-600 leading-relaxed">
                Get instant feedback on idea clarity, market fit, and competition as you type.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Smart Evolution</h3>
              <p className="text-slate-600 leading-relaxed">
                AI generates three optimized variants: impact-focused, cost-efficient, and balanced.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Visual Insights</h3>
              <p className="text-slate-600 leading-relaxed">
                Interactive charts and metrics help you understand trade-offs and make decisions.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-32 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-600 text-sm">
          Built with Next.js, TailwindCSS & Google Gemini AI
        </div>
      </footer>
    </div>
  );
}
