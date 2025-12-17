'use client';

import { Save, Download, Share2, History, FolderOpen } from 'lucide-react';
import { useState } from 'react';

interface SavedIdea {
  id: string;
  title: string;
  timestamp: string;
  goal: string;
}

export default function IdeaLibrary() {
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);

  const handleSave = (idea: any) => {
    const saved = {
      id: Date.now().toString(),
      title: idea.title || 'Untitled Idea',
      timestamp: new Date().toISOString(),
      goal: idea.goal || 'balanced',
    };
    
    const existing = JSON.parse(localStorage.getItem('optiMindIdeas') || '[]');
    const updated = [saved, ...existing];
    localStorage.setItem('optiMindIdeas', JSON.stringify(updated));
    setSavedIdeas(updated);
  };

  const handleExport = () => {
    const data = localStorage.getItem('optiMindIdeas') || '[]';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimind-ideas-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col gap-3">
        {showLibrary && (
          <div className="bg-white rounded-lg shadow-2xl p-4 w-80 max-h-96 overflow-y-auto border border-gray-200 animate-slideUp">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-slate-800">My Ideas</h3>
              </div>
              <button
                onClick={handleExport}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Export All"
              >
                <Download className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {savedIdeas.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No saved ideas yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div className="font-medium text-sm text-slate-800 mb-1">
                      {idea.title}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{new Date(idea.timestamp).toLocaleDateString()}</span>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                        {idea.goal}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setShowLibrary(!showLibrary)}
            className="p-4 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all hover:scale-110"
            title="My Library"
          >
            <FolderOpen className="w-5 h-5 text-indigo-600" />
          </button>

          <button
            className="p-4 bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:scale-110"
            title="Save Current"
          >
            <Save className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
