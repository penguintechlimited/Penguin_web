
/* =============================================
   PENGUIN TECH LIMITED — estimator.js v2
   ============================================= */

(function() {
  'use strict';

  const data = {
    web: {
      label: 'Web & Landing Pages',
      tiers: [
        { name: 'High-Converting Landing Page', price: 250, delivery: '5-7 days', scope: 'Single page, CRO-optimised, SEO setup' },
        { name: 'Brochure / Corporate Site', price: 600, delivery: '10-14 days', scope: '5-8 pages, CMS, contact forms' },
        { name: 'Full Corporate Website', price: 1500, delivery: '3-4 weeks', scope: '10+ pages, blog, integrations' },
      ]
    },
    ecom: {
      label: 'E-Commerce',
      tiers: [
        { name: 'Starter Store', price: 1200, delivery: '2-3 weeks', scope: 'Up to 50 products, payment gateway, mobile-first' },
        { name: 'Growth Store', price: 2500, delivery: '4-5 weeks', scope: '50-500 products, advanced filters, loyalty system' },
        { name: 'Enterprise Commerce', price: 5000, delivery: '6-10 weeks', scope: 'Unlimited SKUs, custom ERP/API, multi-currency' },
      ]
    },
    app: {
      label: 'Mobile Applications',
      tiers: [
        { name: 'MVP App', price: 3000, delivery: '6-8 weeks', scope: 'iOS + Android, core features, push notifications' },
        { name: 'Growth App', price: 6000, delivery: '10-14 weeks', scope: 'Full feature set, analytics, in-app purchases' },
        { name: 'Enterprise App', price: 12000, delivery: '16-24 weeks', scope: 'Custom backend, CMS, white-label ready' },
      ]
    },
    marketing: {
      label: 'Digital Marketing',
      tiers: [
        { name: 'Social Media Starter', price: 350, delivery: 'Monthly retainer', scope: '4 platforms, 20 posts/mo, community management' },
        { name: 'Performance Growth Pack', price: 800, delivery: 'Monthly retainer', scope: 'Meta + Google Ads, up to $5k ad budget managed' },
        { name: 'Full-Stack Growth Engine', price: 2000, delivery: 'Monthly retainer', scope: 'SMM + Ads + SEO + CRO + Monthly reporting' },
      ]
    }
  };

  const speedMultipliers = { 1: 1, 2: 1.15, 3: 1.35 };
  const speedLabels = { 1: 'Standard', 2: 'Priority (+15%)', 3: 'Rush (+35%)' };

  const catRadios = document.querySelectorAll('input[name="est-cat"]');
  const tierSelect = document.getElementById('est-tier');
  const speedRange = document.getElementById('est-speed');
  const speedVal = document.getElementById('est-speed-val');
  const priceEl = document.getElementById('est-price');
  const priceSuffix = document.getElementById('est-price-suffix');
  const rowTier = document.getElementById('est-row-tier');
  const rowDelivery = document.getElementById('est-row-delivery');
  const rowScope = document.getElementById('est-row-scope');
  const rowTotal = document.getElementById('est-row-total');

  if (!tierSelect) return;

  function getCategory() {
    for (const r of catRadios) { if (r.checked) return r.value; }
    return 'web';
  }

  function populateTiers(cat) {
    tierSelect.innerHTML = '';
    data[cat].tiers.forEach((t, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = t.name;
      tierSelect.appendChild(opt);
    });
  }

  function update() {
    const cat = getCategory();
    const tierIdx = parseInt(tierSelect.value) || 0;
    const speed = parseInt(speedRange?.value) || 1;
    const tier = data[cat].tiers[tierIdx];
    const mul = speedMultipliers[speed] || 1;
    const price = Math.round(tier.price * mul);

    const isRetainer = tier.delivery.includes('Monthly');
    speedVal.textContent = speedLabels[speed];
    priceEl.textContent = '$' + price.toLocaleString();
    priceSuffix.textContent = isRetainer ? '/mo' : '';

    if (rowTier) rowTier.textContent = tier.name;
    if (rowDelivery) rowDelivery.textContent = tier.delivery;
    if (rowScope) rowScope.textContent = tier.scope;
    if (rowTotal) rowTotal.textContent = '$' + price.toLocaleString() + (isRetainer ? '/mo' : '');
  }

  catRadios.forEach(r => {
    r.addEventListener('change', () => {
      populateTiers(r.value);
      update();
    });
  });

  tierSelect.addEventListener('change', update);
  speedRange?.addEventListener('input', update);

  // Init
  populateTiers(getCategory());
  update();

})();
