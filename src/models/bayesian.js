'use strict';

/**
 * Bayesian Match Probability Model
 * Updates prior probability with recent form evidence.
 */

class BayesianModel {
    constructor(options = {}) { }

    /**
     * Bayesian inference: P(win|evidence) = P(evidence|win) * P(win) / P(evidence)
     */
    predict(home, away) {
        // Prior from ELO-derived strength
        const prior = this._buildPrior(home, away);

        // Evidence: recent form, player availability, tactical matchup
        const homeEvidence = this._collectEvidence(home);
        const awayEvidence = this._collectEvidence(away);

        // Posterior update
        const posterior = this._updatePosterior(prior, homeEvidence, awayEvidence);

        return {
            model: 'bayesian',
            probabilities: posterior.probabilities,
            prior: prior,
            evidence: { home: homeEvidence, away: awayEvidence },
            confidence: posterior.confidence
        };
    }

    _buildPrior(home, away) {
        const homeStrength = (home.overall_strength || home.elo_rating / 20 || 75) / 100;
        const awayStrength = (away.overall_strength || away.elo_rating / 20 || 75) / 100;
        const total = homeStrength + awayStrength;

        const priorWin = homeStrength / total * 0.7; // Home advantage factor
        const priorLoss = awayStrength / total * 0.7;
        const priorDraw = 1 - priorWin - priorLoss;

        return {
            win: Math.round(priorWin * 1000) / 1000,
            draw: Math.max(0.05, Math.round(priorDraw * 1000) / 1000),
            loss: Math.round(priorLoss * 1000) / 1000
        };
    }

    _collectEvidence(team) {
        const momentum = team.momentum_index || 0.5;
        const squadDepth = team.squad_depth ? team.squad_depth.score : 0.7;
        const tacticalClarity = team.tactical_profile ? 0.75 : 0.6;

        return {
            momentum_likelihood: this._momentumLikelihood(momentum),
            squad_likelihood: squadDepth,
            tactical_likelihood: tacticalClarity,
            combined: (this._momentumLikelihood(momentum) * 0.4 + squadDepth * 0.35 + tacticalClarity * 0.25)
        };
    }

    _momentumLikelihood(momentum) {
        // Bayesian likelihood: P(win | this momentum)
        if (momentum > 0.8) return 0.75;
        if (momentum > 0.6) return 0.60;
        if (momentum > 0.4) return 0.50;
        if (momentum > 0.2) return 0.35;
        return 0.20;
    }

    _updatePosterior(prior, homeEv, awayEv) {
        // Simplified Bayes: scale prior by likelihood ratio
        const homeScale = homeEv.combined;
        const awayScale = awayEv.combined;

        let winPosterior = prior.win * homeScale;
        let lossPosterior = prior.loss * awayScale;
        let drawPosterior = prior.draw * ((homeScale + awayScale) / 2);

        // Normalize
        const total = winPosterior + lossPosterior + drawPosterior;
        winPosterior /= total;
        lossPosterior /= total;
        drawPosterior /= total;

        const confidence = 0.65 + Math.abs(winPosterior - lossPosterior) * 0.1;

        return {
            probabilities: {
                win: Math.round(winPosterior * 1000) / 1000,
                draw: Math.round(drawPosterior * 1000) / 1000,
                loss: Math.round(lossPosterior * 1000) / 1000
            },
            confidence: Math.min(0.85, Math.round(confidence * 100) / 100)
        };
    }
}

module.exports = BayesianModel;
