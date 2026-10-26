import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import PhpParser from 'php-parser';

const root = resolve(import.meta.dirname, '..');
const report = [];

const run = (command, args, label) => {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`${label} failed`);
  report.push(`PASS: ${label}`);
};

const walk = (directory, extension) => readdirSync(directory).flatMap((entry) => {
  const fullPath = join(directory, entry);
  return statSync(fullPath).isDirectory() ? walk(fullPath, extension) : (fullPath.endsWith(extension) ? [fullPath] : []);
});

run('npm', ['test'], 'npm test');
run('npm', ['run', 'build'], 'npm run build');

JSON.parse(readFileSync(join(root, 'packages/valrise/theme.json'), 'utf8'));
JSON.parse(readFileSync(join(root, 'packages/valrise/content/starter-content.json'), 'utf8'));
report.push('PASS: theme.json and starter-content.json parse');

const phpFiles = walk(join(root, 'packages'), '.php');
const localPhp = spawnSync('php', ['-v'], { encoding: 'utf8' });
if (localPhp.status === 0) {
  for (const file of phpFiles) run('php', ['-l', file], `php -l ${file.slice(root.length + 1)}`);
} else {
  const parser = new PhpParser({ parser: { extractDoc: true }, ast: { withPositions: true } });
  for (const file of phpFiles) {
    parser.parseCode(readFileSync(file, 'utf8'), file);
    report.push(`PASS: php-parser ${file.slice(root.length + 1)}`);
  }
}

run(process.execPath, ['scripts/package.mjs'], 'release packaging');
for (const archive of ['valrise.zip', 'valrise-core.zip']) {
  const check = spawnSync('unzip', ['-t', join(root, 'dist', archive)], { encoding: 'utf8' });
  if (check.status !== 0) throw new Error(`Archive check failed: ${archive}`);
  report.push(`PASS: ${archive} integrity`);
}

writeFileSync(join(root, 'dist', 'verification-report.txt'), `${report.join('\n')}\n`);
process.stdout.write(`\n${report.join('\n')}\n`);
