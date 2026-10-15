# Organik kimyo → 1-mavzu: Alkanlar
# Savollar formati: (savol, [TO'G'RI javob, xato1, xato2, xato3], izoh)
# To'g'ri javob har doim birinchi yoziladi — qurish skripti variantlarni aralashtiradi.

NOM = "Alkanlar"
TAVSIF = "To'yingan uglevodorodlar: tuzilishi, nomlanishi, olinishi va xossalari"

NAZARIY_1 = {
    "nom": "Tuzilishi, nomlanishi va izomeriyasi",
    "bloklar": [
        ("h", "1. Alkanlar nima?"),
        ("p", "Alkanlar (to'yingan uglevodorodlar, parafinlar) — molekulasidagi uglerod atomlari bir-biri bilan faqat oddiy (yakka) bog'lar orqali bog'langan, ochiq zanjirli uglevodorodlar. Ularning umumiy formulasi:"),
        ("f", ["CₙH₂ₙ₊₂   (n ≥ 1)"]),
        ("p", "\"To'yingan\" degani — uglerod atomlarining barcha valentliklari vodorod va boshqa uglerod atomlari bilan to'liq band. Shu sababli alkanlar birikish reaksiyalariga kirishmaydi."),

        ("h", "2. Elektron va fazoviy tuzilishi"),
        ("ul", [
            "Alkanlarda har bir uglerod atomi sp³-gibridlangan holatda bo'ladi.",
            "Gibrid orbitallar tetraedr uchlariga yo'nalgan; valent burchak 109°28′.",
            "Metan CH₄ molekulasi muntazam tetraedr shaklida.",
            "Barcha bog'lar σ (sigma) bog'lar: C–C bog' uzunligi 0,154 nm, C–H bog' uzunligi 0,109 nm.",
            "σ-bog' atrofida erkin aylanish mumkin, shuning uchun uglerod zanjiri zigzag shaklida bo'ladi.",
        ]),

        ("h", "3. Gomologik qator"),
        ("p", "Tarkibi bir yoki bir necha CH₂ guruhiga farq qiladigan, tuzilishi va xossalari o'xshash moddalar gomologlar deyiladi. CH₂ — gomologik farq."),
        ("t", [
            ["Formula", "Nomi", "Formula", "Nomi"],
            ["CH₄", "metan", "C₆H₁₄", "geksan"],
            ["C₂H₆", "etan", "C₇H₁₆", "geptan"],
            ["C₃H₈", "propan", "C₈H₁₈", "oktan"],
            ["C₄H₁₀", "butan", "C₉H₂₀", "nonan"],
            ["C₅H₁₂", "pentan", "C₁₀H₂₂", "dekan"],
        ]),
        ("p", "Molyar massa: M(CₙH₂ₙ₊₂) = 14n + 2 g/mol."),

        ("h", "4. Radikallar va uglerod atomlarining turlari"),
        ("p", "Alkan molekulasidan bitta vodorod atomi chiqarilsa, alkil radikal hosil bo'ladi (umumiy formulasi CₙH₂ₙ₊₁–):"),
        ("ul", [
            "CH₃– metil;  C₂H₅– etil;  CH₃–CH₂–CH₂– propil;  (CH₃)₂CH– izopropil",
            "CH₃–CH₂–CH₂–CH₂– butil;  (CH₃)₂CH–CH₂– izobutil",
            "CH₃–CH₂–CH(CH₃)– sek-butil;  (CH₃)₃C– tert-butil",
        ]),
        ("p", "Uglerod atomi nechta boshqa uglerod atomi bilan bog'langaniga qarab: birlamchi (1 ta C bilan), ikkilamchi (2 ta), uchlamchi (3 ta) va to'rtlamchi (4 ta) bo'ladi."),

        ("h", "5. Sistematik (IUPAC) nomlash"),
        ("ul", [
            "Eng uzun uglerod zanjiri tanlanadi — u asosiy nomni beradi.",
            "Zanjir o'rinbosar (radikal) yaqin turgan uchidan raqamlanadi; o'rinbosarlar raqamlari yig'indisi eng kichik bo'lishi kerak.",
            "O'rinbosar oldidan uning raqami yoziladi; bir xil o'rinbosarlar soni di-, tri-, tetra- qo'shimchalari bilan ko'rsatiladi.",
            "Har xil o'rinbosarlar alifbo tartibida yoziladi, oxirida asosiy zanjir nomi keladi.",
        ]),
        ("f", [
            "CH₃–CH(CH₃)–CH₂–CH₃          2-metilbutan",
            "CH₃–C(CH₃)₂–CH₃              2,2-dimetilpropan",
            "CH₃–CH(CH₃)–CH(CH₃)–CH₃      2,3-dimetilbutan",
            "CH₃–CH(C₂H₅)–CH₂–CH₃         3-metilpentan (eng uzun zanjir — 5 ta C!)",
        ]),

        ("h", "6. Ratsional nomlash"),
        ("p", "Ratsional nomenklaturada alkan metanning hosilasi deb qaraladi. Eng ko'p tarmoqlangan uglerod atomi \"metan\" deb olinadi, unga birikkan radikallar oddiydan murakkabga qarab sanaladi va oxiriga \"metan\" qo'shiladi."),
        ("f", [
            "(CH₃)₃CH                      trimetilmetan (izobutan)",
            "CH₃–CH(CH₃)–CH₂–CH₃          dimetiletilmetan",
            "CH₃–C(CH₃)₂–CH₂–CH₃          trimetiletilmetan",
            "CH₃–CH₂–CH(CH₃)–CH₂–CH₃      metildietilmetan",
            "C(CH₃)₄                       tetrametilmetan",
        ]),

        ("h", "7. Izomeriya"),
        ("p", "Alkanlarda struktura (uglerod zanjiri) izomeriyasi butandan boshlab kuzatiladi. Izomerlar — molekulyar formulasi bir xil, tuzilishi va xossalari har xil moddalar."),
        ("t", [
            ["Alkan", "C₄H₁₀", "C₅H₁₂", "C₆H₁₄", "C₇H₁₆", "C₈H₁₈"],
            ["Izomerlar soni", "2", "3", "5", "9", "18"],
        ]),
        ("p", "Masalan, C₄H₁₀ ning izomerlari: butan CH₃–CH₂–CH₂–CH₃ va izobutan (2-metilpropan) CH₃–CH(CH₃)–CH₃."),

        ("h", "8. Fizik xossalari"),
        ("ul", [
            "C₁–C₄ — gazlar, C₅–C₁₅ — suyuqliklar, C₁₆ dan boshlab — qattiq moddalar (normal sharoitda).",
            "Suvda deyarli erimaydi, zichligi suvnikidan kichik; organik erituvchilarda yaxshi eriydi.",
            "Molyar massa ortishi bilan qaynash temperaturasi ortadi.",
            "Bir xil tarkibli izomerlardan tarmoqlanganlari pastroq temperaturada qaynaydi.",
        ]),
    ],
}

MASHQ_1 = {
    "nom": "Mashq: tuzilish va nomlash",
    "coin": 10,
    "savollar": [
        ("Alkanlarning umumiy formulasi qaysi?", ["CₙH₂ₙ₊₂", "CₙH₂ₙ", "CₙH₂ₙ₋₂", "CₙH₂ₙ₋₆"], "Alkanlar to'yingan uglevodorodlar: CₙH₂ₙ₊₂."),
        ("Alkanlarda uglerod atomlari qanday gibridlangan?", ["sp³", "sp²", "sp", "sp³d"], "Alkanlarda barcha uglerod atomlari sp³-gibridlangan."),
        ("Metan molekulasidagi H–C–H valent burchagi nechaga teng?", ["109°28′", "120°", "180°", "90°"], "sp³-gibridlanishda orbitallar tetraedr uchlariga yo'naladi, burchak 109°28′."),
        ("Metan molekulasi qanday fazoviy shaklga ega?", ["Tetraedr", "Tekis kvadrat", "Chiziqli", "Tekis uchburchak"], "Uglerod tetraedr markazida, 4 ta vodorod uning uchlarida."),
        ("Gomologik farq nimaga teng?", ["CH₂", "CH", "CH₃", "C₂H₄"], "Gomologlar bir-biridan CH₂ guruhga farq qiladi."),
        ("C₇H₁₆ formulali normal tuzilishli alkanning nomi:", ["geptan", "geksan", "oktan", "nonan"], "C₆ — geksan, C₇ — geptan, C₈ — oktan."),
        ("Quyidagilardan qaysi biri alkan?", ["C₆H₁₄", "C₅H₁₀", "C₄H₈", "C₇H₁₂"], "CₙH₂ₙ₊₂: n=6 da H soni 14 bo'ladi."),
        ("CH₃–CH(CH₃)–CH₂–CH₃ moddaning sistematik nomi:", ["2-metilbutan", "3-metilbutan", "pentan", "2-metilpropan"], "Asosiy zanjir 4 ta C (butan), metil 2-uglerodda; raqamlash o'rinbosarga yaqin uchdan."),
        ("CH₃–C(CH₃)₂–CH₃ moddaning sistematik nomi:", ["2,2-dimetilpropan", "2-metilpropan", "butan", "2,2-dimetilbutan"], "Asosiy zanjir 3 ta C (propan), 2-uglerodda ikkita metil."),
        ("CH₃–CH(CH₃)–CH(CH₃)–CH₃ moddaning sistematik nomi:", ["2,3-dimetilbutan", "2-metilpentan", "2,2-dimetilbutan", "3,4-dimetilbutan"], "Zanjir 4 ta C, metillar 2- va 3-uglerodda."),
        ("CH₃–CH₂–CH(CH₃)–CH₂–CH₃ moddaning sistematik nomi:", ["3-metilpentan", "2-etilbutan", "2-metilpentan", "geksan"], "Zanjir 5 ta C, metil o'rtadagi 3-uglerodda."),
        ("CH₃–CH(C₂H₅)–CH₂–CH₃ moddaning to'g'ri sistematik nomi:", ["3-metilpentan", "2-etilbutan", "2-metilpentan", "3-etilbutan"], "Eng uzun zanjir etil guruhi orqali o'tadi — 5 ta C. Demak bu 3-metilpentan; \"2-etilbutan\" noto'g'ri nom."),
        ("CH₃–C(CH₃)₂–CH₂–CH₃ moddaning ratsional nomi:", ["trimetiletilmetan", "dimetildietilmetan", "tetrametilmetan", "metiltrietilmetan"], "Markaziy (to'rtlamchi) uglerodga 3 ta metil va 1 ta etil birikkan."),
        ("CH₃–CH(CH₃)–CH₂–CH₃ moddaning ratsional nomi:", ["dimetiletilmetan", "metildietilmetan", "trimetilmetan", "metilpropilmetan"], "Uchlamchi uglerodga 2 ta metil va 1 ta etil birikkan."),
        ("Izobutan (CH₃)₃CH ning ratsional nomi:", ["trimetilmetan", "dimetiletilmetan", "tetrametilmetan", "metilpropilmetan"], "Markaziy CH ga 3 ta metil birikkan."),
        ("\"Metildietilmetan\" qaysi moddaning ratsional nomi?", ["3-metilpentan", "2-metilbutan", "2-metilpentan", "2,3-dimetilbutan"], "CH ga 1 ta metil va 2 ta etil: CH₃–CH₂–CH(CH₃)–CH₂–CH₃ = 3-metilpentan."),
        ("2,2,3-trimetilbutanning tuzilish formulasi:", ["CH₃–C(CH₃)₂–CH(CH₃)–CH₃", "CH₃–CH(CH₃)–CH(CH₃)–CH₃", "CH₃–C(CH₃)₂–CH₂–CH₂–CH₃", "CH₃–CH(CH₃)–CH₂–CH(CH₃)–CH₃"], "Butan zanjiri, 2-uglerodda ikkita, 3-uglerodda bitta metil."),
        ("2-metilpropanning molekulyar formulasi:", ["C₄H₁₀", "C₃H₈", "C₄H₈", "C₅H₁₂"], "Propan (3 C) + metil (1 C) = 4 ta C → C₄H₁₀."),
        ("2,2-dimetilbutan molekulasida nechta uglerod atomi bor?", ["6", "4", "5", "8"], "Butan (4 C) + 2 ta metil = 6 ta C (C₆H₁₄)."),
        ("Pentan C₅H₁₂ ning nechta struktura izomeri bor?", ["3", "2", "4", "5"], "Pentan, 2-metilbutan va 2,2-dimetilpropan."),
        ("Geksan C₆H₁₄ ning nechta struktura izomeri bor?", ["5", "3", "4", "6"], "Geksan, 2-metilpentan, 3-metilpentan, 2,2-dimetilbutan, 2,3-dimetilbutan."),
        ("CH₃–CH(CH₃)–CH₂–CH₃ molekulasida nechta uchlamchi uglerod atomi bor?", ["1", "0", "2", "3"], "Faqat 2-uglerod uchta uglerod bilan bog'langan."),
        ("CH₃–CH(CH₃)– radikalining nomi:", ["izopropil", "propil", "izobutil", "etil"], "Propanning o'rta uglerodidan H chiqarilsa izopropil hosil bo'ladi."),
        ("(CH₃)₃C– radikalining nomi:", ["tert-butil", "izobutil", "sek-butil", "butil"], "Erkin valentlik uchlamchi uglerodda — tert-butil."),
        ("Molyar massasi 72 g/mol bo'lgan alkan:", ["pentan", "butan", "geksan", "propan"], "14n + 2 = 72 → n = 5 → C₅H₁₂ (pentan)."),
        ("Butan C₄H₁₀ molekulasida nechta σ-bog' bor?", ["13", "10", "12", "14"], "3 ta C–C va 10 ta C–H bog': jami 13 ta σ-bog'."),
    ],
}

NAZARIY_2 = {
    "nom": "Olinishi va kimyoviy xossalari",
    "bloklar": [
        ("h", "1. Tabiiy manbalari"),
        ("p", "Alkanlarning asosiy manbalari — tabiiy gaz (80–97% metan), neft va neftning yo'ldosh gazlari. Neftni haydash orqali benzin, kerosin, dizel yoqilg'isi va boshqa fraksiyalar olinadi."),

        ("h", "2. Laboratoriya va sanoatda olinishi"),
        ("p", "a) Vyurs reaksiyasi — galogenalkanlarga metall natriy ta'siri (uglerod zanjiri ikki baravar uzayadi):"),
        ("f", ["2CH₃Cl + 2Na → CH₃–CH₃ + 2NaCl", "2C₂H₅Br + 2Na → C₄H₁₀ + 2NaBr"]),
        ("p", "Ikki xil galogenalkan aralashmasi olinsa, uch xil alkan hosil bo'ladi: CH₃Cl + C₂H₅Cl aralashmasidan etan, propan va butan."),
        ("p", "b) Dyuma usuli — karbon kislota tuzlarini ishqor bilan qizdirish (dekarboksillanish). Hosil bo'lgan alkanda uglerod bitta kam bo'ladi:"),
        ("f", ["CH₃COONa + NaOH →(t) CH₄↑ + Na₂CO₃", "C₂H₅COONa + NaOH →(t) C₂H₆↑ + Na₂CO₃"]),
        ("p", "c) Alyuminiy karbidining gidrolizi (metan olish):"),
        ("f", ["Al₄C₃ + 12H₂O → 4Al(OH)₃ + 3CH₄↑"]),
        ("p", "d) To'yinmagan uglevodorodlarni gidrogenlash:"),
        ("f", ["CH₂=CH₂ + H₂ →(Ni, t) CH₃–CH₃"]),
        ("p", "e) Kolbe usuli — karbon kislota tuzlari eritmasini elektroliz qilish (anodda alkan hosil bo'ladi):"),
        ("f", ["2CH₃COONa + 2H₂O →(elektroliz) C₂H₆ + 2CO₂ + H₂ + 2NaOH"]),
        ("p", "f) Sintez-gazdan (Fisher–Tropsh) va bevosita sintez:"),
        ("f", ["nCO + (2n+1)H₂ →(kat.) CₙH₂ₙ₊₂ + nH₂O", "C + 2H₂ →(Ni, t) CH₄"]),

        ("h", "3. Kimyoviy xossalari"),
        ("p", "Alkanlar kimyoviy jihatdan kam faol: oddiy sharoitda kislotalar, ishqorlar, KMnO₄ eritmasi va brom suvi bilan reaksiyaga kirishmaydi (ularni rangsizlantirmaydi). Ular uchun o'rin olish, parchalanish va yonish reaksiyalari xos."),
        ("p", "a) Yonish — ko'p issiqlik ajraladi:"),
        ("f", ["CH₄ + 2O₂ → CO₂ + 2H₂O + Q", "CₙH₂ₙ₊₂ + (3n+1)/2 O₂ → nCO₂ + (n+1)H₂O"]),
        ("p", "b) Galogenlash — yorug'lik (hν) ta'sirida boradigan radikal o'rin olish reaksiyasi. Vodorod atomlari ketma-ket almashinadi:"),
        ("f", ["CH₄ + Cl₂ →(hν) CH₃Cl + HCl   (xlormetan)", "CH₃Cl + Cl₂ →(hν) CH₂Cl₂ + HCl   (dixlormetan)", "CH₂Cl₂ + Cl₂ →(hν) CHCl₃ + HCl   (trixlormetan, xloroform)", "CHCl₃ + Cl₂ →(hν) CCl₄ + HCl   (tetraxlormetan)"]),
        ("p", "Vodorodning almashinish osonligi: uchlamchi > ikkilamchi > birlamchi uglerod atomida. Shu sababli propan bromlanganda asosan 2-brompropan hosil bo'ladi."),
        ("p", "c) Nitrolash (Konovalov reaksiyasi) — suyultirilgan nitrat kislota bilan qizdirish:"),
        ("f", ["CH₄ + HNO₃ →(t, p) CH₃NO₂ + H₂O"]),
        ("p", "d) Kreking — uzun zanjirli alkanlarning qizdirilganda alkan va alkenga parchalanishi:"),
        ("f", ["C₁₀H₂₂ →(t) C₅H₁₂ + C₅H₁₀"]),
        ("p", "e) Degidrogenlash va metanning piroliz:"),
        ("f", ["CH₃–CH₃ →(Ni, t) CH₂=CH₂ + H₂", "2CH₄ →(1500 °C) C₂H₂ + 3H₂"]),
        ("p", "f) Izomerlanish — normal zanjirning tarmoqlanishi:"),
        ("f", ["CH₃–CH₂–CH₂–CH₃ →(AlCl₃, t) CH₃–CH(CH₃)–CH₃"]),
        ("p", "g) Aromatlanish (degidrotsiklizatsiya):"),
        ("f", ["C₆H₁₄ →(Pt, t) C₆H₆ + 4H₂   (geksan → benzol)", "C₇H₁₆ →(Pt, t) C₆H₅–CH₃ + 4H₂   (geptan → toluol)"]),
        ("p", "h) Metan konversiyasi va katalitik oksidlanish:"),
        ("f", ["CH₄ + H₂O →(Ni, t) CO + 3H₂", "2C₄H₁₀ + 5O₂ →(kat.) 4CH₃COOH + 2H₂O"]),

        ("h", "4. Ishlatilishi"),
        ("ul", [
            "Yoqilg'i: tabiiy gaz, propan-butan aralashmasi, benzin, kerosin.",
            "Kimyo sanoati xomashyosi: vodorod, sintez-gaz, atsetilen, metanol, xlorli erituvchilar olish.",
            "Vazelin va parafin — tibbiyot va kosmetikada.",
        ]),
    ],
}

MASHQ_2 = {
    "nom": "Mashq: olinishi va xossalari",
    "coin": 15,
    "savollar": [
        ("CH₃Cl ga metall natriy ta'sir ettirilganda (Vyurs reaksiyasi) qaysi alkan hosil bo'ladi?", ["etan", "metan", "propan", "butan"], "2CH₃Cl + 2Na → C₂H₆ + 2NaCl — zanjir ikki baravar uzayadi."),
        ("C₂H₅Br va natriydan Vyurs reaksiyasida qaysi alkan olinadi?", ["butan", "etan", "propan", "geksan"], "2C₂H₅Br + 2Na → C₄H₁₀ + 2NaBr."),
        ("CH₃Cl va C₂H₅Cl aralashmasiga natriy ta'sir ettirilsa qaysi alkanlar hosil bo'ladi?", ["etan, propan va butan", "faqat propan", "metan va etan", "propan va butan"], "CH₃+CH₃ → etan, CH₃+C₂H₅ → propan, C₂H₅+C₂H₅ → butan."),
        ("Natriy asetat CH₃COONa ni NaOH bilan qizdirilganda qaysi gaz ajraladi?", ["metan", "etan", "etilen", "vodorod"], "Dyuma usuli: CH₃COONa + NaOH → CH₄ + Na₂CO₃."),
        ("Natriy propionat C₂H₅COONa ni NaOH bilan qizdirilganda qaysi alkan hosil bo'ladi?", ["etan", "propan", "metan", "butan"], "Dekarboksillanishda uglerod bitta kamayadi: C₂H₅COONa → C₂H₆."),
        ("Alyuminiy karbid Al₄C₃ suv bilan ta'sirlashganda qaysi gaz ajraladi?", ["metan", "atsetilen", "etan", "vodorod"], "Al₄C₃ + 12H₂O → 4Al(OH)₃ + 3CH₄."),
        ("1 mol alyuminiy karbiddan necha mol metan olinadi?", ["3", "1", "2", "4"], "Al₄C₃ + 12H₂O → 4Al(OH)₃ + 3CH₄ — 1 mol karbiddan 3 mol metan."),
        ("Metanning xlor bilan reaksiyasi qaysi turga kiradi?", ["Radikal o'rin olish", "Birikish", "Ajralish (eliminirlanish)", "Polimerlanish"], "Yorug'likda xlor radikallari vodorod atomlarini almashtiradi."),
        ("Metanni xlorlash qanday sharoitda boradi?", ["Yorug'lik (hν) ta'sirida", "Qorong'ida, sovuqda", "Suvli eritmada", "Faqat yuqori bosimda, qorong'ida"], "Radikal galogenlash yorug'lik yoki yuqori temperatura bilan boshlanadi."),
        ("CH₄ va Cl₂ 1:1 nisbatda yorug'likda reaksiyaga kirishsa asosiy organik mahsulot:", ["CH₃Cl", "CH₂Cl₂", "CCl₄", "C₂H₆"], "Birinchi bosqich: CH₄ + Cl₂ → CH₃Cl + HCl."),
        ("Xloroformning formulasi:", ["CHCl₃", "CCl₄", "CH₂Cl₂", "CH₃Cl"], "Xloroform — triklormetan, CHCl₃."),
        ("Konovalov reaksiyasi — bu:", ["Alkanlarni suyultirilgan nitrat kislota bilan nitrolash", "Alkanlarni gidrogenlash", "Alkanlar krekingi", "Alkanlarni xlorlash"], "CH₄ + HNO₃ → CH₃NO₂ + H₂O (qizdirib, bosim ostida)."),
        ("Metanning to'liq yonish tenglamasidagi barcha koeffitsientlar yig'indisi:", ["6", "4", "5", "7"], "CH₄ + 2O₂ → CO₂ + 2H₂O: 1 + 2 + 1 + 2 = 6."),
        ("1 mol propan to'liq yonishi uchun necha mol kislorod kerak?", ["5", "3", "4", "7"], "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O."),
        ("Alkanlar krekingida qanday moddalar hosil bo'ladi?", ["Alkan va alken", "Faqat alkin", "Spirt va suv", "Faqat vodorod"], "Masalan: C₁₀H₂₂ → C₅H₁₂ + C₅H₁₀."),
        ("Etanni nikel ishtirokida qizdirilganda (degidrogenlash) nima hosil bo'ladi?", ["etilen", "metan", "etanol", "benzol"], "CH₃–CH₃ → CH₂=CH₂ + H₂."),
        ("Metan 1500 °C da qizdirilib tez sovutilsa qaysi modda olinadi?", ["atsetilen", "etilen", "etan", "benzol"], "2CH₄ → C₂H₂ + 3H₂."),
        ("n-Butan AlCl₃ ishtirokida qizdirilganda qanday modda hosil bo'ladi?", ["izobutan", "buten-1", "butanol", "propan"], "Izomerlanish: normal zanjir tarmoqlangan zanjirga aylanadi (2-metilpropan)."),
        ("Geksan platina ishtirokida qizdirilganda (aromatlanish) qaysi modda hosil bo'ladi?", ["benzol", "toluol", "fenol", "siklogeksen"], "C₆H₁₄ → C₆H₆ + 4H₂."),
        ("Quyidagi reaksiyalardan qaysi biri alkanlar uchun xos EMAS?", ["Vodorodni biriktirish (gidrogenlash)", "Yonish", "Galogenlash", "Kreking"], "Alkanlar to'yingan — ular birikish reaksiyalariga kirishmaydi."),
        ("Alkanlar brom suvini rangsizlantiradimi?", ["Yo'q, rangsizlantirmaydi", "Ha, darhol rangsizlantiradi", "Faqat metan rangsizlantiradi", "Faqat qattiq alkanlar"], "Alkanlarda π-bog' yo'q, shuning uchun brom suvi va KMnO₄ rangsizlanmaydi."),
        ("Metan konversiyasi CH₄ + H₂O →(Ni, t) mahsulotlari:", ["CO + 3H₂", "CO₂ + 2H₂", "CH₃OH + H₂", "C + 2H₂O"], "Sintez-gaz (CO + H₂) olish usuli."),
        ("Propan yorug'likda bromlanganda asosiy mahsulot:", ["2-brompropan", "1-brompropan", "1,2-dibrompropan", "1,3-dibrompropan"], "Ikkilamchi uglerod atomidagi vodorod osonroq almashinadi."),
        ("Natriy asetat eritmasi elektroliz qilinganda (Kolbe usuli) qaysi uglevodorod hosil bo'ladi?", ["etan", "metan", "propan", "etilen"], "Ikki CH₃ radikali birikadi: 2CH₃COO⁻ → C₂H₆ + 2CO₂ + 2e⁻."),
    ],
}

MASHQ_3 = {
    "nom": "Aralash savollar",
    "coin": 15,
    "savollar": [
        ("11,2 l (n.sh.) metan to'liq yonganda necha litr CO₂ hosil bo'ladi?", ["11,2", "5,6", "22,4", "33,6"], "CH₄ → CO₂ — hajmlar teng: 11,2 l."),
        ("0,5 mol propan to'liq yonganda necha gramm suv hosil bo'ladi?", ["36", "18", "27", "72"], "C₃H₈ → 4H₂O: 0,5 mol → 2 mol suv = 2 · 18 = 36 g."),
        ("Havoga nisbatan zichligi 2 ga teng alkanni aniqlang.", ["butan", "propan", "pentan", "etan"], "M = 2 · 29 = 58 → 14n + 2 = 58 → n = 4 (C₄H₁₀)."),
        ("Vodorodga nisbatan zichligi 15 ga teng alkan:", ["etan", "metan", "propan", "butan"], "M = 15 · 2 = 30 → C₂H₆."),
        ("16 g metanni yoqish uchun (n.sh.) necha litr kislorod kerak?", ["44,8", "22,4", "11,2", "67,2"], "16 g = 1 mol CH₄; CH₄ + 2O₂ → 2 mol O₂ = 44,8 l."),
        ("Uglerodning massa ulushi 75% bo'lgan alkan:", ["metan", "etan", "propan", "butan"], "CH₄: 12/16 = 0,75. Etanda 80%, propanda ≈81,8%."),
        ("1 mol geptan to'liq yonishi uchun necha mol kislorod sarflanadi?", ["11", "9", "10", "12"], "(3n+1)/2 = (3·7+1)/2 = 11."),
        ("Qaysi modda 2-metilbutanning izomeri?", ["2,2-dimetilpropan", "butan", "2-metilpentan", "geksan"], "Ikkalasi ham C₅H₁₂, tuzilishi har xil."),
        ("Gomologlar juftligini toping.", ["etan va propan", "butan va izobutan", "etan va etilen", "metan va metanol"], "Etan va propan CH₂ ga farq qiladi; butan–izobutan esa izomerlar."),
        ("Metanni to'liq xlorlashdan hosil bo'ladigan CCl₄ ning nomi:", ["tetraxlormetan", "xloroform", "dixlormetan", "xlormetan"], "CCl₄ — tetraxlormetan (uglerod tetraxlorid)."),
        ("2-xlorpropanga natriy ta'sir ettirilsa (Vyurs) qaysi alkan hosil bo'ladi?", ["2,3-dimetilbutan", "geksan", "2-metilpentan", "3-metilpentan"], "Ikki izopropil radikali birikadi: (CH₃)₂CH–CH(CH₃)₂."),
        ("Natriy butirat C₃H₇COONa dan Dyuma usulida qaysi alkan olinadi?", ["propan", "butan", "etan", "pentan"], "Uglerod bitta kamayadi: C₃H₇COONa → C₃H₈."),
        ("5,6 l (n.sh.) alkanning massasi 11 g. Bu qaysi alkan?", ["propan", "butan", "etan", "pentan"], "n = 5,6 / 22,4 = 0,25 mol; M = 11 / 0,25 = 44 → C₃H₈."),
        ("Alkanlarda struktura izomeriyasi qaysi moddadan boshlab kuzatiladi?", ["butan", "etan", "propan", "pentan"], "C₄H₁₀ — birinchi bo'lib ikkita izomerga ega (butan va izobutan)."),
        ("Izooktan (2,2,4-trimetilpentan) ning molekulyar formulasi:", ["C₈H₁₈", "C₇H₁₆", "C₉H₂₀", "C₈H₁₆"], "Pentan (5 C) + 3 ta metil = 8 ta C → C₈H₁₈."),
        ("Metandagi uglerodning oksidlanish darajasi:", ["−4", "+4", "0", "−2"], "H ning darajasi +1: x + 4·(+1) = 0 → x = −4."),
        ("Etandagi uglerodning oksidlanish darajasi:", ["−3", "−2", "+3", "−4"], "2x + 6·(+1) = 0 → x = −3."),
        ("2 mol etan to'liq yonganda (n.sh.) necha litr CO₂ hosil bo'ladi?", ["89,6", "44,8", "67,2", "22,4"], "2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O: 4 mol · 22,4 = 89,6 l."),
        ("Quyidagilardan qaysi birining qaynash temperaturasi eng yuqori?", ["geksan", "pentan", "2-metilbutan", "2,2-dimetilpropan"], "Molyar massa ortgani sari qaynash temperaturasi oshadi; tarmoqlanish uni pasaytiradi."),
        ("Normal sharoitda suyuq holatda bo'ladigan alkan:", ["pentan", "propan", "butan", "metan"], "C₁–C₄ gazlar, C₅ dan boshlab suyuqlik."),
        ("Butan va izobutan bir-biriga nisbatan qanday moddalar?", ["izomerlar", "gomologlar", "allotroplar", "bir xil modda"], "Formulasi bir xil (C₄H₁₀), tuzilishi har xil."),
        ("1 mol metan va 2 mol xlor yorug'likda reaksiyaga kirishsa, asosiy organik mahsulot:", ["CH₂Cl₂", "CH₃Cl", "CHCl₃", "CCl₄"], "Ikki marta o'rin olish: CH₄ + 2Cl₂ → CH₂Cl₂ + 2HCl."),
    ],
}

BOSQICHLAR = [
    {"tur": "nazariy", **NAZARIY_1},
    {"tur": "mashq", **MASHQ_1},
    {"tur": "nazariy", **NAZARIY_2},
    {"tur": "mashq", **MASHQ_2},
    {"tur": "mashq", **MASHQ_3},
]
