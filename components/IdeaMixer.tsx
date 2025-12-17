'use client';

import { useState } from 'react';
import { Shuffle, Sparkles, ArrowRight } from 'lucide-react';

interface IdeaMixerProps {
  currentIdea: string;
  onMixedIdea: (mixedIdea: string) => void;
}

export default function IdeaMixer({ currentIdea, onMixedIdea }: IdeaMixerProps) {
  const [secondIdea, setSecondIdea] = useState('');
  const [mixing, setMixing] = useState(false);

  const handleMix = async () => {
    if (!currentIdea || !secondIdea) return;

    setMixing(true);
    try {
      const response = await fetch('/api/idea-mixer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea1: currentIdea, idea2: secondIdea }),
      });

      if (response.ok) {
        const data = await response.json();
        onMixedIdea(data.mixedIdea);
        setSecondIdea('');
      }
    } catch (error) {
      console.error('Mix error:', error);
    } finally {
      setMixing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg shadow-md p-6 border border-pink-200">
      <div className="flex items-center gap-2 mb-4">
        <Shuffle className="w-5 h-5 text-pink-600" />
        <h3 className="text-lg font-semibold text-slate-800">Idea Mixer</h3>
      </div>

      <p className="text-sm text-slate-600 mb-4">
        Combine your idea with another concept to create hybrid innovations
      </p>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-2 block">
            Current Idea
          </label>
          <div className="p-3 bg-white rounded-lg border border-pink-200 text-sm text-slate-600 max-h-20 overflow-y-auto">
            {currentIdea || 'Enter an idea to start mixing...'}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="p-2 bg-pink-100 rounded-full">
            <ArrowRight className="w-4 h-4 text-pink-600" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 mb-2 block">
            Mix With Another Idea
          </label>
          <textarea
            value={secondIdea}
            onChange={(e) => setSecondIdea(e.target.value)}
            placeholder="E.g., Netflix's streaming model, Uber's gig economy..."
            className="w-full h-24 px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-sm"
          />
        </div>

        <button
          onClick={handleMix}
          disabled={!currentIdea || !secondIdea || mixing}
          className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {mixing ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              Mixing Ideas...
            </>
          ) : (
            <>
              <Shuffle className="w-4 h-4" />
              Mix Ideas
            </>
          )}
        </button>
      </div>
    </div>
  );
}
