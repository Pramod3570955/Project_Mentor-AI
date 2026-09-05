import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { api } from '../api.js';
import { CopilotAction } from '../types/index.js';

interface CopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onActionCompleted?: () => void;
}

export const CopilotModal: React.FC<CopilotModalProps> = ({
  isOpen,
  onClose,
  projectId,
  onActionCompleted
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<
    { sender: 'user' | 'copilot'; text: string; actionSuggestion?: CopilotAction; sources?: any[] }[]
  >([
    {
      sender: 'copilot',
      text: "Hello! I am your Project Copilot connected to the centralized Project Intelligence Engine. I have verified context on your roadmap, faculty feedback, ADR decisions, and risk registry. How can I help you advance your capstone today?"
    }
  ]);
  const [pendingAction, setPendingAction] = useState<CopilotAction | null>(null);
  const [executingAction, setExecutingAction] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

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

  const handleSend = async (questionText?: string) => {
    const q = questionText || input;
    if (!q.trim() || loading) return;

    setInput('');
    setConversation(prev => [...prev, { sender: 'user', text: q }]);
    setLoading(true);

    try {
      const res = await api.askMentor(projectId, q);
      setConversation(prev => [
        ...prev,
        {
          sender: 'copilot',
          text: res.mentorMessage.text,
          actionSuggestion: res.mentorMessage.actionSuggestion,
          sources: res.mentorMessage.contextSources
        }
      ]);

      if (res.mentorMessage.actionSuggestion) {
        setPendingAction(res.mentorMessage.actionSuggestion);
      }
    } catch (err) {
      console.error(err);
      setConversation(prev => [
        ...prev,
        {
          sender: 'copilot',
          text: 'Encountered an issue querying project intelligence. Please check your connection and retry.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;
    setExecutingAction(true);
    setActionSuccessMessage(null);

    try {
      const res = await api.executeCopilotAction(projectId, pendingAction);
      setActionSuccessMessage(res.message || 'Action executed successfully.');
      setPendingAction(null);
      if (onActionCompleted) onActionCompleted();
    } catch (err: any) {
      console.error(err);
      setActionSuccessMessage('Failed to execute action.');
    } finally {
      setExecutingAction(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="copilot-modal-title"
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-zinc-200 bg-white shadow-2xl animate-in slide-in-from-right duration-200"
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-5 bg-zinc-900 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-sm">
              <span id="copilot-modal-title">Project Copilot</span>
              <span className="rounded bg-indigo-500/30 px-1.5 py-0.5 text-[9px] font-bold text-indigo-200 uppercase tracking-wide">
                Grounding Active
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Context-Aware AI Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close Project Copilot panel"
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Quick Prompts Banner */}
      <div className="border-b border-zinc-100 bg-zinc-50 p-3 text-[11px]">
        <div className="text-zinc-500 font-medium mb-1.5">Project Intelligence Shortcuts:</div>
        <div className="flex flex-wrap gap-1.5">
          {[
            'What should I do today?',
            'Why is my project at risk?',
            'What did faculty ask to fix?',
            'Is my project ready for viva?'
          ].map(shortcut => (
            <button
              key={shortcut}
              onClick={() => handleSend(shortcut)}
              className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 transition shadow-2xs"
            >
              {shortcut}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        aria-live="polite"
        role="log"
        aria-label="Copilot conversation transcript"
      >
        {(conversation || []).map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-zinc-900 text-white rounded-br-xs'
                  : 'border border-zinc-200 bg-zinc-50/80 text-zinc-800 rounded-bl-xs shadow-2xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Source attribution grounding */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 border-t border-zinc-200/80 pt-2 text-[10px]">
                  <div className="flex items-center gap-1 font-semibold text-zinc-500 mb-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    <span>Grounded in Verified Knowledge Chunks:</span>
                  </div>
                  <ul className="space-y-1 text-zinc-600">
                    {(msg.sources || []).map((s, idx) => (
                      <li key={idx} className="truncate">
                        • <strong className="text-zinc-700">{s.title}</strong>: {s.excerpt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-zinc-500 italic p-2" role="status">
            <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" aria-hidden="true" />
            <span>Consulting Project Intelligence & RAG memory...</span>
          </div>
        )}

        {/* Action Suggestion Preview & Confirmation Container */}
        {pendingAction && (
          <div
            role="region"
            aria-label="Copilot Proposed Action"
            className="rounded-xl border-2 border-indigo-200 bg-indigo-50/70 p-4 shadow-sm animate-in fade-in duration-200"
          >
            <div className="flex items-center gap-2 text-indigo-950 font-semibold text-xs mb-1">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Copilot Proposed Project Action</span>
            </div>
            <p className="text-xs text-indigo-900 font-medium">{pendingAction.title}</p>
            <p className="mt-1 text-[11px] text-zinc-600">{pendingAction.summary}</p>

            <div className="mt-2.5 rounded-lg border border-indigo-200/80 bg-white p-2.5 text-[11px] text-zinc-700">
              <div className="font-semibold text-zinc-800 mb-1">Action Preview (Requires Explicit Confirmation):</div>
              <pre className="overflow-x-auto text-[10px] font-mono text-zinc-600">
                {JSON.stringify(pendingAction.details, null, 2)}
              </pre>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                onClick={() => setPendingAction(null)}
                className="rounded-lg px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-200/60 transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              >
                Dismiss
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={executingAction}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{executingAction ? 'Applying...' : 'Confirm & Execute'}</span>
              </button>
            </div>
          </div>
        )}

        {actionSuccessMessage && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-zinc-200 p-3 bg-white">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor="copilot-text-input" className="sr-only">
            Ask Copilot
          </label>
          <input
            id="copilot-text-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything about your project tasks, viva, risks..."
            className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message to Copilot"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white transition hover:bg-zinc-800 disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
