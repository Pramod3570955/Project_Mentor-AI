import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import { api } from '../api.js';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onNavigate: (view: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  projectId,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await api.searchIntelligence(projectId, query);
      setResults(res.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-search-title"
      className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/60 p-4 pt-16 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-0 shadow-2xl overflow-hidden">
        <h2 id="global-search-title" className="sr-only">
          Global Project Knowledge Search
        </h2>
        {/* Search input header */}
        <form onSubmit={handleSearch} className="flex items-center border-b border-zinc-200 px-4 py-3">
          <label htmlFor="global-search-input" className="sr-only">
            Search Project Knowledge
          </label>
          <Search className="h-5 w-5 text-zinc-400 mr-3 shrink-0" aria-hidden="true" />
          <input
            id="global-search-input"
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tasks, blueprint modules, documents, ADRs, viva questions..."
            className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search dialog"
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </form>

        {/* Quick suggestions if query empty */}
        {!results && !loading && (
          <div className="p-5 text-xs text-zinc-500">
            <div className="font-semibold text-zinc-700 uppercase tracking-wider text-[11px] mb-2.5">
              Quick Searches in Project Knowledge
            </div>
            <div className="flex flex-wrap gap-2">
              {['PatchTST ONNX quantization', 'WebSocket alert hysteresis', 'TimescaleDB hypertable', 'ADR-001 Edge Gateway', 'Prof. Sarah Jenkins feedback'].map(term => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    api.searchIntelligence(projectId, term).then(r => setResults(r.results));
                  }}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300 transition"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-12 text-center text-xs text-zinc-500">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mb-2" />
            <p>Searching hybrid sparse-dense project index...</p>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="max-h-96 overflow-y-auto p-4 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-zinc-600 px-1">
              <span>{(results.chunks || []).length} Grounded Knowledge Chunks Retrieved</span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" /> Authority-Ranked
              </span>
            </div>

            {(results.chunks || []).map((chunk: any) => (
              <div
                key={chunk.id}
                className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 text-xs transition hover:bg-white hover:border-zinc-300"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-zinc-900">{chunk.category}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    chunk.authority === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : chunk.authority === 'APPROVED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-zinc-100 text-zinc-700'
                  }`}>
                    {chunk.authority}
                  </span>
                </div>
                <p className="text-zinc-700 leading-relaxed">{chunk.content}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(chunk.keywords || []).map((k: string) => (
                    <span key={k} className="rounded bg-white px-1.5 py-0.5 text-[10px] text-zinc-500 border border-zinc-200">
                      #{k}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-zinc-100 bg-zinc-50 px-4 py-2.5 text-[11px] text-zinc-600 flex justify-between rounded-b-2xl">
          <span>Press ESC to close</span>
          <button
            onClick={() => {
              onClose();
              onNavigate('intelligence');
            }}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <span>Open Full Project Intelligence & RAG Explorer</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
