'use strict';

/**
 * Debate Agent — Critical Thinker / Anti-Hallucination Guard.
 * Challenges predictions, detects weak assumptions, produces risk report.
 */

class DebateAgent {
    constructor(options = {}) { }

    /**
     * Critique prediction and simulation results.
     */
    critique({ prediction, simulation, homeProfile, awayProfile }) {
        const risks = [];
        const weakAssumptions = [];
        const modelDisagreements = [];

        // Check model agreement
        const modelAgreement = prediction.model_agreement || 0.7;
        if (modelAgreement < 0.6) {
            modelDisagreements.push('High model disagreement: predictions vary significantly');
            risks.push('UPSET_RISK: Low model consensus increases upset probability');
        }

        // Check confidence calibration
        if (prediction.confidence > 0.85) {
            weakAssumptions.push('Overconfidence detected: probability > 85% rarely holds in knockout football');
            risks.push('OVERCONFIDENCE: Cap effective confidence at 80% for tournament matches');
        }

        // Check for ELO gap extremes
        const eloGap = Math.abs((homeProfile.elo_rating || 1500) - (awayProfile.elo_rating || 1500));
        if (eloGap > 300) {
            weakAssumptions.push(`Large ELO gap (${eloGap}) — but cup football favors upsets`);
        }

        // Simulation vs model divergence
        if (simulation && prediction.probabilities) {
            const simWin = simulation.probabilities ? simulation.probabilities.win : null;
            const modelWin = prediction.probabilities.win;
            if (simWin && Math.abs(simWin - modelWin) > 0.1) {
                modelDisagreements.push(`Monte Carlo (${simWin.toFixed(2)}) vs model avg (${modelWin.toFixed(2)}) diverge by >${Math.abs(simWin - modelWin).toFixed(2)}`);
            }
        }

        // Momentum check
        if (homeProfile.momentum_index > 0.85 && awayProfile.momentum_index > 0.85) {
            weakAssumptions.push('Both teams in peak form — form advantage neutralized');
        }

        // Synthetic data warning
        if (homeProfile.synthetic || awayProfile.synthetic) {
            risks.push('SYNTHETIC_DATA: One or more teams using estimated profile — lower reliability');
        }

        const riskLevel = risks.length >= 2 ? 'high' : risks.length === 1 ? 'medium' : 'low';

        const summary = risks.length > 0
            ? risks[0]
            : 'Prediction appears well-supported across models. Standard uncertainty applies.';

        return {
            risk_level: riskLevel,
            risks,
            weak_assumptions: weakAssumptions,
            model_disagreements: modelDisagreements,
            summary
        };
    }
}

module.exports = DebateAgent;
