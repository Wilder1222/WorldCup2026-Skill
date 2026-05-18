'use strict';

/**
 * Performance Evaluator — Layer 3 of the Self-Evolving System.
 * Compares prediction vs reality, evaluates each model independently.
 */

class PerformanceEvaluator {
    constructor(options = {}) { }

    /**
     * Evaluate prediction against actual match result.
     */
    evaluate({ prediction, actual }) {
        const actualOutcome = this._parseActualOutcome(actual.score);
        const predictedProbs = prediction.prediction?.probabilities || prediction.results?.probabilities;

        if (!predictedProbs) {
            return { error: 'No prediction probabilities found', match: actual.match };
        }

        // Brier score per outcome (lower is better)
        const brierScore = this._brierScore(predictedProbs, actualOutcome);

        // Log loss
        const logLoss = this._logLoss(predictedProbs, actualOutcome);

        // Probability calibration error
        const calibrationError = this._calibrationError(predictedProbs, actualOutcome);

        // Did we predict the right outcome?
        const predictedOutcome = this._mostLikely(predictedProbs);
        const predictionCorrect = predictedOutcome === actualOutcome;

        // Surprise index: how unexpected was the actual result?
        const surpriseIndex = 1 - (predictedProbs[actualOutcome] || 0.01);

        // Per-model breakdown (if available)
        const modelBreakdown = this._evaluateModels(
            prediction.prediction?.model_breakdown || prediction.results?.model_breakdown,
            actualOutcome
        );

        return {
            match: actual.match,
            actual_outcome: actualOutcome,
            actual_score: actual.score,
            predicted_outcome: predictedOutcome,
            prediction_correct: predictionCorrect,
            brier_score: Math.round(brierScore * 10000) / 10000,
            log_loss: Math.round(logLoss * 10000) / 10000,
            calibration_error: Math.round(calibrationError * 10000) / 10000,
            surprise_index: Math.round(surpriseIndex * 1000) / 1000,
            model_accuracy: predictionCorrect ? 1 : 0,
            model_breakdown: modelBreakdown
        };
    }

    _parseActualOutcome(score) {
        if (!score) return 'draw';
        const [home, away] = score.split('-').map(Number);
        if (home > away) return 'win';
        if (away > home) return 'loss';
        return 'draw';
    }

    _brierScore(probs, actual) {
        const outcomes = ['win', 'draw', 'loss'];
        return outcomes.reduce((sum, outcome) => {
            const predicted = probs[outcome] || 0;
            const actual_indicator = outcome === actual ? 1 : 0;
            return sum + Math.pow(predicted - actual_indicator, 2);
        }, 0) / 3;
    }

    _logLoss(probs, actual) {
        const p = Math.max(1e-7, probs[actual] || 0.01);
        return -Math.log(p);
    }

    _calibrationError(probs, actual) {
        const p = probs[actual] || 0.01;
        return Math.abs(p - 1); // Distance from perfect calibration on actual outcome
    }

    _mostLikely(probs) {
        return Object.entries(probs).sort((a, b) => b[1] - a[1])[0][0];
    }

    _evaluateModels(modelBreakdown, actualOutcome) {
        if (!modelBreakdown) return null;
        const result = {};
        for (const [model, data] of Object.entries(modelBreakdown)) {
            if (data && data.probabilities) {
                const predicted = this._mostLikely(data.probabilities);
                result[model] = {
                    predicted: predicted,
                    correct: predicted === actualOutcome,
                    brier: Math.round(this._brierScore(data.probabilities, actualOutcome) * 10000) / 10000
                };
            }
        }
        return result;
    }
}

module.exports = { PerformanceEvaluator };
