'use client';

import { DollarSign, Calendar, Users2, Target } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MonetizationData {
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
}

interface MonetizationPanelProps {
  data: MonetizationData | null;
  loading: boolean;
}

export default function MonetizationPanel({ data, loading }: MonetizationPanelProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Monetization insights will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-slate-800">Monetization</h3>
      </div>

      {/* Pricing Model */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-xs font-semibold text-green-900">Pricing Model</span>
          </div>
          <p className="text-sm font-bold text-green-700">{data.pricing.model}</p>
          <p className="text-xs text-green-600 mt-1">{data.pricing.range}</p>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-900">Break-even</span>
          </div>
          <p className="text-sm font-bold text-blue-700">{data.breakeven}</p>
        </div>
      </div>

      {/* LTV & CAC */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
          <span className="text-xs font-semibold text-purple-900">Customer LTV</span>
          <p className="text-lg font-bold text-purple-700 mt-1">{data.ltv}</p>
        </div>

        <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
          <span className="text-xs font-semibold text-amber-900">CAC</span>
          <p className="text-lg font-bold text-amber-700 mt-1">{data.cac}</p>
        </div>
      </div>

      {/* Revenue Breakdown Pie Chart */}
      {data.revenueBreakdown && data.revenueBreakdown.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Revenue Mix</h4>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data.revenueBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {data.revenueBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
