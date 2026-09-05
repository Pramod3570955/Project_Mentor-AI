import { ProjectHealth, HealthStatus } from '../src/types/index.js';
import { db } from './db.js';

export function calculateProjectHealth(projectId: string): ProjectHealth {
  const project = db.getProjectById(projectId);
  if (!project) {
    return {
      status: 'NEEDS_ATTENTION',
      score: 50,
      factors: {
        roadmapProgress: 0,
        overdueTasksCount: 0,
        blockedTasksCount: 0,
        unresolvedSkillGapsCount: 0,
        qualityScore: 0,
        documentationCompleteness: 0,
        facultyApprovalStatus: 'UNKNOWN',
        knowledgeCompleteness: 0,
        daysRemaining: 0
      },
      summarySentence: 'Project records are initializing.'
    };
  }

  const tasks = db.getTasks(projectId);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const blockedTasks = tasks.filter(t => t.status === 'BLOCKED').length;
  const now = new Date();
  const overdueTasks = tasks.filter(t => t.status !== 'COMPLETED' && new Date(t.deadline) < now).length;

  const roadmapProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 10;

  const skillGaps = db.getSkillGaps(projectId);
  const unresolvedGaps = skillGaps.filter(g => g.isBlocking || g.gapScore > 10).length;

  const quality = db.getQualityAnalysis(projectId);
  const qualityScore = quality ? quality.overallScore : 70;

  const documents = db.getDocuments(projectId);
  const docCompleteness = documents.length > 0 ? Math.min(100, Math.round((documents.length / 3) * 100)) : 40;

  const facultyReviews = db.getFacultyReviews(projectId);
  const latestReview = facultyReviews[0];
  const facultyStatus = latestReview ? latestReview.status : 'PENDING';

  const knowledgeChunks = db.getKnowledgeChunks(projectId);
  const knowledgeConflicts = db.getKnowledgeConflicts(projectId).filter(c => !c.resolved);
  const knowledgeCompleteness = Math.max(20, Math.min(100, knowledgeChunks.length * 20 - knowledgeConflicts.length * 15));

  // Deadline intelligence
  const targetDate = new Date(project.targetCompletionDate);
  const diffTime = targetDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Deterministic scoring formula:
  // Baseline 100 with penalties for overdue tasks, blocked tasks, low quality, unresolved gaps, unresolved conflicts
  let rawScore = 100;
  rawScore -= overdueTasks * 12;
  rawScore -= blockedTasks * 10;
  rawScore -= unresolvedGaps * 5;
  rawScore -= (100 - qualityScore) * 0.25;
  rawScore -= (100 - docCompleteness) * 0.15;
  rawScore -= knowledgeConflicts.length * 8;

  if (facultyStatus === 'CHANGE_REQUESTED') rawScore -= 8;
  if (facultyStatus === 'REJECTED') rawScore -= 25;

  const score = Math.max(10, Math.min(100, Math.round(rawScore)));

  let status: HealthStatus = 'HEALTHY';
  if (score < 50 || overdueTasks >= 3 || facultyStatus === 'REJECTED') {
    status = 'CRITICAL';
  } else if (score < 70 || blockedTasks >= 2 || overdueTasks > 0) {
    status = 'AT_RISK';
  } else if (score < 85 || blockedTasks > 0 || unresolvedGaps > 0 || facultyStatus === 'CHANGE_REQUESTED') {
    status = 'NEEDS_ATTENTION';
  }

  let summarySentence = 'Project is progressing steadily on schedule with sound architecture.';
  if (status === 'CRITICAL') {
    summarySentence = `Critical intervention required: ${overdueTasks} overdue tasks and major blockers jeopardize completion.`;
  } else if (status === 'AT_RISK') {
    summarySentence = `Attention required: ${blockedTasks} blocked task(s) and imminent milestone deadlines require triage.`;
  } else if (status === 'NEEDS_ATTENTION') {
    summarySentence = `Overall positive trajectory, but ${blockedTasks} blocked task and faculty change request require resolution.`;
  }

  return {
    status,
    score,
    factors: {
      roadmapProgress,
      overdueTasksCount: overdueTasks,
      blockedTasksCount: blockedTasks,
      unresolvedSkillGapsCount: unresolvedGaps,
      qualityScore,
      documentationCompleteness: docCompleteness,
      facultyApprovalStatus: facultyStatus,
      knowledgeCompleteness,
      daysRemaining
    },
    summarySentence
  };
}

export function calculateProjectReadiness(projectId: string): {
  overallScore: number;
  breakdown: {
    developmentProgress: number;
    testingQuality: number;
    documentation: number;
    facultyEndorsement: number;
    vivaConfidence: number;
    knowledgeGrounding: number;
  };
  isEligibleForSubmission: boolean;
  missingCriteria: string[];
} {
  const health = calculateProjectHealth(projectId);
  const viva = db.getVivaPrep(projectId);
  const quality = db.getQualityAnalysis(projectId);
  const reviews = db.getFacultyReviews(projectId);
  const docs = db.getDocuments(projectId);

  const devProgress = health.factors.roadmapProgress;
  const testingQuality = quality ? quality.categories.find(c => c.category === 'Testing')?.score || 60 : 60;
  const documentation = health.factors.documentationCompleteness;
  const facultyEndorsement = reviews.length > 0 && reviews[0].status === 'APPROVED' ? 95 : reviews[0]?.status === 'CHANGE_REQUESTED' ? 70 : 50;
  const vivaConfidence = viva ? viva.overallReadinessScore : 50;
  const knowledgeGrounding = health.factors.knowledgeCompleteness;

  const overallScore = Math.round(
    devProgress * 0.25 +
    testingQuality * 0.15 +
    documentation * 0.20 +
    facultyEndorsement * 0.15 +
    vivaConfidence * 0.15 +
    knowledgeGrounding * 0.10
  );

  const missingCriteria: string[] = [];
  if (devProgress < 80) missingCriteria.push('Development progress is below 80% threshold');
  if (testingQuality < 75) missingCriteria.push('Automated testing coverage & validation must score >= 75');
  if (facultyEndorsement < 80) missingCriteria.push('Formal Faculty Guide Approval has not been granted');
  if (documentation < 75) missingCriteria.push('Final Year Capstone Report & SRS must be complete');
  if (health.factors.blockedTasksCount > 0) missingCriteria.push('All blocking development tasks must be resolved');

  return {
    overallScore,
    breakdown: {
      developmentProgress: devProgress,
      testingQuality,
      documentation,
      facultyEndorsement,
      vivaConfidence,
      knowledgeGrounding
    },
    isEligibleForSubmission: missingCriteria.length === 0,
    missingCriteria
  };
}

export function generateNextBestAction(projectId: string): {
  actionTitle: string;
  reason: string;
  category: 'TASK' | 'FACULTY' | 'LEARNING' | 'QUALITY' | 'VIVA' | 'DOCUMENTATION';
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  ctaText: string;
  targetView: string;
} {
  const health = calculateProjectHealth(projectId);
  const tasks = db.getTasks(projectId);
  const reviews = db.getFacultyReviews(projectId);

  // 1. Check for faculty change request
  if (reviews.length > 0 && reviews[0].status === 'CHANGE_REQUESTED') {
    const unres = reviews[0].feedbackList.find(f => !f.isResolved);
    if (unres) {
      return {
        actionTitle: 'Resolve Faculty Guide Review Directive',
        reason: `Prof. Sarah Jenkins requested: "${unres.feedback}"`,
        category: 'FACULTY',
        urgency: 'CRITICAL',
        ctaText: 'View Feedback & Update Task',
        targetView: 'faculty'
      };
    }
  }

  // 2. Check for blocked tasks
  const blockedTask = tasks.find(t => t.status === 'BLOCKED');
  if (blockedTask) {
    return {
      actionTitle: `Unblock Task: ${blockedTask.title}`,
      reason: blockedTask.notes || 'This task is blocking downstream milestone deliverables.',
      category: 'TASK',
      urgency: 'HIGH',
      ctaText: 'Open Task Workspace',
      targetView: 'tasks'
    };
  }

  // 3. Check for overdue tasks
  const now = new Date();
  const overdueTask = tasks.find(t => t.status !== 'COMPLETED' && new Date(t.deadline) < now);
  if (overdueTask) {
    return {
      actionTitle: `Overdue Task: ${overdueTask.title}`,
      reason: `Deadline was ${overdueTask.deadline}. Complete or revise estimated duration.`,
      category: 'TASK',
      urgency: 'HIGH',
      ctaText: 'Review Overdue Work',
      targetView: 'tasks'
    };
  }

  // 4. Default to next active task or viva prep
  const inProgressTask = tasks.find(t => t.status === 'IN_PROGRESS');
  if (inProgressTask) {
    return {
      actionTitle: `Continue Task: ${inProgressTask.title}`,
      reason: 'Currently in progress. Check acceptance criteria to complete milestone.',
      category: 'TASK',
      urgency: 'MEDIUM',
      ctaText: 'Continue Development',
      targetView: 'tasks'
    };
  }

  return {
    actionTitle: 'Rehearse 3-Minute Capstone Viva Defence',
    reason: 'Prepare your oral presentation and test response with the AI Viva Examiner.',
    category: 'VIVA',
    urgency: 'MEDIUM',
    ctaText: 'Start Mock Viva',
    targetView: 'viva'
  };
}
