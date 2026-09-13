---
name: Lizzie's art journal
description: Personal photographs, creative interests, and handwritten notes on cream and lavender paper.
colors:
  paper: "#f6efdf"
  print: "#fffbf1"
  ink: "#3e263b"
  muted: "#715765"
  lavender: "#d8c7df"
  cherry: "#a4384b"
  mustard: "#edd079"
  line: "#c9b9b7"
  purple: "#5f28f6"
  gray: "#d0d2cf"
typography:
  display:
    fontFamily: "Rye, Georgia, serif"
    fontSize: "clamp(76px, 8.3vw, 128px)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "clamp(35px, 4.2vw, 60px)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  handwritten:
    fontFamily: "Caveat, cursive"
    fontSize: "28px"
    fontWeight: 500
    lineHeight: 1.05
spacing:
  page-margin: "clamp(24px, 5.5vw, 100px)"
  page-margin-mobile: "24px"
components:
  photo-print:
    backgroundColor: "{colors.print}"
    textColor: "{colors.ink}"
    padding: "11px 11px 0"
  text-link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "4px 0"
  navigation-active:
    textColor: "{colors.cherry}"
    typography: "{typography.label}"
---

# Design System: Lizzie's Art Journal

## Overview

**Creative North Star: "Lizzie's personal art journal"**

The implemented world is a personal magazine assembled from photographs, handwritten notes, contact strips, and a postcard. Cream paper and plum ink support the content; lavender sheets and cherry annotations supply the recurring accents. The Western masthead anchors Lizzie's name; lowercase literary page titles and plain utility text keep the pages readable.

Lizzie's supplied photographs lead the composition. Pokémon receives the largest treatment among the interests, with tea, cats, cowgirls, retro design, and journals alongside it. Inspiration photography is identified as inspiration and credited; it does not stand in for completed creative projects.

**Key Characteristics:**

- An identifiable face and short page masthead, with generous separation around the reading copy.
- Rectangular prints at varied angles, overlapping paper, and visible caption space.
- Handwritten annotations paired with functional links and a compact navigation bar.
- The retained violet scribble transition and elastic lettering, with restrained supporting motion.
- Occasional tape, a scalloped print, and a small sleeping cat in the margins; the photographs remain the focal material.

## Colors

The palette combines warm paper with dark plum, soft lavender, cherry marks, and a mustard Pokémon sheet. Frontmatter values mirror the named custom properties in `styles.css`.

### Primary

- **Plum ink:** main text, the contact sheet, and the dark cat-film section.
- **Cherry:** annotations, active navigation, reading progress, selection, and focus outlines.

### Secondary

- **Lavender:** the tucked hero sheet, interests field, and closing invitations.
- **Mustard:** the prominent Pokémon sheet.

### Tertiary

- **Violet and transition gray:** the existing scribble transition; violet also colors the temporary heading echoes.

### Neutral

- **Cream paper:** the page field and text on dark surfaces.
- **Print paper:** photograph borders and the contact postcard.
- **Muted plum:** supporting text on light surfaces.
- **Fine rule:** header, practice list, and contact divisions.

The contact page uses a lighter lavender field (`#e4d7e5`); supporting text on colored surfaces uses related plum or pale rose tones. The Pokémon pocket uses pale ochre paper (`#f4e5bd`) with a deeper front fold (`#f0dcae`), cream and pale lavender keepsake cards, and a cherry line seal. These local treatments are not an additional theme.

## Typography

Rye, Caveat, and the italic cut of Lora are self-hosted. Georgia supplies the normal literary text. Arial is the utility/body face, not the display voice.

- **Display:** Rye for the wordmark and LIZZIE masthead. Do not extend the largest masthead treatment to ordinary paragraphs or navigation.
- **Page titles:** lowercase “my world.” and “hello.” use italic Lora at regular weight, with a desktop size of `clamp(60px, 5.8vw, 82px)` and 1.12 line height. Mobile sizes are independently adjusted for each title. These softer titles retain the existing glyph engine with a quieter entrance.
- **Headlines:** Georgia at regular weight, with Lora italics for selected phrases. Headings use balanced wrapping and modest negative tracking.
- **Body:** the base is the frontmatter body token. Most descriptive paragraphs use 15px; compact contact supporting copy uses 14px. The global paragraph measure is capped at 65ch, with narrower measures in the introductory spreads.
- **Utility labels:** navigation and ordinary text links use 13px. Credits, contact-sheet captions, timecodes, footer copy, and scroll prompts use 12px.
- **Handwriting:** Caveat identifies photo captions, personal asides, and signoffs. The role scales with its location; it is not a substitute for body text or contact details.

**The Letter Ownership Rule.** `KineticHeading` owns the masthead glyphs and their violet echoes. GSAP must not also animate those letters.

## Layout

The shared shell is a ruled header, a routed main outlet, and a compact footer. Main navigation remains directly visible on mobile. The header is 90px tall on desktop and 76px at the mobile breakpoint. Page gutters use the frontmatter margin token, become 24px at 760px and below, and receive a centered wide-screen adjustment from 1700px.

The three implemented compositions are:

- **Home (`/`):** a two-column introduction and portrait collage; a ruled creative-practice list; an asymmetric contact sheet and text spread; a dark cat-film interlude; a lavender contact invitation. The portrait, name, introductory copy, and first link appear together in the reviewed desktop opening.
- **My world (`/about`):** an introduction beside two overlapping portraits; a lavender interests pinboard; a closing contact invitation. The desktop pinboard uses twelve columns with deliberately unequal spans. Pokémon occupies the largest print.
- **Say hello (`/contact`):** a masthead above a centered postcard, with a portrait at left and contact details at right. The postcard's maximum width is 1050px.

At 760px and below, Home orders its name, photograph collage, introduction, and link vertically. The practice list becomes a two-column text grid. The camera spread and cat section stack. My World places the portraits below its introduction and changes the pinboard to two columns, with Pokémon spanning both. The postcard stacks its photograph above its message. Secondary adjustments at 1050px and 370px tighten the compositions without introducing another navigation model.

These route arrangements describe the present pages; they are not mandatory layouts for every future surface.

## Elevation & Depth

Flat page fields support softly lifted physical objects. Prints, the tucked paper sheet, contact sheet, Pokémon sheet, and postcard share the print shadow (`2px 12px 24px #3e263b1b, 0 2px 4px #3e263b12`). The cat film uses a deeper local shadow against its dark field. Overlap, angle, and surface tone establish depth; text blocks remain flat.

The page carries a subtle non-interactive paper-grain overlay from the local SVG asset. It does not obscure the photographs or supply factual imagery.

## Shapes

Photographic windows keep square rectangular edges; captions sit outside those overflow-hidden windows. Resting prints retain individual fixed rotations as part of their composition. Tape appears on the Home portrait and first My World portrait; a small scalloped paper edge distinguishes the second My World print. The upper diptych is separately cropped in the Home contact sheet and My World portrait pair so the second photograph cannot leak into the first.

Arrow and asterisk symbols are authored SVG linework. The arrow paths use a consistent slim stroke. Pokémon retains its image silhouette. The postcard's small stamp uses a dashed outline and a slight rotation.

The Pokémon collection is a paper pocket holding two tilted character cards, with a shallow notched front edge. A folded corner marks the contact postcard. The original plum sleeping-cat raster sits beside the My World portrait pair and in the desktop Home signoff; a small SVG cup sits within the tea caption. These details remain occasional accents rather than a repeated ornament on every section.

## Components

### Navigation and text links

Navigation is plain, compact, and persistent. The active route receives cherry text and a thin underline. Nav and footer link targets have a minimum height of 44px; text links have a minimum height of 48px. The principal text-link treatment is a label, an arrow, and a bottom rule. The contact email is larger literary text; Instagram remains a utility link.

Focus is a two-pixel cherry outline with a six-pixel offset, changing to cream in the dark cat section. Selection and scrollbars follow the palette. There is a visible-on-focus skip link, and the router moves focus to the new page heading when navigating.

### Photo prints, contact sheet, and pinboard

Prints combine a photographic window with a paper caption area and Caveat lettering. The contact sheet is a plum container with three consistently proportioned frames and small readable captions. The interests pinboard varies print size and placement, preserving Pokémon's prominence through the two-card keepsake pocket. Its caption uses literary type, and its character names use Caveat. Image credits remain visible beneath the inspiration collection.

### Cat film and postcard

The cat film preserves a vertical 9:16 frame and native video controls. It starts with a poster and `preload="none"`, uses inline playback, and does not autoplay. The postcard provides direct email and Instagram destinations rather than an invented message form.

### Motion ownership and lifecycle

- **`ScribbleTransition` / `SmoothWipe`:** retain the existing GPU scribble route wipe and fallback path. The router coordinates content replacement with the transition.
- **`KineticHeading`:** owns center-out or directional letter arrivals, violet echoes, pointer bending, and the outgoing masthead. Main arrivals last 800ms with stagger; exits use 300ms plus stagger. The lowercase Lora titles use 36% of the entrance displacement and deformation, with quieter violet echoes. Reduced motion or a hidden document settles the typography.
- **`PortfolioMotion`:** GSAP owns print arrivals, interior photo motion, SVG arrow motion, stickers, and drawn annotation lines. Prints settle over 650ms; ordinary entry text uses 500ms, both with `power3.out`. Scroll reveals occur once. Annotation lines draw over 850ms with `power2.out`.
- **Lenis:** interpolates wheel scrolling on GSAP's clock with `lerp: 0.1`. Touch scrolling remains native (`syncTouch: false`). The router owns anchors, history, focus, and scroll restoration.

**The Stable Hit Area Rule.** Pointer feedback moves the arrow while the link itself stays fixed. Photo interior motion is limited to three pixels on each axis and a 1.035 scale. Fine-pointer capability gates photo and sticker interactions; no replacement cursor is installed.

Paper posture uses additive CSS rotation separately from GSAP's transforms: hovered prints partly straighten, keepsake cards rise 12px and straighten, and the postcard corner lifts slightly. These responses take 250ms and require a fine pointer with no reduced-motion preference. The cat tail gives one small flick and the tea steam rises once on first mouse entry; GSAP owns both responses. The resting page stays still, and decorative accents carry no required interaction.

Route replacement aborts page pointer listeners and reverts the GSAP context. Document hiding clears those effects, stops Lenis and its ticker callback, settles heading/fallback animations, and pauses video. Reduced motion destroys smooth scrolling and leaves static content; the photo windows remain structural. When GSAP dependencies are unavailable, the router uses its Web Animations reveal fallback. These are implementation behaviors, not claims about measured frame pacing.

## Do's and Don'ts

- **Do** preserve the supplied photographs, visible faces, and intentional differences in image scale.
- **Do** keep handwritten annotations separate from body copy and functional contact details.
- **Do** retain readable mobile reflow, native video controls, focus feedback, and the motion ownership boundaries.
- **Do** label and credit inspiration imagery independently of Lizzie's supplied media.
- **Don't** invent portfolio projects, journal entries, commercial outcomes, or contact forms unsupported by the content inventory.
- **Don't** enlarge ornament until it displaces the face, reading copy, or primary link.
- **Don't** animate the same transform through both GSAP and the typography engine, or move a link's hit area with its arrow.
- **Don't** treat unused tiny-caption CSS or one-off crop percentages as a reusable typography or spacing scale.
