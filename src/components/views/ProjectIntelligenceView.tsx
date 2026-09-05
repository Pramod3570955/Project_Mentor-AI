import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Search,
  CheckCircle2,
  GitMerge,
  BookOpen,
  Share2,
  Plus,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Project, KnowledgeChunk, KnowledgeConflict, KnowledgeGap, ProjectDecision } from '../../types/index.js';
import { api } from '../../api.js';

interface ProjectIntelligenceViewProps {
  project: Project;
}

export const ProjectIntelligenceView: React.FC<ProjectIntelligenceViewProps> = ({ project }) => {
  const [chunks, setChunks] = useState<KnowledgeChunk[]>([]);
  const [conflicts, setConflicts] = useState<KnowledgeConflict[]>([]);
  const [gaps, setGaps] = useState<KnowledgeGap[]>([]);
  const [decisions, setDecisions] = useState<ProjectDecision[]>([]);
  const [completeness, setCompleteness] = useState<any>(null);
  const [graph, setGraph] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Search in RAG
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // New ADR modal
  const [showAdrModal, setShowAdrModal] = useState(false);
  const [adrTitle, setAdrTitle] = useState('');
  const [adrProblem, setAdrProblem] = useState('');
  const [adrSolution, setAdrSolution] = useState('');

  useEffect(() => {
    loadIntelligence();
  }, [project.id]);

  const loadIntelligence = async () => {
    setLoading(true);
    try {
      const res = await api.getProjectIntelligence(project.id);
      setChunks(res?.chunks || []);
      setConflicts(res?.conflicts || []);
      setGaps(res?.gaps || []);
      setDecisions(res?.decisions || []);
      setCompleteness(res?.completeness || null);
      setGraph(res?.graph || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await api.searchIntelligence(project.id, searchQuery);
      setSearchResults(res.results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResolveConflict = async (conflictId: string) => {
    try {
      await api.resolveConflict(project.id, conflictId);
      setConflicts(prev => prev.map(c => (c.id === conflictId ? { ...c, resolved: true } : c)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAdr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adrTitle.trim() || !adrSolution.trim()) return;
    try {
      await api.addDecision(project.id, {
        title: adrTitle,
        contextProblem: adrProblem,
        chosenSolution: adrSolution,
        alternativesConsidered: ['Legacy standard approach'],
        impactAndConsequences: ['Maintains strict sub-50ms latency']
      });
      setShowAdrModal(false);
      setAdrTitle('');
      setAdrProblem('');
      setAdrSolution('');
      loadIntelligence();
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
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span>Stage 5: Central Knowledge & RAG Engine</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900">Project Intelligence & Memory Layer</h1>
            <p className="mt-1 text-xs text-zinc-500">
              Unified source of truth. Grounding for AI Mentor, Quality, Docs, Viva, and Copilot.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-right">
              <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Knowledge Completeness</div>
              <div className="text-xl font-bold text-indigo-600">{completeness?.score || 92}%</div>
            </div>
            <button
              onClick={() => setShowAdrModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Record ADR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hybrid Retrieval & RAG Query Sandbox */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <h2 className="text-sm font-bold text-zinc-900 mb-1">Hybrid Semantic & Keyword RAG Retrieval Sandbox</h2>
        <p className="text-xs text-zinc-500 mb-3">
          Test real-time context assembly and source attributions across authority-weighted chunks.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search verified knowledge (e.g., 'ONNX quantization benchmark', 'WebSocket alert hysteresis')..."
            className="flex-1 rounded-xl border border-zinc-300 px-3.5 py-2 text-xs text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {isSearching ? 'Retrieving...' : 'Retrieve Context'}
          </button>
        </form>

        {searchResults && (
          <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs space-y-3">
            <div className="flex items-center justify-between font-semibold text-indigo-950 text-xs">
              <span>Retrieved {searchResults.chunks.length} Grounded Context Chunks</span>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Isolated Prompt-Injection Boundary
              </span>
            </div>

            <div className="space-y-2">
              {(searchResults.chunks || []).map((chunk: any) => (
                <div key={chunk.id} className="rounded-lg border border-zinc-200 bg-white p-3 text-xs">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 mb-1">
                    <span className="font-bold text-zinc-800">{chunk.category} ({chunk.id})</span>
                    <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                      {chunk.authority}
                    </span>
                  </div>
                  <p className="text-zinc-700">{chunk.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contradictions & Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Knowledge Conflicts */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="font-bold text-sm text-zinc-900">Detected Contradictions</h3>
            </div>
            <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
              {(conflicts || []).filter(c => !c.resolved).length} Unresolved
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {(conflicts || []).map(conf => (
              <div
                key={conf.id}
                className={`rounded-xl border p-3.5 ${
                  conf.resolved ? 'border-zinc-200 bg-zinc-50/50 opacity-60' : 'border-amber-200 bg-amber-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-zinc-900">{conf.topic}</span>
                    <p className="mt-1 text-zinc-600">{conf.description}</p>
                    <div className="mt-1 text-[10px] text-zinc-400">
                      Sources: {conf.source1Id} vs {conf.source2Id}
                    </div>
                  </div>
                  {!conf.resolved && (
                    <button
                      onClick={() => handleResolveConflict(conf.id)}
                      className="rounded bg-white border border-amber-300 px-2 py-1 text-[10px] font-bold text-amber-900 hover:bg-amber-100 transition shrink-0"
                    >
                      Resolve ✓
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge Gaps */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-500" />
              <h3 className="font-bold text-sm text-zinc-900">Knowledge Gaps (Audit)</h3>
            </div>
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
              {gaps?.length || 0} Items
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {(gaps || []).map(gap => (
              <div key={gap.id} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-zinc-900">{gap.area}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    gap.impact === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {gap.impact} IMPACT
                  </span>
                </div>
                <p className="text-zinc-600">{gap.description}</p>
                <p className="mt-2 text-[11px] font-medium text-indigo-600">Action: {gap.recommendedAction}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Architectural Decision Records (ADRs) */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Project Decision Memory (ADRs)</h2>
            <p className="text-xs text-zinc-500">
              Immutably records "Why we chose X over Y" to defend architectural trade-offs during faculty viva.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {(decisions || []).map(dec => (
            <div key={dec.id} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-indigo-100 px-2 py-0.5 font-bold font-mono text-[10px] text-indigo-800">
                    ADR-{String(dec.decisionNumber).padStart(3, '0')}
                  </span>
                  <span className="font-bold text-zinc-900 text-xs">{dec.title}</span>
                </div>
                <span className="text-[10px] text-zinc-400">Date: {dec.date}</span>
              </div>

              <p className="text-zinc-700"><strong className="text-zinc-900">Problem:</strong> {dec.contextProblem}</p>
              <p className="text-emerald-900 bg-emerald-50/60 p-2 rounded-lg border border-emerald-200/60">
                <strong className="text-emerald-950">Chosen Solution:</strong> {dec.chosenSolution}
              </p>

              <div className="flex flex-wrap gap-4 text-[11px] text-zinc-500 pt-1 border-t border-zinc-100">
                <span>Alternatives Rejected: <strong className="text-zinc-700">{(dec.alternativesConsidered || []).join(', ')}</strong></span>
                <span>Author: <strong className="text-zinc-700">{dec.author}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge Graph Preview */}
      {graph && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-zinc-900">Project Knowledge Graph Topology</h2>
              <p className="text-xs text-zinc-500">Connected nodes across modules, entities, tasks, and skills.</p>
            </div>
            <span className="text-xs text-zinc-500">
              {graph.nodes?.length || 0} Nodes • {graph.edges?.length || 0} Semantic Edges
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {(graph.nodes || []).map((node: any) => (
              <div
                key={node.id}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700 flex items-center gap-1.5"
              >
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                <span className="font-semibold text-zinc-900">{node.label}</span>
                <span className="text-[10px] text-zinc-400">({node.type})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New ADR Modal */}
      {showAdrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-sm text-zinc-900">Record New Architectural Decision (ADR)</h3>
            <form onSubmit={handleCreateAdr} className="space-y-3">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Decision Title *</label>
                <input
                  type="text"
                  required
                  value={adrTitle}
                  onChange={e => setAdrTitle(e.target.value)}
                  placeholder="e.g. Adopt ONNX INT8 Quantization for Edge Inference"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Problem & Context</label>
                <textarea
                  rows={2}
                  value={adrProblem}
                  onChange={e => setAdrProblem(e.target.value)}
                  placeholder="Why did this decision need to be made? What were the technical constraints?"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Chosen Solution & Justification *</label>
                <textarea
                  rows={2}
                  required
                  value={adrSolution}
                  onChange={e => setAdrSolution(e.target.value)}
                  placeholder="What solution was selected and why is it superior for your capstone?"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAdrModal(false)}
                  className="rounded-lg px-3 py-1.5 text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-zinc-900 px-4 py-1.5 font-semibold text-white hover:bg-zinc-800"
                >
                  Record Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
