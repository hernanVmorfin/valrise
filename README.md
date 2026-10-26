# VALRISE Consulting WordPress website

This repository produces two installable packages:

- `dist/valrise.zip`: native WordPress block theme.
- `dist/valrise-core.zip`: portable inquiry form and business settings plugin.

The public website is server-rendered by WordPress and editable with Gutenberg and the Site Editor. Vite, TypeScript, and Tailwind are development tools only; production does not require Node or a development server. There are no paid dependencies.

## Build and verify

Requirements: Node.js 20+ and the standard `zip`/`unzip` commands. PHP 8.1+ is required by WordPress. When local PHP is absent, `npm run verify` uses an offline PHP parser to check every PHP source file.

```bash
npm install
npm run build
npm test
npm run verify
```

## Install

From a WordPress server with WP-CLI:

```bash
wp theme install dist/valrise.zip --activate
wp plugin install dist/valrise-core.zip --activate
wp valrise seed
```

The seed command is explicit and safe by default. It skips an existing page with the same slug unless that page carries VALRISE’s seed marker. Run `wp valrise seed --update` only when you deliberately want to refresh previously seeded pages.

Then go to **Settings → VALRISE**, enter the real inquiry recipient email, save it, and test both a consultation and speaking inquiry. The form does not appear as operational until a recipient is configured.

See [Administrator Guide](docs/ADMIN-GUIDE.md), [Deployment](docs/DEPLOYMENT.md), and [Launch Checklist](docs/LAUNCH-CHECKLIST.md).
