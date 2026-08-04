# PumpSync Website Review — 2026-08-02

> **Implementation status (updated 2026-08-03).** The remediation plan in section 6 was implemented on this branch, excluding SEC-01 and SEC-02 at the owner's request. A follow-up pass then applied owner-directed corrections across all four PumpSync repositories:
>
> - **AGE-01 corrected.** The age rating is **4+** (not the 12+ this review estimated); the age-suitability page now states it as the assigned rating.
> - **COPY-01 completed.** Manual syncing is now named alongside the automatic app-open and daily background refreshes everywhere the trigger is described — website, app UI copy (`SyncView.swift`), and wiki.
> - **COPY-02 resolved structurally.** The website no longer maintains a copy of Apple's Health instructions; the privacy, deletion, and terms pages link to Apple Support instead, which removes this class of drift permanently.
> - **POL-02 resolved.** The app and backend repositories now carry an identical `LICENSE.md` (PolyForm Noncommercial 1.0.0, permitting noncommercial use including personal self-hosting), and the site footer links to it.
> - **PRIV-12 resolved.** Verbatim policy copies were removed from the wiki in favor of links to the canonical pages. The wiki commit could not be pushed from this environment (GitHub wikis are separate repositories outside the session credential's reach) and was delivered to the owner as a patch.
>
> A further pass then closed every remaining open item on owner direction:
>
> - **PRIV-07 resolved.** Hosted processing is disclosed as Microsoft Azure East US and East US 2, with what that means for non-US users.
> - **PRIV-11 resolved.** The CCPA applicability note is in the Sharing section.
> - **DEL-01/DEL-03 confirmed.** The 30-day processing window, confirmation reply, and no-ID fallback stand as written.
> - **POL-02 confirmed.** PolyForm Noncommercial 1.0.0 is the accepted license.
> - **COPY-10 resolved.** iOS/iPhone is now named on the site; the platform-language test was narrowed to ban only version-pinned references, which are the part that actually goes stale.
> - **COPY-12 resolved.** Demo mode is explained on the support page (purpose, audience, and the real-Health-store caveat) and pointed to from the home page, with setup steps left to the wiki walkthrough.
> - **SEO-06 resolved.** `MobileApplication` JSON-LD ships on the home page; `AGENTS.md` now distinguishes inert structured data from executable script, and the privacy page's website section describes it precisely.
> - **DES-19 resolved.** The footer is one landmark with non-heading group titles: home went from six nav landmarks and five trailing h2s to two landmarks and a clean h1→h2→h3 outline.
> - **In-app gap closed.** The app's sync-trigger disclosure was nested inside the initial-import section and disappeared after the first sync; it now lives in an always-visible section naming manual syncing alongside both automatic triggers.
>
> One item remains outside this repository's reach: the wiki commit removing duplicated policy text (**PRIV-12**) was delivered to the owner as a patch, since GitHub wikis are separate repositories the session credential cannot push to. The findings below are otherwise left as written on 2026-08-02 and describe the pre-fix state.
>
> **Superseded (2026-08-04).** SEO-04 suggested the home title "PumpSync — Tandem Source to Apple Health Sync". The site has since been made vendor-neutral so other pump services can be added without rewriting the marketing copy, so no title or hero copy names a vendor. `claims.supportedSources` now carries that statement in one place, and the paywall gained the Terms of Use and Privacy Policy links App Review guideline 3.1.2 requires.

Commit reviewed: `8b5cbe7` on `claude/pump-sync-review-smap2g` (identical to `main` at review time).
Built locally with Eleventy 3.x on Node 22; rendered testing against the local build via headless Chromium (Playwright 1.56.1), axe-core (npm latest), html-validate, and the W3C Nu validator (vnu.jar).
Ground truth for content accuracy: the `eslutz/PumpSync` app repository at commit `4957299` (SwiftUI sources, `docs/legal/`, `docs/app-store/`) and the project wiki.
Every Blocker/High candidate was re-verified by an independent adversarial pass that tried to refute it; two candidates were downgraded as a result and the downgrades are recorded below.

## 1. Executive summary

The site is in fundamentally good shape: the build, deploy, and test plumbing is careful, the pages are semantically clean (only one axe violation across 14 page/scheme combinations), dark mode is a first-class variant, internal links are 100% intact, there are zero runtime scripts, and the most legally important privacy sentences match the app's actual data handling verbatim.
The review still found 77 findings (5 High, 27 Medium, 35 Low, 10 Nit) plus 10 discussion items, clustered in five themes:

1. **The home hero breaks at real viewport widths (DES-01).** The oversized `h1` wordmark clips to "PumpSyn" at 320–390px and slides under the sync card at ≥1440px whenever the (never-loaded) Inter font falls back to wider metrics — Linux users, font-override users, and text-spacing users see a truncated brand today.
2. **Two site-wide WCAG AA contrast failures (DES-03, DES-04).** The light-mode focus ring measures 2.75:1 (needs 3:1) and the white primary-button text sits on gradient stops measuring 2.13:1 and 3.63:1 (needs 4.5:1) in both color schemes.
3. **One material content-accuracy gap (COPY-01).** The site says four times that PumpSync syncs "at the user's request" / by "explicit user action", but the shipped app registers a daily background sync task and auto-syncs on app open — transmitting stored Tandem credentials with no contemporaneous user action — and the app's own UI copy discloses this while the website and privacy policy never do.
4. **Policy documents are honest but incomplete (PRIV/DEL/ACC/AGE/POL).** A finished Terms of Use sits unpublished in the app repo while the site sells a subscription (POL-01); the privacy policy lacks children's-privacy, user-rights, controller-identity, and website-scope sections; the deletion page lacks a timeline, a subscription-cancellation notice, and a workable no-app fallback; the accessibility statement names no conformance target; the age page names no expected rating.
5. **One asset dominates performance (PERF-01).** A 917 KB 1024×1024 PNG is loaded in the header of every page to paint a 36×36 logo — 99.4% of first-visit transfer on a site whose everything-else is an exemplary ~12 KB (rated Medium under this review's rubric, but it is the single highest-leverage one-line fix in the report).

High-severity items: DES-01 (hero clipping), DES-03 (focus ring), DES-04 (button contrast), COPY-01 (sync-trigger accuracy), POL-01 (unpublished Terms of Use).
There are no Blockers: adversarial verification downgraded the two Blocker candidates (broken custom 404 → HTML-01 Medium; hero clipping held at High rather than Blocker because mainstream Apple/Windows font metrics likely — barely — fit), and zero findings were refuted outright.

| Area | High | Medium | Low | Nit | Discussion |
|---|---|---|---|---|---|
| 3.1 Design & rendered accessibility (DES) | 3 | 5 | 6 | 4 | 2 |
| 3.2 HTML & validators (HTML) | — | 2 | 1 | 1 | — |
| 3.3 CSS (CSS) | — | 1 | 5 | — | — |
| 3.4 Copy & content accuracy (COPY) | 1 | 3 | 4 | 1 | 3 |
| 3.5 Privacy policy (PRIV) | — | 6 | 4 | — | 1 |
| 3.6 Data deletion (DEL) | — | 3 | 2 | — | — |
| 3.7 Accessibility statement (ACC) | — | 2 | 1 | — | — |
| 3.8 Age suitability (AGE) | — | 1 | 1 | — | 1 |
| 3.9 Terms & licensing (POL) | 1 | — | 1 | — | — |
| 3.10 SEO, social & manifest (SEO) | — | 1 | 3 | 2 | 1 |
| 3.11 Performance & assets (PERF) | — | 1 | 1 | 1 | — |
| 3.12 Links (LINK) | — | — | 1 | — | — |
| 3.13 Security & workflow (SEC) | — | — | 1 | 1 | 1 |
| 3.14 Test-suite coverage (TEST) | — | 2 | 4 | — | 1 |
| **Total** | **5** | **27** | **35** | **10** | **10** |

## 2. Methodology and caveats

Review passes: (1) rendered accessibility — axe-core with WCAG 2.0/2.1/2.2 A+AA and best-practice rulesets across all 7 routes in light and dark schemes, plus scripted keyboard, skip-link, target-size (SC 2.5.8), and text-spacing (SC 1.4.12) probes; (2) responsive/visual — full-page screenshots at 320/375/560/768/1024/1440 in both schemes, breakpoint-boundary shots, landscape, reduced-motion, forced-colors, and print-PDF probes; (3) HTML validation (html-validate + W3C Nu) and full internal/external link checking over the built output; (4) computed WCAG contrast for every token pair plus runtime resolution of all six `color-mix()` sites; (5) copy accuracy against the app's SwiftUI sources and the project wiki, plus a duplication matrix; (6) the four policy documents against Apple App Review guidelines (5.1.1/5.1.2/5.1.3/3.1.2), W3C accessibility-statement norms, and deletion-instruction best practice, with git forensics; (7) SEO/social metadata, asset weights, `npm audit`, workflow permissions, and test-suite gap analysis.
Every Blocker/High candidate was then handed to an independent adversarial verifier instructed to refute it; verdicts (confirm/downgrade) are reflected in the severities below.

Caveats:

- The live site `https://pumpsync.ericslutz.dev` is not reachable from this review environment (egress proxy policy), so all rendered testing ran against a local build of this commit served on localhost. Live-vs-deployed parity was not verified; spot-check the production domain, TLS, and Pages "Enforce HTTPS" setting from an unrestricted network.
- External links to `ericslutz.dev`, `tandemdiabetes.com`, and `apple.com` are likewise proxy-blocked and are reported as *unverifiable from this environment*, not broken (LINK-01). All five `github.com` destinations were verified live.
- Rendering was Chromium-only; WebKit/Safari behaviors (e.g. `backdrop-filter` prefixing) are source-level observations.
- Font-metric-dependent findings (DES-01) were measured with Linux fallback fonts because the declared first-choice font (Inter) is never loaded; the finding states the per-platform nuance.
- The policy review is a best-practice analysis against the cited guidelines, calibrated to an indie developer with privacy-first positioning; it is not legal advice.
- WCAG 2.2 SCs assessed as not applicable to this static, JS-free, form-free site: 1.2.x (no media), 1.3.5, 1.4.2, 1.4.5, 1.4.13, 2.1.4, 2.2.x, 2.3.x, 2.5.1–2.5.4, 3.2.1–3.2.2, 3.3.x, 4.1.3.

## 3. Findings

Severity: **High** = WCAG AA failure with real user impact, or a policy gap undermining the privacy-first positioning or App Review legibility · **Medium** = best-practice gap or incomplete policy element · **Low** = polish · **Nit** = trivia.
Status: *Verified* = independently reproduced by the adversarial pass · *Confirmed* = evidence-backed by the primary pass · *Discussion* = a decision for the owner, not a defect (excluded from severity counts) · *Unverifiable-from-env*.

### 3.1 Design & rendered accessibility (DES)

#### DES-01 · High · Home hero wordmark and content clip at phone widths and slide under the sync card at desktop widths
- Location: `src/assets/styles.css:197-200` (`h1 { max-width: 9ch; font-size: clamp(3.4rem, 8vw, 7.4rem) }`), `styles.css:564-566` (≤560px `clamp(2.8rem, 18vw, 4.2rem)`), `styles.css:166` (`.hero { overflow: hidden }`); route `/`.
- Evidence: at 320px the h1 text run measures 339px (33px clipped past the viewport), at 375px 395px (34px clipped), at 390px 19px clipped — "PumpSync" renders as "PumpSyn" and the lead paragraph is cut mid-word, with no horizontal scroll because `.hero` clips instead of overflowing. At 1440px the 9ch box (566px) is narrower than the real 677px glyph run and the wordmark tail paints 39px underneath the opaque sync card (54px at 1680px). Root cause: `9ch` is the width of nine "0" glyphs, not of the real bold word, and the hero grid columns lack a `minmax(0, …)` guard. Screenshots: `screenshots/des-01-hero-clipped-375.png`, `des-01-home-320-top.png`, `des-01-hero-under-card-1440.png`.
- Nuance (from adversarial verification, which reproduced every number): the declared first-choice font Inter is never loaded (CSS-02), so rendering depends on each platform's fallback; a control run with Arial-class metrics suggests mainstream Apple/Windows devices fit — by roughly 8px at 320px. Linux visitors (a real audience for a product marketing self-hosting), users with font overrides, and users applying SC 1.4.12 text-spacing overrides get the broken rendering today.
- Citation: WCAG 2.2 SC 1.4.10 Reflow (AA); aggravates SC 1.4.12 Text Spacing.
- Status: Verified (two independent reproductions).
- Recommendation: remove `max-width: 9ch` (or use `max-width: fit-content`), tame the scale (e.g. desktop `clamp(2.8rem, 7vw, 6.4rem)`, mobile `clamp(2.4rem, 13vw, 4rem)`), add `minmax(0, …)` to `.hero-content` columns, and re-test at 320/375/390/1440 with a non-Inter fallback font forced.
- Effort: S

#### DES-02 · Medium · `/accessibility/` overflows 10px at 320px — the one true page-level reflow failure, on the accessibility page
- Location: `src/assets/styles.css:425-428` (`.page-hero h1 { font-size: clamp(2.8rem, 6vw, 5.8rem) }`); route `/accessibility/`.
- Evidence: the word "Accessibility" at the 2.8rem clamp floor measures 316px against 292px available (320 − 2×14px gutters), forcing `scrollWidth` 330 and clipping the final letter until the user scrolls; the only non-zero entry in the 84-combination overflow sweep. No `overflow-wrap`/`word-break`/`hyphens` rule exists anywhere in the stylesheet as a safety net. Screenshot: `screenshots/des-02-accessibility-320-top.png`.
- Citation: WCAG 2.2 SC 1.4.10 Reflow (AA).
- Status: Verified — downgraded from High by the adversarial pass (impact is one letter tail on one heading, recoverable by a 10px scroll), with the optics note that the failure lands on the accessibility statement itself.
- Recommendation: lower the `.page-hero h1` clamp floor to ~2.2rem (verified: the word then measures 248px and the overflow disappears) and add a global `overflow-wrap: break-word` plus `hyphens: auto` on headings as a safety net for long tokens.
- Effort: S

#### DES-03 · High · Light-mode keyboard focus ring fails 3:1 non-text contrast on every surface
- Location: `src/assets/styles.css:79-83` (`outline: 3px solid var(--amber)`), token `--amber: #00a9d6` at `styles.css:12`; all routes.
- Evidence: computed ratios 2.75:1 on `#ffffff`, 2.56:1 on `#f1f8ff`, 2.49:1 on `#e4f7ff` — all below the 3:1 minimum. This ring is the sole focus indicator for links and buttons in light mode. Dark mode passes at 11.03:1 (`#6ad7ff` on `#081724`). Screenshot: `screenshots/des-03-focus-ring-light.png`.
- Citation: WCAG 2.2 SC 1.4.11 Non-text Contrast (AA).
- Status: Verified (ratios independently recomputed from scratch).
- Recommendation: use a darker light-scheme focus color, e.g. `outline-color: var(--teal-dark)` (#005aab — verified 6.88:1 on white, 6.43:1 on `#f1f8ff`), keeping `#6ad7ff` in dark.
- Effort: S

#### DES-04 · High · White primary-button text fails 4.5:1 over most of every primary CTA, in both color schemes
- Location: `src/assets/styles.css:15` (`--brand-gradient`), `styles.css:253-258` (`.button.primary`, `.button.dark`); instances `src/index.njk:16,106`, `src/support/index.njk:23`, `src/404.njk:19`.
- Evidence: white on gradient stop `#08c7b7` = 2.13:1, on `#008fcb` = 3.63:1 (stop `#0147a8` passes at 8.51:1); button text is 15.2px at weight 800, below the large-text threshold, so 4.5:1 applies; geometry analysis puts ~63% of the button surface below 4.5:1 with the centered label sitting mostly on failing background. `--brand-gradient` has no dark override, so the failure is identical in dark mode. Screenshot: `screenshots/des-04-button-contrast-light.png`.
- Citation: WCAG 2.2 SC 1.4.3 Contrast Minimum (AA).
- Status: Verified (ratios and geometry independently recomputed).
- Recommendation: use a button-specific darker gradient — verified passing hue-preserving stops `#0a8579` (4.52:1) and `#007a99` (4.95:1), i.e. `linear-gradient(135deg, #0a8579 0%, #007a99 45%, #0147a8 100%)` — or layer a fixed dark overlay on `.button.primary/.dark` only, leaving the brand gradient untouched elsewhere.
- Effort: S

#### DES-05 · Medium · Heading-level skip on home: three h3s between the h1 and the first h2
- Location: `src/index.njk:28,35,42` (sync-card h3s), first h2 at `src/index.njk:53`.
- Evidence: the only axe violation site-wide (`heading-order`, moderate, both schemes) and one of only two W3C Nu validator errors; the document outline runs h1 → h3×3 → h2.
- Citation: WCAG SC 1.3.1 (axe `heading-order`; vnu error).
- Status: Confirmed.
- Recommendation: restructure the sync card as an `<ol>` of three `<li>` items whose titles are `<strong>`/`<p>` rather than headings — this also fixes DES-13 in the same edit.
- Effort: S

#### DES-06 · Medium · Plain `.button` boundary fails 3:1 in both schemes (1.37:1 light, 1.49:1 dark)
- Location: `src/assets/styles.css:232-246` (border `var(--line)` on a `var(--surface)` fill identical to the page background); e.g. "Data deletion" on `/`, "GitHub Discussions" on `/support/`.
- Evidence: `#cddfec` on white = 1.37:1; dark `rgba(255,255,255,0.14)` composited over `#081724` = 1.49:1. The border is the control's only extent indicator; the text label mitigates, hence Medium.
- Citation: WCAG 2.2 SC 1.4.11 (AA).
- Status: Confirmed.
- Recommendation: darken the button border (e.g. `var(--teal-dark)` or a ≥3:1 gray-blue) or give `.button` a distinct fill plus stronger border.
- Effort: S

#### DES-07 · Medium · Sticky stacked header permanently consumes 18–26% of portrait-phone viewports and 31% in phone landscape
- Location: `src/assets/styles.css:100-107` (sticky), `styles.css:519-529` (column stack ≤880px).
- Evidence: measured header heights — 148px at 320×568 (26%), 117px at 375×667 (18%), 117px at 667×375 (31%); the column stack engages at 880px although the single 73px row would fit down to ~640px, so tablets pay the cost too. Screenshot: `screenshots/des-07-landscape-667x375.png`.
- Status: Confirmed. (The pre-review concern about the hero's `min-height: 650px` in landscape was refuted: that rule is inoperative below 880px.)
- Recommendation: make the header non-sticky below 880px, or keep brand+nav on one row down to ~640px.
- Effort: S

#### DES-08 · Medium · Inner-page body copy is centered while the hero heading, header, and footer are flush left — a 150px left-edge misalignment on all five content pages at desktop
- Location: `src/assets/styles.css:344-347` (`.wrap { margin: 0 auto }`) + `styles.css:435-437` (`.content { max-width: 860px }`).
- Evidence: measured at 1440px on `/age-suitability/`: hero h1 left = 140, content left = 290, footer left = 140. Affects every viewport wider than ~900px on all five inner pages. Screenshot: `screenshots/des-08-age-suitability-1440-top.png`.
- Status: Confirmed (new finding from the visual sweep).
- Recommendation: left-align the content column under the hero h1 (`margin-inline: 0` on `.wrap.content`), or center the page-hero to match — pick one axis.
- Effort: S

#### DES-09 · Low · Reduced-motion removes the only `.button` hover feedback with no substitute
- Location: `src/assets/styles.css:248-251` (hover = `translateY(-1px)` only), `styles.css:585-592` (reduced-motion sets `transform: none`).
- Evidence: computed hover state identical to rest under `prefers-reduced-motion` (verified property-by-property).
- Status: Confirmed.
- Recommendation: add a motion-free hover cue (border-color or `filter: brightness(1.05)`), which also improves normal-mode hover.
- Effort: S

#### DES-10 · Low · Forced-colors mode: fact-list bullets vanish entirely
- Location: `src/assets/styles.css:385-408` (`.fact-list { list-style: none }` with gradient-background `::before`); route `/`.
- Evidence: under `forced-colors: active` the marker computes to an invisible transparent 8×8 box; the four "Two backend paths" items render as unmarked paragraphs. Everything else (buttons, links, current-page cue) survives forced colors well. Screenshot: `screenshots/des-10-factlist-forced-colors.png`.
- Status: Confirmed.
- Recommendation: draw the bullet with `border` or `background: currentColor`, which forced-colors preserves.
- Effort: S

#### DES-11 · Low · No print styles: policy printouts spend a page on the footer link matrix and strand a section heading
- Location: `src/assets/styles.css` (no `@media print`); routes `/privacy/`, `/privacy/data-deletion/`.
- Evidence: print-PDF probes show the privacy policy at 4 pages with page 4 solely footer nav lists and the heading "Data sent to PumpSync servers" orphaned at a page break; the deletion page similarly ends with a footer-only page. Content itself prints legibly.
- Status: Confirmed.
- Recommendation: ~10-line `@media print` block hiding header nav/footer groups/skip link and adding `break-after: avoid` on h2.
- Effort: S

#### DES-12 · Low · Skip-link and anchor jumps land `#main` flush under the sticky 72px header
- Location: `src/assets/styles.css:100-107`; no `scroll-margin`/`scroll-padding` anywhere; skip link at `base.njk:25`.
- Evidence: after activating the skip link on `/support/`, the first 73px of `<main>` (including the top 6px of the h1) sit under the mostly-opaque header. SC 2.4.11 was explicitly assessed and **passes** — the next focused element lands well below the header — so this is polish, not a failure. Screenshot: `screenshots/des-12-skiplink-under-header.png`.
- Citation: WCAG 2.2 SC 2.4.11 assessed, passes; fix is best practice.
- Status: Confirmed.
- Recommendation: `html { scroll-padding-top: 84px }`.
- Effort: S

#### DES-13 · Low · Sync-card step numbers 1/2/3 are `aria-hidden` with no AT-visible sequence semantics
- Location: `src/index.njk:26,33,40`.
- Evidence: sighted users see numbered steps; screen-reader users get three unnumbered blocks whose order is conveyed only by DOM position.
- Citation: WCAG SC 1.3.1 (A).
- Status: Confirmed.
- Recommendation: wrap the steps in an `<ol>` (fixes together with DES-05).
- Effort: S

#### DES-14 · Low · `navCurrent` is inert on `/accessibility/` and `/age-suitability/`, and the deletion page marks the Privacy link `aria-current="page"` while on a different page
- Location: `src/_includes/layouts/base.njk:28,33-34` vs the `navCurrent` front-matter values in the two templates; `src/privacy/data-deletion/index.njk:6`.
- Evidence: rendered pages show zero `[aria-current]` elements on those two routes (the layout only maps home/support/privacy), and `/privacy/data-deletion/` renders `aria-current="page"` on the header Privacy link.
- Status: Confirmed.
- Recommendation: add footer `aria-current` handling for Accessibility/Age Suitability/Data Deletion links (or delete the dead front-matter values), and change the deletion page's header case to `aria-current="true"` or nothing.
- Effort: S

#### DES-15 · Nit · Header nav links are 23.77px tall at 375px — 0.23px under the SC 2.5.8 minimum, conformant only via the spacing exception
- Location: `src/assets/styles.css:138-146`.
- Evidence: measured 23.77px height with 20px gaps on a single row — the 24px-circle spacing exception applies, so this passes WCAG 2.2 AA; reported as a near-miss.
- Citation: WCAG 2.2 SC 2.5.8 Target Size (Minimum) — passes via exception.
- Status: Confirmed.
- Recommendation: ~0.35rem vertical padding on `.nav-links a` (Apple HIG suggests 44pt for touch).
- Effort: S

#### DES-16 · Nit · Nav and footer link groups are bare `<a>` siblings with no list semantics
- Location: `src/_includes/layouts/base.njk:32-37,45-72`.
- Evidence: no `<ul>/<li>` anywhere in the chrome; screen readers lose "list, N items" announcements. Not a WCAG failure (landmarks are present and labeled).
- Status: Confirmed.
- Recommendation: wrap link sets in `<ul><li>` with `list-style: none`.
- Effort: S

#### DES-17 · Nit · Sync-card decorative inner frame sits 0.4px from content at narrow widths
- Location: `src/assets/styles.css:278-285` (`::before { inset: 18px }`) vs padding that bottoms out at 18.4px.
- Evidence: at ≤~613px the "Sync model" label and icon tiles visually touch the frame line, reading as a glitch.
- Status: Confirmed.
- Recommendation: tie the inset to the padding (`inset: calc(clamp(1.15rem, 3vw, 2rem) - 10px)`) or raise the padding floor.
- Effort: S

#### DES-18 · Nit · 560–880px zone: the footer's five groups leave "Related Services" as a lone orphan row
- Location: `src/assets/styles.css:544-548` (2-column footer grid ≤880px); seen at 768px.
- Evidence: rows render SITE|POLICIES / PROJECT|DEVELOPER / RELATED SERVICES alone. Otherwise the tablet zone verified clean.
- Status: Confirmed.
- Recommendation: `repeat(auto-fit, minmax(150px, 1fr))` in the tablet range, or accept.
- Effort: S

#### DES-19 · Discussion · Footer is five separate `<nav>` landmarks each headed by an `<h2>`
- Location: `src/_includes/layouts/base.njk:45-72`.
- Evidence: every page ends with five extra h2s and carries six nav landmarks; each is correctly and uniquely labeled, so this is a defensible design choice — flagged as AT heading-map/rotor verbosity, not a defect.
- Recommendation if simplifying: one `<nav aria-label="Footer">` containing five lists whose group titles are styled non-headings.

#### DES-20 · Discussion · Desktop display-type scale (h1 up to 118px) is a taste call — but the largest element is the one that breaks
- Location: `src/assets/styles.css:197-204`.
- Evidence: h1 measures 115–118px at ≥1440px, h2 ~58px; the hierarchy still reads, and the oversized wordmark gives the page presence — it is also the direct cause of DES-01.
- Recommendation: either keep the scale and apply the DES-01 fix, or cap h1 near 6rem, which fixes the overflow for free.

### 3.2 HTML & validators (HTML)

#### HTML-01 · Medium · Custom 404 builds to `/404/index.html`, so GitHub Pages serves its generic 404 instead; the page also declares a canonical/og:url pointing at a URL the build does not emit
- Location: `src/404.njk:1-7` (no `permalink`; `canonical: "https://pumpsync.ericslutz.dev/404.html"`).
- Evidence: `_site/404.html` does not exist while `_site/404/index.html` does; GitHub Pages only serves custom 404s from root-level `404.html`, so the branded error page never appears in production — a mistyped URL gets GitHub's generic 404. The built page also emits `<link rel="canonical">` and `og:url` pointing at the nonexistent `/404.html`. The test suite has zero 404 coverage (TEST-01).
- Status: Verified — downgraded from Blocker by the adversarial pass: every real page and every URL App Review checks resolves fine; the only production consequence is an unbranded error page.
- Recommendation: add `permalink: "404.html"` to the front matter; remove the `canonical` key (the og block is gated on it, and error pages should assert neither); add the TEST-01 guard test.
- Effort: S

#### HTML-02 · Medium · `aria-label` on a role-less `<div class="sync-card">` — flagged as an error by both validators
- Location: `src/index.njk:20`.
- Evidence: html-validate `aria-label-misuse` error and W3C Nu error (aria-label prohibited on `div` with generic role); ARIA 1.2 prohibits naming generic elements, so "PumpSync data flow" is ignored inconsistently by AT. Practical harm is small — the card's text content is still read.
- Citation: ARIA in HTML; WCAG SC 4.1.2-adjacent.
- Status: Confirmed (both validators + axe `aria-prohibited-attr`).
- Recommendation: add `role="group"` (or use `<figure>`/`<figcaption>`), or drop the `aria-label`.
- Effort: S

#### HTML-03 · Low · `.inner-page` class is emitted on six pages but styles nothing
- Location: `src/_includes/layouts/base.njk:26`; `innerPage: true` in six templates.
- Evidence: zero matches for `inner-page` in `styles.css`; the class renders faithfully and does nothing.
- Status: Confirmed.
- Recommendation: remove the conditional and the six front-matter keys, or add the intended CSS.
- Effort: S

#### HTML-04 · Nit · html-validate style noise: lowercase doctype and template-induced trailing whitespace
- Location: `src/_includes/layouts/base.njk:1,16-22,41`.
- Evidence: 28 of 29 html-validate errors are `doctype-style` and `no-trailing-whitespace` — both fully conforming HTML (the W3C Nu validator raises neither); residue of Nunjucks `{% if %}` lines.
- Status: Confirmed.
- Recommendation: none needed; if html-validate is adopted in CI (TEST-04), use `{%- -%}` trims or disable the two rules.
- Effort: S

### 3.3 CSS (CSS)

#### CSS-01 · Medium · Body type locked at 17px while every rem resolves against the 16px browser default
- Location: `src/assets/styles.css:58` (`body { font-size: 17px }`), no `html` font-size, `:553-555` (≤560px `16px`).
- Evidence: `.brand` (1rem = 16px) renders beside 17px body copy; every rem token is on a 16px scale; the ≤560px change moves only px-inheriting text; a user raising their browser default font size scales rem elements but not body copy. Page zoom still works, so this is the spirit of SC 1.4.4 rather than a hard failure.
- Citation: WCAG 2.2 SC 1.4.4 Resize Text (spirit).
- Status: Confirmed.
- Recommendation: `body { font-size: 1.0625rem }` and `1rem` at ≤560px — a two-line diff that unifies the scale and honors user preference.
- Effort: S

#### CSS-02 · Low · Inter is named first in the font stack but never loaded — typography silently varies by machine, and wider fallbacks trigger DES-01
- Location: `src/assets/styles.css:57`; no `@font-face` or font `<link>` anywhere.
- Evidence: zero font-loading references in the repo; visitors with Inter installed see different metrics and line wraps than everyone else; the DES-01 clipping severity depends on which fallback lands.
- Status: Confirmed.
- Recommendation: either drop Inter (system-ui-first matches the zero-request, zero-JS ethos) or self-host a woff2 with `font-display: swap`. Do not hotlink Google Fonts — it would contradict the site's no-third-party privacy posture.
- Effort: S

#### CSS-03 · Low · Six `color-mix()` declarations have no fallback — pre-2023 browsers drop them, most visibly leaving the sticky header with no background
- Location: `src/assets/styles.css:104,256,271,301,319,320`.
- Evidence: no preceding plain-value declaration at any of the six sites; in pre-Baseline-2023 browsers the header becomes a transparent sticky bar, the sync-card loses its fill, the sync icons lose tile and border. Modern resolved values all pass contrast where text-bearing.
- Citation: Baseline 2023 (Chrome/Edge 111, Safari 16.2, Firefox 113).
- Status: Confirmed.
- Recommendation: add a plain fallback line before each `color-mix` declaration (e.g. `background: var(--surface);` before the header's mix).
- Effort: S

#### CSS-04 · Low · Inner-page prose measure runs ~91–105 characters per line at `max-width: 860px`
- Location: `src/assets/styles.css:435-437`.
- Evidence: measured on rendered `/privacy/` paragraphs — full lines ~95–105 characters against the 45–90 readability ideal.
- Citation: WCAG SC 1.4.8 (AAA — best practice, not an AA failure).
- Status: Confirmed.
- Recommendation: `.content { max-width: 70ch }` (~740px), landing full lines near 78–82 characters.
- Effort: S

#### CSS-05 · Low · Dead tokens `--teal`, `--blue-deep`, `--danger` defined in both schemes, used zero times
- Location: `src/assets/styles.css:9,14,17` and `:31,36,38`.
- Evidence: `var(--teal)` (exact), `var(--blue-deep)`, `var(--danger)` each grep to zero uses — six maintained definition lines for nothing.
- Status: Confirmed.
- Recommendation: delete, or wire `--danger` into future error styling.
- Effort: S

#### CSS-06 · Low · Hard-coded colors shadow existing tokens: card shadows bypass `--shadow` (dark mode keeps light-tinted shadows) and both hero gradients duplicate surface-token values
- Location: `src/assets/styles.css:371,135,258` (hard-coded shadows; `var(--shadow)` is consumed exactly once) and `:161-175` (hero gradients hard-coding `#f5fbff/#ffffff` light and byte-identical copies of the dark surface tokens).
- Evidence: no visible seam today (the dark literals equal the dark tokens), but token edits will not propagate; light `#f5fbff` exists as no token at all.
- Status: Confirmed.
- Recommendation: introduce `--shadow-sm` and a `--surface-hero` token; rewrite the dark hero rule in terms of `var(--surface)`/`var(--surface-alt)` so it can collapse away.
- Effort: S

### 3.4 Copy & content accuracy (COPY)

#### COPY-01 · High · The site says PumpSync syncs "at the user's request" four times, but the shipped app performs automatic daily background syncs and app-open refreshes — transmitting stored Tandem credentials without contemporaneous user action
- Location: `src/privacy/index.njk:14`, `src/support/index.njk:41`, `src/age-suitability/index.njk:22`, `src/index.njk:54` ("explicit user action").
- Evidence: the app registers the `dev.ericslutz.PumpSync.daily-sync` background task (`PumpSyncApp.swift:14-16`), schedules it on every backgrounding (`:36`), and auto-syncs on app open when data is >20h stale (`:32-34`; `AppConstants.staleSyncInterval`); `project.yml` declares `UIBackgroundModes: processing`. During those automatic syncs `SyncCoordinator.sync()` loads Keychain credentials (`:97`) and transmits them to the backend (`:118-126`) identically to a manual sync. The app's own UI discloses this — `SyncView.swift:33`: "After the first sync, PumpSync checks for new pump data when the app opens and during daily background updates when iOS grants time." — while no page of the website does. A full-site grep confirms no page mentions automatic or background syncing.
- Citation: Apple App Review 5.1.1(i) — the privacy policy must accurately describe data use.
- Status: Verified (adversarial pass reproduced every claim and rejected the refutation attempts; rated High, not Blocker, because the in-app disclosure exists).
- Recommendation: reword all four occurrences to match actual behavior — the app's own sentence is a ready-made source of truth, e.g. "when you start a sync, and — after initial setup — automatically when the app opens and during daily background updates." The credential-transmission sentences ("only during an active HTTPS sync request") remain true and can stay.
- Effort: S

#### COPY-02 · Medium · The deletion page's Apple Health revocation path contradicts the path the app itself tells users
- Location: `src/privacy/data-deletion/index.njk:40-44` ("Open Settings. Open Health. Open Data Access & Devices.") vs `HealthWritePermission.swift:57` ("open Settings, tap Privacy & Security, tap Health, choose PumpSync").
- Evidence: the two published instruction sets name different Settings paths; which one is correct on the current iOS release is unverifiable from this environment, but the site-vs-app contradiction is confirmed from sources. Precedent: commit `5ea6b02` fixed exactly this kind of drift in the Tandem credential steps.
- Status: Confirmed (new finding).
- Recommendation: verify on a current iOS device and align both to the surviving path (the app's Privacy & Security route is the more standard one).
- Effort: S

#### COPY-03 · Medium · Seven core claims are duplicated in 2–7 hand-maintained wordings each (~25 instances), and the enumerations have already drifted
- Location: matrix in Appendix E; worst families — backend non-persistence ×7 wordings, Keychain ×5, medical disclaimer ×5 (see COPY-06), HealthKit-no-ads ×4 (see COPY-05), don't-send-sensitive-data ×3 with three different item lists.
- Evidence: e.g. `src/support/index.njk:33` tells users not to email "service tokens, App Store receipts…", `src/privacy/data-deletion/index.njk:62` says "Tandem tokens…", `src/accessibility/index.njk:46` names neither — three pages, three lists. `src/_data/` does not exist, so nothing renders from shared data.
- Status: Confirmed.
- Recommendation: create `src/_data/claims.json` (Eleventy auto-loads it) holding the canonical sentences, render via `{{ claims.x }}`, keep the legally precise enumeration (`privacy:39`) as canonical, and add a test asserting the canonical sentences appear where required.
- Effort: M

#### COPY-04 · Medium · Home page register targets App Review and backend engineers, not the diabetic end-user audience
- Location: `src/index.njk:14,36,74-75,92-95,103`.
- Evidence: user-facing copy includes "normalized samples", "idempotency" (twice), "durable hosted state keyed by App Store transaction and installation identifiers", "request-time processing", and a section headline that addresses reviewers directly ("Support and policy pages for App Review and users.").
- Status: Confirmed.
- Recommendation: rewrite the hero and fact-list in plain language (e.g. "Your Tandem login stays on your phone. Our server fetches your pump data, hands it to Apple Health, and forgets it."), move idempotency-grade detail to `/privacy/`, and retitle the callout "Support and policy pages".
- Effort: M

#### COPY-05 · Low · The operative privacy policy's no-advertising promise is weaker than the marketing page's — "tracking" appears on home but not in the policy
- Location: `src/privacy/index.njk:45` vs `src/index.njk:71`.
- Evidence: home: "advertising, marketing, tracking, or data mining"; policy: "advertising, marketing, or data mining".
- Citation: Apple App Review 5.1.3(i).
- Status: Confirmed.
- Recommendation: add "tracking" to the policy sentence and render both from one `claims.json` entry.
- Effort: S

#### COPY-06 · Low · The home card titled "Not medical advice" is the only disclaimer variant whose body omits the words "medical advice"
- Location: `src/index.njk:78-79`.
- Evidence: card body reads "…does not provide diagnosis, treatment, or dosing recommendations" while every other variant (footer, privacy, support, age page) includes "medical advice".
- Status: Confirmed.
- Recommendation: insert "medical advice," or render the shared canonical sentence.
- Effort: S

#### COPY-07 · Low · Support FAQ hedges "when supported by the current sync flow" while every other page states the same fact categorically — and the app supports both types unconditionally
- Location: `src/support/index.njk:41`.
- Evidence: the sync flow maps exactly insulin (bolus/basal → `insulinDelivery`) and carbohydrates (→ `dietaryCarbohydrates`) (`HealthKitService.swift:267-281`); the only real caveat is per-type Health permission, not "sync flow support".
- Status: Confirmed.
- Recommendation: replace the hedge with the true caveat: each sample type is written only if that Health permission was granted.
- Effort: S

#### COPY-08 · Low · README lists `src/assets/pumpsync-mark.svg`, which does not exist and whose absence the test suite actively enforces
- Location: `README.md:14`; `test/site.test.mjs:69` asserts the file must NOT exist.
- Status: Confirmed.
- Recommendation: delete the line or replace with `src/assets/pumpsync-app-icon.png`.
- Effort: S

#### COPY-09 · Nit · Copy polish: "Nonprod" jargon on a user-facing page, one garbled support sentence
- Location: `src/privacy/data-deletion/index.njk:72` ("Nonprod and TestFlight data"); `src/support/index.njk:22` ("because they make investigation easier to track").
- Evidence: TestFlight users know "beta", not "nonprod"; the support sentence is grammatically tangled. A full spelling sweep of all seven rendered pages found zero misspellings.
- Status: Confirmed.
- Recommendation: "Beta and TestFlight data"; "…because they keep the investigation easy to track."
- Effort: S

#### COPY-10 · Discussion · The test suite bans iOS/iPhone/iPad wording site-wide, so users cannot learn from the site that PumpSync is an iOS-only app
- Location: `test/site.test.mjs:154`; the product is iOS-only (`project.yml: LSRequiresIPhoneOS: true`).
- Evidence: the only "ios" match on any rendered page is inside the footer URL `apple.com/ios/health/`; the site says "Apple platform app" and gives Settings instructions that already assume iOS without naming it.
- Recommendation: owner's call — the ban keeps copy valid if iPadOS/macOS ship, but a prospective user landing from search cannot tell the platform. One sentence like "PumpSync is an app for iPhone" on the hero (with the test regex relaxed for exactly that phrase) resolves it while keeping version-string bans.

#### COPY-11 · Discussion · Page titled "Account and Data Deletion" for a product that deliberately has no user accounts
- Location: `src/privacy/data-deletion/index.njk:3,13` vs the footer's label "Data Deletion" (`base.njk:53`).
- Evidence: no PumpSync accounts exist ("Sign in with Apple is intentionally not part of the hosted access flow", `index.njk:94`; confirmed in app README).
- Recommendation: owner's call — "Account and" matches App Store Connect conventions and preempts reviewer questions; if kept, add one line stating PumpSync does not create user accounts so the word cannot mislead.

#### COPY-12 · Discussion · The public synthetic demo mode exists (wiki-documented, app-labeled) but is never mentioned on the site
- Location: `src/support/index.njk` FAQ (absent); wiki `Demo-Mode.md`.
- Evidence: the demo backend and credentials are public; the omission is defensible for a user-facing site because the demo writes synthetic samples into the device's real Apple Health store (the wiki warns to use a test device).
- Recommendation: owner's call — if a try-before-subscribe path is wanted, one FAQ entry linking the wiki Demo-Mode page (with the test-device warning) beats inlining credentials on the site.

### 3.5 Privacy policy (PRIV)

#### PRIV-01 · Low · Policy hygiene: deletion-page steps changed on 2026-07-29 with no visible change record, no "Last updated" line exists anywhere, and the stated effective date predates the repo
- Location: `src/privacy/index.njk:22,85`; `src/privacy/data-deletion/index.njk:22`; commit `5ea6b02`.
- Evidence: both policy pages state "June 18, 2026" (three days before the repo's first commit — plausible if the text predates the site, but unexplained); commit `5ea6b02` (2026-07-29) changed the deletion steps with no date bump; no "last updated" or changelog exists in `src/`.
- Status: Verified — downgraded from High by the adversarial pass: the "effective date will be updated" promise at `privacy:85` governs the privacy policy page, which has not materially changed; the 2026-07-29 change was a wording alignment with the app's real labels, not a practice change; Apple 5.1.1(i) does not require last-updated dates. What survives is a legitimate hygiene gap.
- Recommendation: add a "Last updated" line (distinct from "Effective date") to both policy pages and bump it on any user-visible change; state or fix the pre-repo effective date.
- Effort: S

#### PRIV-02 · Medium · No children's/COPPA position anywhere, although the age-suitability page explicitly contemplates use by minors
- Location: `src/privacy/index.njk` (absent); `src/age-suitability/index.njk:37`.
- Evidence: no "children", "under 13", or COPPA statement exists in any source; the age page tells parents to supervise minors — the product plainly contemplates pediatric users (T1D pump users skew young) while the policy is silent on children's data.
- Citation: COPPA; Apple App Review 5.1.4.
- Status: Confirmed.
- Recommendation: add one children's-privacy paragraph (not directed at children under 13; a parent or guardian must operate the subscription and authorize access for a minor's data) and cross-link it from the age page — one fix feeds both pages (AGE-03).
- Effort: S

#### PRIV-03 · Medium · No user rights beyond deletion — no access, correction, or portability path
- Location: `src/privacy/index.njk:67-71`.
- Evidence: deletion is the only right offered; the backend stores entitlement state, installation mappings, and sync metadata, so an access request is answerable.
- Citation: GDPR Arts. 15–20 (best-practice calibration, not a compliance demand).
- Status: Confirmed.
- Recommendation: one sentence: users may also request a copy or correction of hosted metadata through the same support channel.
- Effort: S

#### PRIV-04 · Medium · Retention is purely qualitative, and the ground truth is that operational records accumulate until a deletion request — which the policy does not say
- Location: `src/privacy/index.njk:61-65`.
- Evidence: "only as long as needed to operate PumpSync…" names no period or criteria for any durable record class; the wiki states plainly: "Sync attempts and rate-limit buckets accumulate until a data-deletion request removes the user's rows; there is no automatic time-based cleanup." The transient classes are well-specified; the durable ones are not.
- Citation: Apple App Review 5.1.1(i) (retention disclosure).
- Status: Confirmed.
- Recommendation: either disclose it in one sentence ("operational records are kept until you request deletion; there is currently no automatic time-based cleanup") or implement time-based cleanup backend-side and keep the copy.
- Effort: S

#### PRIV-05 · Medium · The data controller is never identified inside the policy — only the site-wide footer copyright names Eric Slutz
- Location: `src/privacy/index.njk` (absent); `base.njk:77`.
- Evidence: a user reading or printing the policy alone cannot tell who is accountable for the data described.
- Citation: GDPR Art. 13(1)(a) (proportionate: name + contact route suffices at indie scale).
- Status: Confirmed.
- Recommendation: one line in the policy: "PumpSync is operated by Eric Slutz, an independent developer" plus the existing contact route.
- Effort: S

#### PRIV-06 · Medium · The website's own privacy story — zero JS, no cookies, no analytics — is true and completely unstated
- Location: `src/privacy/index.njk` (absent section).
- Evidence: 0 `<script>` tags in the entire built site (verified), no cookies, no analytics; the policy covers only the app/backend. The strongest, cheapest privacy-first claim available is not being made. Honesty note: GitHub Pages keeps ordinary server access logs outside the developer's control.
- Status: Confirmed.
- Recommendation: add a short "This website" section: no cookies, no analytics, no JavaScript, no tracking; hosted on GitHub Pages, which maintains standard server logs per GitHub's privacy statement.
- Effort: S

#### PRIV-07 · Low · No international-transfer statement; the Azure hosting region is never disclosed
- Location: `src/privacy/index.njk:57`.
- Evidence: the only geography-adjacent word on the site refers to the Tandem account region; non-US users cannot tell where hosted metadata and transient sync processing occur.
- Citation: GDPR Ch. V (proportionate one-liner).
- Status: Confirmed.
- Recommendation: one sentence naming the hosting region(s), e.g. "hosted in Microsoft Azure data centers in the United States; using PumpSync from other countries transfers request data there."
- Effort: S

#### PRIV-08 · Low · Third-party list is open-ended ("such as") with generic roles
- Location: `src/privacy/index.njk:55-58`.
- Evidence: Apple, Microsoft Azure, and GitHub are named (good), but "such as" leaves the list non-exhaustive and the five workflow nouns are not attributed per provider.
- Citation: Apple App Review 5.1.2.
- Status: Confirmed.
- Recommendation: make the list exhaustive with per-provider roles: Apple (App Store, subscriptions, HealthKit), Azure (backend hosting, telemetry), GitHub (website hosting, source, support).
- Effort: S

#### PRIV-09 · Low · Privacy requests are routed to the support page, whose primary presented channel is public GitHub Issues
- Location: `src/privacy/index.njk:90` → `src/support/index.njk:22-24`.
- Evidence: the policy's Contact section (deliberately email-free, test-enforced) sends privacy requesters to a page that leads with "GitHub Issues are the primary support route" — a public tracker where personal data should not go. The deletion page itself correctly routes straight to email.
- Status: Confirmed (new finding).
- Recommendation: one routing sentence on the support page (privacy and deletion requests should use email, not public Issues); keeps the no-email-on-privacy-page test intact.
- Effort: S

#### PRIV-10 · Low · "Data PumpSync handles" is one 66-word run-on sentence with the hosted-only qualifier buried mid-list
- Location: `src/privacy/index.njk:27`.
- Evidence: ~12 data categories in a single sentence; "when the user chooses PumpSync Hosted" ambiguously scopes the first item but reads as if it might scope the list. This is the single most-read disclosure on the policy.
- Status: Confirmed.
- Recommendation: convert to a bulleted list grouped by "always" / "hosted only" / "during a sync request only".
- Effort: S

#### PRIV-11 · Discussion · Explicit CCPA not-applicable note and conditional EEA legal-basis one-liner
- Location: `src/privacy/index.njk` (Sharing/Contact area).
- Evidence: the substantive CCPA claim already exists ("PumpSync does not sell user data"); an indie under the CCPA thresholds is genuinely out of scope, and saying so with the rationale is a trust move, not an obligation; an EEA legal-basis sentence matters only if EEA storefronts are targeted.
- Recommendation: owner's call.

#### PRIV-12 · Medium · The wiki reproduces privacy-policy sentences verbatim, violating the repo's own canonical-copy rule
- Location: wiki `App-Store-and-Privacy.md:35,44-49,68-70` vs `src/privacy/index.njk:39,50,80`; rule at `AGENTS.md:28`.
- Evidence: the backend non-persistence sentence, the medical disclaimer pair, and the backend-storage list appear word-for-word in the wiki; AGENTS.md says the website is the canonical published source and forbids competing copies. Verbatim copies drift silently — exactly what `5ea6b02` fixed in the other direction. The wiki's `Privacy-Policy.md` models the correct links-only pattern.
- Status: Confirmed.
- Recommendation: replace the wiki's verbatim policy sentences with links to `/privacy/` plus implementation-only detail.
- Effort: S

### 3.6 Data deletion (DEL)

#### DEL-01 · Medium · Circular dependency: the without-app deletion path requires the Installation ID, which exists only inside the installed app
- Location: `src/privacy/data-deletion/index.njk:60-61`.
- Evidence: the fallback for users who cannot use the app says to find the ID in the app (Settings → Developer); the ID is a UUID stored only in `UserDefaults` (`AuthService.swift:50-55`) — permanently lost on app deletion, regenerated on reinstall, and surfaced nowhere outside the app (verified across all Swift sources: only `DeveloperView.swift:14-26` and the prefilled deletion email).
- Status: Verified — downgraded from High: deletion is under-documented rather than broken (a user can still email support and be resolved via App Store transaction info, which the site itself says keys hosted state), the affected records are minimal pseudonymous non-health metadata, and the 5.1.1(v) account-deletion citation is inapposite for a no-accounts product.
- Recommendation: add a capture-before-delete instruction ("copy your Installation ID before deleting the app") and a documented fallback for hosted subscribers (App Store purchase/original-transaction reference via the support email).
- Effort: S

#### DEL-02 · Medium · Subscription cancellation is never addressed site-wide; the deletion page names the subscription in its scope but never says billing continues
- Location: `src/privacy/data-deletion/index.njk:50-64`; zero occurrences of "cancel" in `src/`.
- Evidence: a page titled "Account and Data Deletion" that covers "hosted server-side metadata associated with the subscription" invites the assumption that the paid service ends; it does not, and Apple's manage-subscriptions page is never linked.
- Status: Verified — downgraded from High: the app itself ships a first-class cancellation path (`SettingsView.swift:588-690` presents `AppStore.showManageSubscriptions`), so this is a billing-transparency gap on a supplementary page rather than a trap.
- Recommendation: one paragraph: deleting the app or requesting metadata deletion does not cancel the auto-renewable subscription; cancel in iOS Settings → Apple Account → Subscriptions, linking Apple's manage-subscriptions support page.
- Effort: S

#### DEL-03 · Medium · No processing timeline and no confirmation-to-requester commitment
- Location: `src/privacy/data-deletion/index.njk:50-64`.
- Evidence: the page specifies how to request and what is covered, but never when it will be processed or that the requester will be told when it is done.
- Status: Confirmed.
- Recommendation: "requests are processed within 30 days and you will receive an email confirmation when deletion completes" (or the true figures).
- Effort: S

#### DEL-04 · Low · Identity verification is never named as such — the Installation ID is the de facto verifier
- Location: `src/privacy/data-deletion/index.njk:59-61`.
- Evidence: the ID is framed purely as a lookup key; nothing tells the user this is how the request is verified and that no other personal information is needed — relevant reassurance for a service that deliberately holds no identifying account data.
- Status: Confirmed.
- Recommendation: one sentence naming the ID as the verifier and stating nothing else should be sent.
- Effort: S

#### DEL-05 · Low · "Hosted metadata" is never itemized on the deletion page, so users are asked to delete something the page never enumerates
- Location: `src/privacy/data-deletion/index.njk:14,63` vs the itemization at `src/privacy/index.njk:50`.
- Evidence: with "does not persist" claimed four times site-wide, the "Delete Data Request" needs its object to be legible; the item list exists only on the other page. (The backend deletion flow itself is real — an operator CLI exists per the wiki.)
- Status: Confirmed.
- Recommendation: add the one-line list or link the policy's Backend storage section so the "nothing stored" claims and the deletion flow visibly reconcile.
- Effort: S

### 3.7 Accessibility statement (ACC)

#### ACC-01 · Medium · No conformance standard or target level is claimed — "WCAG" appears nowhere on the site
- Location: `src/accessibility/index.njk:20-24`.
- Evidence: the page lists supported areas and honestly declines to over-claim ("This page avoids claiming a feature is fully verified until release testing confirms it") but names no standard to verify against; the app repo already has the measurement framework (`docs/app-store/accessibility.md`).
- Citation: W3C WAI accessibility-statement norms.
- Status: Confirmed.
- Recommendation: add a target claim that preserves the honest stance: "PumpSync targets WCAG 2.2 Level AA; conformance will be verified against the shipped build during release testing."
- Effort: S

#### ACC-02 · Medium · The statement scopes only the iOS app; the website's own accessibility is never addressed
- Location: `src/accessibility/index.njk:10-47`.
- Evidence: every section describes SwiftUI/VoiceOver/Dynamic Type behavior; no sentence covers the site the statement lives on — a deliberately simple static site that could make strong claims cheaply (this review's results can seed them).
- Citation: W3C WAI accessibility-statement norms.
- Status: Confirmed.
- Recommendation: add a short "This website" section: static HTML/CSS, no JavaScript, semantic landmarks, skip link, same reporting route.
- Effort: S

#### ACC-03 · Low · Missing statement elements: known-limitations list, statement date, response-time commitment
- Location: `src/accessibility/index.njk:20-47`.
- Evidence: the not-yet-verified stance implies limitations but names none; no prepared/last-reviewed date; the report section makes no response commitment. (The EU enforcement-procedure element is legitimately N/A for an indie and is not demanded.)
- Status: Confirmed.
- Recommendation: add a short known-limitations list, a "Statement last reviewed" date, and a soft response commitment.
- Effort: S

### 3.8 Age suitability (AGE)

#### AGE-01 · Medium · No expected numeric App Store age rating is stated
- Location: `src/age-suitability/index.njk:41-44`.
- Evidence: the App Review context section hedges ("may reflect health-data handling…") without a number; Apple's questionnaire category for Medical/Treatment Information typically yields 12+.
- Status: Confirmed.
- Recommendation: "Based on Apple's rating questionnaire (medical/treatment information), PumpSync's expected App Store age rating is 12+; the final rating is assigned by Apple at release."
- Effort: S

#### AGE-02 · Low · The only policy page whose body contains no contact path
- Location: `src/age-suitability/index.njk:10-47`.
- Evidence: zero links in the page body; every sibling policy page links support or email.
- Status: Confirmed.
- Recommendation: one closing sentence linking `/support/` for age, supervision, or suitability questions.
- Effort: S

#### AGE-03 · Discussion · Caregiver framing could be one sentence stronger given T1D demographics
- Location: `src/age-suitability/index.njk:35-39`.
- Evidence: the parents section treats minors as an edge case to authorize; a caregiver syncing a child's pump data is a mainstream use case for this exact product.
- Recommendation: owner's call — e.g. "Caregivers may run PumpSync on behalf of a child using the caregiver's own device and subscription, provided they are authorized on the Tandem Source account" (dovetails with PRIV-02).

### 3.9 Terms & licensing (POL)

#### POL-01 · High · Terms of Use are absent site-wide despite an auto-renewable subscription — while a finished ToU sits unpublished in the app repo
- Location: `src/_includes/layouts/base.njk:50-56` (no Terms link; zero "terms" matches in `src/`); `pumpsync/docs/legal/terms-of-use.md`.
- Evidence: a complete ToU (effective 2026-06-18, with medical-disclaimer, liability-limitation, acceptable-use, and deletion sections) exists in the app repo, whose own `docs/legal/README.md` calls it "repo-local material that isn't published elsewhere" — while `AGENTS.md:28` declares the website "the canonical, published source for anything a user reads" and the site sells the hosted subscription. The unpublished ToU's Contact section has also drifted (points at "the App Store product page" instead of the website). The paid hosted health-data service's own liability and medical terms currently bind no one.
- Citation: Apple App Review 3.1.2 (Apple's standard EULA can cover the store listing; the site-side gap is the finding).
- Status: Verified.
- Recommendation: publish `terms-of-use.md` as `/terms/` in the site's layout, add it to the footer Policies group and the test suite, fix its Contact section to point at `/support/`, and use the URL in App Store Connect.
- Effort: M

#### POL-02 · Low · "Source-available / All Rights Reserved" is the entire licensing statement, with no license page or link
- Location: `src/_includes/layouts/base.njk:77`.
- Evidence: the two phrases pull in opposite directions for a reader (you may look / you may not use?), and self-hosting is an advertised product mode — what users may legally do with the source is a real question the site never answers.
- Status: Confirmed.
- Recommendation: link the footer phrase to the repository LICENSE or a short `/license/` note covering what self-hosters may do.
- Effort: S

### 3.10 SEO, social & manifest (SEO)

#### SEO-01 · Medium · No `og:image`, `og:image:alt`, `twitter:card`, or `og:locale` anywhere — link previews render text-only site-wide
- Location: `src/_includes/layouts/base.njk:16-22`.
- Evidence: all seven pages emit the same partial five-tag og set; no image card for iMessage/Slack/social previews of the App Store support/privacy URLs, despite a 1024×1024 icon shipping in assets.
- Status: Confirmed.
- Recommendation: one static 1200×630 social card (icon on the brand gradient suffices) plus `og:image` (absolute URL), `og:image:alt/width/height`, `twitter:card: summary_large_image`, optionally `og:locale`.
- Effort: M (needs one piece of artwork)

#### SEO-02 · Low · No `<meta name="theme-color">` despite the manifest declaring `#006fbd`, and no dark variant
- Location: `src/_includes/layouts/base.njk` head; `src/manifest.webmanifest`.
- Evidence: browser-chrome tinting is left to defaults in both schemes on a site that is otherwise fully dark-mode aware.
- Status: Confirmed.
- Recommendation: paired `theme-color` metas — `#006fbd` for light, `#081724` (dark `--surface`) for dark.
- Effort: S

#### SEO-03 · Low · Meta descriptions on the five inner pages are 28–55 characters — well below the 110–160 sweet spot
- Location: front matter of the five inner pages (`privacy` is 28 chars: "Privacy policy for PumpSync.").
- Evidence: all present, unique, and accurate — just thin, so search engines will synthesize their own snippets. Home (99) is acceptable.
- Status: Confirmed.
- Recommendation: enrich each to ~110–155 chars stating what the page actually answers (e.g. privacy: name the no-persistence guarantee).
- Effort: S

#### SEO-04 · Nit · Home title "PumpSync" spends none of its budget on what the product is
- Location: `src/index.njk:3`.
- Evidence: all other pages follow a clean "Page | PumpSync" pattern; the home `<title>`/og:title is the bare name.
- Status: Confirmed.
- Recommendation: consider "PumpSync — Tandem Source to Apple Health Sync" for home only.
- Effort: S

#### SEO-05 · Nit · Hand-maintained sitemap has no `<lastmod>`
- Location: `src/sitemap.xml`.
- Evidence: entries exactly match the six public routes (verified, zero drift today); `lastmod` is optional and a hand-maintained date would go stale — acceptable as-is; only worth changing if the sitemap becomes generated (TEST-02).
- Status: Confirmed.
- Effort: S

#### SEO-06 · Discussion · JSON-LD `SoftwareApplication` structured data vs the no-runtime-JS rule
- Location: absent; `AGENTS.md:16`.
- Evidence: a JSON-LD block is inert data browsers never execute, so it arguably honors the rule's intent — but it is literally a `<script>` tag in a codebase whose identity is "zero JS", and the SEO upside for a 7-page support site is modest.
- Recommendation: owner's call; if adopted, one static block on home only, and amend AGENTS.md to say "no *executable* runtime JavaScript".

#### SEO-07 · Low · Manifest is minimal: no `description`/`id`/`scope`, no maskable icon variant, and `display: standalone` overpromises
- Location: `src/manifest.webmanifest`.
- Evidence: icons lack a `purpose: "maskable"` variant (Android launchers may crop unpredictably); `standalone` gives add-to-home-screen users a chromeless webview of a 6-page site with no offline support. Both icon files exist at their declared sizes (verified).
- Status: Confirmed.
- Recommendation: add `description`, `"id": "/"`, `"scope": "/"`, a maskable icon variant (after checking safe-zone padding), and consider `display: "browser"`. Note `test/site.test.mjs:64-67` deep-equals the manifest icons and must be updated alongside.
- Effort: S

### 3.11 Performance & assets (PERF)

#### PERF-01 · Medium · A 917 KB 1024×1024 PNG is loaded in the sticky header of every page to paint a 36×36 logo — 99.4% of first-visit transfer
- Location: `src/_includes/layouts/base.njk:29`; asset `src/assets/pumpsync-app-icon.png`.
- Evidence: 917,158 bytes, 1024×1024 (verified twice), incompressible by gzip; the heaviest route totals 922 KB of which everything except the logo is ~12 KB (HTML ~2.5 KB gzipped + CSS 2,825 B gzipped). Measured remediation: a 72×72 Lanczos resize of the same art is 7,274 bytes — 126× smaller; swapping it drops the heaviest route by 98.6%.
- Status: Verified — downgraded from High by the adversarial pass: it is neither a WCAG failure nor a privacy gap under this review's rubric, causes no broken behavior or layout shift, and the cost is paid once then cached; it remains the single highest-leverage one-line fix in the report (the site is otherwise an exemplary performance baseline).
- Recommendation: export a 72×72 (2×) or 108×108 (3×) PNG into `src/assets` and point `base.njk:29` at it, keeping `width`/`height`; add `decoding="async"` (PERF-03) in the same edit; update the hard-coded test assertion (TEST-06) in the same commit.
- Effort: S

#### PERF-02 · Low · `icon-512.png` (276 KB) and the 1024px source have measured lossless optimization headroom
- Location: `src/assets/icon-512.png`, `src/assets/pumpsync-app-icon.png` (manifest-only after the PERF-01 fix).
- Evidence: Pillow lossless re-encode alone: 512px → 221,986 B (−19.6%), 1024px → 701,451 B (−23.5%); dedicated optimizers (oxipng/zopflipng) typically do better. Fetched only on manifest install, so impact is minor.
- Status: Confirmed.
- Recommendation: one `oxipng -o max` pass over `src/assets/*.png`, bundled with the PERF-01 commit.
- Effort: S

#### PERF-03 · Nit · Header logo `<img>` lacks a `decoding` attribute (eager load itself is correct)
- Location: `src/_includes/layouts/base.njk:29`.
- Evidence: as an above-the-fold image on every page, eager is right and `width`/`height` already prevent layout shift (credit); only `decoding="async"` is worth adding. Do not add `loading="lazy"`.
- Status: Confirmed.
- Effort: S

### 3.12 Links (LINK)

#### LINK-01 · Low · Four external destinations and the production domain could not be verified from this environment
- Location: footer links to `ericslutz.dev`, `tandemdiabetes.com/`, `apple.com/ios/health/`; canonical domain `pumpsync.ericslutz.dev`.
- Evidence: the egress proxy denies CONNECT to these hosts (`connect_rejected` policy denial, confirmed via proxy status) — these are **not** broken links, they are unverifiable from the review environment. All five `github.com` destinations were verified live (repo 200, issues 200, new-issue 302-to-login as normal, wiki and discussions confirmed enabled via the API). Internal links: 15/15 resolve, zero broken fragments, no real orphans.
- Status: Unverifiable-from-env.
- Recommendation: spot-check the four URLs and the production domain (DNS, TLS, Pages "Enforce HTTPS") from an unrestricted network; all are long-stable root URLs, so risk is minimal.
- Effort: S

### 3.13 Security & workflow (SEC)

#### SEC-01 · Low · GitHub Actions pinned to mutable major tags, not commit SHAs
- Location: `.github/workflows/pages.yml:26-39`.
- Evidence: `checkout@v6`, `setup-node@v6`, `configure-pages@v6`, `upload-pages-artifact@v5`, `deploy-pages@v5` — all first-party, and workflow permissions are already least-privilege (credit), but major tags are mutable in a workflow holding `pages: write` + `id-token: write`.
- Status: Confirmed.
- Recommendation: SHA-pin with version comments (OpenSSF practice) and let Dependabot's github-actions ecosystem keep them fresh.
- Effort: S

#### SEC-02 · Discussion · GitHub Pages cannot set custom response headers — CSP, X-Content-Type-Options, Referrer-Policy, and Pages-side HSTS are unavailable by platform
- Location: platform constraint (Pages + custom domain).
- Evidence: with zero JS, no forms, no cookies, and 65/65 `target="_blank"` links carrying `noopener noreferrer`, the practical risk is low.
- Recommendation: owner's decisions — (1) confirm "Enforce HTTPS" is enabled in Pages settings; (2) a `<meta http-equiv="Content-Security-Policy">` is possible but marginal for a no-JS site and cannot express `frame-ancestors` — reasonable to skip; (3) if headers ever matter, that is a hosting migration, not a code fix.

#### SEC-03 · Nit · Node version unpinned for contributors: CI uses Node 24, no `engines` field or `.nvmrc`
- Location: `.github/workflows/pages.yml:29`; `package.json`.
- Status: Confirmed.
- Recommendation: add `"engines": { "node": ">=22" }` or an `.nvmrc`.
- Effort: S

### 3.14 Test-suite coverage (TEST)

#### TEST-01 · Medium · No test asserts a root `_site/404.html` exists — the exact gap that let HTML-01 ship
- Location: `test/site.test.mjs:25-39` (the string "404" appears nowhere in the file).
- Status: Confirmed.
- Recommendation: `test("custom 404 page is emitted at the site root for GitHub Pages", …)` reading `_site/404.html` and matching `/Page not found/` — fails today, passes with the HTML-01 fix.
- Effort: S

#### TEST-02 · Medium · No sitemap ↔ built-routes parity test, though the sitemap is a hand-maintained passthrough file
- Location: `test/site.test.mjs` (sitemap never read); `src/sitemap.xml`.
- Evidence: zero drift today (verified), but the next added page can silently be missing from it.
- Status: Confirmed.
- Recommendation: extract `<loc>` values and assert a bijection with built public pages (404 excluded).
- Effort: S

#### TEST-03 · Low · No test asserts meta-description or og-tag presence, so the head contract is unguarded
- Location: `test/site.test.mjs:98-112` (canonical is the only head metadata tested).
- Evidence: `base.njk` renders description/og only when front-matter keys exist — deleting a front-matter line ships a silently degraded head.
- Status: Confirmed.
- Recommendation: extend the canonical loop with `<meta name="description"` and `og:title` asserts; post-HTML-01, assert 404.html has neither canonical nor og.
- Effort: S

#### TEST-04 · Low · No HTML-validity or accessibility smoke test in CI
- Location: `package.json` (only dep: Eleventy); `pages.yml`.
- Evidence: the only pre-deploy gate is the regex-based content tests; this review's validator findings (HTML-02) would have been caught by html-validate. Weigh against the repo's minimal-dependency posture — html-validate alone is the 80/20.
- Status: Confirmed.
- Effort: M

#### TEST-05 · Low · Nav test is an order-sensitive `deepEqual` over exact markup
- Location: `test/site.test.mjs:41-51`.
- Evidence: reordering nav items or adding an attribute fails the test even when the links remain correct.
- Status: Confirmed.
- Recommendation: if the nav is a deliberate fixed contract, add a comment saying so; otherwise assert set-membership.
- Effort: S

#### TEST-06 · Low · Icon test hard-codes the exact header `<img>` tag, blocking the PERF-01 fix until updated
- Location: `test/site.test.mjs:63`.
- Evidence: swapping the asset or adding `decoding="async"` fails the byte-for-byte regex.
- Status: Confirmed.
- Recommendation: loosen to assert src + empty alt + width/height presence; update in the same commit as PERF-01.
- Effort: S

#### TEST-07 · Discussion · Two tests encode deliberate editorial policy, not correctness — label them so future fixers don't "fix" the content
- Location: `test/site.test.mjs:122-128` (no email on the privacy page) and `:142-156` (platform-neutral language ban).
- Recommendation: one-line intent comments above each ("deliberate: privacy contact routes through /support/", "deliberate: platform-neutral language") so the intent survives contributor turnover.

## 4. Positive observations

- **Semantic and accessibility fundamentals are genuinely strong.** Across 7 pages × 2 color schemes, axe found exactly one violation site-wide; all four policy pages are completely clean. Every page has one `<main id="main">`, one banner, one contentinfo, uniquely labeled nav landmarks, one h1, a unique title, description, and correct canonical.
- **The skip link is done right** — first tab stop everywhere, visible on focus, correct `:focus` reveal pattern — and tab order matches visual order with no positive tabindex anywhere.
- **Focus indicators are big and offset** (3px outline + 3px offset) in both schemes — once DES-03's light-mode color is fixed, this is a model implementation.
- **Dark mode is a first-class variant, not an afterthought**: full token remap including shadows and focus color, `color-scheme: light dark` declared, no seams; forced-colors mode also largely survives (buttons, links, current-page cue all intact).
- **Responsive reflow is fundamentally sound**: 84 page/width/scheme combinations produced exactly one page-level overflow (DES-02), and the deletion page's long mailto/subject strings wrap cleanly at 320px.
- **Zero runtime JavaScript, verified** — 0 `<script>` tags in the built site — plus one 2.8 KB (gzipped) stylesheet and ~2 KB gzipped HTML per page: everything except the header logo is an exemplary performance baseline.
- **The most legally important sentences are exactly right**: the privacy policy's non-persistence enumeration matches the wiki ground truth verbatim, and all three in-app deletion UI paths quoted on the deletion page match the shipped SwiftUI labels word-for-word (`"Tandem Account"`, `"Remove Credentials"`, `"Data Handling"`, `"Delete Data Request"`, `"Developer"`/`"Installation ID"`) — commit `5ea6b02`'s correction is holding.
- **The deletion email contract is consistent**: the page's do-not-include warning and the `DELETION REQUEST - PumpSync Support` subject match the app's prefilled email almost word-for-word.
- **Apple 5.1.1(i)/5.1.2/5.1.3 core substance is present**: data categories, per-section use, retention/deletion sections, named third parties with a processor framing, explicit no-sale and no-HealthKit-advertising sentences, and an honest Apple Health residue caveat.
- **The reviewer walkthrough passes cleanly**: from `/support/`, the privacy policy, deletion instructions, and age page are each one click; two contact methods are zero clicks.
- **Supply-chain hygiene**: `npm audit` clean in both modes (after deliberate overrides in `3165f75`), least-privilege workflow permissions, deploy gated on the full test suite, `.nojekyll`/CNAME/robots/sitemap all correct, 100% `noopener noreferrer` coverage (65/65), and a secrets sweep found only prose mentions.
- **The accessibility page's honesty** ("avoids claiming a feature is fully verified until release testing confirms it") is unusual and creditable pre-release — it just needs a target standard to anchor it (ACC-01).
- **Zero spelling errors** across all seven rendered pages.

## 5. Discussion items (owner decisions, not defects)

1. **Platform naming (COPY-10):** the test-enforced iOS-word ban vs users' ability to learn the app is iPhone-only. A single allowed sentence would resolve it.
2. **Terms placement (POL-01 execution):** publish the existing ToU at `/terms/` — the finding is High, but how (and whether to also link Apple's standard EULA) is a choice.
3. **"Account and" in the deletion page title (COPY-11).**
4. **Demo mode on the site (COPY-12):** currently omitted, defensibly; an FAQ link with the test-device warning is the middle path.
5. **CCPA/EEA one-liners (PRIV-11).**
6. **Footer landmark/heading verbosity (DES-19)** and **display type scale (DES-20).**
7. **JSON-LD vs the no-JS identity (SEO-06).**
8. **Meta-CSP and hosting-level headers (SEC-02).**
9. **Caregiver framing on the age page (AGE-03).**
10. **Policy-encoding tests need intent comments (TEST-07).**

## 6. Remediation plan

Executable batches; each item lists finding IDs, files, the concrete change, and its acceptance check.
Batches are ordered by user impact per unit effort; items within a batch are independent unless noted.

### Batch 1 — Rendering and WCAG fixes (all S effort, ~1 session)

| # | IDs | Files | Change | Acceptance |
|---|---|---|---|---|
| 1.1 | DES-01, DES-20 | `src/assets/styles.css` | Remove `max-width: 9ch` from `h1`; retune h1 clamps (desktop ≤ ~6.4rem max, mobile `clamp(2.4rem, 13vw, 4rem)`); add `minmax(0, …)` to `.hero-content` columns | Playwright: h1 `scrollWidth ≤ clientWidth` and no viewport clip at 320/375/390/1440/1680 with a forced DejaVu/Liberation fallback font |
| 1.2 | DES-02 | `src/assets/styles.css` | `.page-hero h1` clamp floor → 2.2rem; add global `overflow-wrap: break-word` + `hyphens: auto` on headings | `/accessibility/` at 320px: `documentElement.scrollWidth === 320` |
| 1.3 | DES-03 | `src/assets/styles.css` | Light-scheme focus `outline-color` → `var(--teal-dark)` (keep `#6ad7ff` dark) | Computed ratio ≥ 3:1 on `#ffffff`, `#f1f8ff`, `#e4f7ff` (6.88/6.43/6.13 with #005aab) |
| 1.4 | DES-04 | `src/assets/styles.css` | Button-specific gradient `linear-gradient(135deg, #0a8579 0%, #007a99 45%, #0147a8 100%)` on `.button.primary/.dark` | White ≥ 4.5:1 vs every stop (4.52/4.95/8.51) |
| 1.5 | HTML-01, TEST-01 | `src/404.njk`, `test/site.test.mjs` | Add `permalink: "404.html"`; delete the `canonical` front-matter key; add root-404 guard test | `npm test` green including new test; `ls _site/404.html` succeeds; built 404 has no canonical/og |
| 1.6 | PERF-01, PERF-02, PERF-03, TEST-06 | `src/assets/`, `src/_includes/layouts/base.njk:29`, `test/site.test.mjs:63` | Add 72×72 (or 108×108) logo PNG; point the header `<img>` at it + `decoding="async"`; oxipng pass over remaining PNGs; loosen the icon test | Heaviest route first-visit < 30 KB; `npm test` green |
| 1.7 | DES-05, DES-13, HTML-02 | `src/index.njk` | Sync card → `<ol>` with `<li>` + `<strong>` titles (not h3); `role="group"` or drop `aria-label` on the card | axe: 0 violations on `/`; vnu: 0 errors site-wide |

### Batch 2 — Policy and accuracy corrections (single editing pass over the four policy pages + support/home, then bump "Last updated")

| # | IDs | Files | Change |
|---|---|---|---|
| 2.1 | COPY-01 | `src/privacy/index.njk:14`, `src/support/index.njk:41`, `src/age-suitability/index.njk:22`, `src/index.njk:54` | Reword sync-trigger claims to disclose app-open and daily background syncs (mirror `SyncView.swift:33`) |
| 2.2 | COPY-02 | `src/privacy/data-deletion/index.njk:40-44` | Verify on-device and align the Health revocation path with the app's instruction (Settings → Privacy & Security → Health) |
| 2.3 | DEL-01, DEL-04 | `src/privacy/data-deletion/index.njk:59-61` | Capture-before-delete note; no-app fallback via App Store purchase info; name the Installation ID as the verifier |
| 2.4 | DEL-02 | `src/privacy/data-deletion/index.njk` | Paragraph: deletion ≠ cancellation, link Apple manage-subscriptions |
| 2.5 | DEL-03, DEL-05 | `src/privacy/data-deletion/index.njk` | 30-day processing + confirmation commitment; itemize (or link) what "hosted metadata" is |
| 2.6 | PRIV-02, AGE-03 | `src/privacy/index.njk`, `src/age-suitability/index.njk` | Children's-privacy paragraph + cross-link; optional caregiver sentence |
| 2.7 | PRIV-03, PRIV-04, PRIV-05, PRIV-06, PRIV-07, PRIV-08 | `src/privacy/index.njk` | Rights sentence; retention honesty sentence (or backend cleanup); controller line; "This website" section; region sentence; exhaustive per-provider roles |
| 2.8 | PRIV-09 | `src/support/index.njk` | Route privacy/deletion requests to email, not public Issues (keep the no-email-on-privacy test intact) |
| 2.9 | ACC-01, ACC-02, ACC-03 | `src/accessibility/index.njk` | WCAG 2.2 AA target claim; "This website" scope section; known-limitations + statement date + response commitment |
| 2.10 | AGE-01, AGE-02 | `src/age-suitability/index.njk` | Expected 12+ rating sentence; closing support link |
| 2.11 | POL-01, POL-02 | new `src/terms/index.njk`, `base.njk` footer, `test/site.test.mjs`, `src/sitemap.xml` | Publish the app repo's `terms-of-use.md` as `/terms/` (fix its Contact section); link footer + sitemap + tests; link the license phrase |
| 2.12 | PRIV-01 | both policy pages | Add "Last updated" lines; bump for this batch |
| 2.13 | PRIV-12 | wiki `App-Store-and-Privacy.md` | Replace verbatim policy sentences with links to `/privacy/` |
| 2.14 | COPY-05, COPY-06, COPY-07 | `src/privacy/index.njk:45`, `src/index.njk:79`, `src/support/index.njk:41` | Add "tracking"; restore "medical advice"; replace the sync-flow hedge with the per-permission caveat |

### Batch 3 — Copy consolidation and voice

| # | IDs | Files | Change |
|---|---|---|---|
| 3.1 | COPY-03 | new `src/_data/claims.json`, all six content templates, `test/site.test.mjs` | Canonical-claims data file; render repeated sentences from it; guard test |
| 3.2 | COPY-04, PRIV-10 | `src/index.njk`, `src/privacy/index.njk:27` | Plain-language hero/fact-list rewrite; bulleted always/hosted-only/during-sync data list |
| 3.3 | COPY-08, COPY-09, SEO-03, SEO-04 | `README.md:14`, deletion/support pages, five front matters | README fix; "Beta and TestFlight"; support sentence; enriched descriptions; home title |

### Batch 4 — Design polish, meta, and test hardening

| # | IDs | Files | Change |
|---|---|---|---|
| 4.1 | DES-06, DES-07, DES-08, DES-09, DES-10, DES-11, DES-12, DES-14 | `src/assets/styles.css`, `base.njk` | Button border ≥3:1; non-sticky (or single-row) mobile header; left-align content column; motion-free hover cue; forced-colors-safe bullets; `@media print` block; `scroll-padding-top`; footer `aria-current` |
| 4.2 | CSS-01…CSS-06 | `src/assets/styles.css` | rem-based body size; drop-or-self-host Inter; color-mix fallbacks; 70ch measure; delete dead tokens; tokenize shadows/hero |
| 4.3 | SEO-01, SEO-02, SEO-07 | `base.njk`, new social-card asset, `manifest.webmanifest` | Social card + og:image/twitter tags; theme-color pair; manifest fields + maskable icon |
| 4.4 | TEST-02…TEST-05, SEC-01, SEC-03, DES-15…DES-18 | `test/site.test.mjs`, `pages.yml`, `package.json`, `styles.css` | Sitemap parity + head-metadata tests; html-validate in CI; nav-test comment; SHA-pin actions; engines field; optional nits |

## Appendix A — Contrast matrix (computed, WCAG relative luminance)

| Result | Ratio | Min | Pair |
|---|---|---|---|
| PASS | 15.86:1 | 4.5 | light: ink `#0b2438` on white |
| PASS | 5.68:1 | 4.5 | light: body-soft `#506a7d` on white |
| PASS | 5.30:1 | 4.5 | light: body-soft on alt `#f1f8ff` |
| PASS | 5.15:1 | 4.5 | light: body-soft on tint `#e4f7ff` |
| PASS | 6.88:1 | 4.5 | light: link `#005aab` on white |
| PASS | 6.43:1 | 4.5 | light: link on alt `#f1f8ff` |
| PASS | 5.24:1 | 4.5 | light: hover link `#006fbd` on white |
| FAIL | 2.75:1 | 3 | light: focus ring `#00a9d6` on white (SC 1.4.11) → DES-03 |
| FAIL | 2.56:1 | 3 | light: focus ring on alt `#f1f8ff` (SC 1.4.11) → DES-03 |
| FAIL | 2.13:1 | 4.5 | white on gradient stop `#08c7b7` (button) → DES-04 |
| FAIL | 3.63:1 | 4.5 | white on gradient stop `#008fcb` (button) → DES-04 |
| PASS | 8.51:1 | 4.5 | white on gradient stop `#0147a8` |
| FAIL | 1.37:1 | 3 | light: border `#cddfec` on white (SC 1.4.11) → DES-06 |
| PASS | 6.33:1 | 4.5 | light: sync-icon glyph on resolved tile |
| PASS | 16.95:1 | 4.5 | dark: ink `#eef9ff` on `#081724` |
| PASS | 10.01:1 | 4.5 | dark: body-soft `#aac4d8` on `#081724` |
| PASS | 9.05:1 | 4.5 | dark: body-soft on alt `#0c2133` |
| PASS | 13.08:1 | 4.5 | dark: link `#8fe8ff` on `#081724` |
| PASS | 11.03:1 | 3 | dark: focus ring `#6ad7ff` on `#081724` |
| FAIL | 2.13:1 | 4.5 | dark: white on gradient stop `#08c7b7` (gradient not overridden in dark) → DES-04 |

Notes: the two "link vs adjacent soft text" rows (1.21:1 light / 1.31:1 dark) are **not** SC 1.4.1 failures — prose links keep their computed underline in both schemes (verified), and underline-free nav/footer links sit inside labeled nav landmarks; resolved `color-mix()` surfaces all pass where text-bearing (header nav 5.68/10.01, sync-icon 6.35/5.67).

## Appendix B — axe rule-by-page matrix

| Route | Violations (light = dark) | Incomplete |
|---|---|---|
| `/` | `heading-order` ×1 (moderate) | `aria-prohibited-attr` ×1, `color-contrast` ×14 (gradient nodes → resolved in Appendix A) |
| `/support/` | none | `color-contrast` ×1 (primary button) |
| `/privacy/` | none | none |
| `/privacy/data-deletion/` | none | none |
| `/accessibility/` | none | none |
| `/age-suitability/` | none | none |
| `/404/` | none | `color-contrast` ×1 (`.button.dark`) |

Rulesets: wcag2a, wcag2aa, wcag21aa, wcag22aa, best-practice; both color schemes; Chromium 1280×900.

## Appendix C — Duplication matrix (summary; drift verdicts)

| Claim family | Instances | Wordings | Drift verdict |
|---|---|---|---|
| Backend non-persistence | 7 (`index:14,36`, `support:53`, `privacy:14,39,51`, `deletion:14`) | 5 | No contradictions; enumerative drift only; `privacy:39` is canonical (matches wiki verbatim) |
| Medical disclaimer | 6 (`base:76`, `privacy:80`, `support:61`, `index:78-79`, `age:28,38`) | 5 | **Harmful at `index:79`** — drops "medical advice" under the title "Not medical advice" (COPY-06) |
| Keychain/device-only credentials | 5 (`index:29,63`, `support:49`, `privacy:32,75`) | 4 | Harmless |
| HealthKit-no-ads | 4 (`index:71`, `privacy:45,56`, `age:31`) | 4 | **Harmful direction** — the operative policy promises less than marketing (COPY-05) |
| Don't-send-sensitive-data | 3 (`support:33`, `accessibility:46`, `deletion:62`) | 3 | Mildly harmful — three different item lists; `deletion:62` matches the app's email and is canonical |
| "At the user's request" | 4 (`privacy:14`, `support:41`, `age:22`, `index:54`) | 3 | **Inaccurate vs app behavior** (COPY-01) |
| Self-hosted deletion | 2 (`index:93`, `deletion:68`) | 2 | Harmless |

## Appendix D — Reviewer walkthrough (from `/support/`, built HTML)

| Target | Path | Clicks | Result |
|---|---|---|---|
| Privacy policy | header/footer "Privacy" | 1 | PASS |
| Deletion instructions | FAQ inline link + footer "Data Deletion" | 1 | PASS |
| Working contact method | on-page mailto + Issue button | 0 | PASS (mailbox deliverability unverifiable from env) |
| Age-suitability info | footer "Age Suitability" | 1 | PASS |

## Appendix E — Asset weights and per-route transfer

| Asset | Bytes | Note |
|---|---:|---|
| `assets/pumpsync-app-icon.png` | 917,158 | 1024×1024; header of every page at 36 CSS px → PERF-01 |
| `assets/icon-512.png` | 276,178 | manifest only; lossless −19.6% measured |
| `assets/icon-192.png` | 41,654 | manifest only |
| `assets/apple-touch-icon.png` | 36,998 | |
| `assets/styles.css` | 10,237 | 2,825 B gzipped |
| favicons (ico+16/32/48) | 17,-ish K total | complete, sizes verified |

Per-route first-visit transfer: 921–923 KB, of which the logo is 99.4–99.6%; with a 72×72 logo (7,274 B measured) the heaviest route drops to ~12.6 KB.

## Appendix F — Adversarial verification log

| Finding | Initial | Verdict | Final |
|---|---|---|---|
| Hero clipping (DES-01) | Blocker/High (two agents) | Confirmed ×2; "not Blocker — Apple/Windows metrics likely fit by ~8px" | High |
| `/accessibility/` 320px overflow (DES-02) | High | Downgrade — one letter tail, recoverable scroll | Medium |
| Focus ring (DES-03) | High | Confirmed — ratios recomputed from scratch | High |
| Button gradient text (DES-04) | High | Confirmed — geometry spot-checked | High |
| 404 emission (HTML-01) | Blocker | Downgrade — only consequence is an unbranded error page | Medium |
| Sync-trigger accuracy (COPY-01) | High | Confirmed — refutations rejected | High |
| Terms of Use (POL-01) | High | Confirmed | High |
| Circular Installation ID (DEL-01) | High | Downgrade — under-documented, not broken; citation inapposite | Medium |
| Subscription cancellation (DEL-02) | High | Downgrade — app ships a first-class cancel path | Medium |
| Effective-date integrity (PRIV-01) | High | Downgrade — promise governs the unchanged privacy page; hygiene gap survives | Low |
| Header logo weight (PERF-01) | High | Downgrade — genuine and trivially fixable, but one-time cached cost is neither a WCAG nor a policy gap per the rubric | Medium |

No finding was refuted outright: all 12 Blocker/High candidates reproduced under independent re-measurement; 6 held their tier and 6 were recalibrated.
