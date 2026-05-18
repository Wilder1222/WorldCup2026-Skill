'use strict';

/**
 * Team Intelligence Agent
 * Analyzes national team tactical profiles, strength vectors, and momentum.
 */

class TeamIntelligenceAgent {
    constructor(options = {}) { }

    /**
     * Full team analysis producing a strength profile.
     */
    async analyze(teamData) {
        const squadDepth = this._calcSquadDepth(teamData.squad);
        const tacticalProfile = this._inferTacticalProfile(teamData);
        const momentum = this._calcMomentum(teamData.recent_results);
        const strengthVector = this._buildStrengthVector(teamData, squadDepth, momentum);

        return {
            name: teamData.name,
            elo_rating: teamData.elo_rating,
            fifa_ranking: teamData.fifa_ranking,
            squad_depth: squadDepth,
            tactical_profile: tacticalProfile,
            momentum_index: momentum,
            strength_vector: strengthVector,
            attack_rating: strengthVector.attack,
            defense_rating: strengthVector.defense,
            overall_strength: strengthVector.overall,
            confidence: teamData.synthetic ? 0.5 : 0.82
        };
    }

    _calcSquadDepth(squad) {
        if (!squad || squad.length === 0) return { score: 0.6, depth: 'medium', starters: 11, bench: 0 };
        const avgRating = squad.reduce((s, p) => s + (p.overall_rating || 75), 0) / squad.length;
        const topPlayerRating = Math.max(...squad.map(p => p.overall_rating || 75));
        return {
            score: avgRating / 100,
            depth: avgRating > 80 ? 'elite' : avgRating > 74 ? 'strong' : 'average',
            average_rating: Math.round(avgRating * 10) / 10,
            top_player_rating: topPlayerRating,
            starters: Math.min(11, squad.length),
            bench: Math.max(0, squad.length - 11)
        };
    }

    _inferTacticalProfile(teamData) {
        const style = teamData.tactical_style || 'balanced';
        const formation = teamData.formation || '4-3-3';

        const profiles = {
            possession: { pressing: 0.5, counter: 0.3, set_pieces: 0.6, transition_speed: 0.4 },
            counter: { pressing: 0.7, counter: 0.9, set_pieces: 0.5, transition_speed: 0.9 },
            pressing: { pressing: 0.9, counter: 0.4, set_pieces: 0.5, transition_speed: 0.7 },
            balanced: { pressing: 0.6, counter: 0.6, set_pieces: 0.6, transition_speed: 0.6 }
        };

        return {
            style,
            formation,
            ...(profiles[style] || profiles.balanced),
            coach: teamData.coach
        };
    }

    _calcMomentum(recentResults = []) {
        if (!recentResults.length) return 0.5;
        const points = recentResults.slice(-5).map(r => {
            if (r === 'W') return 1.0;
            if (r === 'D') return 0.5;
            return 0.0;
        });
        // Weighted towards more recent
        const weights = [0.1, 0.15, 0.2, 0.25, 0.3];
        const wSum = points.reduce((s, p, i) => s + p * (weights[i] || 0.2), 0);
        return Math.round(wSum * 100) / 100;
    }

    _buildStrengthVector(teamData, squadDepth, momentum) {
        const baseAttack = teamData.attack_rating || 70;
        const baseDefense = teamData.defense_rating || 70;
        const eloFactor = (teamData.elo_rating - 1200) / 1000; // normalize around 0

        const attack = Math.min(99, Math.round((baseAttack + eloFactor * 10 + momentum * 5) * 10) / 10);
        const defense = Math.min(99, Math.round((baseDefense + eloFactor * 8) * 10) / 10);
        const overall = Math.round(((attack * 0.45 + defense * 0.45 + squadDepth.score * 10) * 0.1) * 10) / 10;

        return {
            attack,
            defense,
            midfield: Math.round(((attack + defense) / 2) * 10) / 10,
            overall: Math.min(99, overall + 50)
        };
    }
}

module.exports = TeamIntelligenceAgent;
