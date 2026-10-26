---
name: VALRISE Consulting
description: Calm executive counsel expressed through a paper-and-charcoal editorial system.
colors:
  brand-blue: "#3DA2EF"
  action-blue: "#145F96"
  charcoal: "#181A1D"
  paper: "#FCFAF5"
  ivory: "#F2EDE3"
  muted-ink: "#595D62"
  hairline: "rgba(24, 26, 29, 0.19)"
  white: "#FFFFFF"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(4rem, 9vw, 8.5rem)"
    fontWeight: 420
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(2.75rem, 6vw, 6rem)"
    fontWeight: 420
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(1.65rem, 2.5vw, 2.65rem)"
    fontWeight: 420
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  lead:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(1.13rem, 1.65vw, 1.45rem)"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.13em"
rounded:
  none: "0"
spacing:
  field-gap: "0.45rem"
  compact: "0.75rem"
  control-inline: "1.25rem"
  cluster: "2rem"
  section: "clamp(5rem, 10vw, 10rem)"
  shell-gutter: "clamp(1.2rem, 4vw, 4.2rem)"
components:
  button-primary:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.25rem"
    height: "3.25rem"
  button-primary-hover:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.charcoal}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.25rem"
    height: "3.25rem"
  field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.charcoal}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0.9rem 1rem"
---

# Design System: VALRISE Consulting

## Overview

**Creative North Star: "The Executive Editorial"**

VALRISE feels like a considered leadership journal made actionable: warm paper, decisive charcoal, disciplined blue, and generous space give consequential ideas room to land. The experience is calm and executive rather than luxurious or theatrical; it persuades through clarity, proportion, and composure.

The system pairs expressive editorial scale with practical interface behavior. Large Newsreader statements lead, Manrope carries decisions and detail, and fine rules organize information without turning it into a dashboard. Blue appears as a deliberate signal—a horizon, an action, or a full editorial field—not as ambient decoration.

**Key Characteristics:**

- Warm paper and ivory surfaces grounded by near-black charcoal.
- Self-hosted Newsreader display type paired with self-hosted Manrope interface type.
- Oversized, balanced headlines with compact uppercase labels.
- Sharp corners, fine rules, and flat tonal sections instead of ornamental effects.
- Wide responsive shells and asymmetric grids that collapse cleanly to one column.
- Restrained blue used for identity, action, focus, and the signature horizon line.

## Colors

The palette is quiet and material: warm neutrals carry most of the page while two blues separate brand expression from high-contrast action.

### Primary

- **VALRISE Blue:** The identity accent for the wordmark, selection, keyboard focus, full-width editorial fields, and the hero's horizon line.
- **Action Blue:** The deeper, more legible blue reserved for primary controls, active navigation, links, and small emphasis.

### Neutral

- **Charcoal:** The dominant ink, dark section surface, and strongest structural rule.
- **Paper:** The default page and header surface; warm enough to feel editorial without reducing readability.
- **Ivory:** A secondary paper stock used to separate long-form sections without adding depth effects.
- **Muted Ink:** Supporting labels and lower-emphasis copy on light surfaces.
- **Hairline:** The shared divider and field-border color; it structures content without competing with it.
- **White:** Text on dark or action surfaces and the clean field surface.

### Named Rules

**The Blue Horizon Rule.** Use VALRISE Blue as a decisive line, field, focus signal, or identity moment; use Action Blue for small interactive text and controls that require stronger contrast.

**The Paper Majority Rule.** Paper and ivory remain the dominant visual field. Charcoal and blue sections are punctuation, not a repeating stripe pattern.

## Typography

**Display Font:** Newsreader (with Georgia and serif fallbacks)

**Body Font:** Manrope (with a sans-serif fallback)

**Character:** Newsreader brings reflective editorial authority at unusually large scale; Manrope keeps navigation, labels, forms, and explanatory copy direct and contemporary. Both families are self-hosted variable fonts so the voice remains stable without a third-party font request.

### Hierarchy

- **Display** (420, fluid 4rem–8.5rem, 0.98): Hero and page-defining statements; keep them balanced and usually within 9–12 characters of measure.
- **Headline** (420, fluid 2.75rem–6rem, 0.98): Major section theses and closing questions.
- **Title** (420, fluid 1.65rem–2.65rem, 0.98): Service names, value titles, and compact editorial headings.
- **Body** (400, 1rem, 1.65): Explanatory and functional copy, capped at 72ch.
- **Lead** (400, fluid 1.13rem–1.45rem, 1.5): Introductory copy that bridges a headline and supporting detail.
- **Label** (700, 0.72rem, 0.13em, uppercase): Short metadata, step numbers, and form labels.

### Named Rules

**The Two-Voice Rule.** Newsreader carries ideas; Manrope carries orientation, evidence, and action. Do not introduce a third type voice.

**The Quiet Weight Rule.** Create hierarchy through scale, spacing, and contrast before adding heavier weights; display type remains poised at weight 420.

## Layout

Pages use a centered shell capped at 1320px with fluid inline gutters. Vertical sections breathe on a fluid 5rem–10rem rhythm, while the homepage hero fills the first viewport below the 6.3rem header on wide screens.

Editorial grids are intentionally asymmetric: the hero uses a 1.55fr/.45fr thesis-and-response split; labeled sections reserve a narrow column before the content field; service rows use label, proposition, and explanation columns. A blue horizontal bar anchors the hero as its reusable signature. At 900px, primary grids collapse, navigation becomes a disclosure menu, and service rows simplify. At 620px, lists, value grids, topic grids, forms, and footer layouts become single-column; display type adopts the more aggressive mobile fluid scale already defined in the build.

**The Rule-Led Grid Rule.** Use borders and alignment to make relationships visible. Do not convert editorial groupings into floating cards when a shared rule can do the work.

**The Tactile Brand-World Rule.** Lead founder and speaking surfaces with approved photographs of Valeria, using authentic portrait or event context rather than generic consulting imagery. Apply only restrained tonal finishing—natural skin, softened saturation, charcoal depth, warm ivory, and disciplined blue—and never change her identity or imply that an event photograph shows an on-stage appearance. Stationery remains supporting brand-world imagery, not a substitute for a real portrait. Prefer one strong image per page or section, crop responsively with intentional `object-fit`, write honest alt text, serve optimized web formats, and lazy-load below-the-fold images.

## Elevation & Depth

The system is flat by design. It uses no ambient drop shadows: depth comes from tonal changes between paper, ivory, blue, and charcoal, plus hairline borders and large spatial shifts. The only shadow in the shipped system is a one-pixel red validation ring paired with an error border; it communicates state, not elevation.

**The Flat Authority Rule.** Surfaces stay flat at rest. Use tonal contrast and rules for hierarchy; reserve outlines for focus, validation, and boundaries.

## Shapes

Controls, fields, sections, and framed brand moments use square corners. Hairline borders are preferred to containers with rounded silhouettes. The recurring geometry is rectilinear—horizontal rules, column grids, and full-bleed color fields—with the angled outline behind the founder monogram used as a contained brand gesture rather than a general component shape.

**The Sharp Edge Rule.** Border radius is zero across interactive and structural components; preserve the editorial precision of the grid.

## Components

### Buttons

- **Shape:** Rectangular with square corners, a one-pixel border, and a 3.25rem minimum height.
- **Primary:** Action Blue field with white uppercase Manrope text and compact horizontal padding.
- **Hover / Focus:** Hover resolves to Charcoal; keyboard focus uses a three-pixel VALRISE Blue outline offset by four pixels.
- **Ghost:** Transparent with Charcoal text and border; it inherits the surrounding field and retains the same shape and typography.
- **Disabled:** Muted gray removes the action signal and uses a not-allowed cursor.

### Cards / Containers

- **Corner Style:** Square throughout.
- **Background:** Most groupings stay on the parent Paper, Ivory, Blue, or Charcoal field.
- **Shadow Strategy:** None; separation comes from tonal fields and hairline rules.
- **Border:** Service rows, values, topics, steps, and decision lists share one-pixel dividers.
- **Internal Padding:** Compact rows begin near 1.2rem; larger editorial rows use approximately 2rem–3.5rem vertically.

### Inputs / Fields

- **Style:** White surface, one-pixel Hairline border, square corners, and Manrope body text with 0.9rem/1rem padding.
- **Focus:** The shared three-pixel VALRISE Blue outline sits outside the field.
- **Error / Disabled:** Invalid fields use a red border plus one-pixel red validation ring; the submit control remains visibly disabled until availability is established.

### Navigation

Desktop navigation is compact Manrope with modest tracking and no default underline; the current page moves to Action Blue. At 900px and below, links move into a native disclosure menu with at least 44px of target height, full-width paper backing, and horizontal rules between items.

### Service Rows

Service rows are the signature editorial list: a compact label, a Newsreader proposition, and a practical explanation share one ruled grid. They collapse first to a narrow index-plus-content arrangement, then to a single column on small screens.

### Hero Horizon

The homepage hero ends with a solid VALRISE Blue horizontal bar paired with an italic Newsreader signature. The bar is structural and full-width within its grid track; it is not a decorative underline attached to the headline.

## Do's and Don'ts

### Do:

- **Do** keep the primary action copy direct and dignified, led by “Book a consultation.”
- **Do** let one large editorial statement dominate a viewport and give supporting copy a quieter measure.
- **Do** use Paper, Ivory, Blue, and Charcoal as flat fields separated by space or one-pixel rules.
- **Do** preserve visible keyboard focus, 44px mobile targets, semantic disclosure navigation, and reduced-motion behavior.
- **Do** use only supported content; typography and composition must carry persuasion when proof is unavailable.

### Don't:

- **Don't** add rounded cards, pills, soft shadows, glass effects, gradients, or generic coaching-site decoration.
- **Don't** use VALRISE Blue for every interaction; Action Blue exists for small text and control contrast.
- **Don't** introduce testimonial, client-logo, event-history, quantified-result, or portrait modules beyond the user-supplied and approved assets without supporting evidence.
- **Don't** crowd large Newsreader headings with competing labels, badges, or multiple equal-weight calls to action.
- **Don't** replace rule-led editorial groupings with repetitive floating cards.
