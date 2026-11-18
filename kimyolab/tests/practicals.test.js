// Har bir amaliy ishni dvigatelda avtomatik bajarib ko'rish
const fs=require("fs"),vm=require("vm"),path=require("path");
const ctx={console,Math,JSON,Object,Array,Set,Map,Number,String,Error,Infinity,isFinite};ctx.globalThis=ctx;vm.createContext(ctx);
["elements","chem","species","rules","engine","content"].forEach(f=>vm.runInContext(fs.readFileSync(path.join(__dirname,"../js/"+f+".js"),"utf8"),ctx));
const KL=ctx.KL;let fail=0;
for(const p of KL.PRACTICALS){
  let V=new KL.Vessel("stakan"),now=0;const x={V,gear:false,focus:false,since:{add:new Set,rx:new Set,gas:new Set,clean:false},now:0,okSince:null};
  const tick=dt=>{V.step(dt);now+=dt;x.now=now;V.events.forEach(e=>{if(e.type==="rx")x.since.rx.add(e.id);if(e.type==="gas")x.since.gas.add(e.id);});V.events.length=0;};
  let ok=true;
  for(let i=0;i<p.steps.length&&ok;i++){
    const c=p.steps[i].c;x.since={add:new Set,rx:new Set,gas:new Set,clean:false};x.okSince=null;
    const act=k=>{ if(k.add){V.add(k.add);x.since.add.add(k.add);} if(k.gear)x.gear=true; if(k.focus)x.focus=true;
      if(k.vessel&&V.type!==k.vessel){V=new KL.Vessel(k.vessel);x.V=V;} if(k.T)V.heat=true; if(k.heatOff)V.heat=false;
      if(k.elec)V.elec=true; if(k.clean){V=new KL.Vessel(V.type);x.V=V;x.since.clean=true;}
      if(k.rx&&/^(h_|o_gluCu|o_aldAg|o_aldCu)/.test(k.rx))V.heat=true; if(k.rx&&/^e_/.test(k.rx))V.elec=true;
      (k.all||[]).forEach(act); };
    act(c);
    let t=0;while(!KL.checkStep(c,x)&&t<120){tick(.05);t+=.05;
      if(t>3&&c.all&&c.all.some(k=>k.rx==="n_HOH")){V.add("HCl");}  // titrlash: rang yo'qolguncha HCl
    }
    if(t>=120){ok=false;fail++;console.log(`✗ ${p.id} #${i}: «${p.steps[i].t}» bajarilmadi`, JSON.stringify(c), "pH",V.pH(),"T",V.T.toFixed(0));}
  }
  if(ok)console.log("✓",p.id);
}
process.exit(fail?1:0);
