// KimyoLab — kimyo dvigateli: idishdagi ionlar, molekulalar va qattiq moddalar; reaksiyalar, pH, rang, elektroliz
(function(KL){
"use strict";
const EPS=1e-6, CONC=0.1;                       // har bir ulush eritma 0,1 M
const SPEED={mid:.6,slow:.2,vslow:.06};         // ulush/soniya
KL.VESSELS={probirka:{n:"Probirka",cap:6,ml:3},kolba:{n:"Kolba",cap:10,ml:25},stakan:{n:"Stakan",cap:8,ml:50}};
const clamp14=x=>Math.max(0,Math.min(14,x));

function kindOf(id){
  if(id==="H2O")return"w"; if(id==="O2air")return"air";
  if(KL.IONS[id])return"ion"; if(KL.MOLS[id])return"mol"; if(KL.SOLIDS[id])return"s"; if(KL.GASES[id])return"g";
  throw Error("Noma'lum zarracha: "+id);
}
function side(s){return s.split(" + ").map(t=>{const m=t.trim().match(/^(\d+)?([A-Za-z].*)$/);if(!m)throw Error("Qoida xato: "+s);return{id:m[2],c:m[1]?+m[1]:1,k:kindOf(m[2])};});}
function compile(raw){
  const r=Object.assign({},raw,{R:side(raw.l),P:side(raw.r),sp:raw.sp||"fast",need:Object.assign({},raw.need||{})});
  if(r.R.some(t=>t.k==="w"))r.need.water=1;
  return r;
}
const RULES=KL.RULES_RAW.map(compile);
const FAST=RULES.filter(r=>r.sp==="fast"),SLOW=RULES.filter(r=>r.sp!=="fast");
KL.RULES=RULES;KL.RULE_BY_ID=Object.fromEntries(RULES.map(r=>[r.id,r]));
KL.DISCOVERABLE=[...RULES.filter(r=>!r.hidden).map(r=>r.id),...KL.ELEC_KEYS,"evap"];

/* ---------- Tenglama yozuvi ---------- */
function tokHTML(t,prod){
  const P=KL.MOLS[t.id]||KL.SOLIDS[t.id];
  let h=t.k==="ion"?KL.ionHTML(t.id):t.k==="w"?"H<sub>2</sub>O":t.k==="air"?"O<sub>2</sub>":(P&&P.np)?P.n:KL.fmt(KL.formulaOf(t.id));
  if(prod){if(t.k==="g")h+="↑";else if(t.k==="s")h+="↓";}
  return(t.c>1?t.c:"")+h;
}
function arrowHTML(r){
  const l=[];if(r.need&&r.need.heat)l.push("t°");if(r.cat)l.push("kat.");if(r.need&&r.need.uv)l.push("hν");if(r.elec)l.push("elektroliz");
  return l.length?`<span class="arr"><small>${l.join(", ")}</small>→</span>`:"→";
}
const ionicHTML=r=>r.R.map(t=>tokHTML(t,false)).join(" + ")+" "+arrowHTML(r)+" "+r.P.map(t=>tokHTML(t,true)).join(" + ");
KL.ruleHTML=ionicHTML;

// Spektator ionlarni tuzlarga juftlash variantlari (eng kam tuzli variantlar birinchi)
function pairings(newC,newA,specC,specA,usedC=[],usedA=[]){
  const uq=a=>[...new Set(a)],allA=uq([...specA,...newA,...usedA]),allC=uq([...specC,...newC,...usedC]);
  const ok=(c,a)=>!(c==="H"&&a==="OH");
  const res=[];
  const spect=(sc,sa,acc)=>{
    if(res.length>200)return;
    if(!sc.length&&!sa.length){res.push(acc);return;}
    if(sc.length){const c=sc[0];[...sa,...allA.filter(a=>!sa.includes(a))].filter(a=>ok(c,a)).forEach(a=>spect(sc.slice(1),sa.filter(x=>x!==a),[...acc,[c,a]]));return;}
    const a=sa[0];allC.filter(c=>ok(c,a)).forEach(c=>spect(sc,sa.slice(1),[...acc,[c,a]]));
  };
  const rec=(i,j,acc)=>{
    if(i<newC.length){allA.filter(a=>ok(newC[i],a)).forEach(a=>rec(i+1,j,[...acc,[newC[i],a]]));return;}
    if(j<newA.length){allC.filter(c=>ok(c,newA[j])).forEach(c=>rec(i,j+1,[...acc,[c,newA[j]]]));return;}
    const cc=new Set(acc.map(p=>p[0])),ca=new Set(acc.map(p=>p[1]));
    spect(specC.filter(c=>!cc.has(c)),specA.filter(a=>!ca.has(a)),acc);
  };
  rec(0,0,[]);
  const seen=new Set(),out=[];
  res.map(p=>{const s=uq(p.map(([c,a])=>KL.saltFormula(c,a))).sort();return{p,s};})
     .sort((x,y)=>x.s.length-y.s.length)
     .forEach(o=>{const k=o.s.join("|");if(!seen.has(k)){seen.add(k);out.push(o.p);}});
  return out;
}

function elecRule(key,cT,aT,c,a){
  const X=a&&a[1],Xi=a&&a[0],M=c&&c[0],D=c&&c[1],z=c?c[2]:0;
  let l,r;
  if(c&&a){l=z===2?`${M} + 2${Xi}`:`2${M} + 2${Xi}`;r=z===2?`${D} + ${X}`:`2${D} + ${X}`;}
  else if(c&&aT==="OH"){l=z===2?`2${M} + 4OH`:`4${M} + 4OH`;r=z===2?`2${D} + O2 + 2H2O`:`4${D} + O2 + 2H2O`;}
  else if(c){l=z===2?`2${M} + 2H2O`:`4${M} + 2H2O`;r=z===2?`2${D} + O2 + 4H`:`4${D} + O2 + 4H`;}
  else if(cT==="H"&&a){l=`2H + 2${Xi}`;r=`H2 + ${X}`;}
  else if(a){l=`2H2O + 2${Xi}`;r=`H2 + ${X} + 2OH`;}
  else{l="2H2O";r="2H2 + O2";}
  const ct=c?`katodda ${KL.SOLIDS[D].n} ajraladi`:cT==="H"?"katodda vodorod ajraladi":"katodda vodorod ajraladi, eritmada OH⁻ to'planadi (muhit ishqoriylashadi)";
  const at=a?(X==="Cl2"?"anodda sarg'ish-yashil xlor ajraladi":X==="Br2"?"anodda brom ajraladi (sariq-qo'ng'ir rang)":"anodda yod ajraladi (qo'ng'ir rang)")
    :aT==="OH"?"anodda kislorod ajraladi":"anodda kislorod ajraladi, eritmada H⁺ to'planadi (muhit kislotalashadi)";
  let obs=ct[0].toUpperCase()+ct.slice(1)+"; "+at+".";
  if(!c&&!a&&cT!=="H")obs="Aslida suv parchalanadi: katodda H₂ (2 hajm), anodda O₂ (1 hajm) ajraladi.";
  return{id:key,R:side(l),P:side(r),need:{},elec:1,t:"Elektroliz",obs};
}

/* ---------- Idish ---------- */
// loyqalikning tinish vaqti (s): suzmasimon parchalar tez cho'kadi, mayda kristallar uzoq «sut» bo'lib turadi
const TURB_TAU={curd:2.4,glitter:3.6,flake:3,powder:3,gel:6,cryst:9};
class Vessel{
  constructor(type){this.type=KL.VESSELS[type]?type:"stakan";this.reset();}
  reset(){
    this.a={};this.ind={};this.water=0;this.org=0;this.T=20;this.heat=false;this.uv=false;this.elec=false;this.stirT=0;
    this.src={};this.comp={};this.log=[];this.fired={};this.time=0;this.events=[];this.added=[];this.order=[];
    this.gasFx={};this.gasTot={};this.pptNew=[];this.turb=0;this.turbF="cryst";this.turbCol="#ffffff";this.boil=false;this.elecFx=null;
    this.gasIn=0;this.lastAdd=-9;this.lastRx=-9;this.resCol=null;this.addSeq=0;this.seq=0;this.ctime={};
  }
  get cap(){return KL.VESSELS[this.type].cap;}
  get vol(){return this.water+this.org;}
  get ml(){return Math.round(this.vol*KL.VESSELS[this.type].ml*10)/10;}
  get capMl(){return this.cap*KL.VESSELS[this.type].ml;}
  has(id){return(this.a[id]||0)>EPS;}
  inc(id,n){this.a[id]=(this.a[id]||0)+n;if(KL.SOLIDS[id]&&!this.order.includes(id))this.order.push(id);}
  conc(id){return this.vol>EPS?(this.a[id]||0)*CONC/this.vol:0;}
  add(id){
    const s=KL.SHELF_BY_ID[id];if(!s)return{ok:false,msg:"Noma'lum reaktiv"};
    const liquid=s.k==="sol"||s.k==="liq"||s.k==="water";
    if(liquid&&this.vol+1>this.cap+EPS)return{ok:false,full:true,msg:"Idish to'ldi! Idishni tozalang yoki kattaroq idish tanlang."};
    if(s.k==="drop"&&this.ind[s.ind])return{ok:true,same:true};
    if(liquid){const V=this.vol;this.T=(this.T*V+20)/(V+1);if(s.k==="liq")this.org+=1;else this.water+=1;}
    (s.ions||[]).forEach(([i,n])=>{this.inc(i,n);this.src[i]=s.f;});
    if(s.ions){this.comp[s.f]=s.ions;this.ctime[s.f]=++this.seq;}
    (s.mol||[]).forEach(([m,n])=>this.inc(m,n));
    if(s.solid){this.inc(s.solid,1);const S=KL.SOLIDS[s.solid];if(S.dis)this.comp[S.f]=S.dis;}
    if(s.k==="drop")this.ind[s.ind]=1;
    if(s.k==="gas"){this.inc("CO2aq",1);this.gasIn=2.5;}
    this.added.push(id);this.addSeq++;this.lastAdd=this.time;this.events.push({type:"add",id});
    this.fastLoop();
    return{ok:true};
  }
  okCond(r){
    const n=r.need;
    if(n.heat&&this.T<n.heat)return false;
    if(n.cold&&this.T>=n.cold)return false;
    if(n.dry&&this.vol>EPS)return false;
    if(n.water&&this.water<EPS)return false;
    if(n.nowater&&this.water>EPS)return false;
    if(n.uv&&!this.uv)return false;
    if(r.cat&&!r.cat.every(c=>this.has(c)))return false;
    return true;
  }
  maxExt(r){
    let m=Infinity;
    for(const t of r.R){if(t.k==="w"||t.k==="air")continue;const v=(this.a[t.id]||0)/t.c;if(v<m)m=v;}
    return m===Infinity?0:m;
  }
  rateF(){return Math.min(12,Math.pow(2,(this.T-20)/15))*(this.stirT>0?1.8:1);}
  fastLoop(){
    for(let it=0;it<60;it++){
      let any=false;
      for(const r of FAST){if(!this.okCond(r))continue;const x=this.maxExt(r);if(x>EPS){this.apply(r,x);any=true;}}
      if(!any)break;
    }
  }
  react(dt){
    this.fastLoop();
    const f=this.rateF();
    for(const r of SLOW){
      if(!this.okCond(r))continue;
      const mx=this.maxExt(r);if(mx<=EPS)continue;
      const k=(r.k||SPEED[r.sp])*(r.need.heat?Math.max(1,f/3):f);
      this.apply(r,Math.min(mx,k*dt*(mx<.03?4:1)));
    }
    this.fastLoop();
  }
  apply(r,x){
    for(const t of r.R){if(t.k==="w"||t.k==="air")continue;const v=(this.a[t.id]||0)-t.c*x;this.a[t.id]=v<EPS?0:v;}
    for(const t of r.P){
      if(t.k==="w"||t.k==="air")continue;
      const n=t.c*x;
      if(t.k==="g"){this.gasOut(t.id,n);continue;}
      this.inc(t.id,n);
      if(t.k==="s"){const S=KL.SOLIDS[t.id];this.pptNew.push([t.id,n]);
        if(S.kind==="ppt"||S.kind==="powder"){const w=Math.min(1,n*1.5),tk={cryst:1.7,gel:1.25,curd:.55,glitter:.85,flake:.8}[S.form]||1;this.turbCol=this.turb>.05?KL.mixCol(this.turbCol,S.c,w/(this.turb+w)):S.c;
          if(n*tk>=this.turb*.3)this.turbF=S.form||"cryst";this.turb=Math.min(1.2,this.turb+n*1.4*tk);}}
    }
    if(r.exo)this.T=Math.min(this.vol>EPS?100:450,this.T+r.exo*x/Math.max(1,this.vol));
    this.lastRx=this.time;
    if(!this.fired[r.id]){this.fired[r.id]=1;this.record(r);}
  }
  record(r){const e=this.describe(r);this.log.unshift(e);this.events.push({type:"rx",id:r.id,entry:e,rule:r});return e;}
  gasOut(id,n,quiet){
    this.gasTot[id]=(this.gasTot[id]||0)+n;
    if(quiet)return;
    this.gasFx[id]=(this.gasFx[id]||0)+n;
    if(!this["g_"+id]){this["g_"+id]=1;this.events.push({type:"gas",id});}
  }
  step(dt){
    if(!(dt>0))return;
    dt=Math.min(dt,.1);this.time+=dt;
    const liquid=this.vol>EPS;
    if(this.heat)this.T=Math.min(liquid?100:450,this.T+(liquid?10/Math.sqrt(Math.max(1,this.vol/2)):40)*dt);
    else this.T+=(20-this.T)*Math.min(1,dt*(liquid?.035:.08));
    this.boil=liquid&&this.heat&&this.T>=99.5&&this.water>EPS;
    if(this.boil){this.water=Math.max(0,this.water-.04*dt);if(this.water<=EPS){this.water=0;if(this.org<EPS)this.dryUp();}}
    if(this.water>EPS)for(const id of Object.keys(this.a)){
      const S=KL.SOLIDS[id];if(!S||!S.dis||this.a[id]<=EPS)continue;
      const d=Math.min(this.a[id],.5*dt*this.rateF());this.a[id]-=d;
      S.dis.forEach(([i,n])=>{this.inc(i,n*d);this.src[i]=S.f;});this.comp[S.f]=S.dis;if(!this.ctime[S.f])this.ctime[S.f]=++this.seq;
    }
    this.react(dt);
    if(this.elec)this.electro(dt);else this.elecFx=null;
    if(this.has("CO2aq")){const e=Math.min(this.a.CO2aq,(this.T>60?.5:.12)*dt*(this.gasIn>0?.3:1));this.a.CO2aq-=e;this.gasOut("CO2",e,true);}
    if(this.gasIn>0)this.gasIn-=dt;
    for(const g in this.gasFx){this.gasFx[g]*=Math.exp(-dt*1.2);if(this.gasFx[g]<2e-3)delete this.gasFx[g];}
    this.turb*=Math.exp(-dt/(TURB_TAU[this.turbF]||4));
    if(this.stirT>0)this.stirT-=dt;
  }
  dryUp(){
    let tot=0,W=0,acc=[0,0,0];
    for(const id of Object.keys(this.a)){
      const I=KL.IONS[id],M=KL.MOLS[id];if(!(I||M)||this.a[id]<=EPS)continue;
      if(I){tot+=this.a[id];if(I.c){const w=this.a[id]*(I.w||1);KL.hex(I.c).forEach((v,k)=>acc[k]+=v*w);W+=w;}}
      else if(!M.liq&&id!=="CO2aq")tot+=this.a[id];
      this.a[id]=0;
    }
    if(tot>EPS){
      this.inc("res",tot/2);this.resCol=W>0?KL.mixCol("#f4f4f4",KL.toHex(acc.map(v=>v/W)),.85):"#f4f4f4";
      if(!this.fired.evap){this.fired.evap=1;const e={id:"evap",t:"Bug'latish",obs:"Suv bug'lanib ketdi — idish tubida erigan moddalar kristall holida qoldi.",ionic:null,mol:null,time:this.time};
        this.log.unshift(e);this.events.push({type:"rx",id:"evap",entry:e});}
    }
  }
  electro(dt){
    if(this.water<EPS){this.elecFx=null;return;}
    let ionT=0;for(const id in this.a)if(KL.IONS[id])ionT+=this.conc(id);
    if(ionT<.004){if(!this.fired.e_none){this.fired.e_none=1;this.events.push({type:"hint",msg:"Toza suv elektr tokini deyarli o'tkazmaydi — elektrolit qo'shing (masalan, Na₂SO₄ yoki NaOH)."});}this.elecFx={cat:0,an:0};return;}
    const c=[["Ag","dAg",1],["Cu","dCu",2],["Pb","dPb",2],["Fe2","dFe",2],["Zn","dZn",2]].find(x=>this.has(x[0]));
    const cT=c?c[0]:this.has("H")?"H":"W";
    const a=[["I","I2"],["Br","Br2"],["Cl","Cl2"]].find(x=>this.has(x[0]));
    const aT=a?a[0]:this.has("OH")?"OH":"W";
    const e=.15*dt;let cg=0,ag=0,dH=0,dOH=0;
    const cathodeWater=n=>{this.gasOut("H2",n/2);dOH+=n;cg+=n/2;};
    if(c){const use=Math.min(this.a[c[0]],e/c[2]);this.a[c[0]]-=use;this.inc(c[1],use);this.pptNew.push([c[1],use]);const rest=e-use*c[2];if(rest>EPS)cathodeWater(rest);}
    else if(cT==="H"){const use=Math.min(this.a.H,e);this.a.H-=use;this.gasOut("H2",use/2);cg+=use/2;if(e-use>EPS)cathodeWater(e-use);}
    else cathodeWater(e);
    const anodeWater=n=>{this.gasOut("O2",n/4);dH+=n;ag+=n/4;};
    if(a){const use=Math.min(this.a[a[0]],e);this.a[a[0]]-=use;if(a[1]==="Cl2"){this.gasOut("Cl2",use/2);ag+=use/2;}else this.inc(a[1],use/2);if(e-use>EPS)anodeWater(e-use);}
    else if(aT==="OH"){const use=Math.min(this.a.OH,e);this.a.OH-=use;this.gasOut("O2",use/4);ag+=use/4;if(e-use>EPS)anodeWater(e-use);}
    else anodeWater(e);
    // katod va anod yonidagi H⁺/OH⁻ o'zaro suvga aylanadi — faqat ortig'i eritmada qoladi
    const m=Math.min(dH,dOH);dH-=m;dOH-=m;
    if(dH>EPS)this.inc("H",dH);if(dOH>EPS)this.inc("OH",dOH);
    this.elecFx={cat:cg/dt,an:ag/dt,dep:c?c[1]:null,anCol:a&&a[1]!=="Cl2"?KL.MOLS[a[1]].c:null};
    const key=`e_${cT}_${aT}`;
    if(!this.fired[key]){this.fired[key]=1;this.record(elecRule(key,cT,aT,c,a));}
    this.fastLoop();
  }
  /* ---- tenglamalar ---- */
  describe(r){
    const hasIon=r.R.some(t=>t.k==="ion")||r.P.some(t=>t.k==="ion");
    let mol=null;
    if(r.molText)mol=r.molText;else if(hasIon){const m=this.molecular(r);mol=m&&m.html;}else mol=ionicHTML(r);
    return{id:r.id,t:r.t,obs:r.obs,ionic:hasIon?ionicHTML(r):null,mol,time:this.time};
  }
  molecular(r){
    const I=KL.IONS,ionsR=r.R.filter(t=>t.k==="ion"),consumed=new Set(ionsR.map(t=>t.id)),comps=[];
    for(const t of ionsR){const f=this.src[t.id];if(!f||!this.comp[f])return null;if(!comps.includes(f))comps.push(f);}
    comps.sort((a,b)=>(this.ctime[a]||0)-(this.ctime[b]||0));
    // chap tomon tartibi: qattiq moddalar, organik molekulalar, tuzlar (qo'shilish tartibida), noorganik molekulalar, suv
    const lc={},kinds={},org=f=>/C/.test(f)&&f!=="CO2";
    comps.forEach(f=>lc[f]=2);
    r.R.forEach(t=>{if(t.k==="ion")return;const f=t.k==="air"?"O2":KL.formulaOf(t.id);lc[f]=t.k==="s"?0:t.k==="w"||t.k==="air"?4:org(f)?1:3;});
    const specC=[],specA=[],newC=[],newA=[],usedC=[],usedA=[],base=[];
    comps.forEach(f=>this.comp[f].forEach(([i])=>{const A=consumed.has(i)?(I[i].z>0?usedC:usedA):(I[i].z>0?specC:specA);if(!A.includes(i))A.push(i);}));
    r.P.forEach(t=>{
      if(t.k==="ion"){const A=I[t.id].z>0?newC:newA;if(!A.includes(t.id))A.push(t.id);}
      else if(t.k!=="air"){const f=KL.formulaOf(t.id);base.push(f);const S=KL.SOLIDS[t.id];
        kinds[f]=t.k==="s"?(S.kind==="dep"||S.kind==="mirror"?"d":"s"):t.k==="g"?"g":t.k==="w"?"w":KL.MOLS[t.id].cx?"s0":"m";}
    });
    const L=Object.keys(lc);
    if([...L,...base].some(f=>{try{KL.parseFormula(f);return false;}catch(e){return true;}}))return null;
    // o'ng tomon tartibi: cho'kma, tuzlar, metall, molekulalar, gazlar, suv (elektrolizda: metall, gazlar, molekulalar, tuzlar, suv)
    const rank=r.elec?{d:0,s:0,s0:0,g:1,m:2,salt:3,w:4}:{s:0,s0:0,salt:1,d:2,m:3,g:4,w:5};
    const sortL=A=>A.sort((a,b)=>lc[a]-lc[b]||(lc[a]===2?(this.ctime[a]||0)-(this.ctime[b]||0):0));
    for(const pairs of pairings(newC,newA,specC,specA,usedC,usedA)){
      const salts=[...new Set(pairs.map(([c,a])=>KL.saltFormula(c,a)))];
      const Lu=sortL([...new Set(L)]),Ru=[...new Set([...base,...salts])];
      if(Lu.length===Ru.length&&Lu.every(f=>Ru.includes(f)))return null;
      const rk=f=>kinds[f]?rank[kinds[f]]:rank.salt;
      Ru.sort((a,b)=>rk(a)-rk(b));
      const co=KL.balanceLists(Lu,Ru);
      if(!co)continue;
      pairs.forEach(([c,a])=>{const s=KL.saltFormula(c,a),zc=I[c].z,za=-I[a].z,g=KL.gcd(zc,za);this.comp[s]=[[c,za/g],[a,zc/g]];this.src[c]=s;this.src[a]=s;this.ctime[s]=++this.seq;});
      const sideH=(A,C,prod)=>A.map((f,i)=>{let h=(C[i]>1?C[i]:"")+KL.fmt(f);if(prod){if(kinds[f]==="g")h+="↑";else if(kinds[f]==="s"||kinds[f]==="d")h+="↓";}return h;}).join(" + ");
      return{html:sideH(Lu,co[0],false)+" "+arrowHTML(r)+" "+sideH(Ru,co[1],true),L:Lu,R:Ru,co};
    }
    return null;
  }
  /* ---- ko'rsatkichlar ---- */
  pH(){
    if(this.water<EPS)return null;
    const c=id=>this.conc(id),H=c("H"),OH=c("OH");
    if(H>1e-5&&H>=OH)return clamp14(-Math.log10(H));
    if(OH>1e-5)return clamp14(14+Math.log10(OH));
    let best=null;
    for(const[ha,b,ka]of[["CH3COOH","Ac",1.8e-5],["NH4","NH3",5.6e-10],["HCO3","CO3",4.7e-11],["CO2aq","HCO3",4.3e-7]]){
      const ca=c(ha),cb=c(b);if(ca>1e-4&&cb>1e-4&&(!best||ca+cb>best.t))best={t:ca+cb,ph:-Math.log10(ka)+Math.log10(cb/ca)};
    }
    if(best)return clamp14(best.ph);
    let ka=0,kb=0,amph=0;
    for(const id in this.a){const v=c(id);if(v<1e-6)continue;const P=KL.IONS[id]||KL.MOLS[id];if(!P)continue;if(P.ka)ka+=P.ka*v;if(P.kb)kb+=P.kb*v;if(P.amph)amph+=v;}
    const net=Math.sqrt(ka)+H-Math.sqrt(kb)-OH;
    if(amph>1e-4&&Math.abs(net)<2e-5)return 8.3;
    return clamp14(-Math.log10((net+Math.sqrt(net*net+4e-14))/2));
  }
  color(){
    if(this.vol<EPS)return null;
    let W=0;const acc=[0,0,0];
    for(const id in this.a){
      const P=KL.IONS[id]||KL.MOLS[id];if(!P||!P.c||this.a[id]<=EPS)continue;
      const w=this.conc(id)*(P.w||1);KL.hex(P.c).forEach((v,k)=>acc[k]+=v*w);W+=w;
    }
    const base="#dcecf6";let col=base,alpha=.32;
    if(W>0){col=KL.mixCol(base,KL.toHex(acc.map(v=>v/W)),1-Math.exp(-W*14));alpha=.58+.37*Math.min(1,W*3);}
    const ph=this.pH();
    for(const id in this.ind){const ic=KL.indColor(id,ph);if(ic){col=KL.mixCol(col,ic,.82);alpha=Math.max(alpha,.7);}}
    return{c:col,alpha};
  }
  view(){
    const S=KL.SOLIDS;
    return{
      level:Math.min(1,this.vol/this.cap),col:this.color(),T:this.T,heat:this.heat,uv:this.uv,boil:this.boil,stir:this.stirT>0,
      layers:this.order.filter(id=>this.has(id)&&S[id].kind!=="piece"&&S[id].kind!=="mirror").map(id=>({id,amt:this.a[id],c:id==="res"&&this.resCol?this.resCol:S[id].c})),
      pieces:this.order.filter(id=>this.has(id)&&S[id].kind==="piece").map(id=>({id,amt:this.a[id]})),
      mirror:Math.min(1,(this.a.mirAg||0)*2.5),gas:this.gasFx,gasIn:this.gasIn>0,turb:Math.min(1,this.turb),turbCol:this.turbCol,turbF:this.turbF||"cryst",
      elec:this.elec?this.elecFx||{cat:0,an:0}:null,
      smell:this.smells(),vap:{br2:this.has("Br2")&&this.T>45,i2:this.has("I2")&&this.T>75}
    };
  }
  smells(){const out=[];for(const id in this.a){const M=KL.MOLS[id];if(M&&M.smell&&this.a[id]>1e-3)out.push(M.smell);}
    for(const g in this.gasFx){const G=KL.GASES[g];if(G&&G.smell&&this.gasFx[g]>.01)out.push(G.smell);}return[...new Set(out)];}
  contents(){
    const ions=[],mols=[],sol=[];
    for(const id in this.a){const v=this.a[id];if(v<1e-4)continue;
      if(KL.IONS[id])ions.push([id,this.conc(id)]);else if(KL.MOLS[id])mols.push([id,this.conc(id)]);else if(KL.SOLIDS[id])sol.push([id,v]);}
    return{ions:ions.sort((a,b)=>KL.IONS[b[0]].z-KL.IONS[a[0]].z),mols,sol,ind:Object.keys(this.ind),smell:this.smells()};
  }
  // Reaksiya kuzatilmaganda tushuntirish
  hint(){
    const h=id=>this.has(id);
    if(h("mCu")&&h("H")&&!h("NO3"))return"Mis vodoroddan keyin turadi — suyultirilgan xlorid va sulfat kislotalardan vodorodni siqib chiqara olmaydi.";
    if(h("mFe")&&(h("Zn")||h("Mg")||h("Al")))return"Temir bu metalldan kam faol — uni tuzidan siqib chiqara olmaydi.";
    if(h("mCu")&&(h("Zn")||h("Fe2")||h("Mg")||h("Al")||h("Pb")))return"Mis bu metalldan kam faol — siqib chiqarish reaksiyasi bormaydi.";
    if(h("mZn")&&(h("Mg")||h("Al")))return"Rux magniy va alyuminiydan kam faol — ularni tuzidan siqib chiqara olmaydi.";
    if(h("mCaCO3")&&this.heat&&this.vol<EPS)return"CaCO₃ ni parchalash uchun ≈900°C kerak — spirtovka alangasi yetarli emas.";
    if(h("AgI")&&h("NH3"))return"AgI ammiakli suvda erimaydi (AgCl esa eriydi) — bu galogenidlarni farqlash usuli.";
    if(h("BaSO4")&&h("H"))return"BaSO₄ kislotalarda ham erimaydi — shuning uchun u sulfat-ionni aniqlashda ishlatiladi.";
    if(Object.keys(this.ind).length&&this.vol<EPS)return"Indikator rangini ko'rish uchun idishga eritma quying.";
    const ions=Object.keys(this.a).filter(id=>KL.IONS[id]&&this.has(id));
    if(ions.length>=4)return"Barcha ionlar eritmada qoldi: cho'kma, gaz yoki kuchsiz elektrolit hosil bo'lmagani uchun ion almashinish reaksiyasi oxirigacha bormaydi.";
    return"Ko'zga ko'rinadigan o'zgarish kuzatilmadi.";
  }
}
KL.Vessel=Vessel;
})(globalThis.KL=globalThis.KL||{});
