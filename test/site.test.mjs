import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const siteUrl = "https://pumpsync.ericslutz.dev";
const appRepo = "https://github.com/eslutz/PumpSync";

async function page(path) {
  return readFile(`_site/${path}`, "utf8");
}

function linksFrom(block) {
  return Array.from(block.matchAll(/<a\s+[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gs), ([, href, label]) => ({
    href,
    label: label.replace(/<[^>]+>/g, "").trim(),
  }));
}

function requiredBlock(pageHtml, pattern, label) {
  const match = pageHtml.match(pattern);
  assert.ok(match, `${label} should render`);
  return match[1];
}

test("required public routes render", async () => {
  const routes = [
    "index.html",
    "support/index.html",
    "privacy/index.html",
    "terms/index.html",
    "privacy/data-deletion/index.html",
    "accessibility/index.html",
    "age-suitability/index.html",
  ];

  for (const route of routes) {
    const html = await page(route);
    assert.match(html, /<main id="main"/, `${route} should include main content`);
  }
});

test("custom 404 page is emitted at the site root for GitHub Pages", async () => {
  const html = await page("404.html");

  assert.match(html, /Page not found/);
  assert.doesNotMatch(html, /rel="canonical"/, "error pages should not declare a canonical URL");
  assert.doesNotMatch(html, /property="og:/, "error pages should not declare social metadata");
});

test("home page navigation matches the PumpSync support pattern", async () => {
  // Deliberate fixed contract: the header nav's links and their order are a
  // shared pattern across the PumpSync sites; change this test only when the
  // nav itself is intentionally changed.
  const html = await page("index.html");
  const nav = requiredBlock(html, /<ul class="nav-links">([\s\S]*?)<\/ul>/, "main navigation links");

  assert.deepEqual(linksFrom(nav), [
    { href: "/support/", label: "Support" },
    { href: "/privacy/", label: "Privacy" },
    { href: `${appRepo}/discussions`, label: "Discussions" },
    { href: `${appRepo}/wiki`, label: "Wiki" },
  ]);
});

test("site chrome uses the PumpSync app icon assets", async () => {
  const html = await page("index.html");
  const manifest = JSON.parse(await page("manifest.webmanifest"));
  const favicon = await readFile("_site/favicon.ico");

  assert.match(html, /<link rel="icon" href="\/favicon\.ico" sizes="any">/);
  assert.match(html, /<link rel="icon" type="image\/png" sizes="16x16" href="\/assets\/favicon-16\.png">/);
  assert.match(html, /<link rel="icon" type="image\/png" sizes="32x32" href="\/assets\/favicon-32\.png">/);
  assert.match(html, /<link rel="icon" type="image\/png" sizes="48x48" href="\/assets\/favicon-48\.png">/);
  assert.match(html, /<link rel="apple-touch-icon" sizes="180x180" href="\/assets\/apple-touch-icon\.png">/);
  assert.match(html, /<img src="\/assets\/pumpsync-logo\.png"[^>]*alt=""[^>]*width="36"[^>]*height="36"/);
  assert.deepEqual(manifest.icons, [
    { src: "/assets/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/assets/icon-512.png", sizes: "512x512", type: "image/png" },
    { src: "/assets/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ]);
  assert.ok(favicon.length > 0);
  await assert.rejects(readFile("_site/assets/pumpsync-mark.svg"));
});

test("footer project and policy links include app repository", async () => {
  const html = await page("index.html");
  const footer = requiredBlock(html, /<nav class="footer-groups"[^>]*>([\s\S]*?)<\/nav>/, "footer groups");
  const links = linksFrom(footer);

  assert.doesNotMatch(footer, /<h2>/, "footer groups use non-heading titles to keep the page heading map clean");
  assert.ok(links.some((link) => link.href === `${appRepo}` && link.label === "GitHub"));
  assert.ok(links.some((link) => link.href === "/privacy/data-deletion/" && link.label === "Data Deletion"));
});

test("content pages render without side menus", async () => {
  const routes = [
    "support/index.html",
    "privacy/index.html",
    "terms/index.html",
    "privacy/data-deletion/index.html",
    "accessibility/index.html",
    "age-suitability/index.html",
  ];

  for (const route of routes) {
    const html = await page(route);
    assert.doesNotMatch(html, /class="side-panel"/, `${route} should not include a side panel`);
    assert.doesNotMatch(html, /class="wrap content-grid"/, `${route} should not use a two-column content grid`);
  }
});

test("required canonical URLs use the public domain and trailing slash", async () => {
  const expected = {
    "index.html": `${siteUrl}/`,
    "support/index.html": `${siteUrl}/support/`,
    "privacy/index.html": `${siteUrl}/privacy/`,
    "terms/index.html": `${siteUrl}/terms/`,
    "privacy/data-deletion/index.html": `${siteUrl}/privacy/data-deletion/`,
    "accessibility/index.html": `${siteUrl}/accessibility/`,
    "age-suitability/index.html": `${siteUrl}/age-suitability/`,
  };

  for (const [route, canonical] of Object.entries(expected)) {
    const html = await page(route);
    assert.match(html, new RegExp(`<link rel="canonical" href="${canonical}">`));
    assert.match(html, /<meta name="description" content=".+">/, `${route} should have a meta description`);
    assert.match(html, /<meta property="og:title" content=".+">/, `${route} should have og metadata`);
  }
});

test("sitemap lists exactly the public routes", async () => {
  const sitemap = await page("sitemap.xml");
  const locs = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), ([, loc]) => loc).sort();
  const expected = [
    `${siteUrl}/`,
    `${siteUrl}/support/`,
    `${siteUrl}/privacy/`,
    `${siteUrl}/terms/`,
    `${siteUrl}/privacy/data-deletion/`,
    `${siteUrl}/accessibility/`,
    `${siteUrl}/age-suitability/`,
  ].sort();

  assert.deepEqual(locs, expected);
});

test("privacy and support pages link to public data deletion instructions", async () => {
  const privacy = await page("privacy/index.html");
  const support = await page("support/index.html");

  assert.match(privacy, /href="\/privacy\/data-deletion\/"/);
  assert.match(support, /href="\/privacy\/data-deletion\/"/);
});

test("privacy contact path uses support page without direct email", async () => {
  // Deliberate editorial policy, not a bug guard: the privacy page routes
  // contact through /support/ instead of publishing a direct email address.
  const privacy = await page("privacy/index.html");

  assert.match(privacy, /For privacy, deletion, or support requests, use the <a href="\/support\/">support page<\/a>\./);
  assert.doesNotMatch(privacy, /mailto:/);
  assert.doesNotMatch(privacy, /support@ericslutz\.dev/);
});

test("support email links use request-specific subjects", async () => {
  const support = await page("support/index.html");
  const deletion = await page("privacy/data-deletion/index.html");

  assert.match(deletion, /Tap Delete Data Request\./);
  assert.match(deletion, /copy the Installation ID\./);
  assert.match(support, /mailto:support@ericslutz\.dev\?subject=PumpSync%20Support/);
  assert.match(deletion, /mailto:support@ericslutz\.dev\?subject=DELETION%20REQUEST%20-%20PumpSync%20Support/);
  assert.doesNotMatch(deletion, /or use the <a href="\/support\/">support page<\/a>/);
  assert.doesNotMatch(`${support}\n${deletion}`, /PUMPSYNC%20SUPPORT|PUMPSYNC SUPPORT/);
});

test("canonical policy claims render from shared data on required pages", async () => {
  const claims = JSON.parse(await readFile("src/_data/claims.json", "utf8"));
  const requirements = {
    // supportedSources is the only place the site states which pump services
    // work. The rest of the copy is deliberately vendor-neutral, so if this
    // sentence stops rendering, nothing else says it.
    "index.html": ["medicalDisclaimer", "healthkitNoAds", "selfHostedDeletion", "supportedSources"],
    "support/index.html": ["syncTriggers", "keychainStorage", "backendNonPersistence", "medicalDisclaimer", "doNotSend", "supportedSources"],
    "privacy/index.html": ["syncTriggers", "backendNonPersistence", "healthkitNoAds", "medicalDisclaimer"],
    "terms/index.html": ["syncTriggers"],
    "privacy/data-deletion/index.html": ["doNotSend", "selfHostedDeletion"],
    "accessibility/index.html": ["doNotSend"],
    "age-suitability/index.html": ["syncTriggers", "medicalDisclaimer"],
  };

  for (const [route, keys] of Object.entries(requirements)) {
    const html = await page(route);
    for (const key of keys) {
      assert.ok(html.includes(claims[key]), `${route} should include claims.${key}`);
    }
  }
});

test("rendered pages avoid version-pinned platform references", async () => {
  // Deliberate editorial policy, not a bug guard: naming iOS/iPhone is fine
  // (it is the only supported frontend), but version-pinned references go
  // stale with each OS release, so they stay out of published copy.
  const routes = [
    "index.html",
    "support/index.html",
    "privacy/index.html",
    "terms/index.html",
    "privacy/data-deletion/index.html",
    "accessibility/index.html",
    "age-suitability/index.html",
  ];

  for (const route of routes) {
    const html = await page(route);
    assert.doesNotMatch(html, /iOS \d|iPadOS \d|watchOS \d|macOS \d|In iOS:/);
  }
});

test("rendered pages do not expose stale repo-internal legal paths", async () => {
  const routes = [
    "index.html",
    "support/index.html",
    "privacy/index.html",
    "terms/index.html",
    "privacy/data-deletion/index.html",
    "accessibility/index.html",
    "age-suitability/index.html",
  ];

  for (const route of routes) {
    const html = await page(route);
    assert.doesNotMatch(html, /docs\/legal\/data-deletion\.md/);
    assert.doesNotMatch(html, /docs\/legal\/privacy-policy\.md/);
  }
});
