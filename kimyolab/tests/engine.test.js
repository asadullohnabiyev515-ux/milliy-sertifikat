// KimyoLab dvigateli testlari: node tests/engine.test.js
const fs=require("fs"),vm=require("vm"),path=require("path");
const ctx={console,Math,JSON,Object,Array,Set,Map,Number,String,Error,Infinity,isFinite};ctx.globalThis=ctx;vm.createContext(ctx);
["elements","chem","species","rules","engine"].forEach(f=>vm.runInContext(fs.readFileSync(path.join(__dirname,"../js/"+f+".js"),"utf8"),ctx,{filename:f}));
const KL=ctx.KL;let pass=0,fail=0;
const ok=(c,m)=>{if(c)pass++;else{fail++;console.log("✗",m);}};
const strip=h=>String(h||"").replace(/<small>[^<]*<\/small>/g,"").replace(/<sub>(\d+)<\/sub>/g,"$1").replace(/<sup>[^<]*<\/sup>/g,"").replace(/<[^>]+>/g,"").replace(/\s+/g," ").trim();
// 1) har bir qoida: atomlar va zaryad balansi
const cnt=(tok,sign,acc)=>{
  const f=tok.k==="w"?"H2O":tok.k==="air"?"O2":KL.formulaOf(tok.id);
  const P=KL.MOLS[tok.id]||KL.SOLIDS[tok.id];if(P&&P.np)return false;
  const p=KL.parseFormula(f);for(const e in p)acc[e]=(acc[e]||0)+sign*p[e]*tok.c;
  if(tok.k==="ion")acc.$z=(acc.$z||0)+sign*KL.IONS[tok.id].z*tok.c;return true;};
let checked=0;
KL.RULES.forEach(r=>{const acc={};let okk=true;r.R.forEach(t=>okk=cnt(t,1,acc)&&okk);r.P.forEach(t=>okk=cnt(t,-1,acc)&&okk);
  if(!okk)return;checked++;const bad=Object.entries(acc).filter(([k,v])=>Math.abs(v)>1e-9);ok(!bad.length,`balans: ${r.id} ${JSON.stringify(bad)}`);});
console.log(`qoidalar: ${KL.RULES.length}, balansi tekshirildi: ${checked}, kashf etiladigan: ${KL.DISCOVERABLE.length}`);
// 2) stsenariylar
const run=(type,seq,opt={})=>{const v=new KL.Vessel(type||"stakan");for(const s of seq){if(typeof s==="number"){for(let t=0;t<s;t+=.05)v.step(.05);}else if(s.startsWith("!")){const k=s.slice(1);if(k==="heat")v.heat=!v.heat;if(k==="uv")v.uv=!v.uv;if(k==="elec")v.elec=!v.elec;}else{const r=v.add(s);if(!r.ok)throw Error(s+": "+r.msg);}}return v;};
const fired=(v,id)=>!!v.fired[id];
const mol=(v,id)=>strip((v.log.find(e=>e.id===id)||{}).mol);
const near=(a,b,t=.15)=>a!=null&&Math.abs(a-b)<=t;
let v;
v=run(0,["HCl","NaOH"]);ok(fired(v,"n_HOH"),"neytrallanish");ok(near(v.pH(),7),"pH neytral "+v.pH());ok(mol(v,"n_HOH")==="HCl + NaOH → NaCl + H2O","mol HCl+NaOH: "+mol(v,"n_HOH"));
v=run(0,["H2SO4","NaOH","NaOH"]);ok(mol(v,"n_HOH")==="H2SO4 + 2NaOH → Na2SO4 + 2H2O","H2SO4: "+mol(v,"n_HOH"));ok(near(v.pH(),7),"pH H2SO4+2NaOH");
v=run(0,["CuSO4","NaOH","NaOH"]);ok(v.has("CuOH2"),"Cu(OH)2");ok(mol(v,"p_Cu_OH")==="CuSO4 + 2NaOH → Cu(OH)2↓ + Na2SO4","mol Cu: "+mol(v,"p_Cu_OH"));
v=run(0,["CuSO4","NaOH","NaOH","!heat",30]);ok(v.has("CuO")&&!v.has("CuOH2"),"Cu(OH)2 -> CuO qizdirishda");
v=run(0,["BaCl2","Na2SO4"]);ok(v.has("BaSO4"),"BaSO4");ok(mol(v,"p_Ba_SO4")==="BaCl2 + Na2SO4 → BaSO4↓ + 2NaCl","mol Ba: "+mol(v,"p_Ba_SO4"));
v=run(0,["AgNO3","NaCl"]);ok(v.has("AgCl"),"AgCl");v.add("NH3");v.add("NH3");for(let i=0;i<120;i++)v.step(.05);ok(!v.has("AgCl")&&v.has("AgNH3"),"AgCl ammiakda eriydi");
v=run(0,["AgNO3","KI","NH3","NH3",6]);ok(v.has("AgI"),"AgI ammiakda erimaydi");ok(/AgI/.test(v.hint()),"AgI izohi");
v=run(0,["Na2CO3","HCl","HCl"]);ok(fired(v,"g_CO3")&&v.gasTot.CO2>0.9,"CO2 ajraldi");ok(mol(v,"g_CO3")==="Na2CO3 + 2HCl → 2NaCl + CO2↑ + H2O","mol CO2: "+mol(v,"g_CO3"));
v=run(0,["HCl","HCl","mZn",20]);ok(v.gasTot.H2>.9&&v.has("Zn"),"Zn + HCl -> H2");ok(mol(v,"m_Zn_H")==="Zn + 2HCl → ZnCl2 + H2↑","mol Zn: "+mol(v,"m_Zn_H"));
v=run(0,["CuSO4","mFe",20]);ok(v.has("dCu")&&v.has("Fe2"),"Fe + CuSO4 -> Cu");ok(mol(v,"x_mFe_Cu")==="Fe + CuSO4 → FeSO4 + Cu↓","mol Fe+CuSO4: "+mol(v,"x_mFe_Cu"));
v=run(0,["HCl","mCu",5]);ok(!v.log.length&&/vodorod/.test(v.hint()),"Cu + HCl reaksiya yo'q");
v=run(0,["HNO3","HNO3","HNO3","mCu",30]);ok(v.gasTot.NO>0&&v.has("Cu"),"Cu + HNO3 -> NO");ok(mol(v,"m_Cu_HNO3")==="3Cu + 8HNO3 → 3Cu(NO3)2 + 2NO↑ + 4H2O","mol Cu+HNO3: "+mol(v,"m_Cu_HNO3"));
v=run(0,["KMnO4","H2SO4","Na2SO3","Na2SO3","Na2SO3"]);ok(fired(v,"r_MnSO3a"),"KMnO4 kislotali");console.log("  ",mol(v,"r_MnSO3a"));
v=run(0,["KMnO4","Na2SO3"]);ok(fired(v,"r_MnSO3n")&&v.has("MnO2"),"KMnO4 neytral");console.log("  ",mol(v,"r_MnSO3n"));
v=run(0,["KMnO4","KOH","KOH","Na2SO3"]);ok(fired(v,"r_MnSO3b"),"KMnO4 ishqoriy");console.log("  ",mol(v,"r_MnSO3b"));
v=run(0,["NaCl","php","!elec",15]);ok(v.gasTot.H2>0&&v.gasTot.Cl2>0&&v.pH()>8,"NaCl elektrolizi "+v.pH());ok(mol(v,"e_W_Cl")==="2NaCl + 2H2O → H2↑ + Cl2↑ + 2NaOH","mol NaCl el: "+mol(v,"e_W_Cl"));
v=run(0,["CuSO4","!elec",15]);ok(v.has("dCu")&&v.pH()<3,"CuSO4 elektrolizi");ok(mol(v,"e_Cu_W")==="2CuSO4 + 2H2O → 2Cu↓ + O2↑ + 2H2SO4","mol CuSO4 el: "+mol(v,"e_Cu_W"));
v=run(0,["Na2SO4","!elec",5]);ok(fired(v,"e_W_W")&&near(v.pH(),7,.3),"suv elektrolizi "+v.pH());
v=run(0,["H2O","!elec",3]);ok(v.fired.e_none,"toza suv tok o'tkazmaydi");
v=run(0,["CaOH2","CO2"]);ok(fired(v,"c_lime")&&v.has("CaCO3"),"ohakli suv loyqalandi");v.add("CO2");v.add("CO2");for(let i=0;i<200;i++)v.step(.05);ok(v.a.CaCO3<.6,"ortiqcha CO2: "+v.a.CaCO3);
v=run(0,["AlCl3","NaOH","NaOH","NaOH"]);ok(v.has("AlOH3"),"Al(OH)3");v.add("NaOH");for(let i=0;i<80;i++)v.step(.05);ok(!v.has("AlOH3")&&v.has("AlOH4"),"amfoterlik");
v=run(0,["AlCl3","Na2CO3"]);ok(fired(v,"jh_Al"),"birgalikdagi gidroliz");console.log("  ",mol(v,"jh_Al"));
v=run(0,["FeCl3","KSCN"]);ok(v.has("FeSCN3"),"Fe(SCN)3");console.log("  ",mol(v,"q_FeSCN"));
v=run(0,["CuSO4","NaOH","NaOH","NaOH","C6H12O6","!heat",40]);ok(v.has("Cu2O"),"glyukoza + Cu(OH)2 -> Cu2O");
v=run(0,["starch","I2"]);ok(v.has("starchI"),"yod-kraxmal");v.heat=true;for(let i=0;i<400;i++)v.step(.05);ok(!v.has("starchI"),"qizdirganda rang yo'qoladi");
v=run(0,["KMnO4s","!heat",15]);ok(v.gasTot.O2>0.3,"KMnO4 qizdirish -> O2");
v=run(0,["H2O","php","mNa",6]);ok(v.gasTot.H2>0.4&&v.pH()>12&&KL.indColor("php",v.pH()),"Na + suv");ok(mol(v,"m_Na_H2O")==="2Na + 2H2O → 2NaOH + H2↑","mol Na: "+mol(v,"m_Na_H2O"));
v=run(0,["CuSO4","mNa",6]);ok(v.has("CuOH2")&&!v.has("dCu"),"Na CuSO4 da misni siqib chiqarmaydi");ok(mol(v,"p_Cu_OH")==="CuSO4 + 2NaOH → Cu(OH)2↓ + Na2SO4","Na->CuSO4 ketma-ket: "+mol(v,"p_Cu_OH"));
v=run(0,["H2O2","MnO2",5]);ok(v.gasTot.O2>.3,"H2O2 + MnO2");
v=run(0,["NH4Cl","NaOH","!heat",40]);ok(v.gasTot.NH3g>.3,"NH4Cl + NaOH qizdirish -> NH3");
v=run(0,["C6H5OH","Br2","Br2","Br2"]);ok(v.has("C6H2Br3OH"),"fenol + brom");console.log("  ",mol(v,"o_phenolBr"));
v=run(0,["K2Cr2O7","NaOH","NaOH"]);ok(v.has("CrO4"),"dixromat -> xromat");v.add("HCl");v.add("HCl");v.add("HCl");ok(v.has("Cr2O7"),"xromat -> dixromat");
v=run(0,["FeSO4","NaOH","NaOH",60]);ok(v.has("FeOH3"),"Fe(OH)2 havoda oksidlanadi");
v=run(0,["AgNO3","NaCl","!uv",20]);ok(v.has("phAg"),"AgCl yorug'likda qorayadi");
v=run("probirka",["NaCl","!heat",400]);ok(v.has("res")&&v.water===0,"bug'latish -> kristallar");
v=run(0,["CH3COOH","C2H5OH","H2SO4","!heat",60]);ok(v.has("CH3COOC2H5"),"eterifikatsiya");
v=run(0,["CH3CHO","tollens","!heat",40]);ok(v.has("mirAg"),"kumush ko'zgu");console.log("  ",mol(v,"o_aldAg"));
v=run(0,["CuSO4","KI","KI"]);ok(v.has("CuI")&&v.has("I2"),"Cu2+ + I-");console.log("  ",mol(v,"r_CuI"));
v=run(0,["CuSO4","NH3","NH3",1,"NH3","NH3","NH3",20]);ok(v.has("CuNH3"),"[Cu(NH3)4]2+");
v=run(0,["mCaCO3","HCl","HCl",20]);ok(v.gasTot.CO2>.5,"marmar + HCl");ok(mol(v,"d_marble")==="CaCO3 + 2HCl → CaCl2 + CO2↑ + H2O","mol marmar: "+mol(v,"d_marble"));
v=run(0,["NaHCO3s","CH3COOH",10]);ok(v.gasTot.CO2>.3,"soda + sirka");
v=run(0,["BaCl2","Na2CO3","HCl","HCl",10]);ok(!v.has("BaCO3"),"BaCO3 kislotada eriydi");
// 3) pH
const ph=s=>run(0,s).pH();
[["HCl",1],["NaOH",13],["CH3COOH",2.87],["NH3",11.13],["NH4Cl",5.13],["Na2CO3",11.66],["CH3COONa",8.87],["CuSO4",4],["FeCl3",2],["AlCl3",3],["NaCl",7],["Na2SO3",10.1]]
 .forEach(([s,e])=>ok(near(ph([s]),e,.12),`pH ${s}: ${ph([s])} ≈ ${e}`));
ok(near(ph(["CH3COOH","CH3COONa"]),4.74,.05),"bufer pH");
ok(near(run(0,["H2O","NaHCO3s",5]).pH(),8.3,.2),"NaHCO3 pH "+run(0,["H2O","NaHCO3s",5]).pH());
// 4) indikator ranglari
ok(KL.indColor("php",12)&&!KL.indColor("php",7),"fenolftalein");ok(KL.indColor("lit",2)==="#d8323b","lakmus qizil");
// 5) tenglashtirgich
const b=KL.balance("KMnO4 + HCl = KCl + MnCl2 + Cl2 + H2O");ok(b.cl.join()==="2,16"&&b.cr.join()==="2,2,5,8","balans KMnO4+HCl");
ok(KL.saltFormula("Al","SO4")==="Al2(SO4)3"&&KL.saltFormula("NH4","SO4")==="(NH4)2SO4"&&KL.saltFormula("Ca","Ac")==="Ca(CH3COO)2"&&KL.saltFormula("Na","Ac")==="CH3COONa","tuz formulalari");
console.log(`\n${pass} ✓, ${fail} ✗`);process.exit(fail?1:0);
