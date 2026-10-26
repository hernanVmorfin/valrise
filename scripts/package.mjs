import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, statSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const stage = mkdtempSync(join(tmpdir(), 'valrise-release-'));
const fixedDate = new Date('2020-01-01T00:00:00.000Z');

const packages = [
  { source: join(root, 'packages', 'valrise'), name: 'valrise' },
  { source: join(root, 'packages', 'valrise-core'), name: 'valrise-core' },
];

const shouldInclude = (source) => {
  const normalized = source.split(sep).join('/');
  if (/\/(?:node_modules|tests)(?:\/|$)/.test(normalized)) return false;
  if (/\/assets\/src(?:\/|$)/.test(normalized)) return false;
  if (/\/assets\/[^/]+\.(?:ts|css)$/.test(normalized)) return false;
  if (normalized.endsWith('/content/editorial-checklist.md')) return false;
  return !/\.(?:map|DS_Store)$/.test(normalized);
};

const normalizeTimes = (target) => {
  for (const entry of readdirSync(target)) {
    const fullPath = join(target, entry);
    if (statSync(fullPath).isDirectory()) normalizeTimes(fullPath);
    utimesSync(fullPath, fixedDate, fixedDate);
  }
  utimesSync(target, fixedDate, fixedDate);
};

try {
  rmSync(dist, { recursive: true, force: true });
  mkdirSync(dist, { recursive: true });

  for (const item of packages) {
    const target = join(stage, item.name);
    if (!existsSync(item.source)) throw new Error(`Missing package source: ${item.source}`);
    cpSync(item.source, target, { recursive: true, filter: shouldInclude });
    normalizeTimes(target);

    const archive = join(dist, `${item.name}.zip`);
    const result = spawnSync('zip', ['-X', '-q', '-r', archive, item.name], {
      cwd: stage,
      encoding: 'utf8',
    });
    if (result.status !== 0) throw new Error(result.stderr || `zip failed for ${basename(archive)}`);
    process.stdout.write(`Created dist/${basename(archive)}\n`);
  }
} finally {
  rmSync(stage, { recursive: true, force: true });
}
