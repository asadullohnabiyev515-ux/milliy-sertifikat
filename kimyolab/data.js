// KimyoLab ma'lumotlari
const EL_RAW = "H|Vodorod|1.008;He|Geliy|4.0026;Li|Litiy|6.94;Be|Berilliy|9.0122;B|Bor|10.81;C|Uglerod|12.011;N|Azot|14.007;O|Kislorod|15.999;F|Ftor|18.998;Ne|Neon|20.180;Na|Natriy|22.990;Mg|Magniy|24.305;Al|Alyuminiy|26.982;Si|Kremniy|28.085;P|Fosfor|30.974;S|Oltingugurt|32.06;Cl|Xlor|35.45;Ar|Argon|39.948;K|Kaliy|39.098;Ca|Kalsiy|40.078;Sc|Skandiy|44.956;Ti|Titan|47.867;V|Vanadiy|50.942;Cr|Xrom|51.996;Mn|Marganes|54.938;Fe|Temir|55.845;Co|Kobalt|58.933;Ni|Nikel|58.693;Cu|Mis|63.546;Zn|Rux|65.38;Ga|Galliy|69.723;Ge|Germaniy|72.630;As|Mishyak|74.922;Se|Selen|78.971;Br|Brom|79.904;Kr|Kripton|83.798;Rb|Rubidiy|85.468;Sr|Stronsiy|87.62;Y|Ittriy|88.906;Zr|Sirkoniy|91.224;Nb|Niobiy|92.906;Mo|Molibden|95.95;Tc|Texnetsiy|98;Ru|Ruteniy|101.07;Rh|Rodiy|102.91;Pd|Palladiy|106.42;Ag|Kumush|107.87;Cd|Kadmiy|112.41;In|Indiy|114.82;Sn|Qalay|118.71;Sb|Surma|121.76;Te|Tellur|127.60;I|Yod|126.90;Xe|Ksenon|131.29;Cs|Seziy|132.91;Ba|Bariy|137.33;La|Lantan|138.91;Ce|Seriy|140.12;Pr|Prazeodim|140.91;Nd|Neodim|144.24;Pm|Prometiy|145;Sm|Samariy|150.36;Eu|Yevropiy|151.96;Gd|Gadoliniy|157.25;Tb|Terbiy|158.93;Dy|Disprozy|162.50;Ho|Golmiy|164.93;Er|Erbiy|167.26;Tm|Tuliy|168.93;Yb|Itterbiy|173.05;Lu|Lyutetsiy|174.97;Hf|Gafniy|178.49;Ta|Tantal|180.95;W|Volfram|183.84;Re|Reniy|186.21;Os|Osmiy|190.23;Ir|Iridiy|192.22;Pt|Platina|195.08;Au|Oltin|196.97;Hg|Simob|200.59;Tl|Talliy|204.38;Pb|Qo'rg'oshin|207.2;Bi|Vismut|208.98;Po|Poloniy|209;At|Astat|210;Rn|Radon|222;Fr|Fransiy|223;Ra|Radiy|226;Ac|Aktiniy|227;Th|Toriy|232.04;Pa|Protaktiniy|231.04;U|Uran|238.03;Np|Neptuniy|237;Pu|Plutoniy|244;Am|Ameritsiy|243;Cm|Kyuriy|247;Bk|Berkliy|247;Cf|Kaliforniy|251;Es|Eynshteyniy|252;Fm|Fermiy|257;Md|Mendeleviy|258;No|Nobeliy|259;Lr|Lourensiy|266;Rf|Rezerfordiy|267;Db|Dubniy|268;Sg|Siborgiy|269;Bh|Boriy|270;Hs|Xassiy|277;Mt|Meytneriy|278;Ds|Darmshtadtiy|281;Rg|Rentgeniy|282;Cn|Kopernitsiy|285;Nh|Nixoniy|286;Fl|Fleroviy|289;Mc|Moskoviy|290;Lv|Livermoriy|293;Ts|Tennessin|294;Og|Oganeson|294";
const CAT = {
  alkali:["Ishqoriy metall","#ef6c57"], earth:["Ishqoriy-yer metall","#f0a04b"],
  trans:["O'tish metali","#5b9bd5"], post:["Oddiy metall (p-blok)","#7fb8a4"],
  metalloid:["Yarim metall","#b6a76a"], nonmetal:["Metallmas","#6fcf97"],
  halogen:["Galogen","#e2d04f"], noble:["Inert gaz","#b48ee0"],
  lan:["Lantanoid","#d98cb3"], act:["Aktinoid","#c06c84"]
};
function catOf(z){
  const s=a=>a.includes(z);
  if(s([3,11,19,37,55,87]))return"alkali"; if(s([4,12,20,38,56,88]))return"earth";
  if(s([2,10,18,36,54,86,118]))return"noble"; if(s([9,17,35,53,85,117]))return"halogen";
  if(z>=57&&z<=71)return"lan"; if(z>=89&&z<=103)return"act";
  if(s([5,14,32,33,51,52]))return"metalloid"; if(s([1,6,7,8,15,16,34]))return"nonmetal";
  if(s([13,31,49,50,81,82,83,84,113,114,115,116]))return"post"; return"trans";
}
function posOf(z){
  if(z===1)return[1,1]; if(z===2)return[1,18];
  if(z<=4)return[2,z-2]; if(z<=10)return[2,z+8];
  if(z<=12)return[3,z-10]; if(z<=18)return[3,z];
  if(z<=36)return[4,z-18]; if(z<=54)return[5,z-36];
  if(z<=56)return[6,z-54]; if(z<=71)return[9,z-54]; if(z<=86)return[6,z-68];
  if(z<=88)return[7,z-86]; if(z<=103)return[10,z-86]; return[7,z-100];
}
const ELEMENTS = EL_RAW.split(";").map((r,i)=>{const [sym,name,m]=r.split("|");const z=i+1;
  const [row,col]=posOf(z);const period=row>7?row-3:row;
  return{z,sym,name,mass:+m,row,col,cat:catOf(z),period,group:(z>=57&&z<=71)||(z>=89&&z<=103)?"—":col};});
const EL_BY_SYM = Object.fromEntries(ELEMENTS.map(e=>[e.sym,e]));

// Molekulalar: atomlar [sim,x,y,z], bog'lar [i,j,tartib]
const MOLS = [
 {id:"h2o",name:"Suv",f:"H2O",info:"Burchakli molekula, H–O–H ≈ 104,5°. Qutbli kovalent bog'lar, molekula dipol.",
  a:[["O",0,0,0],["H",.76,.59,0],["H",-.76,.59,0]],b:[[0,1,1],[0,2,1]]},
 {id:"co2",name:"Karbonat angidrid",f:"CO2",info:"Chiziqli molekula (180°). Bog'lar qutbli, lekin molekula umuman qutbsiz.",
  a:[["C",0,0,0],["O",1.16,0,0],["O",-1.16,0,0]],b:[[0,1,2],[0,2,2]]},
 {id:"ch4",name:"Metan",f:"CH4",info:"Tetraedr (109,5°). Uglerod sp³-gibridlangan.",
  a:[["C",0,0,0],["H",.63,.63,.63],["H",.63,-.63,-.63],["H",-.63,.63,-.63],["H",-.63,-.63,.63]],b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]]},
 {id:"nh3",name:"Ammiak",f:"NH3",info:"Uchburchakli piramida (107°). Azotda bitta erkin elektron juft bor.",
  a:[["N",0,.38,0],["H",.94,-.13,0],["H",-.47,-.13,.81],["H",-.47,-.13,-.81]],b:[[0,1,1],[0,2,1],[0,3,1]]},
 {id:"o2",name:"Kislorod",f:"O2",info:"Qo'sh bog'li ikki atomli molekula.",a:[["O",.6,0,0],["O",-.6,0,0]],b:[[0,1,2]]},
 {id:"n2",name:"Azot",f:"N2",info:"Uchlamchi bog' — juda mustahkam, shuning uchun azot inert.",a:[["N",.55,0,0],["N",-.55,0,0]],b:[[0,1,3]]},
 {id:"hcl",name:"Vodorod xlorid",f:"HCl",info:"Qutbli kovalent bog'. Suvda xlorid kislota hosil qiladi.",a:[["H",-.64,0,0],["Cl",.64,0,0]],b:[[0,1,1]]},
 {id:"c2h4",name:"Etilen",f:"C2H4",info:"Tekis molekula, C=C qo'sh bog'. Alkenlarning birinchi vakili.",
  a:[["C",.67,0,0],["C",-.67,0,0],["H",1.24,.93,0],["H",1.24,-.93,0],["H",-1.24,.93,0],["H",-1.24,-.93,0]],b:[[0,1,2],[0,2,1],[0,3,1],[1,4,1],[1,5,1]]},
 {id:"c2h2",name:"Atsetilen",f:"C2H2",info:"Chiziqli, C≡C uchlamchi bog'. Alkinlarning birinchi vakili.",
  a:[["C",.6,0,0],["C",-.6,0,0],["H",1.66,0,0],["H",-1.66,0,0]],b:[[0,1,3],[0,2,1],[1,3,1]]},
 {id:"etoh",name:"Etanol",f:"C2H5OH",info:"Bir atomli spirt. –OH funksional guruh vodorod bog'lar hosil qiladi.",
  a:[["C",0,0,0],["C",1.52,0,0],["O",2.05,1.35,0],["H",-.37,1.03,0],["H",-.37,-.51,.89],["H",-.37,-.51,-.89],["H",1.89,-.51,.89],["H",1.89,-.51,-.89],["H",3.0,1.3,0]],
  b:[[0,1,1],[1,2,1],[0,3,1],[0,4,1],[0,5,1],[1,6,1],[1,7,1],[2,8,1]]},
 {id:"ch3cooh",name:"Sirka kislota",f:"CH3COOH",info:"Karboksil guruh –COOH. Kuchsiz kislota.",
  a:[["C",0,0,0],["C",1.5,0,0],["O",2.1,1.05,0],["O",2.1,-1.15,0],["H",3.05,-1.1,0],["H",-.37,1.03,0],["H",-.37,-.51,.89],["H",-.37,-.51,-.89]],
  b:[[0,1,1],[1,2,2],[1,3,1],[3,4,1],[0,5,1],[0,6,1],[0,7,1]]},
 {id:"c6h6",name:"Benzol",f:"C6H6",info:"Tekis olti burchak, 6 ta delokallangan π-elektron (aromatik).",
  a:(()=>{const r=[];for(let i=0;i<6;i++){const t=i*Math.PI/3;r.push(["C",1.4*Math.cos(t),1.4*Math.sin(t),0]);}
   for(let i=0;i<6;i++){const t=i*Math.PI/3;r.push(["H",2.48*Math.cos(t),2.48*Math.sin(t),0]);}return r;})(),
  b:(()=>{const r=[];for(let i=0;i<6;i++){r.push([i,(i+1)%6,i%2?1:2]);r.push([i,i+6,1]);}return r;})()}
];
const ATOM_STYLE={H:[0xffffff,.28],C:[0x8a8f98,.42],N:[0x4f7cff,.4],O:[0xff4d4d,.4],Cl:[0x3ddc84,.5],S:[0xf5d90a,.5]};

// Reagentlar va reaksiyalar
const REAGENTS = {
 HCl:{n:"HCl (xlorid kislota)",s:"l",c:"#cfe8f5"}, H2SO4:{n:"H₂SO₄ (sulfat kislota)",s:"l",c:"#d9e6f0"},
 NaOH:{n:"NaOH (o'yuvchi natriy)",s:"l",c:"#d6ecf5"}, CuSO4:{n:"CuSO₄ eritmasi",s:"l",c:"#3b82f6"},
 FeCl3:{n:"FeCl₃ eritmasi",s:"l",c:"#d9a441"}, AgNO3:{n:"AgNO₃ eritmasi",s:"l",c:"#dbeaf2"},
 NaCl:{n:"NaCl eritmasi",s:"l",c:"#dbeaf2"}, BaCl2:{n:"BaCl₂ eritmasi",s:"l",c:"#dbeaf2"},
 KI:{n:"KI eritmasi",s:"l",c:"#dbeaf2"}, PbNO32:{n:"Pb(NO₃)₂ eritmasi",s:"l",c:"#dbeaf2"},
 CaOH2:{n:"Ca(OH)₂ (ohak suvi)",s:"l",c:"#dbeaf2"}, CH3COOH:{n:"CH₃COOH (sirka kislota)",s:"l",c:"#dbeaf2"},
 H2O:{n:"H₂O (suv)",s:"l",c:"#cfe8f5"},
 Zn:{n:"Zn (rux)",s:"s",c:"#9aa5b1"}, Mg:{n:"Mg (magniy)",s:"s",c:"#c9ced4"}, Fe:{n:"Fe (temir mix)",s:"s",c:"#6b7078"},
 Na:{n:"Na (natriy)",s:"s",c:"#e6e8ea"}, CaCO3:{n:"CaCO₃ (bo'r)",s:"s",c:"#f1efe6"}, NaHCO3:{n:"NaHCO₃ (ichimlik sodasi)",s:"s",c:"#f6f6f6"},
 CO2:{n:"CO₂ (gaz)",s:"g",c:"#dbeaf2"}
};
const REACTIONS = [
 {a:"HCl",b:"NaOH",eq:"HCl + NaOH → NaCl + H₂O",type:"Neytrallanish (almashinish)",obs:"Rangsiz eritma, idish biroz isiydi.",fx:"heat",col:"#dbeaf2"},
 {a:"HCl",b:"Zn",eq:"2HCl + Zn → ZnCl₂ + H₂↑",type:"O'rin olish",obs:"Rux sirtidan vodorod pufakchalari ajraladi.",fx:"gas",col:"#cfe8f5"},
 {a:"HCl",b:"Mg",eq:"2HCl + Mg → MgCl₂ + H₂↑",type:"O'rin olish",obs:"Faol gaz ajralishi, idish isiydi.",fx:"gas",col:"#cfe8f5",strong:true},
 {a:"HCl",b:"CaCO3",eq:"2HCl + CaCO₃ → CaCl₂ + H₂O + CO₂↑",type:"Almashinish (gaz ajraladi)",obs:"Bo'r ko'pirib erib, CO₂ gazi ajraladi.",fx:"gas",col:"#cfe8f5"},
 {a:"H2SO4",b:"BaCl2",eq:"H₂SO₄ + BaCl₂ → BaSO₄↓ + 2HCl",type:"Almashinish (cho'kma)",obs:"Oq cho'kma BaSO₄ tushadi — sulfat-ionga sifat reaksiyasi.",fx:"ppt",ppt:"#f5f5f5",col:"#dbeaf2"},
 {a:"AgNO3",b:"NaCl",eq:"AgNO₃ + NaCl → AgCl↓ + NaNO₃",type:"Almashinish (cho'kma)",obs:"Oq tvorogsimon cho'kma AgCl — xlorid-ionga sifat reaksiyasi.",fx:"ppt",ppt:"#fafafa",col:"#dbeaf2"},
 {a:"CuSO4",b:"NaOH",eq:"CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄",type:"Almashinish (cho'kma)",obs:"Ko'k jelesimon cho'kma Cu(OH)₂ tushadi.",fx:"ppt",ppt:"#4aa3ff",col:"#cfe8f5"},
 {a:"CuSO4",b:"Fe",eq:"CuSO₄ + Fe → FeSO₄ + Cu↓",type:"O'rin olish",obs:"Mix sirtida qizil mis qatlami, eritma ko'kdan och yashilga o'tadi.",fx:"ppt",ppt:"#c0602d",col:"#9ad8b0"},
 {a:"FeCl3",b:"NaOH",eq:"FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl",type:"Almashinish (cho'kma)",obs:"Qo'ng'ir-qizil cho'kma Fe(OH)₃ — Fe³⁺ ioniga sifat reaksiyasi.",fx:"ppt",ppt:"#9a4a1c",col:"#e8d3a8"},
 {a:"Na",b:"H2O",eq:"2Na + 2H₂O → 2NaOH + H₂↑",type:"O'rin olish",obs:"Natriy suv ustida yuguradi, shiddatli gaz, isiydi. Ehtiyot bo'ling!",fx:"gas",col:"#d6ecf5",strong:true},
 {a:"KI",b:"PbNO32",eq:"2KI + Pb(NO₃)₂ → PbI₂↓ + 2KNO₃",type:"Almashinish (cho'kma)",obs:"Yorqin sariq cho'kma PbI₂ («oltin yomg'ir»).",fx:"ppt",ppt:"#ffd21f",col:"#dbeaf2"},
 {a:"CaOH2",b:"CO2",eq:"Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O",type:"Birikish / cho'kma",obs:"Ohak suvi loyqalanadi — CO₂ ga sifat reaksiyasi.",fx:"ppt",ppt:"#f3f3f3",col:"#e6eef2"},
 {a:"NaHCO3",b:"CH3COOH",eq:"NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂↑",type:"Almashinish (gaz ajraladi)",obs:"Shiddatli ko'piklanish: CO₂ ajraladi.",fx:"gas",col:"#dbeaf2",strong:true},
 {a:"HCl",b:"Fe",eq:"2HCl + Fe → FeCl₂ + H₂↑",type:"O'rin olish",obs:"Sekin vodorod ajralishi, eritma och yashil tusga kiradi.",fx:"gas",col:"#cfe8d0"},
 {a:"H2SO4",b:"NaOH",eq:"H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O",type:"Neytrallanish",obs:"Rangsiz eritma, kuchli isish.",fx:"heat",col:"#dbeaf2"},
 {a:"CuSO4",b:"Zn",eq:"CuSO₄ + Zn → ZnSO₄ + Cu↓",type:"O'rin olish",obs:"Ko'k rang so'nadi, qizil mis cho'kadi.",fx:"ppt",ppt:"#c0602d",col:"#e6eef2"}
];

// Darslar
const LESSONS = [
 {t:"Atom tuzilishi",h:`<p>Atom — yadro (proton + neytron) va uning atrofida harakatlanuvchi elektronlardan iborat.</p><ul><li>Proton soni = elementning tartib raqami (Z)</li><li>Neytron soni N = A − Z (A — massa soni)</li><li>Neytral atomda elektronlar soni = protonlar soni</li></ul><p>Elektronlar energetik pog'onalarda joylashadi: 1s, 2s, 2p, 3s, 3p, 4s, 3d… Pog'onadagi maksimal elektron soni 2n².</p>`,
  q:[["Atomda protonlar soni nimaga teng?","Tartib raqamiga",["Massa soniga","Neytronlar soniga"]],["2-pog'onada maksimal nechta elektron bo'lishi mumkin?","8",["2","18"]]]},
 {t:"Davriy qonun va jadval",h:`<p>Elementlarning xossalari yadro zaryadiga qarab davriy o'zgaradi (Mendeleyev, Moseli).</p><ul><li>Davr — gorizontal qator (7 ta), guruh — vertikal ustun (18 ta)</li><li>Davrda chapdan o'ngga: metallik kamayadi, elektrmanfiylik oshadi</li><li>Guruhda yuqoridan pastga: metallik oshadi, atom radiusi kattalashadi</li></ul>`,
  q:[["Davrda chapdan o'ngga metallik qanday o'zgaradi?","Kamayadi",["Oshadi","O'zgarmaydi"]],["Eng faol ishqoriy metall (jadvalning pastida)?","Fransiy / seziy tomon",["Litiy tomon","Geliy"]]]},
 {t:"Kimyoviy bog'lanish",h:`<p>Atomlar tashqi pog'onasini to'ldirish uchun bog'lanadi.</p><ul><li><b>Ion bog'</b> — metall + metallmas (NaCl); elektron o'tadi</li><li><b>Kovalent qutbsiz</b> — bir xil metallmas (O₂, N₂)</li><li><b>Kovalent qutbli</b> — turli metallmas (HCl, H₂O)</li><li><b>Metall bog'</b> — metallarda, erkin elektronlar</li></ul>`,
  q:[["NaCl dagi bog' turi?","Ion bog'",["Kovalent qutbsiz","Metall bog'"]],["O₂ molekulasidagi bog'?","Kovalent qutbsiz",["Ion","Vodorod"]]]},
 {t:"Oksidlar",h:`<p>Oksid — kislorod bilan hosil qilgan ikki elementli birikma (E₂Oₙ).</p><ul><li>Asosli: Na₂O, CaO, MgO → asos beradi</li><li>Kislotali: CO₂, SO₃, P₂O₅ → kislota beradi</li><li>Amfoter: Al₂O₃, ZnO, BeO → ikkalasi bilan ham reaksiyaga kirishadi</li></ul><p>CaO + H₂O → Ca(OH)₂;  SO₃ + H₂O → H₂SO₄</p>`,
  q:[["Al₂O₃ qanday oksid?","Amfoter",["Asosli","Kislotali"]],["CO₂ suv bilan nima hosil qiladi?","Karbonat kislota",["Asos","Tuz"]]]},
 {t:"Kislota, asos va tuzlar",h:`<p><b>Kislota</b> — H⁺ beruvchi (HCl, H₂SO₄). <b>Asos</b> — OH⁻ beruvchi (NaOH). <b>Tuz</b> — metall kationi va kislota qoldig'i anioni (NaCl).</p><p>Neytrallanish: kislota + asos → tuz + suv.</p><p>Indikatorlar: lakmus kislotada qizil, ishqorda ko'k; fenolftalein ishqorda malina rang.</p>`,
  q:[["Fenolftalein ishqorda qanday rang beradi?","Malina",["Qizil","Ko'k"]],["HCl + NaOH → ?","NaCl + H₂O",["NaClO + H₂","NaH + HClO"]]]},
 {t:"Eritmalar va konsentratsiya",h:`<p>Massa ulushi: <b>w = m(modda) / m(eritma) · 100%</b></p><p>Molyar konsentratsiya: <b>C<sub>M</sub> = n / V</b> (mol/l)</p><p>pH = −lg[H⁺]. pH &lt; 7 — kislotali, 7 — neytral, &gt; 7 — ishqoriy.</p><p>Misol: 20 g tuz + 80 g suv → w = 20/100 = 20%.</p>`,
  q:[["30 g tuz + 70 g suv eritmasida w = ?","30%",["70%","3%"]],["pH = 3 qanday muhit?","Kislotali",["Neytral","Ishqoriy"]]]},
 {t:"Mol va hisoblashlar",h:`<p>1 mol = 6,02·10²³ zarracha (N<sub>A</sub>). Moddaning miqdori: <b>n = m / M</b>.</p><p>Normal sharoitda 1 mol gaz = 22,4 l: <b>n = V / 22,4</b>.</p><p>Misol: 36 g suv → n = 36/18 = 2 mol.</p>`,
  q:[["1 mol gazning n.sh. dagi hajmi?","22,4 l",["24 l","11,2 l"]],["44 g CO₂ necha mol? (M=44)","1 mol",["2 mol","0,5 mol"]]]},
 {t:"Organik kimyo asoslari",h:`<p>Organik moddalar uglerod birikmalari. Uglerod 4 valentli.</p><ul><li>Alkanlar CₙH₂ₙ₊₂ (metan, etan), faqat σ-bog'</li><li>Alkenlar CₙH₂ₙ (etilen), C=C</li><li>Alkinlar CₙH₂ₙ₋₂ (atsetilen), C≡C</li><li>Spirtlar –OH, kislotalar –COOH</li></ul><p>«Molekulalar» bo'limida ularning 3D tuzilishini ko'ring.</p>`,
  q:[["Etilenning umumiy formulasi?","CₙH₂ₙ",["CₙH₂ₙ₊₂","CₙH₂ₙ₋₂"]],["Karboksil guruh qaysi?","–COOH",["–OH","–CHO"]]]}
];

// Zanjirlar: [boshlang'ich modda, [[reagent to'g'ri, [noto'g'ri...], natija], ...]]
const CHAINS = [
 {t:"Mis zanjiri",start:"Cu",steps:[["O₂, t°",["H₂O","NaOH"],"CuO"],["HCl",["NaCl","H₂"],"CuCl₂"],["NaOH",["HCl","Na"],"Cu(OH)₂"],["t° (qizdirish)",["H₂O","KCl"],"CuO"]]},
 {t:"Kalsiy zanjiri",start:"Ca",steps:[["O₂",["H₂","N₂"],"CaO"],["H₂O",["O₂","CO"],"Ca(OH)₂"],["CO₂",["NaCl","H₂"],"CaCO₃"],["t° (qizdirish)",["HCl","H₂O"],"CaO"]]},
 {t:"Oltingugurt zanjiri",start:"S",steps:[["O₂",["H₂","N₂"],"SO₂"],["O₂, kat.",["H₂O","CO₂"],"SO₃"],["H₂O",["O₂","NaCl"],"H₂SO₄"],["BaCl₂",["NaOH","H₂"],"BaSO₄"]]},
 {t:"Temir zanjiri",start:"Fe",steps:[["Cl₂",["HCl","H₂O"],"FeCl₃"],["NaOH",["HCl","O₂"],"Fe(OH)₃"],["t° (qizdirish)",["H₂O","NaCl"],"Fe₂O₃"],["H₂ (qaytarish)",["O₂","H₂O"],"Fe"]]},
 {t:"Uglerod zanjiri",start:"C",steps:[["O₂ (mo'l)",["H₂","N₂"],"CO₂"],["Ca(OH)₂",["HCl","NaCl"],"CaCO₃"],["HCl",["NaOH","H₂"],"CO₂"],["Mg, t°",["H₂O","NaCl"],"C"]]}
];

// Amaliy ishlar
const PRACTICALS = [
 {t:"Kislorod olish va aniqlash",steps:["Probirkaga 2–3 g KMnO₄ soling, og'ziga paxta tiqing","Gaz o'tkazgich naychani mahkamlang","Spirtovka bilan avval hamma probirkani, so'ng tubini qizdiring","Kislorodni suv ustida yoki havo siqib chiqarish usulida yig'ing","Cho'g'langan cho'pni idishga tushiring — alangalanadi","Avval naychani suvdan chiqaring, keyin qizdirishni to'xtating"],note:"2KMnO₄ → K₂MnO₄ + MnO₂ + O₂↑"},
 {t:"Neytrallanish reaksiyasi",steps:["Stakanga 10 ml NaOH eritmasidan quying","2 tomchi fenolftalein tomizing (malina rang)","Byuretkadan HCl ni tomchilab qo'shing, aralashtiring","Rang yo'qolgan zahoti to'xtating","Sarflangan HCl hajmini yozib oling"],note:"NaOH + HCl → NaCl + H₂O"},
 {t:"Ion almashinish reaksiyalari",steps:["Uchta probirkaga mos ravishda CuSO₄, FeCl₃, BaCl₂ eritmalaridan 1–2 ml quying","Har biriga NaOH (birinchi ikkitasiga) va H₂SO₄ (uchinchisiga) tomizing","Cho'kma ranglarini yozing: ko'k, qo'ng'ir, oq","Tenglamalarni to'liq va qisqartirilgan ion shaklida yozing"],note:"Cho'kma hosil bo'lishi reaksiya oxirigacha borishini bildiradi."},
 {t:"Eritma tayyorlash (w = 10%)",steps:["Kerakli tuz massasini hisoblang: m = w·m(eritma)","Texnik tarozida tuzni tortib oling","Menzurka bilan suvni o'lchang","Tuzni stakanga solib, suv qo'shing va shisha tayoqcha bilan aralashtiring","Eritmani etiketkalangan idishga quying"],note:"100 g 10% eritma: 10 g tuz + 90 g suv."},
 {t:"Metallarning faolligi",steps:["Uchta probirkaga HCl quying","Birinchisiga Mg, ikkinchisiga Zn, uchinchisiga Cu bo'lagini soling","Gaz ajralish tezligini solishtiring","Faollik qatorini tuzing: Mg > Zn > Cu"],note:"Cu vodorodgacha emas — HCl bilan reaksiyaga kirishmaydi."}
];

// Yutuqlar
const ACHS = [
 ["first_rx","🧪","Birinchi reaksiya","Laboratoriyada birinchi reaksiyani bajaring"],
 ["rx5","⚗️","Tajribachi","5 xil reaksiyani toping"],
 ["rx10","🔬","Kashfiyotchi","10 xil reaksiyani toping"],
 ["mol5","⚛️","Molekula ustasi","5 ta molekulani 3D da ko'ring"],
 ["el10","📋","Jadval bilimdoni","10 ta elementni oching"],
 ["lesson1","📚","Talaba","Birinchi darsni tugating"],
 ["lesson_all","🎓","Bilimdon","Barcha darslarni tugating"],
 ["chain1","🔗","Zanjir ustasi","Birinchi zanjirni to'g'ri yeching"],
 ["prac1","🥼","Laborant","Birinchi amaliy ishni tugating"],
 ["calc","🧮","Hisobchi","Molyar massa hisoblang"],
 ["balance","⚖️","Tenglamachi","Tenglamani tenglashtiring"],
 ["quiz5","🎯","Aniq nishon","Element viktorinasida 5 ta to'g'ri javob"]
];
