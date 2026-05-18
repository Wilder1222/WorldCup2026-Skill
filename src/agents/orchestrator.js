'use strict';

/**
 * Orchestrator Agent — CEO of the multi-agent system.
 * Decomposes user requests, assigns tasks, merges results.
 */

const DataScoutAgent = require('./data-scout');
const TeamIntelligenceAgent = require('./team-intelligence');
const PlayerAnalystAgent = require('./player-analyst');
const PredictionScientistAgent = require('./prediction-scientist');
const SimulationAgent = require('./simulation');
const DebateAgent = require('./debate');

const { PerformanceEvaluator } = require('../evolution/performance-evaluator');
const { SelfLearningOptimizer } = require('../evolution/self-learning-optimizer');

class OrchestratorAgent {
    constructor(options = {}) {
        this.memory = options.memory;
        this.dataScout = new DataScoutAgent(options);
        this.teamIntelligence = new TeamIntelligenceAgent(options);
        this.playerAnalyst = new PlayerAnalystAgent(options);
        this.predictionScientist = new PredictionScientistAgent(options);
        this.simulationAgent = new SimulationAgent(options);
        this.debateAgent = new DebateAgent(options);
        this.performanceEvaluator = new PerformanceEvaluator(options);
        this.selfLearningOptimizer = new SelfLearningOptimizer(options);
    }

    /**
     * Full match prediction pipeline.
     */
    async predictMatch({ homeTeam, awayTeam }) {
        // Step 1: Fetch and normalize data
        const [homeData, awayData] = await Promise.all([
            this.dataScout.fetchTeam(homeTeam),
            this.dataScout.fetchTeam(awayTeam)
        ]);

        // Step 2: Parallel team + player analysis
        const [homeProfile, awayProfile] = await Promise.all([
            this.teamIntelligence.analyze(homeData),
            this.teamIntelligence.analyze(awayData)
        ]);

        const [homePlayerMap, awayPlayerMap] = await Promise.all([
            this.playerAnalyst.analyzeSquad(homeData),
            this.playerAnalyst.analyzeSquad(awayData)
        ]);

        // Step 3: Prediction models
        const predictionInput = {
            home: { ...homeProfile, playerMap: homePlayerMap },
            away: { ...awayProfile, playerMap: awayPlayerMap }
        };

        const [modelPrediction, simulationResult] = await Promise.all([
            this.predictionScientist.predict(predictionInput),
            this.simulationAgent.simulate(predictionInput, { iterations: 10000 })
        ]);

        // Step 4: Debate / critique
        const riskReport = this.debateAgent.critique({
            prediction: modelPrediction,
            simulation: simulationResult,
            homeProfile,
            awayProfile
        });

        // Step 5: Memory update (short-term + disk persistence)
        const predictionId = `pred_${Date.now()}`;
        if (this.memory) {
            this.memory.storePrediction({
                id: predictionId,
                match: `${homeTeam} vs ${awayTeam}`,
                prediction: modelPrediction,
                simulation: simulationResult
            });
        }

        // Step 6: Merge final result
        const finalConfidence = mergeConfidence(modelPrediction.confidence, simulationResult.confidence);
        const finalProbs = mergeProbabilities(modelPrediction.probabilities, simulationResult.probabilities);

        return {
            analysis_type: 'match_prediction',
            prediction_id: predictionId,
            match: `${homeTeam} vs ${awayTeam}`,
            confidence: finalConfidence,
            model_sources: modelPrediction.models_used,
            results: {
                probabilities: finalProbs,
                key_factors: extractKeyFactors(homeProfile, awayProfile, modelPrediction),
                risk_analysis: riskReport.summary,
                model_agreement: modelPrediction.model_agreement,
                simulation_runs: simulationResult.iterations,
                home_team: homeProfile,
                away_team: awayProfile
            }
        };
    }

    /**
     * Team analysis pipeline.
     */
    async analyzeTeam({ teamName }) {
        const teamData = await this.dataScout.fetchTeam(teamName);
        const [profile, playerMap] = await Promise.all([
            this.teamIntelligence.analyze(teamData),
            this.playerAnalyst.analyzeSquad(teamData)
        ]);

        const analysisResult = {
            analysis_type: 'team_analysis',
            confidence: profile.confidence,
            model_sources: ['team-intelligence', 'player-analyst'],
            results: {
                team: teamName,
                ...profile,
                squad_analysis: playerMap
            }
        };

        // Persist to disk memory document
        if (this.memory) this.memory.storeAnalysis(analysisResult);
        return analysisResult;
    }

    /**
     * Player analysis pipeline.
     */
    async analyzePlayer({ playerName }) {
        const playerData = await this.dataScout.fetchPlayer(playerName);
        const analysis = await this.playerAnalyst.analyzeSinglePlayer(playerData);

        const analysisResult = {
            analysis_type: 'player_analysis',
            confidence: analysis.confidence,
            model_sources: ['player-analyst'],
            results: analysis
        };

        // Persist to disk memory document
        if (this.memory) this.memory.storeAnalysis(analysisResult);
        return analysisResult;
    }

    /**
     * Standalone simulation.
     */
    async simulate({ homeTeam, awayTeam, iterations = 10000 }) {
        const [homeData, awayData] = await Promise.all([
            this.dataScout.fetchTeam(homeTeam),
            this.dataScout.fetchTeam(awayTeam)
        ]);

        const [homeProfile, awayProfile] = await Promise.all([
            this.teamIntelligence.analyze(homeData),
            this.teamIntelligence.analyze(awayData)
        ]);

        const result = await this.simulationAgent.simulate(
            { home: homeProfile, away: awayProfile },
            { iterations }
        );

        return {
            analysis_type: 'monte_carlo_simulation',
            confidence: result.confidence,
            model_sources: ['monte-carlo'],
            results: {
                match: `${homeTeam} vs ${awayTeam}`,
                ...result
            }
        };
    }

    /**
     * Record actual result and trigger self-evolution.
     */
    async recordAndEvolve(matchResult) {
        // Evaluate how our prediction performed
        const prediction = this.memory ? this.memory.findPrediction(matchResult.match) : null;

        const evaluationReport = prediction
            ? this.performanceEvaluator.evaluate({ prediction, actual: matchResult })
            : { note: 'No prior prediction found for this match' };

        // Self-learning optimizer updates model weights
        const weightUpdate = prediction
            ? this.selfLearningOptimizer.update(evaluationReport)
            : null;

        // Memory update
        if (this.memory) {
            this.memory.recordResult({ match: matchResult, evaluation: evaluationReport, weightUpdate });
        }

        return {
            analysis_type: 'evolution_update',
            confidence: 1.0,
            model_sources: ['performance-evaluator', 'self-learning-optimizer'],
            results: {
                match: matchResult.match,
                actual_score: matchResult.score,
                evaluation: evaluationReport,
                model_weight_update: weightUpdate,
                evolution_state: weightUpdate ? 'weights_updated' : 'no_prior_prediction'
            }
        };
    }
}

// --- Helpers ---

function mergeConfidence(c1, c2) {
    return Math.round(((c1 + c2) / 2) * 100) / 100;
}

function mergeProbabilities(p1, p2) {
    return {
        win: Math.round(((p1.win + p2.win) / 2) * 1000) / 1000,
        draw: Math.round(((p1.draw + p2.draw) / 2) * 1000) / 1000,
        loss: Math.round(((p1.loss + p2.loss) / 2) * 1000) / 1000
    };
}

function extractKeyFactors(home, away, prediction) {
    const factors = [];
    if (Math.abs(home.elo_rating - away.elo_rating) > 100) {
        factors.push(`ELO gap: ${home.name || 'Home'} rated ${home.elo_rating}, ${away.name || 'Away'} rated ${away.elo_rating}`);
    }
    if (home.momentum_index > 0.7) factors.push(`${home.name || 'Home'} in strong form`);
    if (away.momentum_index > 0.7) factors.push(`${away.name || 'Away'} in strong form`);
    if (prediction.model_agreement < 0.6) factors.push('High model disagreement — volatile match');
    factors.push(...(prediction.key_factors || []));
    return factors.slice(0, 5);
}

module.exports = OrchestratorAgent;
