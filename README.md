# ⚽ WorldCup 2026 AI Skills System

> **World Cup opens June 11, 2026** — 48 teams, 3 countries (USA / Canada / Mexico)

**worldcup2026-skills** is a cross-platform AI football intelligence system for the 2026 FIFA World Cup. It functions as an installable AI capability layer — not a chatbot, not a single app, but a reusable AI skill infrastructure that plugs into Claude, GitHub Copilot, and the CLI.

> "npm for AI football reasoning capabilities"

---

## Quick Start

### Claude Code Plugin (Recommended)

```bash
# Install via Claude Code (in-chat)
/plugins add marketplace https://github.com/worldcup2026/worldcup2026-skills

# Or via CLI
claude plugins add marketplace https://github.com/worldcup2026/worldcup2026-skills
```

See [INSTALLATION.md](INSTALLATION.md) for all platform setup guides.

---

## Installation & Usage

### 1. Claude Code Plugin (Recommended)

The `.claude-plugin/` directory contains a full Claude Code plugin manifest. After installation, all 6 skills are auto-loaded and available as `/worldcup2026-skills:<skill>` commands.

```bash
# Install via Claude Code (in-chat)
/plugins add marketplace https://github.com/worldcup2026/worldcup2026-skills

# Or via CLI
claude plugins add marketplace https://github.com/worldcup2026/worldcup2026-skills
```

### 2. Claude / Claude Projects

Add to your Claude Project instructions or use `CLAUDE.md` as the system prompt. All skills in `skills/*/SKILL.md` are auto-loaded.

```
# In Claude Project
Attach this repository and reference CLAUDE.md
```

### 3. GitHub Copilot Extension

The `.github/copilot-instructions.md` and `AGENTS.md` files configure Copilot to use this system's agents and skills automatically — just open this workspace in VS Code.

### 4. npx (One-Shot CLI)

```bash
npx github:worldcup2026/worldcup2026-skills predict "Brazil vs Argentina"
npx github:worldcup2026/worldcup2026-skills analyze-team "France"
npx github:worldcup2026/worldcup2026-skills player "Kylian Mbappe"
npx github:worldcup2026/worldcup2026-skills schedule --stage group
npx github:worldcup2026/worldcup2026-skills simulate "England vs Spain" --iterations 10000
```

### 5. Global Install

```bash
npm install -g github:worldcup2026/worldcup2026-skills
wc2026 predict "Germany vs Portugal"
wc2026 standings --group A
```

---

## Core Skills

| Skill | Capability |
|-------|------------|
| `team-analysis` | Squad strength, tactical style, formation, momentum |
| `schedule-fetcher` | Fixtures, group standings, knockout bracket |
| `player-analysis` | Player ratings, impact score, injury risk |
| `match-prediction` | Multi-model fusion: ELO + Bayesian + xG + Monte Carlo + ML |
| `analytics-engine` | Multi-agent orchestration, decision fusion |
| `data-provider` | Abstracted data source adapter layer |

## Prediction Models

| Model | Method |
|-------|--------|
| **ELO Rating** | Dynamic team strength based on historical results |
| **Bayesian Probability** | Prior + evidence posterior inference |
| **Expected Goals (xG)** | Shot quality and scoring probability |
| **Monte Carlo Simulation** | ≥10,000 match simulations |
| **ML Ensemble** | Gradient boosting + logistic regression + neural probability |

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

All agent definitions are documented in [AGENTS.md](AGENTS.md).

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

## Data Notice

`data/teams.json` and `data/fixtures.json` are **sample data** (`SAMPLE_DATA_UNVERIFIED`). The 2026 World Cup group draw has not been confirmed — outputs must be treated as illustrative, not official. Verified real-time data takes priority when provided by the user.

---

## Project Structure

```
worldcup2026-skills/
├── .claude-plugin/            # Claude Code plugin metadata
│   ├── plugin.json            # Plugin manifest
│   └── marketplace.json       # Marketplace catalog
├── .github/
│   └── copilot-instructions.md  # GitHub Copilot config
├── bin/worldcup-skills.js     # npx / global CLI entry
├── src/
│   ├── index.js               # Library entry point
│   ├── agents/                # 8 multi-agents
│   ├── models/                # 5 prediction models
│   ├── evolution/             # Self-evolving system
│   └── memory/                # Short/long-term knowledge store
├── skills/                    # 6 AI Skill definitions (SKILL.md)
├── data/                      # Teams, fixtures, historical data ⚠️ sample
├── prompts/                   # System prompts
├── docs/                      # Architecture & design docs
├── CLAUDE.md                  # Claude / Claude Projects config
├── AGENTS.md                  # Multi-agent definitions
└── INSTALLATION.md            # Full platform installation guide
```

---

## License

MIT

---

[中文版 README →](README_CN.md)
