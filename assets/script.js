// Mobile nav toggle
document.addEventListener('DOMContentLoaded',()=>{
  const menuBtn=document.querySelector('.menu-btn');
  const navlinks=document.querySelector('.navlinks');
  if(menuBtn){menuBtn.addEventListener('click',()=>navlinks.classList.toggle('open'));}
  navlinks?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navlinks.classList.remove('open')));

  // Reveal on scroll
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target);} });
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

  // ── SOLAR SAVINGS CALCULATOR ──────────────────────────────────────
  // Real Indian / Tamil Nadu data:
  //  • Average Tamil Nadu peak sun hours: 5.5 h/day
  //  • System efficiency factor: 0.78
  //  • Units per kW per year = 5.5 × 365 × 0.78 ≈ 1,566 → we use 1,500 (conservative)
  //  • Average Tamil Nadu residential tariff: ₹7.5/unit (post-slab blended)
  //  • Commercial/Industrial tariff: ₹9/unit
  //  • Agricultural: ₹3/unit (subsidised)
  //  • CO₂ emission factor (India grid, CEA 2023): 0.716 kg CO₂/kWh

  const tariffMap = {
    'Residential': 7.5,
    'Commercial':  9.0,
    'Industrial':  9.5,
    'Agricultural':3.0,
    'Institutional':8.0
  };

  const calcForm = document.getElementById('calcForm');
  if(calcForm){
    calcForm.addEventListener('submit', e => {
      e.preventDefault();
      const bill     = parseFloat(document.getElementById('bill').value) || 0;
      const propType = document.getElementById('propType').value;
      const tariff   = tariffMap[propType] || 7.5;

      // Step 1 – monthly consumption in units
      const monthlyUnits = bill / tariff;

      // Step 2 – required system size in kW
      // Daily consumption = monthlyUnits / 30; System size = daily / (5.5 × 0.78)
      const dailyUnits   = monthlyUnits / 30;
      const systemKW     = dailyUnits / (5.5 * 0.78);

      // Step 3 – annual generation (capped: solar covers ~85–90% of load, rest from grid)
      const annualGenUnits = systemKW * 1500;  // 1,500 units/kW/year (TN average)
      const solarCoverage  = Math.min(annualGenUnits, monthlyUnits * 12 * 0.90);

      // Step 4 – savings
      const annualSavings  = Math.round(solarCoverage * tariff);
      const monthlySavings = Math.round(annualSavings / 12);
      const lifetimeSavings= annualSavings * 25;

      // Step 5 – CO₂
      const co2Annual = (solarCoverage * 0.716 / 1000).toFixed(2); // tonnes/year
      const co2Life   = (solarCoverage * 25 * 0.716 / 1000).toFixed(1);

      // Step 6 – recommended system size display
      const sysDisplay = systemKW < 1 ? '1 kW (minimum)' : Math.ceil(systemKW) + ' kW';

      document.getElementById('rMonthly').textContent  = '₹' + monthlySavings.toLocaleString('en-IN');
      document.getElementById('rAnnual').textContent   = '₹' + annualSavings.toLocaleString('en-IN');
      document.getElementById('rLifetime').textContent = '₹' + lifetimeSavings.toLocaleString('en-IN');
      document.getElementById('rCO2').textContent      = co2Annual + ' tonnes/yr (' + co2Life + 't over 25 yrs)';

      const sysEl = document.getElementById('rSystem');
      if(sysEl) sysEl.textContent = sysDisplay;

      const unitsEl = document.getElementById('rUnits');
      if(unitsEl) unitsEl.textContent = Math.round(solarCoverage).toLocaleString('en-IN') + ' units/yr';

      document.getElementById('resultsBox').style.display = 'flex';
    });
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit',e=>{
      e.preventDefault();
      document.getElementById('formMsg').style.display='block';
      contactForm.reset();
    });
  }

  // Highlight active nav link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navlinks a').forEach(a=>{
    if(a.getAttribute('href') === path) a.classList.add('active');
  });
});
