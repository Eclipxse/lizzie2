# Lizzie

A personal creative portfolio composed as an art journal: portrait collage, handwritten annotations, a camera contact sheet, an interests pinboard, and a postcard contact page. Real personal media and Pokémon artwork sit on cream and lavender paper with plum type. Elastic headings and the original purple scribble transition remain; Lenis smooths wheel scrolling and GSAP animates photographs, ink arrows, links, and stickers.

The art-journal revision and restrained cute details were approved for publication on 14 September 2026. The production address is https://lizzie.eclipxse.in. See `VISUAL-DIRECTION.md` for the approved direction and `VERIFICATION.md` for review and release checks. A local review server can run at http://127.0.0.1:4175.

The 14 September refinement adds lowercase literary titles on My World and Contact, occasional taped/scalloped photo borders, Pokémon cards tucked into a paper pocket, and an original sleeping-cat illustration. Small cat/tea responses play once per mounted page; photos straighten and the postcard corner lifts on fine-pointer hover. These effects stay still with reduced motion. `ILLUSTRATION-PROMPT.md` records the built-in ImageGen prompt and archived original; the website uses its 18.5 KB WebP derivative.

## Run

From this folder, run `npm start` (or `node serve.cjs`). Open http://127.0.0.1:4174. Checked-in vendor files make this preview work without installing dependencies. The included server supports direct routes and video seeking. Do not open index.html with file://: the transition geometry uses fetch.

To choose another port in PowerShell: `$env:PORT = '4175'`, then `npm start`.

## Edit

- `index.html`: the three page templates, biography, captions, email, and Instagram link.
- `styles.css`: colours, locally hosted fonts, desktop/mobile layouts, and interaction states.
- `app.js`: route navigation, scroll history, image arrivals, and video cleanup.
- `portfolio-motion.js`: Lenis lifecycle, the shared GSAP scroll clock, ScrollTrigger reveals, and pointer feedback.
- `kinetic-type.js`: spring-based letter entrances, violet echoes, exit motion, and pointer response.
- `scribble.js`, `smooth-wipe.js`, `motion-data.js`, `assets/wipe-fields.*`: the shared GPU transition and SVG fallback.
- `assets/photos`: responsive edited personal photographs.
- `assets/video`: the edited cat clip and poster.
- `ASSET-SOURCES.json` and `credits.html`: external asset provenance and photographer credits.
- `PRODUCT.md`, `DESIGN.md`, `VISUAL-DIRECTION.md`: content inventory, page map, implemented design system, and approved revision direction.

Home `/`, My world `/about`, and Say hello `/contact` are complete. Work and journal entry pages can be added when actual creative pieces and writing are supplied. The site currently makes no claim about clients, commercial projects, location, or availability.

## Media edits

Personal photos were edited with the built-in image generation tool in edit mode: warm tonal treatment, highlight balancing, and a crop of the diptych's black bars. Exact prompts are in `MEDIA-EDIT-PROMPTS.json`. These are AI-assisted photographic edits, not pixel-identical originals; review the retained originals if strict photographic fidelity is required.

The website contains optimized WebP versions. Original supplied files and full-resolution edited PNGs are retained in the local workspace's `outputs/lizzie-source-media` folder, outside this repository and the published website.

The supplied 10.448-second cat video was trimmed to approximately 10.05 seconds, gently brightened and colour graded, with short picture/audio fades and web-friendly H.264 encoding. Its native 360×640 resolution and 30 fps are retained. Video starts paused and muted, exposes native controls, and pauses on route exit or when the document is hidden. The website animation runs independently at display refresh rate.

## Motion and accessibility

The GPU wipe lasts 1.867 seconds and interpolates the reference's geometric poses. Content changes only while fully covered; short display headings then arrive in a directional letter wave. Pictures settle into their printed positions, paired portraits fan apart, and small annotation strokes draw once on entry. Lenis uses one GSAP ticker while the page is visible; the GPU wipe and kinetic heading stop their own loops after finishing. Touch scrolling stays native. Hidden pages stop scrolling and clean up pointer tweens. Reduced motion disables Lenis and spatial animations, including when the preference changes during a visit. Structural photo crops remain correct in that mode. Paper grain is a static SVG texture.

All principal links work with keyboard, browser history, and ordinary modified clicks. Images have alt text, the page has a skip link and route announcements, and contact uses real supplied destinations. External inspiration is credited and never presented as Lizzie's own creative work.

## Build and deploy

Run `npm ci`, `npm run check`, `node scripts/check-video-ranges.mjs`, then `npm run build`. The build refreshes locally served Lenis 1.3.26 and GSAP 3.15.0 files and creates `dist/` containing only public website assets. Licenses and notices are retained in `assets/vendor`.

Cloudflare Workers Static Assets is configured in `wrangler.jsonc` for `https://lizzie.eclipxse.in`. With Node 22 or newer and an authenticated Cloudflare account, run `npx wrangler@4.131.1 deploy`. The build runs automatically before upload. Custom-domain routing manages DNS and HTTPS through Cloudflare. `_redirects` preserves direct `/about` and `/contact` requests. `worker.mjs` runs only for the small personal MP4 to provide HTTP byte-range responses for video seeking; other assets are served directly.

The source repository is https://github.com/Eclipxse/lizzie2. Deployment is currently manual; a GitHub push alone does not publish a new version. No analytics, backend, submission form, or external runtime asset requests are required.
