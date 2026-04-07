# shouldimove — Team Configuration

Agent memory files, session configuration, and installable skills.

## Agents

| Agent | Role | Memory File | Skill File |
|-------|------|-------------|------------|
| Atlas (Claude) | Managing Director — strategy, technical, deployment | JESSE_MEMORY.md, CLAUDE.md | — |
| Jay | Writing — blog posts, Quora answers, landing page copy | JAY_MEMORY.md | jay.skill |
| Simon | Routine execution — monitoring, verification, simple edits | SIMON_MEMORY.md | simon.skill |
| Scout | Research & data — city profiles, tax data, salary benchmarks | SCOUT_MEMORY.md | scout.skill |

## Files

- `CLAUDE.md` — Auto-loaded session config. Atlas reads this at the start of every session.
- `JESSE_MEMORY.md` — Jesse's full profile, credentials (placeholders here — real values stored locally), roadmap, and session log.
- `JAY_MEMORY.md` — Jay's assignment queue, published work log, and voice notes.
- `SIMON_MEMORY.md` — Simon's task roster and completed task log.
- `SCOUT_MEMORY.md` — Scout's research queue and completed research log.
- `PROJECT_MEMORY.md` — shouldimoveapp.com technical context.
- `*.skill` — Installable skill packages. Open in Claude desktop app to install.

## Notes

- Credentials in JESSE_MEMORY.md and CLAUDE.md are replaced with placeholders (GITHUB_TOKEN, STRIPE_SECRET_KEY, etc.)
- Real credentials are stored only on Jesse's local machine
- This repo is auto-updated weekly by a scheduled Simon task
