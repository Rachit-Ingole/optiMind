'use client';

import { Scale, Award, AlertCircle } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

interface Scenario {
  name: string;
  probability: number;
  revenue: number;
  cost: number;
  outcome: string;
}

interface RiskSimulationData {
  scenarios: Scenario[];
  radarData: {
    scenario: string;
    bestCase: number;
    realistic: number;
    worstCase: number;
  }[];
  recommendation: string;
}

interface RiskSimulatorProps {
  data: RiskSimulationData | null;
  loading: boolean;
}

export default function RiskSimulator({ data, loading }: RiskSimulatorProps) {
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
          <Scale className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Risk simulation will appear here</p>
        </div>
      </div>
    );
  }

  const getScenarioColor = (name: string) => {
    if (name.toLowerCase().includes('best')) return 'border-green-200 bg-green-50';
    if (name.toLowerCase().includes('worst')) return 'border-red-200 bg-red-50';
    return 'border-blue-200 bg-blue-50';
  };

  const getScenarioIcon = (name: string) => {
    if (name.toLowerCase().includes('best')) return '🚀';
    if (name.toLowerCase().includes('worst')) return '⚠️';
    return '📊';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="w-5 h-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-slate-800">Risk Simulation</h3>
      </div>

      <p className="text-sm text-slate-600 mb-6">
        Monte Carlo simulation exploring different outcome scenarios
      </p>

      {/* Scenarios */}
      <div className="space-y-3 mb-6">
        {data.scenarios.map((scenario, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getScenarioColor(scenario.name)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getScenarioIcon(scenario.name)}</span>
                <span className="font-semibold text-slate-800 text-sm">
                  {scenario.name}
                </span>
              </div>
              <span className="text-xs font-medium text-slate-600">
                {scenario.probability}% probability
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <span className="text-xs text-slate-600">Revenue</span>
                <p className="text-sm font-bold text-green-700">
                  ${scenario.revenue.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-600">Cost</span>
                <p className="text-sm font-bold text-red-700">
                  ${scenario.cost.toLocaleString()}
                </p>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 italic">{scenario.outcome}</p>
          </div>
        ))}
      </div>

      {/* Radar Comparison */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Scenario Comparison</h4>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={data.radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="scenario" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
            <Radar name="Best Case" dataKey="bestCase" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
            <Radar name="Realistic" dataKey="realistic" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            <Radar name="Worst Case" dataKey="worstCase" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Recommendation */}
      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-4 h-4 text-orange-600" />
          <h4 className="text-sm font-semibold text-orange-900">Recommendation</h4>
        </div>
        <p className="text-sm text-orange-700">{data.recommendation}</p>
      </div>
    </div>
  );
}
