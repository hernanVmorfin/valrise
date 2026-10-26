# VALRISE Consulting WordPress Website Design

## Intent

Build an installable, maintainable WordPress website that presents VALRISE Consulting as a discreet, founder-led executive advisory firm with enough institutional structure to grow beyond its founder. The primary conversion is a consultation inquiry; speaking inquiries are secondary.

## Experience direction

The design uses editorial restraint rather than a conventional coaching aesthetic. Warm ivory fields, deep charcoal sections, hairline rules, asymmetric columns, and the established blue create a quiet executive presence. Large serif headlines carry authority; a compact sans-serif supports navigation, metadata, forms, and long-form reading. The supplied Sculpted Partnership SVG artwork is used unchanged.

The homepage moves from a decisive opening proposition to audience recognition, three advisory disciplines, a conservative founder introduction, a transparent engagement sequence, speaking, conditional insights, and a final consultation invitation. Sections alternate composition instead of repeating card grids. Until an approved portrait exists, the founder module uses an intentionally abstract editorial frame labelled for development and excluded from launch-ready starter content.

## Sitemap and conversion paths

- Home: proposition, audience, services, founder, engagement approach, speaking, conditional insights, consultation CTA.
- About Valeria: perspective, operating values, approach, and a biography area designed for approved facts and portraits.
- Consulting: Executive Advisory, Leadership Development, and Women’s Leadership with audience, situations, possible formats, and consultation CTA.
- Speaking: proposed topics, inquiry CTA, and dormant future modules for reel/materials/references.
- Insights: native post archive, category archive, and article template with author, metadata, related reading, and sharing metadata.
- Contact: consultation/speaking inquiry form with conditional event fields.
- Privacy and Terms: editable starter drafts clearly marked for internal legal review in WordPress, not represented as approved advice.
- 404: helpful recovery links and consultation CTA.

Every major path returns to “Book a consultation.” Speaking uses “Invite Valeria to speak” and preselects the speaking inquiry type.

## Architecture

`valrise` is a native WordPress block theme. Templates and template parts use block markup; `theme.json` owns editor-visible tokens and settings; PHP is limited to WordPress integration, metadata, structured data, asset loading, and conditional rendering. Gutenberg patterns provide controlled reusable compositions. Vite compiles Tailwind CSS and TypeScript to versioned production assets; WordPress never depends on the Vite development server.

`valrise-core` is a small companion plugin for theme-independent inquiry handling. It owns server-rendered form markup, nonce and honeypot protection, validation, conditional event fields, mail delivery, success/error redirects, and administrator-configurable recipient/contact/social settings. No inquiry content is persisted in the database by default, minimizing sensitive-data retention.

Starter content is installed only through an explicit WP-CLI command. It creates or updates only records bearing VALRISE seed identifiers and never overwrites unrelated content. Navigation and site options remain editable in WordPress.

SEO is implemented once in the theme without an SEO plugin: editable WordPress titles/excerpts, canonical, Open Graph/Twitter metadata, and conservative Organization/Person/Article/BreadcrumbList JSON-LD. Core supplies XML sitemaps. A filter disables theme metadata when a recognized SEO plugin is active to prevent conflicts.

## Content boundaries

Public starter copy uses only the approved company name, founder name, selected tagline, audiences, service concepts, and proposed speaking topics. It does not publish birthplace, immigration history, business sale, transaction value, credentials, clients, testimonials, results, engagements, office location, scheduling details, response times, or other unsupported claims.

An internal launch checklist records missing portrait, approved biography, recipient email, scheduling URL, social links, legal review, speaker assets, and any approved proof. Unavailable modules are omitted rather than filled with fabricated examples.

## Accessibility, performance, and security

- WCAG 2.2 AA-oriented color pairings, visible focus, skip link, semantic headings, keyboard-operable navigation, labelled fields, error summaries, status messages, and reduced-motion styles.
- Responsive images and intrinsic dimensions; no video backgrounds or animation libraries; local/system font stack fallback unless licensed font files are supplied.
- Escaping at output, sanitization at input, nonce verification, capability checks, same-origin redirects, rate-limiting transient, honeypot, and mail failure truthfulness.
- Production assets are minified and fingerprinted. Meaningful content remains in server-rendered HTML.

## Recommended design tokens

- Brand blue: `#3DA2EF` (identity/accent; not small white text).
- Accessible action blue: `#176DAA`.
- Warm ivory: `#F5F1E8`.
- Paper: `#FCFAF5`.
- Charcoal: `#181A1D`.
- Neutral gray: `#686A6D`.
- Display serif: Georgia-based lean fallback until a licensed editorial webfont is approved.
- Supporting sans: system UI stack for speed and broad readability.

## Acceptance boundary

The deliverable is complete when the theme and plugin install as ZIP files, build without a development server, pass automated structural/PHP checks available in the environment, and include setup, administration, deployment, and launch-review documentation. Because this workspace has Docker but no local PHP or WordPress CLI, browser/runtime verification depends on whether a usable local WordPress container can be started; any unavailable check will be reported explicitly.
