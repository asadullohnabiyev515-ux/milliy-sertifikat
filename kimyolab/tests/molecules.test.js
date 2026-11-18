// Molekulalar geometriyasi: bog' uzunliklari va burchaklar
const fs=require("fs"),vm=require("vm"),path=require("path");
const ctx={console,Math,JSON,Object,Array,Set,Map,Number,String,Error,Infinity,isFinite};ctx.globalThis=ctx;vm.createContext(ctx);
ctx.KL={tabs:{}};["elements","chem","molecules"].forEach(f=>vm.runInContext(fs.readFileSync(path.join(__dirname,"../js/"+f+".js"),"utf8"),ctx));
const KL=ctx.KL;let fail=0;
const d=(p,q)=>Math.hypot(p[1]-q[1],p[2]-q[2],p[3]-q[3]);
const ang=(a,o,b)=>{const u=[a[1]-o[1],a[2]-o[2],a[3]-o[3]],v=[b[1]-o[1],b[2]-o[2],b[3]-o[3]];return Math.acos((u[0]*v[0]+u[1]*v[1]+u[2]*v[2])/Math.hypot(...u)/Math.hypot(...v))*180/Math.PI;};
const expect={h2o:[[1,0,2,104.5]],nh3:[[1,0,2,107],[1,0,3,107],[2,0,3,107]],ch4:[[1,0,2,109.47]],c2h6:[[2,0,3,107.9],[2,0,1,111]],c3h8:[[0,1,2,112],[3,0,4,107.8]],
  etoh:[[0,1,2,109.5],[1,2,3,108.5]],h2o2:[[0,1,3,94.8]],ch3cooh:[[2,1,3,123],[0,1,2,126]],urea:[[2,0,3,118]],so3:[[1,0,2,120]],h3o:[[1,0,2,113]],nh4:[[1,0,2,109.47]],hno3:[[1,0,2,127]]};
KL.MOLECULES.forEach(m=>{
  const g=m.build(),A=g.a;
  // har bir bog' 0,9–3 A, bog'lanmagan atomlar bir-biriga 0,85 A dan yaqin emas
  g.b.forEach(([i,j])=>{const L=d(A[i],A[j]);if(!(L>.9&&L<3))fail++,console.log("✗ bog'",m.id,i,j,L.toFixed(2));});
  for(let i=0;i<A.length;i++)for(let j=i+1;j<A.length;j++){const L=d(A[i],A[j]);if(L<.85)fail++,console.log("✗ juda yaqin",m.id,i,j,L.toFixed(2));}
  (expect[m.id]||[]).forEach(([a,o,b,e])=>{const v=ang(A[a],A[o],A[b]);if(Math.abs(v-e)>1.5)fail++,console.log(`✗ burchak ${m.id} ${a}-${o}-${b}: ${v.toFixed(1)} ≠ ${e}`);});
});
const dia=KL._molBuild("diamond"),gr=KL._molBuild("graphite"),na=KL._molBuild("nacl");
console.log(`molekulalar: ${KL.MOLECULES.length}; olmos ${dia.a.length} atom/${dia.b.length} bog', grafit ${gr.a.length}/${gr.b.length}, NaCl ${na.a.length}/${na.b.length}; xatolar: ${fail}`);
// planarlik: HCHO, urea, ch3cho (C=O atrofida), benzol
const planar=(id,idx)=>{const A=KL._molBuild(id).a,P=idx.map(i=>A[i]);const n=(()=>{const u=[P[1][1]-P[0][1],P[1][2]-P[0][2],P[1][3]-P[0][3]],v=[P[2][1]-P[0][1],P[2][2]-P[0][2],P[2][3]-P[0][3]];return[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];})();
  const L=Math.hypot(...n);return Math.max(...P.map(p=>Math.abs(((p[1]-P[0][1])*n[0]+(p[2]-P[0][2])*n[1]+(p[3]-P[0][3])*n[2])/L)));};
[["hcho",[0,1,2,3]],["urea",[0,1,2,3,4,5,6,7]],["hcooh",[0,1,2,3,4]],["ch3cooh",[0,1,2,3,4]],["c6h6",[0,1,2,3,4,5,6,7,8,9,10,11]]].forEach(([id,ix])=>{const e=planar(id,ix);if(e>.02){fail++;console.log("✗ yassi emas",id,e.toFixed(3));}});
process.exit(fail?1:0);
