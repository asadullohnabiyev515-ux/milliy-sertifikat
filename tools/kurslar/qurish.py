#!/usr/bin/env python3
"""Kurslar kontentini qurish: tools/kurslar/manba/** → assets/kurslar/**

  python3 tools/kurslar/qurish.py

- assets/kurslar/kurslar.json         — bo'limlar va mavzular katalogi
- assets/kurslar/<bolim>/<mavzu>.json — bosqichlar (nazariya bloklari, mashq savollari)
- assets/kurslar/<bolim>/<mavzu>-<n>.pdf — har bir nazariy bosqichning PDF varianti

Manbada to'g'ri javob har doim birinchi variant ("tf" bilan boshlanganlari —
to'g'ri/noto'g'ri tasdiqlar); bu yerda variantlar savol matniga
bog'liq barqaror tartibda aralashtiriladi (har qurishda bir xil natija).
"""
import hashlib, importlib.util, json, os, random, sys

ILDIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MANBA = os.path.join(ILDIZ, "tools", "kurslar", "manba")
CHIQISH = os.path.join(ILDIZ, "assets", "kurslar")
HARFLAR = "ABCD"

# Bo'limlar va mavzular tartibi. "fayl" yo'q mavzu ilovada "Tez orada" bo'lib turadi.
KATALOG = [
    {"id": "organik", "nom": "Organik kimyo", "tavsif": "Uglevodorodlar va ularning hosilalari", "mavzular": [
        # "otilgan": darsda o'tib bo'lingan — ochiq turadi (bosqichlari ham), keyingi mavzu uchun shart emas
        {"id": "alkanlar", "nom": "Alkanlar", "fayl": "organik/alkanlar", "otilgan": True},
        {"id": "sikloalkanlar", "nom": "Sikloalkanlar"},
        {"id": "alkenlar", "nom": "Alkenlar"},
        {"id": "alkadiyenlar", "nom": "Alkadiyenlar va kauchuklar", "fayl": "organik/alkadiyenlar"},
        {"id": "alkinlar", "nom": "Alkinlar"},
        {"id": "arenlar", "nom": "Arenlar"},
        {"id": "spirtlar", "nom": "Spirtlar"},
        {"id": "fenollar", "nom": "Fenollar"},
        {"id": "aldegidlar", "nom": "Aldegidlar va ketonlar"},
        {"id": "kislotalar", "nom": "Karbon kislotalar"},
        {"id": "efirlar", "nom": "Murakkab efirlar va yog'lar"},
        {"id": "uglevodlar", "nom": "Uglevodlar"},
        {"id": "aminlar", "nom": "Aminlar"},
        {"id": "oqsillar", "nom": "Aminokislotalar va oqsillar"},
    ]},
    {"id": "anorganik", "nom": "Anorganik kimyo", "tavsif": "Elementlar va ularning birikmalari", "mavzular": [
        {"id": "vodorod", "nom": "Vodorod va kislorod"},
        {"id": "galogenlar", "nom": "Galogenlar"},
        {"id": "oltingugurt", "nom": "Oltingugurt va uning birikmalari"},
        {"id": "azot", "nom": "Azot va fosfor"},
        {"id": "uglerod", "nom": "Uglerod va kremniy"},
        {"id": "ishqoriy", "nom": "Ishqoriy metallar"},
        {"id": "ishqoriyer", "nom": "Ishqoriy-yer metallar"},
        {"id": "alyuminiy", "nom": "Alyuminiy"},
        {"id": "temir", "nom": "Temir va uning birikmalari"},
        {"id": "dmetallar", "nom": "Mis, rux va boshqa d-metallar"},
    ]},
    {"id": "umumiy", "nom": "Umumiy kimyo", "tavsif": "Asosiy qonunlar, tuzilish va jarayonlar", "mavzular": [
        {"id": "tushunchalar", "nom": "Asosiy tushunchalar va qonunlar"},
        {"id": "atom", "nom": "Atom tuzilishi"},
        {"id": "davriy", "nom": "Davriy qonun va davriy sistema"},
        {"id": "boglanish", "nom": "Kimyoviy bog'lanish"},
        {"id": "gazlar", "nom": "Modda miqdori va gaz qonunlari"},
        {"id": "eritmalar", "nom": "Eritmalar va konsentratsiya"},
        {"id": "tezlik", "nom": "Reaksiya tezligi va kimyoviy muvozanat"},
        {"id": "dissotsiatsiya", "nom": "Elektrolitik dissotsiatsiya"},
        {"id": "oqr", "nom": "Oksidlanish-qaytarilish reaksiyalari"},
        {"id": "elektroliz", "nom": "Elektroliz"},
        {"id": "sinflar", "nom": "Anorganik moddalar sinflari"},
    ]},
]


def manba_yukla(yol):
    spec = importlib.util.spec_from_file_location("m", os.path.join(MANBA, yol + ".py"))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def javob_orinlari(bosqich_nom, n):
    """To'g'ri javob o'rinlari A/B/C/D bo'yicha teng taqsimlanadi (barqaror tartibda)."""
    orin = [i % 4 for i in range(n)]
    random.Random(hashlib.md5(bosqich_nom.encode()).hexdigest()).shuffle(orin)
    return orin


def tf_qur(i, tasdiq, togrimi, izoh):
    """To'g'ri/noto'g'ri savol: manbada ("tf", "tasdiq", True|False, "izoh")."""
    assert isinstance(togrimi, bool), tasdiq
    return {"id": i + 1, "tur": "tf", "savol": "To'g'ri yoki noto'g'ri? " + tasdiq,
            "variantlar": {"A": "To'g'ri", "B": "Noto'g'ri"}, "javob": "A" if togrimi else "B", "izoh": izoh}


def savol_qur(i, savol, variantlar, izoh, qosh=None, orin=0):
    assert len(variantlar) == 4 and len(set(variantlar)) == 4, savol
    xatolar = list(variantlar[1:])
    random.Random(hashlib.md5(savol.encode()).hexdigest()).shuffle(xatolar)
    tartib = xatolar[:orin] + [variantlar[0]] + xatolar[orin:]
    sv = {"id": i + 1, "savol": savol, "variantlar": dict(zip(HARFLAR, tartib)),
          "javob": HARFLAR[tartib.index(variantlar[0])], "izoh": izoh}
    if qosh and qosh.get("rasm"):
        assert os.path.exists(os.path.join(CHIQISH, qosh["rasm"])), qosh["rasm"]
        sv["rasm"] = qosh["rasm"]
    return sv


def pdf_kesib_ol(manba, yol):
    """Ustoz bergan tayyor PDF'dan sahifalar oralig'ini olib, bosqich PDF'i qiladi.
    manba = ("<manba/ ga nisbatan fayl>", birinchi_sahifa, oxirgi_sahifa)  (1 dan sanaladi)"""
    from pypdf import PdfReader, PdfWriter
    fayl, bosh, oxir = manba
    r, w = PdfReader(os.path.join(MANBA, fayl)), PdfWriter()
    for n in range(bosh - 1, oxir):
        w.add_page(r.pages[n])
    with open(yol, "wb") as fh:
        w.write(fh)


def pdf_yoz(yol, mavzu_nom, bosqich_nom, bloklar):
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.lib.units import mm
    from reportlab.lib import colors
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from xml.sax.saxutils import escape
    f = "/usr/share/fonts/truetype/dejavu/"
    for nom, fayl in [("DV", "DejaVuSans.ttf"), ("DVB", "DejaVuSans-Bold.ttf"), ("DVM", "DejaVuSansMono.ttf")]:
        if nom not in pdfmetrics.getRegisteredFontNames():
            pdfmetrics.registerFont(TTFont(nom, f + fayl))
    yashil = colors.HexColor("#2f8a73")
    s_sar = ParagraphStyle("sar", fontName="DVB", fontSize=18, leading=23, textColor=colors.HexColor("#10201c"), spaceAfter=2)
    s_ost = ParagraphStyle("ost", fontName="DV", fontSize=10, leading=14, textColor=yashil, spaceAfter=10)
    s_h = ParagraphStyle("h", fontName="DVB", fontSize=13, leading=17, textColor=yashil, spaceBefore=10, spaceAfter=4)
    s_p = ParagraphStyle("p", fontName="DV", fontSize=10.5, leading=15, spaceAfter=5)
    s_li = ParagraphStyle("li", parent=s_p, leftIndent=12, bulletIndent=2, spaceAfter=2)
    s_f = ParagraphStyle("f", fontName="DVM", fontSize=9.5, leading=13.5)
    hikoya = [Paragraph(escape(mavzu_nom), s_sar), Paragraph(escape(bosqich_nom) + " · EduTest kimyo kursi", s_ost)]
    for tur, qiymat in bloklar:
        if tur == "h":
            hikoya.append(Paragraph(escape(qiymat), s_h))
        elif tur == "p":
            hikoya.append(Paragraph(escape(qiymat), s_p))
        elif tur == "ul":
            for q in qiymat:
                hikoya.append(Paragraph(escape(q), s_li, bulletText="•"))
            hikoya.append(Spacer(1, 4))
        elif tur == "f":
            t = Table([[Paragraph(escape(q).replace(" ", "&nbsp;"), s_f)] for q in qiymat], colWidths=[170 * mm])
            t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#eef6f3")),
                                   ("LEFTPADDING", (0, 0), (-1, -1), 8), ("TOPPADDING", (0, 0), (-1, -1), 2),
                                   ("BOTTOMPADDING", (0, 0), (-1, -1), 2)]))
            hikoya += [t, Spacer(1, 6)]
        elif tur == "rasmlar":
            from reportlab.platypus import Image
            katak = []
            for rasm, izoh in qiymat:
                im = Image(os.path.join(CHIQISH, rasm)); k = 70 * mm / im.drawWidth
                im.drawWidth *= k; im.drawHeight *= k
                katak.append([im, Paragraph(escape(izoh), s_p)])
            qatorlar = [sum(katak[i:i + 2], []) for i in range(0, len(katak), 2)]
            hikoya += [Table(qatorlar), Spacer(1, 6)]
        elif tur == "t":
            t = Table([[Paragraph(escape(c), s_p) for c in r] for r in qiymat])
            t.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#c9d6d2")),
                                   ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e3f1ec"))]))
            hikoya += [t, Spacer(1, 6)]
        else:
            raise ValueError(tur)
    SimpleDocTemplate(yol, pagesize=A4, leftMargin=20 * mm, rightMargin=20 * mm, topMargin=18 * mm, bottomMargin=18 * mm,
                      title=f"{mavzu_nom} — {bosqich_nom}", author="EduTest").build(hikoya)


def main():
    katalog = []
    for b in KATALOG:
        bolim = {k: b[k] for k in ("id", "nom", "tavsif")}
        bolim["mavzular"] = []
        for m in b["mavzular"]:
            yozuv = {"id": m["id"], "nom": m["nom"]}
            if m.get("otilgan"):
                yozuv["otilgan"] = True
            if "fayl" in m:
                src = manba_yukla(m["fayl"])
                bosqichlar = []
                for n, bq in enumerate(src.BOSQICHLAR, 1):
                    if bq["tur"] == "nazariy":
                        pdf = f"{m['fayl']}-{n}.pdf"
                        os.makedirs(os.path.dirname(os.path.join(CHIQISH, pdf)), exist_ok=True)
                        if bq.get("pdf_manba"):
                            pdf_kesib_ol(bq["pdf_manba"], os.path.join(CHIQISH, pdf))
                        else:
                            pdf_yoz(os.path.join(CHIQISH, pdf), src.NOM, bq["nom"], bq["bloklar"])
                        bosqichlar.append({"tur": "nazariy", "nom": bq["nom"], "pdf": pdf,
                                           "bloklar": [[t, q] for t, q in bq["bloklar"]]})
                    else:
                        tanlov = [q for q in bq["savollar"] if q[0] != "tf"]
                        orin = iter(javob_orinlari(m["fayl"] + bq["nom"], len(tanlov)))
                        sv = [tf_qur(i, *q[1:]) if q[0] == "tf" else savol_qur(i, *q, orin=next(orin))
                              for i, q in enumerate(bq["savollar"])]
                        assert len(sv) >= 20, f"{m['fayl']}: {bq['nom']} — kamida 20 ta savol kerak"
                        bosqichlar.append({"tur": "mashq", "nom": bq["nom"], "coin": bq["coin"], "savollar": sv})
                with open(os.path.join(CHIQISH, m["fayl"] + ".json"), "w", encoding="utf-8") as fh:
                    json.dump({"id": m["id"], "nom": src.NOM, "tavsif": src.TAVSIF, "bosqichlar": bosqichlar},
                              fh, ensure_ascii=False, separators=(",", ":"))
                yozuv["fayl"] = m["fayl"] + ".json"
                yozuv["savollar"] = sum(len(x.get("savollar", [])) for x in bosqichlar)
                print(f"  {m['fayl']}: {len(bosqichlar)} bosqich, {yozuv['savollar']} savol")
            bolim["mavzular"].append(yozuv)
        katalog.append(bolim)
    with open(os.path.join(CHIQISH, "kurslar.json"), "w", encoding="utf-8") as fh:
        json.dump({"bolimlar": katalog}, fh, ensure_ascii=False, indent=1)
    print("tayyor:", CHIQISH)


if __name__ == "__main__":
    sys.exit(main())
