'use strict';

/**
 * Memory Agent — Short and long-term memory for predictions, results, evolution.
 */

const ShortTermMemory = require('../memory/short-term');
const LongTermMemory = require('../memory/long-term');

class MemoryAgent {
    constructor(options = {}) {
        this.shortTerm = new ShortTermMemory();
        this.longTerm = new LongTermMemory(options);
    }

    storePrediction(prediction) {
        this.shortTerm.set(`pred:${prediction.id}`, prediction);
        this.shortTerm.set(`pred:match:${prediction.match.toLowerCase()}`, prediction);
    }

    findPrediction(matchString) {
        return this.shortTerm.get(`pred:match:${matchString.toLowerCase()}`) || null;
    }

    recordResult({ match, evaluation, weightUpdate }) {
        const key = `result:${match.match}:${Date.now()}`;
        this.shortTerm.set(key, { match, evaluation, weightUpdate, timestamp: new Date().toISOString() });
        this.longTerm.recordLearning({ match, evaluation, weightUpdate });
    }

    getModelWeights() {
        return this.longTerm.getModelWeights();
    }

    getTeamEvolution(teamName) {
        return this.longTerm.getTeamEvolution(teamName);
    }
}

module.exports = MemoryAgent;
