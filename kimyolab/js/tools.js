// KimyoLab — hisoblash vositalari
(function(KL){
"use strict";
const $=KL.$,$$=KL.$$,n=KL.nice,f=KL.fmt;
const GAS=new Set(["H2","O2","N2","Cl2","F2","CO2","CO","NH3","SO2","SO3","NO","NO2","N2O","CH4","C2H2","C2H4","C2H6","C3H8","C4H10","HCl","HBr","H2S","He","Ne","Ar","Kr","O3"]);
const num=id=>{const v=parseFloat(String($("#"+id).value).replace(",","."));return isFinite(v)?v:NaN;};
const used=()=>{KL.S.calc=(KL.S.calc||0)+1;KL.checkAch();};

/* ---------- Oksidlanish darajasi ---------- */
const ALK=["Li","Na","K","Rb","Cs","Fr"],ALKE=["Be","Mg","Ca","Sr","Ba","Ra"],METALS=new Set(KL.ELEMENTS.filter(e=>!["nonmetal","halogen","noble","metalloid"].includes(e.cat)).map(e=>e.sym));
const GROUPS=[["CH3COO",-1],["Cr2O7",-2],["MnO4",-1],["CrO4",-2],["SO4",-2],["SO3",-2],["NO3",-1],["NO2",-1],["CO3",-2],["PO4",-3],["HCO3",-1],["HSO4",-1],["ClO4",-1],["ClO3",-1],["ClO",-1],["SiO3",-2],["OH",-1],["NH4",1]];
function solve(cnt,q){
  const els=Object.keys(cnt);if(els.length===1)return{[els[0]]:q/cnt[els[0]]};
  const ox={},onlyMetalsBesidesH=els.filter(e=>e!=="H").every(e=>METALS.has(e));
  els.forEach(e=>{if(e==="F")ox[e]=-1;else if(ALK.includes(e))ox[e]=1;else if(ALKE.includes(e))ox[e]=2;else if(e==="Al")ox[e]=3;else if(e==="Zn")ox[e]=2;else if(e==="Ag")ox[e]=1;else if(e==="H")ox[e]=onlyMetalsBesidesH?-1:1;});
  let unk=els.filter(e=>ox[e]===undefined);
  if(unk.length>1&&unk.includes("O")){ox.O=-2;unk=unk.filter(e=>e!=="O");}
  if(unk.length>1&&!cnt.O){const hal=unk.filter(e=>["Cl","Br","I"].includes(e));if(hal.length===1){ox[hal[0]]=-1;unk=unk.filter(e=>e!==hal[0]);}}
  if(unk.length>1&&!cnt.O&&unk.includes("S")){ox.S=cnt.S===2&&els.length===2&&cnt[els.find(e=>e!=="S")]===1&&METALS.has(els.find(e=>e!=="S"))?-1:-2;unk=unk.filter(e=>e!=="S");}
  if(unk.length>1&&!cnt.O&&unk.includes("N")&&cnt.H){ox.N=-3;unk=unk.filter(e=>e!=="N");}
  if(unk.length>1)return null;
  const sum=els.filter(e=>!unk.includes(e)).reduce((s,e)=>s+ox[e]*cnt[e],0);
  if(unk.length===1)ox[unk[0]]=(q-sum)/cnt[unk[0]];
  else if(Math.abs(sum-q)>1e-9)return null;
  return ox;
}
KL.oxStates=function(formula,q=0){
  const s=formula.replace(/\s/g,"").split(/[*·•]/)[0];const cnt=KL.parseFormula(s);
  for(const[g,z]of GROUPS){
    let m=s.match(new RegExp("\\("+g+"\\)(\\d+)$"))||s.match(new RegExp(g+"$"))||(g==="NH4"&&s.match(/^\(NH4\)(\d*)/))||(g==="NH4"&&s.match(/^NH4/));
    if(!m)continue;const k=m[1]?+m[1]:1;
    const rest=s.replace(m[0],"")||"";if(!rest)continue;
    let rc;try{rc=KL.parseFormula(rest);}catch(e){continue;}
    const gc=KL.parseFormula(g),go=solve(gc,z);if(!go)continue;
    const ro=solve(rc,q-z*k);if(!ro)continue;
    const ox={},tot={};
    for(const e in gc){tot[e]=(tot[e]||0)+gc[e]*k;ox[e]=(ox[e]||0)+go[e]*gc[e]*k;}
    for(const e in rc){tot[e]=(tot[e]||0)+rc[e];ox[e]=(ox[e]||0)+ro[e]*rc[e];}
    const res={},mixed={};for(const e in tot){res[e]=ox[e]/tot[e];if(gc[e]&&rc[e]&&Math.abs(go[e]-ro[e])>1e-9)mixed[e]=[ro[e],go[e]];}
    return{ox:res,mixed};
  }
  const r=solve(cnt,q);return r?{ox:r}:null;
};
const sgn=v=>{if(Math.abs(v-Math.round(v))<1e-9){v=Math.round(v);return(v>0?"+":v<0?"−":"")+Math.abs(v);}
  for(let d=2;d<=8;d++){const k=v*d;if(Math.abs(k-Math.round(k))<1e-6)return(v>0?"+":"−")+Math.abs(Math.round(k))+"/"+d;}return v.toFixed(2);};

/* ---------- Bo'lim ---------- */
KL.tabs.tools={
  init(el){
    el.innerHTML=`<div class="head"><h2>🧮 Hisoblash</h2><p class="sub">Formulalarni oddiy yozing: H2SO4, Ca(OH)2, CuSO4*5H2O, Na[Al(OH)4]. O'nli kasr uchun nuqta yoki vergul.</p></div>
    <div class="tgrid">
    <div class="card"><h3>⚖️ Molyar massa va tarkib</h3><div class="row"><input id="mf" value="H2SO4" aria-label="Formula"><button class="btn pri" id="mb">Hisoblash</button></div><div class="out" id="mo"></div></div>
    <div class="card"><h3>🔢 Modda miqdori</h3><div class="row"><input id="nf" value="CO2" size="8" aria-label="Formula"><input id="nv" value="11" size="6" aria-label="Qiymat"><select id="nu"><option value="m">g (massa)</option><option value="n">mol</option><option value="V">l (n.sh. gaz)</option><option value="N">ta zarracha</option></select><button class="btn pri" id="nb">Hisoblash</button></div><div class="out" id="no"></div></div>
    <div class="card wide"><h3>🧾 Reaksiya bo'yicha hisoblash (stexiometriya)</h3><div class="row"><input id="sq" value="2H2 + O2 = 2H2O" style="flex:2" aria-label="Tenglama"><select id="ss"></select><input id="sv" value="8" size="6" aria-label="Qiymat"><select id="su"><option value="m">g</option><option value="n">mol</option><option value="V">l (n.sh.)</option></select><button class="btn pri" id="sb">Hisoblash</button></div><div class="out" id="so"></div></div>
    <div class="card"><h3>🧪 Eritmalar</h3><div class="seg" id="et"><button data-e="w" class="on">Massa ulushi</button><button data-e="cm">Molyar konsentratsiya</button><button data-e="dil">Suyultirish</button><button data-e="mix">Aralashtirish</button></div><div id="eb"></div><div class="out" id="eo"></div></div>
    <div class="card"><h3>🌡️ pH hisoblash</h3><div class="row"><select id="pk"><option value="sa">Kuchli kislota</option><option value="sb">Kuchli asos</option><option value="wa">Kuchsiz kislota (Ka)</option><option value="wb">Kuchsiz asos (Kb)</option></select>
      <input id="pc" value="0.01" size="6" aria-label="Konsentratsiya"><small>mol/l</small><input id="px" value="1" size="6" aria-label="Negizlilik yoki K"><small id="pxl">H⁺ soni</small><button class="btn pri" id="pb">Hisoblash</button></div><div class="out" id="po"></div></div>
    <div class="card"><h3>🎈 Gaz qonunlari</h3><div class="seg" id="gt"><button data-g="pv" class="on">pV = nRT</button><button data-g="d">Nisbiy zichlik</button></div><div id="gb"></div><div class="out" id="go"></div></div>
    <div class="card"><h3>🔬 Eng oddiy formula</h3><p class="mut">Elementlar va ularning massa ulushlari (%). Molyar massa ixtiyoriy.</p><div id="emr"></div><div class="row"><input id="emM" placeholder="M (g/mol), ixtiyoriy" size="14"><button class="btn pri" id="emb">Topish</button></div><div class="out" id="emo"></div></div>
    <div class="card"><h3>➕➖ Oksidlanish darajasi</h3><div class="row"><input id="oxf" value="KMnO4" aria-label="Formula"><input id="oxq" value="0" size="3" aria-label="Zaryad" title="Ion zaryadi"><small>zaryad</small><button class="btn pri" id="oxb">Aniqlash</button></div><div class="out" id="oxo"></div></div>
    <div class="card wide"><h3>⚖️ Tenglamani tenglashtirish</h3><div class="row"><input id="bq" value="KMnO4 + HCl = KCl + MnCl2 + Cl2 + H2O" style="flex:1" aria-label="Tenglama"><button class="btn pri" id="bb">Tenglashtirish</button></div>
      <div class="chips" id="bex">${["Fe + O2 = Fe2O3","Al + H2SO4 = Al2(SO4)3 + H2","C3H8 + O2 = CO2 + H2O","Cu + HNO3 = Cu(NO3)2 + NO + H2O","FeS2 + O2 = Fe2O3 + SO2"].map(x=>`<button class="chip" data-x="${x}">${f(x)}</button>`).join("")}</div><div class="out" id="bo"></div></div>
    </div>`;
    const run=(btn,out,fn)=>{const go=()=>{const o=$("#"+out);try{o.innerHTML=fn();o.classList.remove("err");used();}catch(e){o.innerHTML=`<span class="err">⚠ ${e.message}</span>`;}};$("#"+btn).onclick=go;return go;};
    run("mb","mo",()=>{const fm=$("#mf").value,p=KL.parseFormula(fm),M=KL.molarMass(fm);
      return`<div class="res">M(${f(fm)}) = <b>${n(M,3)} g/mol</b></div><table class="tbl"><tr><th>Element</th><th>Atomlar</th><th>Ar</th><th>Massa</th><th>w, %</th></tr>${Object.entries(p).map(([e,k])=>{const w=k*KL.EL[e].mass/M*100;
        return`<tr><td><b>${e}</b> ${KL.EL[e].name}</td><td>${k}</td><td>${n(KL.EL[e].mass,3)}</td><td>${n(k*KL.EL[e].mass,3)}</td><td><span class="bar" style="--w:${w}%"></span>${n(w,2)}</td></tr>`;}).join("")}</table>`;});
    run("nb","no",()=>{const fm=$("#nf").value,M=KL.molarMass(fm),v=num("nv"),u=$("#nu").value;if(!(v>=0))throw Error("Qiymatni kiriting");
      const nn=u==="m"?v/M:u==="n"?v:u==="V"?v/22.4:v/6.022e23;
      return`<div class="res">n = <b>${n(nn,4)} mol</b></div>m = n·M = ${n(nn,4)} · ${n(M,3)} = <b>${n(nn*M,3)} g</b><br>N = n·N<sub>A</sub> = <b>${n(nn*6.022e23,3)}</b> ta zarracha<br>${GAS.has(fm.trim())||u==="V"?`V(n.sh.) = n·22,4 = <b>${n(nn*22.4,3)} l</b>`:`<span class="mut">Gaz bo'lsa: V = ${n(nn*22.4,3)} l</span>`}`;});
    let bal=null;const fill=()=>{try{bal=KL.balance($("#sq").value);$("#ss").innerHTML=[...bal.L,...bal.R].map((x,i)=>`<option value="${i}">${x}</option>`).join("");}catch(e){bal=null;$("#ss").innerHTML="";}};
    $("#sq").oninput=fill;fill();
    run("sb","so",()=>{if(!bal)throw Error("Tenglamani tekshiring");const all=[...bal.L,...bal.R],co=[...bal.cl,...bal.cr],i=+$("#ss").value,M=KL.molarMass(all[i]),v=num("sv"),u=$("#su").value;if(!(v>0))throw Error("Qiymatni kiriting");
      const n0=(u==="m"?v/M:u==="n"?v:v/22.4)/co[i];
      return`<div class="res">${KL.eqText(bal.L,bal.R,bal.cl,bal.cr)}</div><table class="tbl"><tr><th>Modda</th><th>Koef.</th><th>M, g/mol</th><th>n, mol</th><th>m, g</th><th>V, l (n.sh.)</th></tr>${all.map((x,k)=>{const nk=n0*co[k],Mk=KL.molarMass(x);
        return`<tr class="${k===i?"hl":""}"><td>${f(x)}</td><td>${co[k]}</td><td>${n(Mk,2)}</td><td>${n(nk,4)}</td><td>${n(nk*Mk,3)}</td><td>${GAS.has(x)?n(nk*22.4,3):"—"}</td></tr>`;}).join("")}</table>`;});
    const ET={w:`<div class="row"><label>m(modda) <input id="e1" value="20" size="5"> g</label><label>m(suv) <input id="e2" value="180" size="5"> g</label></div>`,
      cm:`<div class="row"><input id="e0" value="NaOH" size="7" aria-label="Formula"><label><input id="e1" value="4" size="5"> g</label><label>V = <input id="e2" value="500" size="5"> ml</label></div>`,
      dil:`<div class="row"><label>C₁ <input id="e1" value="2" size="4"></label><label>V₁ <input id="e2" value="100" size="4"> ml</label><label>C₂ <input id="e3" value="0.5" size="4"></label></div>`,
      mix:`<div class="row"><label>w₁ <input id="e1" value="10" size="3">%</label><label>m₁ <input id="e2" value="200" size="4"> g</label><label>w₂ <input id="e3" value="30" size="3">%</label><label>m₂ <input id="e4" value="300" size="4"> g</label></div>`};
    let et="w";const etDraw=()=>{$("#eb").innerHTML=ET[et]+`<button class="btn pri" id="ebb">Hisoblash</button>`;$$("#et button").forEach(b=>b.classList.toggle("on",b.dataset.e===et));
      run("ebb","eo",()=>{const a=num("e1"),b=num("e2");
        if(et==="w"){if(!(a>=0&&b>=0)||a+b<=0)throw Error("Massalarni kiriting");return`w = m(modda) / (m(modda) + m(suv)) = ${n(a,3)} / ${n(a+b,3)} = <b>${n(a/(a+b)*100,2)}%</b>`;}
        if(et==="cm"){const M=KL.molarMass($("#e0").value),nn=a/M;if(!(b>0))throw Error("Hajmni kiriting");return`n = ${n(a,3)} / ${n(M,2)} = ${n(nn,4)} mol<br>C<sub>M</sub> = n / V = ${n(nn,4)} / ${n(b/1000,4)} l = <b>${n(nn/(b/1000),4)} mol/l</b>`;}
        if(et==="dil"){const c2=num("e3");if(!(c2>0&&c2<a))throw Error("C₂ < C₁ bo'lsin");const v2=a*b/c2;return`C₁V₁ = C₂V₂ ⇒ V₂ = ${n(a,3)} · ${n(b,3)} / ${n(c2,3)} = <b>${n(v2,2)} ml</b><br>Qo'shiladigan suv: <b>${n(v2-b,2)} ml</b>`;}
        const w2=num("e3"),m2=num("e4");return`w = (w₁m₁ + w₂m₂) / (m₁ + m₂) = (${n(a*b/100,2)} + ${n(w2*m2/100,2)}) / ${n(b+m2,2)} = <b>${n((a*b+w2*m2)/(b+m2),2)}%</b>`;});};
    $("#et").onclick=e=>{const b=e.target.closest("[data-e]");if(b){et=b.dataset.e;etDraw();}};etDraw();
    $("#pk").onchange=()=>{const k=$("#pk").value;$("#pxl").textContent=k==="sa"?"H⁺ soni":k==="sb"?"OH⁻ soni":k==="wa"?"Ka":"Kb";$("#px").value=k==="wa"?"1.8e-5":k==="wb"?"1.8e-5":"1";};
    run("pb","po",()=>{const c=num("pc"),x=num("px"),k=$("#pk").value;if(!(c>0&&x>0))throw Error("Musbat qiymatlar kiriting");
      let H;if(k==="sa")H=c*x;else if(k==="sb")H=1e-14/(c*x);else if(k==="wa")H=(-x+Math.sqrt(x*x+4*x*c))/2;else{const OH=(-x+Math.sqrt(x*x+4*x*c))/2;H=1e-14/OH;}
      const ph=-Math.log10(H);return`<div class="res">pH = <b>${n(ph,2)}</b>, pOH = ${n(14-ph,2)}</div>[H⁺] = ${n(H,3)} mol/l — ${ph<6.99?"kislotali":ph>7.01?"ishqoriy":"neytral"} muhit<div class="phbar sm"><i style="left:calc(${Math.max(0,Math.min(14,ph))/14*100}% - 3px)"></i></div>`;});
    const GT={pv:`<p class="mut">Noma'lumni bo'sh qoldiring. R = 8,314 J/(mol·K)</p><div class="row"><label>p <input id="g1" value="101.3" size="5"> kPa</label><label>V <input id="g2" value="" size="5"> l</label><label>n <input id="g3" value="1" size="4"> mol</label><label>t <input id="g4" value="0" size="4"> °C</label></div>`,
      d:`<div class="row"><input id="g1" value="SO2" size="7" aria-label="Gaz formulasi"><select id="g2"><option value="2.016">H₂ ga nisbatan</option><option value="29">havoga nisbatan</option><option value="31.998">O₂ ga nisbatan</option><option value="4.003">He ga nisbatan</option></select></div>`};
    let gt="pv";const gtDraw=()=>{$("#gb").innerHTML=GT[gt]+`<button class="btn pri" id="gbb">Hisoblash</button>`;$$("#gt button").forEach(b=>b.classList.toggle("on",b.dataset.g===gt));
      run("gbb","go",()=>{if(gt==="d"){const M=KL.molarMass($("#g1").value),m2=+$("#g2").value;return`D = M(${f($("#g1").value)}) / M = ${n(M,2)} / ${n(m2,2)} = <b>${n(M/m2,3)}</b>`;}
        const v=[1,2,3,4].map(i=>$("#g"+i).value.trim()===""?null:num("g"+i)),miss=v.map((x,i)=>x===null?i:-1).filter(i=>i>=0);if(miss.length!==1)throw Error("Aynan bitta maydonni bo'sh qoldiring");
        const[p,V,nn,t]=v,T=t!=null?t+273.15:null,R=8.314;let out;
        if(miss[0]===0)out=`p = nRT / V = <b>${n(nn*R*T/V,3)} kPa</b>`;else if(miss[0]===1)out=`V = nRT / p = <b>${n(nn*R*T/p,3)} l</b>`;else if(miss[0]===2)out=`n = pV / RT = <b>${n(p*V/(R*T),4)} mol</b>`;else out=`T = pV / nR = ${n(p*V/(nn*R),2)} K = <b>${n(p*V/(nn*R)-273.15,2)} °C</b>`;return out;});};
    $("#gt").onclick=e=>{const b=e.target.closest("[data-g]");if(b){gt=b.dataset.g;gtDraw();}};gtDraw();
    $("#emr").innerHTML=[["C","40"],["H","6.67"],["O","53.33"],["",""]].map(([e,p],i)=>`<div class="row"><input id="ee${i}" value="${e}" size="3" placeholder="El." aria-label="Element"><input id="ep${i}" value="${p}" size="6" placeholder="%" aria-label="Foiz"><small>%</small></div>`).join("");
    run("emb","emo",()=>{const rows=[0,1,2,3].map(i=>[$("#ee"+i).value.trim(),num("ep"+i)]).filter(r=>r[0]);if(rows.length<2)throw Error("Kamida 2 ta element kiriting");
      rows.forEach(([e,p])=>{if(!KL.EL[e])throw Error("Noma'lum element: "+e);if(!(p>0))throw Error(e+" uchun foizni kiriting");});
      const mol=rows.map(([e,p])=>p/KL.EL[e].mass),mn=Math.min(...mol),rat=mol.map(x=>x/mn);let k=1;for(;k<=8;k++)if(rat.every(r=>Math.abs(r*k-Math.round(r*k))<.12))break;if(k>8)k=1;
      const idx=rat.map(r=>Math.round(r*k)),form=rows.map(([e],i)=>e+(idx[i]>1?idx[i]:"")).join(""),Me=KL.molarMass(form),M=num("emM");
      let mf="";if(M>0){const m=Math.round(M/Me);if(m>=1)mf=`<br>M = ${n(M,2)} ⇒ ${n(M,2)} / ${n(Me,2)} ≈ ${m} ⇒ molekulyar formula: <b>${f(rows.map(([e],i)=>e+(idx[i]*m>1?idx[i]*m:"")).join(""))}</b>`;}
      return`n(atom) nisbati: ${rows.map(([e],i)=>`${e} ${n(mol[i],3)}`).join(" : ")} = ${rat.map(r=>n(r,2)).join(" : ")}<div class="res">Eng oddiy formula: <b>${f(form)}</b> (M = ${n(Me,2)} g/mol)</div>${mf}`;});
    run("oxb","oxo",()=>{const fm=$("#oxf").value.trim(),q=num("oxq")||0,r=KL.oxStates(fm,q);if(!r)throw Error("Bu formula uchun darajalarni avtomatik aniqlab bo'lmadi");
      return`<div class="res">${Object.entries(r.ox).map(([e,v])=>`<span class="pill big">${e}<sup>${sgn(v)}</sup></span>`).join(" ")}</div>${Object.keys(r.mixed||{}).length?Object.entries(r.mixed).map(([e,[a,b]])=>`<p class="mut">${e} ikki xil holatda: ${sgn(a)} va ${sgn(b)} (o'rtacha ${sgn(r.ox[e])})</p>`).join(""):""}<p class="mut">Yig'indi: ${q?"ion zaryadi "+sgn(q):"0 (neytral molekula)"}</p>`;});
    const bgo=run("bb","bo",()=>{const r=KL.balance($("#bq").value);KL.S.balanced=1;KL.checkAch();return`<div class="res big">${KL.eqText(r.L,r.R,r.cl,r.cr)}</div><p class="mut">Atomlar soni ikkala tomonda teng.</p>`;});
    $("#bex").onclick=e=>{const b=e.target.closest("[data-x]");if(b){$("#bq").value=b.dataset.x;bgo();}};
    $$("input",el).forEach(i=>i.addEventListener("keydown",e=>{if(e.key==="Enter"){const c=i.closest(".card");const b=c&&c.querySelector(".btn.pri");if(b)b.click();}}));
  }
};
})(globalThis.KL=globalThis.KL||{});
