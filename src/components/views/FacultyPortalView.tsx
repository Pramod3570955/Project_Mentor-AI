import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Send,
  Lock,
  MessageSquare,
  GraduationCap,
  Calendar,
  Layers
} from 'lucide-react';
import { Project, FacultyReview } from '../../types/index.js';
import { api } from '../../api.js';

interface FacultyPortalViewProps {
  project: Project;
  onProjectUpdated: () => void;
}

export const FacultyPortalView: React.FC<FacultyPortalViewProps> = ({
  project,
  onProjectUpdated
}) => {
  const [reviews, setReviews] = useState<FacultyReview[]>([]);
  const [status, setStatus] = useState<'APPROVED' | 'CHANGE_REQUESTED' | 'REJECTED'>('APPROVED');
  const [overallScore, setOverallScore] = useState(90);
  const [reviewNotes, setReviewNotes] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');
  const [directiveText, setDirectiveText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [project.id]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await api.getFacultyReviews(project.id);
      setReviews(res?.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewNotes.trim()) return;
    setSubmitting(true);

    try {
      const feedbackList = directiveText.trim()
        ? [
            {
              id: `fb_${Date.now()}`,
              category: 'BLUEPRINT' as const,
              feedback: directiveText,
              date: new Date().toISOString().split('T')[0],
              isResolved: false
            }
          ]
        : [];

      await api.submitFacultyReview(project.id, {
        status,
        overallScore,
        reviewNotes,
        privateGuideNotes: privateNotes,
        feedbackList
      });

      setReviewNotes('');
      setPrivateNotes('');
      setDirectiveText('');
      loadReviews();
      onProjectUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          <Award className="h-4 w-4 text-blue-600" />
          <span>Stage 11: Academic Supervision & Governance</span>
        </div>
        <h1 className="text-xl font-bold text-zinc-900">Faculty Guide Review & Sign-Off Workspace</h1>
        <p className="mt-1 text-xs text-zinc-500">
          Formal evaluation portal for Guide Prof. Sarah Jenkins to inspect deliverables and sign off on milestones.
        </p>
      </div>

      {/* Review Submission Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4 text-xs">
        <h2 className="text-sm font-bold text-zinc-900">Submit Formal Project Evaluation</h2>

        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Evaluation Decision</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full rounded-lg border border-zinc-300 p-2 text-zinc-900"
              >
                <option value="APPROVED">APPROVE Phase & Deliverables</option>
                <option value="CHANGE_REQUESTED">REQUEST CHANGES (Blocks Phase 2 Sign-off)</option>
                <option value="REJECTED">REJECT Proposal</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Evaluation Score (0-100)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={overallScore}
                onChange={e => setOverallScore(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-300 p-2 text-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">
              Public Review Notes (Visible to Student Team & Examiners) *
            </label>
            <textarea
              rows={3}
              required
              value={reviewNotes}
              onChange={e => setReviewNotes(e.target.value)}
              placeholder="Provide constructive feedback on architecture, edge benchmarks, and documentation..."
              className="w-full rounded-lg border border-zinc-300 p-2.5 text-zinc-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">
              Actionable Change Directive (Optional)
            </label>
            <input
              type="text"
              value={directiveText}
              onChange={e => setDirectiveText(e.target.value)}
              placeholder="e.g. Implement SpO2 < 85% emergency broadcast override in Task 4"
              className="w-full rounded-lg border border-zinc-300 p-2 text-zinc-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-zinc-500" />
              <span>Private Guide-Only Notes (Confidential to Internal Faculty Committee)</span>
            </label>
            <textarea
              rows={2}
              value={privateNotes}
              onChange={e => setPrivateNotes(e.target.value)}
              placeholder="Confidential observations on student teamwork, pacing, and expected viva defense strengths..."
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900"
            />
          </div>

          <div className="flex justify-end pt-2 border-t border-zinc-100">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition shadow-xs"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Faculty Review'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Review History */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-zinc-900">Historical Evaluation Records ({reviews.length})</h2>

        <div className="space-y-4 text-xs">
          {(reviews || []).map(rev => (
            <div key={rev.id} className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-900">{rev.facultyName}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">({rev.id})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-700">{rev.overallScore}/100</span>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    rev.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : rev.status === 'CHANGE_REQUESTED'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {rev.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <blockquote className="border-l-3 border-blue-500 bg-white p-3 rounded-r-lg text-zinc-800 italic">
                "{rev.reviewNotes}"
              </blockquote>

              {rev.feedbackList && rev.feedbackList.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="font-semibold text-zinc-700 text-[11px]">Directives Issued:</span>
                  {(rev.feedbackList || []).map(fb => (
                    <div key={fb.id} className="flex justify-between items-center bg-white p-2 rounded border border-zinc-200 text-[11px]">
                      <span>{fb.feedback}</span>
                      <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${
                        fb.isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {fb.isResolved ? 'RESOLVED' : 'PENDING ACTION'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {rev.privateGuideNotes && (
                <div className="rounded-lg bg-zinc-100 p-2.5 text-[11px] text-zinc-600 flex items-start gap-2">
                  <Lock className="h-3.5 w-3.5 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-800">Private Faculty Note: </span>
                    {rev.privateGuideNotes}
                  </div>
                </div>
              )}

              <div className="text-[10px] text-zinc-400 pt-1 border-t border-zinc-100">
                Submitted: {new Date(rev.submittedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
