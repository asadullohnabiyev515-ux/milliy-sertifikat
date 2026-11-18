// KimyoLab — 3D molekulalar: z-matritsa asosida haqiqiy geometriya, shar-tayoqcha va fazoviy model
(function(KL){
"use strict";
const $=KL.$,$$=KL.$$,DEG=Math.PI/180;
/* ---------- vektorlar ---------- */
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],mul=(a,k)=>[a[0]*k,a[1]*k,a[2]*k];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],len=a=>Math.sqrt(dot(a,a)),nrm=a=>mul(a,1/(len(a)||1));
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
// z-matritsa: [element, bog'langan atom, uzunlik, burchak atomi, burchak, ikki yoqli atom, ikki yoqli burchak, bog' karraligi]
function zmat(rows){
  const P=[],B=[];
  rows.forEach((r,i)=>{
    const[el,b,rl,a,th,d,ph,o]=r;
    if(i===0)P.push([0,0,0]);
    else if(i===1)P.push(add(P[b],[rl,0,0]));
    else if(d===undefined){const u=nrm(sub(P[a],P[b]));let pr=[-u[1],u[0],0];if(len(pr)<1e-6)pr=[0,1,0];pr=nrm(pr);
      P.push(add(P[b],mul(add(mul(u,Math.cos(th*DEG)),mul(pr,Math.sin(th*DEG))),rl)));}
    else{const bc=nrm(sub(P[b],P[a])),n=nrm(cross(sub(P[a],P[d]),bc)),m=cross(n,bc),t=th*DEG,p=ph*DEG;
      P.push(add(P[b],add(add(mul(bc,-rl*Math.cos(t)),mul(m,rl*Math.sin(t)*Math.cos(p))),mul(n,rl*Math.sin(t)*Math.sin(p)))));}
    if(i>0)B.push([b,i,o||1]);
  });
  return{a:rows.map((r,i)=>[r[0],...P[i]]),b:B};
}
// markaziy atom atrofidagi simmetrik shakllar
function star(c,lig,geo,ang){
  let D;
  if(geo==="lin")D=[[1,0,0],[-1,0,0]];
  else if(geo==="bent"){const h=ang*DEG/2;D=[[Math.sin(h),-Math.cos(h),0],[-Math.sin(h),-Math.cos(h),0]];}
  else if(geo==="tri")D=[0,120,240].map(t=>[Math.cos(t*DEG),Math.sin(t*DEG),0]);
  else if(geo==="pyr"){const ca=Math.sqrt((2*Math.cos(ang*DEG)+1)/3),sa=Math.sqrt(1-ca*ca);D=[0,120,240].map(t=>[sa*Math.cos(t*DEG),-ca,sa*Math.sin(t*DEG)]);}
  else D=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(nrm);
  return{a:[[c,0,0,0],...lig.map(([el,l],i)=>[el,...mul(D[i],l)])],b:lig.map((x,i)=>[0,i+1,x[2]||1])};
}
function ring(n,r,extra){const a=[],b=[];for(let i=0;i<n;i++){const t=i*2*Math.PI/n;a.push(["C",r*Math.cos(t),r*Math.sin(t),0]);}
  for(let i=0;i<n;i++)b.push([i,(i+1)%n,i%2?1:2]);
  for(let i=0;i<n;i++){const t=i*2*Math.PI/n,u=[Math.cos(t),Math.sin(t),0];const ex=extra&&extra[i];
    if(ex){const O=add(a[i].slice(1),mul(u,1.36));a.push(["O",...O]);b.push([i,a.length-1,1]);const hd=[Math.cos(t+70*DEG),Math.sin(t+70*DEG),0];a.push(["H",...add(O,mul(hd,.96))]);b.push([a.length-2,a.length-1,1]);}
    else{a.push(["H",...add(a[i].slice(1),mul(u,1.08))]);b.push([i,a.length-1,1]);}}
  return{a,b};}
function lattice(pts,maxD,el){const a=pts.map((p,i)=>[typeof el==="function"?el(p,i):el,...p]),b=[];
  for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)if(len(sub(a[i].slice(1),a[j].slice(1)))<maxD)b.push([i,j,1]);return{a,b};}
function h2so4(){const m=star("S",[["O",1.42,2],["O",1.42,2],["O",1.57],["O",1.57]],"tet");
  [3,4].forEach(i=>{const O=m.a[i].slice(1),u=nrm(O),pr=nrm(cross(u,i===3?[0,0,1]:[0,1,0]));m.a.push(["H",...add(O,mul(add(mul(u,Math.cos(70*DEG)),mul(pr,Math.sin(70*DEG))),.97))]);m.b.push([i,m.a.length-1,1]);});return m;}
function hno3(){const p=(t,l)=>[Math.cos(t*DEG)*l,Math.sin(t*DEG)*l,0];const O3=p(245,1.4);
  return{a:[["N",0,0,0],["O",...p(0,1.21)],["O",...p(127,1.21)],["O",...O3],["H",...add(O3,p(167,.96))]],b:[[0,1,2],[0,2,1],[0,3,1],[3,4,1]]};}
function diamond(){const A=3.567,F=[[0,0,0],[0,.5,.5],[.5,0,.5],[.5,.5,0]],pts=[];
  for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)for(let k=-1;k<=1;k++)F.forEach(f=>[[0,0,0],[.25,.25,.25]].forEach(o=>{const p=[(i+f[0]+o[0])*A,(j+f[1]+o[1])*A,(k+f[2]+o[2])*A];if(len(sub(p,[A*.125,A*.125,A*.125]))<3.4)pts.push(p);}));
  return lattice(pts,1.6,"C");}
function graphite(){const pts=[];for(let L=0;L<2;L++)for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++)[[0,0],[1.23,.71]].forEach(o=>{const x=i*2.46+j*1.23+o[0]+L*1.23,y=j*2.13+o[1]+L*.71;if(Math.hypot(x,y)<3.4)pts.push([x,y,L*3.35-1.675]);});
  return lattice(pts,1.5,"C");}
const tet=s=>s,MD=[
 ["h2o","Suv","H2O","noorg","Burchakli","104,5°","sp³ (O)","qutbli","Kislorod atomida 2 ta erkin elektron jufti bor — shuning uchun molekula chiziqli emas, burchakli. Molekulalar orasida vodorod bog'lar hosil bo'ladi.",()=>star("O",[["H",.96],["H",.96]],"bent",104.5)],
 ["co2","Karbonat angidrid","CO2","noorg","Chiziqli","180°","sp (C)","qutbsiz","Ikkita qo'sh bog'. Bog'lar qutbli, lekin simmetriya tufayli molekula umuman qutbsiz.",()=>star("C",[["O",1.16,2],["O",1.16,2]],"lin")],
 ["nh3","Ammiak","NH3","noorg","Uchburchakli piramida","107°","sp³ (N)","qutbli","Azot atomida bitta erkin elektron jufti bor — u H⁺ ni biriktirib NH₄⁺ hosil qiladi.",()=>star("N",[["H",1.01],["H",1.01],["H",1.01]],"pyr",107)],
 ["ch4","Metan","CH4","org","Tetraedr","109,5°","sp³","qutbsiz","Tabiiy gazning asosiy qismi. Uglerod to'rtta σ-bog' hosil qiladi.",()=>star("C",[["H",1.09],["H",1.09],["H",1.09],["H",1.09]],"tet")],
 ["hcl","Vodorod xlorid","HCl","noorg","Chiziqli","—","—","qutbli","Qutbli kovalent bog'. Suvdagi eritmasi — xlorid kislota.",()=>({a:[["H",-.64,0,0],["Cl",.64,0,0]],b:[[0,1,1]]})],
 ["o2","Kislorod","O2","oddiy","Chiziqli","—","—","qutbsiz","Qo'sh bog'li ikki atomli molekula.",()=>({a:[["O",-.6,0,0],["O",.6,0,0]],b:[[0,1,2]]})],
 ["n2","Azot","N2","oddiy","Chiziqli","—","—","qutbsiz","Uch karrali bog' juda mustahkam — shuning uchun azot kimyoviy jihatdan passiv.",()=>({a:[["N",-.55,0,0],["N",.55,0,0]],b:[[0,1,3]]})],
 ["cl2","Xlor","Cl2","oddiy","Chiziqli","—","—","qutbsiz","Sarg'ish-yashil zaharli gaz, kuchli oksidlovchi.",()=>({a:[["Cl",-1,0,0],["Cl",1,0,0]],b:[[0,1,1]]})],
 ["o3","Ozon","O3","oddiy","Burchakli","116,8°","sp²","qutbli","Kislorodning allotropik shakli. Bog'lar bir yarim karrali (rezonans).",()=>star("O",[["O",1.28,2],["O",1.28]],"bent",116.8)],
 ["co","Uglerod(II) oksid","CO","noorg","Chiziqli","—","sp","kuchsiz qutbli","Uch karrali bog' (biri donor-akseptor). Is gazi — juda zaharli!",()=>({a:[["C",-.565,0,0],["O",.565,0,0]],b:[[0,1,3]]})],
 ["so2","Oltingugurt(IV) oksid","SO2","noorg","Burchakli","119°","sp² (S)","qutbli","Oltingugurt atomida bitta erkin elektron jufti bor.",()=>star("S",[["O",1.43,2],["O",1.43,2]],"bent",119)],
 ["so3","Oltingugurt(VI) oksid","SO3","noorg","Yassi uchburchak","120°","sp² (S)","qutbsiz","Kislotali oksid: SO₃ + H₂O → H₂SO₄.",()=>star("S",[["O",1.42,2],["O",1.42,2],["O",1.42,2]],"tri")],
 ["h2so4","Sulfat kislota","H2SO4","noorg","Tetraedr (S atrofida)","≈109°","sp³ (S)","qutbli","Kuchli ikki negizli kislota; konsentrlangani suvni tortib oladi.",h2so4],
 ["hno3","Nitrat kislota","HNO3","noorg","Yassi (N atrofida)","≈120°","sp² (N)","qutbli","Kuchli oksidlovchi kislota — metallar bilan vodorod ajratmaydi.",hno3],
 ["h2o2","Vodorod peroksid","H2O2","noorg","«Ochiq kitob»","O–O–H 94,8°","sp³","qutbli","Kislorod −1 oksidlanish darajasida; oson parchalanib kislorod beradi.",()=>zmat([["O"],["O",0,1.47],["H",0,.97,1,94.8],["H",1,.97,0,94.8,2,111.5]])],
 ["nh4","Ammoniy ioni","NH4+","ion","Tetraedr","109,5°","sp³","—","To'rtinchi N–H bog' donor-akseptor mexanizmida hosil bo'ladi, lekin qolganlaridan farq qilmaydi.",()=>star("N",[["H",1.03],["H",1.03],["H",1.03],["H",1.03]],"tet")],
 ["h3o","Gidroksoniy ioni","H3O+","ion","Uchburchakli piramida","≈113°","sp³","—","Kislotalar eritmasidagi H⁺ aslida H₃O⁺ holida bo'ladi.",()=>star("O",[["H",.98],["H",.98],["H",.98]],"pyr",113)],
 ["oh","Gidroksid ioni","OH-","ion","Chiziqli","—","—","—","Ishqorlar eritmasi xossalarini belgilaydi.",()=>({a:[["O",-.48,0,0],["H",.49,0,0]],b:[[0,1,1]]})],
 ["so4","Sulfat ioni","SO4 2-","ion","Tetraedr","109,5°","sp³","—","Barcha S–O bog'lar teng (rezonans); Ba²⁺ bilan oq cho'kma beradi.",()=>star("S",[["O",1.49,2],["O",1.49,2],["O",1.49],["O",1.49]],"tet")],
 ["co3","Karbonat ioni","CO3 2-","ion","Yassi uchburchak","120°","sp²","—","Barcha C–O bog'lar teng (rezonans).",()=>star("C",[["O",1.28,2],["O",1.28],["O",1.28]],"tri")],
 ["no3","Nitrat ioni","NO3-","ion","Yassi uchburchak","120°","sp²","—","Yassi simmetrik ion, barcha N–O bog'lar teng.",()=>star("N",[["O",1.25,2],["O",1.25],["O",1.25]],"tri")],
 ["c2h6","Etan","C2H6","org","Tetraedrik (C atrofida)","109,5°","sp³","qutbsiz","Alkanlar gomologik qatorining ikkinchi vakili (tormozlangan konformatsiya).",()=>zmat([["C"],["C",0,1.54],["H",0,1.09,1,111],["H",0,1.09,1,111,2,120],["H",0,1.09,1,111,2,-120],["H",1,1.09,0,111,2,180],["H",1,1.09,0,111,5,120],["H",1,1.09,0,111,5,-120]])],
 ["c3h8","Propan","C3H8","org","Zigzag zanjir","≈112°","sp³","qutbsiz","Suyultirilgan gaz ballonlaridagi yoqilg'i.",()=>zmat([["C"],["C",0,1.53],["C",1,1.53,0,112],["H",0,1.09,1,111,2,180],["H",0,1.09,1,111,2,60],["H",0,1.09,1,111,2,-60],["H",1,1.09,0,109.5,2,121],["H",1,1.09,0,109.5,2,-121],["H",2,1.09,1,111,0,180],["H",2,1.09,1,111,0,60],["H",2,1.09,1,111,0,-60]])],
 ["c2h4","Etilen","C2H4","org","Yassi","≈120°","sp²","qutbsiz","C=C qo'sh bog' (σ + π). Alkenlar birikish reaksiyalariga kirishadi.",()=>({a:[["C",.67,0,0],["C",-.67,0,0],["H",1.24,.93,0],["H",1.24,-.93,0],["H",-1.24,.93,0],["H",-1.24,-.93,0]],b:[[0,1,2],[0,2,1],[0,3,1],[1,4,1],[1,5,1]]})],
 ["c2h2","Atsetilen","C2H2","org","Chiziqli","180°","sp","qutbsiz","C≡C uch karrali bog' (σ + 2π).",()=>({a:[["C",.6,0,0],["C",-.6,0,0],["H",1.66,0,0],["H",-1.66,0,0]],b:[[0,1,3],[0,2,1],[1,3,1]]})],
 ["c6h6","Benzol","C6H6","org","Yassi olti burchak","120°","sp²","qutbsiz","6 ta π-elektron butun halqa bo'ylab delokallangan (aromatik tizim).",()=>ring(6,1.39)],
 ["ch3oh","Metanol","CH3OH","org","Tetraedrik (C atrofida)","≈109°","sp³","qutbli","Eng oddiy spirt. Juda zaharli!",()=>zmat([["C"],["O",0,1.43],["H",1,.96,0,108.5],["H",0,1.09,1,109.5,2,180],["H",0,1.09,1,109.5,2,60],["H",0,1.09,1,109.5,2,-60]])],
 ["etoh","Etanol","C2H5OH","org","Tetraedrik (C atrofida)","≈109°","sp³","qutbli","Bir atomli to'yingan spirt; –OH guruh vodorod bog'lar hosil qiladi.",()=>zmat([["C"],["C",0,1.52],["O",1,1.43,0,109.5],["H",2,.96,1,108.5,0,180],["H",0,1.09,1,110,2,180],["H",0,1.09,1,110,2,60],["H",0,1.09,1,110,2,-60],["H",1,1.09,0,109.5,2,120],["H",1,1.09,0,109.5,2,-120]])],
 ["hcho","Formaldegid","HCHO","org","Yassi uchburchak","≈120°","sp²","qutbli","Eng oddiy aldegid; suvli eritmasi — formalin.",()=>zmat([["C"],["O",0,1.21,,,,,2],["H",0,1.1,1,121.8],["H",0,1.1,1,121.8,2,180]])],
 ["ch3cho","Sirka aldegidi","CH3CHO","org","Yassi (C=O atrofida)","≈120°","sp², sp³","qutbli","Aldegid guruh –CHO «kumush ko'zgu» reaksiyasini beradi.",()=>zmat([["C"],["C",0,1.5],["O",1,1.21,0,124,,,2],["H",1,1.11,0,115,2,180],["H",0,1.09,1,110,2,0],["H",0,1.09,1,110,2,120],["H",0,1.09,1,110,2,-120]])],
 ["hcooh","Chumoli kislota","HCOOH","org","Yassi","≈125°","sp²","qutbli","Eng oddiy karbon kislota; molekulasida aldegid guruhi ham bor.",()=>zmat([["C"],["O",0,1.2,,,,,2],["O",0,1.34,1,125],["H",2,.97,0,107,1,0],["H",0,1.1,1,124,2,180]])],
 ["ch3cooh","Sirka kislota","CH3COOH","org","Yassi (–COOH)","≈120°","sp², sp³","qutbli","Karboksil guruh –COOH kislotali xossani beradi.",()=>zmat([["C"],["C",0,1.5],["O",1,1.21,0,126,,,2],["O",1,1.36,0,111,2,180],["H",3,.97,1,106,0,180],["H",0,1.09,1,110,2,0],["H",0,1.09,1,110,2,120],["H",0,1.09,1,110,2,-120]])],
 ["c6h5oh","Fenol","C6H5OH","org","Yassi halqa","120°","sp²","qutbli","–OH guruh benzol halqasi bilan bog'langan; bromli suvni rangsizlantiradi.",()=>ring(6,1.39,{0:1})],
 ["urea","Mochevina","CO(NH2)2","org","Yassi","≈120°","sp²","qutbli","Vyoler (1828) noorganik moddadan sintez qilgan birinchi organik modda; o'g'it.",()=>zmat([["C"],["O",0,1.25,,,,,2],["N",0,1.37,1,121],["N",0,1.37,1,121,2,180],["H",2,1.01,0,120,1,0],["H",2,1.01,0,120,1,180],["H",3,1.01,0,120,1,0],["H",3,1.01,0,120,1,180]])],
 ["p4","Oq fosfor","P4","oddiy","Tetraedr","60°","—","qutbsiz","P–P–P burchagi atigi 60° — bog'lar zo'riqqan, shuning uchun oq fosfor juda faol.",()=>{const k=.7813;return lattice([[k,k,k],[k,-k,-k],[-k,k,-k],[-k,-k,k]],2.5,"P");}],
 ["s8","Rombik oltingugurt","S8","oddiy","Toj shaklidagi halqa","≈108°","sp³","qutbsiz","Sakkiz atomli halqa — oltingugurtning eng barqaror shakli.",()=>({a:[...Array(8)].map((_,i)=>["S",2.345*Math.cos(i*45*DEG),i%2?.495:-.495,2.345*Math.sin(i*45*DEG)]),b:[...Array(8)].map((_,i)=>[i,(i+1)%8,1])})],
 ["nacl","Osh tuzi kristalli","NaCl","kristall","Kubik ion panjara","90°","—","ion birikma","Har bir Na⁺ ioni 6 ta Cl⁻ bilan o'ralgan (koordinatsion son 6).",()=>{const p=[];for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)for(let k=-1;k<=1;k++)p.push([i*2.82,j*2.82,k*2.82]);return lattice(p,2.9,q=>(Math.round((q[0]+q[1]+q[2])/2.82)%2+2)%2?"Cl":"Na");}],
 ["diamond","Olmos","C","kristall","Tetraedrik atom panjara","109,5°","sp³","—","Eng qattiq tabiiy modda: har bir C atomi 4 ta qo'shni bilan kovalent bog'langan.",diamond],
 ["graphite","Grafit","C","kristall","Qatlamli (olti burchaklar)","120°","sp²","—","Qatlamlar orasida kuchsiz bog'lanish bor — grafit yumshoq va elektr tokini o'tkazadi.",graphite]
];
const GROUPS=[["oddiy","Oddiy moddalar"],["noorg","Noorganik moddalar"],["ion","Ionlar"],["org","Organik moddalar"],["kristall","Kristall panjaralar"]];
const chg=f=>{const m=f.match(/(?:\s(\d))?([+-])$/);return m?(m[1]||"")+(m[2]==="-"?"−":"+"):"";};
KL.MOLECULES=MD.map(([id,name,f,g,shape,ang,hyb,pol,info,build])=>({id,name,f:f.replace(/(\s\d)?[+-]$/,""),z:chg(f),g,shape,ang,hyb,pol,info,build}));
KL._zmat=zmat;KL._molBuild=id=>KL.MOLECULES.find(m=>m.id===id).build();
const COL={H:0xffffff,C:0x707a85,N:0x3a6df0,O:0xff4d4d,S:0xf2d01b,Cl:0x3ddc84,Na:0xab5cf2,P:0xff8c1a};
const RB={H:.26,C:.36,N:.35,O:.34,S:.46,Cl:.46,Na:.5,P:.44},RV={H:1.1,C:1.6,N:1.5,O:1.45,S:1.75,Cl:1.7,Na:1.9,P:1.75};
let V3=null,cur=null,model="ball",labels=false,spin=true;
KL.tabs.molecules={
  init(el){
    el.innerHTML=`<div class="head"><h2>⚛️ Molekulalar</h2><p class="sub">Haqiqiy bog' uzunliklari va burchaklari bilan qurilgan fazoviy modellar. Sichqoncha yoki barmoq bilan aylantiring.</p></div>
    <div class="molwrap"><aside class="mollist" id="ml">${GROUPS.map(([g,n])=>`<h4>${n}</h4><div class="chips">${KL.MOLECULES.filter(m=>m.g===g).map(m=>`<button class="chip" data-id="${m.id}"><b>${KL.fmt(m.f)}${m.z?`<sup>${m.z}</sup>`:""}</b><small>${m.name}</small></button>`).join("")}</div>`).join("")}</aside>
    <div class="molview"><div id="mv" class="mv"><div class="mvtools"><div class="seg" id="mm"><button data-m="ball" class="on">Shar-tayoqcha</button><button data-m="fill">Fazoviy</button></div><button class="hbtn glass" id="mlab" title="Atom belgilari">Aa</button><button class="hbtn glass" id="mspin" title="Aylanish">⏸</button><button class="hbtn glass" id="mreset" title="Qayta">⟲</button></div></div>
    <div class="card" id="minfo"></div></div></div>`;
    $("#ml").onclick=e=>{const b=e.target.closest("[data-id]");if(b)show(b.dataset.id);};
    $("#mm").onclick=e=>{const b=e.target.closest("[data-m]");if(!b)return;model=b.dataset.m;$$("#mm button").forEach(x=>x.classList.toggle("on",x===b));show(cur.id,true);};
    $("#mlab").onclick=()=>{labels=!labels;$("#mlab").classList.toggle("on",labels);show(cur.id,true);};
    $("#mspin").onclick=()=>{spin=!spin;$("#mspin").textContent=spin?"⏸":"▶";};
    $("#mreset").onclick=()=>{if(V3){V3.g.rotation.set(.35,.5,0);V3.dist=V3.base;}};
    try{init3D();}catch(err){$("#mv").insertAdjacentHTML("afterbegin",`<p class="mut" style="padding:20px">3D ko'rinish ishlamadi (WebGL kerak).</p>`);}
    show("h2o");
  },
  show(id){if(V3)V3.resize();if(typeof id==="string")show(id);}
};
function init3D(){
  if(!window.THREE)throw Error("no three");
  const host=$("#mv"),r=new THREE.WebGLRenderer({antialias:true,alpha:true});r.setPixelRatio(Math.min(devicePixelRatio,2));r.outputEncoding=THREE.sRGBEncoding;host.prepend(r.domElement);
  const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,1,.1,200);
  sc.add(new THREE.HemisphereLight(0xffffff,0x334455,.85));const dl=new THREE.DirectionalLight(0xffffff,.9);dl.position.set(5,8,10);sc.add(dl);
  const g=new THREE.Group();sc.add(g);V3={r,sc,cam,g,dist:9,base:9,host};
  const pts=new Map();let last=null,pinch=null;
  host.addEventListener("pointerdown",e=>{if(e.target!==r.domElement)return;r.domElement.setPointerCapture(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);last=[e.clientX,e.clientY,performance.now(),0];
    if(pts.size===2){const[a,b]=[...pts.values()];pinch=[Math.hypot(a[0]-b[0],a[1]-b[1]),V3.dist];}});
  host.addEventListener("pointermove",e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);
    if(pinch&&pts.size===2){const[a,b]=[...pts.values()];V3.dist=Math.max(2,Math.min(60,pinch[1]*pinch[0]/Math.hypot(a[0]-b[0],a[1]-b[1])));return;}
    if(last){g.rotation.y+=(e.clientX-last[0])*.01;g.rotation.x+=(e.clientY-last[1])*.01;last[3]+=Math.abs(e.clientX-last[0])+Math.abs(e.clientY-last[1]);last[0]=e.clientX;last[1]=e.clientY;}});
  const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch=null;if(last&&last[3]<6&&performance.now()-last[2]<400)pickAtom(e);last=null;};
  host.addEventListener("pointerup",up);host.addEventListener("pointercancel",up);
  host.addEventListener("wheel",e=>{e.preventDefault();V3.dist=Math.max(2,Math.min(60,V3.dist*(1+e.deltaY*.001)));},{passive:false});
  V3.resize=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w)return;r.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix();};
  addEventListener("resize",V3.resize);V3.ray=new THREE.Raycaster();
  (function loop(){requestAnimationFrame(loop);if(KL.current()!=="molecules")return;if(spin&&!last)g.rotation.y+=.005;cam.position.set(0,0,V3.dist);cam.lookAt(0,0,0);r.render(sc,cam);})();
  V3.resize();
}
function pickAtom(e){
  const b=V3.r.domElement.getBoundingClientRect();V3.ray.setFromCamera(new THREE.Vector2((e.clientX-b.left)/b.width*2-1,-((e.clientY-b.top)/b.height*2-1)),V3.cam);
  const h=V3.ray.intersectObjects(V3.g.children,false).find(x=>x.object.userData.el);
  if(h){const el=KL.EL[h.object.userData.el];KL.toast(`<b>${el.sym}</b> — ${el.name} (Z = ${el.z}, Ar = ${KL.nice(el.mass,3)})`);}
}
function label(t){const c=document.createElement("canvas");c.width=c.height=64;const x=c.getContext("2d");x.fillStyle="rgba(15,23,34,.75)";x.beginPath();x.arc(32,32,22,0,7);x.fill();x.fillStyle="#fff";x.font="bold 26px sans-serif";x.textAlign="center";x.textBaseline="middle";x.fillText(t,32,33);
  const tx=new THREE.CanvasTexture(c);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,depthTest:false,transparent:true}));s.renderOrder=9;return s;}
function show(id,keep){
  const m=KL.MOLECULES.find(x=>x.id===id)||KL.MOLECULES[0];cur=m;
  $$("#ml [data-id]").forEach(b=>b.classList.toggle("on",b.dataset.id===m.id));
  const S=KL.S;S.mols[m.id]=1;KL.save();KL.checkAch();
  const geo=m.build(),cryst=m.g==="kristall";
  const cnt={};geo.a.forEach(a=>cnt[a[0]]=(cnt[a[0]]||0)+1);
  let M="—";try{if(!cryst&&m.g!=="ion")M=KL.nice(KL.molarMass(m.f),3)+" g/mol";}catch(e){}
  $("#minfo").innerHTML=`<h3>${m.name}</h3><div class="eq big">${KL.fmt(m.f)}${m.z?`<sup>${m.z}</sup>`:""}</div><p>${m.info}</p>
   <div class="kv"><span>Shakli</span><b>${m.shape}</b><span>Bog' burchagi</span><b>${m.ang}</b><span>Gibridlanish</span><b>${m.hyb}</b><span>Qutbliligi</span><b>${m.pol}</b><span>Molyar massa</span><b>${M}</b>
   <span>Atomlar</span><b>${Object.entries(cnt).map(([k,v])=>`${k}×${v}`).join(", ")}</b><span>Bog'lar</span><b>${geo.b.length}</b></div>
   <p class="mut">Ranglar: ${Object.keys(cnt).map(k=>`<i class="dot" style="background:#${(COL[k]||0xff70c0).toString(16).padStart(6,"0")}"></i>${k}`).join(" ")} · atomni bosing — nomi chiqadi</p>`;
  if(!V3)return;
  const g=V3.g;g.children.forEach(o=>{o.geometry&&o.geometry.dispose();});g.clear();
  const P=geo.a.map(a=>new THREE.Vector3(a[1],a[2],a[3])),c=P.reduce((s,p)=>s.add(p),new THREE.Vector3()).multiplyScalar(1/P.length);P.forEach(p=>p.sub(c));
  const fill=model==="fill",ks=cryst?.65:1;
  geo.a.forEach((a,i)=>{const el=a[0],rad=(fill?RV[el]*.62:RB[el])*ks||.4;
    const s=new THREE.Mesh(new THREE.SphereGeometry(rad,fill?36:26,fill?24:18),new THREE.MeshStandardMaterial({color:COL[el]||0xff70c0,roughness:.35,metalness:.05}));
    s.position.copy(P[i]);s.userData.el=el;g.add(s);
    if(labels){const l=label(el);l.position.copy(P[i]).add(P[i].clone().normalize().multiplyScalar(.01));l.scale.setScalar(.55);g.add(l);}});
  if(!fill){const Y=new THREE.Vector3(0,1,0),bm=new THREE.MeshStandardMaterial({color:0xb8c4d0,roughness:.4});
    geo.b.forEach(([i,j,o])=>{const d=P[j].clone().sub(P[i]),L=d.length(),dir=d.clone().normalize();
      const perp=new THREE.Vector3().crossVectors(dir,Math.abs(dir.z)<.9?new THREE.Vector3(0,0,1):new THREE.Vector3(1,0,0)).normalize().multiplyScalar(.14);
      for(let k=0;k<o;k++){const off=perp.clone().multiplyScalar(k-(o-1)/2);const cy=new THREE.Mesh(new THREE.CylinderGeometry(o>1?.05:.075,o>1?.05:.075,L,12),bm);
        cy.position.copy(P[i]).add(d.clone().multiplyScalar(.5)).add(off);cy.quaternion.setFromUnitVectors(Y,dir);g.add(cy);}});}
  const R=Math.max(...P.map(p=>p.length()))+(fill?1.2:.6);V3.base=Math.max(4.5,R*3.1);if(!keep){V3.dist=V3.base;g.rotation.set(.35,.5,0);}
  V3.resize();
}
})(globalThis.KL=globalThis.KL||{});
