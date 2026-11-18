// 3D laboratoriya: xonada yurish + reaktivlar javoni + "Idish" paneli
(()=>{
"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const K=()=>window.KL;
const PH={HCl:1,H2SO4:.5,NaOH:13.5,CuSO4:4,FeCl3:2,AgNO3:6,NaCl:7,BaCl2:7,KI:7,PbNO32:5,CaOH2:12,CH3COOH:2.9,H2O:7,CO2:5.6,NaHCO3:8.3,Zn:7,Mg:7,Fe:7,Na:7,CaCO3:7};
const CAPS={stakan:400,probirka:25,kolba:250};
let bk;
function fresh(keep){return Object.assign({items:[],liq:"",layer:0,layerCol:"#fff",bub:[],ppt:[],steam:[],until:0,strong:false,heat:0,msg:null,temp:20,heating:false,uv:false,elec:false,vessel:"stakan",gear:{xalat:0,koz:0,qol:0}},keep||{});}
const hex2rgb=h=>{h=h.replace("#","");return[0,2,4].map(i=>parseInt(h.substr(i,2),16));};
function mixCol(items){const ls=items.filter(k=>REAGENTS[k].s==="l");if(!ls.length)return"";
  const c=ls.map(k=>hex2rgb(REAGENTS[k].c)).reduce((s,x)=>s.map((v,i)=>v+x[i]/ls.length),[0,0,0]);return"#"+c.map(v=>Math.round(v).toString(16).padStart(2,"0")).join("");}
function phNow(){
  if(!bk.items.some(k=>REAGENTS[k].s==="l")&&!bk.msg)return null;
  if(bk.msg&&/Neytrallanish/.test(bk.msg.type))return 7;
  const ps=bk.items.map(k=>PH[k]??7),H=ps.reduce((s,p)=>s+Math.pow(10,-p),0)/ps.length,OH=ps.reduce((s,p)=>s+Math.pow(10,-(14-p)),0)/ps.length,n=H-OH;
  return Math.min(14,Math.max(0,n>0?-Math.log10(n):14+Math.log10(-n)));
}
const gearOk=()=>bk.gear.xalat&&bk.gear.koz&&bk.gear.qol;

/* ---------- Idish chizish ---------- */
const L=70,R=270,T=40,B=300;
function vpath(c,t){c.beginPath();
  if(t==="probirka"){c.moveTo(135,30);c.lineTo(135,262);c.arc(170,262,35,Math.PI,0,true);c.lineTo(205,30);}
  else if(t==="kolba"){[[145,40],[145,140],[65,290],[75,300],[265,300],[275,290],[195,140],[195,40]].forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));}
  else{c.moveTo(L,T);c.lineTo(L,B);c.lineTo(R,B);c.lineTo(R,T);}}
const SPAN={stakan:[85,255],probirka:[142,198],kolba:[100,240]};
function draw(now){
  requestAnimationFrame(draw);
  const cv=$("#beaker");if(!cv||!K().isLab())return;
  const c=cv.getContext("2d");c.clearRect(0,0,340,340);
  const t=bk.vessel,[x0,x1]=SPAN[t],liqs=bk.items.filter(k=>REAGENTS[k].s==="l").length;
  const col=bk.liq||mixCol(bk.items),lvl=bk.items.length?(liqs||bk.liq?.36+.16*liqs:.1):0;
  const top=B-(B-T)*lvl*(t==="probirka"?1.25:1),active=now<bk.until;
  // harorat
  const target=20+(bk.heating?75:0)+(bk.heat&&active?20:0);bk.temp+=(target-bk.temp)*.012;
  // qizdirish alangasi
  if(bk.heating){const g=c.createRadialGradient(170,B+20,2,170,B+20,60);g.addColorStop(0,"#fff3a0");g.addColorStop(.4,"#ff9a3d");g.addColorStop(1,"#ff3d0000");c.fillStyle=g;c.fillRect(100,B-30,140,80);}
  c.save();vpath(c,t);c.clip();
  if(col&&(liqs||bk.liq)){c.fillStyle=col+"cc";c.fillRect(0,top,340,B-top+30);c.fillStyle="#ffffff30";c.fillRect(0,top,340,3);}
  if(!bk.msg)bk.items.filter(k=>REAGENTS[k].s==="s").forEach((k,i)=>{c.fillStyle=REAGENTS[k].c;const o=x0+10+i*Math.min(60,(x1-x0)/3);c.fillRect(o,B-18,Math.min(34,(x1-x0)/3),14);c.fillRect(o+8,B-28,14,12);});
  if(bk.items.includes("CO2")&&!bk.msg){c.fillStyle="#ffffff55";for(let i=0;i<5;i++)c.fillRect(x0+8+i*((x1-x0-16)/5),T+10+(i%2)*14,6,6);}
  const spawnX=()=>x0+8+Math.random()*(x1-x0-16);
  if(bk.msg){
    if(bk.msg.fx==="gas"&&active)for(let i=0;i<(bk.strong?4:1);i++)bk.bub.push({x:spawnX(),y:B-8,r:2+Math.random()*4,v:1+Math.random()*2});
    if(bk.msg.fx==="ppt"&&active&&bk.ppt.length<80)bk.ppt.push({x:spawnX(),y:top+4,v:.8+Math.random()});
    if(bk.msg.fx==="ppt"&&bk.layer<1)bk.layer+=.004;
  }
  if(bk.temp>88&&col&&(liqs||bk.liq))bk.bub.push({x:spawnX(),y:B-8,r:2+Math.random()*3,v:1.5+Math.random()});
  if(bk.elec&&col&&(liqs||bk.liq)){const ex=[x0+(x1-x0)*.3,x0+(x1-x0)*.7];ex.forEach(x=>{if(Math.random()<.6)bk.bub.push({x:x+(Math.random()*8-4),y:B-40,r:2+Math.random()*2,v:1.5+Math.random()*1.5});});}
  bk.bub=bk.bub.filter(b=>(b.y-=b.v)>top);c.strokeStyle="#fff9";bk.bub.forEach(b=>{c.beginPath();c.arc(b.x,b.y,b.r,0,7);c.stroke();});
  if(bk.msg&&bk.msg.fx==="ppt"){c.fillStyle=bk.layerCol;bk.ppt=bk.ppt.filter(p=>{p.y+=p.v;if(p.y>B-6-bk.layer*28)return false;c.fillRect(p.x,p.y,4,4);return true;});c.fillRect(0,B-4-bk.layer*28,340,bk.layer*28+40);}
  if(bk.heat&&active){const g=c.createLinearGradient(0,B,0,T);g.addColorStop(0,"#ff8a3d55");g.addColorStop(1,"#ff8a3d00");c.fillStyle=g;c.fillRect(0,T,340,B-T);}
  if(bk.elec){c.strokeStyle="#aab4bf";c.lineWidth=5;[x0+(x1-x0)*.3,x0+(x1-x0)*.7].forEach(x=>{c.beginPath();c.moveTo(x,10);c.lineTo(x,B-36);c.stroke();});c.lineWidth=1;}
  if(bk.uv){const g=c.createLinearGradient(0,0,0,340);g.addColorStop(0,"#9b5cff55");g.addColorStop(1,"#9b5cff22");c.fillStyle=g;c.fillRect(0,0,340,340);}
  c.restore();
  // bug
  if(bk.temp>50&&col&&(liqs||bk.liq)&&Math.random()<.15)bk.steam.push({x:(x0+x1)/2+(Math.random()*40-20),y:top,a:.5});
  bk.steam=bk.steam.filter(s=>(s.y-=1,s.a-=.006)>0);bk.steam.forEach(s=>{c.fillStyle=`rgba(255,255,255,${s.a})`;c.beginPath();c.arc(s.x,s.y,6,0,7);c.fill();});
  c.strokeStyle="#cfe3f5";c.lineWidth=4;vpath(c,t);c.stroke();c.lineWidth=1;
  // ko'rsatkichlar
  const ml=liqs?Math.round(liqs*CAPS[t]*.25):0;$("#st-ml").textContent=`${ml} / ${CAPS[t]}`;$("#st-t").textContent=Math.round(bk.temp)+"°";
  const ph=phNow();$("#st-ph").textContent=ph==null?"—":ph.toFixed(1);const m=$("#phm");if(m)m.style.left=ph==null?"-10px":(ph/14*100)+"%";
}

/* ---------- Reaktiv qo'shish / aralashtirish ---------- */
function say(h){$("#obs").innerHTML=h;}
function hud(){const t=bk.items.length?bk.items.map(k=>K().fmt(REAGENTS[k].n)).join(" + "):"bo'sh";const e=$("#hud-in");if(e)e.innerHTML="🧪 Idishda: "+t;const l=$("#bkl");if(l)l.innerHTML=t;
  $$("#rg .chip").forEach(c=>c.classList.toggle("on",bk.items.includes(c.dataset.k)));$("#rxn").textContent=K().cnt(K().S.rx);}
function addReagent(k){
  if(bk.items.includes(k))return;if(bk.items.length>=2)bk.items.shift();bk.items.push(k);
  bk.layer=0;bk.ppt=[];bk.bub=[];bk.until=0;bk.msg=null;bk.liq="";bk.elec=false;hud();K().toast("➕ "+REAGENTS[k].n);
}
function mixIt(){
  if(bk.items.length<2){say("Kamida ikkita reagent tanlang.");return;}
  if(!gearOk()){say("⚠️ Avval himoya vositalarini kiying: xalat, ko'zoynak, qo'lqop.");openPanel("gear");return;}
  const [a,b]=bk.items,r=REACTIONS.find(r=>(r.a===a&&r.b===b)||(r.a===b&&r.b===a));
  if(!r){say("<b>Reaksiya kuzatilmadi.</b> Bu juftlik sezilarli o'zgarish bermaydi.");bk.liq=mixCol(bk.items);bk.msg=null;return;}
  bk.liq=r.col;bk.until=performance.now()+(r.strong?8000:5000);bk.strong=!!r.strong;bk.heat=r.fx==="heat"?1:0;bk.msg=r;bk.layer=0;bk.layerCol=r.ppt||"#fff";bk.ppt=[];
  say(`<div class="eq">${K().fmt(r.eq.replace(/₂/g,"2").replace(/₃/g,"3").replace(/₄/g,"4"))}</div><b>${r.type}</b><br>${r.obs}`);
  const key=r.a+"+"+r.b,S=K().S;
  if(!S.rx[key]){S.rx[key]=1;K().addXP(10);K().save();K().toast("🔬 Yangi reaksiya topildi! +10 XP");}
  K().unlock("first_rx");if(K().cnt(S.rx)>=5)K().unlock("rx5");if(K().cnt(S.rx)>=10)K().unlock("rx10");hud();
}
function elecMsg(){const i=bk.items;
  if(i.includes("NaCl"))return"Katodda H₂, anodda Cl₂ ajraladi; eritmada NaOH to'planadi.";
  if(i.includes("CuSO4"))return"Katodda qizil mis (Cu) cho'kadi, anodda O₂ ajraladi.";
  if(i.includes("HCl"))return"Katodda H₂, anodda Cl₂ ajraladi.";
  return"Suv elektrolizi: katodda H₂ (2 hajm), anodda O₂ (1 hajm) ajraladi.";}
function toggle(what){
  const liquid=bk.items.some(k=>REAGENTS[k].s==="l")||bk.msg;
  if(what==="heat"){bk.heating=!bk.heating;if(bk.heating&&!gearOk()){bk.heating=false;say("⚠️ Qizdirishdan oldin himoya vositalarini kiying.");openPanel("gear");}}
  if(what==="uv"){bk.uv=!bk.uv;if(bk.uv){const r=bk.msg;if(r&&r.ppt==="#fafafa"&&r.a==="AgNO3"){bk.layerCol="#8a7f93";say("<b>UV nur:</b> AgCl yorug'likda parchalanib, kumush ajratadi — cho'kma qorayadi (fotografiya asosi).");}
    else say("<b>UV nur yoqildi.</b> AgCl, AgBr kabi yorug'likka sezgir moddalar bilan sinab ko'ring.");}}
  if(what==="elec"){if(!liquid){say("Elektroliz uchun idishda eritma bo'lishi kerak.");return;}bk.elec=!bk.elec;if(bk.elec){say("<b>Elektroliz:</b> "+elecMsg());K().addXP(3);}}
  $$("[data-act]").forEach(b=>b.classList.toggle("on",!!bk[b.dataset.act==="heat"?"heating":b.dataset.act==="uv"?"uv":"elec"]));
}

/* ---------- Ustoz (ichki yordamchi) ---------- */
function strip(h){return h.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();}
function ask(q){
  const ql=q.toLowerCase();
  if(/idishda|nima bor/.test(ql))return bk.items.length?"Idishda: "+bk.items.map(k=>REAGENTS[k].n).join(" va ")+".":"Idish hozir bo'sh. Javondan reaktiv tanlang.";
  if(/oxirgi|tushuntir/.test(ql)&&bk.msg)return`${bk.msg.eq}. Tur: ${bk.msg.type}. ${bk.msg.obs}`;
  if(/oxirgi|tushuntir/.test(ql))return"Hali reaksiya bajarilmadi. Ikkita reagent tanlab «Aralashtirish» ni bosing.";
  const w=ql.split(/[^a-zа-яʻ'’0-9]+/).filter(x=>x.length>2);if(!w.length)return"Savolni batafsilroq yozing, masalan: «neytrallanish nima?»";
  let best=null,bs=0;
  LESSONS.forEach(l=>{const t=(l.t+" "+strip(l.h)).toLowerCase();const s=w.reduce((a,x)=>a+(t.includes(x)?1:0),0);if(s>bs){bs=s;best={l}}});
  REACTIONS.forEach(r=>{const t=(r.eq+" "+r.type+" "+r.obs+" "+r.a+" "+r.b).toLowerCase();const s=w.reduce((a,x)=>a+(t.includes(x)?1.5:0),0);if(s>bs){bs=s;best={r}}});
  if(!best)return"Bu savol bo'yicha ma'lumot topilmadi. «Darslar» bo'limiga qarang yoki boshqacha so'rang.";
  return best.r?`${best.r.eq}. ${best.r.type}. ${best.r.obs}`:`📚 ${best.l.t}: `+strip(best.l.h).slice(0,380)+"…";
}

/* ---------- Panellar ---------- */
function openPanel(id){$$(".panel").forEach(p=>p.classList.toggle("open",p.id==="p-"+id&&!p.classList.contains("open")||false));
  $$("[data-p]").forEach(b=>b.classList.toggle("on",$("#p-"+b.dataset.p).classList.contains("open")));}
function closePanels(){$$(".panel").forEach(p=>p.classList.remove("open"));$$("[data-p]").forEach(b=>b.classList.remove("on"));}

window.KL_initLab=function(){
  bk=fresh();
  const el=$("#tab-lab");
  el.innerHTML=`<div class="scene" id="scene"><canvas class="gl" id="gl"></canvas>
  <div class="hud-top"><button class="btn glass" id="goBench">🧪 Tajriba stoliga qaytish</button><span class="glass" id="hud-in">🧪 Idishda: bo'sh</span><button class="btn glass" data-p="gear">🥽 Himoya</button></div>
  <div class="joy" id="joy"><i></i></div>
  <div class="hud-bottom"><button class="btn glass" data-p="rg">⚗️ Reaktivlar</button><button class="btn glass" data-p="vessel">🥤 Idish</button><button class="btn glass" data-p="chat">🎓 Ustoz</button></div>
  <div class="panel" id="p-rg"><h3>Reaktivlar</h3><p class="sub">3D xonadagi javondan ham bosib tanlashingiz mumkin.</p><div class="chips" id="rg"></div><p class="sub" style="margin-top:12px">Idishda: <span id="bkl">bo'sh</span></p><p class="sub">Topilgan reaksiyalar: <b id="rxn"></b> / ${REACTIONS.length}</p></div>
  <div class="panel" id="p-vessel"><h3>Idish</h3>
   <div class="vt" id="vt"><button class="chip on" data-v="probirka">Probirka</button><button class="chip" data-v="stakan">Stakan</button><button class="chip" data-v="kolba">Kolba</button></div>
   <div class="stats"><div><b id="st-ml">0</b><small>ml</small></div><div><b id="st-t">20°</b><small>harorat</small></div><div><b id="st-ph">—</b><small>pH</small></div></div>
   <div class="phbar"><i id="phm" style="left:-10px"></i></div>
   <canvas id="beaker" width="340" height="340"></canvas>
   <div class="acts"><button class="btn pri" id="mix">Aralashtirish</button><button class="btn" data-act="heat">🔥 Qizdirish</button><button class="btn" data-act="uv">💜 UV nur</button><button class="btn" data-act="elec">⚡ Elektroliz</button><button class="btn" id="clr">Tozalash</button></div>
   <div class="obs" id="obs">Kuzatuv shu yerda ko'rinadi.</div></div>
  <div class="panel gear" id="p-gear"><h3>🥽 Himoya vositalari</h3><p class="sub">Tajribadan oldin kiying — usiz aralashtirish va qizdirish mumkin emas.</p>
   <label><input type="checkbox" data-g="xalat"> 🥼 Laboratoriya xalati</label><label><input type="checkbox" data-g="koz"> 🥽 Himoya ko'zoynagi</label><label><input type="checkbox" data-g="qol"> 🧤 Qo'lqop</label><p class="sub" id="gs"></p></div>
  <div class="panel" id="p-chat"><h3>🎓 Ustoz</h3><p class="sub">Ichki yordamchi (internetsiz): darslar va reaksiyalardan javob beradi.</p><div class="chat" id="chat"><div>Salom! Savol bering, masalan: «neytrallanish nima?»</div></div>
   <div class="chips" style="margin-bottom:8px"><button class="chip" data-q="Oxirgi reaksiyani tushuntir">Oxirgi reaksiyani tushuntir</button><button class="chip" data-q="Idishda nima bor?">Idishda nima bor?</button><button class="chip" data-q="Oksidlar nima?">Oksidlar nima?</button></div>
   <form id="qf" style="display:flex;gap:6px"><input id="qi" placeholder="Savolingizni yozing…" style="flex:1"><button class="btn pri">➤</button></form></div></div>`;
  $("#rg").innerHTML=Object.entries(REAGENTS).map(([k,r])=>`<button class="chip" data-k="${k}">${K().fmt(r.n)}</button>`).join("");
  $("#rg").onclick=e=>{const b=e.target.closest(".chip");if(b)addReagent(b.dataset.k);};
  $("#scene").addEventListener("click",e=>{const b=e.target.closest("[data-p]");if(b)openPanel(b.dataset.p);});
  $("#vt").onclick=e=>{const b=e.target.closest(".chip");if(!b)return;bk.vessel=b.dataset.v;bk.layer=0;$$("#vt .chip").forEach(c=>c.classList.toggle("on",c===b));};
  $("#mix").onclick=mixIt;$$("[data-act]").forEach(b=>b.onclick=()=>toggle(b.dataset.act));
  $("#clr").onclick=()=>{bk=fresh({vessel:bk.vessel,gear:bk.gear});hud();say("Idish tozalandi.");$$("[data-act]").forEach(b=>b.classList.remove("on"));};
  $("#p-gear").onchange=e=>{const c=e.target;bk.gear[c.dataset.g]=c.checked?1:0;$("#gs").textContent=gearOk()?"✅ To'liq himoyalangansiz. Tajriba boshlash mumkin!":"";if(gearOk()&&!K().S.gearXp){K().S.gearXp=1;K().addXP(5);}};
  const chat=$("#chat"),reply=q=>{const m=document.createElement("div");m.className="me";m.textContent=q;chat.append(m);const a=document.createElement("div");a.textContent=ask(q);chat.append(a);chat.scrollTop=1e5;};
  $("#qf").onsubmit=e=>{e.preventDefault();const v=$("#qi").value.trim();if(v){reply(v);$("#qi").value="";}};
  $("#p-chat").onclick=e=>{const b=e.target.closest("[data-q]");if(b)reply(b.dataset.q);};
  $("#vt .chip[data-v=stakan]").click();
  hud();requestAnimationFrame(draw);
  try{build3D();}catch(err){console.error(err);$("#scene").insertAdjacentHTML("afterbegin",'<p class="sub" style="padding:20px">3D ishlamadi (WebGL kerak). Reaktivlar va Idish panellari ishlaydi.</p>');openPanel("vessel");}
};

/* ---------- 3D xona ---------- */
function canvasTex(w,h,fn){const c=document.createElement("canvas");c.width=w;c.height=h;fn(c.getContext("2d"),w,h);const t=new THREE.CanvasTexture(c);return t;}
function build3D(){
  const cv=$("#gl"),sceneEl=$("#scene");
  const r=new THREE.WebGLRenderer({canvas:cv,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,2));
  const sc=new THREE.Scene();sc.background=new THREE.Color(0xdde6ee);
  const cam=new THREE.PerspectiveCamera(65,1,.05,60);
  const M=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({color:c},o||{}));
  const box=(w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);sc.add(m);return m;};
  sc.add(new THREE.HemisphereLight(0xffffff,0xb9b2a5,1.05));const dl=new THREE.DirectionalLight(0xffffff,.55);dl.position.set(-3,6,4);sc.add(dl);
  // xona
  box(16,.1,12,0xd8c7a8,0,-.05,0);box(16,.1,12,0xf5f5f2,0,4.05,0);
  box(16,4,.2,0xeef0ee,0,2,-6);box(16,4,.2,0xeef0ee,0,2,6);box(.2,4,12,0xe8ecea,-8,2,0);box(.2,4,12,0xe8ecea,8,2,0);
  box(16,.12,.1,0x8aa3a0,0,1,-5.88);
  // doska
  const bt=canvasTex(1024,400,(c,w,h)=>{c.fillStyle="#1f4a3a";c.fillRect(0,0,w,h);c.strokeStyle="#7a5a3a";c.lineWidth=16;c.strokeRect(0,0,w,h);c.fillStyle="#f0f4ef";c.font="italic 72px serif";c.fillText("Kimyo",400,100);c.font="italic 36px serif";c.fillText("Xush kelibsiz, aziz o'quvchilar!",110,180);c.fillText("Bugun — tajriba va kashfiyotlar kuni",110,240);c.font="48px serif";c.fillText("2H₂ + O₂ → 2H₂O",300,330);});
  const bd=new THREE.Mesh(new THREE.PlaneGeometry(5.6,2.2),new THREE.MeshBasicMaterial({map:bt}));bd.position.set(0,2.2,-5.86);sc.add(bd);
  // portretlar (chap devor)
  for(let i=0;i<6;i++){const f=box(.05,.7,.55,0xb08a4a,-7.86,2.6,-4.2+i*1.6);const p=new THREE.Mesh(new THREE.PlaneGeometry(.45,.6),new THREE.MeshBasicMaterial({color:0xe9e6dc}));p.position.set(-7.82,2.6,-4.2+i*1.6);p.rotation.y=Math.PI/2;sc.add(p);}
  // chiroqlar
  [-4,0,4].forEach(x=>[-3,1.5].forEach(z=>box(1.4,.06,.35,0xffffff,x,3.98,z)));
  // markaziy tajriba stoli
  const bench=box(4.6,.95,1.3,0xf4f4f1,0,.475,-2.4);box(4.8,.06,1.5,0x2c3a46,0,.97,-2.4);
  const glass=new THREE.MeshPhongMaterial({color:0x9fd4ff,transparent:true,opacity:.45,shininess:90});
  [[-1.6,0x4fa3ff],[-.6,0xff7a7a],[.5,0x8affb0],[1.5,0xffe27a]].forEach(([x,c],i)=>{
    const g=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.34,20),glass);g.position.set(x,1.17,-2.4);sc.add(g);
    const l=new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,.16,20),M(c));l.position.set(x,1.08,-2.4);sc.add(l);});
  const st=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.9,8),M(0x666666));st.position.set(1.9,1.4,-2.7);sc.add(st);
  // o'quvchi partalari
  const desks=[];[-4.5,-1.5,1.5,4.5].forEach(x=>[1.2,3.2].forEach(z=>{box(2,.08,.8,0xd9b98a,x,.78,z);[[-.9,-.3],[.9,-.3],[-.9,.3],[.9,.3]].forEach(([dx,dz])=>box(.06,.78,.06,0x9aa3ab,x+dx,.39,z+dz));desks.push([x-1,x+1,z-.5,z+.5]);}));
  // o'qituvchi
  const T0=new THREE.Group();const body=new THREE.Mesh(new THREE.CylinderGeometry(.22,.28,1,16),M(0xffffff));body.position.y=.9;T0.add(body);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.17,20,16),M(0xe8bf9d));head.position.y=1.55;T0.add(head);const hair=new THREE.Mesh(new THREE.SphereGeometry(.18,20,10,0,7,0,1.2),M(0x3a2a20));hair.position.y=1.58;T0.add(hair);
  T0.position.set(3.3,0,-5);sc.add(T0);
  // reaktivlar javoni (o'ng devor)
  box(.6,3,5.6,0xb8895a,7.55,1.5,0);box(.1,3,5.4,0xdfeaf2,7.2,1.5,0).material.transparent=true;sc.children[sc.children.length-1].material.opacity=.15;
  [.55,1.35,2.15,2.95].forEach(y=>box(.5,.05,5.4,0x8a6238,7.3,y,0));
  const bottles=[];const keys=Object.keys(REAGENTS);
  keys.forEach((k,i)=>{const row=Math.floor(i/7),col=i%7,y=.58+row*.8,z=-2.4+col*.8,rg=REAGENTS[k];
    const g=new THREE.Group();const solid=rg.s==="s",gas=rg.s==="g";
    const body=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.34,20),new THREE.MeshPhongMaterial({color:solid?0x8a5a30:new THREE.Color(rg.c),transparent:!solid,opacity:solid?1:.85,shininess:80}));body.position.y=.17;g.add(body);
    const neck=new THREE.Mesh(new THREE.CylinderGeometry(.05,.07,.1,12),M(0x333333));neck.position.y=.39;g.add(neck);
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,.05,12),M(solid?0xe0d7c4:0x222222));cap.position.y=.46;g.add(cap);
    const lab=K().fmt?REAGENTS[k].n.split(" ")[0].replace(/[₀-₉]/g,d=>String(d.charCodeAt(0)-8320)):k;
    const tex=canvasTex(128,64,(c,w,h)=>{c.fillStyle="#fffdf3";c.fillRect(0,0,w,h);c.fillStyle="#222";c.font="bold 30px sans-serif";c.textAlign="center";c.fillText(lab.length>7?lab.slice(0,7):lab,w/2,40);});
    const pl=new THREE.Mesh(new THREE.PlaneGeometry(.2,.1),new THREE.MeshBasicMaterial({map:tex}));pl.position.set(-.135,.17,0);pl.rotation.y=-Math.PI/2;g.add(pl);
    g.position.set(7.3,y,z);g.userData.key=k;g.traverse(o=>o.userData.key=k);sc.add(g);bottles.push(g);});
  // kiyim ilgichi (eshik yonida)
  const hang=new THREE.Group();const rod=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,1,8),M(0x777777));rod.rotation.z=Math.PI/2;rod.position.y=1.9;hang.add(rod);
  const coat=new THREE.Mesh(new THREE.BoxGeometry(.5,.9,.1),M(0xffffff));coat.position.y=1.4;hang.add(coat);hang.position.set(-7.7,0,4.2);hang.rotation.y=Math.PI/2;hang.traverse(o=>o.userData.hanger=1);sc.add(hang);
  // kolliziya (AABB)
  const walls=[[-1.6,1.6-.001,-3.2,-1.6],...desks];walls[0]=[-2.5,2.5,-3.2,-1.6];
  // kamera holati
  const st0={x:0,z:.1,yaw:0,pitch:-.25},P={x:0,z:3,yaw:0,pitch:-.05};
  const goBench=()=>Object.assign(P,st0);
  $("#goBench").onclick=goBench;goBench();
  const ok=(x,z)=>x>-7.4&&x<6.8&&z>-5.4&&z<5.4&&!walls.some(w=>x>w[0]-.25&&x<w[1]+.25&&z>w[2]-.25&&z<w[3]+.25);
  // boshqaruv
  const keysDown={};addEventListener("keydown",e=>{if(!K().isLab()||/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;keysDown[e.key.toLowerCase()]=1;});addEventListener("keyup",e=>delete keysDown[e.key.toLowerCase()]);
  const joy=$("#joy"),knob=joy.firstElementChild;let jv={x:0,y:0},jid=null;
  const jset=e=>{const b=joy.getBoundingClientRect(),dx=e.clientX-b.left-52,dy=e.clientY-b.top-52,m=Math.min(1,Math.hypot(dx,dy)/40),a=Math.atan2(dy,dx);jv={x:Math.cos(a)*m,y:Math.sin(a)*m};knob.style.transform=`translate(${jv.x*36}px,${jv.y*36}px)`;};
  joy.addEventListener("pointerdown",e=>{jid=e.pointerId;joy.setPointerCapture(jid);jset(e);});
  joy.addEventListener("pointermove",e=>{if(e.pointerId===jid)jset(e);});
  const jend=e=>{if(e.pointerId!==jid)return;jid=null;jv={x:0,y:0};knob.style.transform="";};joy.addEventListener("pointerup",jend);joy.addEventListener("pointercancel",jend);
  let down=null;
  cv.addEventListener("pointerdown",e=>{down={x:e.clientX,y:e.clientY,t:performance.now(),lx:e.clientX,ly:e.clientY,moved:0};cv.setPointerCapture(e.pointerId);});
  cv.addEventListener("pointermove",e=>{if(!down)return;P.yaw-=(e.clientX-down.lx)*.005;P.pitch=Math.max(-1.2,Math.min(1.0,P.pitch-(e.clientY-down.ly)*.004));down.moved+=Math.abs(e.clientX-down.lx)+Math.abs(e.clientY-down.ly);down.lx=e.clientX;down.ly=e.clientY;});
  const rc=new THREE.Raycaster();
  cv.addEventListener("pointerup",e=>{const d=down;down=null;if(!d||d.moved>8||performance.now()-d.t>500)return;
    const b=cv.getBoundingClientRect();rc.setFromCamera(new THREE.Vector2((e.clientX-b.left)/b.width*2-1,-((e.clientY-b.top)/b.height*2-1)),cam);
    const hit=rc.intersectObjects(sc.children,true).find(h=>h.object.userData.key||h.object.userData.hanger);
    if(!hit)return;if(hit.object.userData.hanger){openPanel("gear");return;}
    const g=bottles.find(x=>x.userData.key===hit.object.userData.key);addReagent(hit.object.userData.key);g.position.y+=.1;setTimeout(()=>g.position.y-=.1,250);});
  function size(){const w=sceneEl.clientWidth,h=sceneEl.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}
  addEventListener("resize",size);size();
  new ResizeObserver(size).observe(sceneEl);
  let last=performance.now();
  (function loop(now){requestAnimationFrame(loop);if(!K().isLab())return;const dt=Math.min(.05,(now-last)/1000);last=now;
    let fx=-jv.y,sx=jv.x;if(keysDown.w||keysDown.arrowup)fx+=1;if(keysDown.s||keysDown.arrowdown)fx-=1;if(keysDown.d)sx+=1;if(keysDown.a)sx-=1;
    if(keysDown.arrowleft)P.yaw+=dt*1.6;if(keysDown.arrowright)P.yaw-=dt*1.6;
    const sp=2.4*dt,dx=(-Math.sin(P.yaw)*fx+Math.cos(P.yaw)*sx)*sp,dz=(-Math.cos(P.yaw)*fx-Math.sin(P.yaw)*sx)*sp;
    if(ok(P.x+dx,P.z))P.x+=dx;if(ok(P.x,P.z+dz))P.z+=dz;
    cam.position.set(P.x,1.6,P.z);cam.rotation.set(P.pitch,P.yaw,0,"YXZ");T0.rotation.y=Math.sin(now/2000)*.4+Math.PI*.1;
    r.render(sc,cam);})(last);
  window.__lab={P,r};
}
})();
