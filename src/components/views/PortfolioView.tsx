import React, { useState, useEffect } from 'react';
import {
  Globe,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Github,
  Award,
  Share2,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { Project, PortfolioShowcase } from '../../types/index.js';
import { api } from '../../api.js';

interface PortfolioViewProps {
  project: Project;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ project }) => {
  const [portfolio, setPortfolio] = useState<PortfolioShowcase | null>(null);
  const [readiness, setReadiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadPortfolio();
  }, [project.id]);

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const [pRes, rRes] = await Promise.all([
        api.getPortfolio(project.id),
        api.getProjectReadiness(project.id)
      ]);
      setPortfolio(pRes?.portfolio || null);
      setReadiness(rRes?.readiness || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublic = async () => {
    if (!portfolio) return;
    try {
      const updated = { ...portfolio, isPublic: !portfolio.isPublic };
      await api.updatePortfolio(project.id, updated);
      setPortfolio(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `/portfolio/${project.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!portfolio) {
    return <div className="p-12 text-center text-xs text-zinc-500">Loading portfolio showcase...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <Globe className="h-4 w-4 text-emerald-600" />
              <span>Stage 12: Showcase & Capstone Completion</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900">Portfolio Showcase & Submission Gate</h1>
            <p className="mt-1 text-xs text-zinc-500">
              Verified public profile for employers, graduate school admissions, and conference submissions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePublic}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                portfolio.isPublic
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'border border-zinc-300 bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {portfolio.isPublic ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
              <span>{portfolio.isPublic ? 'Public Showcase Active' : 'Private Mode'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share Portfolio'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submission Readiness Gate */}
      {readiness && (
        <div className={`rounded-2xl border p-5 ${
          readiness.isEligibleForSubmission
            ? 'border-emerald-200 bg-emerald-50/50 text-emerald-950'
            : 'border-amber-200 bg-amber-50/40 text-amber-950'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-sm">
                Capstone Submission Eligibility: {readiness.isEligibleForSubmission ? 'ELIGIBLE' : 'PENDING REQUIREMENTS'}
              </h3>
            </div>
            <span className="font-bold text-sm">Readiness Score: {readiness.overallScore}/100</span>
          </div>

          {readiness.missingCriteria && readiness.missingCriteria.length > 0 && (
            <div className="mt-3 text-xs text-amber-900">
              <div className="font-semibold mb-1">Items to resolve prior to academic sign-off:</div>
              <ul className="space-y-1">
                {(readiness.missingCriteria || []).map((c: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="font-bold text-amber-700">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Portfolio Showcase Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xs space-y-6">
        <div className="border-b border-zinc-100 pb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="rounded-md bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
              {project.category}
            </span>
            <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>Empirically Verified Capstone</span>
            </span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900">{portfolio.title}</h2>
          <p className="text-sm text-zinc-600 mt-1 max-w-2xl">{portfolio.tagline}</p>
        </div>

        {/* Highlight Metrics */}
        <div>
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Empirical Benchmarks</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(portfolio.highlightMetrics || []).map(m => (
              <div key={m.label} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-center">
                <div className="text-2xl font-extrabold text-indigo-600">{m.value}</div>
                <div className="text-xs text-zinc-600 mt-1 font-medium">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 space-y-2">
            <h4 className="font-bold text-zinc-900 text-sm">Problem Addressed</h4>
            <p className="text-zinc-700 leading-relaxed">{portfolio.problemAddressed}</p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 space-y-2">
            <h4 className="font-bold text-zinc-900 text-sm">Engineered Solution</h4>
            <p className="text-zinc-700 leading-relaxed">{portfolio.solutionEngineered}</p>
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Technologies Utilized</h3>
          <div className="flex flex-wrap gap-2">
            {(project.technologies || []).map(t => (
              <span key={t} className="rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-800">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Faculty Guide Endorsement */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 text-xs text-blue-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-blue-900">
            <Award className="h-4 w-4 text-blue-600" />
            <span>Faculty Guide Endorsement Snippet</span>
          </div>
          <p className="italic text-zinc-700">"{portfolio.facultyReviewSnippet}"</p>
          <div className="font-semibold text-zinc-900 pt-1">
            — {project.facultyGuideName}, Department of Computer Science & Engineering
          </div>
        </div>
      </div>
    </div>
  );
};
