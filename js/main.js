
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
    let W, H, particles = [], rafId;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function Particle() {
      this.reset();
    }
    Particle.prototype.reset = function() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 1.2 + 0.3;
      this.alpha = Math.random() * 0.35 + 0.05;
    };
    Particle.prototype.update = function() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    };
    Particle.prototype.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,240,255,${this.alpha})`;
      ctx.fill();
    };

    function init() {
      resize();
      particles = Array.from({ length: 120 }, () => new Particle());
    }

    const CONNECTION_DIST = 140;

    function animate() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < CONNECTION_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,240,255,${(1 - d/CONNECTION_DIST) * 0.09})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(animate);
    }

    init();
    animate();
    window.addEventListener('resize', () => { cancelAnimationFrame(rafId); init(); animate(); });
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
