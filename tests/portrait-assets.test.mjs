import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const assetNames = [
  'event-sponsor-wall-three-women.jpg',
  'event-sponsor-wall-team.jpg',
  'founder-window-houndstooth-full.jpg',
  'founder-window-green-suit.jpg',
  'founder-window-houndstooth-leaning.jpg',
  'founder-chicago-white-suit.jpg',
  'founder-professional-headshot.jpg',
  'founder-professional-headshot-editorial.jpg',
];

for (const assetName of assetNames) {
  test(`${assetName} is packaged consistently for both website builds`, async () => {
    const workerAsset = await readFile(
      path.join(root, 'worker-site', 'public', 'assets', 'portraits', assetName),
    );
    const wordpressAsset = await readFile(
      path.join(root, 'packages', 'valrise', 'assets', 'images', 'portraits', assetName),
    );

    assert.deepEqual([...workerAsset.subarray(0, 3)], [255, 216, 255]);
    assert.ok(workerAsset.length > 50_000, 'portrait should not be an empty placeholder');
    assert.ok(workerAsset.length < 1_500_000, 'portrait should be optimized for web delivery');
    assert.deepEqual(wordpressAsset, workerAsset);
  });
}
