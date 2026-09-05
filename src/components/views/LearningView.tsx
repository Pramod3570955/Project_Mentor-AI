import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Code,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Award
} from 'lucide-react';
import { Project, SkillGap, LearningModule } from '../../types/index.js';
import { api } from '../../api.js';

interface LearningViewProps {
  project: Project;
}

export const LearningView: React.FC<LearningViewProps> = ({ project }) => {
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [learningModules, setLearningModules] = useState<LearningModule[]>([]);
  const [activeModule, setActiveModule] = useState<LearningModule | null>(null);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, [project.id]);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const res = await api.getSkills(project.id);
      setSkillGaps(res?.skillGaps || []);
      setLearningModules(res?.learningModules || []);
      if (res?.learningModules && res.learningModules.length > 0) {
        setActiveModule(res.learningModules[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkModuleComplete = async (mod: LearningModule) => {
    try {
      await api.updateLearningModule(project.id, mod.id, { isCompleted: true, confidenceScore: 100 });
      setLearningModules(prev =>
        prev.map(m => (m.id === mod.id ? { ...m, isCompleted: true, confidenceScore: 100 } : m))
      );
      if (activeModule?.id === mod.id) {
        setActiveModule(prev => (prev ? { ...prev, isCompleted: true, confidenceScore: 100 } : null));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          <BookOpen className="h-4 w-4 text-indigo-500" />
          <span>Stage 6: Competency & Skill Engineering</span>
        </div>
        <h1 className="text-xl font-bold text-zinc-900">Skills Gap Triage & Capstone Learning Modules</h1>
        <p className="mt-1 text-xs text-zinc-500">
          Targeted micro-learning tailored to unblock specific tasks and defend engineering choices in viva voce.
        </p>
      </div>

      {/* Skill Gaps Registry */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <h2 className="text-sm font-bold text-zinc-900 mb-3">Identified Project Skill Gaps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(skillGaps || []).map(gap => (
            <div
              key={gap.id}
              className={`rounded-xl border p-4 text-xs ${
                gap.isBlocking ? 'border-rose-200 bg-rose-50/40' : 'border-zinc-200 bg-zinc-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-bold text-zinc-900 text-sm">{gap.skillName}</span>
                  <div className="text-[11px] text-zinc-500 mt-0.5">Category: {gap.category}</div>
                </div>
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                  gap.isBlocking ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {gap.isBlocking ? 'BLOCKING DELIVERABLE' : 'NON-BLOCKING'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-600 mb-2">
                <span>Current Level: <strong className="text-zinc-800">{gap.currentProficiency}/100</strong></span>
                <span>Required: <strong className="text-zinc-800">{gap.requiredProficiency}/100</strong></span>
              </div>

              <div className="h-1.5 w-full rounded-full bg-zinc-200 overflow-hidden mb-2">
                <div
                  className={`h-full ${gap.isBlocking ? 'bg-rose-500' : 'bg-amber-500'}`}
                  style={{ width: `${(gap.currentProficiency / gap.requiredProficiency) * 100}%` }}
                />
              </div>

              {gap.blockingTaskId && (
                <div className="text-[11px] text-rose-700 font-medium">
                  Blocks: <span className="font-mono font-bold">{gap.blockingTaskId}</span> — {gap.blockingTaskTitle || 'Critical Deliverable'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Learning Modules Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Modules List */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-zinc-900">Assigned Capstone Modules</h2>
          {(learningModules || []).map(mod => (
            <button
              key={mod.id}
              onClick={() => {
                setActiveModule(mod);
                setQuizSubmitted(false);
              }}
              className={`w-full rounded-xl border p-4 text-left text-xs transition ${
                activeModule?.id === mod.id
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                  : 'border-zinc-200 bg-white hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-zinc-900">{mod.title}</span>
                {mod.isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <span className="text-[10px] text-indigo-700 font-semibold">{mod.estimatedHours} hrs</span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 line-clamp-2">{mod.description}</p>
            </button>
          ))}
        </div>

        {/* Active Module Details */}
        {activeModule && (
          <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-zinc-900">{activeModule.title}</h3>
                <span className="text-zinc-500 text-[11px]">Estimated commitment: {activeModule.estimatedHours} hours • Mode: {activeModule.mode}</span>
              </div>
              <button
                onClick={() => handleMarkModuleComplete(activeModule)}
                disabled={activeModule.isCompleted}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{activeModule.isCompleted ? 'Completed' : 'Mark as Mastered'}</span>
              </button>
            </div>

            {/* Concept Summary */}
            <div>
              <h4 className="font-bold text-zinc-900 mb-1">Concept Summary & Architectural Objectives:</h4>
              <p className="text-zinc-700 leading-relaxed bg-zinc-50 p-3.5 rounded-xl border border-zinc-200">
                {activeModule.description}
              </p>
            </div>

            {/* Learning Outcomes */}
            {activeModule.learningOutcomes && activeModule.learningOutcomes.length > 0 && (
              <div>
                <h4 className="font-bold text-zinc-900 mb-1">Key Learning Outcomes:</h4>
                <ul className="space-y-1.5 text-zinc-700">
                  {(activeModule.learningOutcomes || []).map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practical Challenge */}
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
              <div className="flex items-center gap-2 font-bold text-indigo-950 mb-1">
                <Code className="h-4 w-4 text-indigo-600" />
                <span>Hands-on Implementation Challenge</span>
              </div>
              <p className="text-zinc-700">{activeModule.practicalChallenge}</p>
            </div>

            {/* Viva Quiz */}
            {activeModule.quiz && activeModule.quiz.length > 0 && (
              <div className="border-t border-zinc-100 pt-4 space-y-3">
                <h4 className="font-bold text-zinc-900 flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span>Capstone Viva Assessment Quiz</span>
                </h4>

                {(activeModule.quiz || []).map((q, qIdx) => (
                  <div key={qIdx} className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 space-y-2">
                    <p className="font-semibold text-zinc-900">{q.question}</p>
                    <div className="space-y-1.5">
                      {(q.options || []).map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-2 cursor-pointer hover:bg-zinc-50 transition"
                        >
                          <input
                            type="radio"
                            name={`quiz_${qIdx}`}
                            checked={selectedQuizAnswers[qIdx] === optIdx}
                            onChange={() => setSelectedQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                          />
                          <span className="text-zinc-700">{opt}</span>
                        </label>
                      ))}
                    </div>

                    {quizSubmitted && (
                      <div className="mt-2 text-[11px] text-zinc-600 border-t border-zinc-200/60 pt-1.5">
                        <strong className="text-emerald-700">Explanation: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setQuizSubmitted(true)}
                    className="rounded-lg bg-zinc-900 px-4 py-2 font-semibold text-white hover:bg-zinc-800 transition"
                  >
                    Submit & Verify Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
