#!/usr/bin/env node
'use strict';

/**
 * WorldCup 2026 AI Skills System — CLI Entry Point
 * Usage: npx worldcup2026-skills <command> [options]
 *        wc2026 <command> [options]
 */

const { WorldCupSkillsSystem } = require('../src/index');

const HELP = `
⚽  WorldCup 2026 AI Skills System  ⚽

Usage: wc2026 <command> [options]

Commands:
  predict <match>          Predict match outcome
                           e.g. wc2026 predict "Brazil vs Argentina"

  analyze-team <team>      Full team analysis
                           e.g. wc2026 analyze-team "France"

  player <name>            Analyze a player
                           e.g. wc2026 player "Kylian Mbappe"

  schedule [--stage]       Show World Cup fixtures
                           --stage group|r16|qf|sf|final

  standings [--group]      Show group standings
                           --group A|B|C...

  simulate <match>         Run Monte Carlo simulation
                           --iterations 10000 (default)
                           e.g. wc2026 simulate "England vs Spain"

  teams                    List all 48 qualified teams

  evolve <result>          Record actual match result + evolve model
                           e.g. wc2026 evolve '{"match":"Brazil vs Argentina","score":"2-1"}'

  predictions list         列出所有已存储的预测记忆文档
                           --type predictions|analyses|all
                           --status pending|correct|incorrect|partial

  predictions get <match>  查看单条预测记忆文档（按比赛名或 ID）
                           e.g. wc2026 predictions get "Brazil vs Argentina"

  predictions verify <match> <result>
                           写入实际比赛结果，验证预测准确性
                           e.g. wc2026 predictions verify "Brazil vs Argentina" '{"score":"2-1","outcome":"win"}'

  predictions report       生成 Markdown 准确率报告至 data/predictions/

  --mcp                    Start as MCP Tool Server
  --help                   Show this help

Examples:
  npx worldcup2026-skills predict "Germany vs Portugal"
  npx worldcup2026-skills analyze-team "Brazil"
  npx worldcup2026-skills schedule --stage group
  npx worldcup2026-skills simulate "France vs England" --iterations 50000
  npx worldcup2026-skills predictions list --status pending
  npx worldcup2026-skills predictions verify "Germany vs Portugal" '{"score":"2-0","outcome":"win"}'
  npx worldcup2026-skills predictions report
`;

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        console.log(HELP);
        process.exit(0);
    }

    const system = new WorldCupSkillsSystem();
    const command = args[0];

    try {
        let result;

        switch (command) {
            case 'predict': {
                const match = args[1];
                if (!match) { console.error('Error: provide match string e.g. "Brazil vs Argentina"'); process.exit(1); }
                result = await system.predict(match);
                break;
            }

            case 'analyze-team': {
                const team = args[1];
                if (!team) { console.error('Error: provide team name'); process.exit(1); }
                result = await system.analyzeTeam(team);
                break;
            }

            case 'player': {
                const name = args[1];
                if (!name) { console.error('Error: provide player name'); process.exit(1); }
                result = await system.analyzePlayer(name);
                break;
            }

            case 'schedule': {
                const stageIdx = args.indexOf('--stage');
                const stage = stageIdx !== -1 ? args[stageIdx + 1] : 'all';
                result = await system.getSchedule(stage);
                break;
            }

            case 'standings': {
                const groupIdx = args.indexOf('--group');
                const group = groupIdx !== -1 ? args[groupIdx + 1] : 'all';
                result = await system.getStandings(group);
                break;
            }

            case 'simulate': {
                const match = args[1];
                if (!match) { console.error('Error: provide match string'); process.exit(1); }
                const iterIdx = args.indexOf('--iterations');
                const iterations = iterIdx !== -1 ? parseInt(args[iterIdx + 1]) : 10000;
                result = await system.simulate(match, { iterations });
                break;
            }

            case 'teams': {
                result = await system.listTeams();
                break;
            }

            case 'evolve': {
                const payload = args[1];
                if (!payload) { console.error('Error: provide result JSON string'); process.exit(1); }
                const matchResult = JSON.parse(payload);
                result = await system.recordResult(matchResult);
                break;
            }

            case 'predictions': {
                const sub = args[1];
                if (!sub || sub === 'list') {
                    const typeIdx = args.indexOf('--type');
                    const type = typeIdx !== -1 ? args[typeIdx + 1] : 'predictions';
                    const statusIdx = args.indexOf('--status');
                    const filters = statusIdx !== -1 ? { status: args[statusIdx + 1] } : {};
                    const records = system.listPredictions(type, filters);
                    // 输出简洁摘要列表
                    const summary = records.map(r => ({
                        id: r.id,
                        match: r.match || r.subject,
                        created_at: r.created_at,
                        status: r.status,
                        confidence: r.prediction && r.prediction.confidence
                            ? `${(r.prediction.confidence * 100).toFixed(1)}%`
                            : (r.analysis && r.analysis.confidence
                                ? `${(r.analysis.confidence * 100).toFixed(1)}%` : 'N/A'),
                        actual_result: r.actual_result ? r.actual_result.score : null
                    }));
                    result = { analysis_type: 'predictions_list', total: records.length, records: summary };
                } else if (sub === 'get') {
                    const matchOrId = args[2];
                    if (!matchOrId) { console.error('Error: provide match name or prediction ID'); process.exit(1); }
                    const record = system.getPrediction(matchOrId);
                    if (!record) { console.error(`Not found: ${matchOrId}`); process.exit(1); }
                    result = record;
                } else if (sub === 'verify') {
                    const matchOrId = args[2];
                    const payload = args[3];
                    if (!matchOrId || !payload) {
                        console.error('Usage: predictions verify "<match>" \'{"score":"2-1","outcome":"win"}\'');
                        process.exit(1);
                    }
                    const actualResult = JSON.parse(payload);
                    const updated = system.verifyPrediction(matchOrId, actualResult);
                    if (!updated) { console.error(`Not found: ${matchOrId}`); process.exit(1); }
                    result = {
                        analysis_type: 'prediction_verified',
                        match: matchOrId,
                        status: updated.record.status,
                        verdict: updated.record.verdict,
                        file: updated.filePath
                    };
                } else if (sub === 'report') {
                    const reportPath = system.generatePredictionReport();
                    result = { analysis_type: 'report_generated', report_path: reportPath };
                } else {
                    console.error(`Unknown predictions subcommand: ${sub}`);
                    process.exit(1);
                }
                break;
            }

            default:
                console.error(`Unknown command: ${command}\n`);
                console.log(HELP);
                process.exit(1);
        }

        if (result) {
            console.log(JSON.stringify(result, null, 2));
        }

    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

main();
