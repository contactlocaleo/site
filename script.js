const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.site-nav');
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));});
nav.querySelectorAll('a').forEach(link=>{link.addEventListener('click',()=>{nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');});});}
const counters=document.querySelectorAll('[data-target]');
function animateCounter(el){const target=Number(el.dataset.target);const duration=1000;const start=performance.now();
function step(now){const progress=Math.min((now-start)/duration,1);el.textContent=Math.floor(progress*target);if(progress<1)requestAnimationFrame(step);else el.textContent=target;}
requestAnimationFrame(step);}
if('IntersectionObserver' in window && counters.length){const observer=new IntersectionObserver((entries,obs)=>{entries.forEach(entry=>{if(entry.isIntersecting){animateCounter(entry.target);obs.unobserve(entry.target);}})},{threshold:.4});counters.forEach(counter=>observer.observe(counter));}else{counters.forEach(animateCounter);}