import assert from 'node:assert/strict';
import test from 'node:test';

import { submitInquiry, validateInquiry } from '../public/assets/site.js';

test('client validation identifies the fields that stop an inquiry', () => {
  assert.deepEqual(
    validateInquiry({
      name: ' ',
      email: 'wrong',
      inquiryType: 'consultation',
      context: '',
    }),
    ['name', 'email', 'context'],
  );
});

test('client validation accepts a complete consultation inquiry', () => {
  assert.deepEqual(
    validateInquiry({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      inquiryType: 'consultation',
      context: 'I am preparing for a leadership transition.',
    }),
    [],
  );
});

test('submitting an inquiry returns the server response on acceptance', async () => {
  const result = await submitInquiry(
    async () => new Response(JSON.stringify({ ok: true }), { status: 202 }),
    { name: 'Ada Lovelace' },
  );

  assert.deepEqual(result, { ok: true });
});

test('submitting an inquiry preserves recoverable server errors', async () => {
  await assert.rejects(
    submitInquiry(
      async () =>
        new Response(
          JSON.stringify({ error: 'Please review the highlighted fields.', fields: ['email'] }),
          { status: 400 },
        ),
      { email: 'wrong' },
    ),
    (error) => {
      assert.equal(error.message, 'Please review the highlighted fields.');
      assert.deepEqual(error.fields, ['email']);
      return true;
    },
  );
});
