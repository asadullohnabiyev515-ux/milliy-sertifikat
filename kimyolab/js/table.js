// KimyoLab — davriy jadval: qidiruv, rang rejimlari, element kartochkasi (Bor modeli), viktorina
(function(KL){
"use strict";
const $=KL.$,$$=KL.$$,E=()=>KL.ELEMENTS;
const MODES={cat:"Toifa",en:"Elektrmanfiylik",mass:"Atom massasi",state:"Agregat holati",block:"Blok (s, p, d, f)"};
const STATE_C={gaz:"#7cc4f2","suyuq":"#7fd3a3","qattiq":"#c9b8a6","noma'lum":"#8a8f98"},BLOCK_C={s:"#ef8a6b",p:"#e8cf5a",d:"#6fa8dc",f:"#c58bd1"};
let mode="cat",q="",cur=1;
const heat=(t)=>KL.mixCol(t<.5?"#3b6fd8":"#f2d24b",t<.5?"#f2d24b":"#e0453a",t<.5?t*2:(t-.5)*2);
function colorOf(e){
  if(mode==="cat")return KL.CAT[e.cat][1];
  if(mode==="en")return e.en?heat((e.en-.7)/3.3):"#59606b";
  if(mode==="mass")return heat(Math.min(1,e.mass/300));
  if(mode==="state")return STATE_C[e.state];
  return BLOCK_C[e.block];
}
KL.tabs.table={
  init(el){
    el.innerHTML=`<div class="head"><h2>📋 Davriy jadval</h2><p class="sub">118 ta element. Elementni bosing — tuzilishi, xossalari va laboratoriyadagi birikmalari ochiladi.</p></div>
    <div class="toolbar"><input id="ptq" type="search" placeholder="Qidirish: Fe, temir, 26…" autocomplete="off"><div class="seg" id="ptm">${Object.entries(MODES).map(([k,v])=>`<button data-m="${k}">${v}</button>`).join("")}</div></div>
    <div class="legend" id="lg"></div>
    <div class="ptwrap"><div class="pt" id="pt" role="grid" aria-label="Davriy jadval"></div></div>
    <div class="card quiz"><div class="qh"><b>🎯 Viktorina</b><span class="seg" id="qmode"><button data-q="sym" class="on">Belgi → nom</button><button data-q="name">Nom → belgi</button><button data-q="group">Qaysi guruh?</button></span><span class="mut" id="qsc"></span></div><div id="qz"></div></div>`;
    const pt=$("#pt");let h="";
    E().forEach(e=>{h+=`<button class="cell" data-z="${e.z}" style="grid-row:${e.row+1};grid-column:${e.col}" aria-label="${e.name}, ${e.z}"><small>${e.z}</small><b>${e.sym}</b><span>${e.name}</span><em>${KL.nice(e.mass,2)}</em></button>`;});
    h+=`<div class="ph" style="grid-row:7;grid-column:3">57–71</div><div class="ph" style="grid-row:8;grid-column:3">89–103</div><div class="gap" style="grid-row:9;grid-column:1/19"></div>`;
    for(let g=1;g<=18;g++)h+=`<div class="gn" style="grid-row:1;grid-column:${g}">${g}</div>`;
    pt.innerHTML=h;
    $("#ptm").onclick=e=>{const b=e.target.closest("[data-m]");if(b){mode=b.dataset.m;paint();}};
    $("#ptq").oninput=()=>{q=$("#ptq").value.trim().toLowerCase();paint();};
    $("#ptq").onkeydown=e=>{if(e.key==="Enter"){const f=E().find(match);if(f)openEl(f.z);}};
    pt.onclick=e=>{const b=e.target.closest(".cell");if(b)openEl(+b.dataset.z);};
    $("#lg").onclick=e=>{const b=e.target.closest("[data-c]");if(!b)return;const on=b.classList.toggle("on");$$("#lg [data-c]").forEach(x=>{if(x!==b)x.classList.remove("on");});
      $$("#pt .cell").forEach(c=>{const el2=E()[c.dataset.z-1];c.classList.toggle("dim",on&&el2.cat!==b.dataset.c);});};
    $("#qmode").onclick=e=>{const b=e.target.closest("[data-q]");if(!b)return;$$("#qmode button").forEach(x=>x.classList.toggle("on",x===b));quiz(b.dataset.q);};
    paint();quiz("sym");
  },
  show(z){if(typeof z==="number")openEl(z);}
};
const match=e=>!q||e.sym.toLowerCase()===q||e.name.toLowerCase().includes(q)||String(e.z)===q;
function paint(){
  $$("#ptm button").forEach(b=>b.classList.toggle("on",b.dataset.m===mode));
  $$("#pt .cell").forEach(c=>{const e=E()[c.dataset.z-1],col=colorOf(e);c.style.background=col;c.style.color=KL.hex(col).reduce((a,v)=>a+v,0)>380?"#111":"#fff";c.classList.toggle("dim",!match(e));c.classList.toggle("hit",!!q&&match(e));});
  const lg=$("#lg");
  if(mode==="cat")lg.innerHTML=Object.entries(KL.CAT).map(([k,v])=>`<button class="chip" data-c="${k}"><i style="background:${v[1]}"></i>${v[0]}</button>`).join("");
  else if(mode==="en")lg.innerHTML=`<span class="grad"><i style="background:linear-gradient(90deg,${heat(0)},${heat(.5)},${heat(1)})"></i><small>0,7</small><small>Elektrmanfiylik (Poling)</small><small>4,0</small></span><span class="chip"><i style="background:#59606b"></i>ma'lumot yo'q</span>`;
  else if(mode==="mass")lg.innerHTML=`<span class="grad"><i style="background:linear-gradient(90deg,${heat(0)},${heat(.5)},${heat(1)})"></i><small>1</small><small>Atom massasi</small><small>300</small></span>`;
  else if(mode==="state")lg.innerHTML=Object.entries(STATE_C).map(([k,v])=>`<span class="chip"><i style="background:${v}"></i>${k} (25°C)</span>`).join("");
  else lg.innerHTML=Object.entries(BLOCK_C).map(([k,v])=>`<span class="chip"><i style="background:${v}"></i>${k}-elementlar</span>`).join("");
}
function bohr(e){
  const sh=KL.econf(e.z).shells,n=sh.length,R=i=>26+i*(78/Math.max(1,n));
  let s=`<svg viewBox="0 0 220 220" class="bohr" aria-label="Bor modeli"><circle cx="110" cy="110" r="17" fill="${KL.CAT[e.cat][1]}"/><text x="110" y="115" text-anchor="middle" font-size="13" font-weight="700" fill="#111">${e.sym}</text>`;
  sh.forEach((cnt,i)=>{const r=R(i);s+=`<circle cx="110" cy="110" r="${r}" fill="none" stroke="currentColor" stroke-opacity=".25"/><g class="orb" style="animation-duration:${8+i*5}s">`;
    for(let k=0;k<cnt;k++){const a=k/cnt*Math.PI*2;s+=`<circle cx="${110+Math.cos(a)*r}" cy="${110+Math.sin(a)*r}" r="${cnt>18?2.2:3}" fill="#4fd1c5"/>`;}s+=`</g>`;});
  return s+"</svg>";
}
function openEl(z){
  cur=z;const e=E()[z-1],c=KL.econf(z),S=KL.S;S.els[z]=1;KL.save();KL.checkAch();
  const outer=c.shells[c.shells.length-1],sym=e.sym;
  const comp=KL.SHELF.filter(s=>{try{return KL.parseFormula(s.f.replace(/\(C6H10O5\)n/,"C"))[sym];}catch(x){return false;}});
  const mols=(KL.MOLECULES||[]).filter(m=>{try{return KL.parseFormula(m.f)[sym];}catch(x){return false;}});
  const m=KL.modal(`<div class="elhead"><div class="bigsym" style="background:${KL.CAT[e.cat][1]}"><small>${e.z}</small><b>${e.sym}</b><em>${KL.nice(e.mass,3)}</em></div>
    <div><h2>${e.name}</h2><span class="chip"><i style="background:${KL.CAT[e.cat][1]}"></i>${KL.CAT[e.cat][0]}</span>${e.synthetic?` <span class="chip">sun'iy olingan</span>`:""}</div></div>
    <div class="elbody">${bohr(e)}<div class="kv">
      <span>Tartib raqami (Z)</span><b>${e.z}</b><span>Nisbiy atom massasi</span><b>${KL.nice(e.mass,3)}</b>
      <span>Davr / guruh</span><b>${e.period} / ${e.group}</b><span>Blok</span><b>${e.block}</b>
      <span>p⁺ / n⁰ / e⁻</span><b>${z} / ${Math.max(0,Math.round(e.mass)-z)} / ${z}</b>
      <span>Elektronlar qavatlarda</span><b>${c.shells.join(", ")}</b><span>Tashqi qavatda</span><b>${outer} e⁻</b>
      <span>Elektron formula</span><b class="ec">${c.short}</b>
      <span>Elektrmanfiylik</span><b>${e.en?String(e.en).replace(".",","):"—"}</b><span>Oksidlanish darajalari</span><b>${e.ox}</b>
      <span>Holati (25°C)</span><b>${e.state}</b></div></div>
    ${comp.length?`<h4>🧪 Laboratoriyadagi birikmalari</h4><div class="chips">${comp.map(s=>`<button class="chip" data-lab="${s.id}"><b>${KL.fmt(s.f)}</b> ${s.n}</button>`).join("")}</div>`:""}
    ${mols.length?`<h4>⚛️ 3D molekulalar</h4><div class="chips">${mols.map(x=>`<button class="chip" data-mol="${x.id}">${KL.fmt(x.f)} ${x.name}</button>`).join("")}</div>`:""}
    <div class="row nav"><button class="btn" data-nav="-1" ${z<=1?"disabled":""}>← ${z>1?E()[z-2].sym:""}</button><button class="btn" data-nav="1" ${z>=118?"disabled":""}>${z<118?E()[z].sym:""} →</button></div>`,{wide:true});
  m.el.addEventListener("click",ev=>{const n=ev.target.closest("[data-nav]"),l=ev.target.closest("[data-lab]"),mo=ev.target.closest("[data-mol]");
    if(n){m.close();openEl(cur+ +n.dataset.nav);}
    if(l){m.close();KL.go("lab");setTimeout(()=>KL.lab.find&&KL.lab.find(l.dataset.lab),50);}
    if(mo){m.close();KL.go("molecules",mo.dataset.mol);}});
  m.el.addEventListener("keydown",ev=>{if(ev.key==="ArrowRight"&&cur<118){m.close();openEl(cur+1);}if(ev.key==="ArrowLeft"&&cur>1){m.close();openEl(cur-1);}});
  m.el.querySelector(".modal").tabIndex=-1;m.el.querySelector(".modal").focus();
}
let qm="sym",streak=0;
function quiz(m){
  if(m)qm=m;const pool=E().filter(e=>e.z<=86),e=pool[Math.random()*pool.length|0];
  let ask,ans,opts;
  if(qm==="sym"){ask=`<b class="qbig">${e.sym}</b> — bu qaysi element?`;ans=e.name;opts=KL.shuffle([e,...KL.shuffle(pool.filter(x=>x!==e)).slice(0,3)]).map(x=>x.name);}
  else if(qm==="name"){ask=`<b class="qbig">${e.name}</b> elementining belgisi?`;ans=e.sym;opts=KL.shuffle([e,...KL.shuffle(pool.filter(x=>x!==e)).slice(0,3)]).map(x=>x.sym);}
  else{const pe=pool.filter(x=>x.group!=="—");const g=pe[Math.random()*pe.length|0];ask=`<b class="qbig">${g.sym}</b> (${g.name}) nechanchi guruhda?`;ans=String(g.group);
    const set=new Set([ans]);while(set.size<4)set.add(String(1+Math.random()*18|0));opts=KL.shuffle([...set]);}
  $("#qz").innerHTML=`<p>${ask}</p><div class="opts row">${opts.map(o=>`<button class="opt" data-o="${KL.esc(o)}">${o}</button>`).join("")}</div>`;
  $("#qsc").textContent=`To'g'ri javoblar: ${KL.S.quiz} · ketma-ket: ${streak}`;
  $("#qz").onclick=ev=>{const b=ev.target.closest(".opt");if(!b||$("#qz").dataset.lock)return;$("#qz").dataset.lock=1;
    const ok=b.dataset.o===ans;b.classList.add(ok?"ok":"no");if(!ok)$$("#qz .opt").forEach(x=>{if(x.dataset.o===ans)x.classList.add("ok");});
    if(ok){KL.S.quiz++;streak++;KL.addXP(2);KL.sfx.ding();KL.checkAch();}else{streak=0;KL.sfx.err();}
    setTimeout(()=>{delete $("#qz").dataset.lock;quiz();},ok?700:1500);};
}
})(globalThis.KL=globalThis.KL||{});
