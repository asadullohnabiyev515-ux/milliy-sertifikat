(()=>{
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const fmt=s=>String(s).replace(/([A-Za-z\)\]])(\d+)/g,"$1<sub>$2</sub>");
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
const rnd=a=>a[Math.random()*a.length|0];

/* ---------- Holat ---------- */
window.KL={};
let S={xp:0,ach:{},rx:{},mols:{},els:{},lessons:{},chains:{},prac:{},steps:{},quiz:0};
try{Object.assign(S,JSON.parse(localStorage.getItem("kimyolab")||"{}"));}catch(e){}
const save=()=>{try{localStorage.setItem("kimyolab",JSON.stringify(S));}catch(e){}};
function toast(m){const t=document.createElement("div");t.className="toast";t.textContent=m;$("#toasts").append(t);setTimeout(()=>t.remove(),3200);}
function renderPlayer(){const lv=Math.floor(S.xp/100)+1;
  $("#player").innerHTML=`<span>⭐ ${S.xp} XP</span><span>Daraja ${lv}</span><div class="xpbar"><i style="width:${S.xp%100}%"></i></div>`;}
function addXP(n){S.xp+=n;save();renderPlayer();}
function unlock(id){if(S.ach[id])return;S.ach[id]=1;const a=ACHS.find(x=>x[0]===id);S.xp+=15;save();renderPlayer();toast(`🏆 Yutuq: ${a[2]} (+15 XP)`);}
const cnt=o=>Object.keys(o).length;

/* ---------- Tablar ---------- */
const inited={};
const tabs={lab:()=>window.KL_initLab(),table:initTable,molecules:initMol,chains:initChains,lessons:initLessons,practicals:initPrac,tools:initTools,discoveries:renderAch};
function showTab(t){
  $$("#tabs button").forEach(b=>b.classList.toggle("active",b.dataset.tab===t));
  $$(".tab").forEach(s=>s.classList.toggle("active",s.id==="tab-"+t));
  current=t;
  if(!inited[t]){inited[t]=1;tabs[t]();} else if(t==="discoveries")renderAch();
  if(t==="molecules")molResize();
  location.hash=t;
}
let current="lab";
$("#tabs").addEventListener("click",e=>{const b=e.target.closest("button");if(b)showTab(b.dataset.tab);});

/* ---------- Davriy jadval ---------- */
function econf(z){
  const order=["1s","2s","2p","3s","3p","4s","3d","4p","5s","4d","5p","6s","4f","5d","6p","7s","5f","6d","7p"];
  const cap={s:2,p:6,d:10,f:14};const o={};let r=z;
  for(const k of order){const n=Math.min(r,cap[k[1]]);if(n>0)o[k]=n;r-=n;if(r<=0)break;}
  const ex={24:[["4s",-1],["3d",1]],29:[["4s",-1],["3d",1]],41:[["5s",-1],["4d",1]],42:[["5s",-1],["4d",1]],44:[["5s",-1],["4d",1]],45:[["5s",-1],["4d",1]],
   46:[["5s",-2],["4d",2]],47:[["5s",-1],["4d",1]],57:[["4f",-1],["5d",1]],58:[["4f",-1],["5d",1]],64:[["4f",-1],["5d",1]],78:[["6s",-1],["5d",1]],79:[["6s",-1],["5d",1]]};
  (ex[z]||[]).forEach(([k,d])=>{o[k]=(o[k]||0)+d;if(o[k]<=0)delete o[k];});
  const shells={};Object.entries(o).forEach(([k,v])=>shells[k[0]]=(shells[k[0]]||0)+v);
  const lst=order.filter(k=>o[k]).map(k=>`${k}<sup>${o[k]}</sup>`).join(" ");
  return{lst,shells:Object.values(shells).join(", ")};
}
function initTable(){
  const el=$("#tab-table");
  el.innerHTML=`<h2>📋 Davriy jadval</h2><p class="sub">Elementni bosing — tuzilishi va xossalarini ko'ring. Toifa bo'yicha ajratib ko'rsatish mumkin.</p>
  <div class="legend" id="lg"></div><div class="ptwrap"><div class="pt" id="pt"></div></div>
  <div class="card" style="margin-top:14px"><b>🎯 Viktorina:</b> <span id="qz"></span></div>`;
  $("#lg").innerHTML=Object.entries(CAT).map(([k,v])=>`<button class="chip" data-c="${k}"><i style="background:${v[1]}"></i>${v[0]}</button>`).join("");
  let h="";
  ELEMENTS.forEach(e=>{h+=`<button class="cell" data-z="${e.z}" data-c="${e.cat}" style="grid-row:${e.row};grid-column:${e.col};background:${CAT[e.cat][1]}"><small>${e.z}</small><b>${e.sym}</b><small>${e.name.slice(0,9)}</small></button>`;});
  h+=`<div class="ph" style="grid-row:6;grid-column:3">57–71</div><div class="ph" style="grid-row:7;grid-column:3">89–103</div>`;
  $("#pt").innerHTML=h;
  let f=null;
  $("#lg").onclick=e=>{const b=e.target.closest(".chip");if(!b)return;f=f===b.dataset.c?null:b.dataset.c;
    $$("#lg .chip").forEach(c=>c.classList.toggle("on",c.dataset.c===f));$$("#pt .cell").forEach(c=>c.classList.toggle("dim",!!f&&c.dataset.c!==f));};
  $("#pt").onclick=e=>{const b=e.target.closest(".cell");if(b)elModal(+b.dataset.z);};
  quiz();
}
function elModal(z){
  const e=ELEMENTS[z-1],c=econf(z),n=Math.round(e.mass)-z;
  S.els[z]=1;save();if(cnt(S.els)>=10)unlock("el10");
  openModal(`<div style="display:flex;gap:16px;align-items:center"><div class="bigsym" style="color:${CAT[e.cat][1]}">${e.sym}</div><div><h2 style="margin:0">${e.name}</h2><span class="chip">${CAT[e.cat][0]}</span></div></div>
  <div class="kv"><span>Tartib raqami</span><b>${e.z}</b><span>Atom massasi</span><b>${e.mass}</b><span>Davr / guruh</span><b>${e.period} / ${e.group}</b>
  <span>Protonlar</span><b>${z}</b><span>Neytronlar (taxm.)</span><b>${n}</b><span>Elektronlar</span><b>${z}</b>
  <span>Pog'onalarda</span><b>${c.shells}</b><span>Konfiguratsiya</span><b>${c.lst}</b></div><button class="btn" onclick="this.closest('.back').remove()">Yopish</button>`);
}
function openModal(h){const d=document.createElement("div");d.className="back";d.innerHTML=`<div class="modal">${h}</div>`;d.onclick=e=>{if(e.target===d)d.remove();};$("#modal-root").append(d);}
function quiz(){
  const e=rnd(ELEMENTS),opts=shuffle([e,...shuffle(ELEMENTS.filter(x=>x!==e)).slice(0,3)]);
  $("#qz").innerHTML=`<b style="font-size:18px">${e.sym}</b> — bu qaysi element? `+opts.map(o=>`<button class="btn sm" data-n="${o.name}">${o.name}</button>`).join(" ")+` <span class="sub">(to'g'ri: ${S.quiz})</span>`;
  $("#qz").onclick=ev=>{const b=ev.target.closest("button");if(!b)return;
    if(b.dataset.n===e.name){S.quiz++;addXP(2);if(S.quiz>=5)unlock("quiz5");toast("✅ To'g'ri!");}else toast("❌ Bu "+e.name+" edi");quiz();};
}

/* ---------- Molekulalar ---------- */
let mv=null;
function initMol(){
  const el=$("#tab-molecules");
  el.innerHTML=`<h2>⚛️ Molekulalar</h2><p class="sub">Sichqoncha yoki barmoq bilan aylantiring, g'ildirak bilan yaqinlashtiring.</p>
  <div class="mlist" id="ml"></div><div class="grid2"><div id="molview"></div><div class="card" id="minfo"></div></div>`;
  $("#ml").innerHTML=MOLS.map(m=>`<button class="chip" data-id="${m.id}">${fmt(m.f)} · ${m.name}</button>`).join("");
  $("#ml").onclick=e=>{const b=e.target.closest(".chip");if(b)showMol(b.dataset.id);};
  if(typeof THREE==="undefined"){$("#molview").innerHTML='<p class="sub" style="padding:20px">3D kutubxonasi yuklanmadi (internet kerak).</p>';return;}
  const host=$("#molview");
  const r=new THREE.WebGLRenderer({antialias:true,alpha:true});r.setPixelRatio(Math.min(devicePixelRatio,2));host.append(r.domElement);
  const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(45,1,.1,100);cam.position.z=8;
  sc.add(new THREE.AmbientLight(0xffffff,.6));const dl=new THREE.DirectionalLight(0xffffff,.9);dl.position.set(4,6,8);sc.add(dl);
  const g=new THREE.Group();sc.add(g);mv={r,sc,cam,g,drag:false,auto:true};
  let px=0,py=0;
  host.addEventListener("pointerdown",e=>{mv.drag=true;mv.auto=false;px=e.clientX;py=e.clientY;host.setPointerCapture(e.pointerId);host.style.cursor="grabbing";});
  host.addEventListener("pointerup",()=>{mv.drag=false;host.style.cursor="grab";});
  host.addEventListener("pointermove",e=>{if(!mv.drag)return;g.rotation.y+=(e.clientX-px)*.01;g.rotation.x+=(e.clientY-py)*.01;px=e.clientX;py=e.clientY;});
  host.addEventListener("wheel",e=>{e.preventDefault();cam.position.z=Math.min(20,Math.max(3,cam.position.z+e.deltaY*.01));},{passive:false});
  addEventListener("resize",molResize);
  (function loop(){requestAnimationFrame(loop);if(current!=="molecules")return;if(mv.auto)g.rotation.y+=.006;r.render(sc,cam);})();
  showMol("h2o");molResize();
}
function molResize(){if(!mv)return;const h=$("#molview");const w=h.clientWidth,hh=h.clientHeight;if(!w)return;mv.r.setSize(w,hh);mv.cam.aspect=w/hh;mv.cam.updateProjectionMatrix();}
function showMol(id){
  const m=MOLS.find(x=>x.id===id);if(!mv)return;
  $$("#ml .chip").forEach(c=>c.classList.toggle("on",c.dataset.id===id));
  while(mv.g.children.length)mv.g.remove(mv.g.children[0]);
  const P=m.a.map(a=>new THREE.Vector3(a[1],a[2],a[3]));
  const ctr=P.reduce((s,p)=>s.add(p),new THREE.Vector3()).multiplyScalar(1/P.length);P.forEach(p=>p.sub(ctr));
  m.a.forEach((a,i)=>{const st=ATOM_STYLE[a[0]]||[0xcccccc,.4];
    const s=new THREE.Mesh(new THREE.SphereGeometry(st[1],32,24),new THREE.MeshPhongMaterial({color:st[0],shininess:60}));s.position.copy(P[i]);mv.g.add(s);});
  const Y=new THREE.Vector3(0,1,0);
  m.b.forEach(([i,j,o])=>{const d=P[j].clone().sub(P[i]),len=d.length(),dir=d.clone().normalize();
    let perp=new THREE.Vector3().crossVectors(dir,Math.abs(dir.z)<.9?new THREE.Vector3(0,0,1):new THREE.Vector3(1,0,0)).normalize().multiplyScalar(.13);
    for(let k=0;k<o;k++){const off=perp.clone().multiplyScalar(k-(o-1)/2);
      const c=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,len,12),new THREE.MeshPhongMaterial({color:0xb8c4d0}));
      c.position.copy(P[i]).add(d.clone().multiplyScalar(.5)).add(off);c.quaternion.setFromUnitVectors(Y,dir);mv.g.add(c);}});
  mv.g.rotation.set(.3,0,0);mv.auto=true;
  const atoms={};m.a.forEach(a=>atoms[a[0]]=(atoms[a[0]]||0)+1);
  $("#minfo").innerHTML=`<h2>${m.name}</h2><div class="eq">${fmt(m.f)}</div><p>${m.info}</p><p class="sub">Atomlar: ${Object.entries(atoms).map(([k,v])=>k+"×"+v).join(", ")} · Bog'lar: ${m.b.length}</p>
   <p class="sub">Ranglar: H — oq, C — kulrang, N — ko'k, O — qizil, Cl — yashil.</p>`;
  S.mols[id]=1;save();if(cnt(S.mols)>=5)unlock("mol5");
}

/* ---------- Zanjirlar ---------- */
function initChains(){
  const el=$("#tab-chains");
  el.innerHTML=`<h2>🔗 Zanjirlar</h2><p class="sub">O'zgarishlar zanjiri: har bosqichda to'g'ri reagentni tanlang.</p><div id="cl"></div>`;
  const prog={};
  function draw(){
    $("#cl").innerHTML=CHAINS.map((c,ci)=>{const p=prog[ci]||0,done=p>=c.steps.length||S.chains[ci];
      const path=[c.start,...c.steps.slice(0,done?c.steps.length:p).map(s=>s[2])].map(fmt).join(" → ");
      let q="";
      if(!done){const s=c.steps[p],cur=p?c.steps[p-1][2]:c.start;
        q=`<p>${fmt(cur)} → <b>${fmt(s[2])}</b> uchun reagent:</p><div class="opts">${shuffle([s[0],...s[1]]).map(o=>`<button class="opt" data-c="${ci}" data-o="${o}">${fmt(o)}</button>`).join("")}</div>`;}
      return`<div class="item"><div class="hd"><b>${c.t}</b>${done?'<span class="done">✔ Tugadi</span>':`<span class="sub">${p}/${c.steps.length}</span>`}</div><div class="eq">${path}</div>${q}</div>`;}).join("");
  }
  $("#cl").onclick=e=>{const b=e.target.closest(".opt");if(!b)return;const ci=+b.dataset.c,p=prog[ci]||0,s=CHAINS[ci].steps[p];
    if(b.dataset.o===s[0]){prog[ci]=p+1;addXP(5);if(prog[ci]>=CHAINS[ci].steps.length){S.chains[ci]=1;addXP(20);save();unlock("chain1");toast("🔗 Zanjir tugadi! +20 XP");}}
    else{b.classList.add("no");toast("❌ Noto'g'ri, yana urinib ko'ring");return;}
    draw();};
  draw();
}

/* ---------- Darslar ---------- */
function initLessons(){
  const el=$("#tab-lessons");
  el.innerHTML=`<h2>📚 Darslar</h2><p class="sub">Qisqa nazariya va tekshiruv savollari. Barcha savolga to'g'ri javob bersangiz dars tugaydi.</p><div id="ls"></div>`;
  const ok={};
  function draw(open){
    $("#ls").innerHTML=LESSONS.map((l,i)=>`<div class="item"><div class="hd" data-i="${i}"><b>${i+1}. ${l.t}</b>${S.lessons[i]?'<span class="done">✔</span>':""}</div>
     <div class="body" ${open===i?"":'hidden'}>${l.h}${l.q.map((q,qi)=>`<p><b>${q[0]}</b></p><div class="opts">${shuffle([q[1],...q[2]]).map(o=>`<button class="opt ${ok[i+"_"+qi]===o?"ok":""}" data-i="${i}" data-q="${qi}" data-o="${o}">${o}</button>`).join("")}</div>`).join("")}</div></div>`).join("");
  }
  $("#ls").onclick=e=>{
    const hd=e.target.closest(".hd");if(hd){const b=hd.nextElementSibling;b.hidden=!b.hidden;return;}
    const b=e.target.closest(".opt");if(!b)return;const i=+b.dataset.i,qi=+b.dataset.q;
    if(b.dataset.o===LESSONS[i].q[qi][1]){ok[i+"_"+qi]=b.dataset.o;addXP(3);b.classList.add("ok");
      if(LESSONS[i].q.every((_,k)=>ok[i+"_"+k])&&!S.lessons[i]){S.lessons[i]=1;addXP(20);save();unlock("lesson1");toast("📚 Dars tugadi! +20 XP");
        if(cnt(S.lessons)>=LESSONS.length)unlock("lesson_all");draw(i);}}
    else{b.classList.add("no");toast("❌ Qayta urinib ko'ring");}
  };
  draw();
}

/* ---------- Amaliyot ---------- */
function initPrac(){
  const el=$("#tab-practicals");
  el.innerHTML=`<h2>🥼 Amaliyot</h2><p class="sub">Amaliy ishlar yo'riqnomasi. Bajargan qadamlaringizni belgilab boring.</p><div id="pr"></div>`;
  function draw(){
    $("#pr").innerHTML=PRACTICALS.map((p,i)=>{const n=p.steps.filter((_,k)=>S.steps[i+"_"+k]).length;
      return`<div class="item"><div class="hd" data-i="${i}"><b>${i+1}. ${p.t}</b><span class="${n===p.steps.length?"done":"sub"}">${n}/${p.steps.length}</span></div>
      <div class="body steps" hidden><div class="prog"><i style="width:${n/p.steps.length*100}%"></i></div>
      ${p.steps.map((s,k)=>`<label><input type="checkbox" data-k="${i}_${k}" ${S.steps[i+"_"+k]?"checked":""}> ${s}</label>`).join("")}<p class="eq">${fmt(p.note)}</p></div></div>`;}).join("");
  }
  $("#pr").onclick=e=>{const hd=e.target.closest(".hd");if(hd){hd.nextElementSibling.hidden=!hd.nextElementSibling.hidden;}};
  $("#pr").onchange=e=>{const c=e.target;if(c.type!=="checkbox")return;const open=$$("#pr .body").map(b=>!b.hidden);
    S.steps[c.dataset.k]=c.checked?1:0;const i=+c.dataset.k.split("_")[0];save();
    if(PRACTICALS[i].steps.every((_,k)=>S.steps[i+"_"+k])&&!S.prac[i]){S.prac[i]=1;addXP(25);unlock("prac1");toast("🥼 Amaliy ish tugadi! +25 XP");}
    draw();$$("#pr .body").forEach((b,k)=>b.hidden=!open[k]);};
  draw();
}

/* ---------- Hisoblash ---------- */
function parseGroup(p){
  let i=0;const st=[{}];
  const add=(o,k,v)=>o[k]=(o[k]||0)+v;
  const num=()=>{let s="";while(/\d/.test(p[i]||""))s+=p[i++];return s?+s:1;};
  while(i<p.length){
    const ch=p[i];
    if(ch==="("||ch==="["){st.push({});i++;}
    else if(ch===")"||ch==="]"){i++;const t=st.pop(),n=num();if(!st.length)throw Error("Qavs xato");Object.entries(t).forEach(([k,v])=>add(st[st.length-1],k,v*n));}
    else if(/[A-Z]/.test(ch)){let s=ch;i++;if(/[a-z]/.test(p[i]||""))s+=p[i++];if(!EL_BY_SYM[s])throw Error("Noma'lum element: "+s);add(st[st.length-1],s,num());}
    else throw Error("Noto'g'ri belgi: «"+ch+"»");
  }
  if(st.length!==1)throw Error("Qavs yopilmagan");return st[0];
}
function parseFormula(s){
  s=s.trim().replace(/[·.]/g,"*");if(!s)throw Error("Formulani kiriting");
  const tot={};s.split("*").forEach(part=>{let m=1;const mm=part.match(/^(\d+)(.*)$/);if(mm){m=+mm[1];part=mm[2];}
    Object.entries(parseGroup(part)).forEach(([k,v])=>tot[k]=(tot[k]||0)+v*m);});
  return tot;
}
const molarMass=f=>Object.entries(parseFormula(f)).reduce((s,[k,v])=>s+EL_BY_SYM[k].mass*v,0);
const r4=x=>Math.round(x*10000)/10000;
function balance(eq){
  const sides=eq.split(/→|->|=>|=/);if(sides.length!==2)throw Error("Tenglamada = yoki → belgisi bo'lsin");
  const L=sides[0].split("+").map(s=>s.trim()).filter(Boolean),R=sides[1].split("+").map(s=>s.trim()).filter(Boolean);
  const all=[...L,...R],ps=all.map(parseFormula),els=[...new Set(ps.flatMap(p=>Object.keys(p)))];
  const A=els.map(e=>all.map((_,j)=>(ps[j][e]||0)*(j<L.length?1:-1)));
  const n=all.length,m=els.length,piv=[];let row=0;
  for(let c=0;c<n&&row<m;c++){let b=row;for(let r=row;r<m;r++)if(Math.abs(A[r][c])>Math.abs(A[b][c]))b=r;
    if(Math.abs(A[b][c])<1e-9)continue;[A[row],A[b]]=[A[b],A[row]];const d=A[row][c];A[row]=A[row].map(v=>v/d);
    for(let r=0;r<m;r++)if(r!==row){const f=A[r][c];if(f)A[r]=A[r].map((v,k)=>v-f*A[row][k]);}piv.push(c);row++;}
  const free=[...Array(n).keys()].filter(c=>!piv.includes(c));
  if(free.length!==1)throw Error("Bu tenglamani tenglashtirib bo'lmadi");
  const x=Array(n).fill(0);x[free[0]]=1;piv.forEach((c,r)=>x[c]=-A[r][free[0]]);
  for(let k=1;k<=200;k++){const y=x.map(v=>v*k);if(y.every(v=>Math.abs(v-Math.round(v))<1e-6&&Math.round(v)>0)){
    const co=y.map(Math.round);return all.map((s,j)=>(co[j]===1?"":co[j])+s).slice(0,L.length).join(" + ")+" → "+all.map((s,j)=>(co[j]===1?"":co[j])+s).slice(L.length).join(" + ");}}
  throw Error("Koeffitsientlar topilmadi");
}
function initTools(){
  const el=$("#tab-tools");
  el.innerHTML=`<h2>🧮 Hisoblash</h2><p class="sub">Formulalarni oddiy yozing: H2SO4, Ca(OH)2, CuSO4*5H2O</p>
  <div class="grid2"><div class="card"><h3 style="margin-top:0">Molyar massa</h3><input id="mf" value="H2SO4" size="18"> <button class="btn pri" id="mb">Hisobla</button><div class="out" id="mo"></div></div>
  <div class="card"><h3 style="margin-top:0">Mol va massa</h3><input id="cf" value="H2O" size="8"> <input id="cm" type="number" value="36" step="any" style="width:90px"> g <button class="btn pri" id="cb">Hisobla</button><div class="out" id="co"></div></div>
  <div class="card"><h3 style="margin-top:0">Eritma konsentratsiyasi</h3>m(modda) <input id="s1" type="number" value="20" style="width:80px"> g, m(eritma) <input id="s2" type="number" value="100" style="width:80px"> g <button class="btn pri" id="sb">w = ?</button><div class="out" id="so"></div></div>
  <div class="card"><h3 style="margin-top:0">pH hisoblash</h3>C <input id="pc" type="number" value="0.01" step="any" style="width:90px"> mol/l <select id="pt2"><option value="a">kuchli kislota (bir negizli)</option><option value="b">kuchli asos (bir kislotali)</option></select> <button class="btn pri" id="pb">pH = ?</button><div class="out" id="po"></div></div>
  <div class="card" style="grid-column:1/-1"><h3 style="margin-top:0">⚖️ Tenglama tenglashtirish</h3><input id="bq" value="Fe + O2 -> Fe2O3" size="34"> <button class="btn pri" id="bb">Tenglashtir</button><div class="out" id="bo"></div></div></div>`;
  const run=(id,fn)=>{$("#"+id[0]+"b").onclick=()=>{const o=$("#"+id[0]+"o");try{o.innerHTML=fn();}catch(e){o.innerHTML=`<span class="err">${e.message}</span>`;}};};
  run("m",()=>{const p=parseFormula($("#mf").value),M=molarMass($("#mf").value);unlock("calc");
    return`<b>M = ${r4(M)} g/mol</b><br>`+Object.entries(p).map(([k,v])=>`${k}: ${v} × ${EL_BY_SYM[k].mass} = ${r4(v*EL_BY_SYM[k].mass)}`).join("<br>")+"<br>"+Object.entries(p).map(([k,v])=>`w(${k}) = ${r4(v*EL_BY_SYM[k].mass/M*100)}%`).join(", ");});
  run("c",()=>{const M=molarMass($("#cf").value),m=+$("#cm").value;if(!(m>=0))throw Error("Massani kiriting");const n=m/M;unlock("calc");
    return`M = ${r4(M)} g/mol<br>n = m/M = <b>${r4(n)} mol</b><br>N = ${(n*6.022e23).toExponential(3)} ta zarracha<br>Gaz bo'lsa V(n.sh.) = ${r4(n*22.4)} l`;});
  run("s",()=>{const a=+$("#s1").value,b=+$("#s2").value;if(!(b>0)||a>b)throw Error("m(eritma) ≥ m(modda) > 0 bo'lsin");return`w = ${a}/${b} · 100% = <b>${r4(a/b*100)}%</b><br>m(suv) = ${r4(b-a)} g`;});
  run("p",()=>{const c=+$("#pc").value;if(!(c>0))throw Error("C > 0 bo'lsin");const a=$("#pt2").value==="a";const ph=a?-Math.log10(c):14+Math.log10(c);
    return`<b>pH = ${r4(ph)}</b> — ${ph<7?"kislotali":ph>7?"ishqoriy":"neytral"} muhit`;});
  run("b",()=>{const r=balance($("#bq").value);unlock("balance");return`<b>${fmt(r)}</b>`;});
}

/* ---------- Yutuqlar ---------- */
function renderAch(){
  const n=ACHS.filter(a=>S.ach[a[0]]).length;
  $("#tab-discoveries").innerHTML=`<h2>🏆 Yutuqlar</h2><p class="sub">${n} / ${ACHS.length} yutuq · ${S.xp} XP · Daraja ${Math.floor(S.xp/100)+1}</p>
  <div class="badges">${ACHS.map(a=>`<div class="badge ${S.ach[a[0]]?"on":""}"><div class="ic">${a[1]}</div><b>${a[2]}</b><div class="sub">${a[3]}</div></div>`).join("")}</div>
  <p class="sub" style="margin-top:16px">Topilgan reaksiyalar: ${cnt(S.rx)}/${REACTIONS.length} · Ko'rilgan molekulalar: ${cnt(S.mols)}/${MOLS.length} · Ochilgan elementlar: ${cnt(S.els)}/118</p>
  <button class="btn" id="rst">Natijalarni tozalash</button>`;
  $("#rst").onclick=()=>{if(confirm("Barcha natijalar o'chirilsinmi?")){S={xp:0,ach:{},rx:{},mols:{},els:{},lessons:{},chains:{},prac:{},steps:{},quiz:0};save();location.reload();}};
}

Object.assign(window.KL,{save,addXP,unlock,toast,fmt,cnt,shuffle,rnd,isLab:()=>current==="lab",go:showTab});
Object.defineProperty(window.KL,"S",{get:()=>S});
renderPlayer();
const h0=location.hash.slice(1);showTab(tabs[h0]?h0:"lab");
})();
