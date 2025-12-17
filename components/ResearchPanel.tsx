'use client';

import { useState } from 'react';
import { GraduationCap, Loader2, FileText, ExternalLink, Users, Calendar, DollarSign } from 'lucide-react';

interface Paper {
  title: string;
  authors: string;
  year: string;
  relevance: string;
  keyFindings: string;
  url: string;
}

interface ResearchData {
  isResearch: boolean;
  researchArea?: string;
  suggestedPapers?: Paper[];
  researchDirections?: string[];
  methodologies?: string[];
  keyResearchers?: string[];
  relatedConferences?: string[];
  fundingOpportunities?: string[];
  message?: string;
}

interface Props {
  idea: string;
}

export default function ResearchPanel({ idea }: Props) {
  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleResearch = async () => {
    if (!idea || idea.length < 20) return;

    setLoading(true);
    setChecked(true);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });

      if (response.ok) {
        const data = await response.json();
        setResearchData(data);
      }
    } catch (error) {
      console.error('Research error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!checked) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border-2 border-indigo-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-indigo-900 mb-2 flex items-center gap-2">
              🎓 Research Mode
              <span className="px-2 py-1 bg-indigo-500 text-white text-xs rounded-full">ACADEMIC</span>
            </h3>
            <p className="text-indigo-700 mb-4">
              Is your idea research-oriented? Get relevant academic papers, research directions, and scholarly resources.
            </p>
            <button
              onClick={handleResearch}
              disabled={!idea || idea.length < 20 || loading}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <GraduationCap className="w-5 h-5" />
                  Find Research Papers
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-12 border-2 border-indigo-200">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
          <p className="text-indigo-700 font-medium">Searching academic databases...</p>
        </div>
      </div>
    );
  }

  if (!researchData?.isResearch) {
    return (
      <div className="bg-gray-50 rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Not Research-Oriented</h3>
            <p className="text-gray-600">
              This idea doesn't appear to be focused on academic or scientific research. Research mode is best for scholarly, scientific, or technical research projects.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border-2 border-indigo-200 animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-indigo-900">Research Resources</h3>
          <p className="text-sm text-indigo-600">{researchData.researchArea}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Suggested Papers */}
        {researchData.suggestedPapers && researchData.suggestedPapers.length > 0 && (
          <div className="bg-white rounded-lg p-6 border border-indigo-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h4 className="text-lg font-bold text-gray-900">Relevant Research Papers</h4>
            </div>
            <div className="space-y-4">
              {researchData.suggestedPapers.map((paper, idx) => (
                <div key={idx} className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h5 className="font-bold text-indigo-900 flex-1">{paper.title}</h5>
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 flex-shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {paper.authors} ({paper.year})
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold">Relevance:</span> {paper.relevance}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Key Findings:</span> {paper.keyFindings}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Research Directions */}
        {researchData.researchDirections && researchData.researchDirections.length > 0 && (
          <div className="bg-white rounded-lg p-6 border border-purple-200 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-3">Suggested Research Directions</h4>
            <ul className="space-y-2">
              {researchData.researchDirections.map((direction, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-purple-500 font-bold mt-1">→</span>
                  <span className="text-gray-700">{direction}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Methodologies */}
        {researchData.methodologies && researchData.methodologies.length > 0 && (
          <div className="bg-white rounded-lg p-6 border border-indigo-200 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-3">Relevant Methodologies</h4>
            <div className="flex flex-wrap gap-2">
              {researchData.methodologies.map((method, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Key Researchers */}
        {researchData.keyResearchers && researchData.keyResearchers.length > 0 && (
          <div className="bg-white rounded-lg p-6 border border-purple-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-purple-600" />
              <h4 className="text-lg font-bold text-gray-900">Key Researchers in This Field</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {researchData.keyResearchers.map((researcher, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {researcher}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Conferences */}
        {researchData.relatedConferences && researchData.relatedConferences.length > 0 && (
          <div className="bg-white rounded-lg p-6 border border-indigo-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h4 className="text-lg font-bold text-gray-900">Relevant Academic Conferences</h4>
            </div>
            <ul className="space-y-2">
              {researchData.relatedConferences.map((conf, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-indigo-500">📅</span>
                  <span className="text-gray-700">{conf}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Funding */}
        {researchData.fundingOpportunities && researchData.fundingOpportunities.length > 0 && (
          <div className="bg-green-50 rounded-lg p-6 border border-green-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h4 className="text-lg font-bold text-gray-900">Potential Funding Sources</h4>
            </div>
            <ul className="space-y-2">
              {researchData.fundingOpportunities.map((funding, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-green-500">💰</span>
                  <span className="text-gray-700">{funding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
