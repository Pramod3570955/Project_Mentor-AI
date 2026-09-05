import React, { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  Cpu,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Server
} from 'lucide-react';
import { Project } from '../../types/index.js';
import { api } from '../../api.js';

interface AdminSettingsViewProps {
  project: Project;
  onResetDatabase: () => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  project,
  onResetDatabase
}) => {
  const [dbStats, setDbStats] = useState<any>(null);
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    loadStats();
  }, [project.id]);

  const loadStats = async () => {
    try {
      const stats = await api.getDbStats();
      setDbStats(stats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset database to clean academic initial state?')) return;
    setResetting(true);
    try {
      await api.resetDatabase();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
      loadStats();
      onResetDatabase();
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  const handleExportAll = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dbStats, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ProjectMentor_Archive_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          <Settings className="h-4 w-4 text-zinc-500" />
          <span>Stage 13: System & Institutional Administration</span>
        </div>
        <h1 className="text-xl font-bold text-zinc-900">Platform Settings & Database Diagnostics</h1>
        <p className="mt-1 text-xs text-zinc-500">
          Server-side health, memory state, AI provider routing, and project archiving.
        </p>
      </div>

      {/* AI Model Topology */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-indigo-600" />
          <span>AI Model Provider Topology</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Primary Model</span>
            <div className="text-sm font-bold text-zinc-900 mt-1">Gemini 3.8-Flash</div>
            <p className="text-[11px] text-zinc-500 mt-1">Configured server-side via `@google/genai`</p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">RAG Architecture</span>
            <div className="text-sm font-bold text-emerald-600 mt-1">Hybrid RAG + Knowledge Graph</div>
            <p className="text-[11px] text-zinc-500 mt-1">Grounded context assembly with chunk scoring</p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">API Key Safety</span>
            <div className="text-sm font-bold text-indigo-600 mt-1">Zero Browser Exposure</div>
            <p className="text-[11px] text-zinc-500 mt-1">100% proxied via `/api/*` Express endpoints</p>
          </div>
        </div>
      </div>

      {/* Memory Database Diagnostic Stats */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Database className="h-4 w-4 text-emerald-600" />
            <span>MemoryDatabase Live Entity Records</span>
          </h2>
          <button
            onClick={loadStats}
            className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-900"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Refresh Counts</span>
          </button>
        </div>

        {dbStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {Object.entries(dbStats).map(([key, count]) => (
              <div key={key} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <div className="text-lg font-bold text-zinc-900">{count as number}</div>
                <div className="text-[11px] text-zinc-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Maintenance Controls */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-zinc-900">Maintenance & Institutional Reset</h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-zinc-100 pt-4 text-xs">
          <div>
            <div className="font-semibold text-zinc-900">Export Institutional Database Archive</div>
            <div className="text-zinc-500 text-[11px]">Download JSON archive of active projects, tasks, and reviews.</div>
          </div>
          <button
            onClick={handleExportAll}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 font-semibold text-zinc-800 hover:bg-zinc-100 transition shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Archive</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-zinc-100 pt-4 text-xs">
          <div>
            <div className="font-semibold text-rose-700 flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
              <span>Reset Database & Reseed Defaults</span>
            </div>
            <div className="text-zinc-500 text-[11px]">
              Restores the default "Edge-AI Telemetry Platform" and baseline records.
            </div>
          </div>
          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700 disabled:opacity-50 transition shadow-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>{resetting ? 'Resetting...' : 'Reset & Reseed'}</span>
          </button>
        </div>

        {resetSuccess && (
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Database successfully re-seeded with capstone sample project.</span>
          </div>
        )}
      </div>
    </div>
  );
};
