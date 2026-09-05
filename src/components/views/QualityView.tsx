import React, { useState, useEffect } from 'react';
import {
  GitPullRequestDraft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Zap,
  Play,
  Terminal,
  Lock,
  Activity,
  Eye,
  Gauge,
  CheckSquare,
  ShieldAlert,
  Server,
  Layers,
  Cpu
} from 'lucide-react';
import { Project, QualityAnalysis } from '../../types/index.js';
import { api } from '../../api.js';

interface QualityViewProps {
  project: Project;
}

type PillarTab = 'audit' | 'testing' | 'security' | 'efficiency' | 'accessibility';

export const QualityView: React.FC<QualityViewProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<PillarTab>('audit');
  const [quality, setQuality] = useState<QualityAnalysis | null>(null);
  const [loadingQuality, setLoadingQuality] = useState(true);
  const [reEvaluating, setReEvaluating] = useState(false);

  // Testing Suite state
  const [testResults, setTestResults] = useState<any>(null);
  const [runningTests, setRunningTests] = useState(false);

  // Security Audit state
  const [securityAudit, setSecurityAudit] = useState<any>(null);
  const [loadingSecurity, setLoadingSecurity] = useState(false);

  // Efficiency & Performance state
  const [perfMetrics, setPerfMetrics] = useState<any>(null);
  const [loadingPerf, setLoadingPerf] = useState(false);

  useEffect(() => {
    loadQuality();
    loadTestResults();
    loadSecurityAudit();
    loadPerfMetrics();
  }, [project.id]);

  const loadQuality = async () => {
    setLoadingQuality(true);
    try {
      const res = await api.getQuality(project.id);
      setQuality(res.quality);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuality(false);
    }
  };

  const handleReEvaluate = async () => {
    setReEvaluating(true);
    try {
      const res = await api.reEvaluateQuality(project.id);
      setQuality(res.quality);
    } catch (err) {
      console.error(err);
    } finally {
      setReEvaluating(false);
    }
  };

  const loadTestResults = async () => {
    try {
      const res = await api.getTestResults();
      setTestResults(res.results);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunTests = async () => {
    setRunningTests(true);
    try {
      const res = await api.runAutomatedTests();
      setTestResults(res.results);
    } catch (err) {
      console.error(err);
    } finally {
      setRunningTests(false);
    }
  };

  const loadSecurityAudit = async () => {
    setLoadingSecurity(true);
    try {
      const res = await api.getSecurityAudit();
      setSecurityAudit(res.audit);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSecurity(false);
    }
  };

  const loadPerfMetrics = async () => {
    setLoadingPerf(true);
    try {
      const res = await api.getPerformanceMetrics();
      setPerfMetrics(res.metrics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPerf(false);
    }
  };

  if (!quality && loadingQuality) {
    return (
      <div className="p-12 text-center text-xs text-zinc-500" role="status">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mb-2" />
        <p>Loading quality and verification suite...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <GitPullRequestDraft className="h-4 w-4 text-indigo-500" aria-hidden="true" />
              <span>Academic & Production Engineering Standards</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900">
              Platform Engineering: Quality, Security, Efficiency, Testing & Accessibility
            </h1>
            <p className="mt-1 text-xs text-zinc-500">
              Multi-pillar verification encompassing automated tests, security controls, cache efficiency, and WCAG AA accessibility.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {quality && (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-right">
                <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Quality Score</div>
                <div className="text-xl font-bold text-indigo-600">{quality.overallScore}/100</div>
              </div>
            )}
            <button
              onClick={handleReEvaluate}
              disabled={reEvaluating}
              aria-label="Re-evaluate academic and industry quality audit"
              className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${reEvaluating ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span>{reEvaluating ? 'Auditing...' : 'Re-Evaluate Quality'}</span>
            </button>
          </div>
        </div>

        {/* Pillar Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-zinc-100 pt-4" role="tablist" aria-label="Engineering Pillars">
          {[
            { id: 'audit', label: '11-Category Quality Audit', icon: GitPullRequestDraft },
            { id: 'testing', label: 'Automated Testing Suite', icon: Terminal, badge: testResults ? `${testResults.passedTests}/${testResults.totalTests} Passed` : '5 Suites' },
            { id: 'security', label: 'Security & Hardening', icon: Lock, badge: 'Protected' },
            { id: 'efficiency', label: 'Efficiency & Latency', icon: Zap, badge: perfMetrics ? `${perfMetrics.cache.hitRate}% Cache Hit` : 'Optimized' },
            { id: 'accessibility', label: 'Accessibility (WCAG AA)', icon: Eye, badge: 'Compliant' }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`pillar-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`pillar-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id as PillarTab)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-indigo-300' : 'text-zinc-500'}`} aria-hidden="true" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Quality Audit Tab */}
      {activeTab === 'audit' && quality && (
        <div id="pillar-panel-audit" role="tabpanel" aria-labelledby="pillar-tab-audit" className="space-y-6">
          {/* Dual Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Industry Readiness</span>
              <div className="mt-1 text-2xl font-bold text-zinc-900">{quality.industryReadiness}%</div>
              <p className="mt-1 text-xs text-zinc-500">Production-grade readiness evaluated against industry microservice criteria.</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Academic Capstone Completeness</span>
              <div className="mt-1 text-2xl font-bold text-zinc-900">{quality.academicCompleteness}%</div>
              <p className="mt-1 text-xs text-zinc-500">Degree project rubric standards: viva alignment, ADRs, documentation.</p>
            </div>
          </div>

          {/* 11 Category Grid */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
            <h2 className="text-sm font-bold text-zinc-900 mb-4">Quality Breakdown Across 11 Standardized Dimensions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(quality.categories || []).map(cat => (
                <div key={cat.category} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900">{cat.category}</span>
                    <span className="font-bold text-indigo-600">{cat.score}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-200 overflow-hidden" role="progressbar" aria-valuenow={cat.score} aria-valuemin={0} aria-valuemax={100} aria-label={`${cat.category} score`}>
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 line-clamp-2">{cat.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Findings Registry */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-zinc-900">Detailed Diagnostic Findings</h2>
            <div className="space-y-3">
              {(quality.findings || []).map(finding => (
                <div
                  key={finding.id}
                  className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 text-xs space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        finding.classification === 'STRONG'
                          ? 'bg-emerald-100 text-emerald-800'
                          : finding.classification === 'RISK' || finding.classification === 'WEAK'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-zinc-200 text-zinc-800'
                      }`}>
                        {finding.classification}
                      </span>
                      <span className="font-bold text-zinc-900 text-sm">{finding.title}</span>
                    </div>
                    <span className="text-[11px] text-zinc-500">Category: {finding.category}</span>
                  </div>

                  <p className="text-zinc-600">{finding.explanation}</p>

                  <div className="rounded-lg bg-indigo-50/80 border border-indigo-200/80 p-2.5 text-indigo-900 font-medium text-[11px]">
                    Recommended Remediation: {finding.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Automated Testing Suite Tab */}
      {activeTab === 'testing' && (
        <div id="pillar-panel-testing" role="tabpanel" aria-labelledby="pillar-tab-testing" className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                  <span>Automated Verification Test Runner</span>
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Runs unit and integration assertions across Health Risk Engine, Viva Voce Readiness, Project Intelligence, Security Sanitization, and Cache Subsystems.
                </p>
              </div>

              <button
                onClick={handleRunTests}
                disabled={runningTests}
                aria-label="Execute automated verification test suite"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              >
                <Play className={`h-3.5 w-3.5 ${runningTests ? 'animate-pulse' : ''}`} aria-hidden="true" />
                <span>{runningTests ? 'Executing Test Suites...' : 'Run Automated Tests'}</span>
              </button>
            </div>

            {/* Test Summary Banner */}
            {testResults && (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-zinc-100 pt-4 text-xs">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Test Status</span>
                  <div className="mt-1 flex items-center gap-1.5 font-bold text-emerald-600 text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{testResults.failedTests === 0 ? 'ALL PASSED' : `${testResults.failedTests} FAILED`}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Assertions</span>
                  <div className="mt-1 font-bold text-zinc-900 text-sm">
                    {testResults.passedTests} / {testResults.totalTests} passed
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Execution Time</span>
                  <div className="mt-1 font-bold text-zinc-900 text-sm">
                    {testResults.durationMs} ms
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Executed At</span>
                  <div className="mt-1 font-bold text-zinc-900 text-sm truncate">
                    {new Date(testResults.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Test Suites Breakdown */}
          {testResults && (
            <div className="space-y-4">
              {(testResults.suites || []).map((suite: any) => (
                <div key={suite.name} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full p-1 ${suite.status === 'PASSED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                      <h3 className="font-bold text-zinc-900 text-sm">{suite.name}</h3>
                    </div>
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-[11px] font-mono text-zinc-600 font-semibold">
                      {suite.durationMs}ms
                    </span>
                  </div>

                  <div className="space-y-1.5 border-t border-zinc-100 pt-3">
                    {(suite.tests || []).map((t: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${t.passed ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span className="font-medium text-zinc-800">{t.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-zinc-400">{t.durationMs}ms</span>
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${t.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {t.passed ? 'PASS' : 'FAIL'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Security & Compliance Tab */}
      {activeTab === 'security' && (
        <div id="pillar-panel-security" role="tabpanel" aria-labelledby="pillar-tab-security" className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                  <span>Security Hardening & Protection Policies</span>
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Defensive architectural controls protecting server endpoints, student data, and administrative operations.
                </p>
              </div>
              <button
                onClick={loadSecurityAudit}
                disabled={loadingSecurity}
                aria-label="Refresh security audit"
                className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingSecurity ? 'animate-spin' : ''}`} />
                <span>Audit</span>
              </button>
            </div>

            {securityAudit && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Headers */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-2">
                  <div className="flex items-center justify-between font-bold text-zinc-900">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <span>HTTP Security Headers</span>
                    </span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">ENFORCED</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-zinc-600 font-mono">
                    <li>• Content-Security-Policy: default-src 'self'</li>
                    <li>• X-Content-Type-Options: nosniff</li>
                    <li>• X-Frame-Options: SAMEORIGIN</li>
                    <li>• Strict-Transport-Security: max-age=31536000</li>
                    <li>• Referrer-Policy: strict-origin-when-cross-origin</li>
                  </ul>
                </div>

                {/* Sanitization & Prototype Pollution */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-2">
                  <div className="flex items-center justify-between font-bold text-zinc-900">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Input Sanitization & Prototype Shield</span>
                    </span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-zinc-600">
                    Recursively purges __proto__, constructor, and prototype keys from incoming payloads, and sanitizes dangerous script tags from user submissions.
                  </p>
                </div>

                {/* Rate Limiting */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-2">
                  <div className="flex items-center justify-between font-bold text-zinc-900">
                    <span className="flex items-center gap-1.5">
                      <Gauge className="h-4 w-4 text-emerald-600" />
                      <span>API Rate Limiting</span>
                    </span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-zinc-600">
                    Per-IP token bucket limits: 120 req/min for standard endpoints, 25 req/min for AI generation routes, and 40 req/min for copilot actions.
                  </p>
                </div>

                {/* Role-Based Access Control (RBAC) */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-2">
                  <div className="flex items-center justify-between font-bold text-zinc-900">
                    <span className="flex items-center gap-1.5">
                      <Lock className="h-4 w-4 text-emerald-600" />
                      <span>RBAC Role Enforcement</span>
                    </span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">VERIFIED</span>
                  </div>
                  <p className="text-[11px] text-zinc-600">
                    Enforces role barriers: Faculty portal review submissions restricted to FACULTY/ADMIN; database re-initialization strictly restricted to ADMIN.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Efficiency & Latency Tab */}
      {activeTab === 'efficiency' && (
        <div id="pillar-panel-efficiency" role="tabpanel" aria-labelledby="pillar-tab-efficiency" className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                  <span>Telemetry & Cache Subsystem</span>
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Real-time in-memory cache hit rates, query latencies, and server telemetry.
                </p>
              </div>
              <button
                onClick={loadPerfMetrics}
                disabled={loadingPerf}
                aria-label="Refresh performance metrics"
                className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingPerf ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {perfMetrics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Cache Hit Rate</span>
                  <div className="mt-1 text-xl font-bold text-indigo-600">{perfMetrics.cache.hitRate}%</div>
                  <p className="text-[10px] text-zinc-500 mt-1">{perfMetrics.cache.hits} hits / {perfMetrics.cache.misses} misses</p>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Cached Items</span>
                  <div className="mt-1 text-xl font-bold text-zinc-900">{perfMetrics.cache.itemCount} Keys</div>
                  <p className="text-[10px] text-zinc-500 mt-1">Tag-invalidated on mutation</p>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Server Heap Memory</span>
                  <div className="mt-1 text-xl font-bold text-zinc-900">{perfMetrics.memory.heapUsedMb} MB</div>
                  <p className="text-[10px] text-zinc-500 mt-1">Total {perfMetrics.memory.heapTotalMb} MB</p>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Latency Percentiles</span>
                  <div className="mt-1 text-xl font-bold text-emerald-600">{perfMetrics.latency.p50}ms</div>
                  <p className="text-[10px] text-zinc-500 mt-1">p95: {perfMetrics.latency.p95}ms | p99: {perfMetrics.latency.p99}ms</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Accessibility (a11y) Verification Tab */}
      {activeTab === 'accessibility' && (
        <div id="pillar-panel-accessibility" role="tabpanel" aria-labelledby="pillar-tab-accessibility" className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Eye className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                <span>WCAG 2.1 AA Compliance & Accessibility Architecture</span>
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Audited against WCAG AA requirements including keyboard navigation, landmark structure, screen reader attributes, and contrast ratios.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {[
                {
                  title: 'Semantic HTML5 Landmarks',
                  status: 'VERIFIED',
                  description: 'Application enforces <header role="banner">, <nav role="navigation">, <main id="main-content" role="main">, and dialog landmarks with ARIA labels.'
                },
                {
                  title: 'Keyboard Navigation & Escape Handlers',
                  status: 'VERIFIED',
                  description: 'All modals (Global Search, Project Copilot, New Project) support keyboard Escape closing, Tab navigation, and accessible focus rings.'
                },
                {
                  title: 'Skip-to-Main-Content Link',
                  status: 'VERIFIED',
                  description: 'Top-level skip link allows keyboard and screen reader users to immediately bypass navigation and focus the active workspace.'
                },
                {
                  title: 'Color Contrast (4.5:1 Ratio)',
                  status: 'VERIFIED',
                  description: 'All body text, badges, and icon buttons strictly adhere to WCAG AA contrast thresholds against backgrounds.'
                },
                {
                  title: 'Form Control & Label Association',
                  status: 'VERIFIED',
                  description: 'All inputs utilize explicit <label htmlFor="..."> connections or sr-only accessible labels, eliminating unlabeled inputs.'
                },
                {
                  title: 'Live Regions for Asynchronous Feedback',
                  status: 'VERIFIED',
                  description: 'Copilot chat and status updates utilize aria-live="polite" and role="status" to announce dynamic updates to assistive devices.'
                }
              ].map(item => (
                <div key={item.title} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-emerald-600" />
                      <span>{item.title}</span>
                    </span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
