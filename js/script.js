/* ==========================================================================
   NORTHLINE — Advanced Interaction & Architectural Motion Design System
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
        const offset = scrollY * 0.12;
        const opacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.95));
        heroVisual.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        heroVisual.style.opacity = opacity.toFixed(2);
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
     11. Abstract Architectural Visual (Axonometric Spatial Canvas)
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

    function isDarkMode() {
      return html.getAttribute('data-theme') === 'dark';
    }

    // Color definitions
    function getColors() {
      const dark = isDarkMode();
      return {
        grid:        dark ? 'rgba(255, 255, 255, 0.04)'  : 'rgba(32, 33, 31, 0.04)',
        axis:        dark ? 'rgba(197, 173, 125, 0.18)'  : 'rgba(173, 149, 104, 0.16)',
        wireframe:   dark ? 'rgba(242, 240, 233, 0.18)'  : 'rgba(32, 33, 31, 0.14)',
        planeFill:   dark ? 'rgba(197, 173, 125, 0.05)'  : 'rgba(173, 149, 104, 0.045)',
        accentLine:  dark ? 'rgba(197, 173, 125, 0.65)'  : 'rgba(173, 149, 104, 0.55)',
        accentDot:   dark ? 'rgba(197, 173, 125, 0.85)'  : 'rgba(173, 149, 104, 0.80)',
        text:        dark ? 'rgba(163, 163, 155, 0.50)'  : 'rgba(133, 132, 126, 0.60)',
        elevationArc:dark ? 'rgba(197, 173, 125, 0.22)'  : 'rgba(173, 149, 104, 0.18)'
      };
    }

    // 3D Isometric Projection Helper
    function projectIso(x, y, z, cx, cy, rotY, rotX) {
      // Rotation about Y axis
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      // Rotation about X axis
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      // Isometric scale
      const scale = 1.15;
      return {
        px: cx + x1 * scale,
        py: cy + y2 * scale,
        depth: z2
      };
    }

    function drawScene(time) {
      ctx.clearRect(0, 0, W, H);
      const t = time * 0.001;
      const clrs = getColors();

      // Damped mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const cx = W * 0.5;
      const cy = H * 0.5;

      // Subtle dynamic camera rotation angles
      const rotY = Math.PI / 6 + (mouseX - 0.5) * 0.35 + Math.sin(t * 0.15) * 0.06;
      const rotX = Math.PI / 7 + (mouseY - 0.5) * 0.25 + Math.cos(t * 0.12) * 0.04;

      // 1. Draw Architectural Floor Grid (Base Datum)
      const gridSize = 220;
      const gridStep = 44;
      ctx.strokeStyle = clrs.grid;
      ctx.lineWidth = 0.8;

      for (let i = -gridSize; i <= gridSize; i += gridStep) {
        // Lines parallel to X
        const p1 = projectIso(-gridSize, 70, i, cx, cy, rotY, rotX);
        const p2 = projectIso(gridSize, 70, i, cx, cy, rotY, rotX);
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();

        // Lines parallel to Z
        const p3 = projectIso(i, 70, -gridSize, cx, cy, rotY, rotX);
        const p4 = projectIso(i, 70, gridSize, cx, cy, rotY, rotX);
        ctx.beginPath();
        ctx.moveTo(p3.px, p3.py);
        ctx.lineTo(p4.px, p4.py);
        ctx.stroke();
      }

      // 2. Architectural Coordinate Lines (Axis Projections)
      const ax0 = projectIso(-160, 70, 0, cx, cy, rotY, rotX);
      const ax1 = projectIso(160, 70, 0, cx, cy, rotY, rotX);
      const ay0 = projectIso(0, 70, -160, cx, cy, rotY, rotX);
      const ay1 = projectIso(0, 70, 160, cx, cy, rotY, rotX);

      ctx.strokeStyle = clrs.axis;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(ax0.px, ax0.py); ctx.lineTo(ax1.px, ax1.py);
      ctx.moveTo(ay0.px, ay0.py); ctx.lineTo(ay1.px, ay1.py);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Layered Architectural Volumes & Cantilevered Planes
      // Slabs defined by 3D corners [x, y, z]
      const slabs = [
        // Base Foundation Plate (large, thin, grounded)
        {
          corners: [
            [-120, 50, -90], [120, 50, -90],
            [120, 50, 90],   [-120, 50, 90]
          ],
          accentEdge: 0,
          fill: clrs.planeFill,
          stroke: clrs.wireframe
        },
        // Mid Cantilever Volume (shifted, elevated)
        {
          corners: [
            [-70, -10, -110], [90, -10, -110],
            [90, -10, 50],   [-70, -10, 50]
          ],
          accentEdge: 1,
          fill: clrs.planeFill,
          stroke: clrs.wireframe
        },
        // Upper Pavilion Roof Plate (floating high, champagne accented)
        {
          corners: [
            [-100, -70, -40], [60, -70, -40],
            [60, -70, 100],   [-100, -70, 100]
          ],
          accentEdge: 2,
          fill: clrs.planeFill,
          stroke: clrs.wireframe
        }
      ];

      // Vertical structural columns connecting slabs
      const columns = [
        [[-70, 50, -70], [-70, -70, -70]],
        [[50, 50, -40],  [50, -70, -40]],
        [[-40, 50, 60],  [-40, -70, 60]],
        [[40, 50, 40],   [40, -70, 40]]
      ];

      // Draw structural vertical lines
      ctx.strokeStyle = clrs.wireframe;
      ctx.lineWidth = 0.9;
      columns.forEach(col => {
        const top = projectIso(col[0][0], col[0][1], col[0][2], cx, cy, rotY, rotX);
        const btm = projectIso(col[1][0], col[1][1], col[1][2], cx, cy, rotY, rotX);
        ctx.beginPath();
        ctx.moveTo(top.px, top.py);
        ctx.lineTo(btm.px, btm.py);
        ctx.stroke();
      });

      // Draw Slabs
      slabs.forEach(slab => {
        const pts = slab.corners.map(c => projectIso(c[0], c[1], c[2], cx, cy, rotY, rotX));

        ctx.beginPath();
        ctx.moveTo(pts[0].px, pts[0].py);
        for (let j = 1; j < pts.length; j++) {
          ctx.lineTo(pts[j].px, pts[j].py);
        }
        ctx.closePath();

        ctx.fillStyle = slab.fill;
        ctx.fill();

        ctx.strokeStyle = slab.stroke;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Highlight one structural edge in Champagne Gold
        const eIdx = slab.accentEdge;
        const pA = pts[eIdx];
        const pB = pts[(eIdx + 1) % pts.length];
        ctx.strokeStyle = clrs.accentLine;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(pA.px, pA.py);
        ctx.lineTo(pB.px, pB.py);
        ctx.stroke();

        // Small architectural node markers
        ctx.fillStyle = clrs.accentDot;
        ctx.beginPath();
        ctx.arc(pA.px, pA.py, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Subtle Concentric Golden-Ratio Elevation Arc
      const arcCenter = projectIso(0, 0, 0, cx, cy, rotY, rotX);
      ctx.strokeStyle = clrs.elevationArc;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.arc(arcCenter.px, arcCenter.py, 130, -Math.PI * 0.7, Math.PI * 0.35);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(arcCenter.px, arcCenter.py, 80, Math.PI * 0.2, Math.PI * 1.1);
      ctx.stroke();
      ctx.setLineDash([]);

      // 5. Technical Notation Marks
      ctx.fillStyle = clrs.text;
      ctx.font = '9px "Space Grotesk", monospace';
      const nodeA = projectIso(-100, -70, -40, cx, cy, rotY, rotX);
      ctx.fillText('EL +18.4m', nodeA.px + 8, nodeA.py - 6);
      const nodeB = projectIso(120, 50, 90, cx, cy, rotY, rotX);
      ctx.fillText('REF 0.0', nodeB.px + 8, nodeB.py + 4);

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
