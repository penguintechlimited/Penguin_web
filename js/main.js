/**
 * Penguin Tech Limited - Main Engine & Interactive Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize background particle engine
  initParticleCanvas();

  // Initialize Estimator
  if (window.initEstimator) {
    window.initEstimator();
  }

  // Initialize Flywheel Interactive Controls
  initFlywheel();

  // Initialize Stat Counter Animation
  initStatCounters();

  // Initialize Case Study Filter Tabs
  initCaseStudyTabs();

  // Initialize FAQ Accordion
  initFaqAccordion();

  // Initialize Proposal Modal
  initProposalModal();

  // Initialize Mobile Menu
  initMobileMenu();

  // Initialize Smooth Scroll for Navigation Links
  initSmoothNav();
});

/* 1. Particle Canvas Background */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 75;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.8 + 0.8;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.color = Math.random() > 0.3 ? '#00f0ff' : '#8b5cf6';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let mouseX = -1000;
  let mouseY = -1000;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#00f0ff';
          ctx.globalAlpha = (1 - dist / 120) * 0.15;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    // Connect to mouse cursor
    for (let i = 0; i < particles.length; i++) {
      const dx = mouseX - particles[i].x;
      const dy = mouseY - particles[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = '#38bdf8';
        ctx.globalAlpha = (1 - dist / 150) * 0.25;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      particles[i].update();
      particles[i].draw();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }

  animate();
}

/* 2. Interactive Flywheel Component */
function initFlywheel() {
  const steps = document.querySelectorAll('.flywheel-step');
  const details = document.querySelectorAll('.flywheel-detail');

  if (!steps.length) return;

  steps.forEach(step => {
    step.addEventListener('click', () => {
      const targetId = step.getAttribute('data-flywheel-target');

      steps.forEach(s => s.classList.remove('active', 'border-cyan-400', 'bg-cyan-950/40'));
      step.classList.add('active', 'border-cyan-400', 'bg-cyan-950/40');

      details.forEach(d => {
        if (d.id === targetId) {
          d.classList.remove('hidden');
          d.classList.add('flex');
        } else {
          d.classList.add('hidden');
          d.classList.remove('flex');
        }
      });
    });
  });
}

/* 3. Number Counter Animation */
function initStatCounters() {
  const counters = document.querySelectorAll('.counter-stat');
  let animated = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const isDecimal = target % 1 !== 0;
      let count = 0;
      const duration = 2000;
      const stepTime = 30;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;

      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          count = target;
          clearInterval(timer);
        }
        counter.textContent = prefix + (isDecimal ? count.toFixed(1) : Math.floor(count)) + suffix;
      }, stepTime);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        runCounters();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('agency-metrics');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* 4. Case Study Filter Tabs */
function initCaseStudyTabs() {
  const tabs = document.querySelectorAll('.case-tab-btn');
  const cards = document.querySelectorAll('.case-study-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');

      tabs.forEach(t => {
        t.classList.remove('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-400');
        t.classList.add('text-slate-400', 'border-slate-800');
      });
      tab.classList.add('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-400');
      tab.classList.remove('text-slate-400', 'border-slate-800');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.classList.add('block');
        } else {
          card.classList.add('hidden');
          card.classList.remove('block');
        }
      });
    });
  });
}

/* 5. FAQ Accordions */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');

      // Close all others
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });
}

/* 6. Multi-Step Proposal / Consultation Modal */
function initProposalModal() {
  const modal = document.getElementById('booking-modal');
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  const form = document.getElementById('agency-intake-form');
  const step1 = document.getElementById('modal-step-1');
  const step2 = document.getElementById('modal-step-2');
  const successState = document.getElementById('modal-step-success');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
      }
    });
  });

  const nextBtn = document.getElementById('modal-next-btn');
  const backBtn = document.getElementById('modal-back-btn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (step1 && step2) {
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
      }
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (step1 && step2) {
        step2.classList.add('hidden');
        step1.classList.remove('hidden');
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('modal-submit-btn');
      if (submitBtn) {
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-black inline" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Generating Architecture Blueprint...
        `;
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        if (step2 && successState) {
          step2.classList.add('hidden');
          successState.classList.remove('hidden');
        }
      }, 1200);
    });
  }
}

/* 7. Mobile Menu */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');

  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });

    const links = menu.querySelectorAll('a');
    links.forEach(l => {
      l.addEventListener('click', () => {
        menu.classList.add('hidden');
      });
    });
  }
}

/* 8. Smooth Nav Scroll */
function initSmoothNav() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
