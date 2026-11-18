// KimyoLab — ishga tushirish
(function(KL){
"use strict";
const $=KL.$;
function boot(){
  $("#tabs").addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(b){KL.sfx.click();KL.go(b.dataset.tab);}});
  $("#snd").onclick=()=>KL.setSound(!KL.S.sound);KL.setSound(KL.S.sound);
  KL.renderPlayer();
  addEventListener("hashchange",()=>{const h=location.hash.slice(1);if(h&&h!==KL.current()&&KL.tabs[h])KL.go(h);});
  const h=location.hash.slice(1);KL.go(KL.tabs[h]?h:"lab");
  setTimeout(()=>{const l=$("#loader");if(l){l.classList.add("out");setTimeout(()=>l.remove(),500);}},150);
  if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("sw.js").catch(()=>{});
  KL.checkAch();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})(globalThis.KL);
