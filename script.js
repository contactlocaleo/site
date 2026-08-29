
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

const revealItems=document.querySelectorAll(".reveal");
if("IntersectionObserver" in window){
const revealObserver=new IntersectionObserver((entries)=>entries.forEach((entry)=>{
if(entry.isIntersecting){entry.target.classList.add("is-visible");revealObserver.unobserve(entry.target)}
}),{threshold:.16});
revealItems.forEach((item)=>revealObserver.observe(item));
}else{revealItems.forEach((item)=>item.classList.add("is-visible"))}

/* ===== CONTACT SUPPORT ===== */

const contactDialog=document.querySelector("#contact-dialog");
const contactOpenButtons=document.querySelectorAll("[data-contact-open]");
const contactCloseButton=document.querySelector("[data-contact-close]");
const supportForm=document.querySelector("#support-form");
const supportApiBase=window.LOCALEO_API_BASE_URL || "https://api.localeo.city";
let contactMotifsLoaded=false;

function setSupportFeedback(message,tone=""){
const feedback=supportForm?.querySelector("[data-support-feedback]");
if(!feedback){return}
feedback.textContent=message;
feedback.className=`support-form__feedback form-field--full${tone?` is-${tone}`:""}`;
feedback.setAttribute("role",tone==="error"?"alert":"status");
}

function setFieldError(fieldName,message=""){
const field=supportForm?.elements.namedItem(fieldName);
const error=supportForm?.querySelector(`[data-error-for="${fieldName}"]`);
if(field){field.setAttribute("aria-invalid",message?"true":"false")}
if(error){error.textContent=message}
}

function validateSupportForm(){
if(!supportForm){return false}
const motif=supportForm.elements.namedItem("motif_id");
const email=supportForm.elements.namedItem("email_contact");
const phone=supportForm.elements.namedItem("telephone_contact");
const message=supportForm.elements.namedItem("message");
const emailValid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
const phoneValue=phone.value.replace(/\s+/g,"");
const phoneValid=!phoneValue || phoneValue.length>=10;
setFieldError("motif_id",motif.value?"":"Choisissez un motif.");
setFieldError("email_contact",emailValid?"":"Renseignez un email valide.");
setFieldError("telephone_contact",phoneValid?"":"Renseignez au moins 10 chiffres, ou laissez ce champ vide.");
setFieldError("message",message.value.trim().length>=10?"":"Ajoutez un message d’au moins 10 caractères.");
return Boolean(motif.value && emailValid && phoneValid && message.value.trim().length>=10);
}

async function loadContactMotifs(){
if(!supportForm || contactMotifsLoaded){return}
const select=supportForm.elements.namedItem("motif_id");
const submit=supportForm.querySelector('[type="submit"]');
try{
const response=await fetch(`${supportApiBase}/public/support/contacts/motifs?cible=CONSOMMATEUR`);
if(!response.ok){throw new Error("Impossible de charger les motifs de contact.")}
const motifs=(await response.json()).filter((motif)=>motif.actif!==false).sort((a,b)=>(a.ordre||0)-(b.ordre||0));
select.innerHTML='<option value="">Choisissez un motif</option>';
motifs.forEach((motif)=>{
const option=document.createElement("option");
option.value=motif.id;
option.textContent=motif.libelle;
select.appendChild(option);
});
select.disabled=false;
submit.disabled=motifs.length===0;
contactMotifsLoaded=true;
if(motifs.length===0){setSupportFeedback("Aucun motif de contact n’est disponible pour le moment.","error")}
}catch(error){
select.innerHTML='<option value="">Service temporairement indisponible</option>';
setSupportFeedback("Le formulaire ne peut pas être chargé pour le moment. Vous pouvez nous écrire à contact@localeo.city.","error");
}
}

contactOpenButtons.forEach((button)=>button.addEventListener("click",()=>{
if(!contactDialog){return}
contactDialog.showModal();
loadContactMotifs();
}));

contactCloseButton?.addEventListener("click",()=>contactDialog.close());
contactDialog?.addEventListener("click",(event)=>{
if(event.target===contactDialog){contactDialog.close()}
});

supportForm?.addEventListener("submit",async(event)=>{
event.preventDefault();
setSupportFeedback("");
if(!validateSupportForm()){
setSupportFeedback("Vérifiez les champs indiqués avant d’envoyer votre demande.","error");
supportForm.querySelector('[aria-invalid="true"]')?.focus();
return;
}
const submit=supportForm.querySelector('[type="submit"]');
const originalLabel=submit.textContent;
submit.disabled=true;
submit.textContent="Envoi en cours…";
const data=new FormData(supportForm);
const payload={
motif_id:data.get("motif_id"),
message:String(data.get("message")||"").trim(),
email_contact:String(data.get("email_contact")||"").trim(),
telephone_contact:String(data.get("telephone_contact")||"").trim() || null
};
try{
const response=await fetch(`${supportApiBase}/public/support/contacts/consommateur/messages`,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(payload)
});

const result=await response.json().catch(()=>({}));
if(!response.ok){
const detail=typeof result.detail==="string"?result.detail:"Impossible d’envoyer votre demande pour le moment.";
throw new Error(detail);
}
supportForm.reset();
setSupportFeedback(result.thread_id?`Votre demande a bien été envoyée. Référence de suivi : ${result.thread_id}.`:"Votre demande a bien été envoyée. Nous revenons vers vous rapidement.","success");
}catch(error){
setSupportFeedback(error.message || "Impossible d’envoyer votre demande. Réessayez plus tard ou écrivez à contact@localeo.city.","error");
}finally{
submit.disabled=false;
submit.textContent=originalLabel;
}
});
