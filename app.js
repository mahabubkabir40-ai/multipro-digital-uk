(function () {
  'use strict';

  // Mobile Menu Toggle
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Interactive UK m² Cost Estimator
  const TRADE_CONFIG = {
    driveway: {
      label: 'Resin-Bound Driveway (SuDS Compliant)',
      minArea: 20,
      maxArea: 180,
      defaultArea: 50,
      specs: [
        {
          id: 'overlay',
          title: 'Overlay on Sound Base',
          subtitle: 'Existing concrete / tarmac base',
          lowRate: 95,
          highRate: 120
        },
        {
          id: 'full',
          title: 'Full Excavation & MOT Type 3',
          subtitle: 'New permeable sub-base + edging',
          lowRate: 135,
          highRate: 165
        }
      ],
      note: 'Shows homeowners realistic UK £100–£165/m² SuDS resin pricing online so you stop driving 40 minutes to quote £1,500 tyre-kickers.'
    },
    flooring: {
      label: 'Resin & Epoxy Flooring (Domestic / Commercial)',
      minArea: 20,
      maxArea: 250,
      defaultArea: 45,
      specs: [
        {
          id: 'garage',
          title: 'Domestic Garage Flake System',
          subtitle: 'Diamond grind + moisture barrier + flake',
          lowRate: 65,
          highRate: 90
        },
        {
          id: 'commercial',
          title: 'Commercial / Heavy-Duty PU Screed',
          subtitle: 'Warehouse, workshop or food-grade resin',
          lowRate: 85,
          highRate: 125
        }
      ],
      note: 'Pre-educates UK homeowners and facility managers on proper diamond grinding & DPM prep costs instead of £200 DIY floor paint.'
    },
    concrete: {
      label: 'Polished Concrete & Microcement',
      minArea: 20,
      maxArea: 200,
      defaultArea: 60,
      specs: [
        {
          id: 'polished',
          title: 'Mechanically Polished Concrete',
          subtitle: 'Multi-stage diamond polish + densifier',
          lowRate: 95,
          highRate: 135
        },
        {
          id: 'microcement',
          title: 'Seamless Architectural Microcement',
          subtitle: 'Kitchens, extensions & luxury floors',
          lowRate: 115,
          highRate: 160
        }
      ],
      note: 'Qualifies high-end architectural enquiries (£5,000–£18,000+) before you spend hours preparing bespoke sample boards.'
    }
  };

  const estimatorEl = document.querySelector('[data-estimator]');
  if (estimatorEl) {
    let activeTrade = estimatorEl.getAttribute('data-default-trade') || 'driveway';
    if (!TRADE_CONFIG[activeTrade]) activeTrade = 'driveway';
    let activeSpecIdx = 0;

    const tabBtns = estimatorEl.querySelectorAll('[data-trade-tab]');
    const slider = estimatorEl.querySelector('[data-area-slider]');
    const areaReadout = estimatorEl.querySelector('[data-area-readout]');
    const specContainer = estimatorEl.querySelector('[data-spec-options]');
    const priceRangeEl = estimatorEl.querySelector('[data-price-range]');
    const rateDetailEl = estimatorEl.querySelector('[data-rate-detail]');
    const whyBoxEl = estimatorEl.querySelector('[data-why-box]');
    const maxScaleEl = estimatorEl.querySelector('[data-max-scale]');

    const formatGBP = (num) => '£' + (Math.round(num / 50) * 50).toLocaleString('en-GB');

    function renderSpecs() {
      const cfg = TRADE_CONFIG[activeTrade];
      specContainer.innerHTML = '';
      cfg.specs.forEach((spec, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'spec-btn' + (idx === activeSpecIdx ? ' active' : '');
        btn.innerHTML = `<strong>${spec.title}</strong><span>${spec.subtitle}</span>`;
        btn.addEventListener('click', () => {
          activeSpecIdx = idx;
          renderSpecs();
          calculate();
        });
        specContainer.appendChild(btn);
      });
    }

    function calculate() {
      const cfg = TRADE_CONFIG[activeTrade];
      const spec = cfg.specs[activeSpecIdx] || cfg.specs[0];
      const area = parseInt(slider.value, 10) || cfg.defaultArea;

      // Apply slight realistic economy of scale on larger m² jobs
      const scaleFactor = area >= 100 ? 0.92 : 1.0;
      const lowTotal = Math.max(1800, area * spec.lowRate * scaleFactor);
      const highTotal = Math.max(2400, area * spec.highRate * scaleFactor);

      areaReadout.textContent = `${area} m²`;
      priceRangeEl.textContent = `${formatGBP(lowTotal)} – ${formatGBP(highTotal)}`;
      rateDetailEl.textContent = `${cfg.label} • Approx. £${spec.lowRate}–£${spec.highRate}/m²`;
      whyBoxEl.innerHTML = `<strong>Why contractors love this on their site:</strong> ${cfg.note}`;
    }

    function setTrade(tradeKey) {
      activeTrade = tradeKey;
      activeSpecIdx = 0;
      const cfg = TRADE_CONFIG[activeTrade];
      tabBtns.forEach((b) => {
        const isActive = b.getAttribute('data-trade-tab') === activeTrade;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', String(isActive));
      });
      slider.min = cfg.minArea;
      slider.max = cfg.maxArea;
      slider.value = cfg.defaultArea;
      if (maxScaleEl) maxScaleEl.textContent = `${cfg.maxArea} m²`;
      renderSpecs();
      calculate();
    }

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        setTrade(btn.getAttribute('data-trade-tab'));
      });
    });

    slider.addEventListener('input', calculate);
    setTrade(activeTrade);
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        openItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // 60-Second Audit Form Submission (AJAX via FormSubmit -> mahabub@multiprodigital.co.uk)
  document.querySelectorAll('[data-audit-form]').forEach((form) => {
    const tsField = form.querySelector('input[name="_ts"]');
    if (tsField) tsField.value = String(Date.now());

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const feedback = form.querySelector('[data-form-feedback]');
      const submitBtn = form.querySelector('button[type="submit"]');
      const honey = form.querySelector('input[name="_honey"]');

      // Anti-spam honeypot check
      if (honey && honey.value.trim() !== '') {
        return;
      }

      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Request...';
      feedback.className = 'form-feedback';
      feedback.textContent = '';

      const formData = new FormData(form);
      const payload = {};
      formData.forEach((value, key) => {
        if (key !== '_honey' && key !== '_ts') {
          payload[key] = value;
        }
      });

      try {
        const res = await fetch('https://formsubmit.co/ajax/mahabub@multiprodigital.co.uk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          feedback.className = 'form-feedback success';
          feedback.textContent = 'Audit request received! Mahabub will record your 60-second video breakdown and email it within 1 working day.';
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      } catch (err) {
        feedback.className = 'form-feedback error';
        feedback.innerHTML = 'Could not send automatically right now. Please email <a href="mailto:mahabub@multiprodigital.co.uk" style="text-decoration:underline;color:#9afb16;">mahabub@multiprodigital.co.uk</a> with your website URL and town.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  });
})();
