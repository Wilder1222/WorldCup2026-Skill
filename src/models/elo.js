'use strict';

/**
 * ELO Rating Model
 * Dynamic team strength based on historical performance.
 */

const K_FACTOR = 32; // Standard ELO K-factor for football
const BASE_RATING = 1500;

class EloModel {
    constructor(options = {}) { }

    /**
     * Predict win probability using ELO ratings.
     */
    predict(home, away) {
        const homeElo = home.elo_rating || BASE_RATING;
        const awayElo = away.elo_rating || BASE_RATING;

        const homeWinProb = this._expectedScore(homeElo, awayElo);
        const awayWinProb = this._expectedScore(awayElo, homeElo);

        // Draw probability (calibrated from historical football data)
        const drawProb = this._drawProbability(homeElo, awayElo);

        // Normalize
        const totalOutright = homeWinProb + awayWinProb;
        const scale = 1 - drawProb;
        const winNorm = (homeWinProb / totalOutright) * scale;
        const lossNorm = (awayWinProb / totalOutright) * scale;

        return {
            model: 'elo',
            probabilities: {
                win: Math.round(winNorm * 1000) / 1000,
                draw: Math.round(drawProb * 1000) / 1000,
                loss: Math.round(lossNorm * 1000) / 1000
            },
            elo_difference: homeElo - awayElo,
            home_elo: homeElo,
            away_elo: awayElo,
            confidence: 0.72
        };
    }

    /**
     * Update ELO ratings after actual match result.
     */
    updateRatings(homeElo, awayElo, homeGoals, awayGoals) {
        const homeExpected = this._expectedScore(homeElo, awayElo);
        const awayExpected = this._expectedScore(awayElo, homeElo);

        const homeActual = homeGoals > awayGoals ? 1 : homeGoals === awayGoals ? 0.5 : 0;
        const awayActual = 1 - homeActual;

        const goalFactor = this._goalFactor(Math.abs(homeGoals - awayGoals));

        return {
            home: Math.round(homeElo + K_FACTOR * goalFactor * (homeActual - homeExpected)),
            away: Math.round(awayElo + K_FACTOR * goalFactor * (awayActual - awayExpected))
        };
    }

    _expectedScore(ratingA, ratingB) {
        return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
    }

    _drawProbability(homeElo, awayElo) {
        const gap = Math.abs(homeElo - awayElo);
        // Draw less likely when gap is large
        const base = 0.28;
        return Math.max(0.10, base - gap * 0.0003);
    }

    _goalFactor(goalDiff) {
        if (goalDiff === 0) return 1.0;
        if (goalDiff === 1) return 1.0;
        if (goalDiff === 2) return 1.5;
        return 1.75;
    }
}

module.exports = EloModel;
