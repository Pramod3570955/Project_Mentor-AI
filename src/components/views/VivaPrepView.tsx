import React, { useState, useEffect } from 'react';
import {
  Mic,
  Award,
  Clock,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Presentation,
  Send,
  Volume2
} from 'lucide-react';
import { Project, VivaPreparation, VivaQuestion } from '../../types/index.js';
import { api } from '../../api.js';

interface VivaPrepViewProps {
  project: Project;
}

export const VivaPrepView: React.FC<VivaPrepViewProps> = ({ project }) => {
  const [viva, setViva] = useState<VivaPreparation | null>(null);
  const [activeTab, setActiveTab] = useState<'mock-viva' | 'pitches' | 'slides'>('mock-viva');
  const [selectedQuestion, setSelectedQuestion] = useState<VivaQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadViva();
  }, [project.id]);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const loadViva = async () => {
    setLoading(true);
    try {
      const res = await api.getViva(project.id);
      setViva(res?.viva || null);
      if (res?.viva && res.viva.questions && res.viva.questions.length > 0) {
        setSelectedQuestion(res.viva.questions[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !userAnswer.trim()) return;
    setIsEvaluating(true);

    try {
      const res = await api.evaluateVivaAnswer(project.id, selectedQuestion.id, userAnswer);
      setSelectedQuestion(res.question);
      setViva(prev => {
        if (!prev) return null;
        return {
          ...prev,
          overallReadinessScore: res.overallReadinessScore,
          questions: prev.questions.map(q => (q.id === res.question.id ? res.question : q))
        };
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  if (!viva) {
    return <div className="p-12 text-center text-xs text-zinc-500">Loading viva preparation...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <Mic className="h-4 w-4 text-purple-500" />
              <span>Stage 10: Viva Voce & Defense Mastery</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900">AI Viva Voce Examiner & Presentation Defense</h1>
            <p className="mt-1 text-xs text-zinc-500">
              Interactive oral rehearsal, pitch synthesis, and tough academic question evaluation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-right">
              <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Viva Confidence</div>
              <div className="text-xl font-bold text-purple-600">{viva.overallReadinessScore}%</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-5 flex items-center gap-2 border-t border-zinc-100 pt-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('mock-viva')}
            className={`rounded-lg px-3.5 py-1.5 transition ${
              activeTab === 'mock-viva' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Mock Viva AI Examiner
          </button>
          <button
            onClick={() => setActiveTab('pitches')}
            className={`rounded-lg px-3.5 py-1.5 transition ${
              activeTab === 'pitches' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            1/3/5-Minute Elevator Pitches
          </button>
          <button
            onClick={() => setActiveTab('slides')}
            className={`rounded-lg px-3.5 py-1.5 transition ${
              activeTab === 'slides' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Presentation Slide Architecture
          </button>
        </div>
      </div>

      {/* Tab 1: Mock Viva AI Examiner */}
      {activeTab === 'mock-viva' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Questions Roster */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-1">
              Examiner Question Bank ({viva.questions?.length || 0})
            </h3>
            {(viva.questions || []).map(q => (
              <button
                key={q.id}
                onClick={() => {
                  setSelectedQuestion(q);
                  setUserAnswer(q.userAnswer || '');
                  setTimerSeconds(120);
                  setTimerActive(false);
                }}
                className={`w-full rounded-xl border p-3.5 text-left text-xs transition ${
                  selectedQuestion?.id === q.id
                    ? 'border-purple-600 bg-purple-50/50 shadow-xs'
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                    q.difficulty === 'ADVANCED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {q.difficulty}
                  </span>
                  {q.evaluation ? (
                    <span className="text-[10px] font-bold text-emerald-700">
                      Score: {q.evaluation.score}%
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-400">Unanswered</span>
                  )}
                </div>
                <p className="font-semibold text-zinc-900 leading-snug">{q.question}</p>
                <div className="text-[10px] text-zinc-500 mt-1">Category: {q.category}</div>
              </button>
            ))}
          </div>

          {/* Active Question Simulator */}
          {selectedQuestion && (
            <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4 text-xs">
              {/* Question Banner */}
              <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-purple-200/80 px-2 py-0.5 text-[10px] font-bold text-purple-900">
                    EXAMINER CHALLENGE
                  </span>
                  {/* Rehearsal Timer */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-700">
                      {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTimerActive(!timerActive)}
                      className="rounded bg-zinc-900 p-1 text-white hover:bg-zinc-800"
                    >
                      <Play className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTimerSeconds(120);
                        setTimerActive(false);
                      }}
                      className="rounded bg-zinc-200 p-1 text-zinc-700 hover:bg-zinc-300"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-zinc-900 leading-relaxed">
                  "{selectedQuestion.question}"
                </h3>
                <p className="text-[11px] text-zinc-600">
                  <strong className="text-zinc-800">Examiner Intent:</strong> {selectedQuestion.examinerIntent}
                </p>
              </div>

              {/* Expected Key Points */}
              <div>
                <span className="font-semibold text-zinc-700 text-[11px] block mb-1">
                  Expected Key Concepts (To Score ≥85%):
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-zinc-600">
                  {selectedQuestion.expectedKeyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Student Answer Input */}
              <form onSubmit={handleEvaluateAnswer} className="space-y-3">
                <label className="block font-semibold text-zinc-800">Your Spoken Defense Answer:</label>
                <textarea
                  rows={4}
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Articulate your defense: explain architectural constraints, trade-offs, and empirical benchmarks..."
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 p-3 text-xs text-zinc-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isEvaluating || !userAnswer.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700 disabled:opacity-50 transition shadow-xs"
                  >
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>{isEvaluating ? 'Examiner Grading...' : 'Submit to AI Examiner'}</span>
                  </button>
                </div>
              </form>

              {/* Examiner Feedback Output */}
              {selectedQuestion.evaluation && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-emerald-600" />
                      <span>Examiner Evaluation: {selectedQuestion.evaluation.score}/100</span>
                    </span>
                    {selectedQuestion.evaluation.weakTopicDetected && (
                      <span className="rounded bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-bold">
                        Weak Area: {selectedQuestion.evaluation.weakTopicDetected}
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-700">{selectedQuestion.evaluation.feedback}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Pitches */}
      {activeTab === 'pitches' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span>1-Minute Elevator Pitch (High Academic Energy)</span>
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              {viva.elevatorPitches['1min']}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span>3-Minute Comprehensive Viva Introduction (Standard Capstone Opening)</span>
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              {viva.elevatorPitches['3min']}
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Slides */}
      {activeTab === 'slides' && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Presentation className="h-5 w-5 text-indigo-600" />
            <h2 className="font-bold text-sm text-zinc-900">Recommended Defense Slide Architecture</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {(viva.slideDeckStructure || []).map(slide => (
              <div key={slide.slideNumber} className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 space-y-2">
                <div className="flex items-center justify-between font-bold text-zinc-900">
                  <span>Slide {slide.slideNumber}: {slide.title}</span>
                  <span className="text-indigo-600 text-[11px] font-mono">{slide.allocatedMinutes} min</span>
                </div>
                <ul className="space-y-1 text-zinc-600 text-[11px]">
                  {(slide.bulletPoints || []).map((b, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
