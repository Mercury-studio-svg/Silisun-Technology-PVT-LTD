// Mobile nav toggle
document.addEventListener('DOMContentLoaded',()=>{
  const menuBtn=document.querySelector('.menu-btn');
  const navlinks=document.querySelector('.navlinks');
  if(menuBtn){menuBtn.addEventListener('click',()=>navlinks.classList.toggle('open'));}
  navlinks?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navlinks.classList.remove('open')));

  // Reveal on scroll
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target);} });
  },{threshold:.15});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

  // Solar savings calculator (index page)
  const calcForm=document.getElementById('calcForm');
  if(calcForm){
    calcForm.addEventListener('submit',e=>{
      e.preventDefault();
      const bill=parseFloat(document.getElementById('bill').value)||0;
      const monthlySavings=Math.round(bill*0.85);
      const annualSavings=monthlySavings*12;
      const lifetimeSavings=annualSavings*25;
      const co2=Math.round((bill/8)*12*0.0008*1000)/1000; // approx tons/yr

      document.getElementById('rMonthly').textContent='₹'+monthlySavings.toLocaleString('en-IN');
      document.getElementById('rAnnual').textContent='₹'+annualSavings.toLocaleString('en-IN');
      document.getElementById('rLifetime').textContent='₹'+lifetimeSavings.toLocaleString('en-IN');
      document.getElementById('rCO2').textContent=co2+' tons/yr';
      document.getElementById('resultsBox').style.display='flex';
    });
  }

  // Contact form (contact page) — front-end only confirmation
  const contactForm=document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit',e=>{
      e.preventDefault();
      document.getElementById('formMsg').style.display='block';
      contactForm.reset();
    });
  }

  // Highlight active nav link
  const path=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.navlinks a').forEach(a=>{
    if(a.getAttribute('href')===path) a.classList.add('active');
  });
});
