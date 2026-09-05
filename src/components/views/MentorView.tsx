import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Project, MentorMessage } from '../../types/index.js';
import { api } from '../../api.js';

interface MentorViewProps {
  project: Project;
}

export const MentorView: React.FC<MentorViewProps> = ({ project }) => {
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [project.id]);

  const loadMessages = async () => {
    try {
      const res = await api.getMentorMessages(project.id);
      setMessages(res?.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const q = customPrompt || input;
    if (!q.trim() || loading) return;

    setInput('');
    // Optimistic student message
    const tempStudent: MentorMessage = {
      id: `temp_${Date.now()}`,
      sender: 'student',
      text: q,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempStudent]);
    setLoading(true);

    try {
      const res = await api.askMentor(project.id, q);
      setMessages(prev => [...prev.filter(m => m.id !== tempStudent.id), res.studentMessage, res.mentorMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <MessageSquare className="h-4 w-4 text-indigo-500" />
              <span>Stage 7: AI Mentorship & Project Grounding</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900">AI Project Mentor Chat Workspace</h1>
            <p className="mt-1 text-xs text-zinc-500">
              Grounded exclusively in your project's verified blueprint, roadmap tasks, and faculty feedback.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-800">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>RAG Grounding Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* Suggested Starter Questions */}
      <div className="flex flex-wrap gap-2">
        {[
          'What should I work on today?',
          'Why is my project at risk?',
          'What did Prof. Jenkins ask me to fix?',
          'Explain our INT8 quantization architecture for viva'
        ].map(prompt => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs flex flex-col min-h-[500px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {(messages || []).map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'student'
                    ? 'bg-zinc-900 text-white rounded-br-xs'
                    : 'border border-zinc-200 bg-zinc-50/90 text-zinc-800 rounded-bl-xs shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Grounded Context Sources */}
                {msg.contextSources && msg.contextSources.length > 0 && (
                  <div className="mt-3 border-t border-zinc-200/80 pt-2 text-[10px]">
                    <div className="font-semibold text-zinc-500 mb-1 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      <span>Retrieved Authority Chunks:</span>
                    </div>
                    <ul className="space-y-1 text-zinc-600">
                      {(msg.contextSources || []).map((s, idx) => (
                        <li key={idx} className="truncate">
                          • <strong className="text-zinc-700">{s.title}</strong>: {s.excerpt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 italic p-3">
              <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>ProjectMentor is analyzing project context and synthesizing answer...</span>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="mt-4 pt-4 border-t border-zinc-100">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about your architecture, tasks, viva prep..."
              className="flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-40 transition"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
