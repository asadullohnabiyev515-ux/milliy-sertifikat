// Tasodifiy aralashmalar: xato, NaN, manfiy miqdor bo'lmasligi kerak
const fs=require("fs"),vm=require("vm"),path=require("path");
const ctx={console,Math,JSON,Object,Array,Set,Map,Number,String,Error,Infinity,isFinite};ctx.globalThis=ctx;vm.createContext(ctx);
["elements","chem","species","rules","engine"].forEach(f=>vm.runInContext(fs.readFileSync(path.join(__dirname,"../js/"+f+".js"),"utf8"),ctx));
const KL=ctx.KL,ids=KL.SHELF.map(s=>s.id);let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
let bad=0,eqs=0,noMol=new Map(),t0=Date.now();
for(let n=0;n<3000;n++){
  const v=new KL.Vessel(["probirka","stakan","kolba"][n%3]);
  const k=2+Math.floor(rnd()*4);
  try{
    for(let i=0;i<k;i++){v.add(ids[Math.floor(rnd()*ids.length)]);if(rnd()<.2)v.heat=!v.heat;if(rnd()<.1)v.elec=!v.elec;if(rnd()<.1)v.uv=!v.uv;for(let s=0;s<20;s++)v.step(.05);}
    for(let s=0;s<60;s++)v.step(.05);
    for(const id in v.a){if(!(v.a[id]>=0)||!isFinite(v.a[id])){bad++;console.log("miqdor",id,v.a[id]);break;}}
    const p=v.pH();if(p!=null&&!(p>=0&&p<=14)){bad++;console.log("pH",p);}
    if(!isFinite(v.T)){bad++;console.log("T",v.T);}
    v.log.forEach(e=>{if(e.ionic){eqs++;if(!e.mol){noMol.set(e.id,(noMol.get(e.id)||0)+1);}}});
  }catch(e){bad++;console.log("xato:",e.message,v.added);}
}
console.log(`3000 ta tasodifiy tajriba, ${Date.now()-t0} ms, xatolar: ${bad}, ionli tenglamalar: ${eqs}`);
console.log("molekulyar tenglama tuzilmagan qoidalar:",[...noMol.entries()].sort((a,b)=>b[1]-a[1]).slice(0,25).map(([k,c])=>k+"×"+c).join(", "));
process.exit(bad?1:0);
