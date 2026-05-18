'use strict';

/**
 * Simulation Agent — Monte Carlo match simulator (≥10,000 iterations).
 */

const MonteCarloModel = require('../models/monte-carlo');

class SimulationAgent {
    constructor(options = {}) {
        this.monteCarlo = new MonteCarloModel(options);
    }

    /**
     * Run Monte Carlo simulation.
     * @param {{ home, away }} matchInput
     * @param {{ iterations }} options
     */
    async simulate(matchInput, options = {}) {
        const { home, away } = matchInput;
        const iterations = options.iterations || 10000;

        const result = this.monteCarlo.simulate(home, away, iterations);

        return {
            ...result,
            iterations,
            confidence: result.confidence
        };
    }
}

module.exports = SimulationAgent;
