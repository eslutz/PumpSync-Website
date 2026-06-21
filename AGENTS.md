# AGENTS.md

This file applies to the entire PumpSync Website repository.

## Purpose

This repository is the Eleventy source for the public PumpSync website at <https://pumpsync.ericslutz.dev>.

## Shared Website Pattern

- Keep this site aligned with the Gus and Blockiverse VR website repositories.
- Use Eleventy with Nunjucks templates from `src/` and plain generated HTML/CSS in `_site/`.
- Keep shared page chrome, metadata, navigation, and footer behavior in `src/_includes/layouts/base.njk`.
- Keep site styling in the existing stylesheet path for this repo.
- Keep public routes slash-normalized in links and canonical URLs.
- Do not add runtime JavaScript unless a concrete user-facing requirement needs it.
- Do not add visible App Store, TestFlight, or download links unless a real public URL exists.
- Do not publish literal support email addresses in README or AGENTS docs; state that email is secondary.
- Do not manually hard-wrap prose sentences in Markdown. Keep each sentence on one line and let the browser or editor wrap text.

## README Pattern

Keep `README.md` in this shared section order: title and public URL, Eleventy overview, `Site Structure`, `Routes`, `Support Intake`, `Local Development`, `Validation`, and `Deployment`.

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
- Deployment workflow: `.github/workflows/pages.yml`
- Validation command: `npm test`
- Required routes: `/`, `/support/`, `/privacy/`, `/privacy/data-deletion/`, `/accessibility/`, `/age-suitability/`
