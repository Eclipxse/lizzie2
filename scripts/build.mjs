import { copyFile, cp, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const vendor = path.join(root, 'assets/vendor');
await mkdir(vendor, { recursive: true });
for (const [source, name] of [
  ['lenis/dist/lenis.min.js', 'lenis.min.js'],
  ['lenis/dist/lenis.css', 'lenis.css'],
  ['lenis/LICENSE', 'lenis-LICENSE.txt'],
  ['gsap/dist/gsap.min.js', 'gsap.min.js'],
  ['gsap/dist/ScrollTrigger.min.js', 'ScrollTrigger.min.js'],
]) {
  await copyFile(path.join(root, 'node_modules', source), path.join(vendor, name));
}
await writeFile(path.join(vendor, 'gsap-NOTICE.txt'), 'GSAP 3.15.0 and ScrollTrigger. Copyright GSAP / Webflow.\nStandard no-charge license: https://gsap.com/standard-license/\nOriginal copyright and license notices are retained in the distributed scripts.\n');
const destination = path.join(root, 'dist');
await mkdir(destination, { recursive: true });
for (const file of [
  'index.html', 'credits.html', 'favicon.svg', 'styles.css', 'app.js',
  'portfolio-motion.js', 'kinetic-type.js', 'scribble.js', 'smooth-wipe.js',
  'motion-data.js', '_redirects', '_headers',
]) await copyFile(path.join(root, file), path.join(destination, file));
await cp(path.join(root, 'assets'), path.join(destination, 'assets'), { recursive: true });
console.log('Static site built in dist/ with local Lenis and GSAP assets.');
