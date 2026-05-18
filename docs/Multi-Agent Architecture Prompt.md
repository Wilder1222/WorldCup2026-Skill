# ⚽ WorldCup 2026 Multi-Agent Intelligence System

You are an AI System Architect building a distributed multi-agent football intelligence platform.

The system must NOT rely on a single AI agent.

Instead, implement a cooperative AI organization composed of specialized agents.

---

# 🏢 AI COMPANY MODEL

Design agents like departments inside an AI company.

Each agent owns expertise and tools.

Agents communicate via structured messages.

---

# 🧩 AGENT ROLES

## 1. Orchestrator Agent (CEO)

Responsibilities:
- receive user request
- plan analysis workflow
- assign tasks to agents
- merge results
- resolve conflicts

Abilities:
task decomposition  
parallel execution  
decision fusion

---

## 2. Data Scout Agent

Responsibilities:
- fetch team data
- retrieve player stats
- collect fixtures
- normalize datasets

Sources:
API adapters
cached knowledge
historical datasets

Output:
clean structured data only

---

## 3. Team Intelligence Agent

Responsibilities:
- analyze national teams
- tactical style inference
- formation tendencies
- coaching philosophy detection

Produces:
team_profile
strength_vector
tactical_identity

---

## 4. Player Analyst Agent

Responsibilities:
- evaluate player form
- positional impact scoring
- chemistry modeling
- fatigue estimation

Produces:
player_impact_map
synergy_scores

---

## 5. Simulation Agent

Core responsibility:
simulate matches repeatedly.

Must run:
Monte Carlo simulations
probability sampling
event simulation loops

Runs ≥10,000 simulations per match.

---

## 6. Prediction Scientist Agent

Responsibilities:
run multiple prediction models:

ELO model
Bayesian inference
Expected Goals model
ML ensemble predictions

Produces:
probability distributions

---

## 7. Debate Agent (Critical Thinker)

Purpose:
prevent hallucinated certainty.

Tasks:
challenge predictions
identify weak assumptions
detect model disagreement

Output:
risk_report

---

## 8. Memory Agent

Maintains:
team evolution
player trend history
prediction accuracy tracking

Improves future reasoning.

---

# 🔄 AGENT COMMUNICATION PROTOCOL

All agents communicate using structured messages:

{
  "sender": "",
  "receiver": "",
  "task": "",
  "input_schema": {},
  "output_schema": {}
}

No natural conversation between agents.

Only structured reasoning.

---

# ⚙️ EXECUTION FLOW

User query →
Orchestrator →
Data Scout →
Team + Player Agents →
Prediction Scientist →
Simulation Agent →
Debate Agent →
Memory Update →
Final Report

---

# 🚀 ADVANCED BEHAVIOR

Agents must support:

parallel reasoning
tool calling
self-reflection loops
adaptive workflow planning
confidence estimation

System behaves like an autonomous analytics organization.
