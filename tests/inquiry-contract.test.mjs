import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const plugin = path.join(root, 'packages', 'valrise-core');

test('plugin registers a server-rendered inquiry form and both authenticated handlers', async () => {
  const [bootstrap, form, handler] = await Promise.all([
    readFile(path.join(plugin, 'valrise-core.php'), 'utf8'),
    readFile(path.join(plugin, 'includes', 'class-inquiry-form.php'), 'utf8'),
    readFile(path.join(plugin, 'includes', 'class-inquiry-handler.php'), 'utf8'),
  ]);
  assert.match(bootstrap, /add_shortcode\(\s*'valrise_inquiry_form'/);
  assert.match(bootstrap, /admin_post_valrise_inquiry/);
  assert.match(bootstrap, /admin_post_nopriv_valrise_inquiry/);
  assert.match(form, /wp_nonce_field\(\s*'valrise_inquiry_submit'/);
  assert.match(handler, /check_admin_referer\(\s*'valrise_inquiry_submit'/);
});

test('form exposes labelled core fields, inquiry type, honeypot, errors, and live status', async () => {
  const form = await readFile(path.join(plugin, 'includes', 'class-inquiry-form.php'), 'utf8');
  for (const field of ['name', 'email', 'company', 'role', 'interest', 'message', 'inquiry_type']) {
    assert.match(form, new RegExp(`(?:name|for)=["']${field}`));
  }
  assert.match(form, /event_name/);
  assert.match(form, /event_date/);
  assert.match(form, /event_location/);
  assert.match(form, /audience/);
  assert.match(form, /aria-live=["']polite/);
  assert.match(form, /aria-describedby/);
  assert.match(form, /website_url/);
  assert.doesNotMatch(form, /<form[^>]*novalidate/);
  assert.match(form, /Please enter your name\./);
  assert.match(form, /Please enter a valid email address\./);
});

test('delivery redirects to success only after wp_mail returns true', async () => {
  const handler = await readFile(path.join(plugin, 'includes', 'class-inquiry-handler.php'), 'utf8');
  const mailPosition = handler.indexOf('wp_mail(');
  const successPosition = handler.indexOf("'success'");
  assert.ok(mailPosition > -1);
  assert.ok(successPosition > mailPosition);
  assert.match(handler, /if \( ! \$sent \)/);
  assert.match(handler, /'delivery'/);
});

test('handler validates speaking-only fields only for speaking inquiries', async () => {
  const handler = await readFile(path.join(plugin, 'includes', 'class-inquiry-handler.php'), 'utf8');
  assert.match(handler, /'speaking' === \$data\['inquiry_type'\]/);
  assert.match(handler, /event_name/);
  assert.match(handler, /audience/);
  assert.match(handler, /Valrise_Rate_Limiter::allow/);
  assert.doesNotMatch(handler, /mb_strlen/);
});

test('speaking field UI synchronizes hidden, disabled, and required states', async () => {
  const { setSpeakingFieldsState } = await import('../packages/valrise-core/assets/inquiry-behavior.ts');
  const fields = [{ disabled: true, required: false }, { disabled: true, required: false }];
  const panel = { hidden: true };
  setSpeakingFieldsState(panel, fields, true);
  assert.equal(panel.hidden, false);
  assert.deepEqual(fields, [{ disabled: false, required: true }, { disabled: false, required: true }]);
  setSpeakingFieldsState(panel, fields, false);
  assert.equal(panel.hidden, true);
  assert.deepEqual(fields, [{ disabled: true, required: false }, { disabled: true, required: false }]);
});

test('plugin has its own production asset build and settings screen', async () => {
  await access(path.join(root, 'vite.plugin.config.ts'));
  const settings = await readFile(path.join(plugin, 'includes', 'class-settings.php'), 'utf8');
  assert.match(settings, /manage_options/);
  assert.match(settings, /recipient_email/);
  assert.match(settings, /sanitize_email/);
});
