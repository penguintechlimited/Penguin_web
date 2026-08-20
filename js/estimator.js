
/* =============================================
   PENGUIN TECH LIMITED — estimator.js v3
   Bangladesh Market — BDT Pricing
   ============================================= */

(function() {
  'use strict';

  const data = {
    web: {
      label: 'Web Development',
      tiers: [
        { name: 'Landing Page (Single Page)', price: 6000,   delivery: '3-5 days',   scope: 'High-converting 1-page site, mobile-first, SEO-ready' },
        { name: 'Landing Page Pro',           price: 12000,  delivery: '5-7 days',   scope: 'Advanced animations, lead form, analytics integration' },
        { name: 'Brochure / Business Site',   price: 22000,  delivery: '10-14 days', scope: '5-8 pages, CMS, contact forms, Google Maps' },
        { name: 'Corporate Website',          price: 45000,  delivery: '3-4 weeks',  scope: '10+ pages, blog, admin panel, SEO setup' },
        { name: 'Enterprise Web Platform',    price: 90000,  delivery: '6-8 weeks',  scope: 'Custom portal, multi-user, API integrations, full CMS' },
      ]
    },
    ecom: {
      label: 'E-Commerce',
      tiers: [
        { name: 'Starter Store',     price: 35000,  delivery: '2-3 weeks',  scope: 'Up to 50 products, bKash/Nagad/Card payment, mobile-first' },
        { name: 'Growth Store',      price: 70000,  delivery: '4-5 weeks',  scope: '50-500 products, advanced filters, discount engine, inventory' },
        { name: 'Multi-Vendor Store',price: 120000, delivery: '6-8 weeks',  scope: 'Marketplace model, vendor panel, commission management' },
        { name: 'Enterprise Commerce',price:180000, delivery: '8-12 weeks', scope: 'ERP integration, multi-currency, logistics API, custom reports' },
      ]
    },
    app: {
      label: 'Mobile App',
      tiers: [
        { name: 'MVP App',        price: 90000,  delivery: '6-8 weeks',   scope: 'iOS + Android, core features, push notifications' },
        { name: 'Growth App',     price: 175000, delivery: '10-14 weeks', scope: 'Full features, analytics dashboard, in-app payments' },
        { name: 'Super App',      price: 280000, delivery: '14-20 weeks', scope: 'Complex workflows, offline mode, live tracking, admin panel' },
        { name: 'Enterprise App', price: 400000, delivery: '20-28 weeks', scope: 'Custom backend, white-label, multi-tenant, enterprise security' },
      ]
    },
    marketing: {
      label: 'Digital Marketing',
      tiers: [
        { name: 'Social Media Starter',      price: 8000,  delivery: 'Monthly retainer', scope: 'Facebook + Instagram, 20 posts/mo, community management' },
        { name: 'Performance Ads Pack',      price: 20000, delivery: 'Monthly retainer', scope: 'Facebook + Google Ads, up to ৳50k ad budget managed' },
        { name: 'Growth Marketing Engine',   price: 35000, delivery: 'Monthly retainer', scope: 'SMM + Ads + SEO + monthly analytics report' },
        { name: 'Full-Stack Growth Partner', price: 60000, delivery: 'Monthly retainer', scope: 'All channels + CRO + content + influencer + bi-weekly calls' },
      ]
    },
    design: {
      label: 'UI/UX & Branding',
      tiers: [
        { name: 'Logo & Basic Brand Kit',    price: 5000,  delivery: '3-5 days',   scope: 'Logo (3 concepts), business card, brand colors & fonts' },
        { name: 'Full Brand Identity',       price: 15000, delivery: '7-10 days',  scope: 'Logo, brand guide, stationery, social media kit' },
        { name: 'Website UI/UX Design',      price: 18000, delivery: '7-12 days',  scope: 'Figma prototype, desktop + mobile, up to 10 screens' },
        { name: 'App UI/UX Design',          price: 28000, delivery: '10-16 days', scope: 'Full app flow in Figma, design system, handoff-ready' },
      ]
    },
    seo: {
      label: 'SEO & Content',
      tiers: [
        { name: 'Local SEO Starter',      price: 8000,  delivery: 'Monthly retainer', scope: 'Google My Business, local citations, 4 blog posts/mo' },
        { name: 'National SEO Growth',    price: 18000, delivery: 'Monthly retainer', scope: 'Keyword research, on-page + off-page SEO, 8 blogs/mo' },
        { name: 'E-Commerce SEO',         price: 25000, delivery: 'Monthly retainer', scope: 'Product SEO, category pages, schema markup, 10 blogs/mo' },
        { name: 'Content Strategy Full',  price: 35000, delivery: 'Monthly retainer', scope: 'SEO + Copywriting + Video scripts + Email sequences' },
      ]
    },
    automation: {
      label: 'Automation & Analytics',
      tiers: [
        { name: 'WhatsApp Business Bot',    price: 15000, delivery: '5-7 days',  scope: 'Auto-replies, lead capture, order updates via WhatsApp' },
        { name: 'CRM & Lead Automation',    price: 25000, delivery: '7-10 days', scope: 'Lead scoring, email sequences, pipeline automation' },
        { name: 'Business Dashboard',       price: 35000, delivery: '10-14 days',scope: 'Custom analytics portal, sales KPIs, live data reports' },
        { name: 'Full Automation Stack',    price: 60000, delivery: '3-4 weeks', scope: 'CRM + WhatsApp + Dashboard + n8n workflows + training' },
      ]
    }
  };

  const speedMultipliers = { 1: 1, 2: 1.18, 3: 1.38 };
  const speedLabels      = { 1: 'Standard', 2: 'Priority (+18%)', 3: 'Rush (+38%)' };

  const catRadios  = document.querySelectorAll('input[name="est-cat"]');
  const tierSelect = document.getElementById('est-tier');
  const speedRange = document.getElementById('est-speed');
  const speedVal   = document.getElementById('est-speed-val');
  const priceEl    = document.getElementById('est-price');
  const priceSfx   = document.getElementById('est-price-suffix');
  const rowTier    = document.getElementById('est-row-tier');
  const rowDel     = document.getElementById('est-row-delivery');
  const rowScope   = document.getElementById('est-row-scope');
  const rowTotal   = document.getElementById('est-row-total');

  if (!tierSelect) return;

  function getCat() {
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

  function fmt(n) {
    return n.toLocaleString('en-BD');
  }

  function update() {
    const cat  = getCat();
    const idx  = parseInt(tierSelect.value) || 0;
    const spd  = parseInt(speedRange ? speedRange.value : 1) || 1;
    const tier = data[cat].tiers[idx];
    const mul  = speedMultipliers[spd] || 1;
    const price = Math.round(tier.price * mul / 100) * 100;
    const isRetainer = tier.delivery.includes('Monthly');

    if (speedVal)  speedVal.textContent  = speedLabels[spd];
    if (priceEl)   priceEl.textContent   = '\u09F3' + fmt(price);
    if (priceSfx)  priceSfx.textContent  = isRetainer ? '/mo' : '';
    if (rowTier)   rowTier.textContent   = tier.name;
    if (rowDel)    rowDel.textContent    = tier.delivery;
    if (rowScope)  rowScope.textContent  = tier.scope;
    if (rowTotal)  rowTotal.textContent  = '\u09F3' + fmt(price) + (isRetainer ? '/mo' : '');
  }

  catRadios.forEach(r => { r.addEventListener('change', () => { populateTiers(r.value); update(); }); });
  tierSelect.addEventListener('change', update);
  speedRange && speedRange.addEventListener('input', update);

  populateTiers(getCat());
  update();
})();
