/** Lenis owns scrolling; GSAP owns photo/link motion; KineticHeading owns glyphs. */
class PortfolioMotion {
  constructor(outlet) {
    this.outlet = outlet;
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)');
    this.fine = matchMedia('(hover: hover) and (pointer: fine)');
    this.available = Boolean(window.gsap && window.ScrollTrigger && window.Lenis);
    this.context = null;
    this.events = null;
    this.lenis = null;
    this.navigating = false;
    this.responded = new WeakSet();
    this.tick = time => this.lenis?.raf(time * 1000);
    this.progress = document.querySelector('.reading-progress');
    this.updateProgress = () => {
      const limit = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      this.progress.style.transform = `scaleX(${Math.min(1, scrollY / limit)})`;
    };
    this.onPreference = () => {
      this.configureScroll();
      this.mount(0, false);
    };
    this.onVisibility = () => {
      if (!this.available) return;
      if (document.hidden) {
        this.clearPage();
        this.lenis?.stop();
        gsap.ticker.remove(this.tick);
      } else {
        if (this.lenis) {
          this.lenis.start();
          this.lenis.raf(gsap.ticker.time * 1000);
          gsap.ticker.add(this.tick);
        }
        this.mount(0, false);
      }
    };
    if (this.available) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.ticker.lagSmoothing(0);
      document.body.classList.add('gsap-enhanced');
      this.configureScroll();
    }
    addEventListener('scroll', this.updateProgress, { passive: true });
    addEventListener('resize', this.updateProgress, { passive: true });
    this.reduce.addEventListener('change', this.onPreference);
    this.fine.addEventListener('change', this.onPreference);
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  configureScroll() {
    if (!this.available) return;
    gsap.ticker.remove(this.tick);
    this.lenis?.destroy();
    this.lenis = null;
    if (!this.reduce.matches) {
      this.lenis = new Lenis({
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        anchors: false, // The router owns anchor history and focus.
        prevent: element => element.tagName === 'VIDEO',
      });
      this.lenis.on('scroll', ScrollTrigger.update);
      if (this.navigating || document.hidden) this.lenis.stop();
      if (!document.hidden) gsap.ticker.add(this.tick);
    }
  }

  clearPage() {
    this.events?.abort();
    this.events = null;
    this.context?.revert();
    this.context = null;
  }

  mount(delay = 0, enter = true) {
    this.clearPage();
    // The photo window is structural, including for reduced motion/fallbacks.
    this.outlet.querySelectorAll('.photo-print > img').forEach(img => {
      const frame = document.createElement('div');
      frame.className = 'photo-window';
      img.before(frame);
      frame.append(img);
    });
    this.lenis?.resize();
    this.updateProgress();
    if (!this.available || this.reduce.matches || document.hidden) return;

    this.events = new AbortController();
    const listen = (element, event, callback) => element.addEventListener(event, callback, {
      passive: true, signal: this.events.signal,
    });
    this.context = gsap.context(() => {}, document.body);
    const reveal = (element, wait = 0) => {
      this.context?.add(() => {
        const print = element.matches('.photo-print,.pokemon-sheet,.film-print');
        const rotation = Number(gsap.getProperty(element, 'rotation')) || 0;
        gsap.from(element, {
          opacity: 0,
          y: print ? 44 : 24,
          rotation: print ? rotation - 6 : rotation,
          scale: print ? 0.97 : 1,
          duration: print ? 0.65 : 0.5,
          delay: wait,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });
        if (element.matches('.portrait-pair')) {
          element.querySelectorAll('.photo-print').forEach((photo, index) => {
            gsap.from(photo, {
              x: index ? -35 : 35,
              rotation: index ? -3 : 3,
              duration: 0.8,
              delay: wait,
              ease: 'power3.out',
              clearProps: 'transform',
            });
          });
        }
      });
    };
    if (enter) this.outlet.querySelectorAll('[data-enter]').forEach((element, i) => {
      reveal(element, delay / 1000 + 0.1 + i * 0.06);
    });

    this.context.add(() => {
      this.outlet.querySelectorAll('[data-draw]').forEach(path => {
        const length = path.getTotalLength();
        gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, {
          strokeDashoffset: 0,
          duration: 0.85,
          delay: enter ? delay / 1000 + 0.55 : 0,
          ease: 'power2.out',
          scrollTrigger: { trigger: path, start: 'top 95%', once: true },
        });
      });
      this.outlet.querySelectorAll('[data-reveal]').forEach(element => {
        if (element.dataset.revealed) return;
        ScrollTrigger.create({
          trigger: element,
          start: 'top 94%',
          once: true,
          onEnter: () => {
            element.dataset.revealed = 'true';
            reveal(element);
          },
        });
      });
    });

    if (this.fine.matches) this.context.add(() => {
      // Image motion is separate from the print's entrance and fixed rotation.
      this.outlet.querySelectorAll('.photo-window').forEach(frame => {
        const img = frame.querySelector('img');
        const xTo = gsap.quickTo(img, 'x', { duration: 0.25, ease: 'power3.out' });
        const yTo = gsap.quickTo(img, 'y', { duration: 0.25, ease: 'power3.out' });
        const scaleX = gsap.quickTo(img, 'scaleX', { duration: 0.25, ease: 'power3.out' });
        const scaleY = gsap.quickTo(img, 'scaleY', { duration: 0.25, ease: 'power3.out' });
        const scaleTo = value => { scaleX(value); scaleY(value); };
        let bounds;
        listen(frame, 'pointerenter', event => {
          if (event.pointerType !== 'mouse') return;
          bounds = frame.getBoundingClientRect();
          scaleTo(1.035);
        });
        listen(frame, 'pointermove', event => {
          if (event.pointerType !== 'mouse' || !bounds) return;
          xTo(gsap.utils.clamp(-3, 3, ((event.clientX - bounds.left) / bounds.width - 0.5) * 6));
          yTo(gsap.utils.clamp(-3, 3, ((event.clientY - bounds.top) / bounds.height - 0.5) * 6));
        });
        listen(frame, 'pointerleave', () => { bounds = null; xTo(0); yTo(0); scaleTo(1); });
      });

      // Move the arrow, keeping the actual link's hit area stable.
      document.querySelectorAll('a .icon').forEach(arrow => {
        const link = arrow.closest('a');
        const diagonal = arrow.querySelector('use')?.getAttribute('href') === '#arrow-ne';
        const xTo = gsap.quickTo(arrow, 'x', { duration: 0.2, ease: 'power3.out' });
        const yTo = gsap.quickTo(arrow, 'y', { duration: 0.2, ease: 'power3.out' });
        const scaleX = gsap.quickTo(arrow, 'scaleX', { duration: 0.16, ease: 'power3.out' });
        const scaleY = gsap.quickTo(arrow, 'scaleY', { duration: 0.16, ease: 'power3.out' });
        const scaleTo = value => { scaleX(value); scaleY(value); };
        listen(link, 'pointerenter', () => { xTo(5); yTo(diagonal ? -5 : 0); });
        listen(link, 'pointerleave', () => { xTo(0); yTo(0); scaleTo(1); });
        listen(link, 'pointerdown', () => scaleTo(0.85));
        listen(link, 'pointerup', () => scaleTo(1));
        listen(link, 'pointercancel', () => scaleTo(1));
        listen(link, 'blur', () => { xTo(0); yTo(0); scaleTo(1); });
      });

      this.outlet.querySelectorAll('.hero-pokemon img,.postage-stamp img').forEach(sticker => {
        const rotation = Number(gsap.getProperty(sticker, 'rotation')) || 0;
        const turn = gsap.quickTo(sticker, 'rotation', { duration: 0.25, ease: 'power3.out' });
        const lift = gsap.quickTo(sticker, 'y', { duration: 0.25, ease: 'power3.out' });
        listen(sticker, 'pointerenter', () => { turn(rotation + 7); lift(-7); });
        listen(sticker, 'pointerleave', () => { turn(rotation); lift(0); });
      });

      // A single small response per visit; the journal is still at rest.
      this.outlet.querySelectorAll('.sleepy-cat').forEach(cat => {
        listen(cat, 'pointerenter', event => {
          if (event.pointerType !== 'mouse' || this.responded.has(cat)) return;
          this.responded.add(cat);
          this.context?.add(() => {
            gsap.timeline().to(cat.querySelector('.cat-tail'), {
              rotation: -7, duration: 0.28, ease: 'power2.out',
            }).to(cat.querySelector('.cat-tail'), {
              rotation: 3, duration: 0.25, ease: 'power2.inOut',
            }).to(cat.querySelector('.cat-tail'), {
              rotation: 0, duration: 0.3, ease: 'power2.out', clearProps: 'transform',
            });
          });
        });
      });
      this.outlet.querySelectorAll('.tea-print').forEach(print => {
        listen(print, 'pointerenter', event => {
          if (event.pointerType !== 'mouse' || this.responded.has(print)) return;
          this.responded.add(print);
          this.context?.add(() => {
            const steam = print.querySelector('.tea-steam');
            gsap.timeline().to(steam, { y: -9, opacity: 0, duration: 0.9, ease: 'power2.out' })
              .set(steam, { y: 0 })
              .to(steam, { opacity: 0.65, duration: 0.3, ease: 'power2.out', clearProps: 'transform,opacity' });
          });
        });
      });
    });
    ScrollTrigger.refresh();
  }

  jumpTo(position) {
    if (this.lenis) {
      this.lenis.resize();
      this.lenis.scrollTo(position, { immediate: true, force: true });
    } else scrollTo({ top: position, left: 0, behavior: 'instant' });
    this.updateProgress();
  }

  toAnchor(element, immediate = false) {
    const top = Math.max(0, element.getBoundingClientRect().top + scrollY - 28);
    if (this.lenis) this.lenis.scrollTo(top, { immediate, duration: 0.8, lerp: 0, force: true });
    else scrollTo({ top, left: 0, behavior: 'instant' });
  }

  beforeNavigate() {
    this.navigating = true;
    this.lenis?.stop();
  }

  afterNavigate() {
    this.navigating = false;
    if (!document.hidden) this.lenis?.start();
  }

  destroy() {
    this.clearPage();
    if (this.available) gsap.ticker.remove(this.tick);
    this.lenis?.destroy();
    removeEventListener('scroll', this.updateProgress);
    removeEventListener('resize', this.updateProgress);
    this.reduce.removeEventListener('change', this.onPreference);
    this.fine.removeEventListener('change', this.onPreference);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }
}
window.PortfolioMotion = PortfolioMotion;
