'use client';

import { Building2, Users, Briefcase, TrendingUp } from 'lucide-react';

interface BusinessModelData {
  primaryModel: string;
  targetMarket: string;
  revenueStreams: string[];
  customerSegments: string[];
  competitiveAdvantage: string;
}

interface BusinessModelPanelProps {
  data: BusinessModelData | null;
  loading: boolean;
}

export default function BusinessModelPanel({ data, loading }: BusinessModelPanelProps) {
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
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Business model analysis will appear here</p>
        </div>
      </div>
    );
  }

  const getModelIcon = (model: string) => {
    if (model.includes('B2B')) return <Building2 className="w-5 h-5 text-blue-600" />;
    if (model.includes('B2C')) return <Users className="w-5 h-5 text-green-600" />;
    if (model.includes('B2B2C')) return <TrendingUp className="w-5 h-5 text-purple-600" />;
    return <Briefcase className="w-5 h-5 text-indigo-600" />;
  };

  const getModelColor = (model: string) => {
    if (model.includes('B2B')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (model.includes('B2C')) return 'bg-green-100 text-green-700 border-green-200';
    if (model.includes('B2B2C')) return 'bg-purple-100 text-purple-700 border-purple-200';
    return 'bg-indigo-100 text-indigo-700 border-indigo-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-slate-800">Business Model</h3>
      </div>

      {/* Primary Model Badge */}
      <div className="mb-6">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getModelColor(data.primaryModel)}`}>
          {getModelIcon(data.primaryModel)}
          <span className="font-semibold text-sm">{data.primaryModel}</span>
        </div>
      </div>

      {/* Target Market */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">Target Market</h4>
        <p className="text-slate-600 text-sm">{data.targetMarket}</p>
      </div>

      {/* Revenue Streams */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">Revenue Streams</h4>
        <div className="flex flex-wrap gap-2">
          {data.revenueStreams.map((stream, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
            >
              {stream}
            </span>
          ))}
        </div>
      </div>

      {/* Customer Segments */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">Customer Segments</h4>
        <ul className="space-y-2">
          {data.customerSegments.map((segment, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5" />
              <span className="text-slate-600 text-sm">{segment}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Competitive Advantage */}
      <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
        <h4 className="text-sm font-semibold text-indigo-900 mb-2">Key Advantage</h4>
        <p className="text-indigo-700 text-sm">{data.competitiveAdvantage}</p>
      </div>
    </div>
  );
}
