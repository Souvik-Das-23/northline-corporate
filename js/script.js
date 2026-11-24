/* ==========================================================================
   NORTHLINE — Interactions & Motion
   Vanilla JS · Zero dependencies
   ========================================================================== */

(function () {
  'use strict';

  /* -----------------------------------------------------------------------
     Helpers
     ----------------------------------------------------------------------- */
  const html  = document.documentElement;
  const body  = document.body;
  const qs    = (s, c) => (c || document).querySelector(s);
  const qsa   = (s, c) => [...(c || document).querySelectorAll(s)];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionOk = () => !prefersReducedMotion.matches;


  /* -----------------------------------------------------------------------
     1. Theme
     ----------------------------------------------------------------------- */
  const THEME_KEY = 'northline-theme';
  const toggle    = qs('#themeToggle');

  function setTheme(t) {
    html.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);
  }

  // Init
  (function () {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return setTheme(stored);
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  })();

  toggle.addEventListener('click', () => {
    setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });


  /* -----------------------------------------------------------------------
     2. Scroll Progress
     ----------------------------------------------------------------------- */
  const progressBar = qs('.scroll-progress__bar');

  function updateProgress() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
  }


  /* -----------------------------------------------------------------------
     3. Reveal on Scroll
     ----------------------------------------------------------------------- */
  const reveals = qsa('[data-reveal]');

  if ('IntersectionObserver' in window && motionOk()) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }


  /* -----------------------------------------------------------------------
     4. Animated Counters
     ----------------------------------------------------------------------- */
  const counters = qsa('[data-count]');
  let countersRan = false;

  function runCounters() {
    if (countersRan) return;
    countersRan = true;

    if (!motionOk()) {
      counters.forEach(el => { el.textContent = el.dataset.count; });
      return;
    }

    counters.forEach(el => {
      const target   = +el.dataset.count;
      const duration = 1800;
      const start    = performance.now();

      (function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);           // ease-out cubic
        el.textContent = Math.round(ease * target);
        if (p < 1) requestAnimationFrame(step);
      })(start);
    });
  }

  const statsEl = qs('#stats');
  if (statsEl && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { runCounters(); cio.disconnect(); }
    }, { threshold: 0.25 });
    cio.observe(statsEl);
  }


  /* -----------------------------------------------------------------------
     5. Mobile Menu
     ----------------------------------------------------------------------- */
  const burger     = qs('#navBurger');
  const mobileMenu = qs('#mobileMenu');
  const mobileLinks = qsa('[data-mobile-link]');

  function openMenu() {
    burger.classList.add('is-active');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
  }

  function closeMenu() {
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
  }

  burger.addEventListener('click', () =>
    mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu()
  );

  mobileLinks.forEach(a => a.addEventListener('click', closeMenu));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
      burger.focus();
    }
  });


  /* -----------------------------------------------------------------------
     6. Smooth Anchor Scrolling
     ----------------------------------------------------------------------- */
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = qs(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: motionOk() ? 'smooth' : 'auto' });
    });
  });


  /* -----------------------------------------------------------------------
     7. Hero Geometric Canvas
     ----------------------------------------------------------------------- */
  const canvas = qs('#heroCanvas');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    let mx = 0.5, my = 0.5;

    function resize() {
      const r   = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* Shapes */
    const COLS = 7, ROWS = 7;
    const shapes = [];

    function initShapes() {
      shapes.length = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          shapes.push({
            c, r,
            type: (c + r) % 3,
            rot: Math.random() * Math.PI * 2,
            rv:  (Math.random() - .5) * .006,
            sc:  .55 + Math.random() * .45,
            ph:  Math.random() * Math.PI * 2,
          });
        }
      }
    }

    /* Colour helpers (read theme) */
    function isDark() { return html.getAttribute('data-theme') === 'dark'; }

    function dotClr()    { return isDark() ? 'rgba(255,255,255,.05)' : 'rgba(32,33,31,.045)'; }
    function strokeClr() { return isDark() ? 'rgba(197,173,125,.30)' : 'rgba(173,149,104,.22)'; }
    function accentClr() { return isDark() ? 'rgba(197,173,125,.40)' : 'rgba(173,149,104,.32)'; }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      const s = t * .001;
      const cW = W / COLS, cH = H / ROWS;
      const unit = Math.min(cW, cH) * .24;

      /* Grid dots */
      ctx.fillStyle = dotClr();
      for (let r = 0; r <= ROWS; r++)
        for (let c = 0; c <= COLS; c++) {
          ctx.beginPath();
          ctx.arc(c * cW, r * cH, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }

      /* Shapes */
      const sc = strokeClr();
      shapes.forEach(sh => {
        const cx = (sh.c + .5) * cW + (mx - .5) * 10 * (sh.c / COLS);
        const cy = (sh.r + .5) * cH + (my - .5) * 10 * (sh.r / ROWS);
        const rot = sh.rot + s * sh.rv * 60;
        const pulse = 1 + Math.sin(s * 1.1 + sh.ph) * .07;
        const sz = unit * sh.sc * pulse;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.strokeStyle = sc;
        ctx.lineWidth = .8;

        if (sh.type === 0) {
          const h = sz * .5;
          ctx.strokeRect(-h, -h, sz, sz);
        } else if (sh.type === 1) {
          ctx.beginPath();
          ctx.arc(0, 0, sz * .5, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          const a = sz * .5;
          ctx.beginPath();
          ctx.moveTo(-a, 0); ctx.lineTo(a, 0);
          ctx.moveTo(0, -a); ctx.lineTo(0, a);
          ctx.stroke();
        }
        ctx.restore();
      });

      /* Central accent composition */
      const aS  = unit * 2.8;
      const aX  = W * .5 + (mx - .5) * 18;
      const aY  = H * .5 + (my - .5) * 18;
      const aR  = s * .12;

      ctx.save();
      ctx.translate(aX, aY);
      ctx.rotate(aR);
      ctx.strokeStyle = accentClr();
      ctx.lineWidth = 1.2;

      const aH = aS * .5;
      ctx.strokeRect(-aH, -aH, aS, aS);

      ctx.beginPath();
      ctx.arc(0, 0, aS * .30, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-aH, aH); ctx.lineTo(aH, -aH);
      ctx.stroke();

      /* Small diamond */
      const dS = aS * .18;
      ctx.save();
      ctx.rotate(Math.PI / 4);
      ctx.strokeRect(-dS, -dS, dS * 2, dS * 2);
      ctx.restore();

      ctx.restore();

      if (motionOk()) requestAnimationFrame(draw);
    }

    document.addEventListener('mousemove', e => {
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;
    });

    window.addEventListener('resize', resize);

    resize();
    initShapes();
    motionOk() ? requestAnimationFrame(draw) : draw(0);
  }


  /* -----------------------------------------------------------------------
     8. Scroll event (throttled via rAF)
     ----------------------------------------------------------------------- */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { updateProgress(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  updateProgress();


  /* -----------------------------------------------------------------------
     9. Keyboard-only focus rings
     ----------------------------------------------------------------------- */
  document.addEventListener('keydown', e => {
    if (e.key === 'Tab') body.classList.add('keyboard-nav');
  });
  document.addEventListener('mousedown', () => body.classList.remove('keyboard-nav'));

})();
