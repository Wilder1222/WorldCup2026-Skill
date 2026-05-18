'use strict';

/**
 * Evolution Memory — Layer 5 of the Self-Evolving System.
 * Long-term intelligence: team trends, player aging, model history, prediction accuracy.
 */

class EvolutionMemory {
    constructor() {
        this.teamEvolution = {};
        this.playerTrends = {};
        this.modelHistory = [];
        this.predictionAccuracy = {
            total: 0,
            correct: 0,
            by_model: {}
        };
        this.modelWeights = {
            elo: 0.20,
            bayesian: 0.20,
            xg: 0.20,
            monte_carlo: 0.25,
            ml: 0.15
        };
    }

    /**
     * Record a learning event and update memory.
     */
    recordLearning({ match, evaluation, weightUpdate }) {
        if (!evaluation) return;

        // Update prediction accuracy tracking
        this.predictionAccuracy.total++;
        if (evaluation.prediction_correct) this.predictionAccuracy.correct++;

        // Per-model accuracy
        if (evaluation.model_breakdown) {
            for (const [model, perf] of Object.entries(evaluation.model_breakdown)) {
                if (!this.predictionAccuracy.by_model[model]) {
                    this.predictionAccuracy.by_model[model] = { total: 0, correct: 0 };
                }
                this.predictionAccuracy.by_model[model].total++;
                if (perf.correct) this.predictionAccuracy.by_model[model].correct++;
            }
        }

        // Update model weights if provided
        if (weightUpdate && weightUpdate.updated_weights) {
            this.modelWeights = weightUpdate.updated_weights;
        }

        // Team evolution tracking
        if (match.match) {
            const [home, away] = match.match.split(' vs ');
            const outcome = evaluation.actual_outcome;
            this._updateTeamEvolution(home, outcome === 'win' ? 'W' : outcome === 'draw' ? 'D' : 'L');
            this._updateTeamEvolution(away, outcome === 'loss' ? 'W' : outcome === 'draw' ? 'D' : 'L');
        }

        // Model history entry
        this.modelHistory.push({
            timestamp: new Date().toISOString(),
            match: match.match,
            brier_score: evaluation.brier_score,
            surprise_index: evaluation.surprise_index,
            prediction_correct: evaluation.prediction_correct
        });
    }

    _updateTeamEvolution(teamName, result) {
        if (!teamName) return;
        if (!this.teamEvolution[teamName]) {
            this.teamEvolution[teamName] = { results: [], wins: 0, draws: 0, losses: 0 };
        }
        this.teamEvolution[teamName].results.push(result);
        if (result === 'W') this.teamEvolution[teamName].wins++;
        else if (result === 'D') this.teamEvolution[teamName].draws++;
        else this.teamEvolution[teamName].losses++;
    }

    getModelWeights() {
        return { ...this.modelWeights };
    }

    getTeamEvolution(teamName) {
        return this.teamEvolution[teamName] || null;
    }

    getAccuracyReport() {
        const total = this.predictionAccuracy.total;
        return {
            total_predictions: total,
            overall_accuracy: total > 0 ? Math.round(this.predictionAccuracy.correct / total * 100) / 100 : null,
            by_model: Object.fromEntries(
                Object.entries(this.predictionAccuracy.by_model).map(([m, v]) => [
                    m, { accuracy: v.total > 0 ? Math.round(v.correct / v.total * 100) / 100 : null, total: v.total }
                ])
            )
        };
    }
}

module.exports = { EvolutionMemory };
