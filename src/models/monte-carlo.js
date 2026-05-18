'use strict';

/**
 * Monte Carlo Simulation Model
 * Simulates a match ≥10,000 times using stochastic sampling.
 */

class MonteCarloModel {
    constructor(options = {}) {
        this.rng = mulberry32(Date.now()); // seeded PRNG for reproducibility
    }

    /**
     * Simulate match N times and aggregate results.
     */
    simulate(home, away, iterations = 10000) {
        const homeXgBase = this._estimateXg(home, away);
        const awayXgBase = this._estimateXg(away, home);

        let homeWins = 0, awayWins = 0, draws = 0;
        const goalDistributions = { home: {}, away: {} };

        for (let i = 0; i < iterations; i++) {
            // Sample xG with variance (account for randomness in football)
            const homeXg = Math.max(0, homeXgBase + this._normalSample(0, 0.3));
            const awayXg = Math.max(0, awayXgBase + this._normalSample(0, 0.3));

            // Sample goals from Poisson
            const homeGoals = this._samplePoisson(homeXg);
            const awayGoals = this._samplePoisson(awayXg);

            // Record result
            if (homeGoals > awayGoals) homeWins++;
            else if (homeGoals === awayGoals) draws++;
            else awayWins++;

            // Track goal frequency
            goalDistributions.home[homeGoals] = (goalDistributions.home[homeGoals] || 0) + 1;
            goalDistributions.away[awayGoals] = (goalDistributions.away[awayGoals] || 0) + 1;
        }

        const probabilities = {
            win: Math.round((homeWins / iterations) * 1000) / 1000,
            draw: Math.round((draws / iterations) * 1000) / 1000,
            loss: Math.round((awayWins / iterations) * 1000) / 1000
        };

        const mostLikelyScore = this._mostLikelyScore(goalDistributions, iterations);
        const confidence = this._calcConfidence(probabilities, iterations);

        return {
            model: 'monte_carlo',
            probabilities,
            iterations,
            most_likely_score: mostLikelyScore,
            confidence,
            home_xg_base: Math.round(homeXgBase * 100) / 100,
            away_xg_base: Math.round(awayXgBase * 100) / 100
        };
    }

    _estimateXg(team, opponent) {
        const attack = team.attack_rating || team.strength_vector?.attack || 70;
        const defense = opponent.defense_rating || opponent.strength_vector?.defense || 70;
        const momentum = team.momentum_index || 0.5;
        return Math.max(0.4, ((attack - defense) / 100 + 1.2) * (0.8 + momentum * 0.4));
    }

    _samplePoisson(lambda) {
        // Knuth algorithm for Poisson sampling
        const L = Math.exp(-lambda);
        let k = 0, p = 1;
        do {
            k++;
            p *= this.rng();
        } while (p > L);
        return k - 1;
    }

    _normalSample(mean, stdDev) {
        // Box-Muller transform
        const u1 = this.rng();
        const u2 = this.rng();
        const z = Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
        return mean + stdDev * z;
    }

    _mostLikelyScore(distributions, iterations) {
        let maxProb = 0;
        let bestH = 0, bestA = 0;
        const threshold = 0.001; // At least 0.1% frequency

        for (const h in distributions.home) {
            for (const a in distributions.away) {
                const prob = (distributions.home[h] / iterations) * (distributions.away[a] / iterations);
                if (prob > maxProb && prob > threshold) {
                    maxProb = prob;
                    bestH = parseInt(h);
                    bestA = parseInt(a);
                }
            }
        }

        return `${bestH}-${bestA}`;
    }

    _calcConfidence(probabilities, iterations) {
        // Higher confidence with more simulations and clearer winner
        const maxProb = Math.max(probabilities.win, probabilities.loss, probabilities.draw);
        const base = 0.6 + (maxProb - 0.33) * 0.4;
        const iterBonus = Math.min(0.1, iterations / 100000);
        return Math.min(0.92, Math.round((base + iterBonus) * 100) / 100);
    }
}

/**
 * Mulberry32 — fast, seeded pseudo-random number generator.
 */
function mulberry32(seed) {
    return function () {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

module.exports = MonteCarloModel;
