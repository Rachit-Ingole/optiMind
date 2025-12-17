'use client';

import { Rocket, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface GoToMarketData {
  strategy: string;
  timeline: string;
  channels: string[];
  milestones: {
    phase: string;
    duration: string;
    status: 'pending' | 'active' | 'completed';
  }[];
  risks: string[];
}

interface GoToMarketPanelProps {
  data: GoToMarketData | null;
  loading: boolean;
}

export default function GoToMarketPanel({ data, loading }: GoToMarketPanelProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Rocket className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">GTM strategy will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Rocket className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-slate-800">Go-to-Market</h3>
      </div>

      {/* Strategy */}
      <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
        <h4 className="text-sm font-semibold text-indigo-900 mb-1">Strategy</h4>
        <p className="text-sm text-indigo-700">{data.strategy}</p>
      </div>

      {/* Timeline */}
      <div className="mb-4 flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <Clock className="w-5 h-5 text-blue-600" />
        <div>
          <span className="text-xs font-semibold text-blue-900">Timeline</span>
          <p className="text-sm font-bold text-blue-700">{data.timeline}</p>
        </div>
      </div>

      {/* Channels */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">Channels</h4>
        <div className="flex flex-wrap gap-2">
          {data.channels.map((channel, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200"
            >
              {channel}
            </span>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Launch Phases</h4>
        <div className="space-y-3">
          {data.milestones.map((milestone, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-1">
                {milestone.status === 'completed' && (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                )}
                {milestone.status === 'active' && (
                  <div className="w-4 h-4 rounded-full border-2 border-blue-600 bg-blue-100" />
                )}
                {milestone.status === 'pending' && (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-800">{milestone.phase}</span>
                  <span className="text-xs text-slate-500">{milestone.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risks */}
      {data.risks && data.risks.length > 0 && (
        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <h4 className="text-sm font-semibold text-amber-900">Key Risks</h4>
          </div>
          <ul className="space-y-1">
            {data.risks.map((risk, index) => (
              <li key={index} className="text-xs text-amber-700">
                • {risk}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
