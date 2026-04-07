# ShouldIMoveApp.com — Project Memory
*Read this at the start of every session. Update it when something significant changes.*

---

## What This Project Is

A single-page web app that helps people compare cost of living and purchasing power across 196 U.S. cities. The core question it answers: **"If I moved and kept my salary, would I actually be better off?"** It goes beyond raw COL indexes by estimating what a specific job actually pays in each market and showing the net purchasing power difference.

Live at: **shouldimoveapp.com**
Hosted: Namecheap
Analytics: Google Analytics G-D6WSGPKKDX

---

## File Structure

```
/should-i-move/
  index.html          ← entire app (HTML + CSS + JS, single file)
  widget.html         ← embeddable employer widget (self-contained, ~684 lines)
  privacy.html        ← privacy policy
  contact.html        ← contact page
  sitemap.xml         ← 3 URLs (homepage 1.0, contact 0.4, privacy 0.3)
  blog-post-01-jay-kimbol.md / .txt  ← first blog post
  PROJECT_MEMORY.md   ← this file
```

**Important:** index.html is ~3,831 lines and entirely self-contained. No build step, no npm, no framework. All data (196 cities, 109 jobs) is embedded as JS arrays. This is intentional — it keeps deployment trivially simple (just FTP the files).

---

## Architecture Decisions (and Why)

### Single-file HTML
Deliberate choice. Zero infrastructure, zero dependencies to break, deploy by dragging files to Namecheap. Works perfectly for a data-driven tool that doesn't need a backend. Future projects using this model should think carefully before adding a build step — the simplicity is a feature.

### No backend / no real auth
Pro features are currently gated by UI blur/overlay only — no Stripe, no token verification. This is intentional for now. Stripe integration is deferred. Don't add backend complexity until there's a reason to.

### Salary scaling by job category
Cities don't pay all jobs the same way. The app uses four scaling categories:
- `prof` — market-rate professional/tech. Scales aggressively with COL.
- `trades` — skilled blue-collar. Moderate scaling. Union variants have higher base.
- `gov` — public sector. Low scaling (policy-set wages don't track COL closely).
- `service` — retail, gig, personal care. Tracks minimum wage, which correlates strongly with COL.

Formula pattern: `(floor + range * Math.pow(c, exponent)) * microAdjust`
where `c = city.col / 100` and `microAdjust` is a ±1% hash-based tie-breaker.

### State/Local Income Taxes in Purchasing Power (added April 2026)
Purchasing power formula updated from `salary / city.col` to `salary * (1 - city.tax) / city.col`.
Each city has a `tax` field (effective rate for single filer ~$70k). State-level base rates are embedded as constants in the Python generation script (`add_tax_rates.py` in the session folder). Notable overrides:
- NYC: 0.104 (NY 6.5% + NYC 3.9%)
- Philadelphia: 0.069 (PA 3.07% + city wage tax 3.75%)
- Detroit: 0.067 (MI 4.25% + city 2.4%)
- Chicago: 0.052 (IL flat 4.95% + minimal surcharges)
- Washington DC: 0.085 (own progressive tax)
- WA/TX/FL/NV/TN/SD/WY/AK/NH: 0.000 (no income tax on wages)
The break-even salary formula also updated: `salA * (1 - cityA.tax) / (1 - cityB.tax) * (cityB.col / cityA.col)`
A **scheduled task** for upgrading to full progressive bracket tax tables is set for **Wednesday April 8, 2026 at 9am**.

### Prime-modulus microAdjust (not wageOffset)
Early attempt used a `wageOffset` approach (adding a small dollar offset to COL values). Problem: cities with different COL values could land on the same effective adjusted COL, creating cross-COL collisions. Fix: replaced with a fractional multiplier (`microAdjust`) derived from a prime modulus hash (mod 1009) of the city name. This preserves COL ordering and reduces duplicates to an acceptable ~5 pairs that are genuinely similar markets.

### Inline salary overrides in the main form
Early design had salary overrides buried behind a toggle below the results. Moved them to inline inputs in the main form with auto-updating placeholder hints showing the estimate. Much better UX. Lesson: **if an override is common, put it in the primary flow, not behind a disclosure.**

---

## The Jobs Data (109 entries)

Sorted alphabetically. "Other — Enter My Income" is pinned to the end (entry: null).

8 trades are split into union/non-union variants based on BLS union density data:
- Electrician (IBEW), Plumber (UA), Pipefitter (UA), Ironworker, Heavy Equipment Operator (IUOE), Carpenter (UBC), Construction Worker, Truck Driver (Teamsters)

Union senior wages run ~32–59% higher than non-union for the same trade. These are grounded in real contract data, not estimates.

Trades NOT split (union density too low to meaningfully bifurcate): HVAC, Welder, Auto Mechanic, Warehouse Worker, Landscaper, Pest Control Tech.

---

## Pro Features (UI-gated, no real payment yet)

1. **Best Moves Report** — ranks all 196 cities by purchasing power gain for your job/salary. Rows 1–3 blurred (top gate), rows 4–6 visible, rows 7–10 blurred (bottom gate).
2. **Multi-City Comparison** — up to 5 destinations side by side. First destination free, rest blurred (`MC_FREE_COLS = 1`).
3. **Export / Save** — PDF report generation via jsPDF 2.5.1 + jsPDF-AutoTable 3.8.2. Supports white-label (company name in header, attribution toggle). No server needed — client-side only.
4. **Employer Embed Widget** — `widget.html` is self-contained. URL params: `to` (city index or name), `employer` (company name), `color` (hex accent). Destination city is locked. Footer links back with UTM params.

Price: $3.99/month (early adopter). Stripe not yet wired up.

---

## SEO Status (updated April 6, 2026)

- Google Search Console connected ✅, sitemap submitted ✅, homepage indexing requested ✅
- Search Console linked to GA4 ✅
- robots.txt live ✅ (`/robots.txt` — allows all, references sitemap)
- Sitemap at `shouldimoveapp.com/sitemap.xml` ✅ — includes homepage, widget, contact, privacy with www URLs
- JSON-LD: WebApplication schema ✅ + FAQPage schema ✅ (4 questions)
- IndexNow key file live at `/shouldimoveapp-indexnow-2026.txt` ✅ (Bing will pick up on next crawl)
- Canonical and og:url both use `https://www.shouldimoveapp.com/` (with www) ✅
- Title: "Should I Move? Compare Cost of Living Between Cities | Tax-Adjusted Purchasing Power" ✅
- Meta description: "Compare the real cost of living between any two US cities with tax-adjusted purchasing power. See which cities stretch your salary furthest. Free tool covering 196 cities." ✅
- City landing pages: none yet — 15 pages scheduled to deploy Apr 10–12
- Competitor on similar name: shouldimove.co (note: .co not .com — our .com is stronger long-term)

---

## Content / Marketing

### Jay Kimbol blog series
Fictional persona: remote IT support worker in Chicago ($71k/year), lease renewal triggered cost-of-living research. Voice is self-deprecating, specific, casual — deliberately not polished. Avoids AI writing patterns (no "delve," no "furthermore," no perfectly balanced paragraphs).

Blog post 1 written: "My Landlord Sent Me a Number and I Haven't Been the Same Since"
- Saved as .txt and .md in project folder
- Emailed as draft to jesse.falloffthemap@gmail.com

Planned arc: post 2 (visits a city), post 3 (social cost of leaving), post 4 (negotiating remote pay), post 5 (near-decision).

### Outreach drafts in Gmail (jesse.falloffthemap@gmail.com)
All 5 saved as drafts:
- Realtor outreach (tool + embed widget for client-facing site)
- Local reporter outreach (source for cost-of-living stories)
- National reporter outreach (remote work / relocation data angle)
- Recruiter outreach (embed widget for careers pages)
- LinkedIn post (copy/paste ready; note: post link in comments, not body)

---

## Mistakes Made — Learn From These

### Math errors in written content
A blog post contained an incorrect rent increase calculation ($1,750/year stated instead of $9,000/year). **Always verify dollar math explicitly before finishing any content.** The numbers are the whole point of this project — getting them wrong is particularly damaging to credibility.

### "Decorative" and similar AI tells
The phrase "so we can all agree the rule is decorative" was flagged as AI-sounding — too clever, too self-satisfied. In human blog writing, wit should be understated or situational, not announced. Watch for: overly neat turns of phrase, sentences that feel like they're admiring themselves.

### Hash collision with small modulus
Early city salary deduplication used `% 201` which produced ~45 duplicate pairs. Switching to prime `% 1009` reduced this to 5 acceptable pairs. **When using hash-based approaches for uniqueness, use a large prime modulus.**

### Bash heredoc with JS template literals
Generating widget.html via bash heredoc failed when the JS content contained backtick template literals with shell-special characters. Fix: use `node << 'NODEEOF'` (single-quoted heredoc) to prevent shell interpolation. Or better: write the file directly with the Write tool.

### JS syntax checking with `new Function()`
`new Function(scriptContent)` reports "Unexpected token '<'" for scripts containing HTML inside template literals. This is a false positive — the browser handles it correctly. The real check is: scan for literal `</script>` tags inside the script body (there should be none).

### Burying common UX in post-action toggles
The salary override was originally only accessible after running a comparison, behind a disclosure button. This is wrong for any input that users commonly want to set upfront. Moved it inline. **If something is a primary use case, it belongs in the primary form.**

---

## Best Practices for This Project Type

These apply to shouldimoveapp.com and to future similar projects:

1. **Ship the single file first.** Resist the urge to add a build pipeline, React, or a database until the core product is proven. A well-organized single HTML file can scale surprisingly far.

2. **Embed all data client-side.** For lookup tables (cities, jobs, costs), embedding in JS arrays means no API calls, no latency, no CORS issues, and no backend to maintain. Update the data by editing the file.

3. **Category-aware scaling beats flat multipliers.** Any tool that estimates real-world values across geographies needs to model the underlying reason values differ. Flat COL multipliers produce unrealistic results for jobs with wage floors (service) or policy constraints (gov).

4. **UI gates before payment gates.** Launch with blur/overlay gating before wiring up Stripe. This lets you validate that users want to pay before building the infrastructure. Keep payment integration in a named TODO so it doesn't get forgotten.

5. **Content attribution creates backlinks.** The blog persona (Jay Kimbol) and the employer embed widget are both link-building tools. Every embeddable widget is a potential inbound link. Every blog post distributed on Medium/Substack can rank independently and funnel traffic.

6. **For AI-written content in a human voice:** use specific dollar amounts, real place names, and personal flaws. Avoid perfectly balanced paragraphs. Let sentences run long when the thought runs long. Never use "delve," "crucial," "leverage," "tapestry," "nuanced," or "it's worth noting."

7. **Google Search Console before anything else.** A new site won't be indexed without it. Submit sitemap immediately after launch, request URL inspection on the homepage. Don't wait for organic discovery.

8. **Verify all math in content before finishing.** Especially for a financial tool where the numbers are the product's credibility.

---

## Deferred / Upcoming Work

- [x] Upload all updated files to Namecheap (done April 2026 — index.html + widget.html with taxes, salary overrides, union/non-union jobs)
- [x] Submit sitemap to Google Search Console, request indexing
- [ ] Wire up Stripe for real Pro gating
- [ ] Write Jay Kimbol blog post #2 (visits a city)
- [ ] BLS metro-level salary data pipeline (more accurate local salary estimates)
- [x] og-image.png — created and confirmed live at shouldimoveapp.com/og-image.png (54.8KB)
- [ ] Add more cities (currently 196; ~325 would match competitors)
- [ ] Upgrade to progressive bracket tax tables (scheduled for Wed April 8 9am — see task "shouldimove-progressive-tax")

---

## Future Product Directions (Explored April 6, 2026)

### International Versions
- **Not Ecuador** — Jesse ruled this out. Market too small, model doesn't translate well.
- **India** — High priority to explore. Massive internal migration between major metros (Mumbai, Bangalore, Delhi, Pune, Hyderabad, Chennai). Huge income/COL variance between cities. Highly mobile professional class. Could be a standalone product.
- **China** — Similar case to India. Hundreds of millions making city decisions internally. Tier-1 vs Tier-2 city comparisons are a major life decision topic. Language/localization is a significant barrier but the market is enormous.
- **Commonwealth / Free Movement** — UK, Australia, Canada, New Zealand, Ireland all share easy work-visa pathways. People move between these countries frequently (NZ → London, Australia → Canada, etc.). Cross-border comparisons with real purchasing power data don't exist well for this audience. Strong opportunity.
- **EU internal migration** — Similar free-movement angle within Schengen. Lower priority than Commonwealth but same logic.

These are future explorations, not committed roadmap items. India/China likely need localized products. Commonwealth could extend the existing model with relatively low lift.

---

## Key People / Accounts

- Owner: Jesse Kimmerling
- Gmail: jesse.falloffthemap@gmail.com
- Contact email (public): contact.shouldimoveapp@gmail.com
- Analytics: G-D6WSGPKKDX
