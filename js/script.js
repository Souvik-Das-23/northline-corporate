/* ==========================================================================
   NORTHLINE — Advanced Interaction & Motion Design System
   Vanilla JS · Zero dependencies · High Performance
   ========================================================================== */

(function () {
  'use strict';

  /* -----------------------------------------------------------------------
     Helpers & Accessibility
     ----------------------------------------------------------------------- */
  const html  = document.documentElement;
  const body  = document.body;
  const qs    = (s, c) => (c || document).querySelector(s);
  const qsa   = (s, c) => [...(c || document).querySelectorAll(s)];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionOk = () => !prefersReducedMotion.matches;


  /* -----------------------------------------------------------------------
     1. Page Load Staggered Hero Reveal
     ----------------------------------------------------------------------- */
  function triggerHeroLoad() {
    requestAnimationFrame(() => {
      body.classList.add('is-loaded');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', triggerHeroLoad);
  } else {
    triggerHeroLoad();
  }


  /* -----------------------------------------------------------------------
     2. Theme Management (Zero-Flash & Synchronous Persistence)
     ----------------------------------------------------------------------- */
  const THEME_KEY = 'northline-theme';
  const toggleBtn = qs('#themeToggle');

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }


  /* -----------------------------------------------------------------------
     3. Refined Scroll Progress Indicator & Nav Scrolled State
     ----------------------------------------------------------------------- */
  const nav         = qs('#mainNav');
  const progressBar = qs('.scroll-progress__bar');
  const heroVisual  = qs('#heroVisualContainer');

  function updateScrollProgress() {
    const scrollY   = window.scrollY;
    const docHeight = html.scrollHeight - window.innerHeight;
    
    // Scroll progress bar
    if (progressBar) {
      const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    }

    // Nav frosted backdrop on scroll
    if (nav) {
      if (scrollY > 24) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    }

    // Subtle Hero scroll parallax & fade
    if (heroVisual && motionOk()) {
      if (scrollY < window.innerHeight) {
        const offset = scrollY * 0.15;
        const opacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.9));
        heroVisual.style.transform = `translate3d(0, ${offset}px, 0)`;
        heroVisual.style.opacity = opacity;
      }
    }

    // Work item visual parallax on scroll
    if (motionOk()) {
      updateWorkParallax();
    }
  }


  /* -----------------------------------------------------------------------
     4. Active Navigation Indicator via Scroll Spy
     ----------------------------------------------------------------------- */
  const navLinks = qsa('[data-nav-link]');
  const trackedSections = qsa('section[id]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;

    let currentSectionId = '';
    trackedSections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + currentSectionId) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }


  /* -----------------------------------------------------------------------
     5. Work Item Scroll Parallax
     ----------------------------------------------------------------------- */
  const parallaxItems = qsa('[data-parallax-item]');

  function updateWorkParallax() {
    const windowH = window.innerHeight;
    parallaxItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.top < windowH && rect.bottom > 0) {
        const shape = qs('[data-parallax-shape]', item);
        if (shape) {
          const centerDelta = (rect.top + rect.height / 2) - (windowH / 2);
          const moveY = (centerDelta / windowH) * -16;
          shape.style.transform = `translate3d(0, ${moveY.toFixed(1)}px, 0)`;
        }
      }
    });
  }


  /* -----------------------------------------------------------------------
     6. Magnetic CTA Buttons
     ----------------------------------------------------------------------- */
  const magneticButtons = qsa('[data-magnetic]');

  if (motionOk()) {
    magneticButtons.forEach(btn => {
      const text = qs('.btn__text', btn);

      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);

        // Subtle pull: button container moves up to ±5px, text moves ±2px
        btn.style.transform = `translate3d(${x * 0.18}px, ${y * 0.18}px, 0)`;
        if (text) {
          text.style.transform = `translate3d(${x * 0.08}px, ${y * 0.08}px, 0)`;
        }
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform .45s cubic-bezier(.34, 1.56, .64, 1)';
        btn.style.transform = 'translate3d(0, 0, 0)';
        if (text) {
          text.style.transition = 'transform .45s cubic-bezier(.34, 1.56, .64, 1)';
          text.style.transform = 'translate3d(0, 0, 0)';
        }

        // Clean up transition after spring completes
        setTimeout(() => {
          btn.style.transition = '';
          if (text) text.style.transition = '';
        }, 450);
      });
    });
  }


  /* -----------------------------------------------------------------------
     7. Scroll-Triggered Reveal Animations
     ----------------------------------------------------------------------- */
  const reveals = qsa('[data-reveal]');

  if ('IntersectionObserver' in window && motionOk()) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }


  /* -----------------------------------------------------------------------
     8. Animated Numbers (Statistics Count-Up)
     ----------------------------------------------------------------------- */
  const counters = qsa('[data-count]');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    if (!motionOk()) {
      counters.forEach(el => { el.textContent = el.dataset.count; });
      return;
    }

    counters.forEach(el => {
      const target   = +el.dataset.count;
      const duration = 1800;
      const start    = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  const statsSection = qs('#stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.25 });
    statsObserver.observe(statsSection);
  } else {
    animateCounters();
  }


  /* -----------------------------------------------------------------------
     9. Responsive Mobile Menu
     ----------------------------------------------------------------------- */
  const burger      = qs('#navBurger');
  const mobileMenu  = qs('#mobileMenu');
  const mobileLinks = qsa('[data-mobile-link]');

  function openMobileMenu() {
    burger.classList.add('is-active');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      mobileMenu.classList.contains('is-open') ? closeMobileMenu() : openMobileMenu();
    });

    mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMobileMenu();
        burger.focus();
      }
    });
  }


  /* -----------------------------------------------------------------------
     10. Smooth Anchor Scrolling with Precision Offset
     ----------------------------------------------------------------------- */
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || !href) return;
      const target = qs(href);
      if (!target) return;

      e.preventDefault();
      const navOffset = 64;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navOffset;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: motionOk() ? 'smooth' : 'auto'
      });
    });
  });


  /* -----------------------------------------------------------------------
     11. Hero Geometric Canvas (Swiss Geometry & Interactive Parallax)
     ----------------------------------------------------------------------- */
  const canvas = qs('#heroCanvas');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    let mouseX = 0.5, mouseY = 0.5;
    let targetMouseX = 0.5, targetMouseY = 0.5;

    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr  = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const COLS = 7;
    const ROWS = 7;
    const shapes = [];

    function initShapes() {
      shapes.length = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          shapes.push({
            c, r,
            type: (c + r) % 3,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.007,
            scale: 0.6 + Math.random() * 0.4,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    function isDarkMode() {
      return html.getAttribute('data-theme') === 'dark';
    }

    function getGridDotColor() {
      return isDarkMode() ? 'rgba(255, 255, 255, 0.06)' : 'rgba(32, 33, 31, 0.05)';
    }

    function getShapeStrokeColor() {
      return isDarkMode() ? 'rgba(197, 173, 125, 0.32)' : 'rgba(173, 149, 104, 0.24)';
    }

    function getAccentColor() {
      return isDarkMode() ? 'rgba(197, 173, 125, 0.45)' : 'rgba(173, 149, 104, 0.36)';
    }

    function drawScene(time) {
      ctx.clearRect(0, 0, W, H);
      const t = time * 0.001;

      // Smooth mouse interpolation (spring damping)
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const cellW = W / COLS;
      const cellH = H / ROWS;
      const unit  = Math.min(cellW, cellH) * 0.25;

      // 1. Grid of precision alignment dots
      ctx.fillStyle = getGridDotColor();
      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          ctx.beginPath();
          ctx.arc(c * cellW, r * cellH, 1.25, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Harmonic geometric shapes
      const strokeColor = getShapeStrokeColor();
      shapes.forEach(sh => {
        const cx = (sh.c + 0.5) * cellW + (mouseX - 0.5) * 12 * (sh.c / COLS);
        const cy = (sh.r + 0.5) * cellH + (mouseY - 0.5) * 12 * (sh.r / ROWS);
        const rot = sh.rot + t * sh.rotSpeed * 60;
        const pulse = 1 + Math.sin(t * 1.1 + sh.phase) * 0.07;
        const sz = unit * sh.scale * pulse;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 0.85;

        if (sh.type === 0) {
          // Square
          const half = sz * 0.5;
          ctx.strokeRect(-half, -half, sz, sz);
        } else if (sh.type === 1) {
          // Circle
          ctx.beginPath();
          ctx.arc(0, 0, sz * 0.5, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Cross / plus
          const arm = sz * 0.5;
          ctx.beginPath();
          ctx.moveTo(-arm, 0); ctx.lineTo(arm, 0);
          ctx.moveTo(0, -arm); ctx.lineTo(0, arm);
          ctx.stroke();
        }
        ctx.restore();
      });

      // 3. Central Accent Composition (Swiss Editorial Focus)
      const accentSize = unit * 2.85;
      const accentX = W * 0.5 + (mouseX - 0.5) * 22;
      const accentY = H * 0.5 + (mouseY - 0.5) * 22;
      const accentRot = t * 0.12;

      ctx.save();
      ctx.translate(accentX, accentY);
      ctx.rotate(accentRot);
      ctx.strokeStyle = getAccentColor();
      ctx.lineWidth = 1.2;

      // Outer square
      const halfAccent = accentSize * 0.5;
      ctx.strokeRect(-halfAccent, -halfAccent, accentSize, accentSize);

      // Inner circle
      ctx.beginPath();
      ctx.arc(0, 0, accentSize * 0.32, 0, Math.PI * 2);
      ctx.stroke();

      // Precision diagonal
      ctx.beginPath();
      ctx.moveTo(-halfAccent, halfAccent);
      ctx.lineTo(halfAccent, -halfAccent);
      ctx.stroke();

      // Rotating nested diamond
      const diamondSize = accentSize * 0.18;
      ctx.save();
      ctx.rotate(Math.PI / 4 + t * 0.08);
      ctx.strokeRect(-diamondSize, -diamondSize, diamondSize * 2, diamondSize * 2);
      ctx.restore();

      ctx.restore();

      if (motionOk()) {
        requestAnimationFrame(drawScene);
      }
    }

    document.addEventListener('mousemove', e => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = e.clientY / window.innerHeight;
    }, { passive: true });

    window.addEventListener('resize', resizeCanvas, { passive: true });

    resizeCanvas();
    initShapes();
    if (motionOk()) {
      requestAnimationFrame(drawScene);
    } else {
      drawScene(0);
    }
  }


  /* -----------------------------------------------------------------------
     12. Throttled Unified Scroll Listener
     ----------------------------------------------------------------------- */
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateActiveNav();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // Initial call
  updateScrollProgress();
  updateActiveNav();


  /* -----------------------------------------------------------------------
     13. Keyboard-Only Focus Indicator Polyfill
     ----------------------------------------------------------------------- */
  document.addEventListener('keydown', e => {
    if (e.key === 'Tab') body.classList.add('keyboard-nav');
  });
  document.addEventListener('mousedown', () => {
    body.classList.remove('keyboard-nav');
  });

})();
