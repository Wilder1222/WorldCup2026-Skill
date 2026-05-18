'use strict';

/**
 * Prediction Scientist Agent
 * Runs ELO, Bayesian, xG, and ML Ensemble models then fuses results.
 */

const EloModel = require('../models/elo');
const BayesianModel = require('../models/bayesian');
const XgModel = require('../models/xg');
const MlEnsemble = require('../models/ml-ensemble');
const FusionLayer = require('../models/fusion');

class PredictionScientistAgent {
    constructor(options = {}) {
        this.elo = new EloModel(options);
        this.bayesian = new BayesianModel(options);
        this.xg = new XgModel(options);
        this.mlEnsemble = new MlEnsemble(options);
        this.fusion = new FusionLayer(options);
    }

    /**
     * Run all prediction models and fuse results.
     * @param {{ home, away }} matchInput
     */
    async predict(matchInput) {
        const { home, away } = matchInput;

        // Run all models (synchronous calculations)
        const eloResult = this.elo.predict(home, away);
        const bayesianResult = this.bayesian.predict(home, away);
        const xgResult = this.xg.predict(home, away);
        const mlResult = this.mlEnsemble.predict(home, away);

        const modelResults = { elo: eloResult, bayesian: bayesianResult, xg: xgResult, ml: mlResult };
        const fused = this.fusion.fuse(modelResults);

        return {
            ...fused,
            models_used: ['elo', 'bayesian', 'xg', 'ml_ensemble'],
            model_breakdown: modelResults
        };
    }
}

module.exports = PredictionScientistAgent;
