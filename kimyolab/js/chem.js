// KimyoLab — formulalar, molyar massa, tenglama tenglashtirish (DOM ishlatmaydi)
(function(KL){
"use strict";
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;};
const lcm=(a,b)=>a/gcd(a,b)*b;
KL.gcd=gcd;KL.lcm=lcm;

/* ---------- Formula yozuvi ---------- */
// HTML: H2SO4 -> H<sub>2</sub>SO<sub>4</sub>
KL.fmt=s=>String(s).replace(/([A-Za-z\)\]])(\d+)/g,"$1<sub>$2</sub>");
// Canvas uchun unicode: H2SO4 -> H₂SO₄
const SUB="₀₁₂₃₄₅₆₇₈₉",SUP={"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","+":"⁺","-":"⁻","−":"⁻"};
KL.uni=s=>String(s).replace(/([A-Za-z\)\]])(\d+)/g,(m,a,d)=>a+[...d].map(c=>SUB[+c]).join(""));
KL.uniSup=s=>[...String(s)].map(c=>SUP[c]||c).join("");

/* ---------- Formulani tahlil qilish ---------- */
function parseGroup(p){
  let i=0;const st=[{}];
  const add=(o,k,v)=>{o[k]=(o[k]||0)+v;};
  const num=()=>{let s="";while(/\d/.test(p[i]||""))s+=p[i++];return s?+s:1;};
  while(i<p.length){
    const ch=p[i];
    if(ch==="("||ch==="["){st.push({});i++;}
    else if(ch===")"||ch==="]"){i++;const t=st.pop(),n=num();if(!st.length)throw Error("Qavslar noto'g'ri");Object.entries(t).forEach(([k,v])=>add(st[st.length-1],k,v*n));}
    else if(/[A-Z]/.test(ch)){let s=ch;i++;if(/[a-z]/.test(p[i]||""))s+=p[i++];if(!KL.EL[s])throw Error("Noma'lum element: "+s);add(st[st.length-1],s,num());}
    else if(ch===" "){i++;}
    else throw Error("Noto'g'ri belgi: «"+ch+"»");
  }
  if(st.length!==1)throw Error("Qavs yopilmagan");
  return st[0];
}
KL.parseFormula=function(s){
  s=String(s).trim().replace(/[·•]/g,"*").replace(/\.(?=\d*[A-Z(])/g,"*");
  if(!s)throw Error("Formulani kiriting");
  const tot={};
  s.split("*").forEach(part=>{
    part=part.trim();let m=1;const mm=part.match(/^(\d+)(.*)$/);if(mm){m=+mm[1];part=mm[2];}
    if(!part)throw Error("Formula to'liq emas");
    Object.entries(parseGroup(part)).forEach(([k,v])=>tot[k]=(tot[k]||0)+v*m);
  });
  return tot;
};
KL.molarMass=f=>Object.entries(KL.parseFormula(f)).reduce((s,[k,v])=>s+KL.EL[k].mass*v,0);
KL.r4=x=>Math.round(x*10000)/10000;
KL.nice=(x,d=3)=>{if(!isFinite(x))return"—";const a=Math.abs(x);
  if(a!==0&&(a<1e-3||a>=1e6)){const[m,e]=x.toExponential(2).split("e");return m.replace(".",",")+"·10"+KL.uniSup(String(+e).replace("-","−").replace("−","-"));}
  return String(+x.toFixed(d)).replace(".",",");};

/* ---------- Ratsional sonlar bilan Gauss usuli ---------- */
const fr=(n,d=1)=>{if(d<0){n=-n;d=-d;}const g=gcd(n,d)||1;return[n/g,d/g];};
const fsub=(a,b)=>fr(a[0]*b[1]-b[0]*a[1],a[1]*b[1]);
const fmul=(a,b)=>fr(a[0]*b[0],a[1]*b[1]);
const fdiv=(a,b)=>fr(a[0]*b[1],a[1]*b[0]);
// Matritsa nol fazosi 1 o'lchamli bo'lsa, butun musbat koeffitsientlarni qaytaradi
function nullVector(M,n){
  const A=M.map(r=>r.map(v=>fr(v)));const m=A.length,piv=[];let row=0;
  for(let c=0;c<n&&row<m;c++){
    let p=-1;for(let r=row;r<m;r++)if(A[r][c][0]!==0){p=r;break;}
    if(p<0)continue;[A[row],A[p]]=[A[p],A[row]];
    const d=A[row][c];A[row]=A[row].map(v=>fdiv(v,d));
    for(let r=0;r<m;r++)if(r!==row&&A[r][c][0]!==0){const f=A[r][c];A[r]=A[r].map((v,k)=>fsub(v,fmul(f,A[row][k])));}
    piv.push(c);row++;
  }
  const free=[...Array(n).keys()].filter(c=>!piv.includes(c));
  if(free.length!==1)return null;
  const x=Array(n).fill(null);x[free[0]]=fr(1);
  piv.forEach((c,r)=>{x[c]=fr(-A[r][free[0]][0],A[r][free[0]][1]);});
  const L=x.reduce((s,v)=>lcm(s,v[1]),1);let co=x.map(v=>v[0]*(L/v[1]));
  if(co.every(v=>v<0))co=co.map(v=>-v);
  if(!co.every(v=>v>0))return null;
  const g=co.reduce((s,v)=>gcd(s,v));co=co.map(v=>v/g);
  return co.some(v=>v>999)?null:co;
}
// L, R — formulalar ro'yxati. Natija: [koefL, koefR] yoki null
KL.balanceLists=function(L,R){
  let ps;try{ps=[...L,...R].map(KL.parseFormula);}catch(e){return null;}
  const els=[...new Set(ps.flatMap(p=>Object.keys(p)))];
  const M=els.map(e=>ps.map((p,j)=>(p[e]||0)*(j<L.length?1:-1)));
  const co=nullVector(M,ps.length);
  return co?[co.slice(0,L.length),co.slice(L.length)]:null;
};
// "Fe + O2 -> Fe2O3" -> {L,R,cl,cr}
KL.balance=function(eq){
  const sides=String(eq).split(/→|->|=>|=/);
  if(sides.length!==2)throw Error("Tenglamada «=» yoki «→» belgisi bo'lsin");
  const clean=s=>s.split("+").map(x=>x.trim().replace(/^\d+(?=[A-Z(\[])/,"")).filter(Boolean);
  const L=clean(sides[0]),R=clean(sides[1]);
  if(!L.length||!R.length)throw Error("Ikkala tomonda ham modda bo'lsin");
  [...L,...R].forEach(KL.parseFormula);
  const res=KL.balanceLists(L,R);
  if(!res)throw Error("Bu tenglamani tenglashtirib bo'lmadi (moddalarni tekshiring)");
  return{L,R,cl:res[0],cr:res[1]};
};
KL.eqText=(L,R,cl,cr,html=true,arrow="→")=>{
  const f=html?KL.fmt:KL.uni;
  const side=(A,C)=>A.map((s,i)=>(C[i]===1?"":C[i])+f(s)).join(" + ");
  return side(L,cl)+` ${arrow} `+side(R,cr);
};
})(globalThis.KL=globalThis.KL||{});
