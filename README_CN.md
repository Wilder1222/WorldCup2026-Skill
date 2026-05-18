# ⚽ 2026 世界杯 AI 技能系统

> **世界杯开幕时间：2026 年 6 月 11 日** — 48 支球队，三国联办（美国 / 加拿大 / 墨西哥）

**worldcup2026-skills** 是面向 2026 年 FIFA 世界杯的跨平台 AI 足球智能系统。它是一个可安装的 AI 能力层 —— 不是聊天机器人，不是单一应用，而是可复用的 AI 技能基础设施，可接入 Claude、GitHub Copilot 和命令行。

> "AI 足球推理能力的 npm"

---

## 快速开始

### Claude Code 插件（推荐）

```bash
# 在 Claude Code 对话中安装
/plugins add marketplace https://github.com/worldcup2026/worldcup2026-skills

# 或通过 CLI
claude plugins add marketplace https://github.com/worldcup2026/worldcup2026-skills
```

详细安装指南请参阅 [INSTALLATION.md](INSTALLATION.md)。

---

## 安装与使用

### 1. Claude Code 插件

`.claude-plugin/` 目录包含完整的 Claude Code 插件清单。安装后，全部 6 个技能自动加载，可通过 `/worldcup2026-skills:<技能名>` 命令调用。

```bash
# 在 Claude Code 对话中安装
/plugins add marketplace https://github.com/worldcup2026/worldcup2026-skills

# 或通过 CLI
claude plugins add marketplace https://github.com/worldcup2026/worldcup2026-skills
```

### 2. Claude / Claude Projects

将 `CLAUDE.md` 内容添加到 Claude 项目说明中，或直接用作系统提示词。`skills/*/SKILL.md` 中的所有技能将自动加载。

```
# 在 Claude Project 中
附加本仓库并引用 CLAUDE.md
```

### 3. GitHub Copilot 扩展

在 VS Code 中打开本工作区后，Copilot 会自动识别 `.github/copilot-instructions.md` 和 `AGENTS.md`，所有智能体与技能立即生效。

### 4. npx（一次性命令行）

```bash
npx github:worldcup2026/worldcup2026-skills predict "Brazil vs Argentina"
npx github:worldcup2026/worldcup2026-skills analyze-team "France"
npx github:worldcup2026/worldcup2026-skills player "Kylian Mbappe"
npx github:worldcup2026/worldcup2026-skills schedule --stage group
npx github:worldcup2026/worldcup2026-skills simulate "England vs Spain" --iterations 10000
```

### 5. 全局安装

```bash
npm install -g github:worldcup2026/worldcup2026-skills
wc2026 predict "Germany vs Portugal"
wc2026 standings --group A
```

---

## 核心技能

| 技能 | 功能 |
|------|------|
| `team-analysis` | 阵容实力、战术风格、阵型、近期状态 |
| `schedule-fetcher` | 赛程、小组积分榜、淘汰赛对阵 |
| `player-analysis` | 球员评分、影响力分数、伤病风险 |
| `match-prediction` | 多模型融合预测：ELO + 贝叶斯 + xG + 蒙特卡洛 + ML |
| `analytics-engine` | 多智能体编排、决策融合 |
| `data-provider` | 抽象数据源适配层 |

## 预测模型

| 模型 | 方法 |
|------|------|
| **ELO 评级** | 基于历史战绩的动态球队实力评估 |
| **贝叶斯概率** | 先验 + 证据后验推断 |
| **预期进球（xG）** | 射门质量与进球概率分析 |
| **蒙特卡洛模拟** | ≥10,000 次比赛模拟 |
| **ML 集成** | 梯度提升 + 逻辑回归 + 神经概率模型 |

## 多智能体架构

```
用户请求
    ↓
编排智能体（总指挥）
    ↓
数据侦察智能体 → 标准化数据
    ↓
球队情报智能体 + 球员分析智能体（并行）
    ↓
预测科学家智能体 → 概率分布
    ↓
模拟智能体 → 蒙特卡洛结果
    ↓
辩论智能体 → 风险报告（反幻觉校验）
    ↓
记忆智能体 → 更新演化状态
    ↓
最终结构化报告
```

智能体定义详见 [AGENTS.md](AGENTS.md)。

## 自进化系统

系统在赛事进行期间持续自我优化：

1. **预测引擎** — 带置信度分数的多模型预测
2. **结果采集器** — 摄入真实比赛结果作为基准真值
3. **性能评估器** — 逐模型测量预测误差
4. **自学习优化器** — 贝叶斯权重更新，无需人工调参
5. **演化记忆** — 球队 / 球员 / 模型的长期智能追踪

## 输出格式

所有技能均返回标准化 JSON：

```json
{
  "analysis_type": "match_prediction",
  "confidence": 0.73,
  "model_sources": ["elo", "bayesian", "xg", "monte_carlo", "ml_ensemble"],
  "results": {
    "match": "Brazil vs Argentina",
    "probabilities": { "win": 0.45, "draw": 0.27, "loss": 0.28 },
    "key_factors": ["阵容深度", "近期状态", "历史交锋"],
    "risk_analysis": "赛事压力导致爆冷概率较高"
  }
}
```

---

## 数据说明

`data/teams.json` 和 `data/fixtures.json` 为**样本数据**（`SAMPLE_DATA_UNVERIFIED`）。2026 年世界杯分组抽签结果尚未确认，所有输出应视为示例，非官方数据。用户提供的实时数据具有最高优先级。

---

## 项目结构

```
worldcup2026-skills/
├── .claude-plugin/            # Claude Code 插件元数据
│   ├── plugin.json            # 插件清单
│   └── marketplace.json       # 市场目录
├── .github/
│   └── copilot-instructions.md  # GitHub Copilot 配置
├── bin/worldcup-skills.js     # npx / 全局 CLI 入口
├── src/
│   ├── index.js               # 库入口
│   ├── agents/                # 8 个多智能体
│   ├── models/                # 5 个预测模型
│   ├── evolution/             # 自进化系统
│   └── memory/                # 短期 / 长期知识库
├── skills/                    # 6 个 AI 技能定义（SKILL.md）
├── data/                      # 球队、赛程、历史数据 ⚠️ 样本
├── prompts/                   # 系统提示词
├── docs/                      # 架构与设计文档
├── CLAUDE.md                  # Claude / Claude Projects 配置
├── AGENTS.md                  # 多智能体定义
└── INSTALLATION.md            # 完整平台安装指南
```

---

## 许可证

MIT

---

[English README →](README.md)
