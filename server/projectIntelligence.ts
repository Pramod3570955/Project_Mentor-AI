import {
  KnowledgeChunk,
  AuthorityLevel,
  KnowledgeConflict,
  KnowledgeGap,
  ProjectDecision,
  CopilotAction
} from '../src/types/index.js';
import { db } from './db.js';

export interface RetrievedContext {
  chunks: KnowledgeChunk[];
  assembledContextText: string;
  sourceAttributions: { title: string; authority: AuthorityLevel; excerpt: string }[];
  conflictsDetected: KnowledgeConflict[];
  gapsDetected: KnowledgeGap[];
}

export class ProjectIntelligenceService {
  /**
   * Hybrid retrieval combining keyword matching, authority weighting, and recency
   */
  static retrieveContext(projectId: string, query: string, topK: number = 4): RetrievedContext {
    const allChunks = db.getKnowledgeChunks(projectId);
    const conflicts = db.getKnowledgeConflicts(projectId).filter(c => !c.resolved);
    const gaps = db.getKnowledgeGaps(projectId);

    const queryTokens = query
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(t => t.length > 2);

    // Score each chunk
    const scoredChunks = allChunks.map(chunk => {
      let score = 0;
      const contentLower = chunk.content.toLowerCase();

      // Keyword match score
      for (const token of queryTokens) {
        if (contentLower.includes(token)) {
          score += 3;
        }
        if (chunk.keywords.some(k => k.toLowerCase().includes(token))) {
          score += 5;
        }
      }

      // Authority multiplier: VERIFIED > APPROVED > STUDENT_PROVIDED > AI_GENERATED > INFERRED
      const authorityMultiplier: Record<AuthorityLevel, number> = {
        VERIFIED: 1.5,
        APPROVED: 1.3,
        STUDENT_PROVIDED: 1.0,
        AI_GENERATED: 0.8,
        INFERRED: 0.7
      };
      score *= authorityMultiplier[chunk.authority] || 1.0;

      return {
        ...chunk,
        relevanceScore: Math.round(score * 10) / 10
      };
    });

    // Sort descending by score
    scoredChunks.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    // Fallback: If no direct token match, take top authoritative chunks
    const selectedChunks =
      scoredChunks.filter(c => (c.relevanceScore || 0) > 0).slice(0, topK).length > 0
        ? scoredChunks.filter(c => (c.relevanceScore || 0) > 0).slice(0, topK)
        : scoredChunks.slice(0, Math.min(topK, scoredChunks.length));

    // Assemble text safely with data isolation markers to mitigate prompt injection
    const assembledContextText = selectedChunks
      .map(
        (c, idx) =>
          `[DATA SOURCE ${idx + 1} | Authority: ${c.authority} | Category: ${c.category}]\n${c.content}`
      )
      .join('\n\n');

    const sourceAttributions = selectedChunks.map(c => ({
      title: `${c.category} Reference (${c.id})`,
      authority: c.authority,
      excerpt: c.content.length > 120 ? `${c.content.substring(0, 117)}...` : c.content
    }));

    return {
      chunks: selectedChunks,
      assembledContextText,
      sourceAttributions,
      conflictsDetected: conflicts,
      gapsDetected: gaps
    };
  }

  /**
   * Get complete structured knowledge graph for this project
   */
  static getKnowledgeGraph(projectId: string) {
    const project = db.getProjectById(projectId);
    const blueprint = db.getBlueprint(projectId);
    const tasks = db.getTasks(projectId);
    const skillGaps = db.getSkillGaps(projectId);
    const decisions = db.getDecisions(projectId);
    const viva = db.getVivaPrep(projectId);

    const nodes: { id: string; label: string; type: string; details?: string }[] = [];
    const edges: { source: string; target: string; relationship: string }[] = [];

    if (!project) return { nodes, edges };

    // Project node
    nodes.push({ id: project.id, label: project.title, type: 'PROJECT' });

    // Modules
    if (blueprint) {
      for (const mod of blueprint.modules) {
        nodes.push({ id: mod.id, label: mod.name, type: 'MODULE', details: mod.description });
        edges.push({ source: project.id, target: mod.id, relationship: 'CONTAINS_MODULE' });

        for (const tech of mod.technologies) {
          const techId = `tech_${tech.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
          if (!nodes.some(n => n.id === techId)) {
            nodes.push({ id: techId, label: tech, type: 'TECHNOLOGY' });
          }
          edges.push({ source: mod.id, target: techId, relationship: 'USES_TECH' });
        }
      }

      // Entities
      for (const entity of blueprint.databaseDesign) {
        const entId = `ent_${entity.name}`;
        nodes.push({ id: entId, label: `Table: ${entity.name}`, type: 'DATABASE_ENTITY', details: entity.description });
        edges.push({ source: project.id, target: entId, relationship: 'STORES_DATA_IN' });
      }

      // APIs
      for (const api of blueprint.apiEndpoints) {
        const apiId = `api_${api.method}_${api.path.replace(/[^a-zA-Z0-9]/g, '_')}`;
        nodes.push({ id: apiId, label: `${api.method} ${api.path}`, type: 'API_ENDPOINT', details: api.description });
        edges.push({ source: project.id, target: apiId, relationship: 'EXPOSES_API' });
      }
    }

    // Tasks & Skills
    for (const task of tasks) {
      nodes.push({ id: task.id, label: task.title, type: 'TASK', details: `Status: ${task.status}` });
      edges.push({ source: project.id, target: task.id, relationship: 'EXECUTES_TASK' });

      if (task.requiredSkill) {
        const skillId = `skill_${task.requiredSkill.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        if (!nodes.some(n => n.id === skillId)) {
          nodes.push({ id: skillId, label: task.requiredSkill, type: 'SKILL' });
        }
        edges.push({ source: task.id, target: skillId, relationship: 'REQUIRES_SKILL' });
      }
    }

    // Decisions
    for (const dec of decisions) {
      nodes.push({ id: dec.id, label: dec.title, type: 'DECISION', details: dec.chosenSolution });
      edges.push({ source: project.id, target: dec.id, relationship: 'GUIDED_BY_ADR' });
    }

    // Viva questions
    if (viva) {
      for (const q of viva.questions.slice(0, 3)) {
        nodes.push({ id: q.id, label: q.question, type: 'VIVA_QUESTION', details: q.difficulty });
        edges.push({ source: project.id, target: q.id, relationship: 'EVALUATED_BY_VIVA' });
      }
    }

    return { nodes, edges };
  }

  /**
   * Calculate Knowledge Completeness Score across all critical capstone categories
   */
  static getKnowledgeCompleteness(projectId: string): {
    score: number;
    categories: { name: string; score: number; isSatisfied: boolean; missingElement?: string }[];
  } {
    const blueprint = db.getBlueprint(projectId);
    const decisions = db.getDecisions(projectId);
    const docs = db.getDocuments(projectId);
    const viva = db.getVivaPrep(projectId);
    const tasks = db.getTasks(projectId);

    const categories = [
      {
        name: 'System Architecture & Scope',
        score: blueprint && blueprint.proposedSystemArchitecture ? 95 : 20,
        isSatisfied: Boolean(blueprint && blueprint.proposedSystemArchitecture),
        missingElement: blueprint ? undefined : 'Blueprint architecture is not finalized.'
      },
      {
        name: 'Database Schema & Hypertable Entities',
        score: blueprint && blueprint.databaseDesign.length >= 2 ? 90 : 30,
        isSatisfied: Boolean(blueprint && blueprint.databaseDesign.length >= 2),
        missingElement: blueprint?.databaseDesign.length ? undefined : 'Need at least 2 structured entity definitions.'
      },
      {
        name: 'API Endpoint Specifications',
        score: blueprint && blueprint.apiEndpoints.length >= 3 ? 90 : 40,
        isSatisfied: Boolean(blueprint && blueprint.apiEndpoints.length >= 3),
        missingElement: 'WebSocket and REST contracts should be specified.'
      },
      {
        name: 'Architectural Decision Memory (ADRs)',
        score: decisions.length >= 2 ? 95 : decisions.length * 40,
        isSatisfied: decisions.length >= 2,
        missingElement: decisions.length < 2 ? 'At least 2 ADRs needed explaining technology trade-offs.' : undefined
      },
      {
        name: 'Capstone SRS & Technical Documentation',
        score: docs.length >= 2 ? 90 : 45,
        isSatisfied: docs.length >= 2,
        missingElement: docs.length < 2 ? 'Generate or complete the SRS and Synopsis document.' : undefined
      },
      {
        name: 'Viva Examination Questions & Elevator Pitches',
        score: viva && viva.questions.length >= 3 ? 95 : 30,
        isSatisfied: Boolean(viva && viva.questions.length >= 3),
        missingElement: 'Complete viva Q&A grounding.'
      }
    ];

    const total = categories.reduce((sum, c) => sum + c.score, 0);
    const score = Math.round(total / categories.length);

    return { score, categories };
  }

  /**
   * Validate and propose copilot action without auto-executing
   */
  static validateCopilotAction(action: CopilotAction): { isValid: boolean; warning?: string } {
    if (!action.type || !action.title) {
      return { isValid: false, warning: 'Action is missing a valid type or descriptive title.' };
    }
    // High-impact actions require user confirmation
    if (['UPDATE_ROADMAP', 'RESOLVE_RISK'].includes(action.type)) {
      action.requiresConfirmation = true;
    }
    return { isValid: true };
  }
}
