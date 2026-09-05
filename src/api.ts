import {
  User,
  Project,
  ProjectHealth,
  ProjectBlueprint,
  FeasibilityAnalysis,
  DevelopmentPhase,
  Task,
  SkillGap,
  LearningModule,
  MentorMessage,
  QualityAnalysis,
  ProjectDocument,
  VivaPreparation,
  FacultyReview,
  KnowledgeChunk,
  KnowledgeConflict,
  KnowledgeGap,
  ProjectDecision,
  ProjectEvidence,
  RiskItem,
  ProjectChangeRequest,
  ActivityEvent,
  PortfolioShowcase,
  CopilotAction
} from './types/index.js';

const BASE_URL = '/api';

export const api = {
  // Health
  async getHealth() {
    const res = await fetch(`${BASE_URL}/health`);
    return res.json();
  },

  // Auth & Persona
  async getCurrentUser(): Promise<{ user: User }> {
    const res = await fetch(`${BASE_URL}/auth/me`);
    return res.json();
  },

  async switchRole(userId: string): Promise<{ user: User }> {
    const res = await fetch(`${BASE_URL}/auth/switch-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  // Projects
  async getProjects(): Promise<{ projects: Project[] }> {
    const res = await fetch(`${BASE_URL}/projects`);
    return res.json();
  },

  async getProject(id: string): Promise<{ project: Project }> {
    const res = await fetch(`${BASE_URL}/projects/${id}`);
    return res.json();
  },

  async createProject(data: Partial<Project>): Promise<{ project: Project }> {
    const res = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || `Failed to create capstone project (Status ${res.status})`);
    }
    return res.json();
  },

  // Health, Readiness & Next Best Action
  async getProjectHealth(projectId: string): Promise<{ health: ProjectHealth }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/health`);
    return res.json();
  },

  async getProjectReadiness(projectId: string): Promise<{ readiness: any }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/readiness`);
    return res.json();
  },

  async getNextBestAction(projectId: string): Promise<{ nextBestAction: any }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/next-best-action`);
    return res.json();
  },

  // Blueprint & Feasibility
  async getBlueprint(projectId: string): Promise<{ blueprint: ProjectBlueprint }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/blueprint`);
    return res.json();
  },

  async updateBlueprint(projectId: string, blueprint: ProjectBlueprint): Promise<{ blueprint: ProjectBlueprint }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/blueprint`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blueprint })
    });
    return res.json();
  },

  async getFeasibility(projectId: string): Promise<{ feasibility: FeasibilityAnalysis }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/feasibility`);
    return res.json();
  },

  // Roadmap & Tasks
  async getPhases(projectId: string): Promise<{ phases: DevelopmentPhase[] }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/phases`);
    return res.json();
  },

  async getTasks(projectId: string): Promise<{ tasks: Task[] }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/tasks`);
    return res.json();
  },

  async createTask(projectId: string, task: Partial<Task>): Promise<{ task: Task }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    return res.json();
  },

  async updateTask(projectId: string, taskId: string, updates: Partial<Task>): Promise<{ task: Task }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteTask(projectId: string, taskId: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Skills & Learning
  async getSkills(projectId: string): Promise<{ skillGaps: SkillGap[]; learningModules: LearningModule[] }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/skills`);
    return res.json();
  },

  async updateLearningModule(projectId: string, moduleId: string, updates: Partial<LearningModule>): Promise<{ module: LearningModule }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/learning-modules/${moduleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  // AI Mentor
  async getMentorMessages(projectId: string): Promise<{ messages: MentorMessage[] }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/mentor/messages`);
    return res.json();
  },

  async askMentor(projectId: string, question: string): Promise<{
    studentMessage: MentorMessage;
    mentorMessage: MentorMessage;
    meta: any;
  }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/mentor/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    return res.json();
  },

  // Quality
  async getQuality(projectId: string): Promise<{ quality: QualityAnalysis }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/quality`);
    return res.json();
  },

  async reEvaluateQuality(projectId: string): Promise<{ quality: QualityAnalysis }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/quality/re-evaluate`, {
      method: 'POST'
    });
    return res.json();
  },

  // Documents
  async getDocuments(projectId: string): Promise<{ documents: ProjectDocument[] }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/documents`);
    return res.json();
  },

  async saveDocument(projectId: string, document: ProjectDocument): Promise<{ document: ProjectDocument }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/documents/${document.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document })
    });
    return res.json();
  },

  // Viva Prep
  async getViva(projectId: string): Promise<{ viva: VivaPreparation }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/viva`);
    return res.json();
  },

  async evaluateVivaAnswer(projectId: string, questionId: string, userAnswer: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/viva/evaluate-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, userAnswer })
    });
    return res.json();
  },

  // Faculty Reviews
  async getFacultyReviews(projectId: string): Promise<{ reviews: FacultyReview[] }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/faculty-reviews`);
    return res.json();
  },

  async submitFacultyReview(projectId: string, reviewData: Partial<FacultyReview>): Promise<{ review: FacultyReview }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/faculty-reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    return res.json();
  },

  // Project Intelligence & RAG
  async getProjectIntelligence(projectId: string): Promise<{
    chunks: KnowledgeChunk[];
    conflicts: KnowledgeConflict[];
    gaps: KnowledgeGap[];
    decisions: ProjectDecision[];
    evidences: ProjectEvidence[];
    completeness: { score: number; categories: any[] };
    graph: { nodes: any[]; edges: any[] };
  }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/intelligence`);
    return res.json();
  },

  async searchIntelligence(projectId: string, query: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/intelligence/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    return res.json();
  },

  async resolveConflict(projectId: string, conflictId: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/intelligence/conflicts/${conflictId}/resolve`, {
      method: 'POST'
    });
    return res.json();
  },

  async addDecision(projectId: string, decision: Partial<ProjectDecision>): Promise<{ decision: ProjectDecision }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/intelligence/decisions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(decision)
    });
    return res.json();
  },

  // Risks, Changes, Activities
  async getRisks(projectId: string): Promise<{ risks: RiskItem[] }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/risks`);
    return res.json();
  },

  async updateRisk(projectId: string, riskId: string, updates: Partial<RiskItem>): Promise<{ risk: RiskItem }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/risks/${riskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async getChangeRequests(projectId: string): Promise<{ changeRequests: ProjectChangeRequest[] }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/change-requests`);
    return res.json();
  },

  async addChangeRequest(projectId: string, cr: Partial<ProjectChangeRequest>): Promise<{ changeRequest: ProjectChangeRequest }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/change-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cr)
    });
    return res.json();
  },

  async getActivities(projectId: string): Promise<{ activities: ActivityEvent[] }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/activities`);
    return res.json();
  },

  // Portfolio
  async getPortfolio(projectId: string): Promise<{ portfolio: PortfolioShowcase }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/portfolio`);
    return res.json();
  },

  async updatePortfolio(projectId: string, portfolio: PortfolioShowcase): Promise<{ portfolio: PortfolioShowcase }> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/portfolio`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portfolio })
    });
    return res.json();
  },

  // AI Project Recommendation
  async recommendProjectIdeas(params: any): Promise<any> {
    const res = await fetch(`${BASE_URL}/ai/recommend-ideas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return res.json();
  },

  // Copilot Action Execution
  async executeCopilotAction(projectId: string, action: CopilotAction): Promise<any> {
    const res = await fetch(`${BASE_URL}/copilot/execute-action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, action })
    });
    return res.json();
  },

  // Admin
  async getAdminOverview(): Promise<any> {
    const res = await fetch(`${BASE_URL}/admin/overview`);
    return res.json();
  },

  async getDbStats(): Promise<any> {
    const res = await fetch(`${BASE_URL}/admin/stats`);
    return res.json();
  },

  async resetDatabase(): Promise<any> {
    const res = await fetch(`${BASE_URL}/admin/reset`, { method: 'POST' });
    return res.json();
  },

  // Security, Efficiency & Automated Testing
  async getSecurityAudit(): Promise<any> {
    const res = await fetch(`${BASE_URL}/system/security-audit`);
    return res.json();
  },

  async getPerformanceMetrics(): Promise<any> {
    const res = await fetch(`${BASE_URL}/system/performance`);
    return res.json();
  },

  async runAutomatedTests(): Promise<any> {
    const res = await fetch(`${BASE_URL}/system/run-tests`, { method: 'POST' });
    return res.json();
  },

  async getTestResults(): Promise<any> {
    const res = await fetch(`${BASE_URL}/system/test-results`);
    return res.json();
  }
};
