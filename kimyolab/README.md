# KimyoLab 3D

Virtual kimyo laboratoriyasi (statik sayt, yig'ishsiz ishlaydi). GitHub Pages orqali `/kimyolab/` manzilida ochiladi.

## Bo'limlar
- **Laboratoriya** — 3D xona: yurish, tajriba stoli ustidagi 4 pog'onali reaktivlar polkasi (58 reaktiv), himoya kiyimlari, stoldagi jonli idish (probirka / stakan / kolba), spirtovka, elektroliz, UV lampa, kuzatuvlar jurnali va «Ustoz» yordamchisi.
- **Amaliyot** — darslik bo'yicha 14 ta amaliy ish; har bir qadam laboratoriyada avtomatik tekshiriladi.
- **Davriy jadval** — 118 element, 5 xil ranglash rejimi, Bor modeli, elektron formula, oksidlanish darajalari, viktorina.
- **Molekulalar** — z-matritsa asosida qurilgan 39 ta 3D tuzilma (shar-tayoqcha va fazoviy model).
- **Darslar**, **Zanjirlar**, **Hisoblash** (molyar massa, stexiometriya, eritmalar, pH, gaz qonunlari, eng oddiy formula, oksidlanish darajasi, tenglama tenglashtirish), **Yutuqlar** (reaksiyalar daftari).

## Kimyo dvigateli
`js/engine.js` — ionli model: idishdagi ionlar, molekulalar va qattiq moddalar. Reaksiyalar (`js/rules.js`) qisqa ionli tenglamalar sifatida yozilgan; molekulyar tenglama spektator ionlarni juftlash va tenglashtirish orqali avtomatik tuziladi. pH (kuchli/kuchsiz elektrolitlar, gidroliz, bufer), indikator ranglari, harorat, elektroliz va bug'latish hisoblanadi.

## Fayllar
| Fayl | Vazifasi |
|---|---|
| `js/elements.js`, `js/chem.js` | elementlar, formulalar, tenglashtirish |
| `js/species.js`, `js/rules.js`, `js/engine.js` | moddalar registri, reaksiya qoidalari, dvigatel |
| `js/content.js` | darslar, amaliy ishlar, zanjirlar, yutuqlar |
| `js/ui.js`, `js/lab.js`, `js/lab3d.js` | umumiy interfeys, laboratoriya, 3D sahna |
| `js/table.js`, `js/molecules.js`, `js/learn.js`, `js/tools.js` | boshqa bo'limlar |
| `sw.js`, `manifest.webmanifest` | offline ishlash (PWA) |

## Testlar
```
node tests/engine.test.js       # qoidalar balansi, stsenariylar, pH
node tests/practicals.test.js   # har bir amaliy ish oxirigacha bajariladimi
node tests/content.test.js      # zanjir tenglamalari va havolalar
node tests/molecules.test.js    # molekulalar geometriyasi
node tests/fuzz.test.js         # 3000 ta tasodifiy aralashma
```
Fayllar o'zgarganda `sw.js` dagi `V` versiyasini oshiring.
