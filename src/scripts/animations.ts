const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const REVEAL_SELECTOR = '.reveal, .reveal-scale';

// Distinguish the initial page load from subsequent Astro ClientRouter navigations.
// During a client-router swap, reveal fades produce a visible "empty gap" between the
// view-transition cross-fade ending and IntersectionObserver catching up — reads as a flicker.
// On subsequent navigations we skip the intro animations and apply their end state instantly.
let hasBooted = false;

function initReveal(instant: boolean): void {
  if (instant || reducedMotion()) {
    document
      .querySelectorAll<HTMLElement>(REVEAL_SELECTOR)
      .forEach((el) => el.classList.add('is-revealed'));
    return;
  }
  const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)).filter(
    (el) => !el.classList.contains('is-revealed'),
  );
  if (!targets.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        el.classList.add('is-revealed');
        io.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  targets.forEach((t) => io.observe(t));
}

function initHeroWords(instant: boolean): void {
  const el = document.querySelector<HTMLElement>('[data-hero-h1]');
  if (!el || el.dataset.split === '1') return;
  el.dataset.split = '1';
  const walkNode = (node: Node, container: HTMLElement) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? '';
      const parts = text.split(/(\s+)/);
      parts.forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          container.appendChild(document.createTextNode(part));
        } else {
          const w = document.createElement('span');
          w.className = 'word';
          w.textContent = part;
          container.appendChild(w);
        }
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const src = node as HTMLElement;
      const clone = src.cloneNode(false) as HTMLElement;
      container.appendChild(clone);
      src.childNodes.forEach((c) => walkNode(c, clone));
    }
  };
  const frag = document.createDocumentFragment();
  const wrapper = document.createElement('span');
  frag.appendChild(wrapper);
  el.childNodes.forEach((c) => walkNode(c, wrapper));
  el.replaceChildren(...Array.from(wrapper.childNodes));

  const words = el.querySelectorAll<HTMLElement>('.word');
  words.forEach((w, i) => {
    w.style.animationDelay = `${80 + i * 60}ms`;
  });
  if (instant || reducedMotion()) {
    el.classList.add('is-h1-static');
  } else {
    requestAnimationFrame(() => el.classList.add('is-h1-play'));
  }
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function initCountUp(instant: boolean): void {
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>('[data-countup]:not([data-countup-done])'),
  );
  if (!targets.length) return;
  if (instant || reducedMotion()) {
    targets.forEach((el) => {
      el.textContent = el.dataset.finalText || el.textContent;
      el.dataset.countupDone = '1';
    });
    return;
  }
  targets.forEach((el) => {
    const raw = el.dataset.countup || '';
    const match = raw.match(/(\d+)/);
    if (!match) return;
    const suffix = raw.slice((match.index ?? 0) + match[1].length);
    el.dataset.finalText = raw;
    el.textContent = `0${suffix}`;
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        const raw = el.dataset.countup || '';
        const match = raw.match(/(\d+)/);
        if (!match) return;
        const target = Number(match[1]);
        const suffix = raw.slice((match.index ?? 0) + match[1].length);
        const durationMs = 900;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          const eased = easeOutExpo(t);
          const val = Math.round(target * eased);
          el.textContent = `${val}${suffix}`;
          if (t < 1) requestAnimationFrame(tick);
          else el.dataset.countupDone = '1';
        };
        requestAnimationFrame(tick);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.3 },
  );
  targets.forEach((t) => io.observe(t));
}

// On mobile viewports, mark every internal *page* link so Astro's ClientRouter
// does a full page reload instead of a client-side swap. This avoids the
// view-transition snapshot cross-fade that reads as a "previous title flicker"
// on mobile browsers. Desktop keeps the SPA feel.
const ASSET_URL = /\.(webp|jpe?g|png|gif|svg|avif|pdf|zip|mp4|webm)($|\?|#)/i;
function applyMobileFullReloads(): void {
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
    const href = a.getAttribute('href') ?? '';
    const isInternal = href.startsWith('/') && !href.startsWith('//');
    // Skip asset URLs (PhotoSwipe lightbox anchors, downloads) — they aren't page navs.
    if (!isInternal || ASSET_URL.test(href)) {
      a.removeAttribute('data-astro-reload');
      return;
    }
    if (isMobile) a.setAttribute('data-astro-reload', '');
    else a.removeAttribute('data-astro-reload');
  });
}

function boot() {
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const isClientNav = hasBooted;
  hasBooted = true;
  // Skip intro animations on mobile: on small screens the scale/fade reveal
  // is invisible as delight and visible as jank (100ms zoom flicker after nav).
  // Same on any subsequent client-router swap (see hasBooted rationale above).
  const instant = isMobile || isClientNav;
  initReveal(instant);
  initHeroWords(instant);
  initCountUp(instant);
  applyMobileFullReloads();
}

boot();
document.addEventListener('astro:page-load', boot);
