
/* =============================================
   PENGUIN TECH LIMITED — main.js v2
   ============================================= */

(function() {
  'use strict';

  /* ─── NAV SCROLL ─── */
  const nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ─── MOBILE NAV ─── */
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-nav-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── HERO ANIMATION ─── */
  window.addEventListener('DOMContentLoaded', () => {
    const h1 = document.querySelector('.hero-headline h1');
    const desc = document.querySelector('.hero-descriptor');
    const actions = document.querySelector('.hero-actions');
    if (h1) setTimeout(() => h1.classList.add('animated'), 120);
    if (desc) setTimeout(() => desc.classList.add('animated'), 300);
    if (actions) setTimeout(() => actions.classList.add('animated'), 400);
  });

  /* ─── PARTICLE CANVAS ─── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('hero');
    let W = 0, H = 0, particles = [], rafId;

    // FIX: read from parent hero element, not canvas itself (canvas has no intrinsic size)
    function resize() {
      const rect = hero ? hero.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      W = canvas.width = Math.round(rect.width || window.innerWidth);
      H = canvas.height = Math.round(rect.height || window.innerHeight);
    }

    function Particle() { this.reset(); }
    Particle.prototype.reset = function() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r  = Math.random() * 1.4 + 0.4;
      this.alpha = Math.random() * 0.4 + 0.08;
    };
    Particle.prototype.update = function() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -5 || this.x > W + 5 || this.y < -5 || this.y > H + 5) this.reset();
    };
    Particle.prototype.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,87,255,' + this.alpha + ')';
      ctx.fill();
    };

    function init() {
      resize();
      particles = [];
      const count = Math.min(150, Math.round((W * H) / 8000));
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    const CONN = 150;

    function animate() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = dx*dx + dy*dy;
          if (d < CONN * CONN) {
            const dist = Math.sqrt(d);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(0,87,255,' + ((1 - dist/CONN) * 0.12) + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(animate);
    }

    // FIX: wait for layout paint before reading dimensions
    requestAnimationFrame(function() {
      init();
      animate();
    });

    window.addEventListener('resize', function() {
      cancelAnimationFrame(rafId);
      init();
      animate();
    }, { passive: true });
  }

  /* ─── SCROLL REVEAL ─── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ─── COUNTER ANIMATION ─── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const isFloat = target % 1 !== 0;
    const duration = 1800;
    const startTime = performance.now();
    function step(now) {
      const elapsed = Math.min(now - startTime, duration);
      const progress = 1 - Math.pow(1 - elapsed / duration, 4);
      const val = target * progress;
      el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
      if (elapsed < duration) requestAnimationFrame(step);
      else el.textContent = prefix + (isFloat ? target.toFixed(1) : target) + suffix;
    }
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('.counter-val');
  if (counters.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          counterObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));
  }

  /* ─── FAQ ACCORDION ─── */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const row = q.closest('.faq-row');
      const isOpen = row.classList.contains('open');
      document.querySelectorAll('.faq-row.open').forEach(r => r.classList.remove('open'));
      if (!isOpen) row.classList.add('open');
    });
  });

  /* ─── WORK FILTER ─── */
  const filterBtns = document.querySelectorAll('.work-filter-btn');
  const workItems = document.querySelectorAll('.work-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      workItems.forEach(item => {
        const visible = cat === 'all' || item.dataset.cat === cat;
        item.style.display = visible ? '' : 'none';
      });
    });
  });

  /* ─── MODAL ─── */
  const backdrop = document.getElementById('modal-backdrop');
  const modalForm = document.getElementById('modal-form');
  const modalSuccess = document.getElementById('modal-success');

  document.querySelectorAll('[data-modal]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  document.getElementById('modal-close')?.addEventListener('click', () => {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  });

  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  modalForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    modalForm.style.display = 'none';
    modalSuccess.classList.add('show');
    setTimeout(() => {
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => {
        modalForm.style.display = '';
        modalSuccess.classList.remove('show');
        modalForm.reset();
      }, 600);
    }, 3000);
  });

  /* ─── SMOOTH SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
