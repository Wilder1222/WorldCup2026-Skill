---
name: analytics-engine
description: |
  Core orchestration brain. Merges all skill outputs, coordinates multi-agent reasoning,
  normalizes data schemas, and performs weighted decision fusion.
  Acts as the CEO agent for complex multi-step analysis pipelines.
allowed-tools: [Read, Write, Bash]
produces: analytics_report
consumes: team_profile, player_impact_map, match_prediction, schedule
---

# Analytics Engine Skill

## Purpose

The analytics engine is the orchestration brain. It does NOT analyze directly — it coordinates all other skills and agents, then fuses their outputs into a unified decision.

## Trigger

Invoke when:
- Complex multi-skill analysis is needed
- Running the full prediction pipeline
- Coordinating parallel agent execution
- Post-match learning and model evolution

## Orchestration Flow

```
User Query
    ↓
Analytics Engine (this skill)
    ↓ decomposes
    ├─→ data-provider skill    → normalized data
    ├─→ team-analysis skill    → team profiles  (parallel)
    ├─→ player-analysis skill  → player maps    (parallel)
    │
    ↓ aggregates
    ├─→ match-prediction skill → 5-model fusion
    ├─→ simulation agent       → Monte Carlo
    │
    ↓ validates
    ├─→ debate agent          → risk critique
    │
    ↓ stores
    └─→ memory agent          → evolution update
    │
    ↓
Final Analytics Report
```

## Supported Analysis Types

| Type | Skills Invoked |
|------|---------------|
| `match_prediction` | team-analysis + player-analysis + match-prediction |
| `team_deep_dive` | team-analysis + player-analysis |
| `tournament_outlook` | all teams + schedule-fetcher + match-prediction |
| `player_comparison` | player-analysis × N |
| `post_match_learning` | performance-evaluator + self-learning-optimizer |

## Output Schema

```json
{
  "analysis_type": "analytics_report",
  "confidence": 0.0,
  "model_sources": [],
  "results": {
    "primary_finding": "",
    "supporting_analyses": [],
    "risk_report": {},
    "evolution_state": ""
  }
}
```

## Rules

- Coordinate, don't duplicate. Delegate to other skills.
- Parallel execution where agents are independent.
- Always validate results through debate agent before returning.
- Update memory after every analysis pipeline.
