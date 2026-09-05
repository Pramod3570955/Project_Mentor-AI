import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, Layers, Target, Clock, ShieldCheck } from 'lucide-react';
import { api } from '../api.js';
import { Project } from '../types/index.js';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Applied Artificial Intelligence & Systems');
  const [domain, setDomain] = useState('Healthcare & Computer Systems');
  const [problemStatement, setProblemStatement] = useState('');
  const [abstract, setAbstract] = useState('');
  const [technologiesInput, setTechnologiesInput] = useState('React, TypeScript, Node.js, TimescaleDB, Python');
  const [durationWeeks, setDurationWeeks] = useState(16);

  // Handle escape key
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    try {
      const techs = technologiesInput.split(',').map(t => t.trim()).filter(Boolean);
      const res = await api.createProject({
        title,
        category,
        domain,
        problemStatement,
        abstract: abstract || problemStatement,
        technologies: techs,
        durationWeeks
      });

      onProjectCreated(res.project);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset: {
    title: string;
    category: string;
    domain: string;
    problem: string;
    technologies: string;
  }) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setDomain(preset.domain);
    setProblemStatement(preset.problem);
    setAbstract(preset.problem);
    setTechnologiesInput(preset.technologies);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 bg-zinc-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Layers className="h-4 w-4 text-indigo-300" aria-hidden="true" />
            </div>
            <div>
              <h2 id="new-project-title" className="text-sm font-semibold">Initialize Capstone Project Workspace</h2>
              <p className="text-xs text-zinc-400">Auto-scaffolds Blueprint, Feasibility, Roadmap & Tasks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close project initialization dialog"
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preset suggestions banner */}
        <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-3">
          <div className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-2">
            Auto-Fill Academic Capstone Presets:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                handleApplyPreset({
                  title: 'SafeRoute AI: Urban Accident Blackspot Warning System',
                  category: 'Applied Machine Learning & Smart Cities',
                  domain: 'Computer Vision & Geospatial Analytics',
                  problem: 'Urban traffic cameras stream data continuously but collisions are detected reactively. This project runs spatio-temporal near-miss detection on edge CCTV feeds with automated webhook emergency dispatch.',
                  technologies: 'Python, PyTorch, FastAPI, OpenCV, React, PostgreSQL, PostGIS'
                })
              }
              className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              SafeRoute AI (Computer Vision)
            </button>
            <button
              type="button"
              onClick={() =>
                handleApplyPreset({
                  title: 'VeriMed: Zero-Knowledge Clinical Trial Audit Trail',
                  category: 'Cybersecurity & Health Informatics',
                  domain: 'Distributed Systems & Applied Cryptography',
                  problem: 'Clinical research trials face fraud and retrospective data alterations. VeriMed creates an immutable zero-knowledge proof audit trail on symptoms without revealing patient PII.',
                  technologies: 'TypeScript, Rust, Express, React, PostgreSQL, Circom'
                })
              }
              className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              VeriMed (Zero-Knowledge Cryptography)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label htmlFor="proj-title-input" className="block font-semibold text-zinc-700 mb-1">
              Project Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="proj-title-input"
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Autonomous Solar IoT Water Quality Sentinel"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="proj-category-input" className="block font-semibold text-zinc-700 mb-1">Category</label>
              <input
                id="proj-category-input"
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label htmlFor="proj-domain-input" className="block font-semibold text-zinc-700 mb-1">Domain</label>
              <input
                id="proj-domain-input"
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label htmlFor="proj-problem-input" className="block font-semibold text-zinc-700 mb-1">Problem Statement & Scope</label>
            <textarea
              id="proj-problem-input"
              rows={3}
              value={problemStatement}
              onChange={e => {
                setProblemStatement(e.target.value);
                setAbstract(e.target.value);
              }}
              placeholder="Describe the clinical or engineering problem, why existing solutions fall short, and what your capstone system provides..."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="proj-technologies-input" className="block font-semibold text-zinc-700 mb-1">Technologies (comma separated)</label>
              <input
                id="proj-technologies-input"
                type="text"
                value={technologiesInput}
                onChange={e => setTechnologiesInput(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label htmlFor="proj-duration-input" className="block font-semibold text-zinc-700 mb-1">Estimated Duration (Weeks)</label>
              <input
                id="proj-duration-input"
                type="number"
                min={4}
                max={52}
                value={durationWeeks}
                onChange={e => setDurationWeeks(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-[11px] text-indigo-900">
            <div className="flex items-center gap-1.5 font-semibold text-indigo-950 mb-1">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
              <span>Automatic Academic Architecture Scaffolding</span>
            </div>
            <p className="text-zinc-600">
              Upon creation, ProjectMentor AI will generate your initial <strong>Project Blueprint</strong>, <strong>Feasibility Matrix</strong>, <strong>Phase 1 Roadmap</strong> with acceptance criteria, and seed the <strong>Project Intelligence RAG Index</strong>.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{loading ? 'Scaffolding System...' : 'Create & Initialize Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
