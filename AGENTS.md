# Repository Guidelines

## Project Structure & Module Organization

This repository contains the public Eleventy website at `pumpsync.ericslutz.dev`. Nunjucks pages live in `src/`, shared layout and chrome in `src/_includes/layouts/base.njk`, and styles and self-hosted fonts in `src/assets/`. Tests are in `test/`; generated output goes to `_site/`. Public policy, support, accessibility, age-suitability, and data-deletion copy is canonical here.

## Build, Test, and Development Commands

```sh
npm install
npm run start      # development server on port 8766
npm run build      # clean and generate _site/
npm run lint:html  # validate generated HTML
npm test           # build, Node tests, and HTML validation
```

Use Node 22 or newer. Pushing `main` triggers `.github/workflows/pages.yml`; `src/CNAME` supplies the custom domain.

## Coding Style & Naming Conventions

Use two-space indentation in Nunjucks, JSON, CSS, and JavaScript. Keep shared metadata, navigation, and footer behavior in the base layout. Use kebab-case route directories and slash-normalized internal links. Keep Mona Sans and Hubot Sans self-hosted in `src/assets/fonts/`; do not introduce CDN font requests. Avoid runtime JavaScript unless a concrete user-facing requirement needs it.

## Testing Guidelines

Tests use Node’s built-in test runner plus `html-validate`. Name test files `*.test.mjs`. Add assertions for routes, metadata, accessibility, or content invariants when changing those areas. Run `npm test` and `git diff --check` before committing. Required public routes include `/`, `/support/`, `/privacy/`, `/terms/`, `/privacy/data-deletion/`, `/accessibility/`, and `/age-suitability/`.

## Commit & Pull Request Guidelines

Use short imperative commit subjects, with prefixes such as `fix:` or `docs:` when helpful. Keep generated `_site/` output out of commits unless repository policy changes. Pull requests should summarize public-facing changes, list validation, link relevant issues, and include desktop/mobile screenshots for visual changes.

## Security & Content

Do not add trackers, third-party requests, unpublished download links, credentials, or private support details. Keep narrative setup and architecture in the wiki; edit public policy text only here to avoid competing copies.

## Related Project Guides

- [iOS app](../PumpSync.frontend/AGENTS.md)
- [Backend](../PumpSync.backend/AGENTS.md)
- [Wiki](../PumpSync.wiki/AGENTS.md)
