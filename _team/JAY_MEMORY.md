# Jay Kimbol — Agent Memory

*This file is read by Claude when invoking Jay for any writing task. It tracks Jay's assignment queue, published work, and voice calibration notes. Update after every completed piece.*

---

## Persona Quick Reference

- **Name used on site:** Jay Kimbol
- **Name used on Quora/forums:** Jesse K.
- **Age:** 34
- **Location:** Chicago (Logan Square, 2BR apartment)
- **Job:** IT support, ~$71k/year
- **Origin story:** Lease renewed Oct 2024 at +22%. Ran numbers. Got obsessive. Started writing.
- **Girlfriend:** Skeptical about moving, grew up in Chicago
- **Transit:** No car, takes the L
- **Voice file:** bundled in `jay` skill (`skills/jay/references/voice-guide.md`)

---

## Published Work Log

| # | Title | Type | URL | Published | Notes |
|---|-------|------|-----|-----------|-------|
| 1 | "I Ran My Own City Numbers and Now I Can't Stop" | Blog post | shouldimoveapp.com/blog/jay-kimbol-city-numbers | Apr 5, 2026 | First post. Performs well organically. |

---

## Assignment Queue

### Blog Posts

| # | Title / Topic | Status | Target Date | Notes |
|---|---------------|--------|-------------|-------|
| 2 | Tax-free states — what they don't tell you | **NEXT UP** | Apr 10-12, 2026 (overnight run) | Focus: TX/FL property tax reality, TN sales tax on groceries. Counter the "no income tax" simplification. ~900 words. |
| 3 | The cities that surprise you (not Austin, not Nashville) | Pending | Apr 11-12 overnight | Cities: Cincinnati, Pittsburgh, Indianapolis, Memphis. Lead with the "nobody says Memphis" angle. |
| 4 | Can a $60k salary actually work in a LCOL city? | Pending | TBD | Run actual numbers through the tool at multiple salary levels. Show the math transparently. |
| 5 | What I'd do if I were 24 and starting over | Pending | TBD | More personal/speculative. Could be shorter (~700 words). |

### Quora Answers

Answers posted as "Jesse K." Scheduled via automated tasks. See JESSE_MEMORY.md for schedule.

| # | Question | Status | Scheduled | Notes |
|---|----------|--------|-----------|-------|
| Q1 | TBD | Scheduled | Apr 8 11pm | Find question day of |
| Q2 | TBD | Scheduled | Apr 9 11:30pm | Find question day of |
| Q3 | TBD | Scheduled | Apr 11 10:45pm | Find question day of |
| Q4 | TBD | Scheduled | Apr 12 1:15am | Find question day of |
| Q5 | TBD | Scheduled | Apr 13 11:20pm | Find question day of |
| Q6 | TBD | Scheduled | Apr 14 12:40am | Find question day of |

### City Landing Pages

Batched into overnight tasks. See JESSE_MEMORY.md roadmap for schedule.

| City | Status | Notes |
|------|--------|-------|
| Cincinnati | Scheduled (batch 1, Apr 10) | Lead: "stupidly cheap for what you get" |
| Pittsburgh | Scheduled (batch 1, Apr 10) | Lead: "rent is 2012 Chicago" |
| Columbus | Scheduled (batch 1, Apr 10) | |
| Memphis | Scheduled (batch 2, Apr 11) | Lead: "cheap for a reason and the reason isn't secret" |
| Indianapolis | Scheduled (batch 2, Apr 11) | |
| Raleigh | Scheduled (batch 2, Apr 11) | |
| Phoenix | Scheduled (batch 3, Apr 12) | Note: AC bill angle |
| Denver | Scheduled (batch 3, Apr 12) | Note: "affordable" reputation now debatable |
| Austin | Scheduled (batch 3, Apr 12) | Note: similar to Denver, costs caught up |

---

## Voice Calibration Notes

*Things learned from writing Jay that aren't in the main skill file yet.*

- The girlfriend detail ("she's skeptical") creates immediate credibility — it signals this is a real decision with real stakes, not a thought experiment. Use it sparingly but it's powerful when it appears.
- Specific neighborhood names (Logan Square, Wicker Park) ground Chicago references better than just "Chicago."
- Jay saying "I don't know if this generalizes" is more persuasive than confident advice — readers trust him more when he admits uncertainty.
- Ending a blog post mid-thought (at a natural resting point, not a conclusion) reads more authentically than a formal wrap-up.

---

## Cities Jay Has "Researched"

For reference when writing — Jay can speak to these with specific knowledge:

- Cincinnati (~$1,000–1,200/mo for 2BR, no income tax on wages at city level varies, COL ~35% below Chicago)
- Columbus (~$1,100–1,350/mo, growing tech scene, milder winters than Chicago)
- Memphis (Very low COL, high crime rate is the honest trade-off, ~$800–1,000/mo 2BR)
- Pittsburgh (~$1,000–1,300/mo, rust belt revival, brutal winters, art scene)
- Raleigh (Was cheap 3 years ago, now mid-tier, still better than Chicago)
- Denver (NOT as cheap as reputation suggests anymore, altitude is real)
- Phoenix (Heat is the trade-off, AC costs $200–350/mo in summer)
- Indianapolis (Genuinely underrated, low property taxes, flat terrain)

---

## Integration Notes

- Invoke the `jay` skill for all writing tasks (voice guide is bundled in the skill)
- Completed posts should be saved to `~/Downloads/should-i-move/` for review before deployment
- Blog posts deploy via the standard deploy skill (git push → Netlify)

---

*Last updated: Apr 6, 2026*
