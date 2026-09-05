import React from 'react';
import {
  Compass,
  ChevronDown,
  Sparkles,
  Search,
  Plus,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Layers,
  Activity
} from 'lucide-react';
import { Project, User } from '../types/index.js';

interface NavbarProps {
  currentUser: User;
  projects: Project[];
  activeProject: Project | null;
  onSelectProject: (proj: Project) => void;
  onOpenNewProject: () => void;
  onSwitchRole: (userId: string) => void;
  onOpenSearch: () => void;
  onOpenCopilot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  projects,
  activeProject,
  onSelectProject,
  onOpenNewProject,
  onSwitchRole,
  onOpenSearch,
  onOpenCopilot
}) => {
  const [projectDropdownOpen, setProjectDropdownOpen] = React.useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  const roleConfigs = {
    STUDENT: { label: 'Student Persona', name: 'Alex Rivera', icon: GraduationCap, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    FACULTY: { label: 'Faculty / Guide', name: 'Prof. Sarah Jenkins', icon: Briefcase, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    ADMIN: { label: 'Platform Admin', name: 'Dr. Marcus Vance', icon: ShieldCheck, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' }
  };

  const currentRoleConfig = roleConfigs[currentUser.role] || roleConfigs.STUDENT;
  const RoleIcon = currentRoleConfig.icon;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/95 px-4 backdrop-blur-md lg:px-6">
      {/* Brand & Active Project Selector */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-xs">
            <Compass className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-zinc-900 tracking-tight">ProjectMentor</span>
              <span className="rounded-sm bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">AI</span>
            </div>
            <p className="text-[11px] text-zinc-600">Capstone Intelligence Platform</p>
          </div>
        </div>

        {/* Project Selector */}
        <div className="relative">
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            aria-haspopup="listbox"
            aria-expanded={projectDropdownOpen}
            aria-label={`Current project: ${activeProject ? activeProject.title : 'Select Project'}. Click to switch project`}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-800 transition hover:bg-zinc-100 hover:border-zinc-300 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
          >
            <Layers className="h-3.5 w-3.5 text-zinc-500" />
            <span className="max-w-[140px] truncate sm:max-w-[200px] md:max-w-[240px]">
              {activeProject ? activeProject.title : 'Select Project'}
            </span>
            <ChevronDown className="h-3 w-3 text-zinc-400" />
          </button>

          {projectDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                Projects ({(projects || []).length})
              </div>
              <div className="max-h-60 space-y-1 overflow-y-auto">
                {(projects || []).map(proj => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj);
                      setProjectDropdownOpen(false);
                    }}
                    className={`flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition ${
                      activeProject?.id === proj.id ? 'bg-indigo-50 text-indigo-900 font-medium' : 'text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                    <div className="truncate">
                      <div className="truncate font-medium">{proj.title}</div>
                      <div className="text-[10px] text-zinc-600">{proj.category}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-2 border-t border-zinc-100 pt-1.5">
                <button
                  onClick={() => {
                    setProjectDropdownOpen(false);
                    onOpenNewProject();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Start New Capstone Project</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Search, Provider Status, Persona Switcher & Copilot Button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search button */}
        <button
          onClick={onOpenSearch}
          aria-label="Open global search (Command + K)"
          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100 transition focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden md:inline text-[11px]">Search Project...</span>
          <kbd className="hidden md:inline rounded bg-white px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-200">
            ⌘K
          </kbd>
        </button>

        {/* AI Provider Status */}
        <div
          role="status"
          aria-label="Gemini 3.8 and RAG Engine are active"
          className="hidden lg:flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/70 px-2.5 py-1 text-[11px] font-medium text-emerald-700"
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Gemini 3.8 / RAG Active</span>
        </div>

        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            aria-haspopup="menu"
            aria-expanded={roleDropdownOpen}
            aria-label={`Current persona: ${currentRoleConfig.name}. Click to switch role`}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${currentRoleConfig.color} hover:shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none`}
          >
            <RoleIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{currentRoleConfig.name}</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2 py-1 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                Switch Role / Persona
              </div>
              <div className="mt-1 space-y-1">
                <button
                  onClick={() => {
                    onSwitchRole('usr_student_1');
                    setRoleDropdownOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition ${
                    currentUser.role === 'STUDENT' ? 'bg-emerald-50 text-emerald-900 font-medium' : 'text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  <GraduationCap className="h-4 w-4 text-emerald-600" />
                  <div>
                    <div className="font-medium">Alex Rivera (Student)</div>
                    <div className="text-[10px] text-zinc-600">Final-Year B.Tech CSE</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSwitchRole('usr_faculty_1');
                    setRoleDropdownOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition ${
                    currentUser.role === 'FACULTY' ? 'bg-blue-50 text-blue-900 font-medium' : 'text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium">Prof. Sarah Jenkins (Guide)</div>
                    <div className="text-[10px] text-zinc-600">Associate Professor, CSE</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSwitchRole('usr_admin_1');
                    setRoleDropdownOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition ${
                    currentUser.role === 'ADMIN' ? 'bg-purple-50 text-purple-900 font-medium' : 'text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4 text-purple-600" />
                  <div>
                    <div className="font-medium">Dr. Marcus Vance (Admin)</div>
                    <div className="text-[10px] text-zinc-600">Academic Computing Cell</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Ask Project Copilot Button */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-zinc-800 active:scale-98"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
          <span className="hidden sm:inline">Project Copilot</span>
        </button>
      </div>
    </header>
  );
};
