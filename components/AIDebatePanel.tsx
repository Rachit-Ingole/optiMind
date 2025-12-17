'use client';

import { useState } from 'react';
import { MessageSquare, Bot, User, Send, Lightbulb } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIDebatePanelProps {
  idea: string;
}

export default function AIDebatePanel({ idea }: AIDebatePanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [debating, setDebating] = useState(false);

  const startDebate = async () => {
    if (!idea) return;
    
    setDebating(true);
    setLoading(true);
    setMessages([]);

    try {
      const response = await fetch('/api/ai-debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Debate error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-slate-800">AI Debate Mode</h3>
        </div>
        {!debating && (
          <button
            onClick={startDebate}
            disabled={!idea || loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:bg-gray-300 transition-colors"
          >
            {loading ? 'Starting...' : 'Start Debate'}
          </button>
        )}
      </div>

      <p className="text-sm text-slate-600 mb-4">
        Watch two AI agents debate the pros and cons of your idea in real-time
      </p>

      {messages.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-400">
          <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Click "Start Debate" to see AI perspectives</p>
        </div>
      )}

      {loading && messages.length === 0 && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user'
                  ? 'bg-green-100'
                  : 'bg-purple-100'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-green-600" />
              ) : (
                <Bot className="w-4 h-4 text-purple-600" />
              )}
            </div>
            <div
              className={`flex-1 p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-purple-50 border border-purple-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-semibold ${
                    message.role === 'user' ? 'text-green-700' : 'text-purple-700'
                  }`}
                >
                  {message.role === 'user' ? 'Optimist AI' : 'Skeptic AI'}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {message.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
