// KimyoLab — o'quv kontenti: darslar, amaliy ishlar, zanjirlar, yutuqlar, reaksiya turlari izohi
(function(KL){
"use strict";
/* ---------- Darslar: t — mavzu, h — matn, q — [savol, to'g'ri, [noto'g'rilar]], pr — amaliy ish ---------- */
KL.LESSONS=[
 {id:"safety",t:"Xavfsizlik va favqulodda holatlar",drill:1,h:`<p>Laboratoriyada ishlashdan oldin <b>xalat, himoya ko'zoynagi va qo'lqop</b> kiyiladi. Favqulodda holatda vahima qilmasdan, quyidagicha harakat qilinadi:</p>
<table class="tbl"><tr><th>Holat</th><th>To'g'ri harakat</th><th>Mumkin emas</th></tr>
<tr><td>🔥 Yonuvchi suyuqlik yondi</td><td>Spirtovkani o'chirish, namat yoki qopqoq bilan yopish</td><td>Suv sepish, puflash</td></tr>
<tr><td>🔥 Natriy yondi</td><td>Quruq qum sepish</td><td>Suv, CO₂ o't o'chirgich</td></tr>
<tr><td>💥 Portlash</td><td>Alangani o'chirish, uzoqlashish, o'qituvchiga aytish</td><td>Shishani qo'l bilan yig'ish</td></tr>
<tr><td>♨️ Kuyish</td><td>10–20 daqiqa sovuq oqar suv</td><td>Yog', krem, muz</td></tr>
<tr><td>💦 Kislota/ishqor sachradi</td><td>15 daqiqa ko'p oqar suv bilan yuvish</td><td>Neytrallash, artish</td></tr>
<tr><td>☠️ Zaharli gaz</td><td>Jarayonni to'xtatish, shamollatish, toza havo</td><td>Hidlab ko'rish</td></tr>
<tr><td>🩸 Shishadan kesilish</td><td>Yuvish, steril bint bilan bosish</td><td>Shishani o'zi sug'urish</td></tr></table>
<p>Laboratoriyadagi tajribalarda shunday holatlar real ro'y berishi mumkin. Pastdagi tugma bilan mashq ham qilishingiz mumkin.</p>`,
  q:[["Yonayotgan natriyni nima bilan o'chirish kerak?","Quruq qum",["Suv","CO₂ o't o'chirgich"]],["Qo'lga kislota sachrasa, birinchi navbatda nima qilinadi?","Ko'p oqar suv bilan yuviladi",["Ishqor bilan neytrallanadi","Latta bilan artiladi"]],["Kuygan joyga nima qilinadi?","Sovuq oqar suv ostida tutiladi",["Yog' surtiladi","Muz bosiladi"]]]},
 {id:"atom",t:"Atom tuzilishi",h:`<p>Atom — musbat zaryadli <b>yadro</b> va uning atrofida harakatlanuvchi <b>elektronlar</b>dan iborat. Yadro protonlar (p⁺) va neytronlardan (n⁰) tashkil topgan.</p>
<ul><li>Protonlar soni = tartib raqami <b>Z</b> = yadro zaryadi</li><li>Neytronlar soni: <b>N = A − Z</b> (A — massa soni)</li><li>Neytral atomda elektronlar soni protonlar soniga teng</li><li><b>Izotoplar</b> — protonlari bir xil, neytronlari har xil atomlar (¹²C va ¹⁴C)</li></ul>
<p>Elektronlar energetik pog'onalarda joylashadi: n-pog'onada ko'pi bilan <b>2n²</b> ta elektron bo'ladi. Pog'onachalar to'lish tartibi: 1s 2s 2p 3s 3p 4s 3d 4p 5s…</p>`,
  q:[["²³Na atomida nechta neytron bor?","12",["11","23"]],["3-energetik pog'onada ko'pi bilan nechta elektron bo'ladi?","18",["8","32"]],["Izotoplar bir-biridan nimasi bilan farq qiladi?","Neytronlar soni bilan",["Protonlar soni bilan","Elektronlar soni bilan"]]]},
 {id:"period",t:"Davriy qonun va davriy jadval",h:`<p>D. I. Mendeleyev (1869) elementlar xossalari atom massasiga davriy bog'liq ekanini aniqladi. Hozirgi ta'rif: xossalar <b>atom yadrosining zaryadiga</b> davriy bog'liq.</p>
<ul><li>Jadvalda 7 ta davr va 18 ta guruh bor</li><li>Davrda chapdan o'ngga: atom radiusi kichrayadi, metallik kamayadi, <b>elektrmanfiylik ortadi</b></li><li>Guruhda yuqoridan pastga: radius kattalashadi, metallik kuchayadi</li><li>A guruh raqami = tashqi pog'onadagi elektronlar soni</li></ul>
<p>«Davriy jadval» bo'limida elementlarni elektrmanfiylik bo'yicha ranglab ko'ring.</p>`,
  q:[["Davrda chapdan o'ngga elektrmanfiylik qanday o'zgaradi?","Ortadi",["Kamayadi","O'zgarmaydi"]],["Eng elektrmanfiy element qaysi?","Ftor",["Kislorod","Xlor"]],["Hozirgi davriy qonunga ko'ra xossalar nimaga bog'liq?","Yadro zaryadiga",["Atom massasiga","Neytronlar soniga"]]]},
 {id:"bond",t:"Kimyoviy bog'lanish",h:`<p>Atomlar barqaror (ko'pincha 8 elektronli) tashqi qavat hosil qilish uchun bog'lanadi.</p>
<ul><li><b>Ion bog'</b> — tipik metall va metallmas orasida (NaCl): elektron bir atomdan ikkinchisiga o'tadi</li><li><b>Kovalent qutbsiz</b> — bir xil metallmaslar orasida (H₂, O₂, N₂)</li><li><b>Kovalent qutbli</b> — har xil metallmaslar orasida (HCl, H₂O, NH₃)</li><li><b>Metall bog'</b> — metallarda, umumlashgan erkin elektronlar hisobiga</li><li><b>Vodorod bog'</b> — molekulalar orasida (H₂O, HF, spirtlar)</li></ul>
<p>Elektrmanfiyliklar farqi katta bo'lsa (≈1,7 dan ortiq), bog' ionli bo'ladi.</p>`,
  q:[["NaCl dagi bog' turi?","Ion bog'",["Kovalent qutbsiz","Metall bog'"]],["H₂O molekulasidagi O–H bog'i qanday?","Kovalent qutbli",["Ion bog'","Kovalent qutbsiz"]],["Suv molekulalari orasida qanday bog' bor?","Vodorod bog'",["Ion bog'","Metall bog'"]]]},
 {id:"ox",t:"Oksidlanish darajasi",h:`<p>Oksidlanish darajasi — birikmadagi atomning shartli zaryadi.</p>
<ul><li>Oddiy moddalarda — <b>0</b> (Fe, O₂, Cl₂)</li><li>Kislorod odatda <b>−2</b> (peroksidlarda −1)</li><li>Vodorod odatda <b>+1</b> (metall gidridlarida −1)</li><li>Molekuladagi darajalar yig'indisi 0 ga, ionda esa ion zaryadiga teng</li></ul>
<p>Misol: H₂SO₄ da 2·(+1) + x + 4·(−2) = 0 ⇒ x = +6. KMnO₄ da marganes +7.</p><p>«Hisoblash» bo'limidagi kalkulyator har qanday formulada darajalarni topib beradi.</p>`,
  q:[["KMnO₄ da marganesning oksidlanish darajasi?","+7",["+6","+4"]],["H₂SO₄ da oltingugurtning oksidlanish darajasi?","+6",["+4","−2"]],["NH₃ da azotning oksidlanish darajasi?","−3",["+3","+5"]]]},
 {id:"oxides",t:"Oksidlar",h:`<p>Oksid — ikki elementdan iborat, biri −2 darajali kislorod bo'lgan birikma.</p>
<ul><li><b>Asosli</b>: Na₂O, CaO, CuO — kislotalar bilan tuz hosil qiladi</li><li><b>Kislotali</b>: CO₂, SO₃, P₂O₅ — ishqorlar bilan tuz hosil qiladi</li><li><b>Amfoter</b>: ZnO, Al₂O₃, BeO — kislota bilan ham, ishqor bilan ham reaksiyaga kirishadi</li><li><b>Befarq</b>: CO, NO, N₂O — tuz hosil qilmaydi</li></ul>
<p>CaO + H₂O → Ca(OH)₂;  SO₃ + H₂O → H₂SO₄;  CuO + 2HCl → CuCl₂ + H₂O</p>`,
  q:[["Al₂O₃ qanday oksid?","Amfoter",["Asosli","Kislotali"]],["SO₃ + H₂O → ?","H₂SO₄",["H₂SO₃","H₂S"]],["Tuz hosil qilmaydigan oksid?","CO",["CO₂","SO₂"]]]},
 {id:"acids",t:"Kislotalar",h:`<p>Kislota — vodorod atomlari va kislota qoldig'idan iborat modda; suvda H⁺ ionlarini hosil qiladi.</p>
<ul><li>Kislorodsiz (HCl, H₂S) va kislorodli (H₂SO₄, HNO₃)</li><li>Negizligi: HCl — bir, H₂SO₄ — ikki, H₃PO₄ — uch negizli</li><li>Indikatorlar rangini o'zgartiradi (lakmus qizaradi)</li><li>Faollik qatorida vodoroddan oldingi metallar bilan H₂ ajratadi</li><li>Asosli oksidlar, asoslar va ba'zi tuzlar bilan reaksiyaga kirishadi</li></ul>
<p>Nitrat kislota metallar bilan vodorod ajratmaydi — azot oksidlari hosil bo'ladi.</p>`,pr:"metals",
  q:[["HCl necha negizli kislota?","Bir negizli",["Ikki negizli","Uch negizli"]],["Qaysi metall xlorid kislota bilan reaksiyaga kirishmaydi?","Cu",["Zn","Mg"]],["Rux xlorid kislotada eriganda qaysi gaz ajraladi?","H₂",["Cl₂","O₂"]]]},
 {id:"bases",t:"Asoslar va indikatorlar",h:`<p>Asos — metall atomi va gidroksid guruh(lar)idan iborat modda. Suvda eriydigan asoslar <b>ishqorlar</b> deyiladi (NaOH, KOH, Ca(OH)₂).</p>
<table class="tbl"><tr><th>Indikator</th><th>Kislotada</th><th>Neytral</th><th>Ishqorda</th></tr><tr><td>Lakmus</td><td>qizil</td><td>binafsha</td><td>ko'k</td></tr><tr><td>Fenolftalein</td><td>rangsiz</td><td>rangsiz</td><td>malina</td></tr><tr><td>Metiloranj</td><td>qizil-pushti</td><td>sariq-zarg'aldoq</td><td>sariq</td></tr></table>
<p>Erimaydigan asoslar qizdirilganda parchalanadi: Cu(OH)₂ → CuO + H₂O.</p>`,pr:"ind",
  q:[["Fenolftalein ishqorda qanday rangga kiradi?","Malina",["Qizil","Ko'k"]],["Qaysi modda ishqor?","NaOH",["Cu(OH)₂","Fe(OH)₃"]],["Cu(OH)₂ qizdirilsa nima hosil bo'ladi?","CuO va H₂O",["Cu va H₂O","CuO va H₂"]]]},
 {id:"salts",t:"Tuzlar",h:`<p>Tuz — metall kationi (yoki NH₄⁺) va kislota qoldig'i anionidan iborat modda.</p>
<ul><li><b>O'rta tuzlar</b>: NaCl, CuSO₄</li><li><b>Nordon tuzlar</b>: NaHCO₃, KHSO₄ (tarkibida H bor)</li><li><b>Asosli tuzlar</b>: (CuOH)₂CO₃ — malaxit (tarkibida OH bor)</li><li><b>Kompleks tuzlar</b>: [Cu(NH₃)₄]SO₄, Na[Al(OH)₄]</li></ul>
<p>Tuzlar kislotalar, ishqorlar, boshqa tuzlar va metallar bilan reaksiyaga kirishadi (cho'kma, gaz yoki suv hosil bo'lsa).</p>`,pr:"ion",
  q:[["NaHCO₃ qanday tuz?","Nordon tuz",["O'rta tuz","Asosli tuz"]],["(CuOH)₂CO₃ qanday tuz?","Asosli tuz",["Nordon tuz","Qo'sh tuz"]],["BaCl₂ + Na₂SO₄ reaksiyasida nima cho'kadi?","BaSO₄",["NaCl","BaO"]]]},
 {id:"ions",t:"Ion almashinish reaksiyalari",h:`<p>Elektrolitlar suvda ionlarga ajraladi. Kuchli elektrolitlar: kuchli kislotalar, ishqorlar, eruvchan tuzlar. Kuchsiz: H₂O, CH₃COOH, NH₃·H₂O, H₂CO₃.</p>
<p>Ion almashinish reaksiyasi <b>oxirigacha boradi</b>, agar: 1) cho'kma, 2) gaz yoki 3) kuchsiz elektrolit (masalan, suv) hosil bo'lsa.</p>
<p>Misol: BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl<br>Qisqa ionli: <b>Ba²⁺ + SO₄²⁻ → BaSO₄↓</b></p>
<p>Laboratoriyada har bir reaksiya uchun molekulyar va qisqa ionli tenglamalar avtomatik ko'rsatiladi.</p>`,pr:"ion",
  q:[["Qaysi reaksiya oxirigacha boradi?","BaCl₂ + Na₂SO₄",["NaCl + KNO₃","KCl + NaNO₃"]],["HCl + NaOH ning qisqa ionli tenglamasi?","H⁺ + OH⁻ → H₂O",["Na⁺ + Cl⁻ → NaCl","H⁺ + Cl⁻ → HCl"]],["Qaysi modda kuchsiz elektrolit?","CH₃COOH",["HCl","NaOH"]]]},
 {id:"qual",t:"Ionlarga sifat reaksiyalari",h:`<table class="tbl"><tr><th>Ion</th><th>Reaktiv</th><th>Belgisi</th></tr>
<tr><td>Cl⁻</td><td>Ag⁺</td><td>oq suzmasimon AgCl↓</td></tr><tr><td>Br⁻</td><td>Ag⁺</td><td>och sariq AgBr↓</td></tr><tr><td>I⁻</td><td>Ag⁺</td><td>sariq AgI↓</td></tr>
<tr><td>SO₄²⁻</td><td>Ba²⁺</td><td>oq BaSO₄↓ (kislotada erimaydi)</td></tr><tr><td>CO₃²⁻</td><td>H⁺</td><td>CO₂↑ (ohakli suvni loyqalatadi)</td></tr>
<tr><td>Fe³⁺</td><td>SCN⁻ yoki OH⁻</td><td>qon-qizil eritma / qo'ng'ir Fe(OH)₃↓</td></tr><tr><td>Fe²⁺</td><td>OH⁻</td><td>oq-yashil Fe(OH)₂↓ (havoda qo'ng'irlashadi)</td></tr>
<tr><td>Cu²⁺</td><td>OH⁻ / NH₃</td><td>havorang Cu(OH)₂↓ / to'q ko'k eritma</td></tr><tr><td>NH₄⁺</td><td>OH⁻, t°</td><td>o'tkir hidli NH₃↑</td></tr></table>`,pr:"iron",
  q:[["Sulfat-ionni aniqlash reaktivi?","BaCl₂",["AgNO₃","NaOH"]],["Fe³⁺ KSCN bilan qanday rang beradi?","Qon-qizil",["Ko'k","Sariq"]],["AgI cho'kmasining rangi?","Sariq",["Oq","Qora"]]]},
 {id:"activity",t:"Metallarning faollik qatori",h:`<p><b>Li K Ca Na Mg Al Zn Fe Ni Sn Pb (H) Cu Hg Ag Pt Au</b></p>
<ul><li>Vodoroddan oldingi metallar kislotalardan (HNO₃ dan tashqari) vodorodni siqib chiqaradi</li><li>Faolroq metall kamroq faol metallni tuzi eritmasidan siqib chiqaradi: Fe + CuSO₄ → FeSO₄ + Cu</li><li>Juda faol metallar (Na, K, Ca) tuz eritmasida avval <b>suv</b> bilan reaksiyaga kirishadi: Na CuSO₄ eritmasidan misni emas, Cu(OH)₂ ni cho'ktiradi</li></ul>`,pr:"metals",
  q:[["Fe + CuSO₄ reaksiyasida nima ajraladi?","Mis",["Vodorod","Temir"]],["Natriy CuSO₄ eritmasiga tushirilsa nima hosil bo'ladi?","Cu(OH)₂ cho'kmasi",["Mis","Natriy sulfid"]],["Qaysi metall HCl dan vodorodni siqib chiqara olmaydi?","Ag",["Fe","Al"]]]},
 {id:"solutions",t:"Eritmalar va konsentratsiya",h:`<ul><li>Massa ulushi: <b>w = m(modda) / m(eritma) · 100%</b></li><li>Molyar konsentratsiya: <b>C<sub>M</sub> = n / V</b> (mol/l)</li><li>Suyultirish: <b>C₁V₁ = C₂V₂</b></li><li>Eruvchanlik — 100 g suvda erishi mumkin bo'lgan modda massasi</li></ul>
<p>Misol: 20 g tuz + 180 g suv → w = 20 / 200 = 10%. Hisoblashlarni «Hisoblash» bo'limida bajaring.</p>`,
  q:[["20 g tuz 180 g suvda eritildi. w = ?","10%",["11,1%","20%"]],["250 ml eritmada 0,5 mol modda bor. C_M = ?","2 M",["0,5 M","0,125 M"]],["100 ml 2 M eritma 0,5 M gacha suyultirildi. Hajm?","400 ml",["200 ml","500 ml"]]]},
 {id:"hydrolysis",t:"pH va tuzlar gidrolizi",h:`<p><b>pH = −lg[H⁺]</b>. pH &lt; 7 — kislotali, 7 — neytral, &gt; 7 — ishqoriy muhit.</p>
<ul><li>Kuchli asos + kuchsiz kislota tuzi (Na₂CO₃, CH₃COONa) — <b>ishqoriy</b> muhit</li><li>Kuchsiz asos + kuchli kislota tuzi (NH₄Cl, CuSO₄, ZnCl₂, AlCl₃) — <b>kislotali</b> muhit</li><li>Kuchli asos + kuchli kislota tuzi (NaCl, KNO₃) — gidrolizlanmaydi, <b>neytral</b></li><li>Al³⁺ va CO₃²⁻ birgalikda to'liq gidrolizlanadi: Al(OH)₃↓ + CO₂↑</li></ul>
<p>Universal indikator bilan laboratoriyada sinab ko'ring.</p>`,pr:"hydro",
  q:[["Na₂CO₃ eritmasining muhiti?","Ishqoriy",["Kislotali","Neytral"]],["ZnCl₂ eritmasining muhiti?","Kislotali",["Ishqoriy","Neytral"]],["KNO₃ eritmasining muhiti?","Neytral",["Kislotali","Ishqoriy"]]]},
 {id:"electrolysis",t:"Elektroliz",h:`<p>Elektroliz — elektr toki ta'sirida elektrodlarda boradigan oksidlanish-qaytarilish jarayoni (inert elektrodlar).</p>
<ul><li><b>Katod (−)</b>: Cu²⁺, Ag⁺ kabi kam faol metallar ajraladi; faol metallar (Li…Al) eritmasida suv qaytariladi — H₂ ajraladi va OH⁻ to'planadi</li><li><b>Anod (+)</b>: I⁻, Br⁻, Cl⁻ oksidlanadi (I₂, Br₂, Cl₂); kislorodli anionlarda (SO₄²⁻, NO₃⁻) suv oksidlanadi — O₂ ajraladi</li></ul>
<p>2NaCl + 2H₂O → H₂↑ + Cl₂↑ + 2NaOH;  2CuSO₄ + 2H₂O → 2Cu + O₂↑ + 2H₂SO₄</p>`,pr:"elec",
  q:[["CuSO₄ eritmasi elektrolizida katodda nima ajraladi?","Cu",["H₂","O₂"]],["NaCl eritmasi elektrolizida anodda nima ajraladi?","Cl₂",["O₂","Na"]],["Na₂SO₄ eritmasi elektrolizida nimalar ajraladi?","H₂ va O₂",["Na va SO₃","Na va O₂"]]]},
 {id:"redox",t:"Oksidlanish-qaytarilish reaksiyalari",h:`<p><b>Oksidlovchi</b> elektron qabul qiladi (darajasi kamayadi), <b>qaytaruvchi</b> elektron beradi (darajasi ortadi).</p>
<p>KMnO₄ ning qaytarilishi muhitga bog'liq:</p><ul><li>kislotali muhit → Mn²⁺ (rangsiz)</li><li>neytral muhit → MnO₂↓ (qo'ng'ir)</li><li>ishqoriy muhit → MnO₄²⁻ (yashil)</li></ul>
<p>Elektron balans: Mn⁺⁷ + 5e → Mn⁺² | ×2;  S⁺⁴ − 2e → S⁺⁶ | ×5 ⇒ 2KMnO₄ + 5Na₂SO₃ + 3H₂SO₄ → 2MnSO₄ + 5Na₂SO₄ + K₂SO₄ + 3H₂O</p>`,pr:"redox",
  q:[["Oksidlovchi nima qiladi?","Elektron qabul qiladi",["Elektron beradi","Proton beradi"]],["Kislotali muhitda KMnO₄ nimagacha qaytariladi?","Mn²⁺",["MnO₂","MnO₄²⁻"]],["Neytral muhitda KMnO₄ qaytarilganda qanday cho'kma tushadi?","MnO₂",["Mn(OH)₂","KMnO₄"]]]},
 {id:"mole",t:"Mol va gaz qonunlari",h:`<ul><li><b>n = m / M = V / 22,4 = N / N<sub>A</sub></b>, N<sub>A</sub> = 6,02·10²³ mol⁻¹</li><li>Normal sharoitda (0°C, 101,3 kPa) 1 mol gaz <b>22,4 l</b> hajmni egallaydi</li><li>Nisbiy zichlik: <b>D = M₁ / M₂</b>; havoga nisbatan D = M / 29</li><li>Mendeleyev–Klapeyron: <b>pV = nRT</b>, R = 8,314 J/(mol·K)</li></ul>
<p>Misol: 44 g CO₂ → n = 44 / 44 = 1 mol → V = 22,4 l.</p>`,
  q:[["11,2 l gaz (n.sh.) necha mol?","0,5 mol",["2 mol","1 mol"]],["Vodorodga nisbatan zichligi 16 bo'lgan gazning molyar massasi?","32 g/mol",["16 g/mol","8 g/mol"]],["Avogadro soni?","6,02·10²³",["22,4","8,314"]]]},
 {id:"organic",t:"Organik kimyo asoslari",h:`<p>Organik moddalar — uglerod birikmalari. Uglerod 4 valentli, zanjir va halqalar hosil qiladi.</p>
<ul><li>Alkanlar CₙH₂ₙ₊₂ (metan, propan) — faqat σ-bog'</li><li>Alkenlar CₙH₂ₙ (etilen) — C=C</li><li>Alkinlar CₙH₂ₙ₋₂ (atsetilen) — C≡C</li><li>Arenlar (benzol C₆H₆)</li><li>Funksional guruhlar: –OH spirtlar, –CHO aldegidlar, –COOH kislotalar, –COO– murakkab efirlar</li></ul>
<p>«Molekulalar» bo'limida ularning fazoviy tuzilishini ko'ring.</p>`,
  q:[["C₃H₈ qaysi sinfga kiradi?","Alkanlar",["Alkenlar","Alkinlar"]],["–CHO qaysi sinfning funksional guruhi?","Aldegidlar",["Spirtlar","Karbon kislotalar"]],["CH₃COOC₂H₅ qaysi sinfga kiradi?","Murakkab efirlar",["Aldegidlar","Spirtlar"]]]},
 {id:"orgqual",t:"Organik moddalarning sifat reaksiyalari",h:`<ul><li><b>Ko'p atomli spirtlar</b> (glitserin) + Cu(OH)₂ → yorqin ko'k eritma</li><li><b>Aldegidlar va glyukoza</b>: «kumush ko'zgu» ([Ag(NH₃)₂]OH, t°) va Cu(OH)₂ + t° → g'isht-qizil Cu₂O</li><li><b>Fenol</b> + bromli suv → oq 2,4,6-tribromfenol cho'kmasi</li><li><b>Kraxmal</b> + I₂ → to'q ko'k rang</li><li><b>Oqsil</b> + Cu(OH)₂ → binafsha (biuret), qizdirilganda iviydi</li><li>Spirt + kislota (H₂SO₄, t°) → murakkab efir (meva hidi)</li></ul>`,pr:"organic",
  q:[["Glitserin Cu(OH)₂ bilan qanday rang beradi?","Yorqin ko'k",["Qizil","Sariq"]],["«Kumush ko'zgu» reaksiyasi qaysi guruhga xos?","Aldegid",["Gidroksil","Karboksil"]],["Kraxmal yod bilan qanday rang beradi?","To'q ko'k",["Qizil","Yashil"]]]}
];

/* ---------- Amaliy ishlar (laboratoriyada qadam-baqadam tekshiriladi) ---------- */
const A=(id,t)=>({t:t||`«${KL.SHELF_BY_ID[id].n}» ni idishga qo'shing.`,c:{add:id}});
const CLEAN={t:"Idishni tozalang (🧽 Tozalash).",c:{clean:1}};
KL.PRACTICALS=[
 {id:"safety",t:"Xavfsizlik qoidalari va jihozlar",goal:"Himoya vositalari, idishlar va spirtovka bilan ishlashni o'rganish.",steps:[
   {t:"Himoya vositalarini tartib bilan kiying: xalat → ko'zoynak → qo'lqop.",c:{gear:1}},
   {t:"Tajriba stoliga yaqinlashing (🔍 Yaqinlashish).",c:{focus:1}},
   {t:"Idishlar orasidan probirkani tanlang (🧪 Idish paneli).",c:{vessel:"probirka"}},
   A("H2O","Probirkaga distillangan suv quying."),
   {t:"Spirtovkani yoqib, suvni 60°C gacha qizdiring.",c:{T:60}},
   {t:"Spirtovkani o'chiring (qopqog'i bilan o'chiriladi, puflanmaydi!).",c:{heatOff:1}},
   CLEAN],
  end:"Qoidalar: reaktivlarni hidlamang va tatib ko'rmang; probirka og'zini o'zingizga va boshqalarga qaratmang; spirtovkani gugurt bilan yoqing va qopqog'i bilan o'chiring."},
 {id:"ind",t:"Indikatorlarning kislota va ishqorlarda rangi",goal:"Lakmus, fenolftalein va universal indikator rangini kuzatish.",steps:[
   A("HCl"),A("lit","Lakmus tomizing — rangini kuzating."),{t:"Lakmus kislotada qizil rangga kirganini kuzating.",c:{all:[{ind:"lit"},{ph:"<5"}]}},CLEAN,
   A("NaOH"),A("php","Fenolftalein tomizing."),{t:"Fenolftalein ishqorda malina rangga kirdi.",c:{all:[{ind:"php"},{ph:">9"}]}},CLEAN,
   A("NaCl"),A("uni","Universal indikator tomizing."),{t:"Neytral muhitda universal indikator yashil.",c:{all:[{ind:"uni"},{phr:[6.5,7.5]}]}}],
  end:"Kislotalar lakmusni qizartiradi, ishqorlar fenolftaleinni malina rangga bo'yaydi; neytral muhitda universal indikator yashil bo'ladi."},
 {id:"neutral",t:"Neytrallanish reaksiyasi",goal:"Kislota va ishqorning o'zaro ta'sirini indikator yordamida kuzatish.",steps:[
   A("NaOH"),A("php","Fenolftalein tomizing — eritma malina rangga kiradi."),
   {t:"Xlorid kislotadan rangi yo'qolguncha qo'shib boring.",c:{all:[{rx:"n_HOH"},{ph:"<8.2"}]}},
   {t:"Qisqa ionli tenglamani jurnaldan toping: H⁺ + OH⁻ → H₂O.",c:{wait:2}}],
  end:"Kislota va ishqor teng miqdorda bo'lganda muhit neytral bo'ladi, fenolftalein rangsizlanadi. Neytrallanishda issiqlik ajraladi."},
 {id:"cuoh",t:"Mis(II) gidroksidini olish va xossalari",goal:"Erimaydigan asos olish va uni qizdirib parchalash.",steps:[
   {t:"Probirkani tanlang.",c:{vessel:"probirka"}},A("CuSO4","Probirkaga mis(II) sulfat eritmasidan quying."),A("NaOH","Natriy gidroksid eritmasini tomizing."),
   {t:"Havorang Cu(OH)₂ cho'kmasi tushganini kuzating.",c:{rx:"p_Cu_OH"}},A("NaOH","Yana NaOH qo'shing (to'liq cho'ktirish uchun)."),
   {t:"Probirkani qizdiring — cho'kma qorayadi.",c:{rx:"h_CuOH2"}}],
  end:"CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄; qizdirilganda Cu(OH)₂ → CuO + H₂O. Erimaydigan asoslar qizdirilganda parchalanadi."},
 {id:"ion",t:"Ion almashinish reaksiyalari",goal:"Cho'kma, gaz va suv hosil bo'lishi bilan boradigan reaksiyalarni kuzatish.",steps:[
   A("BaCl2"),A("Na2SO4"),{t:"Oq BaSO₄ cho'kmasini kuzating.",c:{rx:"p_Ba_SO4"}},CLEAN,
   A("AgNO3"),A("NaCl"),{t:"Oq suzmasimon AgCl cho'kmasi tushdi.",c:{rx:"p_Ag_Cl"}},CLEAN,
   A("Na2CO3"),A("HCl"),{t:"CO₂ gazi ajralishini kuzating (kerak bo'lsa yana HCl qo'shing).",c:{rx:"g_CO3"}}],
  end:"Ion almashinish reaksiyalari cho'kma, gaz yoki kuchsiz elektrolit hosil bo'lganda oxirigacha boradi."},
 {id:"metals",t:"Metallarning faolligi",goal:"Metallarning kislotalar va tuzlar bilan ta'sirini solishtirish.",steps:[
   A("HCl"),A("HCl","Yana xlorid kislota qo'shing."),A("mMg","Magniy lentasini tushiring."),{t:"Shiddatli H₂ ajralishini kuzating.",c:{rx:"m_Mg_H"}},CLEAN,
   A("HCl"),A("HCl","Yana xlorid kislota qo'shing."),A("mZn","Rux granulasini tushiring."),{t:"Rux sekinroq eriydi.",c:{rx:"m_Zn_H"}},CLEAN,
   A("HCl"),A("mCu","Mis simni tushiring."),{t:"Mis bilan hech qanday o'zgarish bo'lmayapti — kuzatib turing.",c:{wait:4,has:"mCu"}},CLEAN,
   A("CuSO4"),A("mFe","Temir mixni tushiring."),{t:"Mix sirtida qizil mis qatlami paydo bo'ldi.",c:{rx:"x_mFe_Cu"}}],
  end:"Faollik: Mg > Zn > (H) > Cu. Faolroq metall kamroq faol metallni tuzidan siqib chiqaradi: Fe + CuSO₄ → FeSO₄ + Cu."},
 {id:"oxygen",t:"Kislorod olish",goal:"Kislorodni ikki usulda olish.",steps:[
   A("H2O2","Vodorod peroksid quying."),A("MnO2","Katalizator — MnO₂ kukunidan soling."),{t:"Shiddatli kislorod ajralishini kuzating.",c:{rx:"r_H2O2cat"}},CLEAN,
   A("KMnO4s","Quruq probirkaga KMnO₄ kristallaridan soling."),{t:"Kristallarni kuchli qizdiring (200°C dan yuqori).",c:{rx:"h_KMnO4"}}],
  end:"2H₂O₂ → 2H₂O + O₂ (MnO₂ — katalizator); 2KMnO₄ → K₂MnO₄ + MnO₂ + O₂. Kislorod cho'g'langan cho'pni alangalatadi."},
 {id:"co2",t:"Karbonat angidrid olish va xossalari",goal:"CO₂ olish va unga sifat reaksiyasini o'tkazish.",steps:[
   A("mCaCO3","Marmar bo'lakchalarini soling."),A("HCl"),{t:"Marmarning CO₂ ajratib erishini kuzating.",c:{rx:"d_marble"}},CLEAN,
   A("CaOH2","Ohakli suv quying."),A("CO2","Kipp apparatidan CO₂ o'tkazing."),{t:"Ohakli suv loyqalandi.",c:{rx:"c_lime"}},
   A("CO2","CO₂ ni yana o'tkazing (2–3 marta)."),{t:"Ortiqcha CO₂ da loyqa yo'qoladi.",c:{rx:"c_CaCO3CO2"}}],
  end:"CaCO₃ + 2HCl → CaCl₂ + CO₂↑ + H₂O; Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O; ortiqcha CO₂ da CaCO₃ + CO₂ + H₂O → Ca(HCO₃)₂."},
 {id:"elec",t:"Tuz eritmalarining elektrolizi",goal:"Katod va anodda ajraladigan moddalarni aniqlash.",steps:[
   A("CuSO4"),{t:"Elektrolizni yoqing (⚡).",c:{elec:1}},{t:"Katodda qizil mis ajralishini kuzating.",c:{has:"dCu"}},CLEAN,
   A("NaCl"),A("php","Fenolftalein tomizing."),{t:"Elektrolizni yoqing: katod atrofida muhit ishqoriylashadi.",c:{all:[{rx:"e_W_Cl"},{ph:">8.2"}]}}],
  end:"CuSO₄: katodda Cu, anodda O₂; NaCl: katodda H₂ (OH⁻ to'planadi — fenolftalein malina), anodda Cl₂."},
 {id:"hydro",t:"Tuzlar gidrolizi",goal:"Tuz eritmalari muhitini universal indikator bilan aniqlash.",steps:[
   A("Na2CO3"),A("uni","Universal indikator tomizing."),{t:"Muhit ishqoriy (ko'k-binafsha).",c:{all:[{ind:"uni"},{ph:">9"}]}},CLEAN,
   A("NH4Cl"),A("uni","Universal indikator tomizing."),{t:"Muhit kuchsiz kislotali.",c:{all:[{ind:"uni"},{ph:"<6.5"}]}},CLEAN,
   A("NaCl"),A("uni","Universal indikator tomizing."),{t:"Muhit neytral.",c:{all:[{ind:"uni"},{phr:[6.5,7.5]}]}},CLEAN,
   A("CuSO4"),A("uni","Universal indikator tomizing."),{t:"Muhit kislotali.",c:{all:[{ind:"uni"},{ph:"<5"}]}}],
  end:"Na₂CO₃ — ishqoriy (CO₃²⁻ gidrolizi), NH₄Cl va CuSO₄ — kislotali (kation gidrolizi), NaCl — neytral (gidrolizlanmaydi)."},
 {id:"iron",t:"Temir ionlariga sifat reaksiyalari",goal:"Fe³⁺ va Fe²⁺ ionlarini aniqlash.",steps:[
   A("FeCl3"),A("KSCN"),{t:"Qon-qizil rang paydo bo'ldi.",c:{rx:"q_FeSCN"}},CLEAN,
   A("FeCl3"),A("NaOH"),{t:"Qo'ng'ir Fe(OH)₃ cho'kmasi tushdi.",c:{rx:"p_Fe3_OH"}},CLEAN,
   A("FeSO4"),A("NaOH"),{t:"Oq-yashil Fe(OH)₂ cho'kmasi tushdi.",c:{rx:"p_Fe2_OH"}},{t:"Kuting: havoda cho'kma asta qo'ng'irlashadi.",c:{rx:"a_FeOH2"}}],
  end:"Fe³⁺ + 3SCN⁻ → Fe(SCN)₃ (qon-qizil); Fe³⁺ + 3OH⁻ → Fe(OH)₃↓ (qo'ng'ir); Fe²⁺ + 2OH⁻ → Fe(OH)₂↓, 4Fe(OH)₂ + O₂ + 2H₂O → 4Fe(OH)₃."},
 {id:"amph",t:"Amfoter gidroksidlar",goal:"Al(OH)₃ ning kislota va ishqorda erishini kuzatish.",steps:[
   A("AlCl3"),A("NaOH"),A("NaOH","Yana NaOH qo'shing."),{t:"Oq iviqsimon Al(OH)₃ cho'kmasi tushdi.",c:{rx:"p_Al_OH"}},
   A("NaOH","NaOH ni ortiqcha qo'shing."),A("NaOH","Yana bir marta NaOH qo'shing."),{t:"Cho'kma ortiqcha ishqorda eriydi.",c:{rx:"a_AlOH"}},
   A("HCl","Endi xlorid kislota qo'shing."),{t:"Avval yana cho'kma tushadi.",c:{rx:"a_AlOH4H"}}],
  end:"Al(OH)₃ ham kislota, ham ishqor bilan reaksiyaga kirishadi: Al(OH)₃ + NaOH → Na[Al(OH)₄]; Al(OH)₃ + 3HCl → AlCl₃ + 3H₂O."},
 {id:"redox",t:"Muhitning oksidlanish-qaytarilishga ta'siri",goal:"KMnO₄ ning turli muhitda qaytarilishini solishtirish.",steps:[
   A("KMnO4"),A("H2SO4"),A("Na2SO3"),{t:"Kislotali muhitda rangsizlanish (Mn²⁺).",c:{rx:"r_MnSO3a"}},CLEAN,
   A("KMnO4"),A("H2O","Suv qo'shing (neytral muhit)."),A("Na2SO3"),{t:"Qo'ng'ir MnO₂ cho'kmasi (neytral muhit).",c:{rx:"r_MnSO3n"}},CLEAN,
   A("KMnO4"),A("KOH"),A("KOH","Yana KOH qo'shing."),A("Na2SO3"),{t:"Yashil rang — manganat ioni (ishqoriy muhit).",c:{rx:"r_MnSO3b"}}],
  end:"Kislotali: MnO₄⁻ → Mn²⁺; neytral: MnO₄⁻ → MnO₂↓; ishqoriy: MnO₄⁻ → MnO₄²⁻. Oksidlovchining kuchi muhitga bog'liq."},
 {id:"organic",t:"Organik moddalarning sifat reaksiyalari",goal:"Aldegid, kraxmal va ko'p atomli spirtni aniqlash.",steps:[
   A("CuSO4"),A("NaOH"),A("NaOH","Ishqorni ortiqcha qo'shing."),{t:"Cu(OH)₂ cho'kmasi tushdi.",c:{rx:"p_Cu_OH"}},
   A("C6H12O6","Glyukoza eritmasini qo'shing."),{t:"Aralashmani qizdiring — g'isht-qizil Cu₂O hosil bo'ladi.",c:{rx:"o_gluCu"}},CLEAN,
   A("starch"),A("I2","Yodli suv tomizing."),{t:"To'q ko'k rang paydo bo'ldi.",c:{rx:"o_starchI"}},CLEAN,
   A("tollens","Kumush oksidning ammiakli eritmasini quying."),A("CH3CHO","Etanal qo'shing."),{t:"Suv hammomida qizdiring — kumush ko'zgu hosil bo'ladi.",c:{rx:"o_aldAg"}}],
  end:"Glyukoza va aldegidlar Cu(OH)₂ ni Cu₂O gacha, [Ag(NH₃)₂]⁺ ni Ag gacha qaytaradi; kraxmal yod bilan ko'k rang beradi."}
];

/* ---------- O'zgarishlar zanjirlari: [reagent, noto'g'ri variantlar, mahsulot, tenglama] ---------- */
KL.CHAINS=[
 {t:"Mis",start:"Cu",steps:[["O₂, t°",["H₂O","NaOH"],"CuO","2Cu + O2 = 2CuO"],["HCl",["NaCl","H₂"],"CuCl2","CuO + 2HCl = CuCl2 + H2O"],["NaOH",["HCl","Na"],"Cu(OH)2","CuCl2 + 2NaOH = Cu(OH)2 + 2NaCl"],["t°",["H₂O","KCl"],"CuO","Cu(OH)2 = CuO + H2O"]]},
 {t:"Kalsiy",start:"Ca",steps:[["O₂",["H₂","N₂"],"CaO","2Ca + O2 = 2CaO"],["H₂O",["O₂","CO"],"Ca(OH)2","CaO + H2O = Ca(OH)2"],["CO₂",["NaCl","H₂"],"CaCO3","Ca(OH)2 + CO2 = CaCO3 + H2O"],["t° (≈900°C)",["HCl","H₂O"],"CaO","CaCO3 = CaO + CO2"]]},
 {t:"Oltingugurt",start:"S",steps:[["O₂",["H₂","N₂"],"SO2","S + O2 = SO2"],["O₂ (kat. V₂O₅)",["H₂O","CO₂"],"SO3","2SO2 + O2 = 2SO3"],["H₂O",["O₂","NaCl"],"H2SO4","SO3 + H2O = H2SO4"],["BaCl₂",["NaOH","H₂"],"BaSO4","H2SO4 + BaCl2 = BaSO4 + 2HCl"]]},
 {t:"Temir",start:"Fe",steps:[["Cl₂",["HCl","H₂O"],"FeCl3","2Fe + 3Cl2 = 2FeCl3"],["NaOH",["HCl","O₂"],"Fe(OH)3","FeCl3 + 3NaOH = Fe(OH)3 + 3NaCl"],["t°",["H₂O","NaCl"],"Fe2O3","2Fe(OH)3 = Fe2O3 + 3H2O"],["H₂, t°",["O₂","H₂O"],"Fe","Fe2O3 + 3H2 = 2Fe + 3H2O"]]},
 {t:"Uglerod",start:"C",steps:[["O₂ (mo'l)",["H₂","N₂"],"CO2","C + O2 = CO2"],["Ca(OH)₂",["HCl","NaCl"],"CaCO3","CO2 + Ca(OH)2 = CaCO3 + H2O"],["HCl",["NaOH","H₂"],"CO2","CaCO3 + 2HCl = CaCl2 + CO2 + H2O"],["Mg, t°",["H₂O","NaCl"],"C","CO2 + 2Mg = 2MgO + C"]]},
 {t:"Alyuminiy (amfoterlik)",start:"Al",steps:[["HCl",["H₂O","NaCl"],"AlCl3","2Al + 6HCl = 2AlCl3 + 3H2"],["NaOH (oz)",["HCl","H₂"],"Al(OH)3","AlCl3 + 3NaOH = Al(OH)3 + 3NaCl"],["NaOH (ortiqcha)",["H₂O","NaCl"],"Na[Al(OH)4]","Al(OH)3 + NaOH = Na[Al(OH)4]"],["HCl (oz)",["NaOH","O₂"],"Al(OH)3","Na[Al(OH)4] + HCl = Al(OH)3 + NaCl + H2O"]]},
 {t:"Azot",start:"N2",steps:[["H₂ (kat., p, t°)",["O₂","H₂O"],"NH3","N2 + 3H2 = 2NH3"],["HCl",["NaOH","H₂"],"NH4Cl","NH3 + HCl = NH4Cl"],["NaOH, t°",["HCl","H₂O"],"NH3","NH4Cl + NaOH = NaCl + NH3 + H2O"],["O₂ (kat. Pt)",["H₂","N₂"],"NO","4NH3 + 5O2 = 4NO + 6H2O"]]},
 {t:"Organik: metandan efirgacha",start:"CH4",steps:[["t° (1500°C)",["O₂","Cl₂"],"C2H2","2CH4 = C2H2 + 3H2"],["H₂O (Hg²⁺)",["H₂","HCl"],"CH3CHO","C2H2 + H2O = CH3CHO"],["Ag₂O (NH₃)",["H₂","NaOH"],"CH3COOH","CH3CHO + Ag2O = CH3COOH + 2Ag"],["C₂H₅OH (H⁺, t°)",["NaOH","H₂O"],"CH3COOC2H5","CH3COOH + C2H5OH = CH3COOC2H5 + H2O"]]},
 {t:"Organik: spirt va etilen",start:"C2H5OH",steps:[["H₂SO₄ (kons.), t° > 140°C",["NaOH","H₂"],"C2H4","C2H5OH = C2H4 + H2O"],["HBr",["H₂O","Br₂ (suvli)"],"C2H5Br","C2H4 + HBr = C2H5Br"],["NaOH (suvli)",["HBr","H₂"],"C2H5OH","C2H5Br + NaOH = C2H5OH + NaBr"],["CuO, t°",["H₂","NaCl"],"CH3CHO","C2H5OH + CuO = CH3CHO + Cu + H2O"]]}
];

/* ---------- Reaksiya turlarining izohi (Ustoz uchun) ---------- */
KL.TYPE_INFO={
 "Neytrallanish":"Kislotadagi H⁺ va asosdagi OH⁻ ionlari birikib kuchsiz elektrolit — suv hosil qiladi. Shuning uchun reaksiya oxirigacha boradi va issiqlik ajraladi.",
 "Ion almashinish":"Eritmadagi ionlar o'rin almashib, suvda erimaydigan modda (cho'kma) hosil qiladi. Qaysi birikma erimasligini eruvchanlik jadvalidan bilish mumkin.",
 "Gaz ajralishi":"Reaksiyada gaz hosil bo'lib eritmadan chiqib ketadi — ionlar eritmadan ketgani uchun reaksiya oxirigacha boradi.",
 "Kuchsiz elektrolit hosil bo'lishi":"Kuchliroq kislota (yoki asos) kuchsizrog'ini tuzidan siqib chiqaradi; kuchsiz elektrolit kam dissotsilanadi.",
 "Birgalikdagi gidroliz":"Kuchsiz asos kationi (Al³⁺, Fe³⁺) va kuchsiz kislota anioni (CO₃²⁻) bir-birining gidrolizini kuchaytiradi — gidroksid cho'kadi va gaz ajraladi.",
 "Oksidlanish-qaytarilish":"Elementlarning oksidlanish darajasi o'zgaradi: oksidlovchi elektron qabul qiladi, qaytaruvchi elektron beradi. Elektron balans usulida tenglashtiriladi.",
 "O'rin olish":"Oddiy modda (faolroq metall) murakkab moddadagi kamroq faol elementning o'rnini egallaydi. Faollik qatoriga qarang.",
 "Amfoterlik":"Amfoter gidroksidlar (Al(OH)₃, Zn(OH)₂) kislotalarda ham, ishqorlarda ham eriydi — ishqorda gidroksokomplekslar hosil bo'ladi.",
 "Kompleks hosil bo'lishi":"Markaziy ion (Cu²⁺, Ag⁺) ligandlar (NH₃) bilan barqaror kompleks ion hosil qiladi — cho'kma eriydi, rang o'zgaradi.",
 "Parchalanish":"Bitta murakkab modda qizdirilganda bir nechta oddiyroq moddalarga ajraladi.",
 "Sifat reaksiyasi":"Muayyan ion yoki moddani aniqlashga imkon beradigan, ko'zga yaqqol ko'rinadigan belgi (rang, cho'kma, gaz) bilan boradigan reaksiya.",
 "Elektroliz":"Elektr toki ta'sirida katodda qaytarilish, anodda oksidlanish boradi. Mahsulotlar ionlarning faolligiga bog'liq.",
 "Fotokimyoviy":"Yorug'lik energiyasi ta'sirida boradigan reaksiya. Kumush galogenidlarining qorayishi fotografiyada ishlatilgan.",
 "Katalitik parchalanish":"Katalizator reaksiyani tezlashtiradi, lekin o'zi sarflanmaydi.",
 "Eterifikatsiya":"Karbon kislota va spirt kislota katalizatorligida murakkab efir va suv hosil qiladi.",
 "Asos + kislota":"Erimaydigan asos kislotada erib tuz va suv hosil qiladi.",
 "Asosli oksid + kislota":"Asosli oksid kislota bilan tuz va suv hosil qiladi.",
 "Muvozanatning siljishi":"Le Shatelye tamoyili: muvozanatdagi zarrachalardan biri qo'shilsa yoki kamaysa, muvozanat shu ta'sirni kamaytiradigan tomonga siljiydi.",
 "Havoda oksidlanish":"Havo kislorodi moddani asta oksidlaydi; rang o'zgarishi shuni ko'rsatadi."
};

/* ---------- Yutuqlar: [id, belgi, nom, shart matni] ---------- */
KL.ACHS=[
 ["gear","🥽","Xavfsizlik birinchi","Himoya vositalarini to'liq kiying"],
 ["first_rx","🧪","Birinchi reaksiya","Laboratoriyada birinchi reaksiyani kuzating"],
 ["rx10","⚗️","Tajribachi","10 ta reaksiyani kashf eting"],
 ["rx30","🔬","Kashfiyotchi","30 ta reaksiyani kashf eting"],
 ["rx60","🏅","Tadqiqotchi","60 ta reaksiyani kashf eting"],
 ["rx100","👑","Kimyo ustasi","100 ta reaksiyani kashf eting"],
 ["qual5","🎯","Sifat reaksiyalari","5 ta sifat reaksiyasini bajaring"],
 ["elec","⚡","Elektrokimyogar","Elektroliz o'tkazing"],
 ["mirror","🪞","Kumush ko'zgu","Kumush ko'zgu reaksiyasini bajaring"],
 ["redox3","🎨","Uch muhit","KMnO₄ ni uch xil muhitda qaytaring"],
 ["ind4","🌈","Indikatorlar","4 xil indikatordan foydalaning"],
 ["evap","🧂","Kristallar","Eritmani bug'latib kristall oling"],
 ["prac1","🥼","Laborant","Birinchi amaliy ishni bajaring"],
 ["prac5","🧑‍🔬","Tajribali laborant","5 ta amaliy ishni bajaring"],
 ["prac_all","🏆","Barcha amaliy ishlar","Barcha amaliy ishlarni bajaring"],
 ["lesson1","📚","Talaba","Birinchi darsni tugating"],
 ["lesson_all","🎓","Bilimdon","Barcha darslarni tugating"],
 ["chain1","🔗","Zanjir","Birinchi zanjirni yeching"],
 ["chain_all","⛓️","Zanjirlar ustasi","Barcha zanjirlarni yeching"],
 ["mol10","⚛️","Molekulalar","10 ta molekulani 3D da ko'ring"],
 ["el30","📋","Jadval bilimdoni","30 ta elementni oching"],
 ["quiz10","🎯","Aniq nishon","Element viktorinasida 10 ta to'g'ri javob"],
 ["calc","🧮","Hisobchi","Hisoblash vositasidan foydalaning"],
 ["safe3","🧯","Xavfsizlik bilimdoni","Favqulodda holatda 3 marta to'g'ri harakat qiling"],
 ["safe_all","🚑","Qutqaruvchi","Barcha 7 turdagi favqulodda holatni to'g'ri hal qiling"],
 ["balance","⚖️","Tenglamachi","Tenglamani tenglashtiring"]
];
})(globalThis.KL=globalThis.KL||{});
// Amaliy ish qadamini tekshirish. ctx: {V, gear, focus, since:{add:Set, rx:Set, gas:Set, clean}, now, okSince}
(function(KL){
"use strict";
function base(c,x){
  const V=x.V,s=x.since;
  if(c.all&&!c.all.every(k=>base(k,x)))return false;
  if(c.add&&!s.add.has(c.add))return false;
  if(c.rx&&!(V.fired[c.rx]||s.rx.has(c.rx)))return false;
  if(c.has&&!V.has(c.has))return false;
  if(c.gear&&!x.gear)return false;
  if(c.focus&&!x.focus)return false;
  if(c.vessel&&V.type!==c.vessel)return false;
  if(c.T&&V.T<c.T)return false;
  if(c.heatOff&&V.heat)return false;
  if(c.elec&&!V.elec)return false;
  if(c.uv&&!V.uv)return false;
  if(c.ind&&!V.ind[c.ind])return false;
  if(c.clean&&!s.clean)return false;
  if(c.gas&&!(s.gas.has(c.gas)||(V.gasTot[c.gas]||0)>0))return false;
  if(c.ph||c.phr){const p=V.pH();if(p==null)return false;
    if(c.ph){const v=parseFloat(c.ph.slice(1));if(c.ph[0]==="<"?!(p<v):!(p>v))return false;}
    if(c.phr&&!(p>=c.phr[0]&&p<=c.phr[1]))return false;}
  return true;
}
KL.checkStep=function(c,x){
  const ok=base(c,x);
  if(!c.wait)return ok;
  if(!ok){x.okSince=null;return false;}
  if(x.okSince==null)x.okSince=x.now;
  return x.now-x.okSince>=c.wait;
};
})(globalThis.KL);
