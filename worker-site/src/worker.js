const SECURITY_HEADERS = {
  'content-security-policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "connect-src 'self'",
    "font-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "img-src 'self' data:",
    "object-src 'none'",
    "script-src 'self'",
    "style-src 'self'",
  ].join('; '),
  'permissions-policy': 'camera=(), geolocation=(), microphone=()',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'x-robots-tag': 'noindex, nofollow',
};

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...SECURITY_HEADERS,
      ...extraHeaders,
    },
  });
}

function clean(value, maximum = 5000) {
  return typeof value === 'string' ? value.trim().slice(0, maximum) : '';
}

function normalizeInquiry(input) {
  return {
    name: clean(input.name, 120),
    email: clean(input.email, 254).toLowerCase(),
    organization: clean(input.organization, 180),
    inquiryType: clean(input.inquiryType, 40),
    interest: clean(input.interest, 80),
    context: clean(input.context, 5000),
    website: clean(input.website, 300),
  };
}

function invalidFields(inquiry) {
  const fields = [];
  if (!inquiry.name) fields.push('name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) fields.push('email');
  if (!['consultation', 'speaking'].includes(inquiry.inquiryType)) fields.push('inquiryType');
  if (!inquiry.context) fields.push('context');
  return fields;
}

async function handleInquiry(request, env) {
  if (!env.INQUIRY_ENDPOINT) {
    return json(
      { error: 'Inquiry delivery is not connected yet. Please return when the preview is ready.' },
      503,
      { 'retry-after': '3600' },
    );
  }

  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return json({ error: 'Send this inquiry as JSON.' }, 415);
  }

  let input;
  try {
    input = await request.json();
  } catch {
    return json({ error: 'The inquiry could not be read. Please try again.' }, 400);
  }

  const inquiry = normalizeInquiry(input);
  if (inquiry.website) return new Response(null, { status: 204, headers: SECURITY_HEADERS });

  const fields = invalidFields(inquiry);
  if (fields.length) {
    return json({ error: 'Please review the highlighted fields.', fields }, 400);
  }

  const payload = {
    ...inquiry,
    website: undefined,
    source: 'valrise-website',
    submittedAt: new Date().toISOString(),
    userAgent: request.headers.get('user-agent') || '',
  };
  delete payload.website;

  const headers = { 'content-type': 'application/json' };
  if (env.INQUIRY_TOKEN) headers.authorization = `Bearer ${env.INQUIRY_TOKEN}`;

  const deliveryRequest = new Request(env.INQUIRY_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  const deliver = env.DELIVERY_FETCH || fetch;
  const deliveryResponse = await deliver(deliveryRequest);

  if (!deliveryResponse.ok) {
    return json(
      { error: 'The inquiry could not be delivered. Please try again later.' },
      502,
    );
  }

  return json({ ok: true }, 202);
}

async function handleApi(request, env, pathname) {
  if (pathname === '/api/health' && request.method === 'GET') {
    return json({ ok: true, service: 'valrise-site' });
  }

  if (pathname === '/api/inquiry-status' && request.method === 'GET') {
    return json({ enabled: Boolean(env.INQUIRY_ENDPOINT) });
  }

  if (pathname === '/api/inquiry' && request.method === 'POST') {
    return handleInquiry(request, env);
  }

  return json({ error: 'Not found.' }, 404);
}

async function handleRequest(request, env) {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/')) return handleApi(request, env, url.pathname);

  const assetResponse = await env.ASSETS.fetch(request);
  const headers = new Headers(assetResponse.headers);
  Object.entries(SECURITY_HEADERS).forEach(([name, value]) => headers.set(name, value));

  if (assetResponse.headers.get('content-type')?.includes('text/html')) {
    headers.set('cache-control', 'public, max-age=0, must-revalidate');
  }

  return new Response(assetResponse.body, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers,
  });
}

export default { fetch: handleRequest };
