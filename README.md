# PumpSync Website

Static public website for PumpSync at <https://pumpsync.ericslutz.dev>.

The site is built with [Eleventy](https://www.11ty.dev/) from Nunjucks templates in `src/`. Shared page chrome, navigation, footer links, and metadata live in `src/_includes/layouts/base.njk`. The output is plain HTML and CSS with no runtime JavaScript.

Project documentation lives in the [PumpSync wiki](https://github.com/eslutz/PumpSync/wiki). Submit bugs, feature requests, documentation issues, and website issues to the [main PumpSync issues page](https://github.com/eslutz/PumpSync/issues).

## Site Structure

- `src/index.njk` - home page.
- `src/_includes/layouts/base.njk` - shared layout, metadata, header, and footer.
- `src/assets/styles.css` - site styling.
- `src/assets/pumpsync-mark.svg` - website mark.
- `src/CNAME` - GitHub Pages custom domain.
- `src/robots.txt` and `src/sitemap.xml` - search metadata.
- `.github/workflows/pages.yml` - GitHub Pages deployment workflow.
- `test/site.test.mjs` - rendered output checks.

## Routes

- `/` - product overview.
- `/support/` - App Store support URL.
- `/privacy/` - App Store privacy policy URL.
- `/privacy/data-deletion/` - account and data deletion instructions.
- `/accessibility/` - accessibility disclosure URL.
- `/age-suitability/` - App Review age-suitability context.

## Support Intake

Submit bugs, feature requests, documentation issues, and website issues to the [main PumpSync issues page](https://github.com/eslutz/PumpSync/issues). Email is secondary.

## Local Development

```sh
npm install
npm run start
```

Then open the local URL printed by Eleventy. Changes hot-reload.

## Validation

```sh
npm test
```

The test command builds the site and verifies required routes, canonical URLs, navigation/footer links, data-deletion links, and stale repo-internal legal paths.

## Deployment

Pushing to `main` triggers `.github/workflows/pages.yml`, which builds the site with Eleventy and deploys `_site/` to GitHub Pages. The custom domain `pumpsync.ericslutz.dev` is configured in GitHub Pages and emitted through `src/CNAME`.
