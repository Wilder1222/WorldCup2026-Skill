'use strict';

/**
 * Long-Term Memory — Loads team/fixture data, tracks evolution state.
 */

const path = require('path');
const fs = require('fs');

const { EvolutionMemory } = require('../evolution/evolution-memory');

// Singleton evolution memory (persists for process lifetime)
let _evolutionMemory = null;

function getEvolutionMemory() {
    if (!_evolutionMemory) _evolutionMemory = new EvolutionMemory();
    return _evolutionMemory;
}

class LongTermMemory {
    constructor(options = {}) {
        this.evolution = getEvolutionMemory();
        this._dataDir = path.join(__dirname, '../../data');
    }

    recordLearning(data) {
        this.evolution.recordLearning(data);
    }

    getModelWeights() {
        return this.evolution.getModelWeights();
    }

    getTeamEvolution(teamName) {
        return this.evolution.getTeamEvolution(teamName);
    }
}

// --- Data loaders ---

let _teamsCache = null;
let _fixturesCache = null;

function loadTeams() {
    if (_teamsCache) return _teamsCache;
    try {
        const filePath = path.join(__dirname, '../../data/teams.json');
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        // Support both legacy array format and new metadata-wrapped format
        _teamsCache = Array.isArray(raw) ? raw : (raw.teams || []);
        return _teamsCache;
    } catch {
        return [];
    }
}

function loadFixtures() {
    if (_fixturesCache) return _fixturesCache;
    try {
        const filePath = path.join(__dirname, '../../data/fixtures.json');
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        // Support both legacy array format and new metadata-wrapped format
        _fixturesCache = Array.isArray(raw) ? raw : (raw.fixtures || []);
        return _fixturesCache;
    } catch {
        return [];
    }
}

module.exports = LongTermMemory;
module.exports.loadTeams = loadTeams;
module.exports.loadFixtures = loadFixtures;
