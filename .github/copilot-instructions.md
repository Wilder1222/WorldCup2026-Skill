---
applyTo: "**"
---
# ⚽ WorldCup 2026 AI Skills — GitHub Copilot Instructions

You are operating in the **WorldCup 2026 AI Skills** workspace.

## Available Skills

When answering football/World Cup questions, use the skills defined in `skills/*/SKILL.md`:

- **team-analysis** — Analyze national teams
- **match-prediction** — Multi-model match predictions
- **player-analysis** — Player capability evaluation
- **schedule-fetcher** — Fixtures and standings
- **analytics-engine** — Full orchestration pipeline
- **data-provider** — Data loading and normalization

## Code Generation Rules

1. All analysis functions must return the standard JSON schema:
   ```json
   { "analysis_type": "", "confidence": 0.0, "model_sources": [], "results": {} }
   ```

2. Prediction code must use multiple models — never single-model.

3. The `src/models/` directory contains the implementations. Reference them rather than reimplementing.

4. Agent communication uses structured messages (see `AGENTS.md`).

5. All data access goes through `src/agents/data-scout.js` — never direct file reads in skill code.

## Architecture Reference

- `src/agents/orchestrator.js` — Central coordinator
- `src/models/fusion.js` — Decision fusion layer
- `src/evolution/` — Self-learning system

## When Asked About World Cup

Always run the full pipeline: DataScout → TeamIntelligence → PredictionScientist → DebateAgent.
Never skip the Debate Agent critique step.
