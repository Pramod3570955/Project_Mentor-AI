export type UserRole = 'STUDENT' | 'FACULTY' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department: string;
  semesterYear?: string;
  createdAt: string;
}

export interface StudentProfile {
  userId: string;
  department: string;
  semesterYear: string;
  skills: { name: string; proficiency: number; category: string }[];
  interests: string[];
  careerGoals: string[];
  experienceLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  preferredTechnologies: string[];
  teamSize: number;
  availableHoursPerWeek: number;
  projectDurationWeeks: number;
  budgetBudget: number;
  hardwareLimitations: string[];
}

export interface FacultyProfile {
  userId: string;
  department: string;
  designation: string;
  specializations: string[];
  assignedStudentIds: string[];
  assignedProjectIds: string[];
}

export type ProjectStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'READY_FOR_REVIEW'
  | 'FACULTY_REVIEW'
  | 'APPROVED'
  | 'COMPLETED'
  | 'ARCHIVED'
  | 'REOPENED';

export interface ProjectScope {
  mvp: string[];
  currentScope: string[];
  futureScope: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  domain: string;
  abstract: string;
  problemStatement: string;
  objectives: string[];
  status: ProjectStatus;
  ownerId: string;
  ownerName: string;
  facultyGuideId?: string;
  facultyGuideName?: string;
  teamMembers: { userId: string; name: string; role: string }[];
  technologies: string[];
  startDate: string;
  targetCompletionDate: string;
  durationWeeks: number;
  budget: number;
  targetUsers: string[];
  scope: ProjectScope;
  repositoryUrl?: string;
  demoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeasibilityAnalysis {
  projectId: string;
  overallScore: number; // 0-100
  breakdown: {
    technical: number;
    time: number;
    skill: number;
    team: number;
    resource: number;
    hardware: number;
    budget: number;
  };
  complexity: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  academicSuitability: string;
  realWorldValue: string;
  strengths: string[];
  weaknesses: string[];
  majorRisks: string[];
  actionableRecommendations: string[];
  mvpScope: string[];
  futureScope: string[];
  resourceRequirements: string[];
  timelineEstimateWeeks: number;
}

export interface DatabaseEntity {
  name: string;
  description: string;
  fields: { name: string; type: string; constraints: string }[];
  relationships: string[];
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  authRequired: boolean;
  requestPayload?: string;
  responsePayload?: string;
}

export interface BlueprintModule {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  keyFeatures: string[];
  dependencies: string[];
}

export interface ProjectBlueprint {
  projectId: string;
  version: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'CHANGE_REQUESTED';
  abstract: string;
  problemStatement: string;
  existingSystemAnalysis: string;
  proposedSystemArchitecture: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  technologyStack: { layer: string; technology: string; reason: string }[];
  modules: BlueprintModule[];
  databaseDesign: DatabaseEntity[];
  apiEndpoints: ApiEndpoint[];
  securityMeasures: string[];
  aiArchitecture?: string;
  ragArchitecture?: string;
  testingStrategy: { type: string; coverageTarget: string; tools: string[] }[];
  deploymentPlan: string;
  successMetrics: string[];
  updatedAt: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED';
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Task {
  id: string;
  projectId: string;
  phaseId: string;
  milestoneId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: PriorityLevel;
  estimateHours: number;
  actualHours?: number;
  deadline: string;
  dependencies: string[]; // task IDs
  assignedUserId: string;
  assignedUserName: string;
  requiredSkill?: string;
  technologyTag: string;
  acceptanceCriteria: string[];
  notes?: string;
  learningRequirementId?: string;
  evidenceRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}

export interface DevelopmentPhase {
  id: string;
  projectId: string;
  title: string;
  description: string;
  order: number;
  milestones: Milestone[];
}

export interface SkillGap {
  id: string;
  skillName: string;
  category: string;
  currentProficiency: number; // 0-100
  requiredProficiency: number; // 0-100
  gapScore: number; // required - current
  priority: PriorityLevel;
  isBlocking: boolean;
  blockingTaskTitle?: string;
  blockingTaskId?: string;
  suggestedModules: string[];
}

export interface LearningModule {
  id: string;
  skillGapId: string;
  title: string;
  description: string;
  mode: 'QUICK' | 'DEEP' | 'PRACTICE' | 'PROJECT_APPLICATION' | 'REVISION';
  estimatedHours: number;
  learningOutcomes: string[];
  resources: { title: string; type: string; linkOrGuide: string }[];
  practicalChallenge: string;
  quiz: { question: string; options: string[]; answerIndex: number; explanation: string }[];
  isCompleted: boolean;
  confidenceScore: number;
}

export interface MentorMessage {
  id: string;
  sender: 'student' | 'mentor';
  text: string;
  timestamp: string;
  contextSources?: { title: string; authority: string; excerpt: string }[];
  actionSuggestion?: CopilotAction;
}

export interface QualityCategoryScore {
  category:
    | 'Functionality'
    | 'Architecture'
    | 'Database'
    | 'API'
    | 'Security'
    | 'Testing'
    | 'UI/UX'
    | 'Documentation'
    | 'Deployment'
    | 'Performance'
    | 'Innovation';
  score: number; // 0-100
  status: 'STRONG' | 'OPPORTUNITY' | 'WEAK' | 'RISK' | 'MISSING';
  findings: string[];
  remediations: string[];
}

export interface QualityAnalysis {
  projectId: string;
  overallScore: number; // 0-100
  industryReadiness: number; // 0-100
  academicCompleteness: number; // 0-100
  projectMaturity: 'EARLY_STAGE' | 'DEVELOPING' | 'ADVANCED' | 'PRODUCTION_READY';
  categories: QualityCategoryScore[];
  strengths: string[];
  criticalRisks: string[];
  prioritizedImprovements: { action: string; impact: string; category: string }[];
  evaluatedAt: string;
}

export type DocumentType =
  | 'PROPOSAL'
  | 'SYNOPSIS'
  | 'ABSTRACT'
  | 'FINAL_REPORT'
  | 'SRS'
  | 'ARCHITECTURE_DOC'
  | 'API_DOCS'
  | 'TESTING_DOCS'
  | 'USER_MANUAL'
  | 'PRESENTATION_SLIDES';

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  isVerifiedFact: boolean;
  sourceAuthority: 'VERIFIED' | 'APPROVED' | 'STUDENT_PROVIDED' | 'AI_GENERATED';
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  type: DocumentType;
  version: number;
  lastUpdated: string;
  outline: string[];
  sections: DocumentSection[];
  verifiedDataItems: string[];
  studentProvidedItems: string[];
  aiNarrativeSummary: string;
}

export interface VivaQuestion {
  id: string;
  category: 'ARCH' | 'DB' | 'API' | 'SECURITY' | 'TESTING' | 'ACADEMIC' | 'GENERAL';
  difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  question: string;
  expectedKeyPoints: string[];
  sampleModelAnswer: string;
  projectGroundedContext: string;
  userAnswer?: string;
  evaluation?: { score: number; feedback: string; weakTopicDetected?: string };
}

export interface VivaPreparation {
  projectId: string;
  pitch1Min: string;
  pitch3Min: string;
  pitch5Min: string;
  slideDeckStructure: { slideNumber: number; title: string; bulletPoints: string[]; speakerNotes: string }[];
  questions: VivaQuestion[];
  overallReadinessScore: number;
}

export interface FacultyFeedbackItem {
  id: string;
  date: string;
  category: 'BLUEPRINT' | 'ROADMAP' | 'QUALITY' | 'DOCUMENTATION' | 'GENERAL';
  feedback: string;
  requiredAction?: string;
  isResolved: boolean;
}

export interface FacultyReview {
  id: string;
  projectId: string;
  facultyId: string;
  facultyName: string;
  status: 'PENDING' | 'APPROVED' | 'CHANGE_REQUESTED' | 'REJECTED';
  overallScore: number;
  reviewNotes: string;
  privateGuideNotes: string;
  feedbackList: FacultyFeedbackItem[];
  submittedAt: string;
  nextScheduledReview?: string;
}

export type AuthorityLevel = 'VERIFIED' | 'APPROVED' | 'STUDENT_PROVIDED' | 'AI_GENERATED' | 'INFERRED';

export interface KnowledgeDocument {
  id: string;
  projectId: string;
  title: string;
  sourceType: 'BLUEPRINT' | 'ROADMAP' | 'CODE_SPEC' | 'FACULTY_NOTE' | 'DECISION' | 'EVIDENCE';
  authority: AuthorityLevel;
  content: string;
  chunkCount: number;
  updatedAt: string;
}

export interface KnowledgeChunk {
  id: string;
  docId: string;
  projectId: string;
  content: string;
  authority: AuthorityLevel;
  category: string;
  keywords: string[];
  relevanceScore?: number;
}

export interface KnowledgeConflict {
  id: string;
  topic: string;
  description: string;
  sourceA: { title: string; authority: AuthorityLevel; text: string };
  sourceB: { title: string; authority: AuthorityLevel; text: string };
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestedResolution: string;
  resolved: boolean;
}

export interface KnowledgeGap {
  id: string;
  area: string;
  description: string;
  impactOnViva: string;
  impactOnQuality: string;
  recommendedAction: string;
}

export interface ProjectDecision {
  id: string;
  projectId: string;
  title: string;
  decisionNumber: number;
  date: string;
  status: 'PROPOSED' | 'ACCEPTED' | 'SUPERSEDED';
  contextProblem: string;
  chosenSolution: string;
  alternativesConsidered: string[];
  impactAndConsequences: string[];
  author: string;
}

export interface ProjectEvidence {
  id: string;
  projectId: string;
  blueprintFeatureId: string;
  featureTitle: string;
  linkedTaskId?: string;
  evidenceStatus: 'PLANNED' | 'IN_PROGRESS' | 'IMPLEMENTED' | 'TESTED' | 'VERIFIED';
  codeArtifactRef?: string;
  testResultRef?: string;
  documentationRef?: string;
  verifiedByFaculty: boolean;
}

export type HealthStatus = 'HEALTHY' | 'NEEDS_ATTENTION' | 'AT_RISK' | 'CRITICAL';

export interface ProjectHealth {
  status: HealthStatus;
  score: number; // 0-100
  factors: {
    roadmapProgress: number; // 0-100%
    overdueTasksCount: number;
    blockedTasksCount: number;
    unresolvedSkillGapsCount: number;
    qualityScore: number;
    documentationCompleteness: number;
    facultyApprovalStatus: string;
    knowledgeCompleteness: number;
    daysRemaining: number;
  };
  summarySentence: string;
}

export interface RiskItem {
  id: string;
  projectId: string;
  title: string;
  category: 'DEADLINE' | 'SCOPE' | 'SKILL' | 'DEPENDENCY' | 'QUALITY' | 'TESTING' | 'FACULTY' | 'SECURITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  probability: 'LOW' | 'MEDIUM' | 'HIGH';
  impactExplanation: string;
  recommendedMitigation: string;
  linkedTaskId?: string;
  isMitigated: boolean;
}

export interface ProjectChangeRequest {
  id: string;
  projectId: string;
  title: string;
  description: string;
  reason: string;
  impactOnDeadline: string;
  impactOnScope: string;
  priority: PriorityLevel;
  requestedBy: string;
  status: 'PROPOSED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED';
  approvedBy?: string;
  createdAt: string;
}

export interface CopilotAction {
  id: string;
  type:
    | 'CREATE_TASK'
    | 'UPDATE_TASK'
    | 'CREATE_LEARNING_TASK'
    | 'UPDATE_ROADMAP'
    | 'RESOLVE_RISK'
    | 'DRAFT_DOC_SECTION'
    | 'SCHEDULE_FACULTY_REVIEW';
  title: string;
  summary: string;
  details: Record<string, any>;
  requiresConfirmation: boolean;
  executed?: boolean;
}

export interface ActivityEvent {
  id: string;
  projectId: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  eventType: string;
  description: string;
}

export interface PortfolioShowcase {
  projectId: string;
  isPublic: boolean;
  title: string;
  summary: string;
  problemSolved: string;
  techStackBadges: string[];
  keyFeatures: string[];
  studentRole: string;
  demoUrl?: string;
  githubUrl?: string;
  readinessScore: number;
  publishedDate?: string;
}
