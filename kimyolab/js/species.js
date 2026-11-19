// KimyoLab — zarrachalar registri: ionlar, molekulalar, qattiq moddalar, gazlar, indikatorlar, reaktivlar javoni
(function(KL){
"use strict";
// c — rang, w — rang kuchi, ka/kb — gidroliz/dissotsilanish konstantasi
const IONS={
  H:{f:"H",z:1,n:"vodorod"},
  Na:{f:"Na",z:1,n:"natriy"}, K:{f:"K",z:1,n:"kaliy"},
  NH4:{f:"NH4",z:1,n:"ammoniy",ka:5.6e-10},
  Ag:{f:"Ag",z:1,n:"kumush",ka:1e-12},
  Ca:{f:"Ca",z:2,n:"kalsiy"}, Ba:{f:"Ba",z:2,n:"bariy"},
  Mg:{f:"Mg",z:2,n:"magniy",ka:1e-11}, Zn:{f:"Zn",z:2,n:"rux",ka:1e-9},
  Cu:{f:"Cu",z:2,n:"mis(II)",c:"#1f7cf2",w:2.2,ka:1e-7},
  Fe2:{f:"Fe",z:2,n:"temir(II)",c:"#a6d79a",w:.6,ka:1e-8},
  Fe3:{f:"Fe",z:3,n:"temir(III)",c:"#dba030",w:1.2,ka:1e-3},
  Pb:{f:"Pb",z:2,n:"qo'rg'oshin",ka:1e-7},
  Mn:{f:"Mn",z:2,n:"marganes(II)",c:"#f4d3e1",w:.3,ka:1e-10},
  Cr:{f:"Cr",z:3,n:"xrom(III)",c:"#3c8c4a",w:1.3,ka:1e-4},
  Al:{f:"Al",z:3,n:"alyuminiy",ka:1e-5},
  CuNH3:{f:"[Cu(NH3)4]",z:2,n:"tetraammin-mis(II)",c:"#2337c6",w:3},
  AgNH3:{f:"[Ag(NH3)2]",z:1,n:"diammin-kumush"},
  OH:{f:"OH",z:-1,n:"gidroksid"}, Cl:{f:"Cl",z:-1,n:"xlorid"}, Br:{f:"Br",z:-1,n:"bromid"}, I:{f:"I",z:-1,n:"yodid"},
  NO3:{f:"NO3",z:-1,n:"nitrat"}, SO4:{f:"SO4",z:-2,n:"sulfat"},
  SO3:{f:"SO3",z:-2,n:"sulfit",kb:1.6e-7}, CO3:{f:"CO3",z:-2,n:"karbonat",kb:2.1e-4},
  HCO3:{f:"HCO3",z:-1,n:"gidrokarbonat",amph:1},
  Ac:{f:"CH3COO",z:-1,n:"atsetat",kb:5.6e-10},
  Glu:{f:"C6H11O7",z:-1,n:"glyukonat",kb:7e-11},
  MnO4:{f:"MnO4",z:-1,n:"permanganat",c:"#6a0f8e",w:9},
  MnO42:{f:"MnO4",z:-2,n:"manganat",c:"#1f9a4c",w:5},
  Cr2O7:{f:"Cr2O7",z:-2,n:"dixromat",c:"#f07f1d",w:3,ka:1e-7},
  CrO4:{f:"CrO4",z:-2,n:"xromat",c:"#f2cf1d",w:3,kb:3e-8},
  SCN:{f:"SCN",z:-1,n:"rodanid"},
  AlOH4:{f:"[Al(OH)4]",z:-1,n:"tetragidroksoalyuminat",kb:1e-3},
  ZnOH4:{f:"[Zn(OH)4]",z:-2,n:"tetragidroksosinkat",kb:1e-3}
};
// Eritmadagi neytral molekulalar (liq — suvsiz suyuqlik, np — formulasi hisoblanmaydi)
const MOLS={
  CH3COOH:{f:"CH3COOH",n:"sirka kislota",ka:1.8e-5,smell:"sirka hidi"},
  NH3:{f:"NH3",n:"ammiak (erigan)",kb:1.8e-5,smell:"o'tkir ammiak hidi"},
  CO2aq:{f:"CO2",n:"erigan karbonat angidrid",ka:4.3e-7},
  H2O2:{f:"H2O2",n:"vodorod peroksid"},
  C2H5OH:{f:"C2H5OH",n:"etil spirti",liq:1,smell:"spirt hidi"},
  CH3CHO:{f:"CH3CHO",n:"etanal (sirka aldegidi)",smell:"o'tkir olma hidi"},
  CH3COOC2H5:{f:"CH3COOC2H5",n:"etilatsetat (murakkab efir)",liq:1,smell:"yoqimli meva hidi"},
  C6H12O6:{f:"C6H12O6",n:"glyukoza"},
  C6H12O7:{f:"C6H12O7",n:"glyukon kislota",ka:1.4e-4},
  C3H8O3:{f:"C3H8O3",n:"glitserin",liq:1},
  C6H5OH:{f:"C6H5OH",n:"fenol",ka:1e-10,smell:"o'ziga xos fenol hidi"},
  C2H5ONa:{f:"C2H5ONa",n:"natriy etilat"},
  starch:{f:"(C6H10O5)n",n:"kraxmal",np:1,c:"#f1f1ea",w:.25},
  starchI:{f:"yod-kraxmal",n:"yod-kraxmal kompleksi",np:1,c:"#172088",w:20},
  protein:{f:"oqsil",n:"oqsil (tuxum oqi)",np:1,c:"#f2ecd6",w:.25},
  biuret:{f:"biuret",n:"biuret kompleksi",np:1,c:"#7d3aa8",w:8},
  I2:{f:"I2",n:"yod",c:"#a2501e",w:7},
  Br2:{f:"Br2",n:"brom",c:"#d9901a",w:3},
  FeSCN3:{f:"Fe(SCN)3",n:"temir(III) rodanid",c:"#9c0f1c",w:9,cx:1},
  CuGly:{f:"Cu(C3H7O3)2",n:"mis(II) glitserati",c:"#1f55e0",w:5,cx:1}
};
// kind: piece (bo'lak), powder (kukun), ppt (cho'kma), dep (metall qatlami), mirror (kumush ko'zgu), res (kristall qoldiq)
const SOLIDS={
  mZn:{f:"Zn",n:"rux granulasi",c:"#9aa4ae",kind:"piece",shape:"granule"},
  mMg:{f:"Mg",n:"magniy lentasi",c:"#d9dde2",kind:"piece",shape:"ribbon"},
  mFe:{f:"Fe",n:"temir mix",c:"#5f646b",kind:"piece",shape:"nail"},
  mCu:{f:"Cu",n:"mis sim",c:"#c46a3c",kind:"piece",shape:"wire"},
  mAl:{f:"Al",n:"alyuminiy bo'lagi",c:"#c9cdd3",kind:"piece",shape:"granule"},
  mNa:{f:"Na",n:"natriy bo'lagi",c:"#e6e3da",kind:"piece",shape:"cube"},
  mCaCO3:{f:"CaCO3",n:"marmar bo'lakchalari",c:"#eeebe2",kind:"piece",shape:"chips"},
  MnO2:{f:"MnO2",n:"marganes(IV) oksid",c:"#2b2622",kind:"powder",d:"qo'ng'ir-qora MnO₂ cho'kmasi"},
  CuO:{f:"CuO",n:"mis(II) oksid",c:"#1c1c1c",kind:"powder",d:"qora CuO"},
  KMnO4s:{f:"KMnO4",n:"kaliy permanganat kristallari",c:"#4b0f5e",kind:"powder",dis:[["K",1],["MnO4",1]]},
  NaHCO3s:{f:"NaHCO3",n:"ichimlik sodasi (NaHCO₃)",c:"#f5f5f2",kind:"powder",dis:[["Na",1],["HCO3",1]]},
  Na2CO3s:{f:"Na2CO3",n:"natriy karbonat",c:"#fafafa",kind:"powder",dis:[["Na",2],["CO3",1]]},
  K2MnO4s:{f:"K2MnO4",n:"kaliy manganat",c:"#1f5f3a",kind:"powder",dis:[["K",2],["MnO42",1]]},
  CuOH2:{f:"Cu(OH)2",n:"mis(II) gidroksid",c:"#3c9bf6",kind:"ppt",d:"havorang iviqsimon Cu(OH)₂ cho'kmasi"},
  FeOH3:{f:"Fe(OH)3",n:"temir(III) gidroksid",c:"#8b3f17",kind:"ppt",d:"qo'ng'ir-qizil Fe(OH)₃ cho'kmasi — Fe³⁺ ga xos"},
  FeOH2:{f:"Fe(OH)2",n:"temir(II) gidroksid",c:"#c3d6a8",kind:"ppt",d:"oq-yashil Fe(OH)₂ cho'kmasi (havoda asta qo'ng'irlashadi)"},
  AlOH3:{f:"Al(OH)3",n:"alyuminiy gidroksid",c:"#f2f4f7",kind:"ppt",d:"oq iviqsimon Al(OH)₃ cho'kmasi"},
  ZnOH2:{f:"Zn(OH)2",n:"rux gidroksid",c:"#f4f4f4",kind:"ppt",d:"oq Zn(OH)₂ cho'kmasi"},
  MgOH2:{f:"Mg(OH)2",n:"magniy gidroksid",c:"#f4f4f4",kind:"ppt",d:"oq Mg(OH)₂ cho'kmasi"},
  MnOH2:{f:"Mn(OH)2",n:"marganes(II) gidroksid",c:"#efe2dc",kind:"ppt",d:"och pushti-oq Mn(OH)₂ cho'kmasi"},
  CrOH3:{f:"Cr(OH)3",n:"xrom(III) gidroksid",c:"#6f8f6a",kind:"ppt",d:"kulrang-yashil Cr(OH)₃ cho'kmasi"},
  PbOH2:{f:"Pb(OH)2",n:"qo'rg'oshin gidroksid",c:"#f3f3f3",kind:"ppt",d:"oq Pb(OH)₂ cho'kmasi"},
  Ag2O:{f:"Ag2O",n:"kumush(I) oksid",c:"#4a3a2c",kind:"ppt",d:"qo'ng'ir-qora Ag₂O cho'kmasi"},
  AgCl:{f:"AgCl",n:"kumush xlorid",c:"#fafafa",kind:"ppt",d:"oq suzmasimon AgCl cho'kmasi — Cl⁻ ioniga sifat reaksiyasi"},
  AgBr:{f:"AgBr",n:"kumush bromid",c:"#efe6a6",kind:"ppt",d:"och sariq AgBr cho'kmasi — Br⁻ ioniga sifat reaksiyasi"},
  AgI:{f:"AgI",n:"kumush yodid",c:"#f1d548",kind:"ppt",d:"sariq AgI cho'kmasi — I⁻ ioniga sifat reaksiyasi"},
  PbCl2:{f:"PbCl2",n:"qo'rg'oshin xlorid",c:"#f7f7f7",kind:"ppt",d:"oq kristall PbCl₂ cho'kmasi"},
  PbBr2:{f:"PbBr2",n:"qo'rg'oshin bromid",c:"#f7f6ee",kind:"ppt",d:"oq PbBr₂ cho'kmasi"},
  PbI2:{f:"PbI2",n:"qo'rg'oshin yodid",c:"#ffd21f",kind:"ppt",d:"yorqin sariq PbI₂ cho'kmasi («oltin yomg'ir»)"},
  BaSO4:{f:"BaSO4",n:"bariy sulfat",c:"#ffffff",kind:"ppt",d:"oq kristall BaSO₄ cho'kmasi — SO₄²⁻ ioniga sifat reaksiyasi (kislotalarda erimaydi)"},
  PbSO4:{f:"PbSO4",n:"qo'rg'oshin sulfat",c:"#f6f6f6",kind:"ppt",d:"oq PbSO₄ cho'kmasi"},
  CaSO4:{f:"CaSO4",n:"kalsiy sulfat",c:"#f6f6f6",kind:"ppt",d:"oq CaSO₄ cho'kmasi (kam eriydi)"},
  BaSO3:{f:"BaSO3",n:"bariy sulfit",c:"#fbfbfb",kind:"ppt",d:"oq BaSO₃ cho'kmasi (kislotada eriydi)"},
  CaSO3:{f:"CaSO3",n:"kalsiy sulfit",c:"#fbfbfb",kind:"ppt",d:"oq CaSO₃ cho'kmasi"},
  Ag2SO3:{f:"Ag2SO3",n:"kumush sulfit",c:"#f4f4f4",kind:"ppt",d:"oq Ag₂SO₃ cho'kmasi"},
  PbSO3:{f:"PbSO3",n:"qo'rg'oshin sulfit",c:"#f4f4f4",kind:"ppt",d:"oq PbSO₃ cho'kmasi"},
  CaCO3:{f:"CaCO3",n:"kalsiy karbonat",c:"#f7f7f7",kind:"ppt",d:"oq CaCO₃ cho'kmasi (eritma loyqalanadi)"},
  BaCO3:{f:"BaCO3",n:"bariy karbonat",c:"#fbfbfb",kind:"ppt",d:"oq BaCO₃ cho'kmasi (kislotada CO₂ ajratib eriydi)"},
  MgCO3:{f:"MgCO3",n:"magniy karbonat",c:"#f7f7f7",kind:"ppt",d:"oq MgCO₃ cho'kmasi"},
  ZnCO3:{f:"ZnCO3",n:"rux karbonat",c:"#f7f7f7",kind:"ppt",d:"oq ZnCO₃ cho'kmasi"},
  PbCO3:{f:"PbCO3",n:"qo'rg'oshin karbonat",c:"#f7f7f7",kind:"ppt",d:"oq PbCO₃ cho'kmasi"},
  Ag2CO3:{f:"Ag2CO3",n:"kumush karbonat",c:"#efe9c8",kind:"ppt",d:"och sariq Ag₂CO₃ cho'kmasi"},
  FeCO3:{f:"FeCO3",n:"temir(II) karbonat",c:"#d9e3c9",kind:"ppt",d:"oq-yashil FeCO₃ cho'kmasi"},
  CuOH2CO3:{f:"(CuOH)2CO3",n:"mis(II) gidroksokarbonat (malaxit)",c:"#3fb39a",kind:"ppt",d:"yashil-havorang (CuOH)₂CO₃ cho'kmasi (malaxit) va CO₂ ajraladi"},
  BaCrO4:{f:"BaCrO4",n:"bariy xromat",c:"#f2d33a",kind:"ppt",d:"sariq BaCrO₄ cho'kmasi"},
  PbCrO4:{f:"PbCrO4",n:"qo'rg'oshin xromat",c:"#f7c21a",kind:"ppt",d:"sariq PbCrO₄ cho'kmasi («xrom sariq» pigmenti)"},
  Ag2CrO4:{f:"Ag2CrO4",n:"kumush xromat",c:"#b5442b",kind:"ppt",d:"g'isht-qizil Ag₂CrO₄ cho'kmasi"},
  CuI:{f:"CuI",n:"mis(I) yodid",c:"#f1ede4",kind:"ppt",d:"oq CuI cho'kmasi (eritma yod hisobiga qo'ng'ir)"},
  Cu2O:{f:"Cu2O",n:"mis(I) oksid",c:"#b8361a",kind:"ppt",d:"g'isht-qizil Cu₂O cho'kmasi"},
  Fe2O3:{f:"Fe2O3",n:"temir(III) oksid",c:"#8a2f12",kind:"powder",d:"qizil-qo'ng'ir Fe₂O₃"},
  C6H2Br3OH:{f:"C6H2Br3OH",n:"2,4,6-tribromfenol",c:"#fbfbf6",kind:"ppt",d:"oq 2,4,6-tribromfenol cho'kmasi"},
  proteinC:{f:"oqsil",np:1,n:"ivigan oqsil",c:"#f7f5ef",kind:"ppt",d:"oq parchalar — oqsil ividi (denaturatsiya)"},
  dCu:{f:"Cu",n:"mis qatlami",c:"#c0602d",kind:"dep",d:"qizil mis qatlami"},
  dAg:{f:"Ag",n:"kumush kristallari",c:"#c8ccd4",kind:"dep",d:"kumushrang kristallar"},
  dPb:{f:"Pb",n:"qo'rg'oshin kristallari",c:"#7f8791",kind:"dep",d:"kulrang qo'rg'oshin kristallari («qo'rg'oshin daraxti»)"},
  dZn:{f:"Zn",n:"rux qatlami",c:"#9aa4ae",kind:"dep",d:"kulrang rux qatlami"},
  dFe:{f:"Fe",n:"temir qatlami",c:"#3b3f45",kind:"dep",d:"qora temir qatlami"},
  mirAg:{f:"Ag",n:"kumush ko'zgu",c:"#dfe3e8",kind:"mirror",d:"idish devorida yaltiroq kumush ko'zgu"},
  phAg:{f:"Ag",n:"mayda kumush",c:"#5c5566",kind:"ppt",d:"cho'kma qoraydi (mayda kumush)"},
  res:{f:"tuz",np:1,n:"tuz kristallari",c:"#f4f4f4",kind:"res",d:"idish tubida tuz kristallari"},
  Mn2O3:{f:"Mn2O3",n:"marganes(III) oksid",c:"#3a2418",kind:"powder",d:"qo'ng'ir-qora kul"},
  K2CO3s:{f:"K2CO3",n:"kaliy karbonat",c:"#efefef",kind:"powder",dis:[["K",2],["CO3",1]]}
};
// cho'kmaning tashqi ko'rinishi: gel — iviqsimon, curd — suzmasimon, cryst — mayda kristall, glitter — yaltiroq tangachalar
const FORMS={gel:"CuOH2 FeOH3 FeOH2 AlOH3 ZnOH2 MgOH2 MnOH2 CrOH3 PbOH2",curd:"AgCl AgBr AgI",glitter:"PbI2",flake:"proteinC C6H2Br3OH",
  powder:"MnO2 CuO Fe2O3 KMnO4s NaHCO3s Na2CO3s K2MnO4s phAg res Mn2O3 K2CO3s Ag2O",metal:"dCu dAg dPb dZn dFe"};
Object.entries(FORMS).forEach(([f,ids])=>ids.split(" ").forEach(id=>{if(SOLIDS[id])SOLIDS[id].form=f;}));
Object.values(SOLIDS).forEach(x=>{if(!x.form&&x.kind==="ppt")x.form="cryst";});
KL.FORM_NAME={gel:"iviqsimon (gelsimon)",curd:"suzmasimon (parcha-parcha)",cryst:"mayda kristall (sutsimon loyqa)",glitter:"yaltiroq kristall tangachalar",flake:"oq parchalar",powder:"kukunsimon",metal:"metall qatlami"};
const GASES={
  H2:{f:"H2",n:"vodorod",note:"Yonuvchi gaz: yonib turgan cho'p yaqinlashtirilsa «pang» etib yonadi."},
  O2:{f:"O2",n:"kislorod",note:"Cho'g'langan cho'p kislorodda alangalanib ketadi."},
  CO2:{f:"CO2",n:"karbonat angidrid",note:"Yonayotgan cho'p o'chadi, gaz ohakli suvni loyqalatadi."},
  Cl2:{f:"Cl2",n:"xlor",c:"#cfe65a",tox:1,smell:"xlorning o'tkir, bo'g'uvchi hidi",note:"Sarg'ish-yashil, o'tkir hidli zaharli gaz (mo'rili shkafda ishlang!)."},
  NH3g:{f:"NH3",n:"ammiak",tox:.5,smell:"o'tkir ammiak hidi",note:"O'tkir hidli gaz, ho'l qizil lakmus qog'ozini ko'k qiladi."},
  SO2:{f:"SO2",n:"oltingugurt(IV) oksid",tox:1,smell:"yongan gugurtning o'tkir, bo'g'uvchi hidi",note:"O'tkir, bo'g'uvchi hidli gaz."},
  NO:{f:"NO",n:"azot(II) oksid",c:"#b5541c",tox:1.5,smell:"NO₂ ning o'tkir hidi",note:"Rangsiz gaz, havoda tezda qo'ng'ir NO₂ ga aylanadi."}
};
const IND={php:{n:"fenolftalein"},lit:{n:"lakmus"},mo:{n:"metiloranj"},uni:{n:"universal indikator"}};
const hex=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
const toHex=c=>"#"+c.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
const mix=(a,b,t)=>toHex(hex(a).map((v,i)=>v+(hex(b)[i]-v)*t));
KL.hex=hex;KL.toHex=toHex;KL.mixCol=mix;
function grad(stops,x){if(x<=stops[0][0])return stops[0][1];for(let i=1;i<stops.length;i++)if(x<=stops[i][0]){const[a,ca]=stops[i-1],[b,cb]=stops[i];return mix(ca,cb,(x-a)/(b-a));}return stops[stops.length-1][1];}
// Indikator rangi (null — rangsiz)
KL.indColor=function(id,pH){
  if(pH==null)return null;
  if(id==="php"){if(pH<8.2)return null;return pH<10?mix("#ffc4e1","#e0157a",(pH-8.2)/1.8):"#d6006f";}
  if(id==="lit")return grad([[4.5,"#d8323b"],[6.5,"#8e44ad"],[8.3,"#2f5fd0"]],pH);
  if(id==="mo")return grad([[3.1,"#e8364a"],[3.8,"#f28c28"],[4.4,"#f2c81b"]],pH);
  if(id==="uni")return grad([[1,"#d7263d"],[3,"#f46036"],[5,"#f2c14e"],[7,"#2fb344"],[9,"#1b98e0"],[11,"#3f4fd6"],[13,"#6a2c91"]],pH);
  return null;
};
// Ion formulasi HTML: Cu²⁺, SO₄²⁻
KL.ionHTML=id=>{const p=IONS[id];const z=Math.abs(p.z);return KL.fmt(p.f)+`<sup>${z>1?z:""}${p.z>0?"+":"−"}</sup>`;};
KL.ionUni=id=>{const p=IONS[id];const z=Math.abs(p.z);return KL.uni(p.f)+KL.uniSup((z>1?z:"")+(p.z>0?"+":"-"));};
// Kation va anion ionlaridan tuz formulasi: (Na,SO4) -> Na2SO4, (Al,SO4) -> Al2(SO4)3
KL.saltFormula=function(c,a){
  const C=IONS[c],A=IONS[a];
  if(c==="H"&&a==="Ac")return"CH3COOH";
  const zc=C.z,za=-A.z,g=KL.gcd(zc,za),nc=za/g,na=zc/g;
  const poly=f=>/[A-Z].*[A-Z]|\d/.test(f.replace(/^\[.*\]$/,"X"))||/^\[/.test(f);
  const wrap=(f,n)=>n===1?f:(f.startsWith("[")?f+n:poly(f)?`(${f})${n}`:f+n);
  if(a==="Ac"&&zc===1&&!C.f.startsWith("["))return"CH3COO"+C.f;
  return wrap(C.f,nc)+wrap(A.f,na);
};
KL.IONS=IONS;KL.MOLS=MOLS;KL.SOLIDS=SOLIDS;KL.GASES=GASES;KL.IND=IND;

// Javon: k — tur (sol: 0,1 M eritma, liq: suyuqlik, piece/powder: qattiq, drop: indikator, gas, water)
// g — guruh, b — shisha rangi
const S=(id,f,n,k,o)=>Object.assign({id,f,n,k},o);
const SHELF=[
  S("HCl","HCl","Xlorid kislota","sol",{ions:[["H",1],["Cl",1]],g:"acid",hz:"o'yuvchi"}),
  S("H2SO4","H2SO4","Sulfat kislota (suyult.)","sol",{ions:[["H",2],["SO4",1]],g:"acid",hz:"o'yuvchi"}),
  S("HNO3","HNO3","Nitrat kislota (suyult.)","sol",{ions:[["H",1],["NO3",1]],g:"acid",hz:"o'yuvchi"}),
  S("CH3COOH","CH3COOH","Sirka kislota","sol",{mol:[["CH3COOH",1]],g:"acid"}),
  S("NaOH","NaOH","Natriy gidroksid","sol",{ions:[["Na",1],["OH",1]],g:"base",hz:"o'yuvchi"}),
  S("KOH","KOH","Kaliy gidroksid","sol",{ions:[["K",1],["OH",1]],g:"base",hz:"o'yuvchi"}),
  S("CaOH2","Ca(OH)2","Ohakli suv","sol",{ions:[["Ca",1],["OH",2]],g:"base"}),
  S("NH3","NH3","Ammiakli suv","sol",{mol:[["NH3",1]],g:"base",hz:"o'tkir hidli"}),
  S("NaCl","NaCl","Natriy xlorid","sol",{ions:[["Na",1],["Cl",1]],g:"salt"}),
  S("KBr","KBr","Kaliy bromid","sol",{ions:[["K",1],["Br",1]],g:"salt"}),
  S("KI","KI","Kaliy yodid","sol",{ions:[["K",1],["I",1]],g:"salt"}),
  S("Na2SO4","Na2SO4","Natriy sulfat","sol",{ions:[["Na",2],["SO4",1]],g:"salt"}),
  S("Na2CO3","Na2CO3","Natriy karbonat","sol",{ions:[["Na",2],["CO3",1]],g:"salt"}),
  S("Na2SO3","Na2SO3","Natriy sulfit","sol",{ions:[["Na",2],["SO3",1]],g:"salt"}),
  S("CH3COONa","CH3COONa","Natriy atsetat","sol",{ions:[["Na",1],["Ac",1]],g:"salt"}),
  S("NH4Cl","NH4Cl","Ammoniy xlorid","sol",{ions:[["NH4",1],["Cl",1]],g:"salt"}),
  S("CuSO4","CuSO4","Mis(II) sulfat","sol",{ions:[["Cu",1],["SO4",1]],g:"salt",b:"#2f86f6"}),
  S("CuCl2","CuCl2","Mis(II) xlorid","sol",{ions:[["Cu",1],["Cl",2]],g:"salt",b:"#2fa6b8"}),
  S("FeCl3","FeCl3","Temir(III) xlorid","sol",{ions:[["Fe3",1],["Cl",3]],g:"salt",b:"#dba030"}),
  S("FeSO4","FeSO4","Temir(II) sulfat","sol",{ions:[["Fe2",1],["SO4",1]],g:"salt",b:"#a6d79a"}),
  S("ZnCl2","ZnCl2","Rux xlorid","sol",{ions:[["Zn",1],["Cl",2]],g:"salt"}),
  S("AlCl3","AlCl3","Alyuminiy xlorid","sol",{ions:[["Al",1],["Cl",3]],g:"salt"}),
  S("MgCl2","MgCl2","Magniy xlorid","sol",{ions:[["Mg",1],["Cl",2]],g:"salt"}),
  S("CaCl2","CaCl2","Kalsiy xlorid","sol",{ions:[["Ca",1],["Cl",2]],g:"salt"}),
  S("BaCl2","BaCl2","Bariy xlorid","sol",{ions:[["Ba",1],["Cl",2]],g:"salt",hz:"zaharli"}),
  S("AgNO3","AgNO3","Kumush nitrat","sol",{ions:[["Ag",1],["NO3",1]],g:"salt"}),
  S("PbNO32","Pb(NO3)2","Qo'rg'oshin(II) nitrat","sol",{ions:[["Pb",1],["NO3",2]],g:"salt",hz:"zaharli"}),
  S("KSCN","KSCN","Kaliy rodanid","sol",{ions:[["K",1],["SCN",1]],g:"salt"}),
  S("KMnO4","KMnO4","Kaliy permanganat","sol",{ions:[["K",1],["MnO4",1]],g:"salt",b:"#8e1fb0"}),
  S("K2Cr2O7","K2Cr2O7","Kaliy dixromat","sol",{ions:[["K",2],["Cr2O7",1]],g:"salt",b:"#f07f1d",hz:"zaharli"}),
  S("mZn","Zn","Rux granulalari","piece",{solid:"mZn",g:"solid"}),
  S("mMg","Mg","Magniy lentasi","piece",{solid:"mMg",g:"solid"}),
  S("mFe","Fe","Temir mix","piece",{solid:"mFe",g:"solid"}),
  S("mCu","Cu","Mis sim","piece",{solid:"mCu",g:"solid"}),
  S("mAl","Al","Alyuminiy","piece",{solid:"mAl",g:"solid"}),
  S("mNa","Na","Natriy (kerosin ostida)","piece",{solid:"mNa",g:"solid",hz:"suv bilan shiddatli"}),
  S("mCaCO3","CaCO3","Marmar (CaCO₃)","piece",{solid:"mCaCO3",g:"solid"}),
  S("MnO2","MnO2","Marganes(IV) oksid","powder",{solid:"MnO2",g:"solid"}),
  S("CuO","CuO","Mis(II) oksid","powder",{solid:"CuO",g:"solid"}),
  S("KMnO4s","KMnO4","KMnO₄ kristallari","powder",{solid:"KMnO4s",g:"solid"}),
  S("NaHCO3s","NaHCO3","Ichimlik sodasi","powder",{solid:"NaHCO3s",g:"solid"}),
  S("CO2","CO2","CO₂ (Kipp apparati)","gas",{g:"solid"}),
  S("C2H5OH","C2H5OH","Etil spirti","liq",{mol:[["C2H5OH",1]],g:"org",hz:"yonuvchan"}),
  S("CH3CHO","CH3CHO","Etanal eritmasi","sol",{mol:[["CH3CHO",1]],g:"org"}),
  S("C6H12O6","C6H12O6","Glyukoza eritmasi","sol",{mol:[["C6H12O6",1]],g:"org"}),
  S("C3H8O3","C3H8O3","Glitserin","liq",{mol:[["C3H8O3",1]],g:"org"}),
  S("C6H5OH","C6H5OH","Fenol eritmasi","sol",{mol:[["C6H5OH",1]],g:"org",hz:"zaharli"}),
  S("starch","(C6H10O5)n","Kraxmal kleysteri","sol",{mol:[["starch",1]],g:"org"}),
  S("protein","oqsil","Oqsil (tuxum oqi)","sol",{mol:[["protein",1]],g:"org"}),
  S("tollens","[Ag(NH3)2]OH","Kumush oksidning ammiakli eritmasi","sol",{ions:[["AgNH3",1],["OH",1]],g:"org"}),
  S("Br2","Br2","Bromli suv","sol",{mol:[["Br2",1]],g:"org",b:"#d9901a",hz:"zaharli"}),
  S("I2","I2","Yodli suv","sol",{mol:[["I2",1]],g:"org",b:"#a2501e"}),
  S("H2O2","H2O2","Vodorod peroksid (3%)","sol",{mol:[["H2O2",1]],g:"org"}),
  S("php","php","Fenolftalein","drop",{ind:"php",g:"ind"}),
  S("lit","lakmus","Lakmus","drop",{ind:"lit",g:"ind",b:"#8e44ad"}),
  S("mo","m/o","Metiloranj","drop",{ind:"mo",g:"ind",b:"#f28c28"}),
  S("uni","univ.","Universal indikator","drop",{ind:"uni",g:"ind",b:"#2fb344"}),
  S("H2O","H2O","Distillangan suv","water",{g:"ind"})
];
KL.SHELF=SHELF;KL.SHELF_BY_ID=Object.fromEntries(SHELF.map(s=>[s.id,s]));
KL.SHELF_GROUPS=[["acid","Kislotalar"],["base","Ishqorlar"],["salt","Tuzlar"],["solid","Metallar va qattiq moddalar"],["org","Organik va boshqa moddalar"],["ind","Indikatorlar va suv"]];
KL.formulaOf=id=>id==="H2O"?"H2O":id==="O2air"?"O2":(IONS[id]||MOLS[id]||SOLIDS[id]||GASES[id]).f;
KL.nameOf=id=>id==="H2O"?"suv":id==="O2air"?"havo kislorodi":IONS[id]?IONS[id].n+" ioni":(MOLS[id]||SOLIDS[id]||GASES[id]).n;
})(globalThis.KL=globalThis.KL||{});
