# Organik kimyo → Alkadiyenlar
# Manba: ustozning "Alkadiyenlar — student book" va "mashq daftari (javoblar)" PDF'lari.
# Savollar formati: (savol, [TO'G'RI javob, xato1, xato2, xato3], izoh[, {"rasm": "..."}])
#   yoki to'g'ri/noto'g'ri: ("tf", tasdiq, True|False, izoh)
# Rasm yo'llari assets/kurslar/ ga nisbatan.

NOM = "Alkadiyenlar"
TAVSIF = "Diyen uglevodorodlar: tuzilishi, nomlanishi, olinishi, xossalari va kauchuklar"
R = "organik/alkadiyenlar/"

NAZARIY_1 = {
    "nom": "Tuzilishi, nomlanishi va izomeriyasi",
    "pdf_manba": ("organik/fayllar/alkadiyenlar_kitob.pdf", 1, 7),
    "bloklar": [
        ("h", "1. Alkadiyenlar nima?"),
        ("p", "Uglerod zanjirida ikkita qo'sh bog' bo'lgan to'yinmagan uglevodorodlar alkadiyenlar (diyen uglevodorodlar) deyiladi. Ular alkinlar bilan sinflararo izomer."),
        ("f", ["CₙH₂ₙ₋₂   (n ≥ 3)"]),

        ("h", "2. Qo'sh bog'larning joylashishiga ko'ra turlari"),
        ("ul", [
            "Kumulyativ (allen tipidagi) — qo'sh bog'lar bitta uglerodda yonma-yon: CH₂=C=CH₂.",
            "Konyugirlangan (tutash, butadiyen-1,3 tipidagi) — qo'sh va oddiy bog'lar navbatma-navbat: CH₂=CH–CH=CH₂.",
            "Izolyatsiyalangan (ajralgan) — qo'sh bog'lar ikki va undan ortiq oddiy bog' bilan ajralgan: CH₂=CH–CH₂–CH=CH₂.",
        ]),

        ("h", "3. Tuzilishi"),
        ("ul", [
            "Butadiyen-1,3: to'rtala uglerod sp²-gibridlangan, molekula yassi. To'rtta p-orbital o'zaro qoplanib yagona π-elektron tizimi hosil qiladi — bu konyugatsiya (tutashuv) deyiladi.",
            "Konyugatsiya natijasida bog' uzunliklari tenglashadi: C1=C2 ≈ 0,137 nm (oddiy qo'sh bog' 0,134 nm), C2–C3 ≈ 0,147 nm (oddiy bog' 0,154 nm). Shuning uchun konyugirlangan diyenlar barqarorroq va ularga 1,4-birikish xos.",
            "Allen: o'rtadagi uglerod sp, chetdagilari sp²-gibridlangan; C=C=C chiziqli (180°), ikkala π-bog' o'zaro perpendikulyar tekisliklarda yotadi.",
            "Izolyatsiyalangan diyenlarda har bir qo'sh bog' alohida, xossalari oddiy alkenlarnikiga o'xshaydi.",
        ]),

        ("h", "4. Umumiy formulalar (CₙH₂ₙ₋₂)"),
        ("t", [
            ["Ko'rsatkich", "Ifoda", "Butadiyen-1,3 (C₄H₆)"],
            ["Molyar massa", "M = 14n – 2", "54"],
            ["Vodorod bo'yicha zichlik", "D(H₂) = 7n – 1", "27"],
            ["σ-bog'lar soni", "3n – 3", "9"],
            ["π-bog'lar soni", "2", "2"],
            ["C–H bog'lari", "2n – 2", "6"],
            ["C–C bog'lari (σ)", "n – 1", "3"],
            ["Jami atomlar", "3n – 2", "10"],
        ]),
        ("f", ["CₙH₂ₙ₋₂ + (1,5n – 0,5)O₂ → nCO₂ + (n – 1)H₂O", "2C₄H₆ + 11O₂ → 8CO₂ + 6H₂O"]),

        ("h", "5. Sistematik nomlash"),
        ("ul", [
            "Ikkala qo'sh bog'ni saqlagan eng uzun zanjir tanlanadi.",
            "Zanjir qo'sh bog'lar yaqin tomondan raqamlanadi (qo'sh bog'lar raqami eng kichik bo'lishi kerak).",
            "Radikallar alifbo tartibida, o'rni ko'rsatilgan holda aytiladi.",
            "Alkan nomidagi «-an» o'rniga «-adiyen» qo'shiladi va ikkala qo'sh bog' o'rni yoziladi: butan → butadiyen-1,3; pentan → pentadiyen-1,4.",
        ]),
        ("f", [
            "CH₂=C(CH₃)–CH=CH₂              2-metilbutadiyen-1,3 (izopren)",
            "CH₂=CH–CH=C(CH₃)–CH₃           4-metilpentadiyen-1,3",
        ]),

        ("h", "6. Tarixiy (trivial) nomlar"),
        ("t", [
            ["Formula", "Sistematik", "Tarixiy"],
            ["CH₂=C=CH₂", "propadiyen", "allen"],
            ["CH₂=C=CH–CH₃", "butadiyen-1,2", "metilallen"],
            ["CH₂=CH–CH=CH₂", "butadiyen-1,3", "divinil"],
            ["CH₂=C(CH₃)–CH=CH₂", "2-metilbutadiyen-1,3", "izopren"],
            ["CH₂=C(Cl)–CH=CH₂", "2-xlorbutadiyen-1,3", "xloropren"],
            ["CH₂=C(CH₃)–C(CH₃)=CH₂", "2,3-dimetilbutadiyen-1,3", "metilizopren"],
            ["CH₂=CH–CH=CH–CH₃", "pentadiyen-1,3", "piperilen"],
            ["CH₂=CH–CH₂–CH=CH₂", "pentadiyen-1,4", "divinilmetan"],
            ["CH₃–CH=C=CH–CH₃", "pentadiyen-2,3", "dimetilallen"],
            ["CH₂=CH–CH₂–CH₂–CH=CH₂", "geksadiyen-1,5", "diallil"],
        ]),

        ("h", "7. Izomeriyasi"),
        ("p", "Alkadiyenlarda uglerod zanjiri, qo'sh bog'lar holati, sinflararo va fazoviy (sis-trans) izomeriya uchraydi."),
        ("p", "C₅H₈ tarkibli alkadiyenlarning 6 ta struktura izomeri:"),
        ("rasmlar", [
            [R + "izomer_01.png", "pentadiyen-1,2"], [R + "izomer_02.png", "pentadiyen-1,3"],
            [R + "izomer_03.png", "pentadiyen-1,4"], [R + "izomer_04.png", "pentadiyen-2,3"],
            [R + "izomer_05.png", "2-metilbutadiyen-1,3 (izopren)"], [R + "izomer_06.png", "3-metilbutadiyen-1,2"],
        ]),
        ("p", "Pentadiyen-1,3 ning sis- va trans-shakllarini hisobga olsak — 7 ta. C₅H₈ tarkibli alkinlar: pentin-1, pentin-2, 3-metilbutin-1 (3 ta)."),
        ("p", "Sinflararo izomeriya: alkadiyenlar CₙH₂ₙ₋₂ formulali alkinlar (hamda sikloalkenlar) bilan izomer. C₄H₆ uchun:"),
        ("rasmlar", [
            [R + "izomer_07.png", "butadiyen-1,3"], [R + "izomer_08.png", "butadiyen-1,2"],
            [R + "izomer_09.png", "butin-1"], [R + "izomer_10.png", "butin-2"],
        ]),
        ("p", "Fazoviy (sis-trans) izomeriya: qo'sh bog'dagi har bir uglerod ikki xil o'rinbosarga ega bo'lsa mumkin. Masalan, pentadiyen-1,3 (piperilen) da C3=C4 bog' bo'yicha sis- va trans-shakl bor. Butadiyen-1,3, izopren va allen sis-trans izomerga ega emas. Geksadiyen-2,4 da uchta fazoviy izomer bor: trans,trans; sis,sis; sis,trans."),

        ("h", "8. Fizik xossalari"),
        ("ul", [
            "Allen va butadiyen-1,3 — normal sharoitda gaz; izopren, xloropren, 2,3-dimetilbutadiyen-1,3 va boshqa diyenlar — suyuqlik.",
            "Suvda deyarli erimaydi, organik erituvchilarda yaxshi eriydi; zichligi suvnikidan kichik.",
            "Molyar massa ortishi bilan qaynash temperaturasi va zichlik ortadi.",
        ]),
        ("t", [
            ["Modda", "Formula", "Holati", "t qay., °C"],
            ["allen", "C₃H₄", "gaz", "–34"],
            ["butadiyen-1,3", "C₄H₆", "gaz", "–4,4"],
            ["pentadiyen-1,4", "C₅H₈", "suyuq", "26"],
            ["izopren", "C₅H₈", "suyuq", "34"],
            ["piperilen (trans)", "C₅H₈", "suyuq", "42"],
            ["xloropren", "C₄H₅Cl", "suyuq", "59"],
            ["2,3-dimetilbutadiyen-1,3", "C₆H₁₀", "suyuq", "69"],
        ]),
    ],
}

NAZARIY_2 = {
    "nom": "Olinishi, kimyoviy xossalari va kauchuklar",
    "pdf_manba": ("organik/fayllar/alkadiyenlar_kitob.pdf", 8, 12),
    "bloklar": [
        ("h", "1. Olinishi"),
        ("p", "a) Lebedev usuli — etil spirtdan (MgO, ZnO yoki Al₂O₃, 400–500 °C). S. V. Lebedev 1928-yilda taklif qilgan; 1932-yildan butadiyen sanoatda shu usulda olina boshlagan:"),
        ("f", ["2CH₃–CH₂–OH →(ZnO, 450 °C) CH₂=CH–CH=CH₂ + 2H₂O + H₂"]),
        ("p", "b) Alkanlar va alkenlarni degidrogenlash (Cr₂O₃/Al₂O₃, ≈ 600 °C):"),
        ("f", ["CH₃–CH₂–CH₂–CH₃ →(t, kat.) CH₂=CH–CH=CH₂ + 2H₂", "CH₂=CH–CH₂–CH₃ →(t, kat.) CH₂=CH–CH=CH₂ + H₂", "CH₃–CH(CH₃)–CH₂–CH₃ →(t, kat.) CH₂=C(CH₃)–CH=CH₂ + 2H₂   (izopentan → izopren)"]),
        ("p", "c) Glikollarni degidratlash:"),
        ("f", ["CH₂(OH)–CH₂–CH(OH)–CH₃ →(H⁺, t) CH₂=CH–CH=CH₂ + 2H₂O"]),
        ("p", "d) Digalogenalkanlarga KOH ning spirtli eritmasi ta'siri:"),
        ("f", ["CH₂Br–CH₂–CH₂–CH₂Br + 2KOH →(spirt, t) CH₂=CH–CH=CH₂ + 2KBr + 2H₂O"]),
        ("p", "e) Xloropren — vinilatsetilenga HCl biriktirib; allen — 2,3-dibrompropenga rux ta'sirida:"),
        ("f", ["CH≡C–CH=CH₂ + HCl →(kat.) CH₂=C(Cl)–CH=CH₂", "CH₂Br–CBr=CH₂ + Zn → CH₂=C=CH₂ + ZnBr₂"]),

        ("h", "2. Kimyoviy xossalari"),
        ("p", "Ikkita π-bog' borligi uchun diyenlar alkenlarga o'xshab birikish, oksidlanish va polimerlanish reaksiyalariga kirishadi. Konyugirlangan diyenlar uchun 1,2- va 1,4-birikish xos."),
        ("ul", [
            "1,2-birikish — reagent bitta qo'sh bog'ga (C1 va C2 ga) birikadi.",
            "1,4-birikish — reagent chetki C1 va C4 ga birikadi, qo'sh bog' o'rtaga (C2=C3) ko'chadi.",
            "Past haroratda 1,2-, yuqoriroq haroratda asosan 1,4-mahsulot hosil bo'ladi.",
        ]),
        ("p", "a) Gidrogenlash (Ni, Pt, t):"),
        ("f", ["CH₂=CH–CH=CH₂ + H₂ →(1,2) CH₃–CH₂–CH=CH₂   buten-1", "CH₂=CH–CH=CH₂ + H₂ →(1,4) CH₃–CH=CH–CH₃   buten-2", "CH₂=CH–CH=CH₂ + 2H₂ →(Ni, t) CH₃–CH₂–CH₂–CH₃   butan"]),
        ("p", "b) Galogenlash (I. Tile o'rgangan). Bromli suv rangsizlanadi — sifat reaksiya:"),
        ("f", ["CH₂=CH–CH=CH₂ + Br₂ →(1,2) CH₂Br–CHBr–CH=CH₂   3,4-dibrombuten-1", "CH₂=CH–CH=CH₂ + Br₂ →(1,4) CH₂Br–CH=CH–CH₂Br   1,4-dibrombuten-2", "CH₂=CH–CH=CH₂ + 2Br₂ → CH₂Br–CHBr–CHBr–CH₂Br   1,2,3,4-tetrabrombutan"]),
        ("p", "c) Galogenvodorodlarning birikishi:"),
        ("f", ["CH₂=CH–CH=CH₂ + HCl →(1,2) CH₃–CHCl–CH=CH₂   3-xlorbuten-1", "CH₂=CH–CH=CH₂ + HCl →(1,4) CH₃–CH=CH–CH₂Cl   1-xlorbuten-2"]),
        ("p", "d) Oksidlanish. KMnO₄ eritmasini rangsizlantiradi (sifat reaksiya). Yumshoq oksidlanganda (Vagner) to'rt atomli spirt, qattiq oksidlanganda qo'sh bog'lar uzilib kislotalar va CO₂ hosil bo'ladi:"),
        ("f", ["CH₂=CH–CH=CH₂ + 2[O] + 2H₂O →(KMnO₄) CH₂(OH)–CH(OH)–CH(OH)–CH₂(OH)", "CH₂=CH–CH=CH₂ + 10[O] →(KMnO₄, H⁺) 2CO₂ + HOOC–COOH + 2H₂O", "2C₄H₆ + 11O₂ → 8CO₂ + 6H₂O"]),
        ("p", "e) Polimerlanish. Diyenlar katalizator (masalan, Na) yoki ultrabinafsha nur ta'sirida asosan 1,4-holat bo'yicha oson polimerlanadi; har bir zvenoda bitta qo'sh bog' qoladi:"),
        ("f", ["nCH₂=CH–CH=CH₂ →(Na) (–CH₂–CH=CH–CH₂–)ₙ   butadiyen kauchugi", "nCH₂=C(CH₃)–CH=CH₂ →(kat.) (–CH₂–C(CH₃)=CH–CH₂–)ₙ   izopren kauchugi", "nCH₂=C(Cl)–CH=CH₂ →(kat.) (–CH₂–C(Cl)=CH–CH₂–)ₙ   xloropren kauchugi"]),
        ("p", "Sopolimerlanish — ikki xil monomerning birgalikda polimerlanishi: butadiyen + stirol → butadiyen-stirol kauchugi; butadiyen + akrilonitril → butadiyen-nitril kauchugi (moy va benzinga chidamli)."),

        ("h", "3. Kauchuklar va rezina"),
        ("ul", [
            "Tabiiy kauchuk kauchukli o'simliklar (masalan, Braziliya geveyasi) sutsimon shirasi — lateksdan olinadi.",
            "Tarkibi (C₅H₈)ₙ — izopren polimeri; tuzilishi sis-1,4-poliizopren. Trans-1,4-poliizopren — guttapercha (elastik emas).",
            "Elastik, suv va gaz o'tkazmaydi, elektr tokini o'tkazmaydi; benzinda bo'kadi va eriydi. Issiqda yopishqoq, sovuqda mo'rt bo'lib qoladi.",
            "Vulkanizatsiya — kauchukni oltingugurt bilan qizdirish (Ch. Gudyir, 1839). Makromolekulalar orasida –S–S– «ko'priklar» hosil bo'lib, mustahkamlik, elastiklik va haroratga chidamlilik ortadi.",
        ]),
        ("t", [
            ["Mahsulot", "Oltingugurt miqdori", "Xossasi"],
            ["rezina", "≈ 1–3 %", "elastik, mustahkam"],
            ["ebonit", "≈ 30–40 %", "qattiq, elektr izolyatori"],
        ]),
        ("t", [
            ["Kauchuk", "Monomer", "Xususiyati"],
            ["butadiyen (SKB)", "butadiyen-1,3", "birinchi sintetik kauchuk (Lebedev)"],
            ["izopren (SKI)", "izopren", "tabiiy kauchukka eng yaqin"],
            ["xloropren (neopren)", "xloropren", "moy, benzin va olovga chidamli"],
            ["butadiyen-stirol (SKS)", "butadiyen + stirol", "yeyilishga chidamli; avtoshina"],
            ["butadiyen-nitril (SKN)", "butadiyen + akrilonitril", "moy-benzinga chidamli"],
        ]),

        ("h", "4. Ishlatilishi"),
        ("ul", [
            "Butadiyen-1,3 — sintetik kauchuklar (SKB, SKS, SKN) va plastmassalar (masalan, ABS-plastik) xomashyosi.",
            "Izopren — izopren kauchugi va butil kauchuk (izobutilen bilan) olishda; xloropren — neopren kauchugi olishda.",
            "Rezina buyumlar: avtomobil shinalari, konveyer tasmalari, shlanglar, poyabzal, tibbiy buyumlar; ebonit — elektr izolyatsion materiallar.",
            "Diyenlarni aniqlash: bromli suv va KMnO₄ eritmasi rangsizlanadi. 1 mol konyugirlangan diyen 2 mol gacha Br₂ yoki H₂ biriktiradi.",
        ]),
    ],
}

def _sk(n): return {"rasm": R + "skelet_%02d.png" % n}
SK = "Skelet formulasi berilgan moddaning sistematik nomi:"

MASHQ_1 = {
    "nom": "Mashq: nomlash, turlar va izomeriya",
    "coin": 10,
    "savollar": [
        # 1A. Skelet formula → nomi (mashq daftari, rasmli)
        (SK, ["butadiyen-1,3", "butadiyen-1,2", "pentadiyen-1,3", "propadiyen"], "To'rtta uglerod, qo'sh bog'lar 1- va 3-uglerodda.", _sk(1)),
        (SK, ["pentadiyen-1,4", "pentadiyen-1,3", "pentadiyen-1,2", "geksadiyen-1,5"], "Besh uglerod, qo'sh bog'lar ikki chetda — ular orasida CH₂ bor (izolyatsiyalangan).", _sk(3)),
        (SK, ["2-metilbutadiyen-1,3", "3-metilbutadiyen-1,3", "pentadiyen-1,3", "2-metilbutadiyen-1,2"], "Butadiyen-1,3 zanjiri, 2-uglerodda metil — izopren.", _sk(4)),
        (SK, ["pentadiyen-1,3", "pentadiyen-1,4", "pentadiyen-2,4", "geksadiyen-1,3"], "Raqamlash qo'sh bog'lar yaqin uchdan: 1,3 (2,4 emas).", _sk(5)),
        (SK, ["geksadiyen-2,4", "geksadiyen-1,3", "geksadiyen-3,5", "pentadiyen-1,3"], "Olti uglerod, qo'sh bog'lar 2- va 4-uglerodda.", _sk(6)),
        (SK, ["2,3-dimetilbutadiyen-1,3", "2-metilpentadiyen-1,3", "2,3-dimetilbutadiyen-1,2", "geksadiyen-1,3"], "Butadiyen-1,3 zanjiri, 2- va 3-uglerodda metil (metilizopren).", _sk(7)),
        (SK, ["3-metilpentadiyen-1,3", "3-metilpentadiyen-2,4", "2-metilpentadiyen-1,3", "3-metilgeksadiyen-1,3"], "Besh uglerodli zanjir qo'sh bog'lar yaqin uchdan raqamlanadi; metil 3-uglerodda.", _sk(8)),
        (SK, ["2-metilpentadiyen-1,4", "4-metilpentadiyen-1,4", "2-metilpentadiyen-1,3", "2-metilbutadiyen-1,3"], "Qo'sh bog'lar 1 va 4; ikkala uchdan ham bir xil bo'lgani uchun metilga kichik raqam — 2.", _sk(9)),
        (SK, ["2-xlorbutadiyen-1,3", "3-xlorbutadiyen-1,3", "1-xlorbutadiyen-1,3", "2-xlorbutadiyen-1,2"], "Xlor 2-uglerodda — xloropren.", _sk(11)),
        (SK, ["3-etilpentadiyen-1,4", "3-etilpentadiyen-1,3", "3-metilgeksadiyen-1,5", "3-etilbutadiyen-1,3"], "Ikkala qo'sh bog'ni saqlagan eng uzun zanjir — 5 ta C; etil 3-uglerodda.", _sk(12)),
        # 1B. Yoyilgan formula → nomi
        ("CH₂=C=CH–CH₃ moddaning sistematik nomi:", ["butadiyen-1,2", "butadiyen-1,3", "propadiyen", "butin-1"], "Kumulyativ diyen, qo'sh bog'lar 1- va 2-uglerodda (metilallen)."),
        ("CH₂=C=CH–CH₂–CH₃ moddaning sistematik nomi:", ["pentadiyen-1,2", "pentadiyen-2,3", "pentadiyen-1,3", "pentin-1"], "Besh uglerod, qo'sh bog'lar 1 va 2."),
        ("CH₂=CH–CH=C(CH₃)–CH₃ moddaning sistematik nomi:", ["4-metilpentadiyen-1,3", "2-metilpentadiyen-2,4", "4-metilpentadiyen-2,4", "2-metilpentadiyen-1,3"], "Qo'sh bog'lar chap tomonga yaqin: 1,3; metil 4-uglerodda."),
        ("CH₂=C(CH₃)–CH=CH–CH₃ moddaning sistematik nomi:", ["2-metilpentadiyen-1,3", "4-metilpentadiyen-1,3", "2-metilpentadiyen-2,4", "3-metilpentadiyen-1,3"], "Qo'sh bog'lar 1,3; metil 2-uglerodda."),
        ("CH₂=C(CH₃)–CH=C(CH₃)–CH₃ moddaning sistematik nomi:", ["2,4-dimetilpentadiyen-1,3", "2,4-dimetilpentadiyen-2,4", "2-metilgeksadiyen-1,3", "1,3-dimetilpentadiyen-1,3"], "Qo'sh bog'lar 1,3; metillar 2- va 4-uglerodda."),
        ("CH₃–CH=C=CH–CH₃ moddaning sistematik nomi:", ["pentadiyen-2,3", "pentadiyen-1,3", "pentadiyen-2,4", "pentin-2"], "Kumulyativ diyen, qo'sh bog'lar 2- va 3-uglerodda (dimetilallen)."),
        # 2A. Nomidan formula
        ("Izopren (2-metilbutadiyen-1,3) formulasi:", ["CH₂=C(CH₃)–CH=CH₂", "CH₂=CH–CH=CH–CH₃", "CH₂=C=C(CH₃)–CH₃", "CH₃–C(CH₃)=CH–CH₃"], "Butadiyen-1,3 zanjirining 2-uglerodida metil."),
        ("Pentadiyen-1,4 formulasi:", ["CH₂=CH–CH₂–CH=CH₂", "CH₂=CH–CH=CH–CH₃", "CH₂=C=CH–CH₂–CH₃", "CH₃–CH=C=CH–CH₃"], "Qo'sh bog'lar 1 va 4 — ular orasida CH₂ guruhi."),
        ("2,3-dimetilbutadiyen-1,3 formulasi:", ["CH₂=C(CH₃)–C(CH₃)=CH₂", "CH₂=C(CH₃)–CH=CH–CH₃", "CH₃–C(CH₃)=C(CH₃)–CH₃", "CH₂=CH–C(CH₃)₂–CH=CH₂"], "Butadiyen-1,3 ning 2- va 3-uglerodida metil."),
        ("3-metilpentadiyen-1,4 formulasi:", ["CH₂=CH–CH(CH₃)–CH=CH₂", "CH₂=CH–C(CH₃)=CH–CH₃", "CH₂=C(CH₃)–CH₂–CH=CH₂", "CH₂=CH–CH₂–CH=CH–CH₃"], "Qo'sh bog'lar ikki chetda, o'rtadagi uglerodda metil."),
        ("2-metilgeksadiyen-1,5 formulasi:", ["CH₂=C(CH₃)–CH₂–CH₂–CH=CH₂", "CH₂=CH–CH(CH₃)–CH₂–CH=CH₂", "CH₂=C(CH₃)–CH=CH–CH₂–CH₃", "CH₃–C(CH₃)=CH–CH₂–CH=CH₂"], "Olti uglerod, qo'sh bog'lar 1 va 5, metil 2-uglerodda."),
        # 1C. Tarixiy nomlar
        ("CH₂=CH–CH=CH₂ ning tarixiy nomi:", ["divinil", "allen", "izopren", "piperilen"], "Butadiyen-1,3 — divinil."),
        ("Piperilenning sistematik nomi:", ["pentadiyen-1,3", "pentadiyen-1,4", "2-metilbutadiyen-1,3", "geksadiyen-1,5"], "Piperilen — CH₂=CH–CH=CH–CH₃."),
        ("Diallilning sistematik nomi:", ["geksadiyen-1,5", "pentadiyen-1,4", "geksadiyen-2,4", "butadiyen-1,3"], "Diallil — CH₂=CH–CH₂–CH₂–CH=CH₂."),
        ("Xloroprenning formulasi:", ["CH₂=C(Cl)–CH=CH₂", "CH₂=CH–CH=CHCl", "CH₂Cl–CH=CH–CH₃", "CH₂=C=CH–CH₂Cl"], "Xloropren — 2-xlorbutadiyen-1,3."),
        # 1D. Diyen turlari
        ("CH₂=CH–CH=CH₂ qaysi turdagi diyen?", ["konyugirlangan", "kumulyativ", "izolyatsiyalangan", "aromatik"], "Qo'sh va oddiy bog'lar navbatma-navbat keladi."),
        ("CH₃–CH=C=CH–CH₃ qaysi turdagi diyen?", ["kumulyativ", "konyugirlangan", "izolyatsiyalangan", "siklik"], "Qo'sh bog'lar bitta uglerodda yonma-yon."),
        ("CH₂=CH–CH₂–CH₂–CH=CH₂ qaysi turdagi diyen?", ["izolyatsiyalangan", "konyugirlangan", "kumulyativ", "aromatik"], "Qo'sh bog'lar ikkita oddiy bog' bilan ajralgan."),
        # Tuzilish va izomeriya
        ("Alkadiyenlarning umumiy formulasi:", ["CₙH₂ₙ₋₂", "CₙH₂ₙ", "CₙH₂ₙ₊₂", "CₙH₂ₙ₋₆"], "Ikkita qo'sh bog' — alkandan 4 ta vodorod kam."),
        ("Butadiyen-1,3 da uglerod atomlari qanday gibridlangan?", ["to'rttalasi sp²", "to'rttalasi sp³", "chetdagilari sp², o'rtadagilari sp³", "to'rttalasi sp"], "Konyugirlangan tizimda hamma uglerod sp², molekula yassi."),
        ("Allendagi o'rta uglerod atomi qanday gibridlangan?", ["sp", "sp²", "sp³", "sp³d"], "O'rtadagi uglerod ikkita qo'sh bog' hosil qiladi — sp; C=C=C chiziqli."),
        ("Butadiyen-1,3 dagi C2–C3 bog' uzunligi qancha?", ["≈ 0,147 nm", "0,154 nm", "0,134 nm", "0,120 nm"], "Konyugatsiya tufayli oddiy bog' qisqaradi (0,154 → 0,147 nm)."),
        ("Alkadiyenlar qaysi sinf bilan sinflararo izomer?", ["alkinlar", "alkenlar", "alkanlar", "arenlar"], "Ikkalasi ham CₙH₂ₙ₋₂."),
        ("C₅H₈ tarkibli alkadiyenlarning nechta struktura izomeri bor?", ["6", "4", "5", "7"], "Pentadiyen-1,2; -1,3; -1,4; -2,3; 2-metilbutadiyen-1,3; 3-metilbutadiyen-1,2."),
        ("Geksadiyen-2,4 nechta fazoviy (sis-trans) izomerga ega?", ["3", "2", "4", "1"], "trans,trans; sis,sis; sis,trans."),
        # 1E. Sis-trans
        ("tf", "CH₂=CH–CH=CH₂ (butadiyen-1,3) sis-trans izomeriyaga ega.", False, "Chetki uglerodlarda ikkita bir xil H bor — sis-trans izomeriya yo'q."),
        ("tf", "CH₂=CH–CH=CH–CH₃ (piperilen) sis-trans izomeriyaga ega.", True, "C3=C4 bog'dagi har bir uglerodda ikki xil o'rinbosar bor."),
        ("tf", "CH₂=CH–CH₂–CH=CH₂ sis-trans izomeriyaga ega.", False, "Ikkala qo'sh bog' ham zanjir chetida (=CH₂)."),
        ("tf", "CH₂=CH–CH₂–CH=CH–CH₃ sis-trans izomeriyaga ega.", True, "C4=C5 bog' bo'yicha sis- va trans-shakl mumkin."),
        ("tf", "CH₂=CH–CH=C(CH₃)–CH₃ sis-trans izomeriyaga ega.", False, "C4 da ikkita bir xil metil guruhi bor."),
        ("tf", "Allen molekulasida ikkala π-bog' o'zaro perpendikulyar tekisliklarda yotadi.", True, "O'rtadagi sp-uglerodning ikki p-orbitali o'zaro perpendikulyar."),
    ],
}

MASHQ_2 = {
    "nom": "Mashq: olinishi, xossalari va kauchuklar",
    "coin": 15,
    "savollar": [
        # Olinishi
        ("Lebedev usulida butadiyen nimadan olinadi?", ["etanoldan", "butandan", "atsetilendan", "izopentandan"], "2C₂H₅OH →(ZnO, 450 °C) C₄H₆ + 2H₂O + H₂."),
        ("Lebedev usulida qanday katalizator ishlatiladi?", ["ZnO (yoki MgO, Al₂O₃), 400–500 °C", "Ni, 150 °C", "H₂SO₄ (kons.), 170 °C", "AlCl₃, 20 °C"], "Etanolni oksid katalizatorlar ustida qizdirish."),
        ("Lebedev reaksiyasida butadiyendan tashqari qanday moddalar hosil bo'ladi?", ["suv va vodorod", "CO₂ va suv", "etilen va suv", "faqat suv"], "2C₂H₅OH → CH₂=CH–CH=CH₂ + 2H₂O + H₂."),
        ("Izopentanni katalitik degidrogenlab qaysi diyen olinadi?", ["izopren", "butadiyen-1,3", "pentadiyen-1,4", "piperilen"], "CH₃–CH(CH₃)–CH₂–CH₃ → CH₂=C(CH₃)–CH=CH₂ + 2H₂."),
        ("n-Butan katalitik degidrogenlanganda (Cr₂O₃/Al₂O₃) qaysi diyen hosil bo'ladi?", ["butadiyen-1,3", "butadiyen-1,2", "pentadiyen-1,3", "izopren"], "C₄H₁₀ → CH₂=CH–CH=CH₂ + 2H₂."),
        ("1,4-dibrombutanga KOH ning spirtli eritmasi ta'sir ettirilsa nima hosil bo'ladi?", ["butadiyen-1,3", "butandiol-1,4", "buten-2", "siklobutan"], "Ikki marta HBr ajraladi: CH₂Br–(CH₂)₂–CH₂Br + 2KOH → C₄H₆ + 2KBr + 2H₂O."),
        ("CH₂(OH)–CH₂–CH(OH)–CH₃ degidratlansa (H⁺, t) qanday modda olinadi?", ["butadiyen-1,3", "buten-1", "butin-1", "butanal"], "Ikki molekula suv ajraladi."),
        ("Xloropren qanday olinadi?", ["vinilatsetilenga HCl biriktirib", "butadiyenga Cl₂ biriktirib", "atsetilenga HCl biriktirib", "izoprenga HCl biriktirib"], "CH≡C–CH=CH₂ + HCl → CH₂=C(Cl)–CH=CH₂."),
        ("Allen qanday olinadi?", ["2,3-dibrompropenga rux ta'sirida", "1,3-dibrompropanga rux ta'sirida", "propenga brom biriktirib", "propinni gidrogenlab"], "CH₂Br–CBr=CH₂ + Zn → CH₂=C=CH₂ + ZnBr₂ (1,3-dibrompropandan esa siklopropan olinadi)."),
        # Birikish
        ("Butadiyen-1,3 ga Br₂ 1,4-holatda birikkanda nima hosil bo'ladi?", ["1,4-dibrombuten-2", "3,4-dibrombuten-1", "1,2-dibrombutan", "1,4-dibrombutan"], "Brom C1 va C4 ga birikadi, qo'sh bog' o'rtaga ko'chadi: CH₂Br–CH=CH–CH₂Br."),
        ("Butadiyen-1,3 ga Br₂ 1,2-holatda birikkanda nima hosil bo'ladi?", ["3,4-dibrombuten-1", "1,4-dibrombuten-2", "2,3-dibrombuten-1", "1,2-dibrombuten-2"], "CH₂Br–CHBr–CH=CH₂ — qo'sh bog' chetda qoladi, raqamlash qo'sh bog' tomondan."),
        ("Butadiyen-1,3 ga brom mo'l miqdorda ta'sir ettirilsa:", ["1,2,3,4-tetrabrombutan", "1,4-dibrombuten-2", "1,1,4,4-tetrabrombutan", "2,3-dibrombutan"], "Ikkala qo'sh bog'ga ham brom birikadi: CH₂Br–CHBr–CHBr–CH₂Br."),
        ("Butadiyen-1,3 ga H₂ 1,4-holatda birikkanda:", ["buten-2", "buten-1", "butan", "butin-2"], "CH₃–CH=CH–CH₃."),
        ("Butadiyen-1,3 ga H₂ 1,2-holatda birikkanda:", ["buten-1", "buten-2", "butan", "siklobutan"], "CH₃–CH₂–CH=CH₂."),
        ("Butadiyen-1,3 ga HCl 1,4-holatda birikkanda:", ["1-xlorbuten-2", "3-xlorbuten-1", "2-xlorbutan", "1-xlorbutan"], "CH₃–CH=CH–CH₂Cl."),
        ("Butadiyen-1,3 ga HCl 1,2-holatda birikkanda:", ["3-xlorbuten-1", "1-xlorbuten-2", "1-xlorbutan", "2-xlorbuten-2"], "CH₃–CHCl–CH=CH₂."),
        ("Izoprenga Br₂ 1,4-holatda birikkanda hosil bo'ladigan modda:", ["CH₂Br–C(CH₃)=CH–CH₂Br", "CH₂Br–CBr(CH₃)–CH=CH₂", "CH₂=C(CH₃)–CHBr–CH₂Br", "CH₃–CBr(CH₃)–CHBr–CH₃"], "Brom chetki C1 va C4 ga, qo'sh bog' C2=C3 ga ko'chadi."),
        ("Past haroratda butadiyen-1,3 ga birikishda asosan qaysi mahsulot hosil bo'ladi?", ["1,2-birikish mahsuloti", "1,4-birikish mahsuloti", "2,3-birikish mahsuloti", "reaksiya bormaydi"], "Past haroratda 1,2-, yuqoriroq haroratda asosan 1,4-mahsulot."),
        # Oksidlanish va polimerlanish
        ("Butadiyen-1,3 yumshoq oksidlanganda (KMnO₄, Vagner) nima hosil bo'ladi?", ["butantetrol-1,2,3,4", "butandiol-1,4", "oksalat kislota va CO₂", "butanal"], "CH₂(OH)–CH(OH)–CH(OH)–CH₂(OH) — to'rt atomli spirt."),
        ("Butadiyen-1,3 qattiq oksidlanganda (KMnO₄, H⁺) nima hosil bo'ladi?", ["CO₂ va oksalat kislota", "butantetrol-1,2,3,4", "sirka kislota", "propion kislota"], "Qo'sh bog'lar uziladi: chetki CH₂ → CO₂, o'rtadagi ikki CH → HOOC–COOH."),
        ("Butadiyen kauchugining elementar zvenosi:", ["–CH₂–CH=CH–CH₂–", "–CH₂–CH₂–CH₂–CH₂–", "–CH=CH–CH=CH–", "–CH₂–C(CH₃)=CH–CH₂–"], "Polimerlanish 1,4-holat bo'yicha, zvenoda bitta qo'sh bog' qoladi."),
        ("Diyenlar polimerlanganda har bir zvenoda nechta qo'sh bog' qoladi?", ["1", "0", "2", "3"], "Ikki qo'sh bog'dan biri sarflanadi, ikkinchisi o'rtaga ko'chadi."),
        # Kauchuklar
        ("Tabiiy kauchuk qaysi moddaning polimeri?", ["izopren", "butadiyen", "xloropren", "stirol"], "(C₅H₈)ₙ — poliizopren."),
        ("Tabiiy kauchukning tuzilishi:", ["sis-1,4-poliizopren", "trans-1,4-poliizopren", "1,2-poliizopren", "sis-1,4-polibutadiyen"], "Trans-1,4-poliizopren esa guttapercha."),
        ("Vulkanizatsiyada kauchukka nima qo'shib qizdiriladi?", ["oltingugurt", "uglerod", "xlor", "azot"], "Makromolekulalar orasida –S–S– ko'priklar hosil bo'ladi."),
        ("Ebonit tarkibidagi oltingugurt miqdori:", ["≈ 30–40 %", "≈ 1–3 %", "≈ 5–10 %", "≈ 60–70 %"], "Rezinada ≈ 1–3 %, ebonitda ≈ 30–40 %."),
        ("Neopren qaysi monomerdan olinadi?", ["xloropren", "izopren", "butadiyen-1,3", "stirol"], "Neopren — xloropren kauchugi (moy, benzin va olovga chidamli)."),
        ("Butadiyen-stirol kauchugi (SKS) qanday olinadi?", ["butadiyen va stirolni sopolimerlab", "faqat stirolni polimerlab", "izopren va stirolni sopolimerlab", "butadiyen va akrilonitrilni sopolimerlab"], "Ikki xil monomer birgalikda polimerlanadi."),
        ("Vulkanizatsiyani kim kashf etgan?", ["Ch. Gudyir", "S. V. Lebedev", "I. Tile", "A. M. Butlerov"], "Charlz Gudyir, 1839-yil."),
        ("tf", "Alkadiyenlar bromli suvni rangsizlantiradi.", True, "Qo'sh bog'larga brom birikadi — sifat reaksiya."),
        ("tf", "1 mol konyugirlangan diyen 2 mol gacha Br₂ biriktira oladi.", True, "Ikkita qo'sh bog' — ikki mol brom."),
        ("tf", "Guttapercha tabiiy kauchukdek elastik.", False, "Guttapercha (trans-1,4-poliizopren) elastik emas."),
        ("tf", "Rezina tarkibida ebonitdagiga qaraganda oltingugurt ko'proq.", False, "Rezinada ≈ 1–3 %, ebonitda ≈ 30–40 %."),
        ("tf", "Diyenlar asosan 1,4-holat bo'yicha polimerlanadi.", True, "Har bir zvenoda bitta qo'sh bog' qoladi."),
        ("tf", "Butadiyen-nitril kauchugi moy va benzinga chidamli.", True, "Butadiyen + akrilonitril sopolimeri."),
    ],
}

MASHQ_3 = {
    "nom": "Aralash savollar va masalalar",
    "coin": 15,
    "savollar": [
        # 2B. Masalalar (mashq daftari)
        ("Molyar massasi 54 g/mol bo'lgan alkadiyenning formulasi:", ["C₄H₆", "C₃H₄", "C₅H₈", "C₄H₈"], "14n – 2 = 54 → n = 4."),
        ("Vodorodga nisbatan zichligi 34 bo'lgan alkadiyen:", ["C₅H₈", "C₄H₆", "C₆H₁₀", "C₃H₄"], "M = 68 → 14n – 2 = 68 → n = 5."),
        ("0,2 mol alkadiyenning massasi 13,6 g. Uning formulasi:", ["C₅H₈", "C₄H₆", "C₆H₁₀", "C₇H₁₂"], "M = 13,6 / 0,2 = 68 → C₅H₈."),
        ("Alkadiyen molekulasida jami 16 ta atom bor. Uning formulasi:", ["C₆H₁₀", "C₅H₈", "C₇H₁₂", "C₄H₆"], "Atomlar soni 3n – 2 = 16 → n = 6."),
        ("Alkadiyen molekulasida 12 ta σ-bog' bor. Uning formulasi:", ["C₅H₈", "C₄H₆", "C₆H₁₀", "C₃H₄"], "σ-bog'lar soni 3n – 3 = 12 → n = 5."),
        ("0,1 mol alkadiyen yonganda 5,4 g suv hosil bo'ldi. Alkadiyen formulasi:", ["C₄H₆", "C₃H₄", "C₅H₈", "C₆H₁₀"], "0,3 mol H₂O → har moldan 3 mol suv → n – 1 = 3 → n = 4."),
        ("2,7 g butadiyen-1,3 bilan necha gramm brom to'liq birikadi?", ["16", "8", "32", "24"], "0,05 mol C₄H₆ · 2 = 0,1 mol Br₂ · 160 = 16 g."),
        ("10,8 g butadiyen-1,3 bilan necha gramm brom to'liq birikadi?", ["64", "32", "16", "128"], "0,2 mol C₄H₆ · 2 = 0,4 mol Br₂ · 160 = 64 g."),
        ("46 g etanoldan Lebedev usulida necha gramm butadiyen olinadi (nazariy)?", ["27", "54", "13,5", "46"], "1 mol etanol → 0,5 mol C₄H₆ · 54 = 27 g."),
        ("92 g etanoldan Lebedev usulida necha gramm butadiyen olinadi (nazariy)?", ["54", "27", "108", "92"], "2 mol etanol → 1 mol C₄H₆ = 54 g."),
        ("5,4 g butadiyen-1,3 ni to'liq gidrogenlash uchun (n.sh.) necha litr H₂ kerak?", ["4,48", "2,24", "6,72", "8,96"], "0,1 mol C₄H₆ · 2 = 0,2 mol H₂ · 22,4 = 4,48 l."),
        ("Butadiyen-1,3 molekulasidagi σ- va π-bog'lar soni:", ["9 va 2", "10 va 2", "8 va 2", "9 va 1"], "σ: 3n – 3 = 9 (3 ta C–C, 6 ta C–H); π: 2."),
        ("Butadiyen-1,3 ning vodorodga nisbatan zichligi:", ["27", "54", "26", "28"], "D(H₂) = 7n – 1 = 27 (M = 54)."),
        # 3D. Yonish
        ("1 mol izopren to'liq yonishi uchun necha mol O₂ kerak?", ["7", "6", "8", "5"], "C₅H₈ + 7O₂ → 5CO₂ + 4H₂O."),
        ("2C₄H₆ + 11O₂ → 8CO₂ + 6H₂O tenglamasidagi koeffitsientlar yig'indisi:", ["27", "25", "19", "29"], "2 + 11 + 8 + 6 = 27."),
        ("Allen yonish tenglamasida (C₃H₄ + xO₂ → 3CO₂ + 2H₂O) kislorod oldidagi koeffitsient:", ["4", "3", "5", "2"], "3·2 + 2 = 8 atom O → 4 molekula O₂."),
        ("Geksadiyen yonishi: 2C₆H₁₀ + xO₂ → 12CO₂ + 10H₂O. x = ?", ["17", "15", "16", "19"], "24 + 10 = 34 atom O → 17 molekula O₂."),
        # 3C. Reaksiyalar zanjiri
        ("C₂H₅OH →(ZnO, 450 °C) A →(H₂, 1,4) B →(H₂, Ni) C. C moddasi:", ["butan", "buten-2", "butadiyen-1,3", "etan"], "A — butadiyen-1,3, B — buten-2, C — butan."),
        ("C₂H₅OH →(ZnO, 450 °C) A →(H₂, 1,4) B. B moddasi:", ["buten-2", "buten-1", "butan", "butin-2"], "Butadiyenga vodorod 1,4-holatda birikadi: CH₃–CH=CH–CH₃."),
        ("CH≡C–CH=CH₂ →(HCl) A →(kat., n) B. B moddasi:", ["xloropren kauchugi (neopren)", "polivinilxlorid", "butadiyen kauchugi", "izopren kauchugi"], "A — xloropren, uning polimeri neopren."),
        ("CH₃–CH(CH₃)–CH₂–CH₃ →(t, kat.) C →(2Br₂) D. D moddasi:", ["CH₂Br–CBr(CH₃)–CHBr–CH₂Br", "CH₂Br–C(CH₃)=CH–CH₂Br", "CH₃–CBr(CH₃)–CHBr–CH₃", "CH₂Br–CH(CH₃)–CH₂–CH₂Br"], "C — izopren; 2 mol brom ikkala qo'sh bog'ga birikadi."),
        # Izomerlar va umumlashtirish
        ("C₄H₆ tarkibli alkadiyen va alkinlar (siklik birikmalarsiz) nechta?", ["4", "2", "3", "5"], "Butadiyen-1,3, butadiyen-1,2, butin-1, butin-2."),
        ("C₅H₈ tarkibli alkinlar nechta?", ["3", "2", "4", "6"], "Pentin-1, pentin-2, 3-metilbutin-1."),
        ("Molyar massasi 68 g/mol bo'lgan diyen:", ["izopren", "butadiyen-1,3", "allen", "geksadiyen-2,4"], "C₅H₈ (14·5 – 2 = 68)."),
        ("Butadiyen-1,3 va butin-1 bir-biriga nisbatan:", ["sinflararo izomerlar", "gomologlar", "bir xil modda", "allotroplar"], "Ikkalasi ham C₄H₆, lekin har xil sinfga mansub."),
        ("tf", "Allen normal sharoitda suyuqlik.", False, "Allen — gaz (t qay. = –34 °C)."),
        ("tf", "Izopren normal sharoitda suyuqlik.", True, "Izoprenning qaynash temperaturasi 34 °C."),
        ("tf", "1 mol butadiyen-1,3 ni to'liq gidrogenlash uchun 1 mol H₂ yetarli.", False, "Ikkita qo'sh bog' — 2 mol H₂ kerak."),
        ("tf", "Alkadiyenlar KMnO₄ eritmasini rangsizlantiradi.", True, "Qo'sh bog'lar oksidlanadi — sifat reaksiya."),
        ("tf", "Butadiyen-1,3 ning molyar massasi 54 g/mol.", True, "C₄H₆: 4·12 + 6 = 54."),
    ],
}

BOSQICHLAR = [
    {"tur": "nazariy", **NAZARIY_1},
    {"tur": "mashq", **MASHQ_1},
    {"tur": "nazariy", **NAZARIY_2},
    {"tur": "mashq", **MASHQ_2},
    {"tur": "mashq", **MASHQ_3},
]
