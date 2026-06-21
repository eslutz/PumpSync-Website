import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const siteUrl = "https://pumpsync.ericslutz.dev";
const websiteRepo = "https://github.com/eslutz/PumpSync-Website";
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
    { href: "/privacy/", label: "Privacy" },
    { href: "/support/", label: "Support" },
    { href: `${appRepo}/discussions`, label: "Discussions" },
    { href: `${appRepo}/wiki`, label: "Wiki" },
  ]);
});

test("footer project and policy links include website and app repositories", async () => {
  const html = await page("index.html");
  const footer = requiredBlock(html, /<div class="footer-groups">([\s\S]*?)<\/div>/, "footer groups");
  const links = linksFrom(footer);

  assert.ok(links.some((link) => link.href === `${websiteRepo}` && link.label === "GitHub"));
  assert.ok(links.some((link) => link.href === `${websiteRepo}/issues` && link.label === "Issues"));
  assert.ok(links.some((link) => link.href === `${appRepo}` && link.label === "Source"));
  assert.ok(links.some((link) => link.href === "/privacy/data-deletion/" && link.label === "Data Deletion"));
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
