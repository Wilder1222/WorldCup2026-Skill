---
name: data-provider
description: |
  Abstracted data source adapter layer. Supports multiple football data sources.
  Normalizes all data to standard schema. No hard dependency on any single provider.
allowed-tools: [Read, Bash]
produces: normalized_team_data, normalized_player_data, normalized_fixture_data
consumes: any_data_source
---

# Data Provider Skill

## Purpose

Abstract all data source access. The rest of the system should never care WHERE data comes from — only what shape it arrives in.

## Data Sources (Priority Order)

1. **Local cache** — `data/teams.json`, `data/fixtures.json`
2. **Historical datasets** — `data/historical.json`
3. **Manual ingestion** — User-provided JSON payloads
4. **External APIs** (future) — football-data.org, API-Football, SofaScore

## Data Normalization

All data exits this skill in standard schema regardless of source:

### Team Schema

```json
{
  "id": "",
  "name": "",
  "group": "",
  "elo_rating": 0,
  "fifa_ranking": 0,
  "attack_rating": 0,
  "defense_rating": 0,
  "momentum_index": 0.0,
  "formation": "",
  "tactical_style": "",
  "squad": [],
  "recent_results": [],
  "coach": ""
}
```

### Player Schema

```json
{
  "name": "",
  "position": "",
  "age": 0,
  "club": "",
  "overall_rating": 0,
  "form_score": 0.0,
  "minutes_played": 0
}
```

### Fixture Schema

```json
{
  "id": "",
  "stage": "group|r16|qf|sf|final",
  "group": "",
  "home": "",
  "away": "",
  "date": "",
  "venue": "",
  "status": "scheduled|live|completed",
  "score": null
}
```

## Fuzzy Matching

The data provider implements fuzzy team/player name matching to handle:
- "USA" → "United States"
- "Holland" → "Netherlands"
- "Mbappe" → "Kylian Mbappe"

## Synthetic Data Warning

When no real data is found, synthetic profiles are generated with:
- `synthetic: true` flag
- Reduced confidence (-30% applied by calling skill)
- ELO defaulting to 1400 (below average international)
