import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const theme = path.join(root, 'packages', 'valrise');

test('starter content is opt-in through WP-CLI and keyed for idempotent updates', async () => {
  const command = await readFile(path.join(theme, 'inc', 'seed-command.php'), 'utf8');
  assert.match(command, /WP_CLI::add_command\(\s*'valrise seed'/);
  assert.match(command, /_valrise_seed_key/);
  assert.match(command, /get_posts\s*\(/);
  assert.match(command, /wp_insert_post\s*\(/);
  assert.match(command, /wp_update_post\s*\(/);
});

test('seeder refuses to overwrite a non-seeded page with a colliding slug', async () => {
  const command = await readFile(path.join(theme, 'inc', 'seed-command.php'), 'utf8');
  assert.match(command, /get_page_by_path/);
  assert.match(command, /Skipping existing unseeded page/);
  assert.doesNotMatch(command, /wp_delete_post|delete_option|TRUNCATE/i);
});

test('theme loads seed tooling only in WP-CLI', async () => {
  const functions = await readFile(path.join(theme, 'functions.php'), 'utf8');
  assert.match(functions, /defined\(\s*'WP_CLI'\s*\)\s*&&\s*WP_CLI/);
  assert.match(functions, /inc\/seed-command\.php/);
});
