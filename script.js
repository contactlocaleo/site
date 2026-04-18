
/* ===== MENU MOBILE ===== */

const toggle=document.querySelector(".menu-toggle");
const nav=document.querySelector(".site-nav");
const navBackdrop=document.querySelector(".nav-backdrop");
const body=document.body;
const header=document.querySelector(".site-header");

if(toggle && nav){

const closeNav=()=>{
nav.classList.remove("is-open");
toggle.setAttribute("aria-expanded","false");
toggle.setAttribute("aria-label","Ouvrir le menu");
body.classList.remove("nav-open");
if(navBackdrop){
navBackdrop.hidden=true;
}
};

const openNav=()=>{
nav.classList.add("is-open");
toggle.setAttribute("aria-expanded","true");
toggle.setAttribute("aria-label","Fermer le menu");
body.classList.add("nav-open");
if(navBackdrop){
navBackdrop.hidden=false;
}
};

toggle.addEventListener("click",(e)=>{
e.stopPropagation();
if(nav.classList.contains("is-open")){
closeNav();
}else{
openNav();
}
});

document.addEventListener("click",(e)=>{
if(!nav.contains(e.target) && !toggle.contains(e.target)){
closeNav();
}
});

nav.querySelectorAll("a").forEach(link=>{
link.addEventListener("click",closeNav);
});

if(navBackdrop){
navBackdrop.addEventListener("click",closeNav);
}

document.addEventListener("keydown",(e)=>{
if(e.key==="Escape"){
closeNav();
}
});

}

function syncHeaderState(){
if(!header){
return;
}

header.classList.toggle("is-scrolled",window.scrollY>16);
}

syncHeaderState();
window.addEventListener("scroll",syncHeaderState,{passive:true});

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
