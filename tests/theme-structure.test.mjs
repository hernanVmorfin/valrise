import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const theme = path.join(root, 'packages', 'valrise');

test('the package is a native WordPress block theme with required tokens', async () => {
  await Promise.all([
    access(path.join(theme, 'style.css')),
    access(path.join(theme, 'functions.php')),
    access(path.join(theme, 'templates', 'index.html')),
  ]);

  const themeJson = JSON.parse(await readFile(path.join(theme, 'theme.json'), 'utf8'));
  assert.equal(themeJson.version, 3);
  assert.equal(themeJson.settings.color.palette.find(({ slug }) => slug === 'brand-blue').color, '#3DA2EF');
  assert.equal(themeJson.settings.color.palette.find(({ slug }) => slug === 'action-blue').color, '#176DAA');
  assert.equal(themeJson.settings.color.palette.find(({ slug }) => slug === 'ivory').color, '#F5F1E8');
  assert.equal(themeJson.settings.typography.fontFamilies.length, 2);
});

test('the asset loader reads a production Vite manifest and never requires a dev server', async () => {
  const functions = await readFile(path.join(theme, 'functions.php'), 'utf8');
  assert.match(functions, /function valrise_asset_uri\s*\(/);
  assert.match(functions, /assets\/dist\/\.vite\/manifest\.json/);
  assert.doesNotMatch(functions, /localhost:\d+|@vite\/client/);
});

test('source assets use Tailwind and TypeScript entrypoints', async () => {
  const [css, ts, vite] = await Promise.all([
    readFile(path.join(theme, 'assets', 'src', 'main.css'), 'utf8'),
    readFile(path.join(theme, 'assets', 'src', 'main.ts'), 'utf8'),
    readFile(path.join(root, 'vite.config.ts'), 'utf8'),
  ]);
  assert.match(css, /@import\s+["']tailwindcss["']/);
  assert.match(ts, /document/);
  assert.match(vite, /manifest:\s*true/);
});

test('supplied favicon and touch icon are used when WordPress has no custom Site Icon', async () => {
  const functions = await readFile(path.join(theme, 'functions.php'), 'utf8');
  assert.match(functions, /function valrise_favicon_fallback/);
  assert.match(functions, /has_site_icon/);
  assert.match(functions, /favicon\.ico/);
  assert.match(functions, /apple-touch-icon\.png/);
});
