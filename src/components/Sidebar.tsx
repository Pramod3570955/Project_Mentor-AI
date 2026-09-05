import React from 'react';
import {
  LayoutDashboard,
  Lightbulb,
  Scale,
  FileCode2,
  KanbanSquare,
  Sparkles,
  BookOpen,
  MessageSquare,
  ShieldAlert,
  FileText,
  Mic,
  Award,
  Globe,
  Settings2,
  GitPullRequestDraft
} from 'lucide-react';
import { UserRole } from '../types/index.js';

export type ActiveView =
  | 'dashboard'
  | 'health-risk'
  | 'ideation'
  | 'feasibility'
  | 'blueprint'
  | 'roadmap'
  | 'intelligence'
  | 'learning'
  | 'mentor'
  | 'quality'
  | 'documentation'
  | 'viva'
  | 'faculty'
  | 'portfolio'
  | 'admin';

interface SidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  userRole: UserRole;
  blockedTasksCount?: number;
  unresolvedFeedbackCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  userRole,
  blockedTasksCount = 1,
  unresolvedFeedbackCount = 1
}) => {
  const navSections = [
    {
      group: 'Overview & Health',
      items: [
        { id: 'dashboard' as ActiveView, label: 'Master Dashboard', icon: LayoutDashboard },
        { id: 'health-risk' as ActiveView, label: 'Health, Risk & Evidence', icon: ShieldAlert, badge: blockedTasksCount > 0 ? `${blockedTasksCount} Blocked` : undefined, badgeColor: 'bg-amber-100 text-amber-800' }
      ]
    },
    {
      group: 'Ideation & Planning',
      items: [
        { id: 'ideation' as ActiveView, label: 'AI Idea & Recommendations', icon: Lightbulb },
        { id: 'feasibility' as ActiveView, label: 'Feasibility Analyzer', icon: Scale },
        { id: 'blueprint' as ActiveView, label: 'Project Blueprint & Specs', icon: FileCode2 },
        { id: 'roadmap' as ActiveView, label: 'Roadmap & Tasks', icon: KanbanSquare }
      ]
    },
    {
      group: 'Development & Intelligence',
      items: [
        { id: 'intelligence' as ActiveView, label: 'Project Intelligence & RAG', icon: Sparkles },
        { id: 'learning' as ActiveView, label: 'Skills & Learning Modules', icon: BookOpen },
        { id: 'mentor' as ActiveView, label: 'AI Project Mentor', icon: MessageSquare },
        { id: 'quality' as ActiveView, label: 'Quality Analyzer (11-Cat)', icon: GitPullRequestDraft }
      ]
    },
    {
      group: 'Academic Deliverables',
      items: [
        { id: 'documentation' as ActiveView, label: 'Documentation Center (SRS)', icon: FileText },
        { id: 'viva' as ActiveView, label: 'Viva Voce & Pitch Prep', icon: Mic },
        { id: 'faculty' as ActiveView, label: 'Faculty / Guide Workspace', icon: Award, badge: unresolvedFeedbackCount > 0 ? `${unresolvedFeedbackCount} Action` : undefined, badgeColor: 'bg-rose-100 text-rose-800' }
      ]
    },
    {
      group: 'Governance & Showcase',
      items: [
        { id: 'portfolio' as ActiveView, label: 'Readiness & Portfolio', icon: Globe },
        { id: 'admin' as ActiveView, label: 'Admin Control Center', icon: Settings2 }
      ]
    }
  ];

  return (
    <nav
      role="navigation"
      aria-label="Main Navigation"
      className="w-64 shrink-0 border-r border-zinc-200 bg-zinc-50/50 p-3 hidden md:flex flex-col justify-between min-h-[calc(100vh-4rem)]"
    >
      <div className="space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
              {section.group}
            </div>
            <div className="space-y-0.5" role="menu">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectView(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none ${
                      isActive
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-300' : 'text-zinc-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer info */}
      <div className="rounded-xl border border-zinc-200 bg-white p-3 text-[11px] text-zinc-500 shadow-xs">
        <div className="flex items-center justify-between font-medium text-zinc-700">
          <span>Target Capstone Submission</span>
          <span className="text-indigo-600 font-semibold">May 15, 2026</span>
        </div>
        <p className="mt-1 text-[10px] text-zinc-600">
          Deterministic Health: <strong className="text-zinc-700 font-semibold">84/100 (Needs Attention)</strong>
        </p>
      </div>
    </nav>
  );
};
