
/* =============================================
   PENGUIN TECH LIMITED — main.js v5
   Dynamic Canvas, Mobile Navigation & UI Engine
   ============================================= */

(function() {
  'use strict';

  /* ─── NAV SCROLL & BLUR ─── */
  const nav = document.getElementById('nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 25);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ─── MOBILE NAV MENU ─── */
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-nav-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── HERO WORD ENTRANCE ANIMATION ─── */
  window.addEventListener('DOMContentLoaded', () => {
    const h1 = document.querySelector('.hero-headline h1');
    const desc = document.querySelector('.hero-descriptor');
    const actions = document.querySelector('.hero-actions');
    if (h1) setTimeout(() => h1.classList.add('animated'), 60);
    if (desc) setTimeout(() => desc.classList.add('animated'), 180);
    if (actions) setTimeout(() => actions.classList.add('animated'), 280);
  });

  /* ─── INTERACTIVE PARTICLE & CONSTELLATION CANVAS (FB BLUE) ─── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('hero');
    let W = 0, H = 0, particles = [], rafId;
    let mouse = { x: -1000, y: -1000, radius: 150 };

    function resize() {
      const rect = hero ? hero.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      W = canvas.width = Math.round(rect.width || window.innerWidth);
      H = canvas.height = Math.round(rect.height || window.innerHeight);
    }

    function Particle() { this.reset(); }
    Particle.prototype.reset = function() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      const isMobile = window.innerWidth < 768;
      this.vx = (Math.random() - 0.5) * (isMobile ? 0.22 : 0.35);
      this.vy = (Math.random() - 0.5) * (isMobile ? 0.22 : 0.35);
      this.r  = Math.random() * 1.5 + 0.6;
      this.baseAlpha = Math.random() * 0.32 + 0.12;
      this.alpha = this.baseAlpha;
    };
    Particle.prototype.update = function() {
      this.x += this.vx;
      this.y += this.vy;

      // Mouse proximity interaction (desktop)
      if (mouse.x > 0 && mouse.y > 0) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 0.7;
          this.x -= (dx / dist) * force;
          this.y -= (dy / dist) * force;
          this.alpha = Math.min(0.75, this.baseAlpha + (1 - dist / mouse.radius) * 0.45);
        } else {
          this.alpha = this.baseAlpha;
        }
      }

      if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) this.reset();
    };
    Particle.prototype.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(24,119,242,' + this.alpha + ')';
      ctx.fill();
    };

    function init() {
      resize();
      particles = [];
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 30 : Math.min(100, Math.max(40, Math.round((W * H) / 11000)));
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      const isMobile = window.innerWidth < 768;
      const CONN = isMobile ? 90 : 130;
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = dx * dx + dy * dy;
          if (d < CONN * CONN) {
            const dist = Math.sqrt(d);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const lineAlpha = (1 - dist / CONN) * 0.15;
            ctx.strokeStyle = 'rgba(24,119,242,' + lineAlpha + ')';
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', (e) => {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      if (e.clientY <= rect.bottom) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

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

  /* ─── SCROLL REVEAL OBSERVER ─── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ─── COUNTER ANIMATION ─── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1600;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(ease * target * 10) / 10;
      el.textContent = prefix + (Number.isInteger(target) ? Math.round(ease * target) : current) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('.counter-val');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          counterObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ─── FAQ ACCORDION ─── */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const row = q.closest('.faq-row');
      const wasOpen = row.classList.contains('open');
      document.querySelectorAll('.faq-row').forEach(r => r.classList.remove('open'));
      if (!wasOpen) row.classList.add('open');
    });
  });

  /* ─── WORK CATEGORY FILTER ─── */
  const filterBtns = document.querySelectorAll('.work-filter-btn');
  const workItems  = document.querySelectorAll('.work-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      workItems.forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) {
          item.style.display = 'flex';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'translateY(0)'; }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(15px)';
          setTimeout(() => { item.style.display = 'none'; }, 200);
        }
      });
    });
  });

  /* ─── MODAL TRIGGER & FORM SUBMISSION ─── */
  const modal = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalForm = document.getElementById('modal-form');
  const modalFormWrap = document.getElementById('modal-form-wrap');
  const modalSuccess = document.getElementById('modal-success');

  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (modalSuccess) modalSuccess.classList.remove('show');
      if (modalFormWrap) modalFormWrap.style.display = 'block';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (modalFormWrap) modalFormWrap.style.display = 'none';
      if (modalSuccess) modalSuccess.classList.add('show');
    });
  }

  /* ─── QUICK SERVICE CARD TO ESTIMATOR JUMP ─── */
  window.jumpToEstimator = function(cat) {
    const radio = document.querySelector(`input[name="est-cat"][value="${cat}"]`);
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change'));
    }
    const estSection = document.getElementById('estimator');
    if (estSection) {
      estSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

})();
