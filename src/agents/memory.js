'use strict';

/**
 * Memory Agent — Short and long-term memory for predictions, results, evolution.
 * Every prediction/analysis is persisted to data/predictions/ or data/analyses/ via PredictionStore.
 */

const ShortTermMemory = require('../memory/short-term');
const LongTermMemory = require('../memory/long-term');
const PredictionStore = require('../memory/prediction-store');

class MemoryAgent {
    constructor(options = {}) {
        this.shortTerm = new ShortTermMemory();
        this.longTerm = new LongTermMemory(options);
        this.store = new PredictionStore();
    }

    /**
     * Store a match prediction and persist it to disk.
     */
    storePrediction(prediction) {
        this.shortTerm.set(`pred:${prediction.id}`, prediction);
        this.shortTerm.set(`pred:match:${prediction.match.toLowerCase()}`, prediction);

        // Persist to disk
        try {
            const filePath = this.store.savePrediction(prediction.prediction || prediction);
            prediction._stored_at = filePath;
        } catch (e) {
            // disk write failure does not affect runtime
        }
    }

    /**
     * Store a team/player analysis and persist it to disk.
     */
    storeAnalysis(analysis) {
        try {
            const filePath = this.store.saveAnalysis(analysis);
            analysis._stored_at = filePath;
        } catch (e) {
            // disk write failure does not affect runtime
        }
        return analysis;
    }

    findPrediction(matchString) {
        return this.shortTerm.get(`pred:match:${matchString.toLowerCase()}`) || null;
    }

    /**
     * Record actual match result and update the verdict field in the disk memory document.
     */
    recordResult({ match, evaluation, weightUpdate }) {
        const key = `result:${match.match}:${Date.now()}`;
        this.shortTerm.set(key, { match, evaluation, weightUpdate, timestamp: new Date().toISOString() });
        this.longTerm.recordLearning({ match, evaluation, weightUpdate });

        // Write actual result back to disk memory document
        try {
            this.store.recordActualResult(match.match, match, evaluation);
        } catch (e) {
            // does not affect runtime
        }
    }

    getModelWeights() {
        return this.longTerm.getModelWeights();
    }

    getTeamEvolution(teamName) {
        return this.longTerm.getTeamEvolution(teamName);
    }
}

module.exports = MemoryAgent;
