import React, { useState, useEffect } from 'react';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
  Clock,
  Coins,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Project, FeasibilityAnalysis } from '../../types/index.js';
import { api } from '../../api.js';

interface FeasibilityViewProps {
  project: Project;
}

export const FeasibilityView: React.FC<FeasibilityViewProps> = ({ project }) => {
  const [feasibility, setFeasibility] = useState<FeasibilityAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeasibility();
  }, [project.id]);

  const loadFeasibility = async () => {
    setLoading(true);
    try {
      const res = await api.getFeasibility(project.id);
      setFeasibility(res.feasibility);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!feasibility) {
    return (
      <div className="p-12 text-center text-xs text-zinc-500">
        Loading feasibility analysis...
      </div>
    );
  }

  const dims = [
    { name: 'Technical Feasibility', score: feasibility.breakdown.technical, desc: 'Libraries, frameworks, and architecture compatibility' },
    { name: 'Time & Milestone Feasibility', score: feasibility.breakdown.time, desc: 'Realistic delivery within 16 academic semester weeks' },
    { name: 'Skill & Knowledge Fit', score: feasibility.breakdown.skill, desc: 'Current team capabilities vs learning curves' },
    { name: 'Team Capacity', score: feasibility.breakdown.team, desc: 'Workload distribution across team members' },
    { name: 'Resource Availability', score: feasibility.breakdown.resource, desc: 'APIs, documentation, and tooling access' },
    { name: 'Hardware & Compute', score: feasibility.breakdown.hardware, desc: 'Host CPU/RAM and ARM gateway edge constraints' },
    { name: 'Budget & Cost', score: feasibility.breakdown.budget, desc: 'Free-tier and academic cloud allowance compliance' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <Scale className="h-4 w-4 text-indigo-500" />
              <span>Stage 2: Viability Verification</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900">Project Feasibility & Scope Analyzer</h1>
            <p className="mt-1 text-xs text-zinc-500">
              Evaluates technical, temporal, and resource realities before development begins to avoid mid-semester abandonment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-right">
              <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Feasibility Score</div>
              <div className="text-xl font-bold text-indigo-600">{feasibility.overallScore}/100</div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-right">
              <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Complexity</div>
              <div className="text-sm font-bold text-zinc-800">{feasibility.complexity}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Dimension Feasibility Grid */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <h2 className="text-sm font-bold text-zinc-900 mb-4">7-Dimension Feasibility Assessment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dims.map(d => (
            <div key={d.name} className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-zinc-900">{d.name}</span>
                <span className="font-bold text-indigo-600">{d.score}%</span>
              </div>
              <p className="text-[11px] text-zinc-500 mb-2.5">{d.desc}</p>
              <div className="h-1.5 w-full rounded-full bg-zinc-200 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${d.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Suitability & Real-World Value */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-indigo-900 font-semibold text-xs">
            <Award className="h-4 w-4 text-indigo-600" />
            <span>Academic Capstone Suitability</span>
          </div>
          <p className="text-xs text-zinc-700 leading-relaxed">{feasibility.academicSuitability}</p>

          <div className="mt-4 pt-4 border-t border-zinc-100">
            <span className="font-semibold text-xs text-zinc-900 block mb-1">Key Strengths:</span>
            <ul className="space-y-1 text-xs text-zinc-600">
              {(feasibility.strengths || []).map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-indigo-900 font-semibold text-xs">
            <Cpu className="h-4 w-4 text-emerald-600" />
            <span>Real-World Engineering Value</span>
          </div>
          <p className="text-xs text-zinc-700 leading-relaxed">{feasibility.realWorldValue}</p>

          <div className="mt-4 pt-4 border-t border-zinc-100">
            <span className="font-semibold text-xs text-zinc-900 block mb-1">Areas Requiring Vigilance:</span>
            <ul className="space-y-1 text-xs text-zinc-600">
              {(feasibility.weaknesses || []).map((w, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Scope Boundaries: MVP vs Future Scope */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-4 w-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-zinc-900">Scope Boundary & Anti-Scope-Creep Guardrails</h2>
        </div>
        <p className="text-xs text-zinc-500 mb-4">
          Strictly demarcates what is committed for final viva examination vs future extensions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
            <div className="flex items-center gap-2 font-bold text-emerald-950 mb-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>MVP Scope (Committed for Capstone Viva)</span>
            </div>
            <ul className="space-y-1.5 text-zinc-700">
              {(feasibility.mvpScope || []).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center gap-2 font-bold text-zinc-800 mb-2">
              <Clock className="h-4 w-4 text-zinc-500" />
              <span>Future Scope (Explicitly Excluded from Semester Viva)</span>
            </div>
            <ul className="space-y-1.5 text-zinc-600">
              {(feasibility.futureScope || []).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-zinc-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
