import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

test('operator documentation covers installation, seeding, administration, deployment, and launch review', async () => {
  const files = ['README.md', 'docs/ADMIN-GUIDE.md', 'docs/DEPLOYMENT.md', 'docs/LAUNCH-CHECKLIST.md'];
  await Promise.all(files.map((file) => access(path.join(root, file))));
  const combined = (await Promise.all(files.map((file) => readFile(path.join(root, file), 'utf8')))).join('\n');
  for (const subject of ['wp theme install', 'wp plugin install', 'wp valrise seed', 'noindex', 'recipient email', 'rollback', 'portrait']) {
    assert.match(combined.toLowerCase(), new RegExp(subject));
  }
});

test('packager produces installable theme and plugin archives without development sources', () => {
  const run = spawnSync(process.execPath, ['scripts/package.mjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr || run.stdout);

  for (const archive of ['valrise.zip', 'valrise-core.zip']) {
    const listing = spawnSync('unzip', ['-Z1', path.join(root, 'dist', archive)], { encoding: 'utf8' });
    assert.equal(listing.status, 0, listing.stderr);
    assert.match(listing.stdout, new RegExp(`^${archive.replace('.zip', '')}/`, 'm'));
    assert.doesNotMatch(listing.stdout, /node_modules|\.ts$|tests\/|editorial-checklist|package\.json/);
  }

  const themeListing = spawnSync('unzip', ['-Z1', path.join(root, 'dist', 'valrise.zip')], { encoding: 'utf8' }).stdout;
  assert.match(themeListing, /valrise\/style\.css/);
  assert.match(themeListing, /valrise\/theme\.json/);
  assert.match(themeListing, /assets\/dist\/\.vite\/manifest\.json/);

  const pluginListing = spawnSync('unzip', ['-Z1', path.join(root, 'dist', 'valrise-core.zip')], { encoding: 'utf8' }).stdout;
  assert.match(pluginListing, /valrise-core\/valrise-core\.php/);
  assert.match(pluginListing, /assets\/dist\/\.vite\/manifest\.json/);
});

test('verification script checks tests, production build, JSON, PHP syntax availability, and archives', async () => {
  const source = await readFile(path.join(root, 'scripts', 'verify.mjs'), 'utf8');
  assert.match(source, /npm.*test/s);
  assert.match(source, /npm.*run.*build/s);
  assert.match(source, /php.*-l/s);
  assert.match(source, /php-parser/);
  assert.match(source, /parseCode/);
  assert.match(source, /starter-content\.json/);
  assert.match(source, /valrise\.zip/);
  assert.match(source, /valrise-core\.zip/);
});
