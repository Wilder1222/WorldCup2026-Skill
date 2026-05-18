'use strict';

/**
 * Data Scout Agent — Fetches, normalizes, and caches team/player data.
 */

const { loadTeams, loadFixtures } = require('../memory/long-term');

const TEAM_CACHE = new Map();
const PLAYER_CACHE = new Map();

class DataScoutAgent {
    constructor(options = {}) {
        this.teams = loadTeams();
    }

    /**
     * Fetch team data by name (fuzzy match).
     */
    async fetchTeam(teamName) {
        const key = teamName.toLowerCase();
        if (TEAM_CACHE.has(key)) return TEAM_CACHE.get(key);

        const team = this._findTeam(teamName);
        if (!team) {
            // Return a synthetic team profile for unknown teams
            return this._buildSyntheticTeam(teamName);
        }

        const normalized = this._normalizeTeam(team);
        TEAM_CACHE.set(key, normalized);
        return normalized;
    }

    /**
     * Fetch player data by name.
     */
    async fetchPlayer(playerName) {
        const key = playerName.toLowerCase();
        if (PLAYER_CACHE.has(key)) return PLAYER_CACHE.get(key);

        // Search in all team squads
        for (const team of this.teams) {
            if (team.squad) {
                const player = team.squad.find(p =>
                    p.name.toLowerCase().includes(key) ||
                    key.includes(p.name.toLowerCase().split(' ').pop())
                );
                if (player) {
                    const normalized = { ...player, team: team.name };
                    PLAYER_CACHE.set(key, normalized);
                    return normalized;
                }
            }
        }

        return this._buildSyntheticPlayer(playerName);
    }

    _findTeam(name) {
        const lower = name.toLowerCase();
        return this.teams.find(t =>
            t.name.toLowerCase() === lower ||
            t.name.toLowerCase().includes(lower) ||
            lower.includes(t.name.toLowerCase()) ||
            (t.aliases || []).some(a => a.toLowerCase() === lower)
        );
    }

    _normalizeTeam(team) {
        return {
            id: team.id || team.name.toLowerCase().replace(/\s+/g, '-'),
            name: team.name,
            group: team.group,
            elo_rating: team.elo_rating || 1500,
            fifa_ranking: team.fifa_ranking || 50,
            attack_rating: team.attack_rating || 70,
            defense_rating: team.defense_rating || 70,
            momentum_index: team.momentum_index || 0.5,
            formation: team.formation || '4-3-3',
            tactical_style: team.tactical_style || 'balanced',
            squad: team.squad || [],
            recent_results: team.recent_results || [],
            coach: team.coach || 'Unknown'
        };
    }

    _buildSyntheticTeam(name) {
        return {
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name,
            group: 'Unknown',
            elo_rating: 1400,
            fifa_ranking: 60,
            attack_rating: 65,
            defense_rating: 65,
            momentum_index: 0.5,
            formation: '4-4-2',
            tactical_style: 'balanced',
            squad: [],
            recent_results: [],
            coach: 'Unknown',
            synthetic: true
        };
    }

    _buildSyntheticPlayer(name) {
        return {
            name,
            position: 'Unknown',
            age: 27,
            club: 'Unknown',
            overall_rating: 75,
            form_score: 0.7,
            synthetic: true
        };
    }
}

module.exports = DataScoutAgent;
