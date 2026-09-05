import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  GraduationCap,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { api } from '../../api.js';
import { Project } from '../../types/index.js';

interface IdeationViewProps {
  onProjectCreated: (project: Project) => void;
}

export const IdeationView: React.FC<IdeationViewProps> = ({ onProjectCreated }) => {
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [skills, setSkills] = useState('React, TypeScript, Python, PyTorch, Node.js, TimescaleDB');
  const [interests, setInterests] = useState('Edge AI, Health Informatics, Low-Latency WebSockets');
  const [careerGoals, setCareerGoals] = useState('AI Systems Engineer / Full-Stack Architect');
  const [teamSize, setTeamSize] = useState(2);
  const [durationWeeks, setDurationWeeks] = useState(16);

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [responseMeta, setResponseMeta] = useState<any>(null);
  const [adoptingIndex, setAdoptingIndex] = useState<number | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await api.recommendProjectIdeas({
        department,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: interests.split(',').map(s => s.trim()).filter(Boolean),
        careerGoals: careerGoals.split(',').map(s => s.trim()).filter(Boolean),
        teamSize,
        durationWeeks
      });

      setRecommendations(res?.recommendations || []);
      setResponseMeta(res?.meta || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptIdea = async (idea: any, index: number) => {
    setAdoptingIndex(index);
    try {
      const res = await api.createProject({
        title: idea.title,
        category: idea.category,
        domain: idea.domain,
        abstract: idea.solution,
        problemStatement: idea.problem,
        technologies: idea.technologies,
        durationWeeks: idea.estimatedDurationWeeks || 16,
        targetUsers: idea.targetUsers
      });
      onProjectCreated(res.project);
    } catch (err) {
      console.error(err);
    } finally {
      setAdoptingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <span>Stage 1: Ideation & Recommendations</span>
        </div>
        <h1 className="text-xl font-bold text-zinc-900">AI Project Idea & Recommendation Engine</h1>
        <p className="mt-1 text-xs text-zinc-500 max-w-3xl">
          Generates academic-grade capstone recommendations tailored to your team's skillset, duration, and faculty viva standards.
        </p>
      </div>

      {/* Input Parameters Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Department / Branch</label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Team Size & Semester Weeks</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={teamSize}
                  onChange={e => setTeamSize(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 text-xs"
                />
                <input
                  type="number"
                  min={8}
                  max={32}
                  value={durationWeeks}
                  onChange={e => setDurationWeeks(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                Student & Team Skills (comma separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder="e.g. React, Python, Docker"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                Domain Interests & Passions
              </label>
              <input
                type="text"
                value={interests}
                onChange={e => setInterests(e.target.value)}
                placeholder="e.g. Healthcare, Edge Computing"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Grounded in final-year accreditation benchmarks (ABET & NBA guidelines)</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 disabled:opacity-50 transition"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>{loading ? 'Synthesizing Academic Projects...' : 'Generate Project Recommendations'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Provider attribution banner */}
      {responseMeta && (
        <div className="flex items-center justify-between rounded-xl bg-zinc-100 px-4 py-2 text-[11px] text-zinc-600">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-indigo-600" />
            <span>Generated using <strong>{responseMeta.model}</strong> ({responseMeta.provider}) in {responseMeta.durationMs}ms</span>
          </div>
          <span>Est. Tokens: ~{responseMeta.tokensEstimate}</span>
        </div>
      )}

      {/* Recommendations List */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-zinc-900">
            Top Ranked Capstone Recommendations ({recommendations.length})
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {(recommendations || []).map((idea, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4 transition hover:border-zinc-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="rounded-md bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                        {idea.category}
                      </span>
                      <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                        {idea.difficulty}
                      </span>
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        {idea.matchScore}% Match
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-zinc-900">{idea.title}</h3>
                    <p className="mt-1 text-xs text-zinc-600">{idea.solution}</p>
                  </div>

                  <button
                    onClick={() => handleAdoptIdea(idea, idx)}
                    disabled={adoptingIndex === idx}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition shrink-0 disabled:opacity-50"
                  >
                    <span>{adoptingIndex === idx ? 'Initializing...' : 'Adopt & Start Project'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Core Features & Problem */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3.5">
                    <span className="font-semibold text-zinc-900 block mb-1">Academic & Technical Rigor:</span>
                    <p className="text-zinc-600">{idea.academicValue}</p>
                    <div className="mt-2 text-[11px] text-indigo-700 font-medium">
                      Match Rationale: {idea.whyItMatches}
                    </div>
                  </div>

                  <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3.5">
                    <span className="font-semibold text-zinc-900 block mb-1">Core MVP Deliverables:</span>
                    <ul className="space-y-1 text-zinc-600">
                      {(idea.coreFeatures || []).map((f: string, fIdx: number) => (
                        <li key={fIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tech Badges & Risks */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-100 pt-3 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-zinc-500 font-medium mr-1 text-[11px]">Stack:</span>
                    {(idea.technologies || []).map((t: string) => (
                      <span key={t} className="rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700">
                        {t}
                      </span>
                    ))}
                  </div>

                  {idea.majorRisks && idea.majorRisks.length > 0 && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-700">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span>Viva Risk: {idea.majorRisks[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
