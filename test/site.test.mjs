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
    "privacy/data-deletion/index.html",
    "accessibility/index.html",
    "age-suitability/index.html",
  ];

  for (const route of routes) {
    const html = await page(route);
    assert.match(html, /<main id="main"/, `${route} should include main content`);
  }
});

test("home page navigation matches the PumpSync support pattern", async () => {
  const html = await page("index.html");
  const nav = requiredBlock(html, /<div class="nav-links">([\s\S]*?)<\/div>/, "main navigation links");

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
  assert.match(html, /<img src="\/assets\/pumpsync-app-icon\.png" alt="" width="36" height="36">/);
  assert.deepEqual(manifest.icons, [
    { src: "/assets/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/assets/icon-512.png", sizes: "512x512", type: "image/png" },
  ]);
  assert.ok(favicon.length > 0);
  await assert.rejects(readFile("_site/assets/pumpsync-mark.svg"));
});

test("footer project and policy links include app repository", async () => {
  const html = await page("index.html");
  const footer = requiredBlock(html, /<div class="footer-groups">([\s\S]*?)<\/div>/, "footer groups");
  const links = linksFrom(footer);

  assert.doesNotMatch(footer, /<h2>Website<\/h2>/);
  assert.ok(links.some((link) => link.href === `${appRepo}` && link.label === "GitHub"));
  assert.ok(links.some((link) => link.href === "/privacy/data-deletion/" && link.label === "Data Deletion"));
});

test("content pages render without side menus", async () => {
  const routes = [
    "support/index.html",
    "privacy/index.html",
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
    "privacy/data-deletion/index.html": `${siteUrl}/privacy/data-deletion/`,
    "accessibility/index.html": `${siteUrl}/accessibility/`,
    "age-suitability/index.html": `${siteUrl}/age-suitability/`,
  };

  for (const [route, canonical] of Object.entries(expected)) {
    const html = await page(route);
    assert.match(html, new RegExp(`<link rel="canonical" href="${canonical}">`));
  }
});

test("privacy and support pages link to public data deletion instructions", async () => {
  const privacy = await page("privacy/index.html");
  const support = await page("support/index.html");

  assert.match(privacy, /href="\/privacy\/data-deletion\/"/);
  assert.match(support, /href="\/privacy\/data-deletion\/"/);
});

test("privacy contact path uses support page without direct email", async () => {
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

test("rendered pages keep platform language device agnostic", async () => {
  const routes = [
    "index.html",
    "support/index.html",
    "privacy/index.html",
    "privacy/data-deletion/index.html",
    "accessibility/index.html",
    "age-suitability/index.html",
  ];

  for (const route of routes) {
    const html = await page(route);
    assert.doesNotMatch(html, /iOS app|iOS Keychain|In iOS:|iOS version|iPhone|iPad/);
  }
});

test("rendered pages do not expose stale repo-internal legal paths", async () => {
  const routes = [
    "index.html",
    "support/index.html",
    "privacy/index.html",
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
