import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  GitPullRequestDraft,
  GraduationCap,
  Layers,
  Mic,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';
import { Project, ProjectHealth, Task, FacultyReview } from '../../types/index.js';
import { api } from '../../api.js';

interface MasterDashboardProps {
  project: Project;
  onNavigate: (view: any) => void;
  onOpenCopilot: () => void;
}

export const MasterDashboard: React.FC<MasterDashboardProps> = ({
  project,
  onNavigate,
  onOpenCopilot
}) => {
  const [health, setHealth] = useState<ProjectHealth | null>(null);
  const [readiness, setReadiness] = useState<any>(null);
  const [nextAction, setNextAction] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reviews, setReviews] = useState<FacultyReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [project.id]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [hRes, rRes, aRes, tRes, revRes] = await Promise.all([
        api.getProjectHealth(project.id),
        api.getProjectReadiness(project.id),
        api.getNextBestAction(project.id),
        api.getTasks(project.id),
        api.getFacultyReviews(project.id)
      ]);
      setHealth(hRes?.health || null);
      setReadiness(rRes?.readiness || null);
      setNextAction(aRes?.nextBestAction || null);
      setTasks(tRes?.tasks || []);
      setReviews(revRes?.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const completedTasks = (tasks || []).filter(t => t.status === 'COMPLETED').length;
  const inProgressTasks = (tasks || []).filter(t => t.status === 'IN_PROGRESS').length;
  const blockedTasks = (tasks || []).filter(t => t.status === 'BLOCKED');

  const latestReview = reviews && reviews.length > 0 ? reviews[0] : null;

  return (
    <div className="space-y-6">
      {/* Top Banner: Project Title & Quick Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="rounded-md bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
              {project.category}
            </span>
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
              Domain: {project.domain}
            </span>
            <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Guide: {project.facultyGuideName}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
            {project.title}
          </h1>
          <p className="mt-1 text-xs text-zinc-500 max-w-3xl leading-relaxed">
            {project.abstract}
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 transition"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Ask Project Copilot</span>
          </button>
        </div>
      </div>

      {/* Next Best Action Banner */}
      {nextAction && (
        <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50/90 to-white p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-indigo-200/80 px-1.5 py-0.5 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
                    Next Best Action
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    nextAction.urgency === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {nextAction.urgency} PRIORITY
                  </span>
                </div>
                <h3 className="mt-1 text-sm font-bold text-zinc-900">{nextAction.actionTitle}</h3>
                <p className="text-xs text-zinc-600 mt-0.5">{nextAction.reason}</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate(nextAction.targetView)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition shrink-0"
            >
              <span>{nextAction.ctaText}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Primary Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Roadmap Progress */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Roadmap</span>
            <Layers className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900">
            {health?.factors.roadmapProgress || 67}%
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${health?.factors.roadmapProgress || 67}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] text-zinc-500">
            {completedTasks} of {tasks.length} tasks complete
          </div>
        </div>

        {/* Metric 2: Deterministic Health */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Health Score</span>
            <Activity className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-zinc-900">{health?.score || 84}</span>
            <span className="text-xs text-zinc-400">/ 100</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1 rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
            {health?.status || 'NEEDS_ATTENTION'}
          </div>
          <div className="mt-2 text-[10px] text-zinc-500 truncate">
            {health?.factors.blockedTasksCount || 1} task blocked
          </div>
        </div>

        {/* Metric 3: Quality Audit */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Quality Score</span>
            <GitPullRequestDraft className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-zinc-900">{health?.factors.qualityScore || 88}</span>
            <span className="text-xs text-zinc-400">/ 100</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${health?.factors.qualityScore || 88}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] text-zinc-500">11 Categories Audited</div>
        </div>

        {/* Metric 4: Documentation */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Documentation</span>
            <FileText className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900">
            {health?.factors.documentationCompleteness || 67}%
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${health?.factors.documentationCompleteness || 67}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] text-zinc-500">SRS & Synopsis v2</div>
        </div>

        {/* Metric 5: Viva Readiness */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Viva Readiness</span>
            <Mic className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900">
            {readiness?.breakdown.vivaConfidence || 82}%
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full"
              style={{ width: `${readiness?.breakdown.vivaConfidence || 82}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] text-zinc-500">3-Min Pitch Prepared</div>
        </div>

        {/* Metric 6: Days Remaining */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Days Left</span>
            <Clock className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900">
            {health?.factors.daysRemaining || 72}
          </div>
          <div className="mt-2 text-[10px] text-zinc-500">Deadline: May 15, 2026</div>
          <div className="mt-2 text-[10px] font-medium text-emerald-600">Pace: 0.6 tasks / day</div>
        </div>
      </div>

      {/* Two Column Layout: Urgent Triage & Active Work */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Tasks & Faculty Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Faculty Review Status Card */}
          {latestReview && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-sm text-zinc-900">Faculty Guide Evaluation</h3>
                </div>
                <span className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${
                  latestReview.status === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : latestReview.status === 'CHANGE_REQUESTED'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {latestReview.status.replace('_', ' ')}
                </span>
              </div>

              <div className="mt-3 text-xs text-zinc-700">
                <p className="font-medium text-zinc-900">Review Notes from {latestReview.facultyName}:</p>
                <blockquote className="mt-1.5 rounded-xl border-l-4 border-amber-400 bg-zinc-50 p-3 italic text-zinc-700">
                  "{latestReview.reviewNotes}"
                </blockquote>
              </div>

              {latestReview.feedbackList && latestReview.feedbackList.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                    Actionable Directives:
                  </div>
                  {(latestReview.feedbackList || []).map(item => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between rounded-lg border border-zinc-200 bg-white p-2.5 text-xs"
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-zinc-800">{item.feedback}</p>
                          <span className="text-[10px] text-zinc-500">Category: {item.category}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        item.isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.isResolved ? 'RESOLVED' : 'PENDING'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Current Milestone & Critical Tasks */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="font-semibold text-sm text-zinc-900">Active Milestone Deliverables</h3>
                <p className="text-xs text-zinc-500">Phase 2: Core Data Ingestion & Signal Preprocessing</p>
              </div>
              <button
                onClick={() => onNavigate('roadmap')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Full Board</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {(tasks || []).slice(0, 4).map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-xs transition hover:bg-white hover:border-zinc-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {task.status === 'COMPLETED' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : task.status === 'BLOCKED' ? (
                        <AlertTriangle className="h-4 w-4 text-rose-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-indigo-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-900">{task.title}</div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500">
                        <span>Tag: {task.technologyTag}</span>
                        <span>•</span>
                        <span>Due: {task.deadline}</span>
                        <span>•</span>
                        <span>Est: {task.estimateHours}h</span>
                      </div>
                      {task.notes && (
                        <p className="mt-1 text-[11px] text-amber-700 font-medium">
                          Note: {task.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    task.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : task.status === 'BLOCKED'
                      ? 'bg-rose-100 text-rose-800'
                      : task.status === 'IN_PROGRESS'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-zinc-100 text-zinc-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Readiness Engine & Quick Navigation */}
        <div className="space-y-6">
          {/* Project Readiness Engine Breakdown */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-zinc-900">Submission Readiness</h3>
              <span className="text-sm font-bold text-indigo-600">{readiness?.overallScore || 78}%</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-zinc-600 mb-1">
                  <span>Development Progress</span>
                  <span className="font-medium">{readiness?.breakdown.developmentProgress || 67}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-indigo-600" style={{ width: `${readiness?.breakdown.developmentProgress || 67}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-zinc-600 mb-1">
                  <span>Automated Testing & QA</span>
                  <span className="font-medium">{readiness?.breakdown.testingQuality || 85}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${readiness?.breakdown.testingQuality || 85}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-zinc-600 mb-1">
                  <span>Documentation Completeness</span>
                  <span className="font-medium">{readiness?.breakdown.documentation || 70}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: `${readiness?.breakdown.documentation || 70}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-zinc-600 mb-1">
                  <span>Faculty Guide Approval</span>
                  <span className="font-medium">{readiness?.breakdown.facultyEndorsement || 70}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${readiness?.breakdown.facultyEndorsement || 70}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-zinc-600 mb-1">
                  <span>Viva Voce Mastery</span>
                  <span className="font-medium">{readiness?.breakdown.vivaConfidence || 82}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-purple-600" style={{ width: `${readiness?.breakdown.vivaConfidence || 82}%` }} />
                </div>
              </div>
            </div>

            {readiness?.missingCriteria && readiness.missingCriteria.length > 0 && (
              <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50/70 p-3 text-[11px]">
                <div className="font-semibold text-rose-900 mb-1 flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                  <span>Missing Submission Gates:</span>
                </div>
                <ul className="space-y-1 text-rose-700">
                  {(readiness.missingCriteria || []).map((c: string, idx: number) => (
                    <li key={idx}>• {c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quick Life-Cycle Navigation Cards */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-2">
            <h3 className="font-semibold text-sm text-zinc-900 mb-3">Jump to Module</h3>

            {[
              { id: 'intelligence', title: 'Project Intelligence & RAG', desc: 'Inspect verified chunks & graph', icon: Sparkles },
              { id: 'quality', title: 'Quality Audit (11-Cat)', desc: 'Run code & security audit', icon: GitPullRequestDraft },
              { id: 'viva', title: 'Viva Prep & Pitch Rehearsal', desc: 'Mock viva AI examiner', icon: Mic },
              { id: 'documentation', title: 'Documentation Center', desc: 'Generate Capstone SRS & Report', icon: FileText }
            ].map(nav => {
              const Icon = nav.icon;
              return (
                <button
                  key={nav.id}
                  onClick={() => onNavigate(nav.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/60 p-3 text-left transition hover:bg-indigo-50/50 hover:border-indigo-200"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-indigo-600 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-zinc-800">{nav.title}</div>
                      <div className="text-[10px] text-zinc-500">{nav.desc}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
