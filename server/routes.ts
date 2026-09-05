import { Router } from 'express';
import { db } from './db.js';
import { calculateProjectHealth, calculateProjectReadiness, generateNextBestAction } from './healthRiskEngine.js';
import { ProjectIntelligenceService } from './projectIntelligence.js';
import { GeminiService } from './gemini.js';
import { Task, Project, ProjectBlueprint, FeasibilityAnalysis } from '../src/types/index.js';
import { serverCache, getPerformanceMetrics } from './cache.js';
import { rateLimiter, requireRole, getSecurityAuditReport } from './security.js';
import { AutomatedTestRunner } from './testRunner.js';

export const apiRouter = Router();

// Current active session tracking
let currentActiveUserId = 'usr_student_1';

// In-memory cache of latest automated test results
let latestTestReport: any = null;

// System: Automated Verification Test Suite
apiRouter.post('/system/run-tests', async (req, res) => {
  try {
    const report = await AutomatedTestRunner.runAllTests();
    latestTestReport = report;
    db.logAudit(currentActiveUserId, 'System', 'TESTS_EXECUTED', `Executed ${report.totalTests} tests: ${report.passed} passed, ${report.failed} failed.`);
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: 'Test execution failed', details: err.message });
  }
});

apiRouter.get('/system/test-results', async (req, res) => {
  if (!latestTestReport) {
    latestTestReport = await AutomatedTestRunner.runAllTests();
  }
  res.json(latestTestReport);
});

// System: Security Posture Audit Report
apiRouter.get('/system/security-audit', (req, res) => {
  res.json(getSecurityAuditReport());
});

// System: Performance & Caching Diagnostics
apiRouter.get('/system/performance', (req, res) => {
  res.json(getPerformanceMetrics());
});

// 1. Health & Platform Status
apiRouter.get('/health', (req, res) => {
  const users = db.getUsers();
  const projects = db.getProjects();
  const apiKeyConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    platform: 'ProjectMentor AI',
    version: '1.0.0-capstone-enterprise',
    stats: {
      totalUsers: users.length,
      totalProjects: projects.length,
      activeUserId: currentActiveUserId,
      aiProvider: apiKeyConfigured ? 'GEMINI_LIVE_3.8_FLASH' : 'DETERMINISTIC_MOCK_PROVIDER',
      ragEngine: 'HYBRID_SPARSE_DENSE_AUTHORITY_AWARE'
    }
  });
});

// 2. Auth & Persona Switcher
apiRouter.get('/auth/me', (req, res) => {
  const user = db.getUserById(currentActiveUserId) || db.getUsers()[0];
  res.json({ user });
});

apiRouter.post('/auth/switch-role', (req, res) => {
  const { userId } = req.body;
  const targetUser = db.getUserById(userId);
  if (!targetUser) {
    return res.status(404).json({ error: 'User not found' });
  }
  currentActiveUserId = targetUser.id;
  db.logAudit(targetUser.id, targetUser.name, 'PERSONA_SWITCHED', `Switched active persona to ${targetUser.role} (${targetUser.name})`);
  res.json({ user: targetUser });
});

// 3. Projects List & Details
apiRouter.get('/projects', (req, res) => {
  const projects = db.getProjects();
  res.json({ projects });
});

apiRouter.get('/projects/:id', (req, res) => {
  const project = db.getProjectById(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ project });
});

apiRouter.post('/projects', (req, res) => {
  const {
    title,
    category,
    domain,
    abstract,
    problemStatement,
    technologies,
    durationWeeks,
    budget,
    targetUsers,
    scope
  } = req.body;

  const currentUser = db.getUserById(currentActiveUserId) || db.getUsers()[0];
  const newId = `proj_${Date.now()}`;

  const newProject: Project = {
    id: newId,
    title: title || 'Untitled Capstone Project',
    category: category || 'Applied Computing',
    domain: domain || 'Software Systems & AI',
    abstract: abstract || '',
    problemStatement: problemStatement || '',
    objectives: [
      'Architect and build an end-to-end working system with verified testing.',
      'Achieve high academic rigor and pass viva voce review.',
      'Deploy working prototype with verifiable evidence.'
    ],
    status: 'ACTIVE',
    ownerId: currentUser.id,
    ownerName: currentUser.name,
    facultyGuideId: 'usr_faculty_1',
    facultyGuideName: 'Prof. Sarah Jenkins',
    teamMembers: [{ userId: currentUser.id, name: currentUser.name, role: 'Lead Architect' }],
    technologies: Array.isArray(technologies) ? technologies : ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    startDate: new Date().toISOString().split('T')[0],
    targetCompletionDate: new Date(Date.now() + (durationWeeks || 16) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    durationWeeks: durationWeeks || 16,
    budget: budget || 300,
    targetUsers: targetUsers || ['General Users'],
    scope: scope || {
      mvp: ['Core system architecture & API', 'Interactive dashboard', 'Basic persistence'],
      currentScope: ['Automated quality checks', 'Data telemetry', 'User authentication'],
      futureScope: ['Federated scaling', 'Mobile client']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Scaffold Feasibility
  const newFeasibility: FeasibilityAnalysis = {
    projectId: newId,
    overallScore: 85,
    breakdown: {
      technical: 84,
      time: 86,
      skill: 82,
      team: 90,
      resource: 85,
      hardware: 88,
      budget: 92
    },
    complexity: 'MEDIUM',
    academicSuitability: 'High capstone alignment. Fits semester timeline with verifiable milestones.',
    realWorldValue: 'Addresses clear user requirements with measurable outcomes.',
    strengths: ['Clear MVP boundaries', 'Realistic technology stack'],
    weaknesses: ['Integration testing needs early planning'],
    majorRisks: ['Third-party API dependencies'],
    actionableRecommendations: ['Build offline mock mode first', 'Schedule early milestone review with faculty guide'],
    mvpScope: newProject.scope.mvp,
    futureScope: newProject.scope.futureScope,
    resourceRequirements: ['Development workstation', 'Docker environment'],
    timelineEstimateWeeks: newProject.durationWeeks
  };

  // Scaffold Blueprint
  const newBlueprint: ProjectBlueprint = {
    projectId: newId,
    version: 1,
    status: 'DRAFT',
    abstract: newProject.abstract,
    problemStatement: newProject.problemStatement,
    existingSystemAnalysis: 'Legacy approaches rely on manual, delayed workflows without centralized intelligence.',
    proposedSystemArchitecture: 'Modern full-stack decoupled architecture with high-performance reactive client and persistent relational storage.',
    functionalRequirements: ['User management & RBAC', 'Real-time telemetry / data processing', 'Audit trails'],
    nonFunctionalRequirements: ['Sub-200ms API response time', 'TLS 1.3 encryption', '99.9% uptime'],
    technologyStack: newProject.technologies.map(tech => ({
      layer: 'Primary Component',
      technology: tech,
      reason: 'Optimized for developer productivity and rigorous academic capstone standards.'
    })),
    modules: [
      {
        id: `mod_${Date.now()}_1`,
        name: 'Core Engine & Ingestion',
        description: 'Processes input data, cleans inputs, and coordinates data pipelines.',
        technologies: [newProject.technologies[0] || 'Node.js'],
        keyFeatures: ['Validation', 'Error boundary', 'Data extraction'],
        dependencies: []
      },
      {
        id: `mod_${Date.now()}_2`,
        name: 'User Workstation & Analytics',
        description: 'Interactive dashboard delivering real-time user insights.',
        technologies: ['React', 'TypeScript', 'Tailwind CSS'],
        keyFeatures: ['Reactive state', 'Visual graphs', 'Role-based views'],
        dependencies: [`mod_${Date.now()}_1`]
      }
    ],
    databaseDesign: [
      {
        name: 'records',
        description: 'Primary entity recording transactions and status.',
        fields: [
          { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
          { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'NOT NULL' },
          { name: 'status', type: 'VARCHAR(32)', constraints: 'NOT NULL' }
        ],
        relationships: []
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/health', description: 'System health probe', authRequired: false },
      { method: 'POST', path: '/api/v1/records', description: 'Create new record', authRequired: true }
    ],
    securityMeasures: ['Password hashing', 'Input parameter sanitization', 'Role-based access checks'],
    testingStrategy: [
      { type: 'Unit Tests', coverageTarget: '> 80%', tools: ['Vitest'] },
      { type: 'E2E Flow Tests', coverageTarget: '100% critical paths', tools: ['Playwright'] }
    ],
    deploymentPlan: 'Containerized deployment via Docker Compose with automated healthcheck.',
    successMetrics: ['100% acceptance criteria pass rate', 'Faculty Guide sign-off'],
    updatedAt: new Date().toISOString()
  };

  const created = db.createProject(newProject, newFeasibility, newBlueprint);

  // Auto-scaffold Phase 1 Roadmap & Initial Tasks
  const phase1 = {
    id: `ph_${Date.now()}_1`,
    projectId: newId,
    title: 'Phase 1: Project Scaffolding & Core Architecture',
    description: 'Establish repository, database schema, and initial baseline implementation.',
    order: 1,
    milestones: [
      {
        id: `ms_${Date.now()}_1`,
        phaseId: `ph_${Date.now()}_1`,
        title: 'Architecture Blueprint & Schema Sign-off',
        description: 'Review blueprint with faculty guide and lock schema.',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isCompleted: false
      }
    ]
  };
  db.setPhases(newId, [phase1]);

  const initialTask: Task = {
    id: `tsk_${Date.now()}_1`,
    projectId: newId,
    phaseId: phase1.id,
    milestoneId: phase1.milestones[0].id,
    title: 'Initialize Repository & Database Schemas',
    description: 'Set up version control, configure environment variables, and create base database migration.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    estimateHours: 12,
    deadline: phase1.milestones[0].dueDate,
    dependencies: [],
    assignedUserId: currentUser.id,
    assignedUserName: currentUser.name,
    technologyTag: newProject.technologies[0] || 'TypeScript',
    acceptanceCriteria: ['Repository README documents setup', 'Migrations run cleanly'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.createTask(initialTask);

  // Ingest initial knowledge chunk
  db.addKnowledgeChunk({
    id: `chk_${Date.now()}_1`,
    docId: 'kdoc_blueprint',
    projectId: newId,
    content: `Project ${newProject.title}: ${newProject.abstract}. Uses ${newProject.technologies.join(', ')}.`,
    authority: 'VERIFIED',
    category: 'PROJECT_OVERVIEW',
    keywords: newProject.technologies
  });

  res.status(201).json({ project: created });
});

// 4. Health, Risk & Readiness
apiRouter.get('/projects/:id/health', (req, res) => {
  const cacheKey = `health:${req.params.id}`;
  const cached = serverCache.get(cacheKey);
  if (cached) {
    res.setHeader('X-Cache', 'HIT');
    return res.json({ health: cached });
  }
  const health = calculateProjectHealth(req.params.id);
  serverCache.set(cacheKey, health, 45, [`project:${req.params.id}`]);
  res.setHeader('X-Cache', 'MISS');
  res.json({ health });
});

apiRouter.get('/projects/:id/readiness', (req, res) => {
  const cacheKey = `readiness:${req.params.id}`;
  const cached = serverCache.get(cacheKey);
  if (cached) {
    res.setHeader('X-Cache', 'HIT');
    return res.json({ readiness: cached });
  }
  const readiness = calculateProjectReadiness(req.params.id);
  serverCache.set(cacheKey, readiness, 45, [`project:${req.params.id}`]);
  res.setHeader('X-Cache', 'MISS');
  res.json({ readiness });
});

apiRouter.get('/projects/:id/next-best-action', (req, res) => {
  const action = generateNextBestAction(req.params.id);
  res.json({ nextBestAction: action });
});

// 5. Blueprint & Feasibility
apiRouter.get('/projects/:id/blueprint', (req, res) => {
  const blueprint = db.getBlueprint(req.params.id);
  res.json({ blueprint });
});

apiRouter.put('/projects/:id/blueprint', (req, res) => {
  const updated = db.setBlueprint(req.params.id, req.body.blueprint);
  serverCache.invalidateByTag(`project:${req.params.id}`);
  db.addActivity(req.params.id, 'Student / Guide', 'STUDENT', 'BLUEPRINT_UPDATED', 'Updated technical blueprint specifications.');
  res.json({ blueprint: updated });
});

apiRouter.get('/projects/:id/feasibility', (req, res) => {
  const feasibility = db.getFeasibility(req.params.id);
  res.json({ feasibility });
});

// 6. Development Roadmap & Tasks
apiRouter.get('/projects/:id/phases', (req, res) => {
  const phases = db.getPhases(req.params.id);
  res.json({ phases });
});

apiRouter.get('/projects/:id/tasks', (req, res) => {
  const tasks = db.getTasks(req.params.id);
  res.json({ tasks });
});

apiRouter.post('/projects/:id/tasks', (req, res) => {
  const currentUser = db.getUserById(currentActiveUserId) || db.getUsers()[0];
  const task: Task = {
    id: `tsk_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    projectId: req.params.id,
    phaseId: req.body.phaseId || 'ph_1',
    milestoneId: req.body.milestoneId || 'ms_1',
    title: req.body.title || 'New Project Task',
    description: req.body.description || '',
    status: req.body.status || 'TODO',
    priority: req.body.priority || 'MEDIUM',
    estimateHours: req.body.estimateHours || 8,
    deadline: req.body.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dependencies: req.body.dependencies || [],
    assignedUserId: req.body.assignedUserId || currentUser.id,
    assignedUserName: req.body.assignedUserName || currentUser.name,
    requiredSkill: req.body.requiredSkill,
    technologyTag: req.body.technologyTag || 'Core',
    acceptanceCriteria: req.body.acceptanceCriteria || ['Verify functional outcome'],
    notes: req.body.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const created = db.createTask(task);
  serverCache.invalidateByTag(`project:${req.params.id}`);
  res.status(201).json({ task: created });
});

apiRouter.put('/projects/:id/tasks/:taskId', (req, res) => {
  const updated = db.updateTask(req.params.id, req.params.taskId, req.body);
  if (!updated) return res.status(404).json({ error: 'Task not found' });
  serverCache.invalidateByTag(`project:${req.params.id}`);
  res.json({ task: updated });
});

apiRouter.delete('/projects/:id/tasks/:taskId', (req, res) => {
  const success = db.deleteTask(req.params.id, req.params.taskId);
  serverCache.invalidateByTag(`project:${req.params.id}`);
  res.json({ success });
});

// 7. Skills & Learning Modules
apiRouter.get('/projects/:id/skills', (req, res) => {
  const skillGaps = db.getSkillGaps(req.params.id);
  const learningModules = db.getLearningModules(req.params.id);
  res.json({ skillGaps, learningModules });
});

apiRouter.put('/projects/:id/learning-modules/:moduleId', (req, res) => {
  const updated = db.updateLearningModule(req.params.id, req.params.moduleId, req.body);
  if (!updated) return res.status(404).json({ error: 'Learning module not found' });
  res.json({ module: updated });
});

// 8. AI Project Mentor
apiRouter.get('/projects/:id/mentor/messages', (req, res) => {
  const messages = db.getMentorMessages(req.params.id);
  res.json({ messages });
});

apiRouter.post('/projects/:id/mentor/ask', async (req, res) => {
  const { question } = req.body;
  if (!question || !question.trim()) {
    return res.status(400).json({ error: 'Question text required' });
  }

  // 1. Save student message
  const studentMsg = db.addMentorMessage(req.params.id, {
    id: `msg_${Date.now()}_s`,
    sender: 'student',
    text: question,
    timestamp: new Date().toISOString()
  });

  // 2. Query Grounded AI Mentor
  const aiResult = await GeminiService.queryMentor({
    projectId: req.params.id,
    studentQuestion: question
  });

  // 3. Save mentor response
  const mentorMsg = db.addMentorMessage(req.params.id, {
    id: `msg_${Date.now()}_m`,
    sender: 'mentor',
    text: aiResult.answerText,
    timestamp: new Date().toISOString(),
    contextSources: aiResult.contextSources,
    actionSuggestion: aiResult.actionSuggestion
  });

  res.json({
    studentMessage: studentMsg,
    mentorMessage: mentorMsg,
    meta: aiResult.meta
  });
});

// 9. Quality Analysis
apiRouter.get('/projects/:id/quality', (req, res) => {
  const quality = db.getQualityAnalysis(req.params.id);
  res.json({ quality });
});

apiRouter.post('/projects/:id/quality/re-evaluate', (req, res) => {
  const existing = db.getQualityAnalysis(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Quality record not found' });

  // Dynamically re-evaluate based on task completion
  const tasks = db.getTasks(req.params.id);
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;
  const total = tasks.length;
  const progressRatio = total > 0 ? completed / total : 0.5;

  const newOverall = Math.min(95, Math.round(75 + progressRatio * 20));
  const updatedQuality = {
    ...existing,
    overallScore: newOverall,
    industryReadiness: Math.min(92, Math.round(72 + progressRatio * 20)),
    academicCompleteness: Math.min(96, Math.round(85 + progressRatio * 11)),
    evaluatedAt: new Date().toISOString()
  };

  db.setQualityAnalysis(req.params.id, updatedQuality);
  db.addActivity(req.params.id, 'Quality Analyzer', 'STUDENT', 'QUALITY_AUDITED', `Re-evaluated quality score: ${newOverall}/100.`);
  res.json({ quality: updatedQuality });
});

// 10. Documentation Center
apiRouter.get('/projects/:id/documents', (req, res) => {
  const documents = db.getDocuments(req.params.id);
  res.json({ documents });
});

apiRouter.put('/projects/:id/documents/:docId', (req, res) => {
  const doc = db.saveDocument(req.body.document);
  db.addActivity(req.params.id, 'Alex Rivera', 'STUDENT', 'DOCUMENT_UPDATED', `Updated document: ${doc.title} (v${doc.version})`);
  res.json({ document: doc });
});

// 11. Viva Voce & Presentation Preparation
apiRouter.get('/projects/:id/viva', (req, res) => {
  const viva = db.getVivaPrep(req.params.id);
  res.json({ viva });
});

apiRouter.post('/projects/:id/viva/evaluate-answer', async (req, res) => {
  const { questionId, userAnswer } = req.body;
  const viva = db.getVivaPrep(req.params.id);
  if (!viva) return res.status(404).json({ error: 'Viva records not found' });

  const question = viva.questions.find(q => q.id === questionId);
  if (!question) return res.status(404).json({ error: 'Question not found' });

  const evaluation = await GeminiService.evaluateVivaAnswer({
    question: question.question,
    expectedKeyPoints: question.expectedKeyPoints,
    userAnswer,
    projectContext: question.projectGroundedContext
  });

  question.userAnswer = userAnswer;
  question.evaluation = {
    score: evaluation.score,
    feedback: evaluation.feedback,
    weakTopicDetected: evaluation.weakTopicDetected
  };

  // Recalculate average viva readiness
  const answered = viva.questions.filter(q => q.evaluation);
  if (answered.length > 0) {
    const avg = Math.round(answered.reduce((sum, q) => sum + (q.evaluation?.score || 0), 0) / answered.length);
    viva.overallReadinessScore = avg;
  }
  db.setVivaPrep(req.params.id, viva);

  res.json({ question, evaluation, overallReadinessScore: viva.overallReadinessScore });
});

// 12. Faculty / Guide Portal & Reviews
apiRouter.get('/projects/:id/faculty-reviews', (req, res) => {
  const reviews = db.getFacultyReviews(req.params.id);
  res.json({ reviews });
});

apiRouter.post(
  '/projects/:id/faculty-reviews',
  requireRole(['FACULTY', 'ADMIN'], () => currentActiveUserId),
  (req, res) => {
    const currentUser = db.getUserById(currentActiveUserId) || db.getUsers()[1];
    const { status, overallScore, reviewNotes, privateGuideNotes, feedbackList } = req.body;

    const review = db.addFacultyReview({
      id: `fr_${Date.now()}`,
      projectId: req.params.id,
      facultyId: currentUser.id,
      facultyName: currentUser.name,
      status: status || 'APPROVED',
      overallScore: overallScore || 88,
      reviewNotes: reviewNotes || 'Project reviewed.',
      privateGuideNotes: privateGuideNotes || '',
      feedbackList: feedbackList || [],
      submittedAt: new Date().toISOString()
    });

    // If approved or change requested, update project status
    if (status === 'APPROVED') {
      db.updateProject(req.params.id, { status: 'APPROVED' });
    } else if (status === 'CHANGE_REQUESTED') {
      db.updateProject(req.params.id, { status: 'FACULTY_REVIEW' });
    }

    serverCache.invalidateByTag(`project:${req.params.id}`);
    res.status(201).json({ review });
  }
);

// 13. Project Intelligence & RAG
apiRouter.get('/projects/:id/intelligence', (req, res) => {
  const chunks = db.getKnowledgeChunks(req.params.id);
  const conflicts = db.getKnowledgeConflicts(req.params.id);
  const gaps = db.getKnowledgeGaps(req.params.id);
  const decisions = db.getDecisions(req.params.id);
  const evidences = db.getEvidences(req.params.id);
  const completeness = ProjectIntelligenceService.getKnowledgeCompleteness(req.params.id);
  const graph = ProjectIntelligenceService.getKnowledgeGraph(req.params.id);

  res.json({
    chunks,
    conflicts,
    gaps,
    decisions,
    evidences,
    completeness,
    graph
  });
});

apiRouter.post('/projects/:id/intelligence/search', (req, res) => {
  const { query } = req.body;
  const results = ProjectIntelligenceService.retrieveContext(req.params.id, query || '', 5);
  res.json({ results });
});

apiRouter.post('/projects/:id/intelligence/conflicts/:conflictId/resolve', (req, res) => {
  const success = db.resolveKnowledgeConflict(req.params.id, req.params.conflictId);
  res.json({ success });
});

apiRouter.post('/projects/:id/intelligence/decisions', (req, res) => {
  const currentUser = db.getUserById(currentActiveUserId) || db.getUsers()[0];
  const { title, contextProblem, chosenSolution, alternativesConsidered, impactAndConsequences } = req.body;

  const decision = db.addDecision({
    id: `dec_${Date.now()}`,
    projectId: req.params.id,
    title: title || 'New Architectural Decision',
    decisionNumber: db.getDecisions(req.params.id).length + 1,
    date: new Date().toISOString().split('T')[0],
    status: 'ACCEPTED',
    contextProblem: contextProblem || '',
    chosenSolution: chosenSolution || '',
    alternativesConsidered: alternativesConsidered || [],
    impactAndConsequences: impactAndConsequences || [],
    author: currentUser.name
  });

  res.status(201).json({ decision });
});

// 14. Project Risks, Evidence, & Changes
apiRouter.get('/projects/:id/risks', (req, res) => {
  const risks = db.getRisks(req.params.id);
  res.json({ risks });
});

apiRouter.put('/projects/:id/risks/:riskId', (req, res) => {
  const updated = db.updateRisk(req.params.id, req.params.riskId, req.body);
  res.json({ risk: updated });
});

apiRouter.get('/projects/:id/change-requests', (req, res) => {
  const changeRequests = db.getChangeRequests(req.params.id);
  res.json({ changeRequests });
});

apiRouter.post('/projects/:id/change-requests', (req, res) => {
  const currentUser = db.getUserById(currentActiveUserId) || db.getUsers()[0];
  const cr = db.addChangeRequest({
    id: `cr_${Date.now()}`,
    projectId: req.params.id,
    title: req.body.title || 'Proposed Scope Adjustment',
    description: req.body.description || '',
    reason: req.body.reason || '',
    impactOnDeadline: req.body.impactOnDeadline || 'Minimal',
    impactOnScope: req.body.impactOnScope || 'Refines module boundaries',
    priority: req.body.priority || 'MEDIUM',
    requestedBy: currentUser.name,
    status: 'PROPOSED',
    createdAt: new Date().toISOString()
  });
  res.status(201).json({ changeRequest: cr });
});

// 15. Activity Log
apiRouter.get('/projects/:id/activities', (req, res) => {
  const activities = db.getActivities(req.params.id);
  res.json({ activities });
});

// 16. Portfolio & Showcase
apiRouter.get('/projects/:id/portfolio', (req, res) => {
  const portfolio = db.getPortfolio(req.params.id);
  res.json({ portfolio });
});

apiRouter.put('/projects/:id/portfolio', (req, res) => {
  const portfolio = db.setPortfolio(req.body.portfolio);
  db.addActivity(req.params.id, 'Alex Rivera', 'STUDENT', 'PORTFOLIO_UPDATED', `Portfolio publication state: ${portfolio.isPublic ? 'PUBLIC' : 'PRIVATE'}`);
  res.json({ portfolio });
});

// 17. AI Project Recommendation Ideas
apiRouter.post('/ai/recommend-ideas', rateLimiter(25, 60000, 'ai_rec'), async (req, res) => {
  const result = await GeminiService.generateProjectIdeas(req.body);
  res.json(result);
});

// 18. Copilot Action Execution (Safe explicit confirmation workflow)
apiRouter.post('/copilot/execute-action', rateLimiter(40, 60000, 'copilot_exec'), (req, res) => {
  const { action, projectId } = req.body;
  const currentUser = db.getUserById(currentActiveUserId) || db.getUsers()[0];

  if (!action || !projectId) {
    return res.status(400).json({ error: 'Action object and projectId required' });
  }

  const validation = ProjectIntelligenceService.validateCopilotAction(action);
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.warning });
  }

  let resultMessage = 'Action executed successfully.';

  if (action.type === 'UPDATE_TASK' && action.details?.taskId) {
    const task = db.updateTask(projectId, action.details.taskId, {
      notes: `${action.details.appendCriteria || 'Updated per faculty directive.'}`,
      status: 'IN_PROGRESS'
    });
    serverCache.invalidateByTag(`project:${projectId}`);
    resultMessage = `Task ${task?.title} updated to IN_PROGRESS with clinical override criteria.`;
  } else if (action.type === 'CREATE_TASK') {
    const newTask = db.createTask({
      id: `tsk_${Date.now()}`,
      projectId,
      phaseId: 'ph_2',
      milestoneId: 'ms_4',
      title: action.title,
      description: action.summary,
      status: 'TODO',
      priority: 'HIGH',
      estimateHours: 10,
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dependencies: [],
      assignedUserId: currentUser.id,
      assignedUserName: currentUser.name,
      technologyTag: 'System',
      acceptanceCriteria: ['Implement recommended safety check', 'Verify with test'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    serverCache.invalidateByTag(`project:${projectId}`);
    resultMessage = `Created task: ${newTask.title}`;
  }

  db.logAudit(currentUser.id, currentUser.name, 'COPILOT_ACTION_EXECUTED', `Action: ${action.title}`);
  res.json({ success: true, message: resultMessage });
});

// 19. Admin Overview & Operations
apiRouter.get('/admin/overview', (req, res) => {
  const users = db.getUsers();
  const projects = db.getProjects();
  const auditLogs = db.getAuditLogs();
  const aiLogs = db.getAiUsageLogs();
  const announcements = db.getAnnouncements();

  res.json({
    users,
    projects,
    auditLogs,
    aiLogs,
    announcements,
    systemHealth: {
      uptimeSeconds: Math.round(process.uptime()),
      memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      dbEngine: 'IN_MEMORY_PERSISTENT_STORE',
      activeUsers: users.length,
      activeProjects: projects.length
    }
  });
});

apiRouter.get('/admin/stats', (req, res) => {
  res.json(db.getStats());
});

apiRouter.post(
  '/admin/reset',
  requireRole(['ADMIN'], () => currentActiveUserId),
  (req, res) => {
    db.reset();
    serverCache.clear();
    res.json({ success: true, message: 'Database reset, reseeded, and caches flushed successfully' });
  }
);
