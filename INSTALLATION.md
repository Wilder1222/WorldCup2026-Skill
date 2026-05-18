# ⚽ WorldCup 2026 Skills — Installation Guide

**Repository:** https://github.com/worldcup2026/worldcup2026-skills

This project works with Claude Code, Claude Projects, GitHub Copilot, and the npx CLI. All methods start with cloning the repository.

## Step 0 — Clone the Repository

```bash
git clone https://github.com/worldcup2026/worldcup2026-skills.git
cd worldcup2026-skills
```

> Node.js ≥ 18.0.0 is required for CLI/npx usage.

---

## Installation Methods

### 1. Claude Code Plugin (Recommended)

The `.claude-plugin/` directory contains a full plugin manifest. After installation, all 6 skills are auto-loaded inside Claude Code.

#### Install via Claude Code (in-chat)

```bash
/plugins add marketplace https://github.com/worldcup2026/worldcup2026-skills
```

#### Install via CLI

```bash
claude plugins add marketplace https://github.com/worldcup2026/worldcup2026-skills
```

#### Verify the installation

```bash
/worldcup2026-skills:match-prediction
```

#### Test Without Installing

```bash
claude --plugin-dir ./worldcup2026-skills
```

**Plugin files:**
- `.claude-plugin/plugin.json` — Plugin manifest
- `.claude-plugin/marketplace.json` — Marketplace catalog
- `skills/*/SKILL.md` — 6 auto-loaded skills

---

### 2. Claude / Claude Projects

#### Option A — Attach the GitHub Repository

```
1. Create a new Claude Project
2. Connect the GitHub repo: https://github.com/worldcup2026/worldcup2026-skills
3. In Project Instructions, paste the contents of CLAUDE.md
4. Claude will auto-load all skills/*/SKILL.md
```

#### Option B — Copy CLAUDE.md Only

```
1. Open Claude Project settings → Custom Instructions
2. Paste the full contents of CLAUDE.md
3. All 6 skills are now available
```

**Why this works:** Claude reads `SKILL.md` files from the `skills/` directory automatically when the repo is attached.

---

### 3. GitHub Copilot Extension

```
1. Clone the repository (see Step 0)
2. Open the folder in VS Code
3. Copilot auto-detects .github/copilot-instructions.md
4. All 8 agents and 6 skills are active immediately
5. Ask about World Cup predictions in any editor or chat
```

**Files involved:**
- `.github/copilot-instructions.md` — Copilot behavior config
- `AGENTS.md` — Multi-agent definitions

---

### 4. npx CLI

#### One-shot (no install)

```bash
npx github:worldcup2026/worldcup2026-skills predict "Brazil vs Argentina"
npx github:worldcup2026/worldcup2026-skills analyze-team "France"
npx github:worldcup2026/worldcup2026-skills player "Kylian Mbappe"
npx github:worldcup2026/worldcup2026-skills schedule --stage group
npx github:worldcup2026/worldcup2026-skills simulate "England vs Spain" --iterations 10000
```

#### From a local clone

```bash
node bin/worldcup-skills.js predict "Germany vs Portugal"
```

#### Global install from GitHub

```bash
npm install -g github:worldcup2026/worldcup2026-skills
wc2026 predict "Germany vs Portugal"
wc2026 standings --group A
```

**Files involved:**
- `bin/worldcup-skills.js` — CLI entry point
- `src/index.js` — Library export

---

## Platform Summary

| Platform | How It Works | Key Files |
|----------|--------------|-----------|
| Claude Code Plugin | `.claude-plugin/` manifest, `/plugin install` | `.claude-plugin/plugin.json` |
| Claude Projects | Attach GitHub repo + CLAUDE.md | `CLAUDE.md`, `skills/*/SKILL.md` |
| GitHub Copilot | Open in VS Code, auto-detected | `.github/copilot-instructions.md`, `AGENTS.md` |
| npx / CLI | `npx github:worldcup2026/worldcup2026-skills` | `bin/worldcup-skills.js` |

---

## File Structure

```
worldcup2026-skills/
├── .claude-plugin/            ← Claude Code plugin metadata
│   ├── plugin.json            ← Plugin manifest
│   └── marketplace.json       ← Marketplace catalog
├── .github/
│   └── copilot-instructions.md  ← GitHub Copilot config
├── CLAUDE.md                  ← Claude / Claude Projects config
├── AGENTS.md                  ← Multi-agent definitions
├── skills/                    ← 6 skill modules (auto-loaded)
│   ├── team-analysis/SKILL.md
│   ├── match-prediction/SKILL.md
│   ├── player-analysis/SKILL.md
│   ├── schedule-fetcher/SKILL.md
│   ├── analytics-engine/SKILL.md
│   └── data-provider/SKILL.md
├── src/                       ← Implementation
│   ├── agents/                ← 8 multi-agents
│   ├── models/                ← 5 prediction models
│   ├── evolution/             ← Self-evolving system
│   └── memory/                ← Knowledge retention
├── bin/worldcup-skills.js     ← npx / CLI entry
├── data/                      ← Teams & fixtures ⚠️ sample data
└── prompts/                   ← System prompts
```

---

## Troubleshooting

### ❌ Plugin loads but skills don't appear

1. Run `/reload-plugins` inside Claude Code
2. Verify `skills/*/SKILL.md` files exist in the cloned directory
3. Re-run: `claude plugins add marketplace https://github.com/worldcup2026/worldcup2026-skills`

### ❌ Claude Projects doesn't see the skills

1. Paste the full `CLAUDE.md` into Project Instructions
2. Ensure the GitHub repo is connected to the project
3. Restart the Claude session

### ❌ Copilot doesn't trigger the agents

1. Reload VS Code (`Ctrl+Shift+P` → "Reload Window")
2. Confirm `.github/copilot-instructions.md` exists in the workspace root
3. Ask about football or World Cup predictions to trigger the skill system

### ❌ npx command not found / fails

1. Ensure Node.js ≥ 18.0.0: `node --version`
2. Use the local clone form: `node bin/worldcup-skills.js predict "..."`
3. Or install globally: `npm install -g github:worldcup2026/worldcup2026-skills`

---

## Support

- **Repository:** https://github.com/worldcup2026/worldcup2026-skills
- **Issues:** https://github.com/worldcup2026/worldcup2026-skills/issues
- Validate the plugin locally: `claude plugin validate .` from the project root
- Ensure Node.js ≥ 18.0.0 is installed for CLI usage
