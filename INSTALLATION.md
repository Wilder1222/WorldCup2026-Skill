# ⚽ WorldCup 2026 Skills — Installation Guide

This is a **Claude Code Plugin** with a built-in marketplace. Install it directly via Claude Code's plugin system.

## Installation Methods

### 1. **Claude Code Plugin** (Recommended)

#### Option A: Install via Local Path

```bash
# Add marketplace from local directory
/plugin marketplace add ./path/to/worldcup2026-skills

# Install the plugin
/plugin install worldcup2026-skills@worldcup2026

# Test a skill
/worldcup2026-skills:match-prediction
```

#### Option B: Install via CLI

```bash
claude plugin marketplace add ./worldcup2026-skills
claude plugin install worldcup2026-skills@worldcup2026
```

#### Option C: Test Without Installing

```bash
claude --plugin-dir ./worldcup2026-skills
```

**Plugin structure:**
- `.claude-plugin/plugin.json` — Plugin manifest
- `.claude-plugin/marketplace.json` — Marketplace catalog
- `skills/*/SKILL.md` — 6 auto-loaded skills (team-analysis, match-prediction, player-analysis, schedule-fetcher, analytics-engine, data-provider)

---

### 3. **Claude / Claude Projects**

#### Option A: Direct Repository Attachment
```
1. Create a new Claude Project
2. Attach this repository
3. Add to Project Instructions:
   - Paste contents of CLAUDE.md
   - System will auto-load all skills/*/SKILL.md
```

#### Option B: Copy CLAUDE.md
```
1. In Claude Project settings → Custom Instructions
2. Copy the full contents of CLAUDE.md
3. All 6 skills are now available to Claude
```

**Why this works:** Claude reads SKILL.md files from `skills/` directory automatically.

---

### 2. **GitHub Copilot Extension**

```
1. Clone or add this workspace to VS Code
2. Copilot auto-detects .github/copilot-instructions.md
3. All agents and skills are auto-loaded
4. Type in any editor and ask about World Cup predictions
```

**Files involved:**
- `.github/copilot-instructions.md` — Copilot behavior config
- `AGENTS.md` — Multi-agent definitions

---

### 3. **NPX CLI (Local Execution)**

```bash
# One-shot execution
npx worldcup2026-skills predict "Brazil vs Argentina"
npx worldcup2026-skills analyze-team "France"
npx worldcup2026-skills player "Kylian Mbappe"

# Global install
npm install -g worldcup2026-skills
wc2026 predict "Germany vs Portugal"
wc2026 standings --group A
```

**Files involved:**
- `bin/worldcup-skills.js` — CLI entry point
- `src/index.js` — Library export

---

## File Structure

```
worldcup2026-skills/
├── .claude-plugin/            ← Claude Code plugin metadata
│   ├── plugin.json            ← Plugin manifest (name, version, description)
│   └── marketplace.json       ← Marketplace catalog (for /plugin marketplace add)
├── CLAUDE.md                  ← Use this for Claude Projects
├── AGENTS.md                  ← Agent definitions
├── .github/copilot-instructions.md  ← For Copilot
├── skills/                    ← 6 skill modules (auto-loaded by Claude Code)
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
├── bin/worldcup-skills.js     ← npx entry
├── data/                      ← Teams & fixtures (2026 World Cup)
└── prompts/                   ← System prompts
```

---

## Why No "Plugin Marketplace"?

This project **uses platform-native skill loading**:

| Platform | How It Works | No Adapter Needed |
|----------|--------------|-------------------|
| Claude | Reads CLAUDE.md + skills/*.SKILL.md | ✅ Direct |
| Copilot | Reads .github/copilot-instructions.md + AGENTS.md | ✅ Direct |
| npx | Executes bin/worldcup-skills.js | ✅ Direct |

**Why?** Each platform has its own native skill/extension system. We don't need translation layers — just provide the right files in the right place.

---

## Troubleshooting

### ❌ "Marketplace file not found at ...\marketplace.json"

**Fix:** The `.claude-plugin/marketplace.json` file is now present. Use the correct install command:

```bash
/plugin marketplace add ./worldcup2026-skills
/plugin install worldcup2026-skills@worldcup2026
```

Or test without installing:
```bash
claude --plugin-dir ./worldcup2026-skills
```

### ❌ Plugin loads but skills don't appear

**Fix:**
1. Run `/reload-plugins` inside Claude Code
2. Verify `skills/*/SKILL.md` files exist
3. Check: `claude plugin details worldcup2026-skills@worldcup2026`

### ❌ Claude Projects doesn't see the skills

**Fix:**
1. Paste CLAUDE.md into Project Instructions
2. Restart Claude
3. Try asking about World Cup predictions

### ❌ Copilot doesn't trigger the agents

**Fix:**
1. Reload VS Code (Ctrl+Shift+P → "Reload Window")
2. Ensure `.github/copilot-instructions.md` exists
3. Try asking about football/World Cup

---

## Support

For installation issues:
- Validate the plugin: `claude plugin validate .` from the project root
- Check that all 6 skills exist in `skills/*/SKILL.md`
- Ensure Node.js ≥ 18.0.0 is installed (for npx)
