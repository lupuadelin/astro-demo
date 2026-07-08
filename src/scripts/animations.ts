const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const REVEAL_SELECTOR = '.reveal, .reveal-x, .reveal-scale';

function initReveal(): void {
  if (reducedMotion()) {
    document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => el.classList.add('is-revealed'));
    return;
  }
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
  ).filter((el) => !el.classList.contains('is-revealed'));
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

function initHeroWords(): void {
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
  if (reducedMotion()) {
    el.classList.add('is-h1-static');
  } else {
    requestAnimationFrame(() => el.classList.add('is-h1-play'));
  }
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function initCountUp(): void {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-countup]:not([data-countup-done])'));
  if (!targets.length) return;
  if (reducedMotion()) {
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
    const target = Number(match[1]);
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

function boot() {
  initReveal();
  initHeroWords();
  initCountUp();
}

boot();
document.addEventListener('astro:page-load', boot);
