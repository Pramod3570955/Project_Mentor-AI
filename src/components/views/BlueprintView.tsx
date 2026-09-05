import React, { useState, useEffect } from 'react';
import {
  FileCode2,
  Download,
  CheckCircle2,
  Layers,
  Database,
  Globe,
  ShieldCheck,
  Cpu,
  Server,
  Share2,
  FileDown
} from 'lucide-react';
import { Project, ProjectBlueprint } from '../../types/index.js';
import { api } from '../../api.js';

interface BlueprintViewProps {
  project: Project;
}

export const BlueprintView: React.FC<BlueprintViewProps> = ({ project }) => {
  const [blueprint, setBlueprint] = useState<ProjectBlueprint | null>(null);
  const [activeTab, setActiveTab] = useState<'architecture' | 'modules' | 'database' | 'api' | 'security'>('architecture');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlueprint();
  }, [project.id]);

  const loadBlueprint = async () => {
    setLoading(true);
    try {
      const res = await api.getBlueprint(project.id);
      setBlueprint(res?.blueprint || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportJson = () => {
    if (!blueprint) return;
    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}_Blueprint_v${blueprint.version}.json`;
    a.click();
  };

  const handleExportMarkdown = () => {
    if (!blueprint) return;
    const md = `# Project Technical Blueprint: ${project.title}
Version: ${blueprint.version} | Status: ${blueprint.status} | Updated: ${blueprint.updatedAt}

## 1. Abstract
${blueprint.abstract}

## 2. Problem Statement
${blueprint.problemStatement}

## 3. Proposed System Architecture
${blueprint.proposedSystemArchitecture}

## 4. Technology Stack Justification
${blueprint.technologyStack.map(t => `- **${t.layer}**: ${t.technology} — *${t.reason}*`).join('\n')}

## 5. Subsystem Modules
${blueprint.modules.map(m => `### ${m.name}\n${m.description}\n- Technologies: ${m.technologies.join(', ')}\n- Key Features: ${m.keyFeatures.join(', ')}`).join('\n\n')}

## 6. Database Entities
${blueprint.databaseDesign.map(d => `### Entity: ${d.name}\n${d.description}\nFields:\n${d.fields.map(f => `- \`${f.name}\` (${f.type}) ${f.constraints || ''}`).join('\n')}`).join('\n\n')}

## 7. API Endpoints
${blueprint.apiEndpoints.map(a => `- **${a.method}** \`${a.path}\` — ${a.description} (Auth: ${a.authRequired ? 'Required' : 'Public'})`).join('\n')}

## 8. Security Architecture & Testing Strategy
${blueprint.securityMeasures.map(s => `- ${s}`).join('\n')}
`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}_Blueprint_v${blueprint.version}.md`;
    a.click();
  };

  if (!blueprint) {
    return <div className="p-12 text-center text-xs text-zinc-500">Loading blueprint...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <FileCode2 className="h-4 w-4 text-indigo-500" />
              <span>Stage 3: Technical Blueprint & System Specs</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900">Comprehensive Engineering Blueprint</h1>
            <p className="mt-1 text-xs text-zinc-500">
              Living system architecture specification, module dependencies, schemas, and API contracts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition"
            >
              <FileDown className="h-3.5 w-3.5" />
              <span>Export Markdown</span>
            </button>
          </div>
        </div>

        {/* Blueprint Metadata strip */}
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
          <span>Version: <strong className="text-zinc-800 font-mono">v{blueprint.version}</strong></span>
          <span>•</span>
          <span>Status: <span className="rounded bg-amber-100 px-2 py-0.5 font-bold text-amber-800 text-[10px]">{blueprint.status}</span></span>
          <span>•</span>
          <span>Modules: <strong className="text-zinc-800">{blueprint.modules?.length || 0}</strong></span>
          <span>•</span>
          <span>DB Entities: <strong className="text-zinc-800">{blueprint.databaseDesign?.length || 0}</strong></span>
          <span>•</span>
          <span>APIs: <strong className="text-zinc-800">{blueprint.apiEndpoints?.length || 0}</strong></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-zinc-200 pb-px text-xs font-semibold">
        {[
          { id: 'architecture', label: 'Architecture & Tech Stack', icon: Server },
          { id: 'modules', label: 'Subsystem Modules', icon: Layers },
          { id: 'database', label: 'Database Schema & Tables', icon: Database },
          { id: 'api', label: 'API Endpoint Specifications', icon: Globe },
          { id: 'security', label: 'Security & Testing Strategy', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
            <h2 className="text-sm font-bold text-zinc-900 mb-2">Proposed System Topology</h2>
            <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 border border-zinc-200 rounded-xl p-4 font-mono text-[11px]">
              {blueprint.proposedSystemArchitecture}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
            <h2 className="text-sm font-bold text-zinc-900 mb-4">Technology Stack Selection Rationale</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(blueprint.technologyStack || []).map(t => (
                <div key={t.layer} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 text-xs">
                  <div className="font-bold text-indigo-900 text-xs mb-1">{t.layer}</div>
                  <div className="text-zinc-900 font-mono text-sm font-semibold">{t.technology}</div>
                  <p className="mt-2 text-zinc-600 text-[11px] leading-relaxed">{t.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(blueprint.modules || []).map(mod => (
            <div key={mod.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900 text-sm">{mod.name}</span>
                <span className="font-mono text-[10px] text-zinc-400">{mod.id}</span>
              </div>
              <p className="text-zinc-600 leading-relaxed">{mod.description}</p>

              <div>
                <span className="font-semibold text-zinc-800 text-[11px] block mb-1">Key Subsystem Features:</span>
                <ul className="space-y-1 text-zinc-600">
                  {(mod.keyFeatures || []).map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-1 pt-2 border-t border-zinc-100">
                {(mod.technologies || []).map(t => (
                  <span key={t} className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'database' && (
        <div className="space-y-4">
          {(blueprint.databaseDesign || []).map(table => (
            <div key={table.name} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs text-xs">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-indigo-600" />
                <h3 className="font-bold text-zinc-900 font-mono text-sm">{table.name}</h3>
                <span className="text-zinc-500">— {table.description}</span>
              </div>

              <div className="overflow-x-auto mt-3">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold text-zinc-600">
                      <th className="py-2 px-3">Field Name</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Constraints</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-mono text-[11px]">
                    {(table.fields || []).map(f => (
                      <tr key={f.name}>
                        <td className="py-2 px-3 text-zinc-900 font-semibold">{f.name}</td>
                        <td className="py-2 px-3 text-indigo-600">{f.type}</td>
                        <td className="py-2 px-3 text-zinc-500">{f.constraints || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'api' && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
          <div className="divide-y divide-zinc-100 text-xs">
            {(blueprint.apiEndpoints || []).map((ep, idx) => (
              <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold font-mono ${
                    ep.method === 'GET' ? 'bg-blue-100 text-blue-800' : ep.method === 'POST' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-semibold text-zinc-900">{ep.path}</span>
                  <span className="text-zinc-500">{ep.description}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                  ep.authRequired ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {ep.authRequired ? 'Auth Bearer' : 'Public'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Security Architecture & HIPAA Controls</span>
            </h3>
            <ul className="space-y-2 text-zinc-700">
              {(blueprint.securityMeasures || []).map((sec, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{sec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-600" />
              <span>Automated Testing Strategy & Verification</span>
            </h3>
            <div className="space-y-2">
              {(blueprint.testingStrategy || []).map((t, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-zinc-200 bg-zinc-50">
                  <div className="flex justify-between font-semibold text-zinc-900">
                    <span>{t.type}</span>
                    <span className="text-indigo-600">{t.coverageTarget}</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">Tools: {(t.tools || []).join(', ')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
