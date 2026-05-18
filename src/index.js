'use strict';

/**
 * WorldCup 2026 AI Skills System — Main Library Entry
 * Exports the high-level API used by CLI, adapters, and direct imports.
 */

const OrchestratorAgent = require('./agents/orchestrator');
const MemoryAgent = require('./agents/memory');
const PredictionStore = require('./memory/prediction-store');
const { loadTeams, loadFixtures } = require('./memory/long-term');

class WorldCupSkillsSystem {
    constructor(options = {}) {
        this.memory = new MemoryAgent(options);
        this.orchestrator = new OrchestratorAgent({ memory: this.memory, ...options });
        this._store = this.memory.store;
    }

    /**
     * Predict match outcome using full multi-agent pipeline.
     * @param {string} matchString - e.g. "Brazil vs Argentina"
     * @returns {Promise<PredictionResult>}
     */
    async predict(matchString) {
        const [homeTeam, awayTeam] = parseMatchString(matchString);
        return this.orchestrator.predictMatch({ homeTeam, awayTeam });
    }

    /**
     * Full team analysis.
     * @param {string} teamName
     */
    async analyzeTeam(teamName) {
        return this.orchestrator.analyzeTeam({ teamName });
    }

    /**
     * Analyze a player.
     * @param {string} playerName
     */
    async analyzePlayer(playerName) {
        return this.orchestrator.analyzePlayer({ playerName });
    }

    /**
     * Get schedule / fixtures.
     * @param {string} stage - 'all'|'group'|'r16'|'qf'|'sf'|'final'
     */
    async getSchedule(stage = 'all') {
        const fixtures = loadFixtures();
        if (stage === 'all') return { analysis_type: 'schedule', results: fixtures };
        return {
            analysis_type: 'schedule',
            stage,
            results: fixtures.filter(f => f.stage === stage)
        };
    }

    /**
     * Get group standings.
     * @param {string} group - 'all' or group letter
     */
    async getStandings(group = 'all') {
        const teams = loadTeams();
        if (group === 'all') {
            const groups = {};
            teams.forEach(t => {
                if (!groups[t.group]) groups[t.group] = [];
                groups[t.group].push(t);
            });
            return { analysis_type: 'standings', results: groups };
        }
        return {
            analysis_type: 'standings',
            group,
            results: teams.filter(t => t.group === group.toUpperCase())
        };
    }

    /**
     * Run Monte Carlo simulation for a match.
     */
    async simulate(matchString, options = {}) {
        const [homeTeam, awayTeam] = parseMatchString(matchString);
        return this.orchestrator.simulate({ homeTeam, awayTeam, ...options });
    }

    /**
     * List all 48 qualified teams.
     */
    async listTeams() {
        return {
            analysis_type: 'teams_list',
            total: 48,
            results: loadTeams()
        };
    }

    /**
     * Record actual match result and trigger self-evolution.
     */
    async recordResult(matchResult) {
        return this.orchestrator.recordAndEvolve(matchResult);
    }

    /**
     * List all stored prediction / analysis memory documents.
     * @param {'predictions'|'analyses'|'all'} type
     * @param {{ status?: 'pending'|'correct'|'incorrect'|'partial' }} [filters]
     */
    listPredictions(type = 'predictions', filters = {}) {
        return this._store.list(type, filters);
    }

    /**
     * Read a single prediction memory document.
     * @param {string} matchOrId - match name or prediction_id
     */
    getPrediction(matchOrId) {
        return this._store.get(matchOrId);
    }

    /**
     * Write actual match result and update memory document status (correct / incorrect / partial).
     * @param {string} matchOrId
     * @param {{ score: string, outcome: 'win'|'draw'|'loss', notes?: string }} actualResult
     */
    verifyPrediction(matchOrId, actualResult) {
        return this._store.recordActualResult(matchOrId, actualResult);
    }

    /**
     * Generate a Markdown prediction accuracy report, saved to data/predictions/REPORT_{date}.md.
     * @returns {string} reportPath
     */
    generatePredictionReport() {
        return this._store.generateReport();
    }
}

function parseMatchString(matchString) {
    const separators = [' vs ', ' v ', ' VS ', ' - '];
    for (const sep of separators) {
        if (matchString.includes(sep)) {
            return matchString.split(sep).map(s => s.trim());
        }
    }
    throw new Error(`Cannot parse match string: "${matchString}". Use format "Team A vs Team B"`);
}

module.exports = { WorldCupSkillsSystem, parseMatchString, PredictionStore };
