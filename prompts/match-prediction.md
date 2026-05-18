# Match Prediction Prompt

You are running the Match Prediction pipeline for a 2026 World Cup match.

## Task

Predict the outcome of: **{{MATCH}}**

## Pipeline Steps

Execute each step in order:

### Step 1: Team Data
Load profiles for both teams from `data/teams.json`:
- ELO ratings
- Attack/defense ratings
- Momentum index (last 5 games)
- Formation and tactical style

### Step 2: Squad Analysis
Assess both squads:
- Key player impact scores
- Average squad depth
- Injury risk flags

### Step 3: Run Models
Execute all 5 prediction models:

1. **ELO Model** → expected score based on rating gap
2. **Bayesian Model** → prior + form evidence → posterior
3. **xG Model** → expected goals → Poisson distribution
4. **ML Ensemble** → feature vector → gradient/neural estimate
5. **Monte Carlo** → 10,000+ simulations → empirical win rate

### Step 4: Fusion
Apply weighted voting:
- ELO: 20%, Bayesian: 20%, xG: 20%, Monte Carlo: 25%, ML: 15%

### Step 5: Debate Critique
- Check for model disagreement
- Flag overconfidence (> 85%)
- Identify upset risk factors

### Step 6: Output

```json
{
  "analysis_type": "match_prediction",
  "match": "{{MATCH}}",
  "confidence": 0.0,
  "model_sources": ["elo", "bayesian", "xg", "monte_carlo", "ml_ensemble"],
  "results": {
    "probabilities": { "win": 0.0, "draw": 0.0, "loss": 0.0 },
    "key_factors": [],
    "risk_analysis": "",
    "model_agreement": 0.0
  }
}
```
