// KimyoLab — umumiy interfeys: holat, XP, bildirishnomalar, oyna, ovoz, bo'limlar, yutuqlar
(function(KL){
"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
KL.$=$;KL.$$=$$;
KL.esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
KL.shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};

/* ---------- Holat (brauzerda saqlanadi) ---------- */
const KEY="kimyolab2";
const DEF=()=>({xp:0,ach:{},disc:{},discEq:{},mols:{},els:{},lessons:{},chains:{},prac:{},quiz:0,gear:{},sound:true,ind:{},seen:{},vessel:"stakan",calc:0});
let S=DEF();
try{const raw=localStorage.getItem(KEY);if(raw)S=Object.assign(DEF(),JSON.parse(raw));else{const old=JSON.parse(localStorage.getItem("kimyolab")||"null");if(old&&old.xp)S.xp=old.xp;}}catch(e){}
Object.defineProperty(KL,"S",{get:()=>S});
let saveT=null;
KL.save=()=>{clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}},250);};
KL.resetAll=()=>{S=DEF();try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}location.reload();};

/* ---------- XP va daraja ---------- */
const TITLES=[[1,"Yangi laborant"],[3,"Laborant"],[5,"Tajribachi"],[8,"Kimyogar"],[12,"Katta kimyogar"],[16,"Professor"]];
KL.level=()=>Math.floor(S.xp/150)+1;
KL.title=()=>TITLES.filter(t=>KL.level()>=t[0]).pop()[1];
KL.renderPlayer=()=>{const el=$("#player");if(!el)return;const p=S.xp%150/150*100;
  el.innerHTML=`<span class="lv" title="${KL.title()}">${KL.level()}</span><span class="xpw"><small>${KL.title()}</small><span class="xpbar"><i style="width:${p}%"></i></span></span><b>${S.xp}</b><small>XP</small>`;};
KL.addXP=(n,why)=>{S.xp+=n;KL.save();KL.renderPlayer();if(why)KL.toast(`${why} +${n} XP`);};

/* ---------- Bildirishnoma va oyna ---------- */
KL.toast=(m,kind)=>{const t=document.createElement("div");t.className="toast"+(kind?" "+kind:"");t.innerHTML=m;$("#toasts").append(t);
  setTimeout(()=>t.classList.add("out"),3200);setTimeout(()=>t.remove(),3600);while($("#toasts").children.length>4)$("#toasts").firstChild.remove();};
KL.modal=(html,opt={})=>{
  const d=document.createElement("div");d.className="back";d.innerHTML=`<div class="modal ${opt.wide?"wide":""}" role="dialog" aria-modal="true"><button class="x" aria-label="Yopish">✕</button>${html}</div>`;
  const close=()=>{d.remove();document.removeEventListener("keydown",esc);opt.onClose&&opt.onClose();};
  const esc=e=>{if(e.key==="Escape")close();};
  d.addEventListener("click",e=>{if(e.target===d||e.target.closest(".x")||e.target.closest("[data-close]"))close();});
  document.addEventListener("keydown",esc);$("#modal-root").append(d);return{el:d,close};
};

/* ---------- Ovoz (WebAudio, fayllarsiz) ---------- */
let AC=null,master=null,lastBub=0;
function ac(){if(!S.sound)return null;try{if(!AC){AC=new(window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=.5;master.connect(AC.destination);}
  if(AC.state==="suspended")AC.resume();return AC;}catch(e){return null;}}
function tone(f,d,type="sine",g=.2,f2){const a=ac();if(!a)return;const o=a.createOscillator(),v=a.createGain(),t=a.currentTime;o.type=type;o.frequency.setValueAtTime(f,t);
  if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);v.gain.setValueAtTime(g,t);v.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(v);v.connect(master);o.start(t);o.stop(t+d+.02);}
function noise(d,f1,f2,g=.25,type="bandpass"){const a=ac();if(!a)return;const n=a.createBufferSource(),b=a.createBuffer(1,a.sampleRate*d,a.sampleRate),ch=b.getChannelData(0);
  for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1;n.buffer=b;const fl=a.createBiquadFilter();fl.type=type;const t=a.currentTime;fl.frequency.setValueAtTime(f1,t);fl.frequency.exponentialRampToValueAtTime(f2,t+d);fl.Q.value=1.2;
  const v=a.createGain();v.gain.setValueAtTime(g,t);v.gain.exponentialRampToValueAtTime(.001,t+d);n.connect(fl);fl.connect(v);v.connect(master);n.start(t);}
KL.sfx={
  click:()=>tone(1200,.04,"square",.05),
  pour:()=>noise(.7,1400,450,.18),
  drop:()=>tone(900,.08,"sine",.12,1500),
  clink:()=>{tone(2400,.12,"triangle",.08);tone(3100,.1,"sine",.05);},
  bubble:()=>{const n=performance.now();if(n-lastBub<90)return;lastBub=n;tone(250+Math.random()*450,.05,"sine",.05,700+Math.random()*500);},
  fizz:()=>noise(1,5000,2500,.12,"highpass"),
  sizzle:()=>{noise(.5,4000,1500,.2,"highpass");setTimeout(()=>noise(.4,3000,1200,.15,"highpass"),250);},
  whoosh:()=>noise(.5,300,1200,.2,"lowpass"),
  ding:()=>{tone(880,.5,"sine",.15);setTimeout(()=>tone(1320,.6,"sine",.12),120);},
  win:()=>[523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,.35,"triangle",.12),i*110)),
  err:()=>tone(180,.18,"sawtooth",.06),
  zap:()=>noise(.25,2000,6000,.1,"bandpass")
};
KL.setSound=on=>{S.sound=on;KL.save();const b=$("#snd");if(b){b.textContent=on?"🔊":"🔇";b.title=on?"Ovozni o'chirish":"Ovozni yoqish";}};

/* ---------- Bo'limlar ---------- */
KL.tabs={};
let current=null;
KL.current=()=>current;
KL.go=function(t,arg){
  if(!KL.tabs[t])t="lab";
  $$("#tabs button").forEach(b=>{const on=b.dataset.tab===t;b.classList.toggle("active",on);b.setAttribute("aria-selected",on);});
  $$(".tab").forEach(s=>s.classList.toggle("active",s.id==="tab-"+t));
  if(current&&current!==t&&KL.tabs[current].hide)KL.tabs[current].hide();
  current=t;const T=KL.tabs[t];
  if(!T.ready){T.ready=1;T.init($("#tab-"+t));}
  T.show&&T.show(arg);
  if(location.hash.slice(1)!==t)history.replaceState(null,"","#"+t);
  document.body.dataset.tab=t;
};

/* ---------- Yutuqlar ---------- */
const QUAL=["q_FeSCN","p_Ag_Cl","p_Ag_Br","p_Ag_I","p_Ba_SO4","c_lime","o_starchI","o_glyCu","o_protCu","o_phenolBr","o_aldAg","o_gluAg","o_gluCu","o_aldCu","p_Fe3_OH","p_Cu_OH","w_NH4OH","h_NH3"];
KL.checkAch=function(){
  const n=Object.keys(S.disc).length,c=o=>Object.keys(o).length,has=id=>!!S.disc[id];
  const cond={gear:S.gear.xalat&&S.gear.koz&&S.gear.qol,first_rx:n>=1,rx10:n>=10,rx30:n>=30,rx60:n>=60,rx100:n>=100,
    qual5:QUAL.filter(has).length>=5,elec:Object.keys(S.disc).some(k=>k.startsWith("e_")),mirror:has("o_aldAg")||has("o_gluAg"),
    redox3:has("r_MnSO3a")&&has("r_MnSO3b")&&has("r_MnSO3n"),ind4:c(S.ind)>=4,evap:has("evap"),
    prac1:c(S.prac)>=1,prac5:c(S.prac)>=5,prac_all:c(S.prac)>=KL.PRACTICALS.length,
    lesson1:c(S.lessons)>=1,lesson_all:c(S.lessons)>=KL.LESSONS.length,chain1:c(S.chains)>=1,chain_all:c(S.chains)>=KL.CHAINS.length,
    mol10:c(S.mols)>=10,el30:c(S.els)>=30,quiz10:S.quiz>=10,calc:S.calc>0,balance:!!S.balanced};
  KL.ACHS.forEach(([id,ic,name])=>{if(cond[id]&&!S.ach[id]){S.ach[id]=Date.now();S.xp+=15;KL.toast(`${ic} <b>Yutuq:</b> ${name} <small>+15 XP</small>`,"gold");KL.sfx.win();}});
  KL.save();KL.renderPlayer();
};
// Reaksiyani kashfiyotlar daftariga yozish
KL.discover=function(entry){
  if(!entry||S.disc[entry.id])return false;
  S.disc[entry.id]=Date.now();S.discEq[entry.id]={t:entry.t,mol:entry.mol,ionic:entry.ionic,obs:entry.obs};
  KL.addXP(10);KL.checkAch();return true;
};
KL.tabs.discoveries={
  init(el){this.el=el;},
  show(){
    const el=this.el,n=Object.keys(S.disc).length,tot=KL.DISCOVERABLE.length,got=KL.ACHS.filter(a=>S.ach[a[0]]).length,c=o=>Object.keys(o).length;
    const list=Object.entries(S.discEq).sort((a,b)=>S.disc[b[0]]-S.disc[a[0]]);
    const types=[...new Set(list.map(([,e])=>e.t))].sort();
    el.innerHTML=`<div class="head"><h2>🏆 Yutuqlar va kashfiyotlar</h2><p class="sub">${KL.title()} · ${KL.level()}-daraja · ${S.xp} XP</p></div>
    <div class="statgrid">
      <div><b>${n}</b><small>/ ${tot} reaksiya</small></div><div><b>${got}</b><small>/ ${KL.ACHS.length} yutuq</small></div>
      <div><b>${c(S.prac)}</b><small>/ ${KL.PRACTICALS.length} amaliy ish</small></div><div><b>${c(S.lessons)}</b><small>/ ${KL.LESSONS.length} dars</small></div>
      <div><b>${c(S.chains)}</b><small>/ ${KL.CHAINS.length} zanjir</small></div><div><b>${c(S.els)}</b><small>/ 118 element</small></div></div>
    <div class="prog big"><i style="width:${n/tot*100}%"></i></div>
    <h3>Yutuqlar</h3><div class="badges">${KL.ACHS.map(([id,ic,name,desc])=>`<div class="badge ${S.ach[id]?"on":""}"><div class="ic">${ic}</div><div><b>${name}</b><small>${desc}</small></div></div>`).join("")}</div>
    <h3>📖 Reaksiyalar daftari <small class="mut">(${n})</small></h3>
    ${n?`<div class="chips" id="dfl"><button class="chip on" data-t="">Hammasi</button>${types.map(t=>`<button class="chip" data-t="${KL.esc(t)}">${t}</button>`).join("")}</div>
    <div class="dlist" id="dl">${list.map(([id,e])=>`<div class="entry" data-t="${KL.esc(e.t)}"><span class="tag">${e.t}</span>${e.mol?`<div class="eq">${e.mol}</div>`:""}${e.ionic?`<div class="ion"><small>Qisqa ionli:</small> ${e.ionic}</div>`:""}<p>${e.obs}</p></div>`).join("")}</div>`
    :`<p class="empty">Hali reaksiya kashf etilmagan. Laboratoriyaga o'ting va moddalarni aralashtirib ko'ring!</p>`}
    <p class="mut" style="margin-top:24px">Natijalar faqat shu brauzerda saqlanadi. <button class="btn sm ghost" id="rst">Natijalarni tozalash</button></p>`;
    const f=$("#dfl");if(f)f.onclick=e=>{const b=e.target.closest(".chip");if(!b)return;$$("#dfl .chip").forEach(x=>x.classList.toggle("on",x===b));$$("#dl .entry").forEach(x=>x.hidden=!!b.dataset.t&&x.dataset.t!==b.dataset.t);};
    $("#rst").onclick=()=>{const m=KL.modal(`<h3>Natijalarni tozalash</h3><p>Barcha XP, yutuqlar va kashfiyotlar o'chiriladi. Davom etasizmi?</p><div class="row"><button class="btn danger" id="rok">Ha, tozalash</button><button class="btn" data-close>Bekor qilish</button></div>`);$("#rok",m.el).onclick=KL.resetAll;};
  }
};
})(globalThis.KL=globalThis.KL||{});
