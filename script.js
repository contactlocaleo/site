
/* ===== MENU MOBILE ===== */

const toggle=document.querySelector(".menu-toggle");
const nav=document.querySelector(".site-nav");

if(toggle && nav){

toggle.addEventListener("click",(e)=>{
e.stopPropagation();
nav.classList.toggle("is-open");
});

document.addEventListener("click",(e)=>{
if(!nav.contains(e.target) && !toggle.contains(e.target)){
nav.classList.remove("is-open");
}
});

}

/* ===== COMPTEURS ===== */

const counters=document.querySelectorAll("[data-target]");

function animateCounter(el){

const target=parseInt(el.dataset.target);
const duration=1000;
const start=performance.now();

function update(now){

const progress=Math.min((now-start)/duration,1);
el.textContent=Math.floor(progress*target);

if(progress<1){
requestAnimationFrame(update);
}else{
el.textContent=target;
}

}

requestAnimationFrame(update);

}

if(counters.length){

const observer=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
animateCounter(entry.target);
observer.unobserve(entry.target);
}
});
},{threshold:.4});

counters.forEach(c=>observer.observe(c));

}
