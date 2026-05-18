'use strict';

/**
 * Self-Learning Optimizer — Layer 4 of the Self-Evolving System.
 * Automatically adjusts model weights, confidence calibration, feature importance.
 * No manual tuning required.
 */

const DEFAULT_WEIGHTS = { elo: 0.20, bayesian: 0.20, xg: 0.20, monte_carlo: 0.25, ml: 0.15 };
const LEARNING_RATE = 0.05;
const MIN_WEIGHT = 0.05;
const MAX_WEIGHT = 0.50;

class SelfLearningOptimizer {
    constructor(options = {}) {
        this.modelWeights = options.modelWeights || { ...DEFAULT_WEIGHTS };
        this.learningHistory = [];
        this.updateCount = 0;
    }

    /**
     * Update model weights based on evaluation report.
     * Uses Bayesian updating + gradient descent hybrid.
     */
    update(evaluationReport) {
        if (!evaluationReport || evaluationReport.error) return null;

        const { model_breakdown, brier_score, prediction_correct, surprise_index } = evaluationReport;

        this.updateCount++;
        const update = { previous_weights: { ...this.modelWeights }, changes: {} };

        // Bayesian weight update based on per-model accuracy
        if (model_breakdown) {
            const modelScores = {};
            for (const [model, perf] of Object.entries(model_breakdown)) {
                modelScores[model] = perf.correct ? 1 - perf.brier : -perf.brier;
            }

            const totalScore = Object.values(modelScores).reduce((s, v) => s + Math.abs(v), 0);
            if (totalScore > 0) {
                for (const [model, score] of Object.entries(modelScores)) {
                    const currentWeight = this.modelWeights[model] || DEFAULT_WEIGHTS[model] || 0.15;
                    const gradient = (score / totalScore) - currentWeight;
                    const newWeight = currentWeight + LEARNING_RATE * gradient;
                    this.modelWeights[model] = Math.round(
                        Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, newWeight)) * 1000
                    ) / 1000;
                    update.changes[model] = {
                        from: update.previous_weights[model],
                        to: this.modelWeights[model]
                    };
                }
            }
        }

        // Confidence recalibration: if surprise_index is high, increase uncertainty
        const confidenceAdjustment = surprise_index > 0.7
            ? { action: 'reduce_global_confidence', factor: 0.95 }
            : prediction_correct && brier_score < 0.1
                ? { action: 'increase_trust', factor: 1.02 }
                : { action: 'no_change', factor: 1.0 };

        // Normalize weights
        this._normalizeWeights();

        const learningEntry = {
            update_index: this.updateCount,
            timestamp: new Date().toISOString(),
            brier_score,
            prediction_correct,
            surprise_index,
            weight_changes: update.changes,
            confidence_adjustment: confidenceAdjustment
        };

        this.learningHistory.push(learningEntry);

        return {
            updated_weights: { ...this.modelWeights },
            confidence_adjustment: confidenceAdjustment,
            update_count: this.updateCount,
            learning_entry: learningEntry,
            evolution_state: 'weights_updated_via_bayesian_gradient'
        };
    }

    _normalizeWeights() {
        const total = Object.values(this.modelWeights).reduce((s, v) => s + v, 0);
        if (total === 0) return;
        for (const key of Object.keys(this.modelWeights)) {
            this.modelWeights[key] = Math.round((this.modelWeights[key] / total) * 1000) / 1000;
        }
    }

    getWeights() {
        return { ...this.modelWeights };
    }

    getLearningHistory() {
        return this.learningHistory;
    }
}

module.exports = { SelfLearningOptimizer };
