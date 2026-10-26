# VALRISE Cloudflare Worker preview

This is the pre-WordPress VALRISE website. It uses a Cloudflare Worker for static assets, security headers, health checks, and optional inquiry delivery.

## Local development

```bash
npm install
npm test
npm run dev
```

## Inquiry delivery

The contact form stays disabled until `INQUIRY_ENDPOINT` is configured. The Worker sends a normalized JSON payload to that HTTPS webhook. Set `INQUIRY_TOKEN` as a Wrangler secret when the receiving service requires bearer authentication.

```bash
npx wrangler secret put INQUIRY_ENDPOINT
npx wrangler secret put INQUIRY_TOKEN
```

No inquiry data is stored by the Worker. The receiving webhook owns delivery, retention, and access controls.

## Deploy

```bash
npm run check
npm run deploy
```
