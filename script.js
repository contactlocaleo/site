
/* ===== MENU MOBILE ===== */

const toggle=document.querySelector(".menu-toggle");
const nav=document.querySelector(".site-nav");
const navBackdrop=document.querySelector(".nav-backdrop");
const body=document.body;
const header=document.querySelector(".site-header");
const consentBanner=document.querySelector("#consent-banner");
const consentButtons=document.querySelectorAll("[data-consent-action]");
const analyticsStorageKey="localeo-analytics-consent";
const analyticsMeasurementId="G-S7S7T0P3H5";
let analyticsLoaded=false;

window.dataLayer=window.dataLayer || [];
window.gtag=window.gtag || function(){window.dataLayer.push(arguments);};

function readConsent(){
try{
return localStorage.getItem(analyticsStorageKey);
}catch{
return null;
}
}

function writeConsent(value){
try{
localStorage.setItem(analyticsStorageKey,value);
}catch{
// Keep the UI functional even if storage is unavailable.
}
}

function loadAnalytics(){
if(analyticsLoaded){
return;
}

const analyticsScript=document.createElement("script");
analyticsScript.async=true;
analyticsScript.src=`https://www.googletagmanager.com/gtag/js?id=${analyticsMeasurementId}`;
document.head.appendChild(analyticsScript);

gtag("js",new Date());
gtag("config",analyticsMeasurementId,{
anonymize_ip:true,
allow_google_signals:false,
allow_ad_personalization_signals:false
});

analyticsLoaded=true;
}

function setConsent(value){
writeConsent(value);

if(consentBanner){
consentBanner.hidden=true;
}

if(value==="accepted"){
try{
loadAnalytics();
}catch(error){
console.error("Analytics could not be loaded.",error);
}
}
}

window.setLocaleoConsent=setConsent;

function initConsent(){
const savedConsent=readConsent();

if(savedConsent==="accepted"){
loadAnalytics();
return;
}

if(savedConsent==="rejected"){
return;
}

if(consentBanner){
consentBanner.hidden=false;
}
}

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

consentButtons.forEach(button=>{
button.addEventListener("click",()=>{
setConsent(button.dataset.consentAction==="accept"?"accepted":"rejected");
});
});

initConsent();
