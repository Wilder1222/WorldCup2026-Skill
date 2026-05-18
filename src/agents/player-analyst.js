'use strict';

/**
 * Player Analyst Agent
 * Evaluates players: ratings, impact, chemistry, fatigue, injury risk.
 */

class PlayerAnalystAgent {
    constructor(options = {}) { }

    /**
     * Analyze entire squad and return impact map.
     */
    async analyzeSquad(teamData) {
        const squad = teamData.squad || [];
        if (squad.length === 0) {
            return {
                squad_size: 0,
                average_impact: 0.65,
                top_players: [],
                synergy_score: 0.6,
                fatigue_risk: 'low'
            };
        }

        const analyzed = squad.map(p => this._analyzePlayer(p));
        const avgImpact = analyzed.reduce((s, p) => s + p.impact_score, 0) / analyzed.length;
        const synergy = this._calcSynergy(analyzed);

        return {
            squad_size: squad.length,
            average_impact: Math.round(avgImpact * 100) / 100,
            top_players: analyzed.sort((a, b) => b.impact_score - a.impact_score).slice(0, 5),
            synergy_score: synergy,
            fatigue_risk: avgImpact > 0.8 ? 'high_workload' : 'manageable',
            player_map: analyzed
        };
    }

    /**
     * Analyze a single player in detail.
     */
    async analyzeSinglePlayer(playerData) {
        const analysis = this._analyzePlayer(playerData);
        return {
            ...analysis,
            confidence: playerData.synthetic ? 0.4 : 0.78
        };
    }

    _analyzePlayer(player) {
        const baseRating = player.overall_rating || 75;
        const form = player.form_score || 0.7;
        const age = player.age || 27;

        const ageFactor = this._ageFactor(age);
        const impactScore = Math.round((baseRating / 100 * 0.5 + form * 0.35 + ageFactor * 0.15) * 100) / 100;
        const injuryRisk = this._injuryRisk(age, player.minutes_played);
        const consistencyIndex = this._consistencyIndex(player);

        return {
            name: player.name,
            position: player.position || 'Unknown',
            age,
            club: player.club || 'Unknown',
            player_rating: baseRating,
            impact_score: impactScore,
            form_score: form,
            consistency_index: consistencyIndex,
            injury_risk_estimation: injuryRisk,
            age_factor: ageFactor
        };
    }

    _ageFactor(age) {
        // Peak performance roughly 24-29
        if (age >= 24 && age <= 29) return 1.0;
        if (age >= 20 && age < 24) return 0.85 + (age - 20) * 0.0375;
        if (age > 29 && age <= 33) return 1.0 - (age - 29) * 0.04;
        if (age > 33) return 0.84 - (age - 33) * 0.03;
        return 0.7;
    }

    _injuryRisk(age, minutesPlayed = 2000) {
        const agePenalty = age > 31 ? (age - 31) * 0.02 : 0;
        const fatiguePenalty = minutesPlayed > 3000 ? 0.1 : 0;
        const risk = 0.1 + agePenalty + fatiguePenalty;
        if (risk > 0.4) return 'high';
        if (risk > 0.2) return 'medium';
        return 'low';
    }

    _consistencyIndex(player) {
        const base = (player.overall_rating || 75) / 100;
        const variance = player.rating_variance || 0.1;
        return Math.round((base - variance) * 100) / 100;
    }

    _calcSynergy(analyzedPlayers) {
        if (analyzedPlayers.length === 0) return 0.5;
        // Simplified: based on average impact and positional balance
        const avgImpact = analyzedPlayers.reduce((s, p) => s + p.impact_score, 0) / analyzedPlayers.length;
        return Math.min(1.0, Math.round(avgImpact * 1.1 * 100) / 100);
    }
}

module.exports = PlayerAnalystAgent;
