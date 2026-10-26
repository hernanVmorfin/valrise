# VALRISE administrator guide

## Editing the site

- **Pages → All Pages:** edit Home, About Valeria, Consulting, Speaking, Contact, Privacy, and Terms with Gutenberg.
- **Appearance → Editor:** edit the header, footer, navigation, global colors, typography, and reusable VALRISE patterns.
- **Posts:** publish Insights articles. Assign categories, an excerpt, author, and featured image. The homepage Insights section stays hidden until at least one article is published.
- **Settings → VALRISE:** manage the inquiry recipient email. A real delivery address must be saved before the form can send.

The Home page uses shared theme patterns. Edit a shared composition when the change should appear wherever that pattern is used. For a one-off composition, duplicate or detach the pattern in the block editor before making the change.

## Consultation and speaking inquiries

The Contact page contains `[valrise_inquiry_form]`. Consultation is the default. Selecting Speaking inquiry reveals event or organization, date, location/format, and audience fields. Event or organization and audience become required.

The form uses WordPress mail delivery. Configure authenticated transactional email at the hosting layer or through one reputable SMTP provider. Confirm a real submission reaches the intended inbox before launch. A visible success message means WordPress accepted the mail operation; inbox placement still depends on the mail provider.

## Images and identity

Use the supplied logo artwork without editing its proportions. Replace the founder development frame only after an approved portrait and alternative text are available. Upload appropriately sized WebP or AVIF images where WordPress supports them, retain meaningful focal points, and write useful alternative text rather than repeating adjacent copy.

## Legal and editorial controls

Privacy and Terms are seeded as drafts and require legal review before publication. Do not publish unsupported biography details, credentials, transaction values, client names, testimonials, results, speaking history, locations, or media claims. The internal editorial checklist is in the source package, not the installable theme.
