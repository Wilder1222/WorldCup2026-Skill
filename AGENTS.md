# WorldCup 2026 AI Skills System — Agent Definitions

This file defines the multi-agent architecture for GitHub Copilot, Codex, and compatible AI agent runners.

## Agent Roster

### 1. Orchestrator Agent
**Role:** CEO / Task Decomposer  
**File:** `src/agents/orchestrator.js`  
**Responsibilities:**
- Receive user football intelligence requests
- Decompose into sub-agent tasks
- Run agents in parallel where possible
- Merge and validate final results

### 2. Data Scout Agent
**Role:** Data Collector / Normalizer  
**File:** `src/agents/data-scout.js`  
**Responsibilities:**
- Fetch team and player data
- Normalize to standard schema
- Cache for session reuse

### 3. Team Intelligence Agent
**Role:** Team Analyst  
**File:** `src/agents/team-intelligence.js`  
**Responsibilities:**
- Analyze squad composition and depth
- Infer tactical style and formation
- Calculate team strength vector

### 4. Player Analyst Agent
**Role:** Player Evaluator  
**File:** `src/agents/player-analyst.js`  
**Responsibilities:**
- Score individual players
- Model player chemistry and synergy
- Estimate fatigue and injury risk

### 5. Simulation Agent
**Role:** Monte Carlo Simulator  
**File:** `src/agents/simulation.js`  
**Responsibilities:**
- Run ≥10,000 match simulations
- Generate win/draw/loss distributions
- Identify key stochastic factors

### 6. Prediction Scientist Agent
**Role:** Statistical Modeler  
**File:** `src/agents/prediction-scientist.js`  
**Responsibilities:**
- Execute ELO, Bayesian, xG, ML models
- Produce probability distributions
- Calibrate confidence scores

### 7. Debate Agent
**Role:** Critical Thinker / Anti-Hallucination Guard  
**File:** `src/agents/debate.js`  
**Responsibilities:**
- Challenge predictions for weak assumptions
- Detect model disagreement
- Produce risk report

### 8. Memory Agent
**Role:** Knowledge Keeper / Evolution Tracker  
**File:** `src/agents/memory.js`  
**Responsibilities:**
- Maintain team evolution trends
- Track prediction accuracy history
- Improve future reasoning

## Communication Protocol

```json
{
  "sender": "agent-name",
  "receiver": "agent-name",
  "task": "task-identifier",
  "input_schema": {},
  "output_schema": {}
}
```

## Execution Flow

```
User Query
  → Orchestrator
  → DataScout (fetch data)
  → [TeamIntelligence + PlayerAnalyst] (parallel)
  → PredictionScientist (models)
  → SimulationAgent (monte carlo)
  → DebateAgent (critique)
  → MemoryAgent (update)
  → Orchestrator (merge + return)
```

## Copilot Integration

When GitHub Copilot processes football-related queries in this workspace:
1. Use the agent roles above to structure reasoning
2. Reference `skills/*/SKILL.md` for domain-specific guidance  
3. Return structured JSON following `schemas/index.js`
4. Always run the prediction through at least 3 models before returning
