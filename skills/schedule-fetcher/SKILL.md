---
name: schedule-fetcher
description: |
  FIFA World Cup 2026 schedule, fixtures, standings, and knockout bracket management.
  Supports group stage, round of 16, quarterfinals, semifinals, final.
allowed-tools: [Read]
produces: schedule, standings, bracket
consumes: fixtures_data
---

# Schedule Fetcher Skill

## Trigger

Invoke when asked:
- "Show me the World Cup schedule"
- "When does [team] play?"
- "Show Group [X] standings"
- "What matches are in the quarterfinals?"

## Capabilities

1. **Fixture Retrieval** — Load all matches from `data/fixtures.json`
2. **Stage Filtering** — group | r16 | qf | sf | final
3. **Team Schedule** — Filter fixtures by team name
4. **Standings** — Show group tables (W/D/L/Pts)
5. **Knockout Bracket** — Generate bracket view

## World Cup 2026 Structure

- **48 teams**, 12 groups of 4
- **Group Stage**: June 11 – July 2, 2026
- **Round of 16**: July 4–7, 2026
- **Quarterfinals**: July 9-10, 2026
- **Semifinals**: July 14-15, 2026
- **Final**: July 19, 2026 — MetLife Stadium, New Jersey

## Host Cities (USA)

| City | Venue |
|------|-------|
| New York/New Jersey | MetLife Stadium |
| Los Angeles | SoFi Stadium, Rose Bowl |
| Dallas | AT&T Stadium |
| San Francisco | Levi's Stadium |
| Miami | Hard Rock Stadium |
| Seattle | Lumen Field |
| Kansas City | Arrowhead Stadium |
| Philadelphia | Lincoln Financial Field |
| Boston | Gillette Stadium |
| Atlanta | Mercedes-Benz Stadium |

## Host Cities (Canada)

| City | Venue |
|------|-------|
| Toronto | BMO Field |
| Vancouver | BC Place |

## Host Cities (Mexico)

| City | Venue |
|------|-------|
| Mexico City | Estadio Azteca |
| Guadalajara | Estadio Akron |
| Monterrey | Estadio BBVA |

## Output Schema

```json
{
  "analysis_type": "schedule",
  "stage": "",
  "data_verification": {
    "source": "local_cache_unverified | user_provided",
    "verified_against_fifa": false,
    "data_as_of": "2026-05-18",
    "note": "Fixture data not officially verified by FIFA — refer to https://www.fifa.com for confirmed schedule"
  },
  "results": [
    {
      "id": "",
      "home": "",
      "away": "",
      "date": "",
      "venue": "",
      "stage": "",
      "status": "scheduled|live|completed"
    }
  ]
}
```

## Data Verification Rules

- **All schedule output must include a `data_verification` field**
- **Group draw results and match fixtures must cite their source**: data in `data/fixtures.json` is sample/estimated and has not been officially confirmed by FIFA
- **Always inform the user**: fixture data must be verified against the [FIFA official website](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026)
