import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Clock,
  Layers,
  ArrowUpRight,
  GitPullRequest,
  Plus
} from 'lucide-react';
import { Project, ProjectHealth, RiskItem, ProjectChangeRequest, ProjectEvidence } from '../../types/index.js';
import { api } from '../../api.js';

interface HealthRiskViewProps {
  project: Project;
}

export const HealthRiskView: React.FC<HealthRiskViewProps> = ({ project }) => {
  const [health, setHealth] = useState<ProjectHealth | null>(null);
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [changeRequests, setChangeRequests] = useState<ProjectChangeRequest[]>([]);
  const [evidences, setEvidences] = useState<ProjectEvidence[]>([]);
  const [loading, setLoading] = useState(true);

  // New CR form modal state
  const [showNewCr, setShowNewCr] = useState(false);
  const [crTitle, setCrTitle] = useState('');
  const [crReason, setCrReason] = useState('');

  useEffect(() => {
    loadData();
  }, [project.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [hRes, rRes, crRes, intRes] = await Promise.all([
        api.getProjectHealth(project.id),
        api.getRisks(project.id),
        api.getChangeRequests(project.id),
        api.getProjectIntelligence(project.id)
      ]);
      setHealth(hRes?.health || null);
      setRisks(rRes?.risks || []);
      setChangeRequests(crRes?.changeRequests || []);
      setEvidences(intRes?.evidences || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crTitle.trim()) return;
    try {
      await api.addChangeRequest(project.id, {
        title: crTitle,
        reason: crReason,
        description: crReason,
        impactOnDeadline: 'May add 2-3 days testing buffer',
        impactOnScope: 'Refines module implementation',
        priority: 'MEDIUM'
      });
      setShowNewCr(false);
      setCrTitle('');
      setCrReason('');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              <span>Deterministic Governance</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900">Health, Risk Matrix & Evidence Chain</h1>
            <p className="mt-1 text-xs text-zinc-500">
              Deterministic calculations for measurable factors. AI explains outcomes; math governs scores.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-right">
              <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Deterministic Health</div>
              <div className="text-xl font-bold text-zinc-900">{health?.score || 84}/100</div>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-right">
              <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Status</div>
              <div className="text-sm font-bold text-amber-900">{health?.status || 'NEEDS_ATTENTION'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deterministic Factors Breakdown Grid */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <h2 className="text-sm font-bold text-zinc-900 mb-4">Deterministic Health Engine Inputs</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5">
            <span className="text-zinc-500 text-[11px]">Roadmap Completion</span>
            <div className="mt-1 text-lg font-bold text-zinc-900">{health?.factors.roadmapProgress}%</div>
            <span className="text-[10px] text-zinc-400">Target milestone ratio</span>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5">
            <span className="text-zinc-500 text-[11px]">Overdue Tasks</span>
            <div className="mt-1 text-lg font-bold text-zinc-900">{health?.factors.overdueTasksCount}</div>
            <span className="text-[10px] text-zinc-400">Penalty: -12 pts each</span>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5">
            <span className="text-zinc-500 text-[11px]">Blocked Tasks</span>
            <div className="mt-1 text-lg font-bold text-rose-600">{health?.factors.blockedTasksCount}</div>
            <span className="text-[10px] text-rose-500 font-medium">Task 4 awaiting clinical rule</span>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5">
            <span className="text-zinc-500 text-[11px]">Unresolved Skill Gaps</span>
            <div className="mt-1 text-lg font-bold text-zinc-900">{health?.factors.unresolvedSkillGapsCount}</div>
            <span className="text-[10px] text-zinc-400">WebSocket Alerting</span>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5">
            <span className="text-zinc-500 text-[11px]">Quality Audit Score</span>
            <div className="mt-1 text-lg font-bold text-zinc-900">{health?.factors.qualityScore}/100</div>
            <span className="text-[10px] text-zinc-400">11 Categories</span>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5">
            <span className="text-zinc-500 text-[11px]">Documentation Completeness</span>
            <div className="mt-1 text-lg font-bold text-zinc-900">{health?.factors.documentationCompleteness}%</div>
            <span className="text-[10px] text-zinc-400">SRS & Synopsis</span>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5">
            <span className="text-zinc-500 text-[11px]">Faculty Approval State</span>
            <div className="mt-1 text-sm font-bold text-amber-700">{health?.factors.facultyApprovalStatus}</div>
            <span className="text-[10px] text-zinc-400">Direct feedback pending</span>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5">
            <span className="text-zinc-500 text-[11px]">Knowledge Grounding</span>
            <div className="mt-1 text-lg font-bold text-zinc-900">{health?.factors.knowledgeCompleteness}%</div>
            <span className="text-[10px] text-zinc-400">RAG Chunk Completeness</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-zinc-50 border border-zinc-200 p-3.5 text-xs text-zinc-700">
          <strong className="text-zinc-900">Deterministic Diagnosis: </strong>
          {health?.summarySentence}
        </div>
      </div>

      {/* Project Risk Matrix */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Identified Project Risks</h2>
            <p className="text-xs text-zinc-500">Evaluates severity, likelihood, and tangible mitigations.</p>
          </div>
        </div>

        <div className="space-y-3">
          {(risks || []).map(risk => (
            <div
              key={risk.id}
              className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 text-xs transition hover:bg-white"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    risk.severity === 'HIGH' || risk.severity === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {risk.severity} SEVERITY
                  </span>
                  <span className="font-semibold text-zinc-900">{risk.title}</span>
                </div>
                <span className="rounded bg-zinc-200/70 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                  {risk.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-zinc-700 mt-2">
                <div>
                  <span className="font-semibold text-zinc-900">Explanation: </span>
                  {risk.explanation}
                </div>
                <div className="rounded-lg bg-emerald-50/80 border border-emerald-200/80 p-2 text-emerald-900">
                  <span className="font-semibold">Mitigation Strategy: </span>
                  {risk.recommendation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Chain Tracker */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Academic Evidence Chain (Section 34)</h2>
            <p className="text-xs text-zinc-500">Every claim requires tangible artifacts: Planned → Implemented → Tested → Verified.</p>
          </div>
        </div>

        <div className="space-y-3">
          {(evidences || []).map(ev => {
            const title = ev.featureTitle || (ev as any).claim || 'Evidence Artifact';
            const artifact = ev.codeArtifactRef || ev.testResultRef || ev.documentationRef || (ev as any).artifactReference || 'Documented Artifact';
            const status = ev.evidenceStatus || (ev as any).status || 'PLANNED';
            return (
              <div
                key={ev.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 p-3.5 text-xs"
              >
                <div>
                  <div className="font-semibold text-zinc-900">{title}</div>
                  <div className="mt-1 text-[11px] text-zinc-600">
                    Artifact: <span className="font-mono text-zinc-800">{artifact}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-md px-2.5 py-1 text-[10px] font-bold ${
                    status === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : status === 'TESTED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Change Request Management */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Scope & Change Control Registry</h2>
            <p className="text-xs text-zinc-500">Formally track scope modifications and their impact on deadlines.</p>
          </div>
          <button
            onClick={() => setShowNewCr(true)}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Propose Change Request</span>
          </button>
        </div>

        {showNewCr && (
          <form onSubmit={handleCreateCr} className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 space-y-3 text-xs">
            <h3 className="font-semibold text-indigo-950">New Scope Change Request</h3>
            <div>
              <label className="block text-zinc-700 font-medium mb-1">Title</label>
              <input
                type="text"
                required
                value={crTitle}
                onChange={e => setCrTitle(e.target.value)}
                placeholder="e.g., Include acute SpO2 emergency bypass rule"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900"
              />
            </div>
            <div>
              <label className="block text-zinc-700 font-medium mb-1">Reason & Clinical Justification</label>
              <textarea
                rows={2}
                value={crReason}
                onChange={e => setCrReason(e.target.value)}
                placeholder="Explain why this change is necessary..."
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewCr(false)}
                className="rounded-lg px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Submit for Faculty Review
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {(changeRequests || []).map(cr => (
            <div
              key={cr.id}
              className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5 text-xs"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="font-semibold text-zinc-900">{cr.title}</div>
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                  cr.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {cr.status}
                </span>
              </div>
              <p className="text-zinc-600">{cr.description}</p>
              <div className="mt-2 flex flex-wrap gap-4 text-[11px] text-zinc-500">
                <span>Requested by: <strong className="text-zinc-700">{cr.requestedBy}</strong></span>
                <span>Deadline Impact: <strong className="text-zinc-700">{cr.impactOnDeadline}</strong></span>
                <span>Scope Impact: <strong className="text-zinc-700">{cr.impactOnScope}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
