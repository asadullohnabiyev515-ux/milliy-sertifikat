// KimyoLab — laboratoriya bo'limi: boshqaruv, panellar, jurnal, himoya, Ustoz, amaliy ishlar
(function(KL){
"use strict";
const $=KL.$,$$=KL.$$,fmt=KL.fmt,S=()=>KL.S;
const LAB=KL.lab={active:false,dbg:()=>({V,D3})};
let V,D3=null,el,last=0,hudT=0,joy={x:0,y:0},prac=null,ctx=null,board=[],pending=null,now=0,popT=0;
const GEAR=[["xalat","🥼","Laboratoriya xalati"],["koz","🥽","Himoya ko'zoynagi"],["qol","🧤","Rezina qo'lqop"]];
const gearOk=()=>GEAR.every(g=>S().gear[g[0]]);
const newSince=()=>({add:new Set,rx:new Set,gas:new Set,clean:false});
let since=newSince();
const uniHTML=h=>String(h||"").replace(/<sub>([^<]*)<\/sub>/g,(m,d)=>KL.uni("X"+d).slice(1)).replace(/<sup>([^<]*)<\/sup>/g,(m,d)=>KL.uniSup(d.replace("−","-"))).replace(/<small>[^<]*<\/small>/g,"").replace(/<[^>]+>/g,"").replace(/&amp;/g,"&");

KL.tabs.lab={
  init(e){el=e;build();},
  show(arg){LAB.active=true;if(D3){D3.active=true;D3.resize();}if(arg&&arg.practical)LAB.startPractical(arg.practical);rotHint();},
  hide(){LAB.active=false;if(D3)D3.active=false;tip(null);}
};

/* ---------- tuzilma ---------- */
function build(){
  el.innerHTML=`<div class="scene" id="scene">
  <canvas class="gl" id="gl" aria-label="3D kimyo laboratoriyasi"></canvas>
  <div class="tip" id="tip" hidden></div>
  <div class="hud-tl"><div class="task glass" id="task"></div></div>
  <div class="hud-tr">
    <button class="hbtn glass" id="gearBtn" title="Himoya vositalari">${GEAR.map(g=>`<span data-g="${g[0]}">${g[1]}</span>`).join("")}</button>
    <button class="hbtn glass" id="benchBtn" title="Tajriba stoliga qaytish">🧪<span class="lbl"> Stol</span></button>
    <button class="hbtn glass" id="helpBtn" title="Boshqaruv va yordam">?</button>
  </div>
  <div class="pop glass" id="pop" hidden></div>
  <div class="joy" id="joy" aria-hidden="true"><i></i></div>
  <div class="hud-b">
    <button class="btn glass" data-p="rg"><i>⚗️</i><span class="l"> Reaktivlar</span><span class="m">Moddalar</span></button>
    <button class="btn glass" data-p="vessel"><i>🧪</i><span class="l"> Idish</span><span class="m">Idish</span></button>
    <button class="btn glass" data-p="chat"><i>🎓</i><span class="l"> Ustoz</span><span class="m">Ustoz</span></button>
    <button class="btn glass" id="focusBtn"><i>🔍</i><span class="l"> Yaqinlashish</span><span class="m">Yaqin</span></button>
  </div>
  <section class="panel" id="p-rg" aria-label="Reaktivlar"><header><span class="grip" aria-hidden="true"></span><h3>⚗️ Reaktivlar</h3><button class="x" data-cp>✕</button></header>
    <input id="rgq" type="search" placeholder="Qidirish: HCl, mis, indikator…" autocomplete="off">
    <div class="chips gf" id="rgf">${[["","Hammasi"],["acid","Kislota"],["base","Ishqor"],["salt","Tuz"],["solid","Qattiq"],["org","Organik"],["ind","Indikator"]].map(([g,n],i)=>`<button class="chip${i?"":" on"}" data-gf="${g}">${n}</button>`).join("")}</div>
    <div id="rgr"></div><div id="rgl"></div><p class="mut">Stoldagi polkadan shishani bosib ham tanlash mumkin. Har bir eritma ulushi — 0,1 M.</p></section>
  <section class="panel" id="p-vessel" aria-label="Idish"><header><span class="grip" aria-hidden="true"></span><h3>🧪 Idish</h3><button class="x" data-cp>✕</button></header>
    <div class="seg" id="vt">${Object.entries(KL.VESSELS).map(([k,v])=>`<button data-v="${k}">${v.n}</button>`).join("")}</div>
    <div class="stats"><div><b id="st-ml">0</b><small id="st-cap">ml</small></div><div><b id="st-t">20°</b><small>harorat</small></div><div><b id="st-ph">—</b><small id="st-med">pH</small></div></div>
    <div class="phbar" title="pH shkalasi: 0 — kuchli kislotali, 7 — neytral, 14 — kuchli ishqoriy"><i id="phm"></i></div>
    <canvas id="v2d" width="300" height="300" hidden></canvas>
    <div class="acts"><button data-act="heat">🔥 Qizdirish</button><button data-act="uv">💜 UV nur</button><button data-act="elec">⚡ Elektroliz</button><button data-act="stir">🥄 Aralashtirish</button><button data-act="clean">🧽 Tozalash</button></div>
    <div id="cont" class="cont"></div>
    <h4>📓 Kuzatuvlar jurnali</h4><div id="log" class="log"><p class="mut">Hali reaksiya kuzatilmadi.</p></div></section>
  <section class="panel" id="p-gear" aria-label="Himoya vositalari"><header><span class="grip" aria-hidden="true"></span><h3>🥽 Himoya vositalari</h3><button class="x" data-cp>✕</button></header>
    <p class="mut">Tajribadan oldin tartib bilan kiying: avval xalat, keyin ko'zoynak, oxirida qo'lqop. Kiyim ilgichi eshik yonida.</p>
    <button class="btn pri wide" id="gearAll">🥼🥽🧤 Hammasini kiyish</button>
    <div id="gearL"></div><div class="row"><button class="btn" id="goHang">🚶 Kiyim ilgichiga borish</button><button class="btn ghost" id="unGear">Yechish</button></div></section>
  <section class="panel" id="p-chat" aria-label="Ustoz"><header><span class="grip" aria-hidden="true"></span><h3>🎓 Ustoz</h3><button class="x" data-cp>✕</button></header>
    <p class="mut">Ichki yordamchi (internetsiz): reaksiyalar, moddalar va darslar bo'yicha javob beradi.</p>
    <div class="chat" id="chat"></div>
    <div class="chips" id="qs">${["Oxirgi reaksiyani tushuntir","Idishda nima bor?","pH nima?","Qanday tajriba qilay?","Boshqaruv"].map(q=>`<button class="chip" data-q="${q}">${q}</button>`).join("")}</div>
    <form id="qf" class="row"><input id="qi" placeholder="Savolingizni yozing… (masalan: CuSO4 nima?)" autocomplete="off"><button class="btn pri" aria-label="Yuborish">➤</button></form></section>
  <div class="rot glass" id="rot" hidden>📱↻ Telefonni yonboshiga buring — tajriba stoli kengroq ko'rinadi <button class="x" id="rotX">✕</button></div>
  </div>`;
  V=new KL.Vessel(S().vessel);
  renderReagents();renderGear();chatSay(greet(),"ai");
  // hodisalar
  $("#scene").addEventListener("click",e=>{const b=e.target.closest("[data-p]");if(b)togglePanel(b.dataset.p);if(e.target.closest("[data-cp]"))closePanels();});
  $("#gearBtn").onclick=()=>togglePanel("gear");
  $("#benchBtn").onclick=()=>{if(D3){D3.goBench();setFocusBtn();}};
  $("#helpBtn").onclick=help;
  $("#focusBtn").onclick=()=>{if(!D3)return;D3.focus(D3.mode!=="orbit");setFocusBtn();};
  $("#rgq").oninput=()=>renderReagents();
  $("#rgf").onclick=e=>{const b=e.target.closest("[data-gf]");if(!b)return;rgGroup=b.dataset.gf;$$("#rgf .chip").forEach(x=>x.classList.toggle("on",x===b));renderReagents();};
  const pickR=e=>{const b=e.target.closest("[data-k]");if(b){addReagent(b.dataset.k);b.classList.remove("tap");void b.offsetWidth;b.classList.add("tap");}};
  $("#rgl").onclick=pickR;$("#rgr").onclick=pickR;
  $("#gearAll").onclick=equipAll;
  $("#vt").onclick=e=>{const b=e.target.closest("[data-v]");if(b&&b.dataset.v!==V.type)newVessel(b.dataset.v,true);};
  $$("[data-act]",el).forEach(b=>b.onclick=()=>act(b.dataset.act));
  $("#gearL").onclick=e=>{const b=e.target.closest("[data-gi]");if(b)equip(b.dataset.gi);};
  $("#goHang").onclick=()=>{if(D3){D3.goHanger();setFocusBtn();closePanels();}};
  $("#unGear").onclick=()=>{S().gear={};KL.save();renderGear();if(D3)D3.setGear(S().gear);};
  $("#log").onclick=e=>{const b=e.target.closest("[data-why]");if(b){const en=V.log.find(x=>x.id===b.dataset.why);if(en){openPanel("chat");chatSay("Bu reaksiyani tushuntiring","me");chatSay(explain(en),"ai");}}};
  $("#qf").onsubmit=e=>{e.preventDefault();const q=$("#qi").value.trim();if(!q)return;$("#qi").value="";chatSay(KL.esc(q),"me");chatSay(ask(q),"ai");};
  $("#qs").onclick=e=>{const b=e.target.closest("[data-q]");if(b){chatSay(b.dataset.q,"me");chatSay(ask(b.dataset.q),"ai");}};
  $("#pop").onclick=()=>openPanel("vessel");
  $("#rotX").onclick=()=>{S().seen.rot=1;KL.save();$("#rot").hidden=true;};
  $("#task").onclick=e=>{const b=e.target.closest("[data-ta]");if(!b)return;const a=b.dataset.ta;
    if(a==="cancel"){prac=null;renderTask();KL.toast("Amaliy ish to'xtatildi");}if(a==="list")KL.go("practicals");if(a==="gear")togglePanel("gear");if(a==="gearAll")equipAll();
    if(a==="hide"){const c=S().seen.task===undefined?(innerWidth<760||innerHeight<500):S().seen.task;S().seen.task=!c;KL.save();renderTask();}if(a==="hint")stepHint();};
  addEventListener("keydown",e=>{if(!LAB.active)return;if(e.key==="Escape")closePanels();});
  joystick();sheetDrag();
  try{
    if(!window.THREE)throw Error("Three.js yuklanmadi");
    D3=new KL.Lab3D($("#gl"),$("#scene"),{onPick,onHover:tip,onMode:setFocusBtn});
    D3.active=LAB.active;D3.setGear(S().gear);D3.setVessel(V.type);
    if(gearOk())D3.goBench();
  }catch(err){
    console.warn("3D ishga tushmadi:",err);D3=null;$("#gl").hidden=true;$("#v2d").hidden=false;$("#scene").classList.add("no3d");
    openPanel("vessel");KL.toast("3D grafika ishlamadi — soddalashtirilgan ko'rinish yoqildi.");
  }
  setVesselTabs();renderTask();requestAnimationFrame(loop);
}

/* ---------- asosiy sikl ---------- */
function loop(t){
  requestAnimationFrame(loop);
  const dt=Math.min(.1,(t-last)/1000||0);last=t;
  if(!LAB.active)return;
  now+=dt;V.step(dt);drain();
  if(D3){D3.pptQ=(D3.pptQ||[]).concat(V.pptNew);V.pptNew.length=0;D3.move(dt,joy);D3.update(dt,V.view());D3.render(dt);}
  else{V.pptNew.length=0;draw2D();}
  if(pending&&now-pending.t>1.8){
    // indikator yoki rang o'zgarishi ham ko'rinadigan o'zgarish — bunda «o'zgarish yo'q» demaymiz
    const c=V.color(),d=(a,b)=>a&&b?KL.hex(a).reduce((s,v,i)=>s+Math.abs(v-KL.hex(b)[i]),0):0,colorChanged=pending.col&&c&&d(pending.col,c.c)>45;
    if(V.lastRx<pending.vt&&V.added.length>=1&&pending.k!=="drop"&&pending.k!=="water"&&!colorChanged){const h=V.hint();if(V.added.length>1||!/kuzatilmadi/.test(h))pop(`<b>Kuzatuv</b><p>${h}</p>`);}
    pending=null;}
  if(prac)checkPrac();
  if(popT>0&&(popT-=dt)<=0)$("#pop").hidden=true;
  hudT+=dt;if(hudT>.15){hudT=0;hud();}
}
function drain(){
  if(!V.events.length)return;
  const ev=V.events.splice(0);
  ev.forEach(e=>{
    if(e.type==="rx"){
      since.rx.add(e.id);const en=e.entry;renderLog();
      const isNew=KL.discover(en);
      pop(`<span class="tag">${en.t}</span>${en.mol?`<div class="eq">${en.mol}</div>`:en.ionic?`<div class="eq">${en.ionic}</div>`:""}<p>${en.obs}</p>${isNew?`<small class="gold">🔬 Yangi kashfiyot! +10 XP</small>`:""}`);
      const line=uniHTML(en.mol||en.ionic||"");if(line){board.unshift(line);board=board.slice(0,4);if(D3)D3.setBoard(board);}
      if(e.rule&&e.rule.fx==="violent")KL.sfx.sizzle();else if(/Gaz|gaz/.test(en.t)||/ajral/.test(en.obs))KL.sfx.fizz();else KL.sfx.ding();
    }else if(e.type==="gas"){since.gas.add(e.id);const G=KL.GASES[e.id];if(G&&G.note&&!V["n_"+e.id]){V["n_"+e.id]=1;setTimeout(()=>KL.toast(`💨 <b>${fmt(G.f)}</b> — ${G.note}`),900);}}
    else if(e.type==="hint"){KL.toast("💡 "+e.msg);}
  });
}

/* ---------- reaktiv qo'shish ---------- */
function addReagent(id){
  const s=KL.SHELF_BY_ID[id];if(!s)return;
  if(!gearOk()){warnGear();return;}
  const liquid=s.k==="sol"||s.k==="liq"||s.k==="water";
  if(liquid&&V.vol+1>V.cap+1e-6){KL.toast("⚠️ Idish to'ldi! Tozalang yoki kattaroq idish tanlang.");KL.sfx.err();return;}
  const doAdd=()=>{const before=V.color();const r=V.add(id);if(!r.ok){KL.toast(r.msg);return;}
    ({sol:KL.sfx.pour,liq:KL.sfx.pour,water:KL.sfx.pour,drop:KL.sfx.drop,piece:KL.sfx.clink,powder:KL.sfx.clink,gas:KL.sfx.whoosh})[s.k]();
    since.add.add(id);if(s.ind){S().ind[s.ind]=1;KL.checkAch();}
    if(!S().seen.added){S().seen.added=1;KL.save();renderTask();}
    pending={t:now,vt:V.time,col:before&&before.c,k:s.k};hud();};
  if(D3)D3.pour(id,doAdd);else doAdd();
  const R=S().recent=(S().recent||[]).filter(x=>x!==id);R.unshift(id);R.length=Math.min(R.length,8);KL.save();renderRecent();
  if(!$("#p-rg").classList.contains("open"))KL.toast(`${s.k==="drop"?"💧":s.k==="piece"||s.k==="powder"?"🥄":"🧪"} ${fmt(s.f)} — ${s.n}`);
}
function newVessel(type,user){
  V=new KL.Vessel(type);S().vessel=type;KL.save();since.clean=true;
  if(D3){D3.setVessel(type);D3.fx.B.length=0;D3.fx.Pp.length=0;D3.pptQ=[];}
  setVesselTabs();renderLog();hud();if(user)KL.toast(`🧪 ${KL.VESSELS[type].n} olindi`);
}
function act(a){
  if(a==="clean"){newVessel(V.type);KL.sfx.pour();KL.toast("🧽 Idish yuvildi");return;}
  if(a==="heat"){if(!V.heat&&!gearOk()){warnGear();return;}V.heat=!V.heat;KL.sfx[V.heat?"whoosh":"click"]();KL.toast(V.heat?"🔥 Spirtovka yoqildi":"Spirtovka o'chirildi (qopqog'i bilan)");}
  if(a==="uv"){V.uv=!V.uv;KL.sfx.click();}
  if(a==="elec"){if(!V.elec&&V.water<1e-6){KL.toast("⚡ Elektroliz uchun idishga eritma quying.");KL.sfx.err();return;}V.elec=!V.elec;KL.sfx.zap();}
  if(a==="stir"){V.stirT=4;KL.sfx.clink();}
  hud();
}
function onPick(p){
  if(p.type==="bottle")addReagent(p.id);
  else if(p.type==="gear")equip(p.item);
  else if(p.type==="vessel"){openPanel("vessel");}
  else if(p.type==="lamp")act("heat");
  else if(p.type==="battery")act("elec");
  else if(p.type==="uv")act("uv");
  else if(p.type==="teacher"){openPanel("chat");chatSay(KL.shuffle(["Savollaringiz bo'lsa, bemalol so'rang!","Bugun qaysi reaksiyani o'rganamiz?","Tajribadan oldin xavfsizlik qoidalarini eslang!"])[0],"ai");}
  else if(p.type==="board")KL.toast(board.length?"📋 Doskada bugungi tajribalar tenglamalari yozilgan":"📋 Tajriba qiling — tenglamalar doskaga yoziladi");
  else if(p.type==="poster")KL.go("table");
  else if(p.type==="door")KL.toast("🚪 Darsdan keyin chiqamiz 🙂");
}
function tip(p,x,y){
  const t=$("#tip");if(!t)return;if(!p){t.hidden=true;return;}
  const s=p.type==="bottle"&&KL.SHELF_BY_ID[p.id];
  const txt=s?`<b>${fmt(s.f)}</b> ${s.n}${s.hz?` <span class="hz">⚠ ${s.hz}</span>`:""}`:{gear:(GEAR.find(g=>g[0]===p.item)||[])[2],vessel:"Idish — bosing",lamp:"Spirtovka (yoqish / o'chirish)",battery:"Tok manbai — elektroliz",uv:"UV lampa",teacher:"Ustoz — savol bering",board:"Doska",poster:"Davriy jadvalni ochish",door:"Eshik"}[p.type];
  if(!txt){t.hidden=true;return;}
  const r=$("#scene").getBoundingClientRect();t.innerHTML=txt;t.hidden=false;t.style.left=Math.min(r.width-220,x-r.left+14)+"px";t.style.top=(y-r.top+16)+"px";
}

/* ---------- himoya vositalari ---------- */
function equip(item){
  const g=S().gear,i=GEAR.findIndex(x=>x[0]===item);
  if(g[item])return;
  const miss=GEAR.slice(0,i).find(x=>!g[x[0]]);
  if(miss){KL.toast(`⚠️ Tartib: avval ${miss[2].toLowerCase()}ni kiying.`);KL.sfx.err();return;}
  g[item]=1;KL.save();KL.sfx.whoosh();KL.toast(`${GEAR[i][1]} ${GEAR[i][2]} kiyildi`);
  if(D3)D3.setGear(g);renderGear();
  if(gearOk()){KL.toast("✅ To'liq himoyalangansiz! Tajriba stoliga o'tamiz…","gold");if(!S().seen.gearXp){S().seen.gearXp=1;KL.addXP(5);}KL.checkAch();renderTask();
    setTimeout(()=>{closePanels();if(D3){D3.goBench();setFocusBtn();}},900);}
}
function equipAll(){const miss=GEAR.filter(g=>!S().gear[g[0]]);miss.forEach((g,i)=>setTimeout(()=>equip(g[0]),i*380));}
function warnGear(){KL.toast("⚠️ Avval himoya vositalarini kiying: xalat → ko'zoynak → qo'lqop.");KL.sfx.err();openPanel("gear");}
function renderGear(){
  const g=S().gear;
  $("#gearAll").hidden=gearOk();
  $("#gearL").innerHTML=GEAR.map(([id,ic,n],i)=>`<button class="gear-it ${g[id]?"on":""}" data-gi="${id}" ${!g[id]&&GEAR.slice(0,i).some(x=>!g[x[0]])?"disabled":""}><span class="ic">${ic}</span><span>${i+1}. ${n}</span><b>${g[id]?"✓ kiyildi":"Kiyish"}</b></button>`).join("")+
    (gearOk()?`<p class="ok">✅ To'liq himoyalangansiz. Tajriba boshlash mumkin!</p>`:"");
  $$("#gearBtn [data-g]").forEach(s=>s.classList.toggle("on",!!g[s.dataset.g]));
}

/* ---------- panellar ---------- */
function openPanel(id){
  $$(".panel",el).forEach(p=>p.classList.toggle("open",p.id==="p-"+id));
  $$("[data-p]",el).forEach(b=>b.classList.toggle("on",b.dataset.p===id));
  const phone=innerWidth<760;
  if(id==="vessel"&&D3&&D3.mode!=="orbit"){D3.focus(true);setFocusBtn();}
  if(id==="rg"&&D3&&phone){D3.showRack();setFocusBtn();}
  $("#scene").classList.add("sheet");
  if(id==="vessel")renderLog();
  if(id==="chat")setTimeout(()=>{const c=$("#chat");c.scrollTop=c.scrollHeight;},30);
  sheet();
}
function togglePanel(id){const p=$("#p-"+id);if(p&&p.classList.contains("open"))closePanels();else openPanel(id);}
function closePanels(){$$(".panel",el).forEach(p=>p.classList.remove("open"));$$("[data-p]",el).forEach(b=>b.classList.remove("on"));$("#scene").classList.remove("sheet");sheet();}
// telefonda pastki panelni barmoq bilan cho'zish / qisqartirish (bosilsa — yarim / to'liq)
function sheetDrag(){
  $$(".panel header",el).forEach(h=>{
    let y0=null,h0=0,p=null,moved=false;
    h.addEventListener("pointerdown",e=>{if(!isSheet()||e.target.closest("button"))return;p=h.closest(".panel");y0=e.clientY;h0=p.offsetHeight;moved=false;try{h.setPointerCapture(e.pointerId);}catch(x){}p.style.transition="none";});
    h.addEventListener("pointermove",e=>{if(y0==null)return;const dy=e.clientY-y0;if(Math.abs(dy)>5)moved=true;if(!moved)return;const H=$("#scene").clientHeight;p.style.height=Math.max(H*.22,Math.min(H*.94,h0-dy))+"px";sheet();});
    const up=()=>{if(y0==null)return;y0=null;const H=$("#scene").clientHeight;let f=p.offsetHeight/H;p.style.transition="";
      if(!moved)f=f<.7?.92:.56;else if(f<.3){closePanels();p.style.height="";return;}
      const best=[.4,.56,.92].reduce((a,b)=>Math.abs(b-f)<Math.abs(a-f)?b:a);p.style.height=Math.round(best*H)+"px";setTimeout(sheet,50);};
    h.addEventListener("pointerup",up);h.addEventListener("pointercancel",up);
  });
}
const isSheet=()=>innerWidth<760&&innerHeight>=500;
function sheet(){if(!D3)return;const p=$(".panel.open",el);if(!p){D3.setSheet(0,0);return;}
  if(isSheet())D3.setSheet(p.offsetHeight,0);else D3.setSheet(0,p.offsetWidth/innerWidth>.28?p.offsetWidth+10:0);}
function setFocusBtn(){const b=$("#focusBtn");if(!b||!D3)return;const o=D3.mode==="orbit";b.innerHTML=o?`<i>🚶</i><span class="l"> Yurish</span><span class="m">Yurish</span>`:`<i>🔍</i><span class="l"> Yaqinlashish</span><span class="m">Yaqin</span>`;b.classList.toggle("on",o);}
function setVesselTabs(){$$("#vt [data-v]").forEach(b=>b.classList.toggle("on",b.dataset.v===V.type));}
let rgGroup="";
const rgChip=s=>`<button class="chip rg rg-${s.g}" data-k="${s.id}" title="${KL.esc(s.n)}${s.hz?" — "+s.hz:""}"><b>${s.id==="starch"?"kraxmal":fmt(s.f)}</b><small>${s.n}</small>${s.hz?`<i class="hz">⚠</i>`:""}</button>`;
function renderReagents(){
  const q=($("#rgq").value||"").trim().toLowerCase();
  const match=s=>(!rgGroup||s.g===rgGroup)&&(!q||s.f.toLowerCase().includes(q)||s.n.toLowerCase().includes(q)||(s.g==="ind"&&"indikator".includes(q)));
  $("#rgl").innerHTML=KL.SHELF_GROUPS.map(([g,name])=>{const it=KL.SHELF.filter(s=>s.g===g&&match(s));if(!it.length)return"";
    return`<h4>${name}</h4><div class="chips">${it.map(rgChip).join("")}</div>`;}).join("")||`<p class="mut">Hech narsa topilmadi.</p>`;
  renderRecent();
}
function renderRecent(){const r=$("#rgr");if(!r)return;const R=(S().recent||[]).map(id=>KL.SHELF_BY_ID[id]).filter(Boolean);
  r.innerHTML=R.length&&!rgGroup&&!$("#rgq").value?`<h4>🕘 Oxirgi ishlatilganlar</h4><div class="chips">${R.map(rgChip).join("")}</div>`:"";}
function renderLog(){
  const L=$("#log");if(!L)return;
  if(!V.log.length){L.innerHTML=`<p class="mut">Hali reaksiya kuzatilmadi.</p>`;return;}
  L.innerHTML=V.log.slice(0,30).map(e=>`<div class="entry"><div class="eh"><span class="tag">${e.t}</span><button class="why" data-why="${e.id}">Nega?</button></div>
    ${e.mol?`<div class="eq">${e.mol}</div>`:""}${e.ionic?`<div class="ion"><small>Qisqa ionli:</small> ${e.ionic}</div>`:""}<p>${e.obs}</p></div>`).join("");
}
const medium=p=>p==null?"":p<6.5?"kislotali":p>7.5?"ishqoriy":"neytral";
function hud(){
  const ml=$("#st-ml");if(!ml)return;
  ml.textContent=KL.nice(V.ml,1);$("#st-cap").textContent=`/ ${V.capMl} ml`;
  $("#st-t").textContent=Math.round(V.T)+"°"+(V.boil?" 💨":"");
  const ph=V.pH();$("#st-ph").textContent=ph==null?"—":ph.toFixed(1).replace(".",",");$("#st-med").textContent=ph==null?"pH":medium(ph);
  const m=$("#phm");m.style.left=ph==null?"-20px":`calc(${ph/14*100}% - 3px)`;
  $$("[data-act]",el).forEach(b=>{const a=b.dataset.act;b.classList.toggle("on",a==="heat"?V.heat:a==="uv"?V.uv:a==="elec"?V.elec:a==="stir"?V.stirT>0:false);});
  const c=V.contents(),parts=[];
  if(c.ions.length||c.mols.length)parts.push(`<div><small>Eritmada:</small> ${c.ions.slice(0,9).map(([id,v])=>`<span class="pill">${KL.ionHTML(id)} <i>${KL.nice(v,3)} M</i></span>`).join("")}${c.mols.map(([id])=>`<span class="pill">${KL.MOLS[id].np?KL.MOLS[id].n:fmt(KL.MOLS[id].f)}</span>`).join("")}</div>`);
  if(c.sol.length)parts.push(`<div><small>Qattiq:</small> ${c.sol.map(([id])=>{const s=KL.SOLIDS[id];return`<span class="pill"><i class="dot" style="background:${id==="res"&&V.resCol||s.c}"></i>${s.np?s.n:fmt(s.f)}</span>`;}).join("")}</div>`);
  if(c.ind.length)parts.push(`<div><small>Indikator:</small> ${c.ind.map(id=>{const col=KL.indColor(id,ph);return`<span class="pill"><i class="dot" style="background:${col||"#eee"}"></i>${KL.IND[id].n}</span>`;}).join("")}</div>`);
  if(c.smell.length)parts.push(`<div><small>Hid:</small> 👃 ${c.smell.join(", ")}</div>`);
  if(!parts.length)parts.push(`<p class="mut">Idish bo'sh. «⚗️ Reaktivlar» dan modda tanlang.</p>`);
  $("#cont").innerHTML=parts.join("");
  if(!prac)renderTask(true);
}
function pop(html){const p=$("#pop");p.innerHTML=html;p.hidden=false;popT=7;}

/* ---------- vazifa kartasi: amaliy ish yoki boshlang'ich yo'riqnoma ---------- */
let taskKey="";
function renderTask(soft){
  const t=$("#task");if(!t)return;let html;
  if(prac){const p=prac.p,i=prac.i,st=p.steps[i];
    html=`<div class="th"><b>🥼 ${p.t}</b><button class="x" data-ta="cancel" title="To'xtatish">✕</button></div>
      <div class="prog"><i style="width:${i/p.steps.length*100}%"></i></div><small>${i+1}-qadam / ${p.steps.length}</small><p>${st.t}</p>
      <button class="btn sm ghost" data-ta="hint">💡 Yordam</button>`;}
  else{const g=gearOk(),a=!!S().seen.added,d=Object.keys(S().disc).length>0,pc=Object.keys(S().prac).length>0;
    const collapsed=S().seen.task===undefined?(innerWidth<760||innerHeight<500):S().seen.task;
    if(collapsed&&soft!==false){html=`<div class="th" data-ta="hide"><b>🎯 Vazifalar ${[g,a,d,pc].filter(Boolean).length}/4</b><button class="x" data-ta="hide" title="Ochish">▾</button></div>`;}
    else{const it=[[g,"Himoya vositalarini kiying",`<button class="btn sm pri" data-ta="gearAll">Kiyish</button>`],[a,"Stoldagi polkadan shishani bosing yoki «⚗️ Reaktivlar» dan tanlang",""],[d,"Yana bir modda qo'shib reaksiyani kuzating",""],[pc,"Amaliy ishlardan birini bajaring",`<button class="lnk" data-ta="list">📋</button>`]];
      html=`<div class="th"><b>🎯 Boshlash</b><button class="x" data-ta="hide" title="Yig'ish">▴</button></div><ol class="steps">${it.map(([ok,txt,b])=>`<li class="${ok?"done":""}">${ok?"✅":"⬜"} ${txt} ${ok?"":b}</li>`).join("")}</ol>`;}}
  if(html!==taskKey){taskKey=html;t.innerHTML=html;}
}
LAB.find=function(id){const s=KL.SHELF_BY_ID[id];if(!s)return;openPanel("rg");const q=$("#rgq");q.value=s.f;rgGroup="";$$("#rgf .chip").forEach((x,i)=>x.classList.toggle("on",!i));renderReagents();setTimeout(()=>{const b=$(`#rgl [data-k="${id}"]`);if(b){b.classList.add("flash");b.scrollIntoView({block:"center"});}},50);};
LAB.startPractical=function(id){
  const p=KL.PRACTICALS.find(x=>x.id===id);if(!p)return;
  prac={p,i:0};since=newSince();ctx=null;
  if(KL.current()!=="lab")KL.go("lab");
  KL.toast(`🥼 Amaliy ish: <b>${p.t}</b><br><small>${p.goal}</small>`);renderTask();
  if(p.steps[0].c.gear&&gearOk()){}else if(!gearOk())setTimeout(()=>KL.toast("Avval himoya vositalarini kiying 🥽"),1200);
};
function checkPrac(){
  const st=prac.p.steps[prac.i];
  if(!ctx)ctx={okSince:null};
  Object.assign(ctx,{V,gear:gearOk(),focus:D3?D3.mode==="orbit":true,since,now});
  if(!KL.checkStep(st.c,ctx))return;
  prac.i++;since=newSince();ctx=null;KL.sfx.ding();
  if(prac.i>=prac.p.steps.length){const p=prac.p;prac=null;renderTask();
    const first=!S().prac[p.id];S().prac[p.id]=Date.now();if(first)KL.addXP(40);KL.checkAch();KL.sfx.win();
    KL.modal(`<div class="done-ic">✅</div><h3>Amaliy ish bajarildi!</h3><h4>${p.t}</h4><p><b>Xulosa:</b> ${p.end}</p>${first?`<p class="gold">+40 XP</p>`:""}<div class="row"><button class="btn pri" data-close>Davom etish</button><button class="btn" id="nextPr">Keyingi amaliy ish</button></div>`)
      .el.querySelector("#nextPr").onclick=function(){this.closest(".back").remove();KL.go("practicals");};
    return;}
  KL.toast(`✔ ${prac.i}-qadam bajarildi`);renderTask();
}
function stepHint(){
  if(!prac)return;const c=prac.p.steps[prac.i].c;const s=c.add&&KL.SHELF_BY_ID[c.add];
  const h=c.gear?"Kiyim ilgichi eshik yonida (chap tomonda) yoki yuqoridagi 🥼🥽🧤 tugmasini bosing.":s?`«⚗️ Reaktivlar» panelidan <b>${fmt(s.f)}</b> (${s.n}) ni tanlang yoki stoldagi polkadan toping.`:c.T||c.rx&&/^h_|o_gluCu|o_aldAg/.test(c.rx)?"«🧪 Idish» panelida 🔥 Qizdirish tugmasini bosing (yoki stoldagi spirtovkani bosing).":
    c.elec||c.rx&&/^e_/.test(c.rx)?"«🧪 Idish» panelida ⚡ Elektroliz tugmasini bosing.":c.clean?"«🧪 Idish» panelida 🧽 Tozalash tugmasini bosing.":c.focus?"Pastdagi 🔍 Yaqinlashish tugmasini bosing.":c.vessel?"«🧪 Idish» panelida idish turini tanlang.":"Biroz kuting va idishni kuzating.";
  KL.toast("💡 "+h);
}

/* ---------- Ustoz ---------- */
function chatSay(h,who){const c=$("#chat");if(!c)return;const d=document.createElement("div");d.className="msg "+who;d.innerHTML=h;c.append(d);while(c.children.length>40)c.firstChild.remove();c.scrollTop=c.scrollHeight;}
function greet(){return`Salom! Men laboratoriya ustoziman. Reaksiyalar, moddalar yoki darslar haqida so'rang. Masalan: <i>«neytrallanish nima?»</i>`;}
function explain(e){return`<b>${e.t}.</b> ${KL.TYPE_INFO[e.t]||""}${e.mol?`<div class="eq">${e.mol}</div>`:""}${e.ionic?`<div class="ion"><small>Qisqa ionli:</small> ${e.ionic}</div>`:""}<p>Kuzatuv: ${e.obs}</p>`;}
const IDEAS=[["CuSO4","NaOH","havorang cho'kma"],["FeCl3","KSCN","qon-qizil rang"],["KI","PbNO32","«oltin yomg'ir»"],["CaOH2","CO2","ohakli suv loyqalanadi"],["H2O2","MnO2","kislorod ajraladi"],["NaOH","php","malina rang, so'ng HCl bilan rangsizlantiring"],["AgNO3","NaCl","oq cho'kma, so'ng ammiakli suv qo'shing"],["H2O","mNa","natriy suvda (fenolftalein tomizing!)"],["KMnO4","Na2SO3","muhitga qarab uch xil natija"],["starch","I2","to'q ko'k rang"],["AlCl3","Na2CO3","birgalikdagi gidroliz"],["K2Cr2O7","NaOH","zarg'aldoqdan sariqqa"]];
function ask(q){
  const ql=q.toLowerCase().replace(/[’`ʻʼ‘]/g,"'");
  const f=id=>{const s=KL.SHELF_BY_ID[id];return s.id==="starch"?"kraxmal":fmt(s.f);};
  if(/^(salom|assalom|hello|hi)/.test(ql))return"Va alaykum assalom! Qanday yordam beray?";
  if(/oxirgi|tushuntir/.test(ql))return V.log.length?explain(V.log[0]):"Hali reaksiya bo'lmadi. Ikkita modda tanlab aralashtirib ko'ring — keyin tushuntiraman.";
  if(/idish|nima bor/.test(ql)){const c=V.contents();if(!c.ions.length&&!c.mols.length&&!c.sol.length)return"Idish bo'sh.";
    return`Idishda: ${[...c.ions.map(([id])=>KL.ionHTML(id)),...c.mols.map(([id])=>KL.MOLS[id].np?KL.MOLS[id].n:fmt(KL.MOLS[id].f)),...c.sol.map(([id])=>KL.SOLIDS[id].n)].join(", ")}. ${V.pH()!=null?`pH ≈ ${V.pH().toFixed(1)} (${medium(V.pH())} muhit).`:""}`;}
  if(/\bph\b|muhit|indikator/.test(ql)){const p=V.pH();return`pH — eritmadagi H⁺ ionlari konsentratsiyasining manfiy logarifmi: pH = −lg[H⁺]. pH &lt; 7 kislotali, 7 neytral, &gt; 7 ishqoriy muhit.${p!=null?` Hozir idishda pH ≈ ${p.toFixed(1)} — ${medium(p)} muhit.`:""} Indikatorlar: lakmus, fenolftalein, metiloranj va universal indikator «Indikatorlar» guruhida.`;}
  if(/boshqar|qanday yur|tugma|yordam/.test(ql))return helpText();
  if(/tajriba|nima qilay|qiziq|maslahat|keyingi/.test(ql)){
    if(prac)return`Hozir «${prac.p.t}» amaliy ishi: ${prac.p.steps[prac.i].t}`;
    const ids=KL.shuffle(IDEAS).slice(0,3);return"Mana bir nechta qiziqarli tajriba:<ul>"+ids.map(([a,b,w])=>`<li>${f(a)} + ${f(b)} — ${w}</li>`).join("")+"</ul>Yoki «📋 Amaliyot» bo'limidagi darslik tajribalarini bajaring.";}
  const rg=KL.SHELF.find(s=>{const fm=s.f.toLowerCase();return(fm.length>1&&new RegExp("(^|[^a-z0-9])"+fm.replace(/[()[\]]/g,"\\$&")+"($|[^a-z0-9])").test(ql))||ql.includes(s.n.toLowerCase());});
  if(rg){const parts=(rg.ions||[]).map(([i])=>KL.ionHTML(i)).join(" va ");const ex=IDEAS.filter(x=>x[0]===rg.id||x[1]===rg.id).map(([a,b,w])=>`${f(a)} + ${f(b)} (${w})`);
    return`<b>${fmt(rg.f)}</b> — ${rg.n}.${parts?` Eritmada ${parts} ionlariga ajraladi.`:""}${rg.hz?` ⚠ Ehtiyot bo'ling: ${rg.hz}.`:""}${ex.length?` Sinab ko'ring: ${ex.join("; ")}.`:""}`;}
  const words=ql.split(/[^a-z'ʻ0-9ʼ’₀-₉]+/).filter(w=>w.length>3);
  let best=null,bs=0;
  KL.LESSONS.forEach(l=>{const tx=(l.t+" "+l.h).toLowerCase();let s=0;words.forEach(w=>{if(tx.includes(w.slice(0,Math.max(4,w.length-2))))s++;});if(l.t.toLowerCase().split(" ").some(w=>words.some(x=>x.startsWith(w.slice(0,5)))))s+=2;if(s>bs){bs=s;best=l;}});
  Object.entries(KL.TYPE_INFO).forEach(([t,inf])=>{const tl=t.toLowerCase();if(words.some(w=>tl.includes(w.slice(0,6)))&&bs<3){bs=3;best={t,h:`<p>${inf}</p>`,ti:1};}});
  if(best&&bs>0){const txt=best.h.replace(/<table[\s\S]*?<\/table>/g,"").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
    return`📚 <b>${best.t}</b>: ${txt.slice(0,420)}${txt.length>420?"…":""}${best.id?` <button class="lnk" onclick="KL.go('lessons','${best.id}')">Darsni ochish →</button>`:""}`;}
  return"Bu savolga aniq javob topa olmadim. Boshqacha so'rab ko'ring yoki «📚 Darslar» bo'limiga qarang. Masalan: «ion almashinish», «elektroliz», «KMnO4».";
}
function helpText(){return`<ul class="help"><li><b>Yurish:</b> ${matchMedia("(pointer:coarse)").matches?"chapdagi joystik":"W A S D yoki strelkalar"}; atrofga qarash — ekranni suring.</li><li><b>Tanlash:</b> stoldagi polkadan shishani, spirtovkani, tok manbaini yoki kiyimni bosing.</li><li><b>🔍 Yaqinlashish:</b> idishni yaqindan ko'rish (aylantirish va ${matchMedia("(pointer:coarse)").matches?"ikki barmoq bilan":"g'ildirak bilan"} kattalashtirish).</li><li><b>🧪 Idish:</b> qizdirish, UV nur, elektroliz, pH va kuzatuvlar jurnali.</li><li><b>🎓 Ustoz:</b> istalgan reaksiyani tushuntirib beradi.</li></ul>`;}
function help(){KL.modal(`<h3>🧪 Laboratoriyada ishlash</h3>${helpText()}<p class="mut">Tajribalar xavfsiz — hammasi virtual. Lekin haqiqiy laboratoriyada himoya vositalarisiz ishlamang!</p><div class="row"><button class="btn pri" data-close>Tushunarli</button><button class="btn" id="hPr">📋 Amaliy ishlar</button></div>`).el.querySelector("#hPr").onclick=function(){this.closest(".back").remove();KL.go("practicals");};}

/* ---------- joystik ---------- */
function joystick(){
  const j=$("#joy"),k=j.firstElementChild;let id=null;
  const set=e=>{const b=j.getBoundingClientRect(),dx=e.clientX-b.left-b.width/2,dy=e.clientY-b.top-b.height/2,r=b.width/2-14,m=Math.min(1,Math.hypot(dx,dy)/r),a=Math.atan2(dy,dx);joy={x:Math.cos(a)*m,y:Math.sin(a)*m};k.style.transform=`translate(${joy.x*r}px,${joy.y*r}px)`;};
  j.addEventListener("pointerdown",e=>{id=e.pointerId;j.setPointerCapture(id);set(e);if(D3&&D3.mode==="orbit"){D3.focus(false);setFocusBtn();}});
  j.addEventListener("pointermove",e=>{if(e.pointerId===id)set(e);});
  const end=e=>{if(e.pointerId!==id)return;id=null;joy={x:0,y:0};k.style.transform="";};
  j.addEventListener("pointerup",end);j.addEventListener("pointercancel",end);
}
let rotT=null;
function rotHint(){const r=$("#rot");if(!r)return;r.hidden=!(matchMedia("(pointer:coarse)").matches&&innerHeight>innerWidth&&!S().seen.rot);
  if(!r.hidden){clearTimeout(rotT);rotT=setTimeout(()=>{r.hidden=true;},9000);}}
addEventListener("resize",()=>{rotHint();sheet();});

/* ---------- 3D bo'lmasa: soddalashtirilgan 2D idish ---------- */
let b2=[];
function draw2D(){
  const cv=$("#v2d");if(!cv||cv.hidden)return;const c=cv.getContext("2d"),v=V.view(),W=300,H=300,L=80,R=220,T=40,B=270;
  c.clearRect(0,0,W,H);if(v.heat){const g=c.createRadialGradient(150,B+18,2,150,B+18,50);g.addColorStop(0,"#fff3a0");g.addColorStop(.5,"#ff9a3d");g.addColorStop(1,"rgba(255,60,0,0)");c.fillStyle=g;c.fillRect(90,B-20,120,60);}
  c.save();c.beginPath();c.rect(L,T,R-L,B-T);c.clip();
  const top=B-(B-T)*v.level*.88;
  if(v.col&&v.level>0){let col=v.col.c;if(v.turb>.05)col=KL.mixCol(col,v.turbCol,Math.min(.85,v.turb*.8));c.globalAlpha=Math.max(.45,v.col.alpha);c.fillStyle=col;c.fillRect(L,top,R-L,B-top);c.globalAlpha=1;}
  let ly=B;v.layers.forEach(l=>{const h=Math.min(30,Math.max(2,l.amt*10));c.fillStyle=l.c;c.fillRect(L,ly-h,R-L,h);ly-=h;});
  v.pieces.forEach((p,i)=>{c.fillStyle=KL.SOLIDS[p.id].c;c.beginPath();c.arc(L+40+i*40,ly-8,8*Math.cbrt(p.amt),0,7);c.fill();});
  let g=0;for(const k in v.gas)g+=v.gas[k];if(v.boil)g+=.3;
  if(Math.random()<g*3&&b2.length<80)b2.push({x:rr(L+10,R-10),y:ly-4,r:rr(2,5)});
  c.strokeStyle="rgba(255,255,255,.8)";b2=b2.filter(b=>(b.y-=1.4)>top);b2.forEach(b=>{c.beginPath();c.arc(b.x,b.y,b.r,0,7);c.stroke();});
  if(v.mirror>0){c.fillStyle=`rgba(210,214,220,${v.mirror*.8})`;c.fillRect(L,T,8,B-T);c.fillRect(R-8,T,8,B-T);}
  c.restore();c.strokeStyle="#cfe3f5";c.lineWidth=4;c.beginPath();c.moveTo(L,T);c.lineTo(L,B);c.lineTo(R,B);c.lineTo(R,T);c.stroke();
}
const rr=(a,b)=>a+Math.random()*(b-a);
})(globalThis.KL=globalThis.KL||{});
