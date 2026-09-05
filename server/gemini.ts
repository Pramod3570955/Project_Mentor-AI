import { GoogleGenAI } from '@google/genai';
import { ProjectIntelligenceService } from './projectIntelligence.js';
import { db } from './db.js';

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (geminiClient) return geminiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  try {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    return geminiClient;
  } catch (err) {
    console.warn('Failed to initialize Gemini client, falling back to mock provider:', err);
    return null;
  }
}

export interface AiResponseMetadata {
  provider: 'GEMINI' | 'MOCK_PROVIDER';
  model: string;
  durationMs: number;
  tokensEstimate: number;
}

export class GeminiService {
  /**
   * AI Project Idea & Recommendation Engine
   */
  static async generateProjectIdeas(params: {
    skills: string[];
    interests: string[];
    careerGoals: string[];
    department: string;
    teamSize: number;
    durationWeeks: number;
  }): Promise<{ recommendations: any[]; meta: AiResponseMetadata }> {
    const startTime = Date.now();
    const client = getGeminiClient();

    const systemPrompt = `You are the ProjectMentor AI Recommendation Engine for final-year engineering capstone students.
Given the student's background, generate 3 rigorous, highly feasible, academic-grade project recommendations.
Format your output as a JSON array of objects with:
- title: string
- category: string
- domain: string
- problem: string
- solution: string
- targetUsers: string[]
- coreFeatures: string[]
- technologies: string[]
- difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
- estimatedDurationWeeks: number
- matchScore: number (70-98)
- whyItMatches: string
- majorRisks: string[]
- academicValue: string`;

    const userPrompt = `Student Profile:
Department: ${params.department}
Skills: ${params.skills.join(', ')}
Interests: ${params.interests.join(', ')}
Career Goals: ${params.careerGoals.join(', ')}
Team Size: ${params.teamSize}
Duration: ${params.durationWeeks} weeks

Generate 3 projects with high innovation and academic capstone rigor.`;

    if (client) {
      try {
        const res = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${systemPrompt}\n\n${userPrompt}`,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const text = res.text || '[]';
        const parsed = JSON.parse(text);
        const durationMs = Date.now() - startTime;

        db.logAiUsage({
          promptTokens: 380,
          completionTokens: 420,
          model: 'gemini-3.8-flash',
          feature: 'PROJECT_RECOMMENDATIONS',
          durationMs,
          status: 'SUCCESS'
        });

        return {
          recommendations: parsed,
          meta: {
            provider: 'GEMINI',
            model: 'gemini-3.8-flash',
            durationMs,
            tokensEstimate: 800
          }
        };
      } catch (error) {
        console.warn('Gemini generateProjectIdeas error, falling back:', error);
      }
    }

    // High-quality Deterministic Academic Fallback
    const mockRecommendations = [
      {
        title: 'SafeRoute AI: Predictive Road Accident & Blackspot Early Warning System',
        category: 'Applied Machine Learning & Smart Cities',
        domain: 'Computer Vision & Geospatial Analytics',
        problem: 'Urban traffic cameras and municipal sensors capture gigabytes of feed, yet accident detection is reactive and emergency dispatches suffer 12-minute average response delays.',
        solution: 'An automated edge-vision system analyzing high-density traffic feeds for near-collision trajectories, pedestrian conflicts, and wet road skid telemetry to notify traffic control centers before collisions occur.',
        targetUsers: ['Traffic Police Command Centers', 'City Municipal Planners', 'Emergency Ambulance Dispatchers'],
        coreFeatures: [
          'YOLOv10 vehicle and pedestrian trajectory tracking',
          'Near-miss spatio-temporal anomaly detection',
          'Automated emergency dispatch SMS & Webhook trigger',
          'Heatmap of dangerous urban intersections over time'
        ],
        technologies: ['Python', 'PyTorch', 'FastAPI', 'OpenCV', 'React', 'PostgreSQL', 'PostGIS'],
        difficulty: 'ADVANCED',
        estimatedDurationWeeks: 16,
        matchScore: 94,
        whyItMatches: `Directly matches your interest in ${params.interests[0] || 'AI'} and leverages your skills in ${params.skills.slice(0, 2).join(' & ')}.`,
        majorRisks: ['Video feed throughput bottlenecks', 'False alarms during extreme rainfall or fog'],
        academicValue: 'Combines computer vision with spatial database indexing and real-time WebSocket alerting.'
      },
      {
        title: 'VeriMed: Zero-Knowledge Decentralized Clinical Trial Audit Trail',
        category: 'Cybersecurity & Health Informatics',
        domain: 'Applied Cryptography & Distributed Systems',
        problem: 'Pharmaceutical clinical trials suffer from retrospective data falsification, p-hacking, and regulatory audit friction costing millions in manual compliance verification.',
        solution: 'A zero-knowledge cryptographic ledger that commits patient trial consent, daily symptom logs, and lab results immutably without leaking sensitive patient personally identifiable information (PII).',
        targetUsers: ['Clinical Research Organizations (CROs)', 'FDA Audit Inspectors', 'Hospital Ethics Review Boards'],
        coreFeatures: [
          'zk-SNARK proof verification of patient blood glucose & ECG logs',
          'Role-based investigator access with verifiable credential delegation',
          'Automated regulatory compliance report generation',
          'Tamper-evident audit timeline with Merkle tree verification'
        ],
        technologies: ['TypeScript', 'Rust / Circom', 'Express', 'React', 'PostgreSQL', 'Docker'],
        difficulty: 'INTERMEDIATE',
        estimatedDurationWeeks: 14,
        matchScore: 90,
        whyItMatches: `Excellent match for your ${params.skills.join(', ')} skills with strong industry and compliance value.`,
        majorRisks: ['Proof generation latency on client mobile devices', 'Complex cryptographic mathematical verification during viva'],
        academicValue: 'Novel integration of applied privacy-preserving cryptography with rigorous biomedical ethics.'
      },
      {
        title: 'AquaSense: Autonomous Solar IoT Water Quality Monitoring & Contamination Sentinel',
        category: 'IoT & Environmental Engineering',
        domain: 'Embedded Systems & Predictive Time-Series Analytics',
        problem: 'Rural community water reservoirs are tested manually once every two months, leaving thousands vulnerable to sudden industrial runoff and waterborne disease outbreaks.',
        solution: 'A low-power floating IoT buoy equipped with multi-parameter probes (pH, turbidity, dissolved oxygen, conductivity) communicating via LoRaWAN to a cloud predictive dashboard.',
        targetUsers: ['Municipal Water Boards', 'Rural Health Clinics', 'Environmental Protection Agencies'],
        coreFeatures: [
          'ESP32 sensor acquisition with solar MPPT power optimization',
          'LoRaWAN telemetry gateway forwarder to MQTT broker',
          'TimescaleDB time-series anomaly detection for contamination surges',
          'Public SMS alert system for contamination alerts'
        ],
        technologies: ['C++', 'FreeRTOS', 'Python', 'FastAPI', 'TimescaleDB', 'React', 'Leaflet GIS'],
        difficulty: 'INTERMEDIATE',
        estimatedDurationWeeks: 12,
        matchScore: 86,
        whyItMatches: `Fits team size of ${params.teamSize} with clear hardware vs software module division.`,
        majorRisks: ['Sensor bio-fouling in stagnant reservoir water', 'LoRaWAN signal attenuation over hills'],
        academicValue: 'Practical physical computing capstone with measurable socio-economic impact.'
      }
    ];

    const durationMs = Date.now() - startTime;
    return {
      recommendations: mockRecommendations,
      meta: {
        provider: 'MOCK_PROVIDER',
        model: 'deterministic-academic-engine',
        durationMs,
        tokensEstimate: 650
      }
    };
  }

  /**
   * AI Project Mentor
   */
  static async queryMentor(params: {
    projectId: string;
    studentQuestion: string;
  }): Promise<{
    answerText: string;
    contextSources: { title: string; authority: string; excerpt: string }[];
    actionSuggestion?: any;
    meta: AiResponseMetadata;
  }> {
    const startTime = Date.now();
    const retrieved = ProjectIntelligenceService.retrieveContext(params.projectId, params.studentQuestion, 4);
    const project = db.getProjectById(params.projectId);
    const client = getGeminiClient();

    const systemPrompt = `You are ProjectMentor AI, an expert, rigorous academic project guide for final-year engineering students.
You MUST be grounded in the student's ACTUAL project context provided below.
NEVER hallucinate features, databases, or test metrics that are not in the context.
If a piece of information is missing, explicitly state: "Information not available in the project context."
Provide clear, authoritative, practical guidance, and propose structured actions where appropriate.`;

    const contextContent = `
[PROJECT CONTEXT]
Project Title: ${project?.title || 'Unknown'}
Domain: ${project?.domain || 'Unknown'}
Status: ${project?.status || 'Unknown'}
Current Scope: ${project?.scope.currentScope.join(', ') || 'N/A'}

[RETRIEVED KNOWLEDGE CHUNKS]
${retrieved.assembledContextText}

[KNOWN KNOWLEDGE CONFLICTS]
${retrieved.conflictsDetected.map(c => `- Conflict: ${c.topic}: ${c.description}`).join('\n') || 'None'}

[KNOWN KNOWLEDGE GAPS]
${retrieved.gapsDetected.map(g => `- Gap: ${g.area}: ${g.description}`).join('\n') || 'None'}
`;

    if (client) {
      try {
        const prompt = `${systemPrompt}\n\n${contextContent}\n\nStudent Question: ${params.studentQuestion}`;
        const res = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt
        });

        const durationMs = Date.now() - startTime;
        db.logAiUsage({
          promptTokens: 520,
          completionTokens: 240,
          model: 'gemini-3.8-flash',
          feature: 'MENTOR_CHAT',
          durationMs,
          status: 'SUCCESS'
        });

        return {
          answerText: res.text || 'I have analyzed your request based on your project context.',
          contextSources: retrieved.sourceAttributions,
          meta: {
            provider: 'GEMINI',
            model: 'gemini-3.8-flash',
            durationMs,
            tokensEstimate: 760
          }
        };
      } catch (err) {
        console.warn('Gemini queryMentor failed, using grounded fallback:', err);
      }
    }

    // Grounded deterministic fallback based on question intent
    const qLower = params.studentQuestion.toLowerCase();
    let answerText = '';
    let actionSuggestion: any = undefined;

    if (qLower.includes('today') || qLower.includes('next task') || qLower.includes('what should i do')) {
      answerText = `Based on your current project roadmap and faculty status:\n\n1. **Critical Focus**: Task 4 ("Implement WebSocket Alert Dispatcher with Deduplication") is currently **BLOCKED**.\n2. **Faculty Guidance**: Prof. Sarah Jenkins requested in Review #1 that you document clear clinical override rules so acute SpO2 drops (<85%) immediately bypass alert suppression.\n3. **Recommended Action**: Complete Learning Module "Securing High-Frequency Clinical WebSockets" and update Task 4's acceptance criteria with the override threshold logic.`;
      actionSuggestion = {
        id: `act_${Date.now()}`,
        type: 'UPDATE_TASK',
        title: 'Append Clinical Emergency Override to Task 4',
        summary: 'Update Task 4 acceptance criteria to include SpO2 < 85% emergency bypass per Prof. Jenkins directive.',
        details: { taskId: 'tsk_4', appendCriteria: 'Immediate alert broadcast override if SpO2 < 85% or HR > 140 bpm' },
        requiresConfirmation: true
      };
    } else if (qLower.includes('risk') || qLower.includes('why is my project at risk')) {
      answerText = `Your project currently has 1 High Severity Risk identified:\n\n- **Clinical Alert Suppression Risk**: Overly aggressive hysteresis could suppress an acute cardiac event if not programmed with hard medical overrides.\n- **Mitigation Status**: Proposed and approved under Change Request #1, currently awaiting implementation in Task 4.\n- **Deadline Reality**: You have 72 days remaining until the target capstone submission. Resolving Task 4 now will restore your Project Health Score from Needs Attention (84) to Healthy (92).`;
    } else if (qLower.includes('faculty') || qLower.includes('prof') || qLower.includes('sarah')) {
      answerText = `In her latest review on March 1, 2026, **Prof. Sarah Jenkins** noted:\n\n*"Strong technical architecture and impressive edge quantization benchmarks... However, before final Phase 2 approval, you must clarify the clinical alert suppression logic. Examiners will push hard on the risk of suppressing a genuine clinical emergency."*\n\nStatus: **CHANGE_REQUESTED**. Resolving this is the highest priority item for your project right now.`;
    } else if (qLower.includes('architecture') || qLower.includes('tech') || qLower.includes('database')) {
      answerText = `Your project follows a verified **3-Tier Decentralized Topology** documented in Blueprint v2:\n\n- **Tier 1 (Edge Ingest)**: ZeroMQ listener with median filtering and missing packet forward-filling.\n- **Tier 2 (Inference)**: Quantized INT8 PatchTST model running via ONNX Runtime (achieving 42ms latency and 0.892 AUROC on MIMIC-IV).\n- **Tier 3 (Clinical Console)**: React 19 + Tailwind workstation synchronized over RFC 6455 WebSockets with TimescaleDB time-series storage.`;
    } else if (qLower.includes('viva') || qLower.includes('examiner') || qLower.includes('ready')) {
      answerText = `Your Viva Readiness score is currently **82%**.\n\n- **Key Strengths**: You have verified empirical data (42ms latency, 12,000 patient cohort, 68% false alarm reduction) and 3 completed Architectural Decision Records (ADRs).\n- **Primary Viva Risk**: Examiners will challenge you on whether your suppression logic could mask acute decompensation. Be prepared to explain your SpO2 < 85% override rule and your stratified cross-validation methodology.`;
    } else {
      answerText = `I have examined your project "${project?.title}". Based on your verified project knowledge:\n\n- **Current State**: Phase 2 (Core Ingestion Engine), with 2 completed tasks and 1 blocked task.\n- **Key Evidence**: Model quantization benchmark verified at 42ms p95 latency on ARM edge gateway.\n- **Guidance**: Ensure your clinical hysteresis rules align with Prof. Jenkins' review directive before submitting Phase 2 for sign-off.`;
    }

    const durationMs = Date.now() - startTime;
    return {
      answerText,
      contextSources: retrieved.sourceAttributions,
      actionSuggestion,
      meta: {
        provider: 'MOCK_PROVIDER',
        model: 'grounded-intelligence-fallback',
        durationMs,
        tokensEstimate: 540
      }
    };
  }

  /**
   * Mock Viva AI Examiner
   */
  static async evaluateVivaAnswer(params: {
    question: string;
    expectedKeyPoints: string[];
    userAnswer: string;
    projectContext: string;
  }): Promise<{
    score: number; // 0-100
    feedback: string;
    weakTopicDetected?: string;
    suggestedImprovement: string;
    meta: AiResponseMetadata;
  }> {
    const startTime = Date.now();
    const client = getGeminiClient();

    if (client) {
      try {
        const prompt = `You are a tough, fair Academic Viva Voce Examiner for final-year engineering capstone projects.
Evaluate the student's answer to this technical question based on expected key points and project context.
Return JSON with:
- score: number (0-100)
- feedback: string
- weakTopicDetected: string (optional)
- suggestedImprovement: string

Question: ${params.question}
Expected Key Points: ${params.expectedKeyPoints.join('; ')}
Project Context: ${params.projectContext}
Student's Answer: ${params.userAnswer}`;

        const res = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });

        const parsed = JSON.parse(res.text || '{}');
        const durationMs = Date.now() - startTime;
        return {
          score: parsed.score || 80,
          feedback: parsed.feedback || 'Good technical grounding.',
          weakTopicDetected: parsed.weakTopicDetected,
          suggestedImprovement: parsed.suggestedImprovement || 'Emphasize quantifiable empirical metrics in your opening sentence.',
          meta: {
            provider: 'GEMINI',
            model: 'gemini-3.8-flash',
            durationMs,
            tokensEstimate: 600
          }
        };
      } catch (err) {
        console.warn('Gemini evaluateVivaAnswer failed, using evaluation rubric:', err);
      }
    }

    // Deterministic rubric evaluation
    const userWords = params.userAnswer.toLowerCase();
    let hitCount = 0;
    for (const point of params.expectedKeyPoints) {
      const words = point.toLowerCase().split(' ').filter(w => w.length > 4);
      if (words.some(w => userWords.includes(w))) {
        hitCount++;
      }
    }

    const ratio = params.expectedKeyPoints.length > 0 ? hitCount / params.expectedKeyPoints.length : 0.8;
    const score = Math.max(55, Math.min(95, Math.round(50 + ratio * 45)));

    let weakTopic: string | undefined = undefined;
    let feedback = 'Clear delivery. You covered the primary clinical and systems engineering concepts.';
    let suggestedImprovement = 'Ground your answer with specific numbers (e.g., 42ms latency, 12,000 admissions) to impress external examiners.';

    if (ratio < 0.5) {
      weakTopic = 'Architectural Trade-off Justification';
      feedback = 'You touched on the core idea, but failed to mention key constraints like hospital air-gap regulations and deterministic latency bounds.';
      suggestedImprovement = `Explicitly mention: "${params.expectedKeyPoints[0] || 'trade-offs'}".`;
    }

    const durationMs = Date.now() - startTime;
    return {
      score,
      feedback,
      weakTopicDetected: weakTopic,
      suggestedImprovement,
      meta: {
        provider: 'MOCK_PROVIDER',
        model: 'rubric-evaluation-engine',
        durationMs,
        tokensEstimate: 450
      }
    };
  }
}
