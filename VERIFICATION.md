# Verification — 14 September 2026

## Published art-journal release

- Published to https://lizzie.eclipxse.in using the existing `lizzie-portfolio` Worker and custom domain. Cloudflare version: `72c2ca7b-2a7f-4d13-8b1c-b2f65b90a002`.
- Website source commit `5b404e3598875c8c0140bdde7606dd9a9271a03f` was pushed to `Eclipxse/lizzie2` on `main` before deployment. This release record is a subsequent documentation-only change, excluded from the public build.
- JavaScript checks, all 11 video byte-range cases, the static build, and Wrangler's deployment dry run passed. The bundled Caveat license is preserved verbatim, including its upstream trailing space.
- HTTPS requests for `/`, `/about`, and `/contact` return HTTP 200 and exactly match the built HTML. SHA-256 comparisons also match the deployed stylesheet, motion controller, kinetic type script, Caveat font, and sleeping-cat illustration to the local build.
- Live browser: all three page designs render correctly, route transitions finish with Lenis resumed, GSAP reports 3.15.0, and immediate Home images decode. No horizontal overflow or console errors/warnings were observed. Contact destinations match the supplied email and Instagram URL.
- Live MP4 range request returns HTTP 206, 1,024 bytes, and `Content-Range: bytes 0-1023/853917`. Browser playback and seeking to 4 seconds succeed with no media error; duration is 10.067 seconds.
- At 390 × 844, the live Home layout renders without horizontal overflow. Reduced motion disables Lenis and leaves zero running page animations. Temporary browser overrides were reset after verification.

## Cute, restrained refinement — pre-release review

- This review was completed locally at port 4175 before publication was authorized. The user subsequently approved the GitHub push and Cloudflare release on 14 September 2026.
- Independent visual review: ship, with no material layout defects across six desktop/mobile captures. New captures are named `cute-*` under `.impeccable/review/`.
- Lowercase italic My World/Hello headings retain the existing typography engine with reduced entrance displacement and echo intensity. The Western LIZZIE masthead remains.
- All three routes have no horizontal overflow at 320 CSS pixels; visual compositions checked at 1440 × 1000 and 390 × 844. New images decode successfully.
- Reduced motion: no Lenis instance and zero running page animations. Spatial hover effects are gated by fine-pointer and motion preferences.
- Keyboard route activation finishes on Contact with heading focus and Lenis resumed. No runtime warnings/errors captured during the checks.
- Cat tail keyframe inspection reaches approximately -6.84 degrees and settles at 0. A second trigger after a motion remount remains at 0. Tea steam fades/lifts then returns to its resting opacity of 0.65. WeakSet tracking prevents replay when visibility or pointer preferences remount the same page.
- The photo's independent CSS rotation responds on hover without sharing GSAP's transform. The postcard corner and keepsake cards use reversible 250ms CSS transitions. There are no new idle animation loops or runtime dependencies.
- Background browser callback throttling made frame-rate sampling unsuitable in this pass; no new 60 fps claim is made. Previous measurements below apply to prior versions.
- The original cat PNG is archived outside the site. Only the 18,480-byte WebP and its prompt sidecar ship. Illustration origin is recorded in `ASSET-SOURCES.json`, `credits.html`, and `ILLUSTRATION-PROMPT.md`.

## Art-journal revision — pre-release review

- This review was completed locally at http://127.0.0.1:4175 before publication was authorized. The previous Cloudflare notes below describe the preceding published version.
- All three redesigned routes were visually checked at 1440 × 1000 desktop and 390 × 844 mobile viewports. All three also have no horizontal document overflow at 320 CSS pixels. Native navigation targets remain 44 pixels tall.
- The independent finish review approved the selected direction after a shared diptych crop correction. Fresh desktop My World and Home contact-sheet captures confirm that the upper image no longer exposes the lower photograph. Local captures are under `.impeccable/review/`, which is ignored by Git.
- The opening combines Lizzie's name, supplied portrait, introduction, and primary action. The redesign includes locally hosted Caveat annotations, cream/plum/lavender/cherry colours, a contact sheet, a Pokémon-led pinboard, and a postcard contact layout.
- Normal pointer navigation, keyboard Enter navigation, queued rapid navigation, and browser Back finish on the expected route with Lenis resumed and heading focus restored. The named Home anchor lands with its section 28 pixels below the viewport top.
- Reduced-motion initial load: no Lenis instance, zero ScrollTriggers, zero running page animations, and no nested photo wrappers. Restoring normal motion reinitializes Lenis without nested wrappers.
- Photo hover reaches scale 1.035 and returns to 1. The visible annotation stroke finishes at dash offset 0. No browser console errors or warnings were captured during the interaction checks.
- Personal video playback and seeking to 4 seconds succeed with no media error. The media duration is 10.067 seconds. Email and Instagram destinations match the supplied values.
- `npm run check`, `node scripts/check-video-ranges.mjs` (11 cases), and `npm run build` pass. The static build includes the new font and paper texture.
- The Impeccable detector was run once for this revision. Small functional labels were enlarged. Cream paper, utilitarian navigation, Western display leading, and handwritten captions are deliberate choices; screenshot review checked their readability and spacing.
- The prior frame-pacing measurements below have not been repeated for this visual revision. They are not a guarantee of 60 fps on every device.

## Previous Cloudflare deployment

- Published to https://lizzie.eclipxse.in using the `lizzie-portfolio` Worker and custom-domain HTTPS.
- Home, `/about`, `/contact`, GSAP, Lenis, the motion controller, and compressed wipe geometry return HTTP 200 with the expected content types.
- Live browser: GSAP 3.15.0 and Lenis initialized, immediate images decoded, no horizontal overflow or console errors/warnings; route navigation completes and scrolling resumes.
- Cloudflare initially returned the entire video for range requests. The dedicated MP4 handler now returns HTTP 206 and exactly 1,024 bytes for `bytes=0-1023`, with `Content-Range: bytes 0-1023/853917`.
- Live video metadata exposes the full 10.067-second seekable range; seeking to 4 seconds succeeds without a media error. `node scripts/check-video-ranges.mjs` passes 11 range, suffix, invalid-range, conditional, and HEAD cases.
- The final upload uses the same website source as GitHub. The deployment command is documented in README; continuous deployment is not configured.

## Version 1.1 — Lenis and GSAP

- Pinned Lenis 1.3.26 and GSAP 3.15.0 are served locally. Syntax checks, static build, and npm dependency audit pass (zero known dependency vulnerabilities at verification time).
- Wheel input produces interpolated Lenis movement. Named anchors use the same scroll controller. Photo hover reaches scale 1.035 and returns to 1 on leave.
- Pointer navigation and keyboard navigation both finish with Lenis resumed. Rapid requests settle on the last requested route with no stuck overlay or captured runtime warnings/errors.
- Reduced-motion emulation produces no Lenis instance, zero ScrollTriggers, and zero running page animations. Changing the preference back restores scrolling without nested photo wrappers.
- Desktop 1440 CSS px and mobile 390 CSS px have no horizontal document overflow.
- Visible-browser wipe samples: desktop 133.3 fps / p95 7.7 ms / 3 frames over 25 ms; mobile layout 134.9 fps / p95 7.8 ms / 1 frame over 25 ms. These are requestAnimationFrame measurements on this computer, not physical-phone or presented-frame guarantees.

## Original portfolio verification (before the 1.1 motion additions)

- JavaScript syntax checks passed for router, typography, both renderers, and the local server.
- All three routes visually inspected at desktop and mobile sizes; the final responsive pass included actual 390 CSS px and 1440 CSS px. A 300 CSS px view and 640 CSS px view also had no horizontal document overflow, covering browser zoom/narrow widths.
- Local photos, Pokémon artwork, and all four pinboard photographs decoded successfully. Lazy-loaded images were inspected after scrolling; full-page screenshots alone do not force lazy loading.
- Email resolves to mailto:lizzie@eclipxse.in. Instagram resolves to https://www.instagram.com/liizzih/ and uses a new tab with noopener/noreferrer.
- Reduced-motion emulation: zero live page animations, hidden wipe, immediate route update.
- Rapid navigation: the last requested destination wins; no stuck overlay. SVG fallback was exercised with the GPU renderer temporarily disabled, then restored.
- Browser Back restores the previous page's saved scroll position, including named section links. Named anchor entries now have independent history keys.
- Personal video played muted, successfully sought to 4 seconds, and paused when navigating away. No media error was reported.
- No browser console errors or warnings in the final checks.
- Impeccable detector run once. The real contrast issue was corrected from #726154 to #69574b; cream and Western display typography are deliberate brief choices. Other warnings concerned native video internals, large display leading, and computed custom-property padding; visual inspection confirmed adequate inset and readable text.

## Frame pacing

Measured on this computer in the visible in-app browser, without CPU throttling:

| View | Average requestAnimationFrame rate during wipe | p95 interval | Frames over 25 ms |
| --- | ---: | ---: | ---: |
| Desktop, 1440 CSS px | 139.6 fps | 7.7 ms | 2 |
| Mobile layout, 390 CSS px | 141.2 fps | 7.7 ms | 0 |

The earlier background-preview runs were inconsistent (including a run throttled to about 1 fps). The figures above are the visible runs. They measure browser animation callbacks, not a guarantee of every physically presented frame, and desktop mobile emulation does not establish performance on a physical phone. The video remains its native 30 fps. The original wipe is reused, but the portfolio is an adaptation, not a claim of pixel-identical reconstruction of the reference video.

Checks informed by the Vercel Web Interface Guidelines: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
