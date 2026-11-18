// Kontent tekshiruvi: zanjir tenglamalari, amaliy ishlardagi reaksiya/reaktiv nomlari
const fs=require("fs"),vm=require("vm"),path=require("path");
const ctx={console,Math,JSON,Object,Array,Set,Map,Number,String,Error,Infinity,isFinite};ctx.globalThis=ctx;vm.createContext(ctx);
["elements","chem","species","rules","engine","content"].forEach(f=>vm.runInContext(fs.readFileSync(path.join(__dirname,"../js/"+f+".js"),"utf8"),ctx));
const KL=ctx.KL;let fail=0;const bad=m=>{fail++;console.log("✗",m);};
KL.CHAINS.forEach(c=>c.steps.forEach(([,, ,eq])=>{
  const [l,r]=eq.split("=");const parse=s=>s.split("+").map(t=>t.trim()).map(t=>{const m=t.match(/^(\d*)(.+)$/);return[m[1]?+m[1]:1,m[2]];});
  const L=parse(l),R=parse(r);let res;try{res=KL.balanceLists(L.map(x=>x[1]),R.map(x=>x[1]));}catch(e){}
  if(!res)return bad("zanjir tenglamasi: "+eq);
  const g=L.map(x=>x[0]).concat(R.map(x=>x[0])),w=res[0].concat(res[1]);
  if(g.join()!==w.join())bad(`zanjir koeffitsientlari: ${eq} → ${w.join()}`);
}));
const ids=new Set(KL.DISCOVERABLE);
const walk=(c,where)=>{if(!c)return;
  if(c.add&&!KL.SHELF_BY_ID[c.add])bad(where+": reaktiv yo'q "+c.add);
  if(c.rx&&!ids.has(c.rx))bad(where+": reaksiya yo'q "+c.rx);
  if(c.has&&!KL.SOLIDS[c.has]&&!KL.IONS[c.has]&&!KL.MOLS[c.has])bad(where+": modda yo'q "+c.has);
  (c.all||[]).forEach(x=>walk(x,where));};
KL.PRACTICALS.forEach(p=>p.steps.forEach((s,i)=>walk(s.c,p.id+"#"+i)));
KL.LESSONS.forEach(l=>{if(l.pr&&!KL.PRACTICALS.find(p=>p.id===l.pr))bad("dars "+l.id+": amaliy ish yo'q "+l.pr);if(l.q.length<3)bad("dars savollari kam: "+l.id);});
console.log(`darslar ${KL.LESSONS.length}, amaliy ishlar ${KL.PRACTICALS.length}, zanjirlar ${KL.CHAINS.length}, yutuqlar ${KL.ACHS.length}; xatolar: ${fail}`);
process.exit(fail?1:0);
