import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const theme = path.join(root, 'packages', 'valrise');

test('global shell provides skip navigation, editable WordPress navigation, logo, and primary CTA', async () => {
  const [header, footer, headerPattern, footerPattern] = await Promise.all([
    readFile(path.join(theme, 'parts', 'header.html'), 'utf8'),
    readFile(path.join(theme, 'parts', 'footer.html'), 'utf8'),
    readFile(path.join(theme, 'patterns', 'site-header.php'), 'utf8'),
    readFile(path.join(theme, 'patterns', 'site-footer.php'), 'utf8'),
  ]);

  assert.match(header, /wp:pattern \{"slug":"valrise\/site-header"/);
  assert.match(footer, /wp:pattern \{"slug":"valrise\/site-footer"/);
  assert.match(headerPattern, /valrise-skip-link[^>]*href="?\#main-content/);
  assert.match(headerPattern, /wp:navigation/);
  assert.match(headerPattern, /valrise-header-color\.svg/);
  assert.match(headerPattern, /Book a consultation/);
  assert.match(footerPattern, /valrise-full-reverse\.svg/);
  assert.match(footerPattern, /wp:navigation/);
});

test('all public templates provide a main landmark and the shared shell', async () => {
  const templates = ['front-page.html', 'page.html', 'single.html', 'home.html', 'archive.html', '404.html'];
  await Promise.all(templates.map(async (name) => {
    const source = await readFile(path.join(theme, 'templates', name), 'utf8');
    assert.match(source, /template-part \{"slug":"header"/);
    assert.match(source, /<main[^>]*id="main-content"/);
    assert.match(source, /template-part \{"slug":"footer"/);
  }));
});

test('the reusable pattern library covers every core editorial composition', async () => {
  const patterns = [
    'hero.php', 'audience.php', 'services.php', 'founder.php',
    'approach.php', 'speaking.php', 'insights.php', 'consultation.php',
  ];
  await Promise.all(patterns.map((name) => access(path.join(theme, 'patterns', name))));
});

test('disclosure behavior keeps aria-expanded and hidden state synchronized', async () => {
  const { setDisclosureState } = await import('../packages/valrise/assets/src/disclosure.ts');
  const attrs = new Map([['aria-expanded', 'false']]);
  const trigger = {
    setAttribute(name, value) { attrs.set(name, value); },
  };
  const panel = { hidden: true };

  setDisclosureState(trigger, panel, true);
  assert.equal(attrs.get('aria-expanded'), 'true');
  assert.equal(panel.hidden, false);

  setDisclosureState(trigger, panel, false);
  assert.equal(attrs.get('aria-expanded'), 'false');
  assert.equal(panel.hidden, true);
});

test('global CSS has visible focus and reduced-motion safeguards', async () => {
  const css = await readFile(path.join(theme, 'assets', 'src', 'main.css'), 'utf8');
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /outline:\s*3px/);
});
