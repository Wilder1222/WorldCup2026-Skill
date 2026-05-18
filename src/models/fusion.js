'use strict';

/**
 * Decision Fusion Layer
 * Combines ELO + Bayesian + xG + Monte Carlo + ML with weighted voting.
 * Weights are dynamic and updated by the self-learning optimizer.
 */

const DEFAULT_WEIGHTS = {
    elo: 0.20,
    bayesian: 0.20,
    xg: 0.20,
    monte_carlo: 0.25,
    ml: 0.15
};

class FusionLayer {
    constructor(options = {}) {
        this.weights = options.modelWeights || { ...DEFAULT_WEIGHTS };
    }

    /**
     * Fuse model results into a single prediction.
     * @param {{ elo, bayesian, xg, ml }} modelResults
     * @param {object} [monteCarloResult] - passed separately from simulation agent
     */
    fuse(modelResults) {
        const { elo, bayesian, xg, ml } = modelResults;

        // Weighted probability fusion
        const sources = [
            { name: 'elo', result: elo, weight: this.weights.elo },
            { name: 'bayesian', result: bayesian, weight: this.weights.bayesian },
            { name: 'xg', result: xg, weight: this.weights.xg },
            { name: 'ml', result: ml, weight: this.weights.ml }
        ].filter(s => s.result && s.result.probabilities);

        const totalWeight = sources.reduce((s, m) => s + m.weight, 0);

        const fused = { win: 0, draw: 0, loss: 0 };
        for (const { result, weight } of sources) {
            fused.win += result.probabilities.win * (weight / totalWeight);
            fused.draw += result.probabilities.draw * (weight / totalWeight);
            fused.loss += result.probabilities.loss * (weight / totalWeight);
        }

        // Normalize (floating point safety)
        const total = fused.win + fused.draw + fused.loss;
        const probabilities = {
            win: Math.round((fused.win / total) * 1000) / 1000,
            draw: Math.round((fused.draw / total) * 1000) / 1000,
            loss: Math.round((fused.loss / total) * 1000) / 1000
        };

        const confidence = this._calcConfidence(sources, probabilities);
        const modelAgreement = this._calcModelAgreement(sources);

        return {
            probabilities,
            confidence,
            model_agreement: modelAgreement,
            key_factors: this._deriveKeyFactors(modelResults, probabilities),
            weights_used: this.weights
        };
    }

    _calcConfidence(sources, probabilities) {
        const avgConfidence = sources.reduce((s, { result }) => s + (result.confidence || 0.7), 0) / sources.length;
        const maxProb = Math.max(probabilities.win, probabilities.draw, probabilities.loss);
        const certaintyBonus = (maxProb - 0.33) * 0.3;
        return Math.min(0.92, Math.round((avgConfidence + certaintyBonus) * 100) / 100);
    }

    _calcModelAgreement(sources) {
        if (sources.length < 2) return 1.0;
        const winProbs = sources.map(s => s.result.probabilities.win);
        const mean = winProbs.reduce((s, p) => s + p, 0) / winProbs.length;
        const variance = winProbs.reduce((s, p) => s + Math.pow(p - mean, 2), 0) / winProbs.length;
        const stdDev = Math.sqrt(variance);
        // Agreement is inverse of disagreement; low std dev = high agreement
        return Math.round(Math.max(0, 1 - stdDev * 4) * 100) / 100;
    }

    _deriveKeyFactors(modelResults, probabilities) {
        const factors = [];

        if (modelResults.elo) {
            const gap = modelResults.elo.elo_difference;
            if (Math.abs(gap) > 150) {
                factors.push(`ELO advantage: ${gap > 0 ? 'Home' : 'Away'} team rated ${Math.abs(gap)} points higher`);
            }
        }

        if (modelResults.xg) {
            const xgDiff = modelResults.xg.xg_difference;
            if (Math.abs(xgDiff) > 0.4) {
                factors.push(`xG superiority: ${xgDiff > 0 ? 'Home' : 'Away'} expected ${Math.abs(xgDiff).toFixed(1)} more goals`);
            }
        }

        if (probabilities.draw > 0.30) {
            factors.push('High draw probability — closely matched teams');
        }

        return factors;
    }

    /**
     * Update model weights (called by self-learning optimizer).
     */
    updateWeights(newWeights) {
        this.weights = { ...this.weights, ...newWeights };
    }
}

module.exports = FusionLayer;
