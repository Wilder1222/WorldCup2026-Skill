'use strict';

/**
 * Expected Goals (xG) Model
 * Estimates scoring probability based on shot quality and attack patterns.
 */

class XgModel {
    constructor(options = {}) { }

    /**
     * Estimate xG for both teams and convert to match probabilities.
     */
    predict(home, away) {
        const homeXg = this._estimateXg(home, away.defense_rating || 70);
        const awayXg = this._estimateXg(away, home.defense_rating || 70);

        const probabilities = this._xgToProbabilities(homeXg, awayXg);

        return {
            model: 'xg',
            probabilities,
            expected_goals_home: Math.round(homeXg * 100) / 100,
            expected_goals_away: Math.round(awayXg * 100) / 100,
            xg_difference: Math.round((homeXg - awayXg) * 100) / 100,
            confidence: 0.68
        };
    }

    /**
     * Estimate xG for a team against a given defensive rating.
     */
    _estimateXg(team, opponentDefense) {
        const attackRating = team.attack_rating || team.strength_vector?.attack || 70;
        const tacticalBonus = this._tacticalBonus(team.tactical_profile);
        const momentumBonus = (team.momentum_index || 0.5) * 0.3;

        // Base xG: attack vs defense differential
        const attackVsDefense = (attackRating - opponentDefense) / 100;
        const baseXg = 1.2 + attackVsDefense * 1.5 + tacticalBonus + momentumBonus;

        return Math.max(0.3, Math.min(4.0, baseXg));
    }

    _tacticalBonus(tacticalProfile) {
        if (!tacticalProfile) return 0;
        if (tacticalProfile.style === 'counter') return 0.2; // efficient attack
        if (tacticalProfile.style === 'possession') return 0.15;
        if (tacticalProfile.style === 'pressing') return 0.1;
        return 0;
    }

    /**
     * Convert xG values to win/draw/loss probabilities using Poisson distribution.
     */
    _xgToProbabilities(homeXg, awayXg) {
        const maxGoals = 8;
        let winProb = 0, drawProb = 0, lossProb = 0;

        for (let h = 0; h <= maxGoals; h++) {
            for (let a = 0; a <= maxGoals; a++) {
                const p = this._poisson(h, homeXg) * this._poisson(a, awayXg);
                if (h > a) winProb += p;
                else if (h === a) drawProb += p;
                else lossProb += p;
            }
        }

        const total = winProb + drawProb + lossProb;
        return {
            win: Math.round((winProb / total) * 1000) / 1000,
            draw: Math.round((drawProb / total) * 1000) / 1000,
            loss: Math.round((lossProb / total) * 1000) / 1000
        };
    }

    /**
     * Poisson PMF: P(k | lambda)
     */
    _poisson(k, lambda) {
        return (Math.pow(lambda, k) * Math.exp(-lambda)) / this._factorial(k);
    }

    _factorial(n) {
        if (n <= 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    }
}

module.exports = XgModel;
