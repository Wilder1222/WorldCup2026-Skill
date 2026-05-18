'use strict';

/**
 * Prediction Store — Persists every prediction/analysis as a JSON document on disk.
 *
 * Storage paths:
 *   data/predictions/  — match predictions
 *   data/analyses/     — team / player analyses
 *
 * File naming: {YYYY-MM-DD}_{slug}_{id}.json
 *   e.g.: 2026-05-18_brazil-vs-argentina_pred_1716000000000.json
 *
 * Each record includes:
 *   status: "pending" | "correct" | "incorrect" | "partial"
 *   actual_result: null | {...}   populated after real result is recorded
 *   verdict: null | {correct, brier_score, notes}
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const PREDICTIONS_DIR = path.join(DATA_DIR, 'predictions');
const ANALYSES_DIR = path.join(DATA_DIR, 'analyses');

// Ensure directories exist
function ensureDirs() {
    [PREDICTIONS_DIR, ANALYSES_DIR].forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });
}

/**
 * Convert a string to a filename-safe slug.
 */
function slugify(str) {
    return String(str)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .slice(0, 60);
}

/**
 * Returns the current date as a YYYY-MM-DD string.
 */
function today() {
    return new Date().toISOString().slice(0, 10);
}

class PredictionStore {
    constructor() {
        ensureDirs();
    }

    // -----------------------------------------------------------------------
    // Save
    // -----------------------------------------------------------------------

    /**
     * Save a match prediction record.
     * @param {object} prediction - full prediction object returned by orchestrator
     * @returns {string} filePath - path of the written file
     */
    savePrediction(prediction) {
        const id = prediction.prediction_id || `pred_${Date.now()}`;
        const match = prediction.match || 'unknown';
        const filename = `${today()}_${slugify(match)}_${id}.json`;
        const filePath = path.join(PREDICTIONS_DIR, filename);

        const record = {
            id,
            type: 'match_prediction',
            match,
            created_at: new Date().toISOString(),
            status: 'pending',
            prediction: prediction,
            actual_result: null,
            verdict: null,
            evaluation: null,
            _meta: { file: filename }
        };

        fs.writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf8');
        return filePath;
    }

    /**
     * Save a team or player analysis record.
     * @param {object} analysis - full analysis object returned by orchestrator
     * @returns {string} filePath
     */
    saveAnalysis(analysis) {
        const id = `analysis_${Date.now()}`;
        const subject =
            (analysis.results && (analysis.results.team || analysis.results.name)) ||
            analysis.analysis_type ||
            'unknown';
        const filename = `${today()}_${slugify(subject)}_${id}.json`;
        const filePath = path.join(ANALYSES_DIR, filename);

        const record = {
            id,
            type: analysis.analysis_type || 'analysis',
            subject,
            created_at: new Date().toISOString(),
            status: 'pending',
            analysis: analysis,
            actual_result: null,
            verdict: null,
            _meta: { file: filename }
        };

        fs.writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf8');
        return filePath;
    }

    // -----------------------------------------------------------------------
    // Record actual result & verdict
    // -----------------------------------------------------------------------

    /**
     * Find a prediction file by id or match string, record actual result and set verdict.
     *
     * @param {string} matchOrId    - match name "Brazil vs Argentina" or prediction_id
     * @param {object} actualResult - { score: "2-1", outcome: "win"|"draw"|"loss", notes: "" }
     * @param {object} [evaluation] - evaluation report returned by performanceEvaluator
     * @returns {{ filePath: string, record: object } | null}
     */
    recordActualResult(matchOrId, actualResult, evaluation = null) {
        const filePath = this._findFile(matchOrId, PREDICTIONS_DIR);
        if (!filePath) return null;

        const record = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        record.actual_result = { ...actualResult, recorded_at: new Date().toISOString() };
        record.evaluation = evaluation;

        // Auto-determine status: correct / incorrect / partial
        record.status = _computeStatus(record.prediction, actualResult, evaluation);
        record.verdict = _buildVerdict(record.prediction, actualResult, evaluation);

        fs.writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf8');
        return { filePath, record };
    }

    // -----------------------------------------------------------------------
    // Query
    // -----------------------------------------------------------------------

    /**
     * List all prediction records (defaults to predictions; pass 'analyses' for analyses).
     * @param {'predictions'|'analyses'|'all'} type
     * @param {{ status?: string }} [filters]
     * @returns {object[]}
     */
    list(type = 'predictions', filters = {}) {
        const dirs = type === 'all'
            ? [PREDICTIONS_DIR, ANALYSES_DIR]
            : type === 'analyses' ? [ANALYSES_DIR] : [PREDICTIONS_DIR];

        const records = [];
        for (const dir of dirs) {
            if (!fs.existsSync(dir)) continue;
            const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
            for (const file of files) {
                try {
                    const rec = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
                    if (!filters.status || rec.status === filters.status) {
                        records.push(rec);
                    }
                } catch { /* skip corrupted files */ }
            }
        }

        // Sort descending by created_at
        records.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return records;
    }

    /**
     * Read a single prediction by id or match name.
     */
    get(matchOrId) {
        const filePath = this._findFile(matchOrId, PREDICTIONS_DIR)
            || this._findFile(matchOrId, ANALYSES_DIR);
        if (!filePath) return null;
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    // -----------------------------------------------------------------------
    // Report generation
    // -----------------------------------------------------------------------

    /**
     * Generate a Markdown accuracy report and write to data/predictions/REPORT_{date}.md.
     * @returns {string} reportPath
     */
    generateReport() {
        const predictions = this.list('predictions');
        const verified = predictions.filter(p => p.status !== 'pending');
        const correct = verified.filter(p => p.status === 'correct').length;
        const partial = verified.filter(p => p.status === 'partial').length;
        const pending = predictions.filter(p => p.status === 'pending').length;
        const accuracy = verified.length > 0
            ? ((correct / verified.length) * 100).toFixed(1)
            : 'N/A';

        const lines = [
            `# ⚽ WorldCup 2026 — Prediction Accuracy Report`,
            ``,
            `Generated: ${new Date().toISOString()}`,
            ``,
            `## Summary`,
            ``,
            `| Metric | Value |`,
            `|--------|-------|`,
            `| Total predictions | ${predictions.length} |`,
            `| Pending verification | ${pending} |`,
            `| Verified | ${verified.length} |`,
            `| Correct | ${correct} |`,
            `| Partial | ${partial} |`,
            `| Accuracy | ${accuracy}% |`,
            ``,
            `## Prediction Details`,
            ``
        ];

        for (const p of predictions) {
            const statusIcon = { pending: '⏳', correct: '✅', incorrect: '❌', partial: '🟡' }[p.status] || '❓';
            const probs = p.prediction && p.prediction.results && p.prediction.results.probabilities;
            const probStr = probs
                ? `Home win ${(probs.win * 100).toFixed(1)}% / Draw ${(probs.draw * 100).toFixed(1)}% / Away win ${(probs.loss * 100).toFixed(1)}%`
                : '';
            lines.push(`### ${statusIcon} ${p.match || p.subject}`);
            lines.push(`- **Created**: ${p.created_at}`);
            if (p.prediction && p.prediction.confidence) {
                lines.push(`- **Confidence**: ${(p.prediction.confidence * 100).toFixed(1)}%`);
            }
            if (probStr) lines.push(`- **Probabilities**: ${probStr}`);
            if (p.actual_result) {
                lines.push(`- **Actual result**: ${p.actual_result.score || ''} (${p.actual_result.outcome || ''})`);
            }
            if (p.verdict) {
                lines.push(`- **Verdict**: ${p.verdict.summary || ''}`);
                if (p.verdict.brier_score != null) {
                    lines.push(`- **Brier score**: ${p.verdict.brier_score}`);
                }
                if (p.verdict.notes) lines.push(`- **Notes**: ${p.verdict.notes}`);
            }
            lines.push('');
        }

        const reportPath = path.join(PREDICTIONS_DIR, `REPORT_${today()}.md`);
        fs.writeFileSync(reportPath, lines.join('\n'), 'utf8');
        return reportPath;
    }

    // -----------------------------------------------------------------------
    // Internal utilities
    // -----------------------------------------------------------------------

    /**
     * Find a file in the given directory by id or match/subject slug.
     */
    _findFile(matchOrId, dir) {
        if (!fs.existsSync(dir)) return null;
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
        const slug = slugify(matchOrId);

        // Exact id match first
        for (const f of files) {
            if (f.includes(matchOrId)) return path.join(dir, f);
        }
        // Fuzzy slug match
        for (const f of files) {
            if (f.includes(slug)) return path.join(dir, f);
        }
        // Content scan fallback
        for (const f of files) {
            try {
                const rec = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
                if (
                    rec.id === matchOrId ||
                    (rec.match && rec.match.toLowerCase() === matchOrId.toLowerCase()) ||
                    (rec.subject && rec.subject.toLowerCase() === matchOrId.toLowerCase())
                ) {
                    return path.join(dir, f);
                }
            } catch { /* skip */ }
        }
        return null;
    }
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function _computeStatus(prediction, actual, evaluation) {
    if (evaluation && evaluation.prediction_correct != null) {
        return evaluation.prediction_correct ? 'correct' : 'incorrect';
    }
    if (!prediction || !actual) return 'pending';
    const probs = prediction.results && prediction.results.probabilities;
    if (!probs || !actual.outcome) return 'pending';

    const predicted = _dominantOutcome(probs);
    if (predicted === actual.outcome) return 'correct';
    // Partial: predicted outcome is close but not exact
    if (
        (predicted === 'win' && actual.outcome === 'draw') ||
        (predicted === 'draw' && actual.outcome !== 'draw') ||
        (predicted === 'loss' && actual.outcome === 'draw')
    ) return 'partial';
    return 'incorrect';
}

function _dominantOutcome(probs) {
    if (probs.win >= probs.draw && probs.win >= probs.loss) return 'win';
    if (probs.loss >= probs.draw && probs.loss >= probs.win) return 'loss';
    return 'draw';
}

function _buildVerdict(prediction, actual, evaluation) {
    const status = _computeStatus(prediction, actual, evaluation);
    const summaryMap = { correct: 'Correct', incorrect: 'Incorrect', partial: 'Partial', pending: 'Pending' };
    return {
        correct: status === 'correct',
        status,
        summary: summaryMap[status] || status,
        brier_score: evaluation ? evaluation.brier_score : null,
        notes: evaluation ? (evaluation.notes || null) : null
    };
}

module.exports = PredictionStore;
