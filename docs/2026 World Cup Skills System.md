# ⚽ WorldCup 2026 AI Skills System

You are an autonomous AI engineering agent responsible for designing and implementing a **modular AI Skills System** focused on the FIFA World Cup 2026.

This project must be designed as a **cross-platform AI Skill Package** compatible with:

- Claude Skills / Claude Projects
- OpenAI Codex Agents
- GitHub Copilot Extensions
- MCP Tool Servers
- Plugin Marketplace Installations
- `npx` project-level installation
- Multi-agent orchestration systems

The system must behave like an installable AI capability layer rather than a single application.

---

# 🧠 CORE GOAL

Build a reusable AI Skill ecosystem that provides:

1. National Team Intelligence Analysis
2. Match Schedule & Fixtures Retrieval
3. Player Capability Analysis
4. Match Outcome Prediction
5. Multi-Algorithm Football Analytics Engine

The system should function as an AI-powered football intelligence platform.

---

# 🏗️ SYSTEM ARCHITECTURE

Design using modular skill-based architecture.

Each capability MUST be an independent Skill Module.

Structure:

/worldcup-skills
 ├── skills/
 │    ├── team-analysis/
 │    ├── schedule-fetcher/
 │    ├── player-analysis/
 │    ├── match-prediction/
 │    ├── analytics-engine/
 │    └── data-provider/
 │
 ├── adapters/
 │    ├── claude/
 │    ├── codex/
 │    ├── copilot/
 │    ├── mcp-server/
 │    └── api/
 │
 ├── cli/
 │    └── npx entry
 │
 ├── prompts/
 ├── schemas/
 ├── memory/
 └── plugins/

---

# ⚙️ INSTALLATION TARGETS

The project MUST support:

## 1️⃣ Plugin Marketplace Install

Installable as:

- Claude Skill
- Copilot Extension
- MCP Tool Server
- AI Plugin Package

Expose tools automatically after installation.

---

## 2️⃣ NPX Installation

Users can run:

npx worldcup-skills

Capabilities:

- local analysis
- CLI queries
- prediction execution
- schedule lookup

---

# 🧩 SKILL MODULE DEFINITIONS

---

## Skill 1 — National Team Analysis

Capabilities:

- squad strength modeling
- tactical style classification
- formation detection
- historical performance weighting
- coach strategy inference

Output:

team_strength_score
tactical_profile
attack_rating
defense_rating
momentum_index

---

## Skill 2 — Schedule & Fixtures Engine

Functions:

- retrieve World Cup fixtures
- group standings tracking
- knockout bracket generation
- live stage awareness

Must support:

group stage
round of 16
quarterfinal
semifinal
final

---

## Skill 3 — Player Capability Analysis

Analyze players using:

- statistical metrics
- positional role analysis
- fitness estimation
- recent form weighting
- synergy with team system

Outputs:

player_rating
impact_score
consistency_index
injury_risk_estimation

---

## Skill 4 — Match Prediction Engine

Predict outcomes using multiple models:

Required algorithms:

- ELO rating model
- Bayesian probability model
- Monte Carlo simulation
- Expected Goals (xG) model
- Machine-learning ensemble prediction

Output:

win_probability
draw_probability
loss_probability
confidence_level
key_factors

---

## Skill 5 — Analytics Engine (Core Brain)

Acts as orchestration layer.

Responsibilities:

- merge skill outputs
- coordinate multi-agent reasoning
- normalize data schemas
- perform weighted decision fusion

Must support:

chain-of-tools reasoning  
multi-step analysis pipelines  
agent collaboration

---

# 🤖 MULTI-LLM COMPATIBILITY

The system must adapt automatically depending on host AI:

If Claude:
→ expose Skills API

If Codex:
→ expose Tool Functions

If Copilot:
→ register Extension Commands

If MCP:
→ expose Tool Server endpoints

---

# 🧬 PROMPT DESIGN PRINCIPLES

All prompts must:

- be tool-first
- structured outputs only
- deterministic when required
- composable between skills
- memory aware

Avoid chat-style outputs.

Return machine-readable structured data.

---

# 🧠 MEMORY SYSTEM

Implement:

short-term match context  
team knowledge cache  
player evolution tracking  
prediction history

Memory must improve predictions over time.

---

# 🔌 DATA SOURCES (ABSTRACTED)

Create adapter layer supporting:

football APIs  
historical datasets  
manual ingestion  
future live feeds

No hard dependency on a single provider.

---

# 🧪 ANALYSIS PIPELINE

When user asks:

"Who will win Argentina vs France?"

Agent must:

1. fetch teams
2. analyze squads
3. evaluate players
4. run algorithms
5. simulate matches
6. aggregate predictions
7. return structured result

---

# 📦 OUTPUT FORMAT

All skills output JSON schema:

{
  "analysis_type": "",
  "confidence": "",
  "model_sources": [],
  "results": {}
}

---

# 🚀 ADVANCED REQUIREMENTS

Enable:

multi-agent collaboration  
parallel skill execution  
plugin hot loading  
extensible skill marketplace  
future tournament reuse

---

# 🎯 FINAL OBJECTIVE

Build an AI-native Football Intelligence Skill System
that behaves like:

"npm for AI football reasoning capabilities"

NOT a chatbot.
NOT a single app.

A reusable AI skill infrastructure.