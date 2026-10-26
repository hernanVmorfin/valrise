# VALRISE WordPress Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver installable native WordPress theme and companion plugin packages for the VALRISE Consulting website.

**Architecture:** A block theme owns presentation, patterns, templates, assets, public metadata, and starter page compositions. A small companion plugin owns inquiry processing and portable business settings. An idempotent WP-CLI seeder installs starter content without touching unrelated records.

**Tech Stack:** WordPress 6.6+, PHP 8.1+, Gutenberg/Site Editor, Vite 7, TypeScript, Tailwind CSS 4, Vitest, Playwright/Axe where runtime permits.

**Spec:** `docs/superpowers/specs/2026-10-25-valrise-wordpress-design.md`

## Global Constraints

- Preserve supplied logo artwork and proportions; use `#3DA2EF` as the established brand blue.
- Server-render all meaningful content through WordPress; no disconnected frontend application.
- Ordinary content, navigation, imagery, services, speaking topics, articles, links, and contact details remain editable without a frontend rebuild.
- Publish no unverified claims, placeholder testimonials, fabricated articles, locations, results, engagements, or scheduling details.
- Use one SEO implementation and disable it when a recognized SEO plugin owns metadata.
- Meet WCAG 2.2 AA-oriented keyboard, focus, contrast, form, motion, and semantic requirements.
- Never show form success unless delivery succeeds.
- No paid dependency.

## Review Focus

- Missing compiled Vite manifest must fail gracefully in admin and never break public PHP rendering.
- Empty Insights archive must show an honest empty state and the homepage Insights section must disappear.
- Invalid, bot-like, or rate-limited inquiries must not call `wp_mail` and must return accessible field/global errors.
- Speaking-only fields must be required only when inquiry type is speaking, both client- and server-side.
- Activating an SEO plugin must prevent duplicate canonical, social, and JSON-LD output.

---

### Task 1: Project foundations and production asset pipeline

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `postcss.config.mjs`
- Create: `packages/valrise/style.css`, `packages/valrise/theme.json`, `packages/valrise/functions.php`
- Create: `packages/valrise/assets/src/main.css`, `packages/valrise/assets/src/main.ts`
- Create: `tests/theme-structure.test.ts`

**Interfaces:**
- Produces: Vite manifest and `valrise_asset_uri(string): string`; editor-visible theme tokens matching CSS custom properties.

- [ ] Write structural tests for required block-theme files, tokens, and production manifest loading.
- [ ] Run tests and confirm failure before files exist.
- [ ] Implement the theme header, theme.json tokens, Vite/Tailwind/TypeScript pipeline, and safe manifest asset loader.
- [ ] Run unit/build checks and confirm production assets exist without a dev server.

### Task 2: Accessible global shell and page template system

**Files:**
- Create: `packages/valrise/parts/header.html`, `parts/footer.html`
- Create: `packages/valrise/templates/index.html`, `front-page.html`, `page.html`, `single.html`, `archive.html`, `404.html`, `home.html`
- Create: `packages/valrise/patterns/*.php`
- Modify: `packages/valrise/assets/src/main.css`, `main.ts`, `functions.php`
- Test: `tests/theme-structure.test.ts`, `tests/frontend-behavior.test.ts`

**Interfaces:**
- Consumes: theme assets and tokens from Task 1.
- Produces: registered patterns and keyboard-operable mobile navigation hooks.

- [ ] Add failing tests for template parts, heading order conventions, skip link, menu button state, reduced motion, and focus styling.
- [ ] Implement the global shell, templates, and reusable hero/service/founder/topic/insights/CTA patterns.
- [ ] Implement minimal TypeScript navigation and disclosure behavior.
- [ ] Run tests and production build.

### Task 3: Editorial starter content and safe seeding

**Files:**
- Create: `packages/valrise/inc/starter-content.php`, `inc/seed-command.php`, `inc/content-helpers.php`
- Create: `packages/valrise/content/editorial-checklist.md`
- Modify: `packages/valrise/functions.php`
- Test: `tests/content-boundaries.test.ts`, `tests/seed-contract.test.ts`

**Interfaces:**
- Produces: `Valrise_Seed_Command::__invoke(array, array): void` and seed keys for Home, About, Consulting, Speaking, Contact, Privacy, Terms.

- [ ] Add failing tests for exact pages, primary/secondary CTAs, forbidden claims, seed markers, and non-overwrite contract.
- [ ] Implement polished English block content and the idempotent opt-in WP-CLI seeder.
- [ ] Add internal editorial/launch checklist for unapproved biography, portrait, proof, legal, links, and delivery settings.
- [ ] Run content and seed contract tests.

### Task 4: Portable inquiry form plugin

**Files:**
- Create: `packages/valrise-core/valrise-core.php`
- Create: `packages/valrise-core/includes/class-settings.php`, `class-inquiry-form.php`, `class-inquiry-handler.php`, `class-rate-limiter.php`
- Create: `packages/valrise-core/assets/inquiry.ts`, `inquiry.css`
- Test: `tests/inquiry-contract.test.ts`, `packages/valrise-core/tests/test-inquiry-handler.php`

**Interfaces:**
- Produces: `[valrise_inquiry_form]` shortcode, `valrise_render_inquiry_form(array): string`, admin-post handlers, settings page, success/error query contract.

- [ ] Add failing contract tests for fields, accessibility, nonce/honeypot, status truthfulness, conditional speaking requirements, sanitization, and rate limiting.
- [ ] Implement settings and server-rendered form.
- [ ] Implement validation, security controls, mail delivery, and same-origin redirect states.
- [ ] Implement dependency-free field disclosure behavior and styles.
- [ ] Run tests and build checks.

### Task 5: Metadata, structured data, and conditional insights

**Files:**
- Create: `packages/valrise/inc/seo.php`, `inc/structured-data.php`, `inc/insights.php`
- Modify: `packages/valrise/functions.php`, templates/patterns as needed
- Test: `tests/seo-contract.test.ts`, `tests/content-boundaries.test.ts`

**Interfaces:**
- Produces: canonical/social metadata, verified-only schema graph, related-post query, conditional homepage Insights render.

- [ ] Add failing tests for SEO-plugin suppression, canonicals, social metadata, Person/Organization/Article/BreadcrumbList fields, and empty Insights behavior.
- [ ] Implement conservative metadata and schema using only verified fields.
- [ ] Implement article byline/category/related content and conditional Insights pattern.
- [ ] Run SEO and content tests.

### Task 6: Packaging, documentation, and release verification

**Files:**
- Create: `scripts/package.mjs`, `scripts/verify.mjs`
- Create: `README.md`, `docs/ADMIN-GUIDE.md`, `docs/DEPLOYMENT.md`, `docs/LAUNCH-CHECKLIST.md`
- Create: `dist/valrise.zip`, `dist/valrise-core.zip`
- Test: all tests and production build

**Interfaces:**
- Consumes: completed theme/plugin packages.
- Produces: deterministic release ZIPs and verification report.

- [ ] Add packaging checks that exclude source tooling/secrets and include compiled assets/logo/favicon files.
- [ ] Document installation, explicit seeding, editing, form delivery, staging noindex, deployment, rollback, and launch review.
- [ ] Run the full unit/build/package/ZIP inspection suite.
- [ ] If a WordPress runtime is available, install packages, seed content, exercise navigation/form failure paths, and report environment/test conditions; otherwise record the unverified runtime checks.
