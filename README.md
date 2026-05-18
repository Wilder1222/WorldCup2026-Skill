# ⚽ WorldCup 2026 AI Skills System

## Overview

**worldcup2026-skills** is a cross-platform AI football intelligence system for the 2026 FIFA World Cup. It functions as an installable AI capability layer — not a chatbot, not a single app, but a reusable AI skill infrastructure.

> "npm for AI football reasoning capabilities"

---

## Installation & Usage

### 1. npx (Project-Level / One-Shot)

```bash
npx worldcup2026-skills predict "Brazil vs Argentina"
npx worldcup2026-skills analyze-team "France"
npx worldcup2026-skills player "Kylian Mbappe"
npx worldcup2026-skills schedule --stage group
npx worldcup2026-skills simulate "England vs Spain" --iterations 10000
```

### 2. Global Install

```bash
npm install -g worldcup2026-skills
wc2026 predict "Germany vs Portugal"
wc2026 standings --group A
```

### 3. Claude Skills / Claude Projects

Add to your Claude Project instructions or use `CLAUDE.md` as the system prompt. All skills in `skills/*/SKILL.md` are auto-loaded.

```
# In Claude Project
Attach this repository and reference CLAUDE.md
```

### 4. GitHub Copilot Extension

The `.github/copilot-instructions.md` and `AGENTS.md` files configure Copilot to use this system's agents and skills automatically.

---

## Core Skills

| Skill | Capability |
|-------|-----------|
| `team-analysis` | Squad strength, tactical style, formation, momentum |
| `schedule-fetcher` | Fixtures, group standings, knockout bracket |
| `player-analysis` | Player ratings, impact score, injury risk |
| `match-prediction` | Multi-model fusion: ELO + Bayesian + xG + Monte Carlo + ML |
| `analytics-engine` | Multi-agent orchestration, decision fusion |
| `data-provider` | Abstracted data source adapter layer |

## Prediction Models

- **ELO Rating** — Dynamic team strength based on historical results
- **Bayesian Probability** — Prior + evidence posterior inference
- **Expected Goals (xG)** — Shot quality and scoring probability
- **Monte Carlo Simulation** — ≥10,000 match simulations
- **ML Ensemble** — Gradient boosting + logistic regression + neural probability

## Multi-Agent Architecture

```
User Query
    ↓
Orchestrator Agent (CEO)
    ↓
Data Scout Agent → normalized data
    ↓
Team Intelligence Agent + Player Analyst Agent (parallel)
    ↓
Prediction Scientist Agent → probability distributions
    ↓
Simulation Agent → Monte Carlo results
    ↓
Debate Agent → risk report (anti-hallucination)
    ↓
Memory Agent → update evolution state
    ↓
Final Structured Report
```

## Self-Evolving System

The system continuously improves during the tournament:

1. **Prediction Engine** — Multi-model predictions with confidence scores
2. **Reality Collector** — Ingests actual match results as ground truth
3. **Performance Evaluator** — Measures prediction error per model
4. **Self-Learning Optimizer** — Bayesian weight updates, no manual tuning
5. **Evolution Memory** — Long-term team/player/model intelligence tracking

## Output Format

All skills return structured JSON:

```json
{
  "analysis_type": "match_prediction",
  "confidence": 0.73,
  "model_sources": ["elo", "bayesian", "xg", "monte_carlo", "ml_ensemble"],
  "results": {
    "match": "Brazil vs Argentina",
    "probabilities": { "win": 0.45, "draw": 0.27, "loss": 0.28 },
    "key_factors": ["Squad depth", "Recent form", "Historical rivalry"],
    "risk_analysis": "High upset probability due to tournament pressure"
  }
}
```

---

## Project Structure

```
worldcup2026-skills/
├── bin/worldcup-skills.js     # npx CLI entry
├── src/
│   ├── index.js               # Library entry
│   ├── agents/                # Multi-agent system (8 agents)
│   ├── models/                # Prediction models (5 models)
│   ├── evolution/             # Self-evolving system
│   └── memory/                # Short/long-term memory
├── skills/                    # AI Skill definitions (SKILL.md + impl)
├── data/                      # Teams, fixtures, historical data
├── prompts/                   # System prompts per skill
└── schemas/                   # JSON Schema definitions
```

---

## License

MIT
