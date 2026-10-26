import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const assets = [
  'public/assets/editorial/valrise-stationery-wide.jpg',
  'public/assets/editorial/valrise-embossed-detail.jpg',
  'public/assets/portraits/founder-professional-headshot-editorial.jpg',
  'public/assets/portraits/founder-window-houndstooth-leaning.jpg',
  'public/assets/portraits/event-sponsor-wall-three-women.jpg',
];

for (const asset of assets) {
  test(`${asset} is a valid project JPEG`, async () => {
    const bytes = await readFile(new URL(`../${asset}`, import.meta.url));
    assert.deepEqual([...bytes.subarray(0, 3)], [255, 216, 255]);
    assert.ok(bytes.length > 100_000, 'website image should not be an empty placeholder');
    assert.ok(bytes.length < 1_500_000, 'website image should be compressed for delivery');
  });
}
