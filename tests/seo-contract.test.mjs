import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const theme = path.join(root, 'packages', 'valrise');

test('theme loads exactly one metadata implementation and suppresses it for recognized SEO owners', async () => {
  const [functions, seo] = await Promise.all([
    readFile(path.join(theme, 'functions.php'), 'utf8'),
    readFile(path.join(theme, 'inc', 'seo.php'), 'utf8'),
  ]);
  assert.match(functions, /inc\/seo\.php/);
  assert.match(seo, /function valrise_seo_enabled/);
  for (const owner of ['WPSEO_VERSION', 'RANK_MATH_VERSION', 'SEOPRESS_VERSION', 'AIOSEO_VERSION']) {
    assert.match(seo, new RegExp(owner));
  }
  assert.match(seo, /rel=\\?["']canonical/);
  assert.match(seo, /property=\\?["']og:title/);
  assert.match(seo, /name=\\?["']twitter:card/);
});

test('schema graph is limited to verified organization, person, article, and breadcrumb types', async () => {
  const schema = await readFile(path.join(theme, 'inc', 'structured-data.php'), 'utf8');
  for (const type of ['Organization', 'Person', 'Article', 'BreadcrumbList']) {
    assert.match(schema, new RegExp(`['"]@type['"]\\s*=>\\s*['"]${type}`));
  }
  assert.doesNotMatch(schema, /PostalAddress|aggregateRating|award|alumniOf|sameAs/);
  assert.match(schema, /wp_json_encode/);
});

test('empty insights are removed from the homepage and related articles exclude the current post', async () => {
  const insights = await readFile(path.join(theme, 'inc', 'insights.php'), 'utf8');
  assert.match(insights, /wp_count_posts\(\s*'post'\s*\)/);
  assert.match(insights, /valrise-insights/);
  assert.match(insights, /post__not_in/);
  assert.match(insights, /category__in/);

  const single = await readFile(path.join(theme, 'templates', 'single.html'), 'utf8');
  assert.match(single, /valrise_related_insights/);
});

test('metadata descriptions remain editable through excerpts or WordPress site settings', async () => {
  const seo = await readFile(path.join(theme, 'inc', 'seo.php'), 'utf8');
  assert.match(seo, /get_the_excerpt/);
  assert.match(seo, /get_bloginfo\(\s*'description'/);
  assert.match(seo, /get_the_title/);
  assert.match(seo, /get_pagenum_link/);
  assert.doesNotMatch(seo, /\$_SERVER\['REQUEST_URI'\]/);
});
