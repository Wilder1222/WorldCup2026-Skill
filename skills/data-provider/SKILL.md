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

## ⚠️ Data Verification Requirements (Mandatory)

**Current date: 2026-05-18. World Cup opens: 2026-06-11.**

All team, fixture, and player data must follow these rules:

1. **Never substitute historical data for current data** — any data from local cache must be explicitly labeled
2. **Never fabricate data** — rankings, ratings, or squad lists without a confirmable source must be labeled as "estimated"
3. **Always disclose data source** — the `data_source` field must be populated in every analysis output
4. **Reduce confidence** — when using unverified local cache data, automatically reduce confidence by 30%

## Data Sources (Priority Order)

1. **User-provided current data** — data explicitly provided by the user in conversation (highest priority)
2. **Local cache (⚠️ unverified)** — `data/teams.json`, `data/fixtures.json` (`data_status: SAMPLE_DATA_UNVERIFIED`)
3. **Historical datasets** — `data/historical.json` (trend analysis only, does not represent current state)
4. **Synthetic data** — estimated data generated when no source is available (lowest confidence)

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

## Data Provenance (Required in All Outputs)

Every normalized data record must include a `_data_provenance` field:

```json
{
  "_data_provenance": {
    "source": "local_cache_unverified | user_provided | synthetic",
    "last_updated": "YYYY-MM-DD",
    "verified": false,
    "confidence_adjustment": -0.30,
    "note": "Data not officially verified — refer to FIFA official data"
  }
}
```

## Synthetic Data Warning

When no real data is found, synthetic profiles are generated with:
- `synthetic: true` flag
- `data_source: "synthetic"` in `_data_provenance`
- Reduced confidence (-30% applied by calling skill)
- ELO defaulting to 1400 (below average international)
- **Must explicitly inform the user that data is synthetic/estimated**
