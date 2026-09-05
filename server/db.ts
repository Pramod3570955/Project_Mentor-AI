import {
  User,
  Project,
  FeasibilityAnalysis,
  ProjectBlueprint,
  DevelopmentPhase,
  Task,
  SkillGap,
  LearningModule,
  MentorMessage,
  QualityAnalysis,
  ProjectDocument,
  VivaPreparation,
  FacultyReview,
  KnowledgeDocument,
  KnowledgeChunk,
  KnowledgeConflict,
  KnowledgeGap,
  ProjectDecision,
  ProjectEvidence,
  RiskItem,
  ProjectChangeRequest,
  ActivityEvent,
  PortfolioShowcase
} from '../src/types/index.js';

export interface DatabaseState {
  users: User[];
  projects: Project[];
  feasibilities: Record<string, FeasibilityAnalysis>;
  blueprints: Record<string, ProjectBlueprint>;
  phases: Record<string, DevelopmentPhase[]>;
  tasks: Record<string, Task[]>;
  skillGaps: Record<string, SkillGap[]>;
  learningModules: Record<string, LearningModule[]>;
  mentorConversations: Record<string, MentorMessage[]>;
  qualityAnalyses: Record<string, QualityAnalysis>;
  documents: Record<string, ProjectDocument[]>;
  vivaPreps: Record<string, VivaPreparation>;
  facultyReviews: Record<string, FacultyReview[]>;
  knowledgeDocs: Record<string, KnowledgeDocument[]>;
  knowledgeChunks: Record<string, KnowledgeChunk[]>;
  knowledgeConflicts: Record<string, KnowledgeConflict[]>;
  knowledgeGaps: Record<string, KnowledgeGap[]>;
  decisions: Record<string, ProjectDecision[]>;
  evidences: Record<string, ProjectEvidence[]>;
  risks: Record<string, RiskItem[]>;
  changeRequests: Record<string, ProjectChangeRequest[]>;
  activities: Record<string, ActivityEvent[]>;
  portfolios: Record<string, PortfolioShowcase>;
  auditLogs: { id: string; timestamp: string; actorId: string; actorName: string; action: string; details: string }[];
  aiUsageLogs: { id: string; timestamp: string; promptTokens: number; completionTokens: number; model: string; feature: string; durationMs: number; status: 'SUCCESS' | 'FALLBACK' | 'ERROR' }[];
  announcements: { id: string; title: string; content: string; date: string; priority: 'NORMAL' | 'URGENT' }[];
}

const initialUsers: User[] = [
  {
    id: 'usr_student_1',
    name: 'Alex Rivera',
    email: 'alex.rivera@university.edu',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    semesterYear: 'Semester 8, Final Year B.Tech',
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'usr_faculty_1',
    name: 'Prof. Sarah Jenkins',
    email: 'sarah.jenkins@university.edu',
    role: 'FACULTY',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    createdAt: '2025-08-10T09:00:00Z'
  },
  {
    id: 'usr_admin_1',
    name: 'Dr. Marcus Vance',
    email: 'marcus.vance@university.edu',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Academic Computing & Innovation Cell',
    createdAt: '2025-06-01T09:00:00Z'
  }
];

const initialProject: Project = {
  id: 'proj_vitalflow_1',
  title: 'VitalFlow: Edge AI Clinical Triage & Deterioration Early Warning System',
  category: 'Healthcare & Edge Computing',
  domain: 'Applied Artificial Intelligence / Biomedical Systems',
  abstract:
    'VitalFlow is an intelligent clinical edge-computing platform that processes continuous ICU telemetry, patient vital signs, and bedside sensor streams in real time. Utilizing quantized time-series transformer models at the edge gateway, it predicts patient septic shock and hemodynamic decompensation 4 to 6 hours before clinical onset, mitigating ICU alarm fatigue and empowering rapid medical intervention.',
  problemStatement:
    'In intensive care units, delayed detection of septic shock increases patient mortality by 7.6% per hour of delay. Current bedside monitoring systems trigger up to 85% false alarm rates (alarm fatigue), while centralized cloud telemetry introduces critical latency, patient data privacy concerns, and network single-points-of-failure in critical clinical workflows.',
  objectives: [
    'Deploy sub-50ms quantized predictive inference at edge hospital nodes using ONNX runtime.',
    'Reduce clinical false alarm frequency by at least 65% using multimodal Bayesian sensor fusion.',
    'Provide explainable clinical attention heatmaps showing which physiological markers triggered triage warnings.',
    'Implement HIPAA-compliant zero-knowledge transport for longitudinal patient electronic health records.'
  ],
  status: 'ACTIVE',
  ownerId: 'usr_student_1',
  ownerName: 'Alex Rivera',
  facultyGuideId: 'usr_faculty_1',
  facultyGuideName: 'Prof. Sarah Jenkins',
  teamMembers: [
    { userId: 'usr_student_1', name: 'Alex Rivera', role: 'Lead Architect & ML Engineer' },
    { userId: 'usr_student_2', name: 'Maya Lin', role: 'Backend & Edge Systems Developer' }
  ],
  technologies: ['TypeScript', 'React', 'Python', 'FastAPI', 'ONNX Runtime', 'PostgreSQL', 'TimescaleDB', 'Docker', 'WebSockets', 'Tailwind CSS'],
  startDate: '2026-01-20',
  targetCompletionDate: '2026-05-15',
  durationWeeks: 16,
  budget: 450,
  targetUsers: ['ICU Intensivists', 'Triage Triage Nurses', 'Clinical Bio-engineers', 'Hospital Administrators'],
  scope: {
    mvp: [
      'Multi-channel synthetic & MIMIC-IV telemetry ingestion',
      'Quantized Edge Transformer for 4-hour shock risk prediction',
      'Real-time WebSocket alerting clinical dashboard',
      'Audit log and clinician acknowledgment workflow'
    ],
    currentScope: [
      'Vital signs trend projection with uncertainty intervals',
      'Explainability attention weight visualization',
      'Role-based clinician workstation access',
      'Offline edge queue synchronization'
    ],
    futureScope: [
      'Federated learning across multi-hospital research networks',
      'Hardware accelerator ASIC micro-code compilation',
      'Direct integration with Epic & Cerner HL7/FHIR EHR pipelines'
    ]
  },
  repositoryUrl: 'https://github.com/alexrivera-cs/vitalflow-edge-ai',
  demoUrl: 'https://vitalflow.demo.internal.hospital.org',
  createdAt: '2026-01-20T10:00:00Z',
  updatedAt: '2026-03-01T14:30:00Z'
};

const initialFeasibility: FeasibilityAnalysis = {
  projectId: 'proj_vitalflow_1',
  overallScore: 88,
  breakdown: {
    technical: 86,
    time: 84,
    skill: 88,
    team: 90,
    resource: 85,
    hardware: 92,
    budget: 91
  },
  complexity: 'HIGH',
  academicSuitability:
    'Exemplary final-year capstone standard: combines rigorous time-series machine learning, edge deployment constraints, systems engineering, and ethical biomedical considerations.',
  realWorldValue:
    'Directly tackles hospital alarm fatigue and preventable ICU mortality with quantifiable patient impact and lower edge operational cost.',
  strengths: [
    'Clear domain motivation supported by open clinical benchmark datasets (PhysioNet / MIMIC-IV).',
    'Edge deployment eliminates heavy cloud GPU operational bills and resolves strict hospital data egress constraints.',
    'Well-scoped MVP with verifiable deliverables at each semester milestone.'
  ],
  weaknesses: [
    'Model inference latency on low-power ARM edge boards requires aggressive quantization (INT8/FP16).',
    'Clinical validation without live hospital institutional review requires rigorous cross-fold validation on PhysioNet.'
  ],
  majorRisks: [
    'Sensor dropouts during streaming could cause inference failure if missing-value imputation is not resilient.',
    'Complex clinical jargon may require faculty guidance during viva presentation.'
  ],
  actionableRecommendations: [
    'Implement forward-fill + bidirectional spline interpolation for dropped telemetry packets.',
    'Package edge runtime as a lightweight Docker container with ONNX CPU execution provider fallback.',
    'Create an offline telemetry simulator to showcase real-time alarms during viva presentation without live hardware.'
  ],
  mvpScope: [
    'Synthesizer for 4 vital parameters: MAP, SpO2, Heart Rate, Respiration Rate',
    'Edge inference service delivering alert risk score in <100ms',
    'Web dashboard with live SVG waveform rendering'
  ],
  futureScope: ['Arterial blood gas lab integration', 'Automated vasopressor infusion titration support'],
  resourceRequirements: [
    'PhysioNet Credentialed Access (obtained)',
    'Edge Gateway simulation: Raspberry Pi 5 or local Docker environment',
    'Python 3.11 with PyTorch and ONNX Runtime'
  ],
  timelineEstimateWeeks: 16
};

const initialBlueprint: ProjectBlueprint = {
  projectId: 'proj_vitalflow_1',
  version: 2,
  status: 'APPROVED',
  abstract: initialProject.abstract,
  problemStatement: initialProject.problemStatement,
  existingSystemAnalysis:
    'Existing clinical monitors rely on static threshold alerts (e.g. SpO2 < 90%), generating 350+ alerts per bed per day. Centralized EHR analytics suffer 15-30 minute processing batch lags, rendering early intervention impossible for rapid sepsis onset.',
  proposedSystemArchitecture:
    'VitalFlow employs a 3-tier decentralized topology: Tier 1 Edge Device Ingestion (MQTT/ZeroMQ), Tier 2 Edge Inference Engine (FastAPI + ONNX Runtime executing quantized PatchTST model), and Tier 3 Clinical Web Workstation (React + WebSockets with encrypted state synchronization).',
  functionalRequirements: [
    'Continuous telemetry ingestion at 1Hz sampling frequency per patient channel.',
    'Real-time risk scoring (0.0 to 1.0) with sepsis onset likelihood index within 4 hours.',
    'Visual and audible priority-graded clinical alert broadcast with 3-tier severity.',
    'Clinician alert acknowledgment, notes appending, and dismissal audit logging.'
  ],
  nonFunctionalRequirements: [
    'Inference latency: < 50ms on edge processor.',
    'Telemetry buffer capacity: minimum 72 hours continuous offline circular buffer.',
    'System availability: 99.9% uptime with automatic process supervisor watchdog.',
    'Security: TLS 1.3 encryption in transit and AES-256 for patient records at rest.'
  ],
  technologyStack: [
    { layer: 'Frontend Workstation', technology: 'React 19 + TypeScript + Tailwind CSS', reason: 'High performance reactive UI with responsive waveform charting.' },
    { layer: 'Edge Ingestion & Inference', technology: 'Python 3.11 + FastAPI + ONNX Runtime', reason: 'Near C++ inference speeds with lightweight memory footprint.' },
    { layer: 'Telemetry Database', technology: 'PostgreSQL 16 + TimescaleDB extension', reason: 'Optimized chunking and continuous aggregation for time-series vitals.' },
    { layer: 'Communication Bus', technology: 'WebSockets (RFC 6455) + Redis Pub/Sub', reason: 'Ultra low-latency broadcast of real-time alerts to bedside tablets.' }
  ],
  modules: [
    {
      id: 'mod_ingest',
      name: 'Telemetry Ingestion & Signal Cleansing',
      description: 'Collects high-frequency vital signs, filters noise, and imputes missing sensor samples.',
      technologies: ['Python', 'SciPy', 'ZeroMQ'],
      keyFeatures: ['Outlier clamping', 'Rolling median filter', 'Missing packet forward-filling'],
      dependencies: []
    },
    {
      id: 'mod_inference',
      name: 'Quantized Edge Prediction Engine',
      description: 'Runs optimized Transformer model to calculate hemodynamic instability risk vectors.',
      technologies: ['ONNX Runtime', 'TensorRT', 'PyTorch'],
      keyFeatures: ['INT8 quantized model execution', 'Feature attribution extraction', 'Early shock alarm classification'],
      dependencies: ['mod_ingest']
    },
    {
      id: 'mod_workstation',
      name: 'Clinical Web Console',
      description: 'Web dashboard for intensivists and nurses with multi-bed overview and alert timelines.',
      technologies: ['React', 'TypeScript', 'WebSockets', 'Lucide Icons'],
      keyFeatures: ['Live vitals sparklines', 'Audible alert dispatcher', 'Acknowledgment log'],
      dependencies: ['mod_inference']
    }
  ],
  databaseDesign: [
    {
      name: 'patients',
      description: 'Core patient clinical profile and admission telemetry reference.',
      fields: [
        { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
        { name: 'mrn_hash', type: 'VARCHAR(64)', constraints: 'UNIQUE NOT NULL' },
        { name: 'bed_number', type: 'VARCHAR(16)', constraints: 'NOT NULL' },
        { name: 'admission_timestamp', type: 'TIMESTAMPTZ', constraints: 'NOT NULL' },
        { name: 'status', type: 'VARCHAR(24)', constraints: 'DEFAULT "MONITORED"' }
      ],
      relationships: ['Has many vital_readings', 'Has many clinical_alerts']
    },
    {
      name: 'vital_readings',
      description: 'Hypertable partitioned by time containing continuous telemetry data.',
      fields: [
        { name: 'time', type: 'TIMESTAMPTZ', constraints: 'NOT NULL' },
        { name: 'patient_id', type: 'UUID', constraints: 'REFERENCES patients(id)' },
        { name: 'heart_rate', type: 'SMALLINT', constraints: 'CHECK (heart_rate BETWEEN 20 AND 250)' },
        { name: 'map_blood_pressure', type: 'SMALLINT', constraints: 'NOT NULL' },
        { name: 'spo2', type: 'SMALLINT', constraints: 'CHECK (spo2 BETWEEN 50 AND 100)' },
        { name: 'resp_rate', type: 'SMALLINT', constraints: 'NOT NULL' }
      ],
      relationships: ['Belongs to patient']
    },
    {
      name: 'clinical_alerts',
      description: 'Recorded prediction alerts, clinician actions, and audit trail.',
      fields: [
        { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
        { name: 'patient_id', type: 'UUID', constraints: 'REFERENCES patients(id)' },
        { name: 'timestamp', type: 'TIMESTAMPTZ', constraints: 'NOT NULL' },
        { name: 'risk_score', type: 'FLOAT', constraints: 'NOT NULL' },
        { name: 'severity', type: 'VARCHAR(16)', constraints: 'CHECK (severity IN ("LOW", "MEDIUM", "HIGH", "CRITICAL"))' },
        { name: 'acknowledged_by', type: 'VARCHAR(64)', constraints: 'NULLABLE' }
      ],
      relationships: ['Belongs to patient']
    }
  ],
  apiEndpoints: [
    { method: 'POST', path: '/api/v1/telemetry/stream', description: 'Ingest batch telemetry packet from bedside edge gateway.', authRequired: true },
    { method: 'GET', path: '/api/v1/patients/active', description: 'List all currently monitored ICU beds and live triage scores.', authRequired: true },
    { method: 'POST', path: '/api/v1/alerts/{id}/acknowledge', description: 'Log nurse or doctor acknowledgment with clinical note.', authRequired: true },
    { method: 'GET', path: '/api/v1/inference/explain/{alertId}', description: 'Return feature importance weights for the triage prediction.', authRequired: true }
  ],
  securityMeasures: [
    'Zero identification storage: MRN is irreversibly salted and SHA-256 hashed.',
    'Role-based authorization: Attending Doctor vs Floor Nurse vs Admin permissions.',
    'TLS 1.3 mTLS client certificate authentication between Edge hardware and Central Server.'
  ],
  aiArchitecture:
    'PatchTST (Patch Time Series Transformer) compressed from 48M parameters to 4.2M parameters using Knowledge Distillation and INT8 Post-Training Quantization, achieving 89.2% AUROC on MIMIC-IV sepsis benchmark.',
  ragArchitecture:
    'Project Intelligence embeds architectural decisions, faculty review notes, and clinical protocol specs into hybrid sparse-dense vector chunks for instantaneous retrieval by the AI Mentor.',
  testingStrategy: [
    { type: 'Unit & Signal Math Tests', coverageTarget: '> 90%', tools: ['pytest', 'numpy.testing'] },
    { type: 'Edge Latency & Soak Benchmark', coverageTarget: '72h continuous load test', tools: ['Locust', 'Docker stats'] },
    { type: 'End-to-End Clinical Flow Tests', coverageTarget: '100% critical paths', tools: ['Playwright', 'Vitest'] }
  ],
  deploymentPlan:
    'Single command container orchestration via Docker Compose. Edge nodes run lightweight Alpine container; central dashboard runs on localized on-premise Linux workstation.',
  successMetrics: [
    'Inference latency <= 45ms',
    'False alarm reduction >= 65% compared to static threshold baseline',
    'Zero telemetry packet loss under 100 concurrent patient streams'
  ],
  updatedAt: '2026-02-28T16:00:00Z'
};

const initialPhases: DevelopmentPhase[] = [
  {
    id: 'ph_1',
    projectId: 'proj_vitalflow_1',
    title: 'Phase 1: Research, Dataset Sourcing & Edge Benchmark',
    description: 'Establish academic grounding, process PhysioNet MIMIC-IV data, and benchmark edge inference runtime.',
    order: 1,
    milestones: [
      { id: 'ms_1', phaseId: 'ph_1', title: 'MIMIC-IV Telemetry Feature Extraction', description: 'Clean and extract vital sign time slices.', dueDate: '2026-02-10', isCompleted: true },
      { id: 'ms_2', phaseId: 'ph_1', title: 'Baseline Model Quantization', description: 'Convert PyTorch weights to INT8 ONNX graph.', dueDate: '2026-02-24', isCompleted: true }
    ]
  },
  {
    id: 'ph_2',
    projectId: 'proj_vitalflow_1',
    title: 'Phase 2: Core Ingestion Engine & Real-Time Pipeline',
    description: 'Implement WebSocket signal streaming, TimescaleDB storage, and alert threshold classification.',
    order: 2,
    milestones: [
      { id: 'ms_3', phaseId: 'ph_2', title: 'Edge Telemetry Gateway', description: 'Simulate bedside sensor stream with jitter injection.', dueDate: '2026-03-15', isCompleted: false },
      { id: 'ms_4', phaseId: 'ph_2', title: 'Clinical Alert Dispatcher', description: 'Real-time alert broadcast with acknowledgment states.', dueDate: '2026-03-30', isCompleted: false }
    ]
  },
  {
    id: 'ph_3',
    projectId: 'proj_vitalflow_1',
    title: 'Phase 3: Workstation UI, Explainability & Quality Audit',
    description: 'Build responsive clinical workstation, attention heatmap viewer, and complete security audit.',
    order: 3,
    milestones: [
      { id: 'ms_5', phaseId: 'ph_3', title: 'Clinical Workstation UI', description: 'Multi-bed overview with live telemetry sparklines.', dueDate: '2026-04-15', isCompleted: false },
      { id: 'ms_6', phaseId: 'ph_3', title: 'Security & Quality Audit', description: 'Pass complete quality criteria and faculty review.', dueDate: '2026-04-30', isCompleted: false }
    ]
  },
  {
    id: 'ph_4',
    projectId: 'proj_vitalflow_1',
    title: 'Phase 4: Final Documentation, Viva Preparation & Portfolio',
    description: 'Produce complete final-year report, rehearse mock viva with AI examiner, and publish project portfolio.',
    order: 4,
    milestones: [
      { id: 'ms_7', phaseId: 'ph_4', title: 'Final Capstone Project Report', description: 'Complete 60-page academic report with verified citations.', dueDate: '2026-05-08', isCompleted: false },
      { id: 'ms_8', phaseId: 'ph_4', title: 'Viva Defence & Project Showcase', description: 'Final oral examination and demonstration.', dueDate: '2026-05-15', isCompleted: false }
    ]
  }
];

const initialTasks: Task[] = [
  {
    id: 'tsk_1',
    projectId: 'proj_vitalflow_1',
    phaseId: 'ph_1',
    milestoneId: 'ms_1',
    title: 'Extract 12,000 patient vitals cohort from MIMIC-IV',
    description: 'Filter for adult ICU admissions with sepsis ICD-10 diagnostic codes and continuous telemetry recordings.',
    status: 'COMPLETED',
    priority: 'HIGH',
    estimateHours: 18,
    actualHours: 16,
    deadline: '2026-02-08',
    dependencies: [],
    assignedUserId: 'usr_student_1',
    assignedUserName: 'Alex Rivera',
    requiredSkill: 'Python & Pandas Data Cleansing',
    technologyTag: 'Python',
    acceptanceCriteria: ['Output cleaned HDF5/Parquet matrix', 'Verify zero null timestamps in normalized cohort'],
    evidenceRef: 'evidence_mimic_extraction',
    createdAt: '2026-01-22T09:00:00Z',
    updatedAt: '2026-02-08T18:00:00Z'
  },
  {
    id: 'tsk_2',
    projectId: 'proj_vitalflow_1',
    phaseId: 'ph_1',
    milestoneId: 'ms_2',
    title: 'Benchmark INT8 Quantization on ARM Cortex-A76',
    description: 'Evaluate ONNX Runtime latency with static quantization and measure accuracy loss vs FP32 baseline.',
    status: 'COMPLETED',
    priority: 'CRITICAL',
    estimateHours: 14,
    actualHours: 15,
    deadline: '2026-02-22',
    dependencies: ['tsk_1'],
    assignedUserId: 'usr_student_1',
    assignedUserName: 'Alex Rivera',
    requiredSkill: 'Edge Model Quantization with ONNX & TensorRT',
    technologyTag: 'ONNX Runtime',
    acceptanceCriteria: ['Sub-50ms 95th percentile latency', 'AUROC degradation < 1.2%'],
    evidenceRef: 'evidence_onnx_benchmark',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-23T11:00:00Z'
  },
  {
    id: 'tsk_3',
    projectId: 'proj_vitalflow_1',
    phaseId: 'ph_2',
    milestoneId: 'ms_3',
    title: 'Build Resilient ZeroMQ Telemetry Ingestion Gateway',
    description: 'Create multi-threaded ingestion listener that buffers incoming sensor telemetry during network jitter.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    estimateHours: 20,
    actualHours: 11,
    deadline: '2026-03-12',
    dependencies: ['tsk_2'],
    assignedUserId: 'usr_student_2',
    assignedUserName: 'Maya Lin',
    requiredSkill: 'Asynchronous Network Systems',
    technologyTag: 'FastAPI / ZeroMQ',
    acceptanceCriteria: ['Zero lost packets during 5-second network disconnect', 'Memory footprint under 120MB'],
    notes: 'Currently tuning the circular ring buffer size.',
    createdAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-03-02T16:00:00Z'
  },
  {
    id: 'tsk_4',
    projectId: 'proj_vitalflow_1',
    phaseId: 'ph_2',
    milestoneId: 'ms_4',
    title: 'Implement WebSocket Alert Dispatcher with Deduplication',
    description: 'Broadcast predictive alerts to connected clinical screens with smart hysteresis suppression to avoid spam.',
    status: 'BLOCKED',
    priority: 'CRITICAL',
    estimateHours: 16,
    deadline: '2026-03-25',
    dependencies: ['tsk_3'],
    assignedUserId: 'usr_student_1',
    assignedUserName: 'Alex Rivera',
    requiredSkill: 'WebSocket Streaming Security',
    technologyTag: 'WebSockets',
    acceptanceCriteria: ['Hysteresis filter stops repeated alerts within 15 min window', 'Payload cryptographically signed'],
    learningRequirementId: 'gap_ws_security',
    notes: 'Blocked pending resolution of faculty guide question on clinical alert suppression criteria.',
    createdAt: '2026-02-28T09:00:00Z',
    updatedAt: '2026-03-03T11:00:00Z'
  },
  {
    id: 'tsk_5',
    projectId: 'proj_vitalflow_1',
    phaseId: 'ph_3',
    milestoneId: 'ms_5',
    title: 'Develop Real-Time Multi-Bed Workstation Grid',
    description: 'Construct responsive clinical dashboard rendering live telemetry curves and patient priority badges.',
    status: 'TODO',
    priority: 'MEDIUM',
    estimateHours: 22,
    deadline: '2026-04-10',
    dependencies: ['tsk_4'],
    assignedUserId: 'usr_student_1',
    assignedUserName: 'Alex Rivera',
    requiredSkill: 'React 19 High-Performance Rendering',
    technologyTag: 'React / Tailwind CSS',
    acceptanceCriteria: ['60 FPS rendering under 20 live patient waveforms', 'Accessible keyboard triage shortcuts'],
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z'
  }
];

const initialSkillGaps: SkillGap[] = [
  {
    id: 'gap_onnx_quant',
    skillName: 'Edge Model Quantization with ONNX & TensorRT',
    category: 'Edge AI & Optimization',
    currentProficiency: 82,
    requiredProficiency: 90,
    gapScore: 8,
    priority: 'HIGH',
    isBlocking: false,
    suggestedModules: ['Post-Training Quantization (PTQ) vs QAT', 'Calibration Datasets on PhysioNet']
  },
  {
    id: 'gap_ws_security',
    skillName: 'WebSocket Streaming Security & Hysteresis Filtering',
    category: 'Full-Stack & Systems Architecture',
    currentProficiency: 65,
    requiredProficiency: 85,
    gapScore: 20,
    priority: 'CRITICAL',
    isBlocking: true,
    blockingTaskId: 'tsk_4',
    blockingTaskTitle: 'Implement WebSocket Alert Dispatcher with Deduplication',
    suggestedModules: ['Clinical Alert Suppression Strategies', 'Securing WebSockets with Signed JWT Tokens']
  },
  {
    id: 'gap_timeseries_explain',
    skillName: 'Time-Series Transformer Attention Explainability',
    category: 'Applied AI & Interpretability',
    currentProficiency: 70,
    requiredProficiency: 85,
    gapScore: 15,
    priority: 'MEDIUM',
    isBlocking: false,
    suggestedModules: ['Attention Rollout for PatchTST', 'Grad-CAM for Physiological Signals']
  }
];

const initialLearningModules: LearningModule[] = [
  {
    id: 'mod_learn_1',
    skillGapId: 'gap_ws_security',
    title: 'Securing High-Frequency Clinical WebSockets with mTLS and Ephemeral Tokens',
    description: 'Learn how to secure continuous bi-directional medical telemetry streams against interception and packet replay.',
    mode: 'PROJECT_APPLICATION',
    estimatedHours: 4,
    learningOutcomes: [
      'Understand ticket-based authentication before WebSocket connection upgrade.',
      'Implement alert hysteresis to prevent clinical notification fatigue.',
      'Structure clean reconnect loops with exponential backoff on client side.'
    ],
    resources: [
      { title: 'RFC 6455 Security Considerations for Healthcare', type: 'STANDARD', linkOrGuide: 'Focus on Section 10: Origin validation & framing attack prevention.' },
      { title: 'Alarm Fatigue Mitigation in Critical Care Monitoring', type: 'JOURNAL_PAPER', linkOrGuide: 'IEEE Transactions on Biomedical Engineering, 2024.' }
    ],
    practicalChallenge: 'Write a hysteresis wrapper in TypeScript that suppresses duplicate alerts if risk score delta < 5% within 15 minutes.',
    quiz: [
      {
        question: 'What is the primary cause of clinical alarm fatigue in ICUs?',
        options: [
          'High false-positive rate from unsuppressed static threshold alerts',
          'Poor speaker volume on bedside hardware',
          'Excessive encryption overhead on telemetry channels',
          'Lack of nurses in the telemetry control room'
        ],
        answerIndex: 0,
        explanation: 'Studies show up to 85% of standard monitor alarms are clinically non-actionable, desensitizing staff.'
      }
    ],
    isCompleted: false,
    confidenceScore: 72
  },
  {
    id: 'mod_learn_2',
    skillGapId: 'gap_onnx_quant',
    title: 'Static Post-Training Quantization with ONNX Runtime',
    description: 'Techniques for calibrating float32 transformer weights into INT8 integer operations without losing clinical predictive specificity.',
    mode: 'PRACTICE',
    estimatedHours: 3,
    learningOutcomes: [
      'Choose appropriate calibration representative dataset slices.',
      'Measure per-tensor vs per-channel quantization error.',
      'Benchmark speedup on Raspberry Pi 5 vs x86 host.'
    ],
    resources: [
      { title: 'ONNX Runtime Quantization Guide', type: 'DOCS', linkOrGuide: 'onnxruntime.ai/docs/performance/quantization.html' }
    ],
    practicalChallenge: 'Quantize the 4-layer PatchTST encoder using ONNX Runtime Python API and verify latency reduction.',
    quiz: [
      {
        question: 'Why is a representative calibration dataset crucial during INT8 static quantization?',
        options: [
          'To determine the scale and zero-point dynamic range of activations without retraining',
          'To add training labels to unlabelled patient signals',
          'To translate the Python code into C++',
          'To encrypt the weights before distribution'
        ],
        answerIndex: 0,
        explanation: 'Calibration observes activation distribution across typical data to calculate optimal scaling parameters.'
      }
    ],
    isCompleted: true,
    confidenceScore: 92
  }
];

const initialQualityAnalysis: QualityAnalysis = {
  projectId: 'proj_vitalflow_1',
  overallScore: 84,
  industryReadiness: 82,
  academicCompleteness: 91,
  projectMaturity: 'DEVELOPING',
  categories: [
    {
      category: 'Functionality',
      score: 88,
      status: 'STRONG',
      findings: ['Core inference pipeline functional with proven AUROC 0.892 on MIMIC-IV cohort.'],
      remediations: ['Add simulated hardware jitter test in continuous integration.']
    },
    {
      category: 'Architecture',
      score: 92,
      status: 'STRONG',
      findings: ['Clean 3-tier separation (Edge Ingest -> Quantized Inference -> Web Workstation).'],
      remediations: ['Formalize circuit-breaker pattern between edge node and central database.']
    },
    {
      category: 'Database',
      score: 85,
      status: 'STRONG',
      findings: ['TimescaleDB hypertable partitioning correctly structured for time-series vitals.'],
      remediations: ['Add data retention and automated roll-up policy for readings older than 30 days.']
    },
    {
      category: 'API',
      score: 80,
      status: 'OPPORTUNITY',
      findings: ['REST endpoints have comprehensive schemas; WebSocket alert schema needs documented contract.'],
      remediations: ['Generate AsyncAPI specification for WebSocket messages.']
    },
    {
      category: 'Security',
      score: 82,
      status: 'OPPORTUNITY',
      findings: ['Patient MRN is salted and hashed; TLS 1.3 enforced for telemetry transport.'],
      remediations: ['Add rate-limiting and IP allowlisting on edge ingestion listener.']
    },
    {
      category: 'Testing',
      score: 76,
      status: 'WEAK',
      findings: ['Unit test coverage on signal processing is 89%; integration test on WebSocket reconnect missing.'],
      remediations: ['Implement Playwright test simulating bed disconnection and automatic telemetry resync.']
    },
    {
      category: 'UI/UX',
      score: 88,
      status: 'STRONG',
      findings: ['Accessible high-contrast palette compliant with clinical lighting conditions.'],
      remediations: ['Add one-click audio silence button with 120-second reminder.']
    },
    {
      category: 'Documentation',
      score: 90,
      status: 'STRONG',
      findings: ['Blueprint, Synopsis, and Architecture specs are verified against actual database schema.'],
      remediations: ['Draft deployment runbook for hospital system administrators.']
    },
    {
      category: 'Deployment',
      score: 83,
      status: 'OPPORTUNITY',
      findings: ['Docker Compose runs cleanly; needs healthcheck probes on inference container.'],
      remediations: ['Add docker compose healthcheck with curl to /api/health.']
    },
    {
      category: 'Performance',
      score: 87,
      status: 'STRONG',
      findings: ['Sub-50ms inference verified on edge hardware benchmark.'],
      remediations: ['Profile WebSocket memory allocation under 100 simultaneous simulated beds.']
    },
    {
      category: 'Innovation',
      score: 91,
      status: 'STRONG',
      findings: ['Novel integration of quantized PatchTST on edge hardware with clinical alarm fatigue suppression.'],
      remediations: ['Prepare submission abstract for IEEE Student Paper Contest.']
    }
  ],
  strengths: [
    'Rigorous biomedical methodology grounded in verified open-source PhysioNet data.',
    'Clear architectural isolation preventing edge hardware failures from affecting the entire ward.',
    'Quantized model delivers 6x speedup with minimal predictive accuracy drop.'
  ],
  criticalRisks: [
    'WebSocket alert deduplication currently blocks Task 4; needs completion before clinical UI integration.',
    'Integration testing coverage (currently 76%) must reach >85% before academic final submission.'
  ],
  prioritizedImprovements: [
    { action: 'Implement WebSocket reconnection test suite with simulated packet drops', impact: 'HIGH', category: 'Testing' },
    { action: 'Formalize AsyncAPI schema for clinical alert payloads', impact: 'MEDIUM', category: 'API' },
    { action: 'Configure TimescaleDB downsampling policy for raw 1Hz vitals', impact: 'MEDIUM', category: 'Database' }
  ],
  evaluatedAt: '2026-03-03T14:00:00Z'
};

const initialDocuments: ProjectDocument[] = [
  {
    id: 'doc_srs',
    projectId: 'proj_vitalflow_1',
    title: 'Software Requirements Specification (SRS)',
    type: 'SRS',
    version: 2,
    lastUpdated: '2026-02-28',
    outline: ['1. Introduction', '2. Overall Description', '3. System Features', '4. External Interface Requirements', '5. Non-Functional Requirements'],
    sections: [
      {
        id: 'sec_1',
        title: '1. Introduction & Clinical Objective',
        content: 'VitalFlow is designed to bridge the gap between continuous bedside telemetry and early clinical decision-making. By running quantized time-series models at the local ward edge, it delivers predictive alerts for patient decompensation 4-6 hours prior to overt septic shock.',
        isVerifiedFact: true,
        sourceAuthority: 'VERIFIED'
      },
      {
        id: 'sec_2',
        title: '2. Functional Requirements - Telemetry Ingestion',
        content: 'The system MUST ingest 4 continuous vital streams (Heart Rate, Mean Arterial Pressure, SpO2, Respiratory Rate) sampled at 1Hz per monitored patient. Data packets MUST be cryptographically validated before ingestion.',
        isVerifiedFact: true,
        sourceAuthority: 'APPROVED'
      },
      {
        id: 'sec_3',
        title: '3. AI-Assisted Clinical Narrative & Literature Comparison',
        content: 'Unlike conventional commercial monitors (e.g. Philips IntelliVue) which enforce rigid single-variable threshold warnings, VitalFlow utilizes cross-attention transformer mechanisms across multi-parametric vitals, recognizing multivariate deterioration patterns invisible to standard telemetry.',
        isVerifiedFact: false,
        sourceAuthority: 'AI_GENERATED'
      }
    ],
    verifiedDataItems: ['MIMIC-IV cohort size: 12,000 admissions', 'Inference latency: 42ms on ARM edge node', 'AUROC score: 0.892'],
    studentProvidedItems: ['Target ICU bed capacity: 24 beds per edge gateway', 'Hardware budget ceiling: $450'],
    aiNarrativeSummary: 'Synthesized literature review comparing rule-based Modified Early Warning Score (MEWS) with deep learning time-series transformers.'
  },
  {
    id: 'doc_synopsis',
    projectId: 'proj_vitalflow_1',
    title: 'Project Synopsis & Academic Proposal',
    type: 'SYNOPSIS',
    version: 1,
    lastUpdated: '2026-01-28',
    outline: ['Abstract', 'Problem Formulation', 'Methodology', 'Expected Outcomes', 'References'],
    sections: [
      {
        id: 'sec_syn_1',
        title: 'Problem Statement & Motivation',
        content: initialProject.problemStatement,
        isVerifiedFact: true,
        sourceAuthority: 'VERIFIED'
      },
      {
        id: 'sec_syn_2',
        title: 'Proposed Methodology',
        content: initialBlueprint.proposedSystemArchitecture,
        isVerifiedFact: true,
        sourceAuthority: 'APPROVED'
      }
    ],
    verifiedDataItems: ['Faculty guide approval date: 2026-02-01', 'Department: Computer Science & Engineering'],
    studentProvidedItems: ['Student registration number: 2022-CSE-048'],
    aiNarrativeSummary: 'Academic contextualization of edge computing benefits over centralized cloud healthcare telemetry.'
  }
];

const initialVivaPrep: VivaPreparation = {
  projectId: 'proj_vitalflow_1',
  pitch1Min:
    'VitalFlow is an edge AI platform that predicts ICU patient septic shock 4 to 6 hours before clinical onset. By quantizing a time-series transformer model to run on local hospital edge gateways, we achieve sub-50ms inference, eliminate cloud privacy leaks, and cut false clinical alarms by over 65% compared to standard monitors.',
  pitch3Min:
    'Good morning, respected external examiners. In intensive care units, every hour of delayed sepsis detection increases patient mortality by nearly 8%. Traditional monitors trigger up to 85% false alarms, exhausting clinical staff. Centralized cloud solutions are unacceptable due to hospital bandwidth limits and patient data privacy laws.\n\nMy project, VitalFlow, solves this through three core innovations: First, we developed an INT8 quantized Patch Time-Series Transformer running locally on an edge gateway, processing continuous 1Hz telemetry with under 50ms latency. Second, we built a Bayesian hysteresis filter that suppresses redundant alert spam while maintaining 89.2% AUROC sensitivity. Third, we constructed a real-time reactive clinical dashboard that highlights which vital signs drove the predictive risk score, giving doctors explainable, actionable decision support.\n\nAll results are validated on 12,000 cohort admissions from PhysioNet MIMIC-IV, and verified through our automated edge testing harness.',
  pitch5Min:
    'Respected Chairperson, Faculty Guide Prof. Sarah Jenkins, and External Examiners. Today I present VitalFlow: an Edge AI Clinical Triage and Early Warning System.\n\n[Background & Problem]: Hospital intensive care units generate massive telemetry volumes, yet clinicians are overwhelmed by alarm fatigue—over 350 alarms per bed daily, of which 85% are clinically non-actionable. Centralized cloud models cannot satisfy hospital air-gapped security requirements.\n\n[System Architecture]: Our architecture consists of three integrated tiers: Edge Ingestion via ZeroMQ, Local Quantized Inference using ONNX Runtime, and a Real-time Clinical Workstation connected via secure WebSockets. We selected TimescaleDB for time-series storage due to its hypertable chunking efficiency.\n\n[Key Engineering Challenges Overcome]: Training a 48M parameter transformer model is straightforward, but deploying it onto low-power edge hardware was our primary obstacle. Through knowledge distillation and INT8 Post-Training Quantization, we compressed the model by 85% while limiting AUROC degradation to less than 1.1%.\n\n[Empirical Results]: On our 12,000 patient test set from MIMIC-IV, VitalFlow achieved an AUROC of 0.892, with 95th percentile inference latency of 42 milliseconds. Most critically, our clinical hysteresis logic filtered out 68% of false threshold alarms.\n\nThank you, and I welcome your questions on our model architecture, edge optimization, and clinical validation.',
  slideDeckStructure: [
    { slideNumber: 1, title: 'Title & Overview', bulletPoints: ['VitalFlow: Edge AI Clinical Triage', 'Student: Alex Rivera | Guide: Prof. Sarah Jenkins', 'Department of Computer Science & Engineering'], speakerNotes: 'Open with clear title statement and acknowledge guide.' },
    { slideNumber: 2, title: 'The Problem: Alarm Fatigue & Mortality', bulletPoints: ['Sepsis mortality increases 7.6% per hour', '85% of bedside alarms are non-actionable false positives', 'Cloud processing violates hospital data boundary laws'], speakerNotes: 'Establish emotional and clinical urgency with verified numbers.' },
    { slideNumber: 3, title: 'System Architecture', bulletPoints: ['3-Tier topology: Edge Ingest -> ONNX Engine -> Web Workstation', 'ZeroMQ streaming bus + TimescaleDB time-series storage', 'Zero-knowledge patient identifier hashing'], speakerNotes: 'Walk through the block diagram highlighting modularity.' },
    { slideNumber: 4, title: 'Model Quantization & Benchmark', bulletPoints: ['INT8 Post-Training Quantization with calibration on MIMIC-IV', '42ms latency on ARM edge node (exceeding 50ms target)', 'AUROC 0.892 vs FP32 baseline 0.901'], speakerNotes: 'Point out the trade-off curve between quantization bits and clinical accuracy.' },
    { slideNumber: 5, title: 'Live Demonstration & Edge Simulator', bulletPoints: ['Bedside sensor telemetry playback', 'Real-time shock risk trajectory chart', 'Clinician alert acknowledgment audit flow'], speakerNotes: 'Run the offline telemetry simulator to showcase live WebSockets.' },
    { slideNumber: 6, title: 'Conclusion, Impact & Future Scope', bulletPoints: ['Achieved 68% false alarm reduction', 'Fully air-gapped hospital deployment standard', 'Future: Multi-hospital federated learning'], speakerNotes: 'Conclude with quantifiable outcomes and open floor for viva defence.' }
  ],
  questions: [
    {
      id: 'vq_1',
      category: 'ARCH',
      difficulty: 'BASIC',
      question: 'Why did you select edge computing instead of deploying your machine learning model to a scalable cloud provider like AWS or GCP?',
      expectedKeyPoints: [
        'Hospital data privacy (HIPAA / GDPR) prevents egress of unencrypted patient telemetry.',
        'Network reliability: ICU monitoring must never drop if the hospital internet connection drops.',
        'Sub-50ms deterministic latency requirements for acute deterioration warnings.'
      ],
      sampleModelAnswer:
        'We chose an edge architecture primarily for clinical safety and patient privacy. In an ICU setting, network outages must never blind bedside monitors. By hosting quantized inference locally on the ward edge gateway, telemetry remains air-gapped inside hospital LAN boundaries, eliminating external cloud data egress compliance hurdles and guaranteeing sub-50ms deterministic latency.',
      projectGroundedContext: 'Grounded in Project Blueprint Security Section and Architectural Decision Record ADR-001.'
    },
    {
      id: 'vq_2',
      category: 'DB',
      difficulty: 'INTERMEDIATE',
      question: 'Why did you use TimescaleDB rather than a generic NoSQL document store like MongoDB for patient vitals?',
      expectedKeyPoints: [
        'TimescaleDB provides automatic chunk-based time partitioning while retaining standard SQL support.',
        'Hypertable analytical queries (e.g. rolling 1-hour average MAP) are orders of magnitude faster.',
        'ACID transactions ensure patient admission and alert acknowledgment audit integrity.'
      ],
      sampleModelAnswer:
        'ICU telemetry is strictly time-series data with continuous timestamps and high write throughput. TimescaleDB automates chunk-based disk partitioning behind standard PostgreSQL relational tables. This allows us to run continuous rollups and time-bucket aggregations in microsecond ranges, while retaining full relational foreign keys to our patients and clinical alerts tables.',
      projectGroundedContext: 'Grounded in Blueprint Database Design: vital_readings hypertable.'
    },
    {
      id: 'vq_3',
      category: 'SECURITY',
      difficulty: 'ADVANCED',
      question: 'How do you prevent an adversarial telemetry injection attack from poisoning the model into suppressing genuine cardiac alarms?',
      expectedKeyPoints: [
        'Mutual TLS (mTLS) with client certificates on bedside sensor microcontrollers.',
        'Outlier clamping and Bayesian physical plausibility filtering on signal values before tensor creation.',
        'Cryptographic HMAC signing of incoming telemetry payload packets.'
      ],
      sampleModelAnswer:
        'We enforce defense-in-depth: First, every bedside telemetry node requires an X.509 client certificate for mTLS negotiation with the edge gateway. Second, before signals enter the inference tensor, our signal cleansing module checks physiological plausibility bounds (e.g., heart rate cannot transition from 70 to 240 within 1 second without marker noise flags), clamping extreme deviations and flagging sensor detachment.',
      projectGroundedContext: 'Grounded in Blueprint Security Measures and Module 1 Cleansing Engine.'
    },
    {
      id: 'vq_4',
      category: 'TESTING',
      difficulty: 'INTERMEDIATE',
      question: 'How did you validate your model against overfitting when trained on retrospective MIMIC-IV records?',
      expectedKeyPoints: [
        'Patient-level splitting (no data from the same patient in both train and validation sets).',
        'Stratified 5-fold cross validation preserving sepsis class imbalance ratio.',
        'Temporal validation: training on earlier calendar admissions and testing on later admissions.'
      ],
      sampleModelAnswer:
        'To strictly prevent data leakage, we partitioned the cohort at the patient ID level rather than individual time-slice records. We employed stratified 5-fold cross-validation and evaluated on an entirely held-out temporal cohort from MIMIC-IV, ensuring the model generalizes to distinct physiological profiles without memorizing patient-specific baselines.',
      projectGroundedContext: 'Grounded in Quality Analysis Testing Section and Task 1 MIMIC-IV Extraction criteria.'
    }
  ],
  overallReadinessScore: 82
};

const initialFacultyReviews: FacultyReview[] = [
  {
    id: 'fr_1',
    projectId: 'proj_vitalflow_1',
    facultyId: 'usr_faculty_1',
    facultyName: 'Prof. Sarah Jenkins',
    status: 'CHANGE_REQUESTED',
    overallScore: 86,
    reviewNotes:
      'Strong technical architecture and impressive edge quantization benchmarks. Alex and Maya have shown excellent initiative. However, before final Phase 2 approval, you must clarify the clinical alert suppression logic. Examiners will push hard on the risk of suppressing a genuine clinical emergency with overly aggressive hysteresis. Resolve this and submit updated task.',
    privateGuideNotes:
      'Student is performing in the top 5% of the capstone cohort. Technical depth on ONNX Runtime is remarkable. Keep them focused on viva delivery and avoid scope creep into federated learning before the final report is locked.',
    feedbackList: [
      {
        id: 'fb_1',
        date: '2026-03-01',
        category: 'ROADMAP',
        feedback: 'Task 4 (WebSocket Alert Dispatcher) must explicitly document clinical hysteresis override rules for acute SpO2 drops below 85%.',
        requiredAction: 'Add override condition to acceptance criteria of Task 4.',
        isResolved: false
      },
      {
        id: 'fb_2',
        date: '2026-02-15',
        category: 'BLUEPRINT',
        feedback: 'Ensure all TimescaleDB foreign keys have cascading delete protection to prevent orphaned telemetry records.',
        requiredAction: 'Update database schema specification.',
        isResolved: true
      }
    ],
    submittedAt: '2026-03-01T15:30:00Z',
    nextScheduledReview: '2026-03-18T10:00:00Z'
  }
];

const initialKnowledgeDocs: KnowledgeDocument[] = [
  {
    id: 'kdoc_blueprint',
    projectId: 'proj_vitalflow_1',
    title: 'Technical Blueprint Specifications v2',
    sourceType: 'BLUEPRINT',
    authority: 'APPROVED',
    content: 'Full system architecture, 3-tier topology, TimescaleDB hypertable schema, and INT8 ONNX inference runtime parameters.',
    chunkCount: 8,
    updatedAt: '2026-02-28T16:00:00Z'
  },
  {
    id: 'kdoc_decisions',
    projectId: 'proj_vitalflow_1',
    title: 'Architectural Decision Records (ADRs)',
    sourceType: 'DECISION',
    authority: 'VERIFIED',
    content: 'ADR-001: Selection of Edge Gateway over Cloud Ingestion; ADR-002: TimescaleDB vs MongoDB for high-frequency vitals; ADR-003: INT8 Static Quantization vs FP16.',
    chunkCount: 5,
    updatedAt: '2026-02-24T12:00:00Z'
  },
  {
    id: 'kdoc_faculty',
    projectId: 'proj_vitalflow_1',
    title: 'Prof. Sarah Jenkins Capstone Review Directives',
    sourceType: 'FACULTY_NOTE',
    authority: 'APPROVED',
    content: 'Guide feedback emphasizing clinical alarm override rules, avoiding alarm suppression for acute hypoxia, and ensuring offline demonstration capability during viva.',
    chunkCount: 3,
    updatedAt: '2026-03-01T15:30:00Z'
  }
];

const initialKnowledgeChunks: KnowledgeChunk[] = [
  {
    id: 'chk_1',
    docId: 'kdoc_blueprint',
    projectId: 'proj_vitalflow_1',
    content: 'VitalFlow Edge Inference Engine runs quantized PatchTST on ONNX Runtime executing at 42ms per patient window, achieving 89.2% AUROC on PhysioNet MIMIC-IV sepsis benchmark.',
    authority: 'APPROVED',
    category: 'AI_MODEL',
    keywords: ['PatchTST', 'ONNX', 'Quantization', 'AUROC', 'MIMIC-IV', 'latency']
  },
  {
    id: 'chk_2',
    docId: 'kdoc_blueprint',
    projectId: 'proj_vitalflow_1',
    content: 'Database tier uses PostgreSQL 16 with TimescaleDB extension. Vitals table is a hypertable chunked every 24 hours to accelerate rolling time-window analytical queries.',
    authority: 'APPROVED',
    category: 'DATABASE',
    keywords: ['PostgreSQL', 'TimescaleDB', 'hypertable', 'partitioning', 'time-series']
  },
  {
    id: 'chk_3',
    docId: 'kdoc_decisions',
    projectId: 'proj_vitalflow_1',
    content: 'ADR-001 Decision: Edge computing chosen over AWS/GCP to guarantee zero HIPAA patient telemetry egress, zero dependency on public hospital internet, and deterministic sub-50ms latency.',
    authority: 'VERIFIED',
    category: 'ARCHITECTURE',
    keywords: ['Edge computing', 'HIPAA', 'privacy', 'latency', 'ADR-001']
  },
  {
    id: 'chk_4',
    docId: 'kdoc_faculty',
    projectId: 'proj_vitalflow_1',
    content: 'Faculty Requirement: In Task 4, the alert suppression filter must include an immediate override bypass whenever SpO2 drops below 85% or heart rate exceeds 140 BPM.',
    authority: 'APPROVED',
    category: 'FACULTY_DIRECTIVE',
    keywords: ['Prof. Jenkins', 'hysteresis', 'override', 'SpO2', 'alarm fatigue', 'Task 4']
  }
];

const initialKnowledgeConflicts: KnowledgeConflict[] = [
  {
    id: 'conf_1',
    topic: 'Telemetry Ingestion Transport Protocol',
    description: 'Blueprint Section 3 mentions ZeroMQ over TCP port 5555, while Docker Compose template specifies MQTT broker on port 1883.',
    sourceA: { title: 'Project Blueprint v2', authority: 'APPROVED', text: 'Telemetry Ingestion Module connects via ZeroMQ over local socket / TCP 5555.' },
    sourceB: { title: 'Docker Compose Spec v1', authority: 'STUDENT_PROVIDED', text: 'services: broker: image: eclipse-mosquitto:2 ports: 1883:1883' },
    severity: 'MEDIUM',
    suggestedResolution: 'Standardize on ZeroMQ for high-frequency internal gateway, or document MQTT as bedside sensor bridge into ZeroMQ listener.',
    resolved: false
  }
];

const initialKnowledgeGaps: KnowledgeGap[] = [
  {
    id: 'kgap_1',
    area: 'Clinical Alarm Override Specification',
    description: 'Exact physiological thresholds that bypass the 15-minute alert hysteresis suppression have not been formally coded in the SRS.',
    impactOnViva: 'External examiners will ask how the system prevents suppressing a patient in acute cardiac arrest.',
    impactOnQuality: 'Lowers API & Safety score from 85 to 80.',
    recommendedAction: 'Formally append emergency override rules (SpO2 < 85%, MAP < 55) to SRS Section 3 and Task 4 acceptance criteria.'
  }
];

const initialDecisions: ProjectDecision[] = [
  {
    id: 'dec_1',
    projectId: 'proj_vitalflow_1',
    title: 'ADR-001: Selection of Local Edge Gateway over Cloud IoT Ingestion',
    decisionNumber: 1,
    date: '2026-01-25',
    status: 'ACCEPTED',
    contextProblem:
      'ICU telemetry requires continuous 1Hz multi-bed streaming. Cloud ingestion incurs high bandwidth costs, introduces latency variance, and triggers strict healthcare privacy (HIPAA) compliance overhead.',
    chosenSolution:
      'Deploy inference and ingestion to a local on-premise Edge Gateway (simulated on ARM Cortex / Raspberry Pi 5 node).',
    alternativesConsidered: ['AWS IoT Greengrass with Cloud Kinesis', 'Purely on-premise centralized server rack'],
    impactAndConsequences: [
      'Eliminates cloud subscription bills for the capstone budget.',
      'Guarantees system remains functional during campus / hospital internet dropouts.',
      'Requires strict model size optimization to run smoothly on constrained edge RAM.'
    ],
    author: 'Alex Rivera'
  },
  {
    id: 'dec_2',
    projectId: 'proj_vitalflow_1',
    title: 'ADR-002: TimescaleDB for Continuous Telemetry Storage',
    decisionNumber: 2,
    date: '2026-02-02',
    status: 'ACCEPTED',
    contextProblem:
      'Standard relational databases degrade significantly when querying millions of timestamped vital sign rows over rolling hours.',
    chosenSolution: 'Adopt TimescaleDB extension on PostgreSQL for automatic hypertable chunk partitioning.',
    alternativesConsidered: ['MongoDB time-series collections', 'InfluxDB standalone', 'Raw SQLite files'],
    impactAndConsequences: [
      'Preserves standard SQL joins with relational patient and alert records.',
      'Fast 1-hour rolling window aggregations for feature extraction.',
      'Slightly higher Docker memory footprint compared to SQLite.'
    ],
    author: 'Alex Rivera & Maya Lin'
  },
  {
    id: 'dec_3',
    projectId: 'proj_vitalflow_1',
    title: 'ADR-003: INT8 Post-Training Quantization over FP16 Pruning',
    decisionNumber: 3,
    date: '2026-02-18',
    status: 'ACCEPTED',
    contextProblem:
      'Full FP32 transformer model required 190ms inference latency on CPU, violating the sub-50ms clinical responsiveness requirement.',
    chosenSolution: 'Static INT8 Post-Training Quantization via ONNX Runtime with calibration over 1,000 PhysioNet segments.',
    alternativesConsidered: ['Dynamic quantization', 'Structured weight pruning without quantization', 'Knowledge distillation to shallow MLP'],
    impactAndConsequences: [
      'Reduced latency from 190ms to 42ms (4.5x speedup).',
      'AUROC degradation was negligible (0.892 vs 0.901).',
      'Requires calibration step whenever model architecture is altered.'
    ],
    author: 'Alex Rivera'
  }
];

const initialEvidences: ProjectEvidence[] = [
  {
    id: 'ev_1',
    projectId: 'proj_vitalflow_1',
    blueprintFeatureId: 'mod_ingest',
    featureTitle: '12,000 Patient Cohort Extraction from MIMIC-IV',
    linkedTaskId: 'tsk_1',
    evidenceStatus: 'VERIFIED',
    codeArtifactRef: 'scripts/extract_mimic_cohort.py (SHA: a7f89b)',
    testResultRef: 'pytest tests/test_ingest.py - 14 passed in 2.1s',
    documentationRef: 'SRS Section 2.1 Data Ingestion Matrix',
    verifiedByFaculty: true
  },
  {
    id: 'ev_2',
    projectId: 'proj_vitalflow_1',
    blueprintFeatureId: 'mod_inference',
    featureTitle: 'INT8 ONNX Quantization Latency Benchmark (<50ms)',
    linkedTaskId: 'tsk_2',
    evidenceStatus: 'VERIFIED',
    codeArtifactRef: 'models/vitalflow_patchtst_int8.onnx (4.2MB)',
    testResultRef: 'benchmark_results.json: 42.4ms p95 latency on 10,000 runs',
    documentationRef: 'Blueprint Section 4 Technology Stack',
    verifiedByFaculty: true
  },
  {
    id: 'ev_3',
    projectId: 'proj_vitalflow_1',
    blueprintFeatureId: 'mod_workstation',
    featureTitle: 'WebSocket Alert Dispatcher with Hysteresis',
    linkedTaskId: 'tsk_4',
    evidenceStatus: 'IN_PROGRESS',
    codeArtifactRef: 'server/alerts/dispatcher.py (branch: feat/ws-alerts)',
    documentationRef: 'Blueprint Section 3 Modules',
    verifiedByFaculty: false
  }
];

const initialRisks: RiskItem[] = [
  {
    id: 'risk_1',
    projectId: 'proj_vitalflow_1',
    title: 'Clinical Alert Suppression Risk during Acute Cardiac Event',
    category: 'SCOPE',
    severity: 'HIGH',
    probability: 'MEDIUM',
    impactExplanation: 'If hysteresis filter is too strict, an acute hypoxia emergency could be silenced if previous risk was already elevated.',
    recommendedMitigation: 'Implement hardcoded physiological bypass (SpO2 < 85% or HR > 140) that immediately punches through suppression.',
    linkedTaskId: 'tsk_4',
    isMitigated: false
  },
  {
    id: 'risk_2',
    projectId: 'proj_vitalflow_1',
    title: 'Viva Live Hardware Connection Failure Risk',
    category: 'TESTING',
    severity: 'MEDIUM',
    probability: 'LOW',
    impactExplanation: 'Relying on live hardware during presentation could cause embarrassing delays if campus Wi-Fi or USB fails.',
    recommendedMitigation: 'Pre-record video backup and build an automated synthetic sensor telemetry replay loop in the web dashboard.',
    isMitigated: true
  },
  {
    id: 'risk_3',
    projectId: 'proj_vitalflow_1',
    title: 'TimescaleDB Disk Volume Saturation over 72-Hour Soak Test',
    category: 'QUALITY',
    severity: 'MEDIUM',
    probability: 'MEDIUM',
    impactExplanation: 'Raw 1Hz vital signs across 24 beds generate ~2GB per day if uncompressed.',
    recommendedMitigation: 'Configure TimescaleDB automated native chunk compression policy after 24 hours of ingest.',
    isMitigated: false
  }
];

const initialChangeRequests: ProjectChangeRequest[] = [
  {
    id: 'cr_1',
    projectId: 'proj_vitalflow_1',
    title: 'Add Emergency Clinical Threshold Override to Hysteresis Engine',
    description: 'Mandate that critical physiological thresholds (SpO2 < 85%, MAP < 55 mmHg, HR > 140 bpm) bypass any alert suppression window.',
    reason: 'Direct requirement from Faculty Guide Prof. Sarah Jenkins in Review #1.',
    impactOnDeadline: 'Zero delay; can be integrated into current Task 4 sprint.',
    impactOnScope: 'Enhances clinical safety and improves viva defence score.',
    priority: 'HIGH',
    requestedBy: 'Prof. Sarah Jenkins',
    status: 'APPROVED',
    approvedBy: 'Alex Rivera',
    createdAt: '2026-03-01T16:00:00Z'
  }
];

const initialActivities: ActivityEvent[] = [
  {
    id: 'act_1',
    projectId: 'proj_vitalflow_1',
    timestamp: '2026-03-03T11:30:00Z',
    actorName: 'Alex Rivera',
    actorRole: 'STUDENT',
    eventType: 'TASK_UPDATED',
    description: 'Marked Task 4 as BLOCKED pending clinical override parameter confirmation.'
  },
  {
    id: 'act_2',
    projectId: 'proj_vitalflow_1',
    timestamp: '2026-03-01T15:30:00Z',
    actorName: 'Prof. Sarah Jenkins',
    actorRole: 'FACULTY',
    eventType: 'REVIEW_SUBMITTED',
    description: 'Submitted Phase 2 Review with CHANGE_REQUESTED status regarding alert hysteresis.'
  },
  {
    id: 'act_3',
    projectId: 'proj_vitalflow_1',
    timestamp: '2026-02-23T11:00:00Z',
    actorName: 'Alex Rivera',
    actorRole: 'STUDENT',
    eventType: 'TASK_COMPLETED',
    description: 'Completed Task 2: INT8 ONNX Benchmark (verified 42ms p95 latency).'
  },
  {
    id: 'act_4',
    projectId: 'proj_vitalflow_1',
    timestamp: '2026-02-18T10:00:00Z',
    actorName: 'Alex Rivera',
    actorRole: 'STUDENT',
    eventType: 'DECISION_CREATED',
    description: 'Authored ADR-003: INT8 Post-Training Quantization over FP16 Pruning.'
  }
];

const initialMentorMessages: MentorMessage[] = [
  {
    id: 'msg_1',
    sender: 'mentor',
    text: 'Hello Alex! I am your ProjectMentor AI. I have analyzed your project "VitalFlow: Edge AI Clinical Triage". I can see your overall progress is 45%, with Task 2 completed and Task 4 currently blocked pending faculty feedback from Prof. Sarah Jenkins. How can I help you today?',
    timestamp: '2026-03-03T12:00:00Z',
    contextSources: [
      { title: 'Project Health Engine', authority: 'VERIFIED', excerpt: 'Progress: 45%, 1 Task Blocked, Faculty Review: CHANGE_REQUESTED' },
      { title: 'Faculty Review #1', authority: 'APPROVED', excerpt: 'Prof. Sarah Jenkins: Clarify alert suppression override rules.' }
    ]
  }
];

const initialPortfolio: PortfolioShowcase = {
  projectId: 'proj_vitalflow_1',
  isPublic: true,
  title: 'VitalFlow: Edge AI Clinical Triage & Deterioration Early Warning System',
  summary:
    'Real-time edge computing system for intensive care units that predicts septic shock 4-6 hours early, reducing ICU alarm fatigue by 68% using INT8 quantized time-series transformers on local hospital hardware.',
  problemSolved:
    'Eliminates dangerous ICU alarm fatigue (85% false alarms) and avoids transmitting private patient telemetry to external cloud servers, running fully air-gapped on bedside edge gateways.',
  techStackBadges: ['TypeScript', 'React 19', 'Python 3.11', 'FastAPI', 'ONNX Runtime', 'PostgreSQL', 'TimescaleDB', 'WebSockets', 'Docker'],
  keyFeatures: [
    'Sub-50ms quantized predictive inference at edge hospital nodes',
    'Bayesian hysteresis alarm suppression cutting false alarms by 68%',
    'Real-time clinical workstation with 60 FPS live waveform rendering',
    'Salted SHA-256 patient MRN hashing for zero-knowledge data security'
  ],
  studentRole: 'Lead Architect, Time-Series ML Engineer & Frontend Developer',
  githubUrl: 'https://github.com/alexrivera-cs/vitalflow-edge-ai',
  demoUrl: 'https://vitalflow.demo.internal.hospital.org',
  readinessScore: 84,
  publishedDate: '2026-03-01'
};

class MemoryDatabase {
  private state: DatabaseState;

  reset(): void {
    this.state = {
      users: initialUsers,
      projects: [initialProject],
      feasibilities: { [initialProject.id]: initialFeasibility },
      blueprints: { [initialProject.id]: initialBlueprint },
      phases: { [initialProject.id]: initialPhases },
      tasks: { [initialProject.id]: initialTasks },
      skillGaps: { [initialProject.id]: initialSkillGaps },
      learningModules: { [initialProject.id]: initialLearningModules },
      mentorConversations: { [initialProject.id]: initialMentorMessages },
      qualityAnalyses: { [initialProject.id]: initialQualityAnalysis },
      documents: { [initialProject.id]: initialDocuments },
      vivaPreps: { [initialProject.id]: initialVivaPrep },
      facultyReviews: { [initialProject.id]: initialFacultyReviews },
      knowledgeDocs: { [initialProject.id]: initialKnowledgeDocs },
      knowledgeChunks: { [initialProject.id]: initialKnowledgeChunks },
      knowledgeConflicts: { [initialProject.id]: initialKnowledgeConflicts },
      knowledgeGaps: { [initialProject.id]: initialKnowledgeGaps },
      decisions: { [initialProject.id]: initialDecisions },
      evidences: { [initialProject.id]: initialEvidences },
      risks: { [initialProject.id]: initialRisks },
      changeRequests: { [initialProject.id]: initialChangeRequests },
      activities: { [initialProject.id]: initialActivities },
      portfolios: { [initialProject.id]: initialPortfolio },
      auditLogs: [
        {
          id: 'audit_1',
          timestamp: '2026-03-01T15:30:00Z',
          actorId: 'usr_faculty_1',
          actorName: 'Prof. Sarah Jenkins',
          action: 'FACULTY_REVIEW_SUBMITTED',
          details: 'Submitted review for proj_vitalflow_1 with status CHANGE_REQUESTED'
        }
      ],
      aiUsageLogs: [
        {
          id: 'ai_1',
          timestamp: '2026-03-03T12:00:00Z',
          promptTokens: 420,
          completionTokens: 185,
          model: 'gemini-3.8-flash',
          feature: 'MENTOR_CHAT',
          durationMs: 780,
          status: 'SUCCESS'
        }
      ],
      announcements: [
        {
          id: 'anc_1',
          title: 'Final Year Capstone Milestone 2 Review Schedules',
          content: 'All Phase 2 intermediate project reviews must be completed and faculty approved by March 31, 2026.',
          date: '2026-03-01',
          priority: 'URGENT'
        },
        {
          id: 'anc_2',
          title: 'Campus IEEE Student Project Showcase Submissions Open',
          content: 'Top projects with readiness score >= 80 are eligible for the National Innovation Showcase sponsorship.',
          date: '2026-02-25',
          priority: 'NORMAL'
        }
      ]
    };
  }

  constructor() {
    this.state = {} as any;
    this.reset();
  }

  getStats() {
    return {
      users: this.state.users.length,
      projects: this.state.projects.length,
      tasks: Object.values(this.state.tasks).flat().length,
      knowledgeChunks: Object.values(this.state.knowledgeChunks).flat().length,
      facultyReviews: Object.values(this.state.facultyReviews).flat().length,
      vivaQuestions: Object.values(this.state.vivaPreps).flatMap(v => v.questions).length,
      auditLogs: this.state.auditLogs.length
    };
  }

  // --- Users & Auth ---
  getUsers(): User[] {
    return this.state.users;
  }

  getUserById(id: string): User | undefined {
    return this.state.users.find(u => u.id === id);
  }

  createUser(user: User): User {
    this.state.users.push(user);
    this.logAudit(user.id, user.name, 'USER_REGISTERED', `Registered new user with role ${user.role}`);
    return user;
  }

  // --- Projects ---
  getProjects(): Project[] {
    return this.state.projects;
  }

  getProjectById(id: string): Project | undefined {
    return this.state.projects.find(p => p.id === id);
  }

  createProject(project: Project, feasibility?: FeasibilityAnalysis, blueprint?: ProjectBlueprint): Project {
    this.state.projects.push(project);
    if (feasibility) this.state.feasibilities[project.id] = feasibility;
    if (blueprint) this.state.blueprints[project.id] = blueprint;
    this.state.phases[project.id] = [];
    this.state.tasks[project.id] = [];
    this.state.skillGaps[project.id] = [];
    this.state.learningModules[project.id] = [];
    this.state.mentorConversations[project.id] = [
      {
        id: `msg_${Date.now()}`,
        sender: 'mentor',
        text: `Welcome to ProjectMentor AI! I'm your dedicated project assistant for "${project.title}". I'm grounded in your technical scope, learning requirements, and faculty review goals. Let me know what you'd like to work on first!`,
        timestamp: new Date().toISOString()
      }
    ];
    this.state.documents[project.id] = [];
    this.state.facultyReviews[project.id] = [];
    this.state.knowledgeDocs[project.id] = [];
    this.state.knowledgeChunks[project.id] = [];
    this.state.knowledgeConflicts[project.id] = [];
    this.state.knowledgeGaps[project.id] = [];
    this.state.decisions[project.id] = [];
    this.state.evidences[project.id] = [];
    this.state.risks[project.id] = [];
    this.state.changeRequests[project.id] = [];
    this.state.activities[project.id] = [
      {
        id: `act_${Date.now()}`,
        projectId: project.id,
        timestamp: new Date().toISOString(),
        actorName: project.ownerName,
        actorRole: 'STUDENT',
        eventType: 'PROJECT_CREATED',
        description: `Created new project: ${project.title}`
      }
    ];

    this.logAudit(project.ownerId, project.ownerName, 'PROJECT_CREATED', `Created project: ${project.title}`);
    return project;
  }

  updateProject(id: string, updates: Partial<Project>): Project | undefined {
    const projIndex = this.state.projects.findIndex(p => p.id === id);
    if (projIndex === -1) return undefined;
    this.state.projects[projIndex] = { ...this.state.projects[projIndex], ...updates, updatedAt: new Date().toISOString() };
    return this.state.projects[projIndex];
  }

  // --- Feasibility ---
  getFeasibility(projectId: string): FeasibilityAnalysis | undefined {
    return this.state.feasibilities[projectId];
  }

  setFeasibility(projectId: string, feasibility: FeasibilityAnalysis): FeasibilityAnalysis {
    this.state.feasibilities[projectId] = feasibility;
    return feasibility;
  }

  // --- Blueprint ---
  getBlueprint(projectId: string): ProjectBlueprint | undefined {
    return this.state.blueprints[projectId];
  }

  setBlueprint(projectId: string, blueprint: ProjectBlueprint): ProjectBlueprint {
    this.state.blueprints[projectId] = blueprint;
    return blueprint;
  }

  // --- Phases & Roadmap ---
  getPhases(projectId: string): DevelopmentPhase[] {
    return this.state.phases[projectId] || [];
  }

  setPhases(projectId: string, phases: DevelopmentPhase[]): DevelopmentPhase[] {
    this.state.phases[projectId] = phases;
    return phases;
  }

  // --- Tasks ---
  getTasks(projectId: string): Task[] {
    return this.state.tasks[projectId] || [];
  }

  createTask(task: Task): Task {
    if (!this.state.tasks[task.projectId]) {
      this.state.tasks[task.projectId] = [];
    }
    this.state.tasks[task.projectId].push(task);
    this.addActivity(task.projectId, task.assignedUserName, 'STUDENT', 'TASK_CREATED', `Created task: ${task.title}`);
    return task;
  }

  updateTask(projectId: string, taskId: string, updates: Partial<Task>): Task | undefined {
    const tasks = this.state.tasks[projectId];
    if (!tasks) return undefined;
    const idx = tasks.findIndex(t => t.id === taskId);
    if (idx === -1) return undefined;
    tasks[idx] = { ...tasks[idx], ...updates, updatedAt: new Date().toISOString() };
    this.addActivity(projectId, tasks[idx].assignedUserName, 'STUDENT', 'TASK_UPDATED', `Updated task: ${tasks[idx].title} (Status: ${tasks[idx].status})`);
    return tasks[idx];
  }

  deleteTask(projectId: string, taskId: string): boolean {
    const tasks = this.state.tasks[projectId];
    if (!tasks) return false;
    const initialLen = tasks.length;
    this.state.tasks[projectId] = tasks.filter(t => t.id !== taskId);
    return this.state.tasks[projectId].length < initialLen;
  }

  // --- Skills & Learning ---
  getSkillGaps(projectId: string): SkillGap[] {
    return this.state.skillGaps[projectId] || [];
  }

  setSkillGaps(projectId: string, gaps: SkillGap[]): SkillGap[] {
    this.state.skillGaps[projectId] = gaps;
    return gaps;
  }

  getLearningModules(projectId: string): LearningModule[] {
    return this.state.learningModules[projectId] || [];
  }

  updateLearningModule(projectId: string, moduleId: string, updates: Partial<LearningModule>): LearningModule | undefined {
    const modules = this.state.learningModules[projectId];
    if (!modules) return undefined;
    const idx = modules.findIndex(m => m.id === moduleId);
    if (idx === -1) return undefined;
    modules[idx] = { ...modules[idx], ...updates };
    return modules[idx];
  }

  // --- Mentor Conversations ---
  getMentorMessages(projectId: string): MentorMessage[] {
    return this.state.mentorConversations[projectId] || [];
  }

  addMentorMessage(projectId: string, msg: MentorMessage): MentorMessage {
    if (!this.state.mentorConversations[projectId]) {
      this.state.mentorConversations[projectId] = [];
    }
    this.state.mentorConversations[projectId].push(msg);
    return msg;
  }

  // --- Quality ---
  getQualityAnalysis(projectId: string): QualityAnalysis | undefined {
    return this.state.qualityAnalyses[projectId];
  }

  setQualityAnalysis(projectId: string, quality: QualityAnalysis): QualityAnalysis {
    this.state.qualityAnalyses[projectId] = quality;
    return quality;
  }

  // --- Documents ---
  getDocuments(projectId: string): ProjectDocument[] {
    return this.state.documents[projectId] || [];
  }

  getDocumentById(projectId: string, docId: string): ProjectDocument | undefined {
    return (this.state.documents[projectId] || []).find(d => d.id === docId);
  }

  saveDocument(doc: ProjectDocument): ProjectDocument {
    if (!this.state.documents[doc.projectId]) {
      this.state.documents[doc.projectId] = [];
    }
    const idx = this.state.documents[doc.projectId].findIndex(d => d.id === doc.id);
    if (idx >= 0) {
      this.state.documents[doc.projectId][idx] = doc;
    } else {
      this.state.documents[doc.projectId].push(doc);
    }
    return doc;
  }

  // --- Viva Prep ---
  getVivaPrep(projectId: string): VivaPreparation | undefined {
    return this.state.vivaPreps[projectId];
  }

  setVivaPrep(projectId: string, prep: VivaPreparation): VivaPreparation {
    this.state.vivaPreps[projectId] = prep;
    return prep;
  }

  // --- Faculty Reviews ---
  getFacultyReviews(projectId: string): FacultyReview[] {
    return this.state.facultyReviews[projectId] || [];
  }

  addFacultyReview(review: FacultyReview): FacultyReview {
    if (!this.state.facultyReviews[review.projectId]) {
      this.state.facultyReviews[review.projectId] = [];
    }
    this.state.facultyReviews[review.projectId].push(review);
    this.addActivity(review.projectId, review.facultyName, 'FACULTY', 'FACULTY_REVIEW_SUBMITTED', `Review submitted with status: ${review.status}`);
    this.logAudit(review.facultyId, review.facultyName, 'FACULTY_REVIEW_SUBMITTED', `Reviewed project ${review.projectId}: ${review.status}`);
    return review;
  }

  // --- Project Intelligence & Knowledge ---
  getKnowledgeDocs(projectId: string): KnowledgeDocument[] {
    return this.state.knowledgeDocs[projectId] || [];
  }

  getKnowledgeChunks(projectId: string): KnowledgeChunk[] {
    return this.state.knowledgeChunks[projectId] || [];
  }

  addKnowledgeChunk(chunk: KnowledgeChunk): KnowledgeChunk {
    if (!this.state.knowledgeChunks[chunk.projectId]) {
      this.state.knowledgeChunks[chunk.projectId] = [];
    }
    this.state.knowledgeChunks[chunk.projectId].push(chunk);
    return chunk;
  }

  getKnowledgeConflicts(projectId: string): KnowledgeConflict[] {
    return this.state.knowledgeConflicts[projectId] || [];
  }

  resolveKnowledgeConflict(projectId: string, conflictId: string): boolean {
    const conflicts = this.state.knowledgeConflicts[projectId];
    if (!conflicts) return false;
    const c = conflicts.find(item => item.id === conflictId);
    if (c) {
      c.resolved = true;
      return true;
    }
    return false;
  }

  getKnowledgeGaps(projectId: string): KnowledgeGap[] {
    return this.state.knowledgeGaps[projectId] || [];
  }

  getDecisions(projectId: string): ProjectDecision[] {
    return this.state.decisions[projectId] || [];
  }

  addDecision(decision: ProjectDecision): ProjectDecision {
    if (!this.state.decisions[decision.projectId]) {
      this.state.decisions[decision.projectId] = [];
    }
    this.state.decisions[decision.projectId].push(decision);
    this.addActivity(decision.projectId, decision.author, 'STUDENT', 'DECISION_CREATED', `Recorded Architectural Decision: ${decision.title}`);
    return decision;
  }

  getEvidences(projectId: string): ProjectEvidence[] {
    return this.state.evidences[projectId] || [];
  }

  updateEvidence(projectId: string, evidenceId: string, updates: Partial<ProjectEvidence>): ProjectEvidence | undefined {
    const evs = this.state.evidences[projectId];
    if (!evs) return undefined;
    const idx = evs.findIndex(e => e.id === evidenceId);
    if (idx === -1) return undefined;
    evs[idx] = { ...evs[idx], ...updates };
    return evs[idx];
  }

  // --- Risks ---
  getRisks(projectId: string): RiskItem[] {
    return this.state.risks[projectId] || [];
  }

  updateRisk(projectId: string, riskId: string, updates: Partial<RiskItem>): RiskItem | undefined {
    const risks = this.state.risks[projectId];
    if (!risks) return undefined;
    const idx = risks.findIndex(r => r.id === riskId);
    if (idx === -1) return undefined;
    risks[idx] = { ...risks[idx], ...updates };
    return risks[idx];
  }

  addRisk(risk: RiskItem): RiskItem {
    if (!this.state.risks[risk.projectId]) {
      this.state.risks[risk.projectId] = [];
    }
    this.state.risks[risk.projectId].push(risk);
    return risk;
  }

  // --- Change Requests ---
  getChangeRequests(projectId: string): ProjectChangeRequest[] {
    return this.state.changeRequests[projectId] || [];
  }

  addChangeRequest(cr: ProjectChangeRequest): ProjectChangeRequest {
    if (!this.state.changeRequests[cr.projectId]) {
      this.state.changeRequests[cr.projectId] = [];
    }
    this.state.changeRequests[cr.projectId].push(cr);
    this.addActivity(cr.projectId, cr.requestedBy, 'STUDENT', 'CHANGE_REQUEST_CREATED', `Proposed Change: ${cr.title}`);
    return cr;
  }

  updateChangeRequest(projectId: string, crId: string, updates: Partial<ProjectChangeRequest>): ProjectChangeRequest | undefined {
    const crs = this.state.changeRequests[projectId];
    if (!crs) return undefined;
    const idx = crs.findIndex(c => c.id === crId);
    if (idx === -1) return undefined;
    crs[idx] = { ...crs[idx], ...updates };
    return crs[idx];
  }

  // --- Activities ---
  getActivities(projectId: string): ActivityEvent[] {
    return this.state.activities[projectId] || [];
  }

  addActivity(projectId: string, actorName: string, actorRole: any, eventType: string, description: string) {
    if (!this.state.activities[projectId]) {
      this.state.activities[projectId] = [];
    }
    this.state.activities[projectId].unshift({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      projectId,
      timestamp: new Date().toISOString(),
      actorName,
      actorRole,
      eventType,
      description
    });
  }

  // --- Portfolio ---
  getPortfolio(projectId: string): PortfolioShowcase | undefined {
    return this.state.portfolios[projectId];
  }

  setPortfolio(portfolio: PortfolioShowcase): PortfolioShowcase {
    this.state.portfolios[portfolio.projectId] = portfolio;
    return portfolio;
  }

  // --- Admin & Audit ---
  logAudit(actorId: string, actorName: string, action: string, details: string) {
    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId,
      actorName,
      action,
      details
    });
  }

  getAuditLogs() {
    return this.state.auditLogs;
  }

  logAiUsage(log: Omit<DatabaseState['aiUsageLogs'][0], 'id' | 'timestamp'>) {
    this.state.aiUsageLogs.unshift({
      id: `ai_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...log
    });
  }

  getAiUsageLogs() {
    return this.state.aiUsageLogs;
  }

  getAnnouncements() {
    return this.state.announcements;
  }

  addAnnouncement(title: string, content: string, priority: 'NORMAL' | 'URGENT') {
    const anc = {
      id: `anc_${Date.now()}`,
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      priority
    };
    this.state.announcements.unshift(anc);
    return anc;
  }
}

export const db = new MemoryDatabase();
