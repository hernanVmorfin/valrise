import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const pages = [
  'public/index.html',
  'public/about/index.html',
  'public/consulting/index.html',
  'public/speaking/index.html',
  'public/contact/index.html',
];

for (const page of pages) {
  test(`${page} carries the complete navigation, browser theme, and conversion footer`, async () => {
    const html = await readFile(new URL(`../${page}`, import.meta.url), 'utf8');
    assert.match(html, /<meta name="theme-color" content="#fcfaf5">/);
    assert.match(html, /<nav[^>]+aria-label="Mobile navigation"/);
    assert.match(html, /<nav class="footer-nav" aria-label="Footer navigation">/);
    assert.match(html, /Book a consultation/);
    assert.match(html, /Invite Valeria to speak/);
  });
}

test('the preview inquiry form is deliberately unavailable until delivery is connected', async () => {
  const html = await readFile(new URL('../public/contact/index.html', import.meta.url), 'utf8');
  const script = await readFile(new URL('../public/assets/site.js', import.meta.url), 'utf8');

  assert.match(html, /<p class="form-status"[^>]*>Checking inquiry availability…<\/p>\s*<fieldset class="form-fields" disabled>/);
  assert.match(script, /fieldset\.disabled = !enabled/);
  assert.match(script, /Preview mode — inquiries are not being delivered yet\./);
});

test('interactive states remain visible on blue and charcoal surfaces', async () => {
  const css = await readFile(new URL('../public/assets/site.css', import.meta.url), 'utf8');
  assert.match(css, /\.blue :where\(a, button, input, select, textarea, summary\):focus-visible/);
  assert.match(css, /\.blue \.closing \.button:hover/);
  assert.match(css, /\.dark \.closing \.button:hover/);
});

test('founder photography uses one cinematic editorial frame system', async () => {
  const home = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
  const about = await readFile(new URL('../public/about/index.html', import.meta.url), 'utf8');
  const speaking = await readFile(new URL('../public/speaking/index.html', import.meta.url), 'utf8');
  const css = await readFile(new URL('../public/assets/site.css', import.meta.url), 'utf8');

  assert.match(home, /class="founder-photo portrait-frame portrait-frame--environmental"/);
  assert.match(home, /<figcaption class="portrait-frame__caption">/);
  assert.match(about, /class="portrait-editorial portrait-frame portrait-frame--founder"/);
  assert.match(about, /Founder · Entrepreneur · Strategic advisor/);
  assert.match(speaking, /class="speaking-hero-photo portrait-frame portrait-frame--event"/);
  assert.match(speaking, /Business community · Chicago/);

  assert.match(css, /\.portrait-frame__media/);
  assert.match(css, /\.portrait-frame--founder \.portrait-frame__media img/);
  assert.match(css, /\.portrait-frame--environmental \.portrait-frame__media img/);
  assert.match(css, /\.portrait-frame--event \.portrait-frame__media img/);
  assert.match(css, /\.portrait-frame__caption \{[^}]*font-size: \.72rem;/);
  assert.match(css, /\.blue \.portrait-frame__caption \{ color: var\(--ink\); \}/);
  assert.match(css, /@media \(max-width: 620px\)[\s\S]*\.portrait-frame::before/);
});

test('narrow mobile headings preserve whole-word editorial wrapping', async () => {
  const css = await readFile(new URL('../public/assets/site.css', import.meta.url), 'utf8');
  assert.match(css, /@media \(max-width: 360px\)[\s\S]*\.page-hero h1 \{ font-size: clamp\(2\.85rem, 14\.5vw, 3\.25rem\); \}/);
});

test('a service list at the start of a section does not add a second top margin', async () => {
  const css = await readFile(new URL('../public/assets/site.css', import.meta.url), 'utf8');
  assert.match(css, /\.shell > \.service-list:first-child \{ margin-top: 0; \}/);
});
