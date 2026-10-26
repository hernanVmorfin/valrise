import assert from 'node:assert/strict';
import test from 'node:test';

import worker from '../src/worker.js';

function createEnv(overrides = {}) {
  return {
    ASSETS: {
      async fetch() {
        return new Response('<!doctype html><title>VALRISE</title>', {
          headers: { 'content-type': 'text/html; charset=utf-8' },
        });
      },
    },
    ...overrides,
  };
}

test('static pages receive the site security headers', async () => {
  const response = await worker.fetch(new Request('https://example.com/'), createEnv());

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
  assert.match(response.headers.get('content-security-policy'), /default-src 'self'/);
});

test('inquiry status is disabled until a delivery endpoint exists', async () => {
  const response = await worker.fetch(
    new Request('https://example.com/api/inquiry-status'),
    createEnv(),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { enabled: false });
});

test('an incomplete inquiry returns field-level errors without calling delivery', async () => {
  let deliveries = 0;
  const response = await worker.fetch(
    new Request('https://example.com/api/inquiry', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: '', email: 'not-an-email', inquiryType: 'consultation' }),
    }),
    createEnv({
      INQUIRY_ENDPOINT: 'https://delivery.example/inquiries',
      DELIVERY_FETCH: async () => {
        deliveries += 1;
        return new Response(null, { status: 202 });
      },
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: 'Please review the highlighted fields.',
    fields: ['name', 'email', 'context'],
  });
  assert.equal(deliveries, 0);
});

test('a honeypot submission is accepted without forwarding personal data', async () => {
  let deliveries = 0;
  const response = await worker.fetch(
    new Request('https://example.com/api/inquiry', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'Spam Bot',
        email: 'bot@example.com',
        inquiryType: 'consultation',
        context: 'Automated message',
        website: 'https://spam.example',
      }),
    }),
    createEnv({
      INQUIRY_ENDPOINT: 'https://delivery.example/inquiries',
      DELIVERY_FETCH: async () => {
        deliveries += 1;
        return new Response(null, { status: 202 });
      },
    }),
  );

  assert.equal(response.status, 204);
  assert.equal(deliveries, 0);
});

test('a valid inquiry is normalized and forwarded to the configured webhook', async () => {
  let deliveredRequest;
  const response = await worker.fetch(
    new Request('https://valrise.example/api/inquiry', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Test browser',
      },
      body: JSON.stringify({
        name: '  Ada Lovelace  ',
        email: ' ADA@EXAMPLE.COM ',
        organization: '  Analytical Engines  ',
        inquiryType: 'consultation',
        interest: 'executive-advisory',
        context: '  Preparing for a consequential transition.  ',
        website: '',
      }),
    }),
    createEnv({
      INQUIRY_ENDPOINT: 'https://delivery.example/inquiries',
      INQUIRY_TOKEN: 'secret-token',
      DELIVERY_FETCH: async (request) => {
        deliveredRequest = request;
        return new Response(null, { status: 202 });
      },
    }),
  );

  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(deliveredRequest.url, 'https://delivery.example/inquiries');
  assert.equal(deliveredRequest.headers.get('authorization'), 'Bearer secret-token');
  const payload = await deliveredRequest.json();
  assert.equal(payload.name, 'Ada Lovelace');
  assert.equal(payload.email, 'ada@example.com');
  assert.equal(payload.organization, 'Analytical Engines');
  assert.equal(payload.context, 'Preparing for a consequential transition.');
  assert.equal(payload.source, 'valrise-website');
  assert.equal(payload.userAgent, 'Test browser');
  assert.match(payload.submittedAt, /^\d{4}-\d{2}-\d{2}T/);
});
