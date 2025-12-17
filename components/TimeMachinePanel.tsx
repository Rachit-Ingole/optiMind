'use client';

import { Clock, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TimelineData {
  period: string;
  past: number;
  present: number;
  future: number;
}

interface TimeMachineData {
  pastAnalysis: {
    decade: string;
    viability: number;
    reason: string;
  };
  presentAnalysis: {
    viability: number;
    status: string;
  };
  futureAnalysis: {
    decade: string;
    viability: number;
    reason: string;
  };
  timeline: TimelineData[];
}

interface TimeMachinePanelProps {
  data: TimeMachineData | null;
  loading: boolean;
}

export default function TimeMachinePanel({ data, loading }: TimeMachinePanelProps) {
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
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Time Machine analysis will appear here</p>
        </div>
      </div>
    );
  }

  const getViabilityColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 40) return 'text-amber-600 bg-amber-100 border-amber-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getViabilityIcon = (score: number) => {
    if (score >= 70) return <CheckCircle className="w-4 h-4" />;
    if (score >= 40) return <AlertTriangle className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-800">Time Machine Analysis</h3>
      </div>

      <p className="text-sm text-slate-600 mb-6">
        How would your idea perform in different time periods?
      </p>

      {/* Timeline Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Past */}
        <div className={`p-4 rounded-lg border ${getViabilityColor(data.pastAnalysis.viability)}`}>
          <div className="flex items-center gap-2 mb-2">
            {getViabilityIcon(data.pastAnalysis.viability)}
            <span className="text-xs font-semibold">{data.pastAnalysis.decade}</span>
          </div>
          <div className="text-2xl font-bold mb-1">{data.pastAnalysis.viability}%</div>
          <p className="text-xs">{data.pastAnalysis.reason}</p>
        </div>

        {/* Present */}
        <div className={`p-4 rounded-lg border ${getViabilityColor(data.presentAnalysis.viability)}`}>
          <div className="flex items-center gap-2 mb-2">
            {getViabilityIcon(data.presentAnalysis.viability)}
            <span className="text-xs font-semibold">Today</span>
          </div>
          <div className="text-2xl font-bold mb-1">{data.presentAnalysis.viability}%</div>
          <p className="text-xs">{data.presentAnalysis.status}</p>
        </div>

        {/* Future */}
        <div className={`p-4 rounded-lg border ${getViabilityColor(data.futureAnalysis.viability)}`}>
          <div className="flex items-center gap-2 mb-2">
            {getViabilityIcon(data.futureAnalysis.viability)}
            <span className="text-xs font-semibold">{data.futureAnalysis.decade}</span>
          </div>
          <div className="text-2xl font-bold mb-1">{data.futureAnalysis.viability}%</div>
          <p className="text-xs">{data.futureAnalysis.reason}</p>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Viability Over Time</h4>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data.timeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Area
              type="monotone"
              dataKey="past"
              stackId="1"
              stroke="#EF4444"
              fill="#FEE2E2"
              name="Past Era"
            />
            <Area
              type="monotone"
              dataKey="present"
              stackId="2"
              stroke="#3B82F6"
              fill="#DBEAFE"
              name="Current"
            />
            <Area
              type="monotone"
              dataKey="future"
              stackId="3"
              stroke="#10B981"
              fill="#D1FAE5"
              name="Future"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
