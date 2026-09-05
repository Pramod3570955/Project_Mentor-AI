import React, { useState, useEffect } from 'react';
import { Project, User } from './types/index.js';
import { api } from './api.js';

// Layout Components
import { Navbar } from './components/Navbar.js';
import { Sidebar, ActiveView } from './components/Sidebar.js';

// View Components
import { MasterDashboard } from './components/views/MasterDashboard.js';
import { HealthRiskView } from './components/views/HealthRiskView.js';
import { IdeationView } from './components/views/IdeationView.js';
import { FeasibilityView } from './components/views/FeasibilityView.js';
import { BlueprintView } from './components/views/BlueprintView.js';
import { RoadmapTasksView } from './components/views/RoadmapTasksView.js';
import { ProjectIntelligenceView } from './components/views/ProjectIntelligenceView.js';
import { LearningView } from './components/views/LearningView.js';
import { MentorView } from './components/views/MentorView.js';
import { QualityView } from './components/views/QualityView.js';
import { DocumentationView } from './components/views/DocumentationView.js';
import { VivaPrepView } from './components/views/VivaPrepView.js';
import { FacultyPortalView } from './components/views/FacultyPortalView.js';
import { PortfolioView } from './components/views/PortfolioView.js';
import { AdminSettingsView } from './components/views/AdminSettingsView.js';

// Global Modals
import { GlobalSearchModal } from './components/GlobalSearchModal.js';
import { CopilotModal } from './components/CopilotModal.js';
import { NewProjectModal } from './components/NewProjectModal.js';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [loadingProjects, setLoadingProjects] = useState(true);

  // User state
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr_student_1',
    name: 'Alex Rivera',
    email: 'alex.rivera@university.edu',
    role: 'STUDENT',
    avatarUrl: ''
  });

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  // Initial fetch
  useEffect(() => {
    loadProjects();
  }, []);

  // Global keydown for Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await api.getProjects();
      setProjects(res?.projects || []);
      if (res?.projects && res.projects.length > 0 && !activeProject) {
        setActiveProject(res.projects[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleSwitchRole = (userId: string) => {
    if (userId === 'usr_faculty_1') {
      setCurrentUser({
        id: 'usr_faculty_1',
        name: 'Prof. Sarah Jenkins',
        email: 's.jenkins@university.edu',
        role: 'FACULTY',
        avatarUrl: ''
      });
      setActiveView('faculty');
    } else if (userId === 'usr_admin_1') {
      setCurrentUser({
        id: 'usr_admin_1',
        name: 'Dr. Marcus Vance',
        email: 'm.vance@university.edu',
        role: 'ADMIN',
        avatarUrl: ''
      });
      setActiveView('admin');
    } else {
      setCurrentUser({
        id: 'usr_student_1',
        name: 'Alex Rivera',
        email: 'alex.rivera@university.edu',
        role: 'STUDENT',
        avatarUrl: ''
      });
      setActiveView('dashboard');
    }
  };

  const handleProjectCreated = (newProj: Project) => {
    if (!newProj || !newProj.id) return;
    setProjects(prev => {
      const exists = prev.some(p => p.id === newProj.id);
      return exists ? prev.map(p => p.id === newProj.id ? newProj : p) : [newProj, ...prev];
    });
    setActiveProject(newProj);
    setActiveView('dashboard');
    // Sync fresh list from server
    loadProjects();
  };

  if (loadingProjects && !activeProject) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 text-xs text-zinc-500 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
          <span className="font-semibold text-zinc-800">Initializing ProjectMentor AI Platform...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans antialiased flex flex-col">
      {/* Skip to Main Content Link for Keyboard and Screen Reader Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-xs font-semibold"
      >
        Skip to main content
      </a>

      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={proj => setActiveProject(proj)}
        onOpenNewProject={() => setIsNewProjectOpen(true)}
        onSwitchRole={handleSwitchRole}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
      />

      {/* Main Split Layout: Sidebar + Active View Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          activeView={activeView}
          onSelectView={view => setActiveView(view)}
          userRole={currentUser.role}
          blockedTasksCount={1}
          unresolvedFeedbackCount={1}
        />

        {/* Content Area */}
        <main
          id="main-content"
          role="main"
          tabIndex={-1}
          aria-label="Active workspace content"
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full focus:outline-none"
        >
          {activeProject ? (
            <>
              {activeView === 'dashboard' && (
                <MasterDashboard
                  project={activeProject}
                  onNavigate={view => setActiveView(view)}
                  onOpenCopilot={() => setIsCopilotOpen(true)}
                />
              )}

              {activeView === 'health-risk' && (
                <HealthRiskView project={activeProject} />
              )}

              {activeView === 'ideation' && (
                <IdeationView onProjectCreated={handleProjectCreated} />
              )}

              {activeView === 'feasibility' && (
                <FeasibilityView project={activeProject} />
              )}

              {activeView === 'blueprint' && (
                <BlueprintView project={activeProject} />
              )}

              {activeView === 'roadmap' && (
                <RoadmapTasksView project={activeProject} />
              )}

              {activeView === 'intelligence' && (
                <ProjectIntelligenceView project={activeProject} />
              )}

              {activeView === 'learning' && (
                <LearningView project={activeProject} />
              )}

              {activeView === 'mentor' && (
                <MentorView project={activeProject} />
              )}

              {activeView === 'quality' && (
                <QualityView project={activeProject} />
              )}

              {activeView === 'documentation' && (
                <DocumentationView project={activeProject} />
              )}

              {activeView === 'viva' && (
                <VivaPrepView project={activeProject} />
              )}

              {activeView === 'faculty' && (
                <FacultyPortalView
                  project={activeProject}
                  onProjectUpdated={loadProjects}
                />
              )}

              {activeView === 'portfolio' && (
                <PortfolioView project={activeProject} />
              )}

              {activeView === 'admin' && (
                <AdminSettingsView
                  project={activeProject}
                  onResetDatabase={loadProjects}
                />
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-xs text-zinc-500">
              No project selected. Create or select a project to proceed.
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {activeProject && (
        <>
          <GlobalSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            projectId={activeProject.id}
            onNavigate={view => {
              setActiveView(view);
              setIsSearchOpen(false);
            }}
          />

          <CopilotModal
            isOpen={isCopilotOpen}
            onClose={() => setIsCopilotOpen(false)}
            projectId={activeProject.id}
            onActionCompleted={() => {
              loadProjects();
            }}
          />
        </>
      )}

      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}
