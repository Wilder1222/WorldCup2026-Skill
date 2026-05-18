'use strict';

/**
 * ML Ensemble Model
 * Combines gradient boosting logic, logistic regression, and neural probability estimator.
 * Pure algorithmic implementation — no external ML library required.
 */

class MlEnsemble {
    constructor(options = {}) {
        // Default feature weights (updated by self-learning optimizer)
        this.weights = options.mlWeights || {
            elo_difference: 0.25,
            xg_difference: 0.20,
            momentum_difference: 0.15,
            attack_vs_defense_home: 0.15,
            attack_vs_defense_away: 0.15,
            squad_depth_difference: 0.10
        };
    }

    /**
     * Predict using feature-based ensemble.
     */
    predict(home, away) {
        const features = this._extractFeatures(home, away);

        // Logistic regression component
        const logisticScore = this._logisticRegression(features);

        // Gradient boosting simulation (decision tree ensemble)
        const gbScore = this._gradientBoostingEstimate(features);

        // Neural probability estimator (MLP-like)
        const neuralScore = this._neuralEstimate(features);

        // Ensemble: weighted average
        const ensembleWinScore = logisticScore * 0.35 + gbScore * 0.40 + neuralScore * 0.25;
        const probabilities = this._scoreToProbabilities(ensembleWinScore, features);

        return {
            model: 'ml_ensemble',
            probabilities,
            features,
            sub_models: {
                logistic_regression: Math.round(logisticScore * 1000) / 1000,
                gradient_boosting: Math.round(gbScore * 1000) / 1000,
                neural_estimator: Math.round(neuralScore * 1000) / 1000
            },
            confidence: 0.70
        };
    }

    _extractFeatures(home, away) {
        return {
            elo_difference: ((home.elo_rating || 1500) - (away.elo_rating || 1500)) / 400,
            xg_difference: ((home.attack_rating || 70) - (away.attack_rating || 70)) / 100,
            momentum_difference: (home.momentum_index || 0.5) - (away.momentum_index || 0.5),
            attack_vs_defense_home: ((home.attack_rating || 70) - (away.defense_rating || 70)) / 100,
            attack_vs_defense_away: ((away.attack_rating || 70) - (home.defense_rating || 70)) / 100,
            squad_depth_difference: this._squadDepthScore(home) - this._squadDepthScore(away)
        };
    }

    _squadDepthScore(team) {
        if (team.squad_depth) return team.squad_depth.score || 0.7;
        return (team.overall_strength || 70) / 100;
    }

    _logisticRegression(features) {
        // Linear combination → sigmoid
        let z = 0;
        for (const [key, value] of Object.entries(features)) {
            z += (this.weights[key] || 0.1) * value;
        }
        return this._sigmoid(z * 2); // scale factor
    }

    _gradientBoostingEstimate(features) {
        // Simulate boosted trees via threshold-based splits
        let score = 0.5;

        if (features.elo_difference > 0.5) score += 0.12;
        else if (features.elo_difference < -0.5) score -= 0.12;

        if (features.attack_vs_defense_home > 0.1) score += 0.08;
        if (features.momentum_difference > 0.2) score += 0.07;
        if (features.momentum_difference < -0.2) score -= 0.07;
        if (features.squad_depth_difference > 0.1) score += 0.05;
        if (features.xg_difference > 0.1) score += 0.06;
        else if (features.xg_difference < -0.1) score -= 0.06;

        return Math.max(0.1, Math.min(0.9, score));
    }

    _neuralEstimate(features) {
        // 2-layer MLP simulation with tanh activations
        const input = Object.values(features);
        const h1 = input.map(x => Math.tanh(x * 1.5));
        const h2 = h1.map((x, i) => Math.tanh(x * 1.2 - (h1[(i + 1) % h1.length] || 0) * 0.3));
        const output = h2.reduce((s, x) => s + x, 0) / h2.length;
        return this._sigmoid(output * 1.8);
    }

    _sigmoid(z) {
        return 1 / (1 + Math.exp(-z));
    }

    _scoreToProbabilities(winScore, features) {
        // Draw probability estimated from score closeness
        const drawBase = 0.25;
        const drawAdj = drawBase - Math.abs(features.elo_difference) * 0.08;
        const drawProb = Math.max(0.08, Math.min(0.35, drawAdj));

        const remaining = 1 - drawProb;
        const winProb = winScore * remaining;
        const lossProb = remaining - winProb;

        return {
            win: Math.round(winProb * 1000) / 1000,
            draw: Math.round(drawProb * 1000) / 1000,
            loss: Math.round(lossProb * 1000) / 1000
        };
    }

    /**
     * Update weights (called by self-learning optimizer).
     */
    updateWeights(newWeights) {
        this.weights = { ...this.weights, ...newWeights };
    }
}

module.exports = MlEnsemble;
