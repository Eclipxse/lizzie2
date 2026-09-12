# Verification — 13 September 2026

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
