// KimyoLab — reaksiya qoidalari (qisqa ionli tenglamalar ko'rinishida). Tartib = ustuvorlik.
// sp: fast (bir zumda) | mid | slow | vslow;  need: {heat:T, cold:T, dry, water, nowater, uv, air};  cat: katalizatorlar
(function(KL){
"use strict";
const RULES=[];
const R=(id,l,r,o={})=>{RULES.push(Object.assign({id,l,r},o));};
const S=KL.SOLIDS;

/* --- 1. Maxsus sifat reaksiyalari --- */
R("c_lime","Ca + 2OH + CO2aq","CaCO3 + H2O",{t:"Sifat reaksiyasi",obs:"Ohakli suv loyqalandi — CO₂ ga sifat reaksiyasi."});
R("q_FeSCN","Fe3 + 3SCN","FeSCN3",{t:"Sifat reaksiyasi",obs:"Qon-qizil rang paydo bo'ldi — Fe³⁺ ioniga sifat reaksiyasi."});
R("o_starchI","starch + I2","starchI",{t:"Sifat reaksiyasi",need:{cold:55},molText:"kraxmal + I₂ → yod-kraxmal kompleksi",
  obs:"To'q ko'k rang paydo bo'ldi — yod va kraxmalga sifat reaksiyasi."});

/* --- 2. Kislota-asos --- */
R("n_HOH","H + OH","H2O",{t:"Neytrallanish",exo:6,obs:"Neytrallanish: H⁺ va OH⁻ ionlari suv hosil qildi, eritma biroz isidi."});
R("n_HNH3","H + NH3","NH4",{t:"Neytrallanish",exo:4,obs:"Ammiak kislotani neytrallab, ammoniy tuzi hosil qildi."});
R("n_AcOH","CH3COOH + OH","Ac + H2O",{t:"Neytrallanish",exo:4,obs:"Kuchsiz sirka kislota ishqor bilan neytrallandi."});
R("n_AcNH3","CH3COOH + NH3","Ac + NH4",{t:"Neytrallanish",exo:3,obs:"Sirka kislota va ammiak ammoniy atsetat hosil qildi."});
R("n_GluOH","C6H12O7 + OH","Glu + H2O",{t:"Neytrallanish",hidden:1});
R("w_HAc","H + Ac","CH3COOH",{t:"Kuchsiz elektrolit hosil bo'lishi",obs:"Kuchli kislota atsetatdan kuchsiz sirka kislotani siqib chiqardi — sirka hidi seziladi."});
R("w_NH4OH","NH4 + OH","NH3 + H2O",{t:"Kuchsiz elektrolit hosil bo'lishi",obs:"Ammoniy tuziga ishqor ta'sir etib ammiak hosil bo'ldi (qizdirilsa gaz holida ajraladi)."});
R("w_CO2OH","CO2aq + 2OH","CO3 + H2O",{t:"Kislotali oksid + ishqor",obs:"CO₂ ishqorga yutilib, karbonat hosil bo'ldi."});
R("w_OHHCO3","OH + HCO3","CO3 + H2O",{t:"Neytrallanish",obs:"Nordon tuz ishqor ta'sirida o'rta tuzga (karbonatga) aylandi."});

/* --- 6. Oksidlanish-qaytarilish (eritmada) --- */
const OQ="Oksidlanish-qaytarilish";
R("r_MnSO3a","2MnO4 + 5SO3 + 6H","2Mn + 5SO4 + 3H2O",{t:OQ,obs:"Kislotali muhitda binafsha rang yo'qoldi: Mn⁺⁷ → Mn⁺² (deyarli rangsiz)."});
R("r_MnSO3b","2MnO4 + SO3 + 2OH","2MnO42 + SO4 + H2O",{t:OQ,obs:"Ishqoriy muhitda eritma yashil rangga kirdi: Mn⁺⁷ → Mn⁺⁶ (MnO₄²⁻)."});
R("r_MnSO3n","2MnO4 + 3SO3 + H2O","2MnO2 + 3SO4 + 2OH",{t:OQ,obs:"Neytral muhitda qo'ng'ir MnO₂ cho'kmasi tushdi: Mn⁺⁷ → Mn⁺⁴."});
R("r_MnFe","MnO4 + 5Fe2 + 8H","Mn + 5Fe3 + 4H2O",{t:OQ,obs:"Permanganat rangsizlandi, eritma sarg'aydi: Fe²⁺ → Fe³⁺."});
R("r_MnI","2MnO4 + 10I + 16H","2Mn + 5I2 + 8H2O",{t:OQ,obs:"Binafsha rang yo'qolib, yod hisobiga qo'ng'ir rang paydo bo'ldi."});
R("r_CrSO3","Cr2O7 + 3SO3 + 8H","2Cr + 3SO4 + 4H2O",{t:OQ,obs:"Zarg'aldoq rang yashilga o'tdi: Cr⁺⁶ → Cr⁺³."});
R("r_CrFe","Cr2O7 + 6Fe2 + 14H","2Cr + 6Fe3 + 7H2O",{t:OQ,obs:"Zarg'aldoq eritma yashil-sariq tusga kirdi: Fe²⁺ oksidlandi."});
R("r_CrI","Cr2O7 + 6I + 14H","2Cr + 3I2 + 7H2O",{t:OQ,obs:"Eritma yod hisobiga qo'ng'irlashdi, Cr⁺⁶ → Cr⁺³."});
R("r_Cr2CrO4","Cr2O7 + 2OH","2CrO4 + H2O",{t:"Muvozanatning siljishi",obs:"Ishqor ta'sirida zarg'aldoq dixromat sariq xromatga aylandi."});
R("r_CrO4Cr2","2CrO4 + 2H","Cr2O7 + H2O",{t:"Muvozanatning siljishi",obs:"Kislota ta'sirida sariq xromat yana zarg'aldoq dixromatga aylandi."});
R("r_FeI","2Fe3 + 2I","2Fe2 + I2",{t:OQ,obs:"Eritma yod hisobiga qo'ng'ir tusga kirdi: Fe³⁺ → Fe²⁺."});
R("r_CuI","2Cu + 4I","2CuI + I2",{t:OQ,obs:"Oq CuI cho'kmasi tushdi, eritma ajralgan yoddan qo'ng'irlashdi."});
R("r_BrI","Br2 + 2I","2Br + I2",{t:OQ,obs:"Brom yodni tuzidan siqib chiqardi — eritma qo'ng'irlashdi."});
R("r_MnH2O2","2MnO4 + 5H2O2 + 6H","2Mn + 5O2 + 8H2O",{sp:"mid",t:OQ,obs:"Permanganat rangsizlanmoqda, kislorod pufakchalari ajralmoqda."});
R("r_H2O2I","H2O2 + 2I + 2H","I2 + 2H2O",{sp:"mid",t:OQ,obs:"Eritma asta qo'ng'irlashmoqda — yod ajralmoqda."});
R("r_CrEtOH","Cr2O7 + 3C2H5OH + 8H","2Cr + 3CH3CHO + 7H2O",{sp:"slow",t:OQ,obs:"Zarg'aldoq eritma yashillanmoqda, olma hidi (etanal) seziladi — spirt oksidlandi."});

/* --- 3. Gaz ajralishi --- */
R("g_CO3","2H + CO3","CO2 + H2O",{t:"Gaz ajralishi",exo:2,obs:"Shiddatli ko'piklanish — CO₂ gazi ajraldi."});
R("g_HCO3","H + HCO3","CO2 + H2O",{t:"Gaz ajralishi",obs:"Ko'piklanish — CO₂ gazi ajraldi."});
R("g_SO3","2H + SO3","SO2 + H2O",{t:"Gaz ajralishi",obs:"O'tkir hidli SO₂ gazi ajraldi."});
R("g_CO3ac","2CH3COOH + CO3","2Ac + CO2 + H2O",{sp:"mid",t:"Gaz ajralishi",obs:"Sirka kislota ta'sirida CO₂ ajralmoqda."});
R("g_HCO3ac","CH3COOH + HCO3","Ac + CO2 + H2O",{sp:"mid",t:"Gaz ajralishi",obs:"Ko'piklanish — CO₂ ajralmoqda («so'ndirilgan soda»)."});

/* --- 4. Birgalikdagi gidroliz --- */
R("jh_Al","2Al + 3CO3 + 3H2O","2AlOH3 + 3CO2",{t:"Birgalikdagi gidroliz",obs:"Oq Al(OH)₃ cho'kmasi tushib, CO₂ ajraldi — Al₂(CO₃)₃ suvda mavjud emas (birgalikdagi gidroliz)."});
R("jh_Fe3","2Fe3 + 3CO3 + 3H2O","2FeOH3 + 3CO2",{t:"Birgalikdagi gidroliz",obs:"Qo'ng'ir Fe(OH)₃ cho'kmasi tushib, CO₂ ajraldi — birgalikdagi gidroliz."});
R("jh_Cr","2Cr + 3CO3 + 3H2O","2CrOH3 + 3CO2",{t:"Birgalikdagi gidroliz",obs:"Kulrang-yashil Cr(OH)₃ cho'kmasi va CO₂ — birgalikdagi gidroliz."});
R("jh_AlHCO3","Al + 3HCO3","AlOH3 + 3CO2",{t:"Birgalikdagi gidroliz",obs:"Ko'piklanish va oq cho'kma — ko'pikli o't o'chirgich shu asosda ishlaydi."});
R("p_Cu_CO3","2Cu + 2CO3 + H2O","CuOH2CO3 + CO2",{t:"Ion almashinish",obs:S.CuOH2CO3.d+"."});

/* --- 5. Cho'kma hosil bo'lishi (eruvchanlik jadvali bo'yicha) --- */
const PPT=[["Mg","OH","MgOH2",1,2],["Zn","OH","ZnOH2",1,2],["Al","OH","AlOH3",1,3],["Cu","OH","CuOH2",1,2],["Fe2","OH","FeOH2",1,2],["Fe3","OH","FeOH3",1,3],
 ["Pb","OH","PbOH2",1,2],["Mn","OH","MnOH2",1,2],["Cr","OH","CrOH3",1,3],
 ["Ag","Cl","AgCl",1,1],["Ag","Br","AgBr",1,1],["Ag","I","AgI",1,1],["Pb","Cl","PbCl2",1,2],["Pb","Br","PbBr2",1,2],["Pb","I","PbI2",1,2],
 ["Ba","SO4","BaSO4",1,1],["Pb","SO4","PbSO4",1,1],["Ca","SO4","CaSO4",1,1],
 ["Ba","SO3","BaSO3",1,1],["Ca","SO3","CaSO3",1,1],["Ag","SO3","Ag2SO3",2,1],["Pb","SO3","PbSO3",1,1],
 ["Ca","CO3","CaCO3",1,1],["Ba","CO3","BaCO3",1,1],["Mg","CO3","MgCO3",1,1],["Zn","CO3","ZnCO3",1,1],["Pb","CO3","PbCO3",1,1],["Ag","CO3","Ag2CO3",2,1],["Fe2","CO3","FeCO3",1,1],
 ["Ba","CrO4","BaCrO4",1,1],["Pb","CrO4","PbCrO4",1,1],["Ag","CrO4","Ag2CrO4",2,1]];
const co=n=>n===1?"":n;
PPT.forEach(([c,a,s,nc,na])=>R(`p_${c}_${a}`,`${co(nc)}${c} + ${co(na)}${a}`,s,{t:"Ion almashinish",obs:S[s].d+" tushdi."}));
R("p_Ag_OH","2Ag + 2OH","Ag2O + H2O",{t:"Ion almashinish",obs:"Qo'ng'ir-qora Ag₂O cho'kmasi tushdi (AgOH beqaror, darhol parchalanadi)."});
// ammiakli suv bilan gidroksidlar
[["Mg","MgOH2",2],["Zn","ZnOH2",2],["Al","AlOH3",3],["Cu","CuOH2",2],["Fe2","FeOH2",2],["Fe3","FeOH3",3],["Pb","PbOH2",2],["Mn","MnOH2",2],["Cr","CrOH3",3]]
 .forEach(([c,s,n])=>R(`pa_${c}`,`${c} + ${n}NH3 + ${n}H2O`,`${s} + ${n}NH4`,{t:"Ion almashinish",obs:S[s].d+" tushdi (ammiakli suv ta'sirida)."}));
R("pa_Ag","2Ag + 2NH3 + H2O","Ag2O + 2NH4",{t:"Ion almashinish",obs:"Qo'ng'ir Ag₂O cho'kmasi tushdi (ortiqcha ammiakda eriydi)."});

/* --- 7. Organik sifat reaksiyalari --- */
R("o_phenolBr","C6H5OH + 3Br2","C6H2Br3OH + 3H + 3Br",{t:"Sifat reaksiyasi",obs:"Bromli suv rangsizlanib, oq 2,4,6-tribromfenol cho'kmasi tushdi — fenolga sifat reaksiyasi."});
R("o_glyCu","CuOH2 + 2C3H8O3","CuGly + 2H2O",{sp:"mid",t:"Sifat reaksiyasi",obs:"Ko'k cho'kma erib, yorqin ko'k eritma hosil bo'ldi — ko'p atomli spirtlarga sifat reaksiyasi."});
R("o_protCu","protein + CuOH2","biuret",{sp:"mid",t:"Biuret reaksiyasi",molText:"oqsil + Cu(OH)₂ → biuret kompleksi",obs:"Binafsha rang paydo bo'ldi — oqsilga sifat (biuret) reaksiyasi."});

/* --- 8. Amfoterlik va komplekslar --- */
R("a_AlOH","AlOH3 + OH","AlOH4",{sp:"mid",t:"Amfoterlik",obs:"Oq cho'kma ortiqcha ishqorda erib ketdi — Al(OH)₃ amfoter gidroksid."});
R("a_ZnOH","ZnOH2 + 2OH","ZnOH4",{sp:"mid",t:"Amfoterlik",obs:"Oq cho'kma ortiqcha ishqorda erib ketdi — Zn(OH)₂ amfoter gidroksid."});
R("a_AlOH4H","AlOH4 + H","AlOH3 + H2O",{t:"Amfoterlik",obs:"Kislota qo'shilganda oq Al(OH)₃ yana cho'kdi."});
R("a_ZnOH4H","ZnOH4 + 2H","ZnOH2 + 2H2O",{t:"Amfoterlik",obs:"Kislota qo'shilganda oq Zn(OH)₂ yana cho'kdi."});
R("k_CuNH3","CuOH2 + 4NH3","CuNH3 + 2OH",{sp:"mid",t:"Kompleks hosil bo'lishi",obs:"Cho'kma ortiqcha ammiakda erib, to'q ko'k [Cu(NH₃)₄]²⁺ eritmasi hosil bo'ldi."});
R("k_CuNH3H","CuNH3 + 4H","Cu + 4NH4",{t:"Kompleksning parchalanishi",obs:"Kislota ta'sirida kompleks parchalandi — eritma havorangga qaytdi."});
R("k_AgClNH3","AgCl + 2NH3","AgNH3 + Cl",{sp:"mid",t:"Kompleks hosil bo'lishi",obs:"AgCl cho'kmasi ammiakli suvda erib ketdi (AgI esa erimaydi)."});
R("k_Ag2ONH3","Ag2O + 4NH3 + H2O","2AgNH3 + 2OH",{sp:"mid",t:"Kompleks hosil bo'lishi",obs:"Ag₂O ammiakda erib, kumush oksidning ammiakli eritmasi (Tollens reaktivi) hosil bo'ldi."});
R("k_AgNH3Cl","AgNH3 + Cl + 2H","AgCl + 2NH4",{t:"Kompleksning parchalanishi",obs:"Kislota qo'shilganda oq AgCl yana cho'kdi."});

/* --- 9. Qiyin eriydigan moddalarning kislotada erishi --- */
const HYD=[["MgOH2","Mg",2],["ZnOH2","Zn",2],["AlOH3","Al",3],["CuOH2","Cu",2],["FeOH2","Fe2",2],["FeOH3","Fe3",3],["PbOH2","Pb",2],["MnOH2","Mn",2],["CrOH3","Cr",3]];
HYD.forEach(([s,c,n])=>{
  R(`d_${s}`,`${s} + ${n}H`,`${c} + ${n}H2O`,{sp:"mid",t:"Asos + kislota",obs:`${S[s].n[0].toUpperCase()+S[s].n.slice(1)} kislotada erib ketdi.`});
  R(`dw_${s}`,`${s} + ${n}CH3COOH`,`${c} + ${n}Ac + ${n}H2O`,{sp:"slow",t:"Asos + kislota",obs:`${S[s].n[0].toUpperCase()+S[s].n.slice(1)} sirka kislotada erimoqda.`});
});
R("d_Ag2O","Ag2O + 2H","2Ag + H2O",{sp:"mid",t:"Asosli oksid + kislota",obs:"Ag₂O kislotada erib ketdi."});
R("d_CuO","CuO + 2H","Cu + H2O",{sp:"slow",t:"Asosli oksid + kislota",obs:"Qora CuO kislotada erib, havorang eritma hosil bo'lmoqda (qizdirilsa tezlashadi)."});
R("d_Fe2O3","Fe2O3 + 6H","2Fe3 + 3H2O",{sp:"vslow",t:"Asosli oksid + kislota",obs:"Fe₂O₃ kislotada sekin erib, sariq eritma hosil bo'lmoqda."});
[["CaCO3","Ca"],["BaCO3","Ba"],["MgCO3","Mg"],["ZnCO3","Zn"],["PbCO3","Pb"],["FeCO3","Fe2"]]
 .forEach(([s,c])=>R(`d_${s}`,`${s} + 2H`,`${c} + CO2 + H2O`,{sp:"mid",t:"Gaz ajralishi",obs:`${S[s].n[0].toUpperCase()+S[s].n.slice(1)} kislotada CO₂ ajratib erimoqda.`}));
R("d_Ag2CO3","Ag2CO3 + 2H","2Ag + CO2 + H2O",{sp:"mid",t:"Gaz ajralishi",obs:"Kumush karbonat CO₂ ajratib eridi."});
R("d_CuOH2CO3","CuOH2CO3 + 4H","2Cu + CO2 + 3H2O",{sp:"mid",t:"Gaz ajralishi",obs:"Malaxit kislotada CO₂ ajratib eridi."});
R("d_marble","mCaCO3 + 2H","Ca + CO2 + H2O",{sp:"slow",exo:2,t:"Gaz ajralishi",obs:"Marmar bo'lakchalari vishillab eriydi — CO₂ gazi ajralmoqda."});
R("dw_marble","mCaCO3 + 2CH3COOH","Ca + 2Ac + CO2 + H2O",{sp:"vslow",t:"Gaz ajralishi",obs:"Marmar sirka kislotada sekin, pufakchalar chiqarib eriydi."});
R("dw_CaCO3","CaCO3 + 2CH3COOH","Ca + 2Ac + CO2 + H2O",{sp:"slow",t:"Gaz ajralishi",obs:"Bo'r sirka kislotada CO₂ ajratib erimoqda."});
R("d_BaSO3","BaSO3 + 2H","Ba + SO2 + H2O",{sp:"mid",t:"Gaz ajralishi",obs:"BaSO₃ kislotada SO₂ ajratib eridi (BaSO₄ esa erimaydi!)."});
R("d_CaSO3","CaSO3 + 2H","Ca + SO2 + H2O",{sp:"mid",t:"Gaz ajralishi",obs:"CaSO₃ kislotada SO₂ ajratib eridi."});
R("c_CO3CO2","CO2aq + CO3 + H2O","2HCO3",{sp:"mid",t:"Nordon tuz hosil bo'lishi",obs:"Ortiqcha CO₂ karbonatni gidrokarbonatga aylantirdi."});
R("c_CaCO3CO2","CaCO3 + CO2aq + H2O","Ca + 2HCO3",{sp:"mid",t:"Nordon tuz hosil bo'lishi",obs:"Ortiqcha CO₂ da loyqa yo'qoldi — eruvchan Ca(HCO₃)₂ hosil bo'ldi."});

/* --- 10. Metallar --- */
R("m_Na_H2O","2mNa + 2H2O","2Na + 2OH + H2",{sp:"mid",exo:30,t:"Faol metall + suv",fx:"violent",
  obs:"Natriy suv ustida vishillab yuguradi va eriydi, vodorod ajraladi, eritma ishqoriy bo'ladi. Ehtiyot bo'ling!"});
R("m_Na_EtOH","2mNa + 2C2H5OH","2C2H5ONa + H2",{sp:"slow",need:{nowater:1},t:"Spirtning xossasi",obs:"Natriy spirtda sekin eriydi, vodorod pufakchalari ajraladi."});
R("m_Mg_H2O","mMg + 2H2O","MgOH2 + H2",{sp:"slow",need:{heat:70},t:"Metall + suv",obs:"Issiq suvda magniy sekin reaksiyaga kirishadi (eritma ishqoriy bo'ladi)."});
const MET={mMg:["Mg",2,"mid",10,"Magniy"],mZn:["Zn",2,"slow",4,"Rux"],mFe:["Fe2",2,"vslow",2,"Temir"],mAl:["Al",3,"vslow",4,"Alyuminiy"],mCu:["Cu",2,"slow",2,"Mis"]};
// suyultirilgan HNO3 (H⁺ + NO₃⁻): vodorod ajralmaydi
R("m_Mg_HNO3","3mMg + 8H + 2NO3","3Mg + 2NO + 4H2O",{sp:"mid",exo:8,t:OQ,obs:"Magniy nitrat kislotada eriydi: vodorod emas, NO ajraladi (havoda qo'ng'ir NO₂ ga aylanadi)."});
R("m_Zn_HNO3","3mZn + 8H + 2NO3","3Zn + 2NO + 4H2O",{sp:"slow",t:OQ,obs:"Rux nitrat kislotada eriydi: vodorod ajralmaydi, NO hosil bo'ladi."});
R("m_Fe_HNO3","mFe + 4H + NO3","Fe3 + NO + 2H2O",{sp:"slow",t:OQ,obs:"Temir suyultirilgan nitrat kislotada Fe³⁺ gacha oksidlanadi, NO ajraladi."});
R("m_Al_HNO3","mAl + 4H + NO3","Al + NO + 2H2O",{sp:"vslow",t:OQ,obs:"Alyuminiy suyultirilgan nitrat kislotada sekin eriydi, NO ajraladi."});
R("m_Cu_HNO3","3mCu + 8H + 2NO3","3Cu + 2NO + 4H2O",{sp:"slow",t:OQ,obs:"Mis suyultirilgan nitrat kislotada eriydi: eritma ko'karadi, rangsiz NO havoda qo'ng'ir NO₂ ga aylanadi."});
// kislotalardan vodorodni siqib chiqarish
R("m_Mg_H","mMg + 2H","Mg + H2",{sp:"mid",exo:10,t:"O'rin olish",obs:"Magniy shiddatli eriydi, vodorod pufakchalari ajraladi, idish isiydi."});
R("m_Zn_H","mZn + 2H","Zn + H2",{sp:"slow",exo:4,t:"O'rin olish",obs:"Rux sirtidan vodorod pufakchalari ajraladi."});
R("m_Fe_H","mFe + 2H","Fe2 + H2",{sp:"vslow",exo:2,t:"O'rin olish",obs:"Temir sekin eriydi, eritma och yashil tusga kiradi (Fe²⁺)."});
R("m_Al_H","2mAl + 6H","2Al + 3H2",{sp:"vslow",exo:4,t:"O'rin olish",obs:"Oksid parda erigach, alyuminiy vodorod ajratib eriydi."});
R("m_Mg_Ac","mMg + 2CH3COOH","Mg + 2Ac + H2",{sp:"slow",t:"O'rin olish",obs:"Magniy kuchsiz sirka kislotada ham vodorod ajratadi (sekinroq)."});
R("m_Zn_Ac","mZn + 2CH3COOH","Zn + 2Ac + H2",{sp:"vslow",t:"O'rin olish",obs:"Rux sirka kislotada juda sekin eriydi."});
// amfoter metallar + ishqor
R("m_Al_OH","2mAl + 2OH + 6H2O","2AlOH4 + 3H2",{sp:"slow",t:"Amfoter metall + ishqor",obs:"Alyuminiy ishqorda vodorod ajratib eriydi — amfoter metall."});
R("m_Zn_OH","mZn + 2OH + 2H2O","ZnOH4 + H2",{sp:"vslow",t:"Amfoter metall + ishqor",obs:"Rux ishqorda sekin, vodorod ajratib eriydi."});
// faolroq metall kamroq faol metallni tuzidan siqib chiqaradi
const RANK={mMg:1,mAl:2,mZn:3,mFe:4,mCu:6},TGT=[["Zn",2,"dZn",3],["Fe2",2,"dFe",4],["Pb",2,"dPb",5],["Cu",2,"dCu",6],["Ag",1,"dAg",7]];
Object.keys(RANK).forEach(m=>{const [ion,z,sp,,nm]=MET[m];
  TGT.forEach(([t,tz,dep,tr])=>{ if(tr<=RANK[m]||t===ion)return; const L=KL.lcm(z,tz);
    R(`x_${m}_${t}`,`${co(L/z)}${m} + ${co(L/tz)}${t}`,`${co(L/z)}${ion} + ${co(L/tz)}${dep}`,{sp:m==="mAl"?"vslow":sp==="mid"?"mid":"slow",t:"O'rin olish",
      obs:`${nm} sirtida ${S[dep].d} hosil bo'lmoqda — ${nm.toLowerCase()} faolroq metall${t==="Cu"?", eritmaning ko'k rangi asta so'nmoqda":""}.`});});
  if(m==="mFe")R("x_mFe_Fe3","mFe + 2Fe3","3Fe2",{sp:"slow",t:OQ,obs:"Temir Fe³⁺ ni Fe²⁺ gacha qaytaradi — sariq eritma och yashillanmoqda."});
  else{const L=KL.lcm(z,1);R(`x_${m}_Fe3`,`${m} + ${z}Fe3`,`${ion} + ${z}Fe2`,{sp:"slow",t:OQ,obs:`${nm} Fe³⁺ ionlarini Fe²⁺ gacha qaytarmoqda.`});}
});

/* --- 11. Qizdirishda boradigan reaksiyalar --- */
R("h_CuOH2","CuOH2","CuO + H2O",{sp:"mid",need:{heat:60},t:"Parchalanish",obs:"Qizdirilganda ko'k Cu(OH)₂ qora CuO ga aylandi."});
R("h_NH3","NH3","NH3g",{sp:"mid",need:{heat:50},t:"Gaz ajralishi",obs:"Qizdirilganda o'tkir hidli ammiak ajraldi — ho'l lakmus qog'oz ko'karadi."});
R("h_CaHCO3","Ca + 2HCO3","CaCO3 + CO2 + H2O",{sp:"mid",need:{heat:85},t:"Parchalanish",obs:"Qaynatilganda oq CaCO₃ cho'kmasi tushdi — suvning vaqtinchalik qattiqligi yo'qoladi."});
R("h_HCO3","2HCO3","CO3 + CO2 + H2O",{sp:"slow",need:{heat:85},t:"Parchalanish",obs:"Qaynatilganda gidrokarbonat parchalanib, CO₂ ajralmoqda."});
R("h_KMnO4","2KMnO4s","K2MnO4s + MnO2 + O2",{sp:"mid",need:{heat:200,dry:1},t:"Parchalanish",obs:"Kristallar qizdirilganda kislorod ajraldi — cho'g'langan cho'p alangalanadi."});
R("h_NaHCO3","2NaHCO3s","Na2CO3s + CO2 + H2O",{sp:"mid",need:{heat:150,dry:1},t:"Parchalanish",obs:"Soda qizdirilganda parchalanib, CO₂ va suv bug'i ajraldi."});
R("f_KMnO4gly","14KMnO4s + 4C3H8O3","7K2CO3s + 7Mn2O3 + 5CO2 + 16H2O",{sp:"vslow",k:.0015,exo:4000,need:{nowater:1},t:"O'z-o'zidan alangalanish",fx:"fire",
  obs:"Bir necha soniyadan so'ng aralashma o'z-o'zidan qizib, binafsha alanga bilan yonib ketdi! Kuchli oksidlovchi organik modda bilan aralashtirilmaydi."});
R("h_FeOH3","2FeOH3","Fe2O3 + 3H2O",{sp:"mid",need:{heat:250,dry:1},t:"Parchalanish",obs:"Qizdirilganda Fe(OH)₃ qizil-qo'ng'ir Fe₂O₃ ga aylandi."});
R("r_H2O2cat","2H2O2","2H2O + O2",{sp:"mid",cat:["MnO2"],t:"Katalitik parchalanish",obs:"MnO₂ katalizatorligida shiddatli kislorod ajraldi — cho'g'langan cho'p alangalanadi."});
R("r_H2O2heat","2H2O2","2H2O + O2",{sp:"slow",need:{heat:70},t:"Parchalanish",obs:"Qizdirilganda vodorod peroksid parchalanib, kislorod ajralmoqda."});
R("o_starchIh","starchI","starch + I2",{need:{heat:60},t:"Kompleksning parchalanishi",molText:"yod-kraxmal kompleksi → kraxmal + I₂",
  obs:"Qizdirilganda ko'k rang yo'qoldi, sovitilganda yana paydo bo'ladi."});
R("o_protHeat","protein","proteinC",{sp:"mid",need:{heat:60},t:"Denaturatsiya",molText:"oqsil → ivigan oqsil (denaturatsiya)",obs:"Qizdirilganda oqsil ivib, oq parchalar hosil bo'ldi."});
R("o_ester","CH3COOH + C2H5OH","CH3COOC2H5 + H2O",{sp:"slow",need:{heat:60},cat:["H"],t:"Eterifikatsiya",obs:"Yoqimli meva hidi paydo bo'ldi — etilatsetat (murakkab efir) hosil bo'ldi."});
R("o_EtOHCuO","C2H5OH + CuO","CH3CHO + dCu + H2O",{sp:"mid",need:{heat:70},t:"Spirtning oksidlanishi",obs:"Qora CuO qizil misga aylandi, olma hidi (etanal) seziladi."});
R("o_gluCu","C6H12O6 + 2CuOH2","C6H12O7 + Cu2O + 2H2O",{sp:"slow",need:{heat:60},t:"Sifat reaksiyasi",obs:"Qizdirilganda ko'k cho'kma avval sarg'ayib, so'ng g'isht-qizil Cu₂O ga aylandi — aldegid guruhiga sifat reaksiyasi."});
R("o_aldCu","CH3CHO + 2CuOH2","CH3COOH + Cu2O + 2H2O",{sp:"slow",need:{heat:60},t:"Sifat reaksiyasi",obs:"Qizdirilganda g'isht-qizil Cu₂O cho'kmasi hosil bo'ldi — aldegidlarga sifat reaksiyasi."});
R("o_aldAg","CH3CHO + 2AgNH3 + 2OH","Ac + NH4 + 2mirAg + 3NH3 + H2O",{sp:"slow",need:{heat:50},t:"«Kumush ko'zgu» reaksiyasi",obs:"Idish devorida yaltiroq kumush ko'zgu hosil bo'ldi — aldegidlarga sifat reaksiyasi."});
R("o_gluAg","C6H12O6 + 2AgNH3 + 2OH","Glu + NH4 + 2mirAg + 3NH3 + H2O",{sp:"slow",need:{heat:50},t:"«Kumush ko'zgu» reaksiyasi",obs:"Glyukoza kumush ko'zgu reaksiyasini beradi — molekulasida aldegid guruhi bor."});

/* --- 12. Yorug'lik va havo --- */
R("u_AgCl","2AgCl","2phAg + Cl2",{sp:"slow",need:{uv:1},t:"Fotokimyoviy",obs:"Yorug'lik ta'sirida oq AgCl qoraymoqda — kumush ajralmoqda (fotografiya asosi)."});
R("u_AgBr","2AgBr","2phAg + Br2",{sp:"slow",need:{uv:1},t:"Fotokimyoviy",obs:"Yorug'lik ta'sirida AgBr qoraymoqda — fotoplyonka shu asosda ishlaydi."});
R("u_AgI","2AgI","2phAg + I2",{sp:"vslow",need:{uv:1},t:"Fotokimyoviy",obs:"Yorug'likda AgI asta qoraymoqda."});
R("a_FeOH2","4FeOH2 + O2air + 2H2O","4FeOH3",{sp:"vslow",need:{air:1},t:"Havoda oksidlanish",obs:"Oq-yashil Fe(OH)₂ havo kislorodi ta'sirida asta qo'ng'ir Fe(OH)₃ ga aylanmoqda."});
R("a_MnOH2","2MnOH2 + O2air","2MnO2 + 2H2O",{sp:"vslow",need:{air:1},t:"Havoda oksidlanish",obs:"Mn(OH)₂ havoda asta qo'ng'irlashmoqda (MnO₂)."});

KL.RULES_RAW=RULES;
// Elektroliz natijalari (kashfiyotlar ro'yxati uchun)
KL.ELEC_KEYS=["e_Ag_W","e_Cu_Cl","e_Cu_Br","e_Cu_W","e_Pb_W","e_Fe2_Cl","e_Fe2_Br","e_Fe2_I","e_Fe2_W","e_Zn_Cl","e_Zn_Br","e_Zn_I","e_Zn_W",
  "e_H_Cl","e_H_Br","e_H_I","e_H_W","e_W_Cl","e_W_Br","e_W_I","e_W_OH","e_W_W"];
})(globalThis.KL=globalThis.KL||{});
