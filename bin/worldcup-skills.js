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

  --mcp                    Start as MCP Tool Server
  --help                   Show this help

Examples:
  npx worldcup2026-skills predict "Germany vs Portugal"
  npx worldcup2026-skills analyze-team "Brazil"
  npx worldcup2026-skills schedule --stage group
  npx worldcup2026-skills simulate "France vs England" --iterations 50000
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
