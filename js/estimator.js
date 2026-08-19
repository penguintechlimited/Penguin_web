/**
 * Penguin Tech Limited - Interactive Project Scope & ROI Estimator
 * Calculates estimated development sprints, deliverables, and projected revenue growth
 */

const ESTIMATOR_DATA = {
  web: {
    basePrice: 3500,
    baseDays: 14,
    tiers: {
      landing: { name: "High-Converting Landing Page", mult: 1, roi: "3.5x - 5x Conversion Lift", sprint: "1-2 Weeks" },
      ecommerce: { name: "Full-Scale E-Commerce Store", mult: 2.2, roi: "$40k - $250k Monthly Run-Rate", sprint: "3-5 Weeks" },
      corporate: { name: "Enterprise Corporate Platform", mult: 1.8, roi: "2.8x Lead Quality Surge", sprint: "3-4 Weeks" }
    }
  },
  app: {
    basePrice: 6500,
    baseDays: 28,
    tiers: {
      mvp: { name: "Cross-Platform MVP (iOS & Android)", mult: 1, roi: "Rapid Go-To-Market & Retention", sprint: "4-6 Weeks" },
      booking: { name: "On-Demand / Booking Platform", mult: 1.6, roi: "Automates 80% Booking Ops", sprint: "6-8 Weeks" },
      enterprise: { name: "Custom SaaS / Fintech Application", mult: 2.5, roi: "Enterprise Scale & Sub-50ms Latency", sprint: "8-12 Weeks" }
    }
  },
  marketing: {
    basePrice: 2000,
    baseDays: 30,
    tiers: {
      social: { name: "Social Content & Brand Authority", mult: 1, roi: "+250% Organic Engagement", sprint: "Monthly Retainer" },
      ads: { name: "Performance Meta & Google Ads", mult: 1.5, roi: "3.5x - 7.2x Target ROAS", sprint: "Monthly Retainer" },
      full_growth: { name: "Full Scale Growth Engine (Ads + Content + CRO)", mult: 2.4, roi: "$100k+ Incremental Pipeline", sprint: "Monthly Retainer" }
    }
  },
  ecosystem: {
    basePrice: 9500,
    baseDays: 45,
    tiers: {
      hybrid: { name: "Web Infrastructure + Paid Ads Engine", mult: 1.2, roi: "Full Flywheel: 4.8x Expected Blended ROAS", sprint: "Complete Sprint + Retainer" },
      omnichannel: { name: "Web + Mobile App + Performance Retainer", mult: 1.8, roi: "Unfair Market Advantage & Omnichannel Scale", sprint: "End-to-End Agency Blueprint" }
    }
  }
};

function calculateEstimate() {
  const category = document.querySelector('input[name="estimator-category"]:checked')?.value || 'web';
  const tierSelect = document.getElementById('estimator-tier');
  const speedSlider = document.getElementById('estimator-speed');
  const speedVal = parseInt(speedSlider?.value || 1);

  if (!tierSelect) return;

  const currentCategoryData = ESTIMATOR_DATA[category];
  const selectedTierKey = tierSelect.value;
  const tierData = currentCategoryData.tiers[selectedTierKey] || Object.values(currentCategoryData.tiers)[0];

  // Base math
  let price = currentCategoryData.basePrice * tierData.mult;
  
  // Speed multiplier
  if (speedVal === 2) {
    price *= 1.25; // Priority Turbo sprint
  }

  // Display updates
  const priceDisplay = document.getElementById('est-price-display');
  const sprintDisplay = document.getElementById('est-sprint-display');
  const roiDisplay = document.getElementById('est-roi-display');
  const deliverablesList = document.getElementById('est-deliverables-list');

  if (priceDisplay) {
    priceDisplay.textContent = `$${Math.round(price).toLocaleString()}` + (category === 'marketing' ? '/mo' : '');
  }

  if (sprintDisplay) {
    sprintDisplay.textContent = speedVal === 2 ? `${tierData.sprint} (Expedited Sprint)` : tierData.sprint;
  }

  if (roiDisplay) {
    roiDisplay.textContent = tierData.roi;
  }

  // Populate dynamic deliverables
  if (deliverablesList) {
    let items = [];
    if (category === 'web') {
      items = [
        "Sub-second TTFB & Core Web Vitals 95+ score",
        "Conversion-engineered UI/UX Architecture",
        "Integrated Analytics & Meta Pixel / GA4 Setup",
        "CI/CD Pipeline to Vercel/Cloudflare"
      ];
    } else if (category === 'app') {
      items = [
        "Native iOS & Android compilation (React Native/Flutter)",
        "Secure API Layer & Database architecture",
        "Push Notifications & Frictionless Auth Flow",
        "App Store & Google Play submission readiness"
      ];
    } else if (category === 'marketing') {
      items = [
        "Weekly High-ROAS Creative Ad Testing",
        "Full Funnel Retargeting & Lookalike Audience Engine",
        "Bi-weekly Strategy Reviews & Conversion Optimization",
        "Live Datadog / Looker Performance Dashboard"
      ];
    } else {
      items = [
        "Complete Web/App Digital Infrastructure Build",
        "Automated n8n Operations & Lead routing",
        "Dedicated Growth Strategist & Paid Ads Deployment",
        "Weekly Scale Sprints & Zero-Fluff Executive Reporting"
      ];
    }

    deliverablesList.innerHTML = items.map(item => `
      <li class="flex items-center space-x-2 text-sm text-slate-300">
        <svg class="w-4 h-4 text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
        <span>${item}</span>
      </li>
    `).join('');
  }
}

function updateTierOptions() {
  const category = document.querySelector('input[name="estimator-category"]:checked')?.value || 'web';
  const tierSelect = document.getElementById('estimator-tier');
  if (!tierSelect) return;

  const categoryData = ESTIMATOR_DATA[category];
  tierSelect.innerHTML = '';

  for (const [key, tier] of Object.entries(categoryData.tiers)) {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = tier.name;
    tierSelect.appendChild(opt);
  }

  calculateEstimate();
}

window.initEstimator = function() {
  const catInputs = document.querySelectorAll('input[name="estimator-category"]');
  catInputs.forEach(input => {
    input.addEventListener('change', () => {
      updateTierOptions();
    });
  });

  const tierSelect = document.getElementById('estimator-tier');
  if (tierSelect) {
    tierSelect.addEventListener('change', calculateEstimate);
  }

  const speedSlider = document.getElementById('estimator-speed');
  if (speedSlider) {
    speedSlider.addEventListener('input', calculateEstimate);
  }

  updateTierOptions();
};
