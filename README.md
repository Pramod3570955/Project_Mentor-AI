# ProjectMentor AI

> **Final-Year Student Project Intelligence, Development & Academic Management Platform**

ProjectMentor AI is an academic and engineering intelligence platform built to guide undergraduate and graduate engineering students through the entire lifecycle of their capstone projects—from ideation and architectural design to viva voce defense and faculty evaluation.

---

## Key Capabilities & Pillars

### 1. Project Intelligence & Grounded Context (RAG)
- **Authority-Aware Knowledge Chunks**: Ingests syllabus requirements, rubrics, faculty directives, and student development logs with explicit authority weighting.
- **Knowledge Graph & Contradiction Detection**: Analyzes project assets to detect architectural discrepancies, technology mismatches, and timeline bottlenecks before they impact student evaluations.
- **Academic Citation & Evidence**: Grounded reasoning ensuring all recommendations reference official academic rubrics or verified engineering practices.

### 2. Intelligent Project Copilot
- **Context-Aware Assistance**: Chat with an AI mentor grounded in your specific project's roadmap, code architecture, ADRs, and faculty feedback.
- **Action Suggestion & Explicit Confirmation**: The Copilot proposes concrete project mutations (e.g., creating tasks, updating status, adding criteria) with a safe, human-in-the-loop review workflow.

### 3. Architecture Blueprint & ADR Management
- **Interactive Component Mapping**: Visual diagramming for UI, API services, database layers, and external integrations.
- **Architectural Decision Records (ADRs)**: Document technical tradeoffs (Context, Decision, Consequences, Status) conforming to enterprise and academic engineering standards.

### 4. Capstone Lifecycle & Execution Engine
- **Structured Milestones & Task Tracking**: Manage deliverables, sprints, and priorities with academic milestone checkpoints.
- **Feasibility & Risk Matrix**: Evaluates technical complexity, ethical constraints, resource dependencies, and contingency plans.

### 5. Viva Voce & Defense Preparation Suite
- **Defense Simulation**: Practice with committee-style questions categorized by architecture, methodology, security, and scalability.
- **Rubric Alignment**: Real-time scoring against standard capstone defense criteria (problem definition, execution, viva defense, originality).

### 6. Faculty & Mentor Evaluation Portal
- **Stage Sign-Offs & Milestones**: Formal approval workflows for Proposal, Mid-Term, and Final Review phases.
- **Private Guide Notes & Feedback Registry**: Faculty can provide constructive private guidance and review notes directly linked to student deliverables.
- **Role-Based Access Control (RBAC)**: Enforces distinct personas for Students, Faculty Mentors, and Academic Administrators.

### 7. Quality, Verification & Platform Engineering
- **11-Dimension Quality Audit**: Dual-scoring engine measuring both *Academic Capstone Completeness* and *Industry Production Readiness*.
- **Automated Verification Test Suite**: Built-in test runner executing unit and integration assertions across risk assessment, viva scoring, security sanitization, and cache consistency.
- **Security Hardening**: Content Security Policy (CSP), rate limiting (IP token bucket), prototype pollution defense, and input sanitization.
- **Efficiency & Telemetry**: Tag-invalidated in-memory cache and real-time server latency percentiles ($p_{50}, p_{95}, p_{99}$).
- **WCAG 2.1 AA Accessibility**: Semantic HTML5 landmarks, keyboard navigation (`Escape` dismissal, focus rings), skip-to-content shortcuts, and screen-reader live regions.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React
- **Backend**: Node.js, Express, tsx
- **Bundler & Build Tooling**: Vite 6, esbuild
- **AI / LLM Integration**: Google GenAI SDK (`@google/genai`, Gemini 2.5)
- **Architecture**: Single-container Full-Stack Service (API routes mounted with Vite SPA middleware)

---

## Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm or bun
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/projectmentor-ai.git
   cd projectmentor-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Express server with Vite middleware in development mode (`port 3000`) |
| `npm run build` | Builds the client SPA via Vite and compiles the server into `dist/server.cjs` via esbuild |
| `npm start` | Runs the compiled production server (`node dist/server.cjs`) |
| `npm run lint` | Runs TypeScript static type checking without emitting files (`tsc --noEmit`) |
| `npm run clean` | Cleans previous build artifacts (`dist/`) |

---

## System Architecture

```text
├── index.html                  # HTML entry point with accessibility landmarks & meta tags
├── server.ts                   # Express server entry point mounting API routes & Vite middleware
├── server/                     # Backend domain services & business logic
│   ├── db.ts                   # In-memory mock database & seed store
│   ├── gemini.ts               # Gemini AI integration service
│   ├── projectIntelligence.ts  # Knowledge graph, RAG chunks & contradiction detection
│   ├── routes.ts               # REST API endpoints with RBAC & rate limiting
│   ├── security.ts             # Security headers, sanitization & prototype shield
│   ├── cache.ts                # Tagged in-memory cache & performance telemetry
│   └── testRunner.ts           # Automated test suites for academic & platform integrity
├── src/                        # Frontend client application
│   ├── main.tsx                # React DOM mount point
│   ├── App.tsx                 # Root layout, router view state & modals
│   ├── api.ts                  # Typed client API service
│   ├── types/                  # Shared TypeScript interfaces & types
│   └── components/             # Reusable UI views, navigation, and modal components
│       ├── Navbar.tsx          # Top navigation, project selector & persona switcher
│       ├── Sidebar.tsx         # Sidebar navigation across project lifecycle views
│       ├── CopilotModal.tsx    # Intelligent Copilot chat & action confirmation
│       ├── GlobalSearchModal.ts# Unified cross-project knowledge search
│       ├── NewProjectModal.tsx # Project initialization & scaffolding modal
│       └── views/              # Core application view components
│           ├── DashboardView.tsx     # Overview, health metrics & milestones
│           ├── BlueprintView.tsx     # Architecture diagrams & ADRs
│           ├── TasksView.tsx         # Milestone & task execution board
│           ├── VivaPrepView.tsx      # Defense simulation & question bank
│           ├── QualityView.tsx       # 11-dimension quality audit & test runner
│           ├── FacultyPortalView.tsx # Faculty reviews & stage sign-offs
│           └── AdminSettingsView.tsx # System settings, RBAC & cache stats
```

---

## Security & Reliability

- **Role-Based Access Control**: Sensitive actions (e.g. faculty grading, database resets) verify the caller's role against permissions.
- **Deep Input Sanitization**: Recursive key stripping prevents prototype pollution attacks (`__proto__`, `constructor`, `prototype`).
- **Defensive Rate Limiting**: Token bucket rate limiters prevent API abuse on computationally intensive AI routes.
- **Cache Invalidation**: Mutation events trigger tag-based cache purging, ensuring immediate data consistency.

---

## License

This project is licensed under the MIT License.
