import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const contentPath = path.join(root, 'packages', 'valrise', 'content', 'starter-content.json');

test('starter content provides the approved public sitemap and conversion hierarchy', async () => {
  const pages = JSON.parse(await readFile(contentPath, 'utf8'));
  const slugs = pages.map(({ slug }) => slug);
  assert.deepEqual(slugs, ['home', 'about-valeria', 'consulting', 'speaking', 'insights', 'contact', 'privacy', 'terms']);

  const home = pages.find(({ slug }) => slug === 'home').content;
  const hero = await readFile(path.join(root, 'packages', 'valrise', 'patterns', 'hero.php'), 'utf8');
  assert.match(home, /valrise\/hero/);
  assert.match(hero, /Lead with clarity\.[\s\S]*Move forward with conviction\./);
  assert.match(hero, /Book a consultation/);
  assert.match(hero, /Explore speaking/);
  assert.match(hero, /Your Next Level Starts Here!/);

  const speaking = pages.find(({ slug }) => slug === 'speaking').content;
  assert.match(speaking, /Invite Valeria to speak/);
  assert.match(speaking, /Leadership through change/);

  const contact = pages.find(({ slug }) => slug === 'contact').content;
  assert.match(contact, /\[valrise_inquiry_form\]/);
});

test('public starter content excludes every unapproved or fabricated claim class', async () => {
  const source = (await readFile(contentPath, 'utf8')).toLowerCase();
  const forbidden = [
    'moldova', 'immigrat', 'insurance business', 'sold her', 'multimillion',
    'million-dollar', 'chicago office', 'certified', 'award-winning',
    'our clients', 'testimonial', 'guaranteed results', 'keynote delivered',
    'response within', '30-minute', 'calendly.com',
  ];
  forbidden.forEach((phrase) => assert.equal(source.includes(phrase), false, `unexpected claim: ${phrase}`));

  const founderPattern = (await readFile(path.join(root, 'packages', 'valrise', 'patterns', 'founder.php'), 'utf8')).toLowerCase();
  assert.equal(founderPattern.includes('placeholder'), false);
  assert.equal(founderPattern.includes('forthcoming'), false);
});

test('legal pages are internally flagged for review without exposing draft warnings in public copy', async () => {
  const pages = JSON.parse(await readFile(contentPath, 'utf8'));
  for (const slug of ['privacy', 'terms']) {
    const page = pages.find((candidate) => candidate.slug === slug);
    assert.equal(page.internal_status, 'legal-review-required');
    assert.doesNotMatch(page.content, /draft|not legal advice|internal review/i);
  }
});
