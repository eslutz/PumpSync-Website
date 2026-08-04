# AGENTS.md

This file applies to the entire PumpSync Website repository.

## Purpose

This repository is the Eleventy source for the public PumpSync website at <https://pumpsync.ericslutz.dev>.

## Shared Website Pattern

- Keep this site aligned with the Gus and Blockiverse VR website repositories.
- Use Eleventy with Nunjucks templates from `src/` and plain generated HTML/CSS in `_site/`.
- Keep shared page chrome, metadata, navigation, and footer behavior in `src/_includes/layouts/base.njk`.
- Keep site styling in the existing stylesheet path for this repo.
- Use the shared house typefaces: [Mona Sans](https://github.com/github/mona-sans) for body copy and [Hubot Sans](https://github.com/github/hubot-sans) for display text (`h1`, `h2`, the header wordmark, the sync-step numerals). Self-host them from `src/assets/fonts/` and declare them with `@font-face` plus a `preload` link; never load fonts from a CDN, which would contradict the privacy policy's no-third-party-request claim. Both are SIL OFL 1.1 with Reserved Font Names, so ship them unmodified and keep `src/assets/fonts/OFL.txt` beside them. Always keep a system-font fallback stack after the family name so text renders before the woff2 arrives.
- Keep public routes slash-normalized in links and canonical URLs.
- Do not add executable runtime JavaScript unless a concrete user-facing requirement needs it. Inert `application/ld+json` structured data is allowed: browsers parse it as metadata and never execute it.
- Do not add visible App Store, TestFlight, or download links unless a real public URL exists.
- Do not publish literal support email addresses in README or AGENTS docs; state that email is secondary.
- Do not manually hard-wrap prose sentences in Markdown. Keep each sentence on one line and let the browser or editor wrap text.

## README Pattern

Keep `README.md` in this shared section order: title and public URL, Eleventy overview, `Site Structure`, `Routes`, `Support Intake`, `Local Development`, `Validation`, and `Deployment`.

## Documentation

- The shared PumpSync wiki at https://github.com/eslutz/PumpSync/wiki is the source of truth for narrative, setup, architecture, ownership, operations, testing, and cross-repository documentation.
- This website is the canonical, published source for anything a user reads — privacy policy, data deletion, support, accessibility, age suitability. The wiki and other repos link to these live pages; do not add a competing copy of that text to the wiki or elsewhere.
- Keep this repository focused on website-owned source files, route content, layout, styling, deployment workflow, and website-specific validation details.
- When a website change alters narrative/setup behavior described elsewhere (project setup, architecture, ownership, operations, testing), update the relevant wiki page in the local `PumpSync.wiki` checkout in the same change set. When it changes the public policy/support text itself, edit it here — that edit is the source of truth, nothing else needs to change in sync with it.

## Issues

Submit and reference bugs, feature requests, documentation issues, and website issues through the main PumpSync issues page: https://github.com/eslutz/PumpSync/issues.

## Local Development

Use `npm install` once, then `npm run start`. Open the local URL printed by Eleventy. Changes hot-reload.

## Validation

Run `npm test` before committing changes that affect source, routes, layout, metadata, or documentation.

## Deployment

Pushing to `main` triggers `.github/workflows/pages.yml`, builds the site, and deploys `_site/` to GitHub Pages. The custom domain is emitted through `src/CNAME`.

## Repository-Specific Facts

- Public URL: <https://pumpsync.ericslutz.dev>
- Custom domain file: `src/CNAME`
- Stylesheet: `src/assets/styles.css`
- Fonts: `src/assets/fonts/MonaSans.woff2`, `src/assets/fonts/HubotSans.woff2`, `src/assets/fonts/OFL.txt`
- Social card generator: `tools/social-card.py` (draws with the same two fonts; re-run it whenever the card's wording changes)
- Deployment workflow: `.github/workflows/pages.yml`
- Validation command: `npm test`
- Required routes: `/`, `/support/`, `/privacy/`, `/terms/`, `/privacy/data-deletion/`, `/accessibility/`, `/age-suitability/`
