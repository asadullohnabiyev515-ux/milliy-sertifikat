# EduTest serverini bepul serverga ko'chirish

Ma'lumotlar (Supabase va GitHub `db` branch) joyida qoladi. Faqat server ko'chadi.

**Umumiy reja:**
1. Bepul server ochiladi (Oracle yoki Google).
2. Unga bitta skript ishga tushiriladi, u hammasini o'zi o'rnatadi.
3. Chiqqan manzilni Claude'ga yuborasiz, mini app yangi serverga ulanadi.
4. Render'dagi xizmat to'xtatiladi.

Kerak bo'ladi:
- **Visa yoki Mastercard** karta. U faqat tasdiqlash uchun so'raladi, bepul chegarada pul yechilmaydi.
- **Render → milliy-imtihon → Environment** sahifasi ochiq tursin. U yerdagi kalitlarni skriptga nusxalaysiz:
  - `TG_BOT_TOKEN`, `SUPABASE_URL`, `SUPABASE_KEY`, `PAYMENT_TOKEN`, `GH_TOKEN` (majburiy);
  - bo'lsa: `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `ESKI_BOT_TOKEN`, `TG_AUTH_QATIY`.

---

## A variant: Oracle Cloud (tavsiya: umrbod bepul, kuchli)

### 1. Ro'yxatdan o'tish
1. https://cloud.oracle.com → **Start for free** (Sign up).
2. **Home Region**ni tanlang, masalan **Germany Central (Frankfurt)**.
   - Bepul resurslar faqat shu hududda bo'ladi.
   - Uni keyin o'zgartirib bo'lmaydi.
3. Karta ma'lumotlarini kiriting. Karta rad etilsa, boshqa karta bilan yoki birozdan keyin qayta urinib ko'ring.

### 2. Server ochish
1. Menyu → **Compute → Instances → Create instance**.
2. **Image and shape**:
   - **Image**: *Canonical Ubuntu 24.04*.
   - **Shape**: *Ampere → VM.Standard.A1.Flex*, 2 OCPU, 12 GB.
   - "Out of capacity" desa: *Specialty and previous generation → VM.Standard.E2.1.Micro* tanlang. U ham bepul, lekin kichikroq.
   - Ikkalasida ham **"Always Free-eligible"** belgisi bo'lishi shart.
3. **Networking**:
   - *Create new virtual cloud network* va *public subnet* qolsin.
   - **Assign a public IPv4 address** yoqilgan bo'lsin.
4. **Add SSH keys** → **Generate a key pair for me** → **Save private key** (faylni saqlab qo'ying!).
5. **Create** tugmasini bosing. 1–2 daqiqada server **Running** bo'ladi. **Public IP address**ni yozib oling.

### 3. 80 va 443 portlarni ochish
1. Server sahifasi → **Primary VNIC** ichidagi **Subnet** havolasi → **Security Lists** → *Default Security List* → **Add Ingress Rules**.
2. **Source CIDR**: `0.0.0.0/0`, **IP Protocol**: TCP, **Destination Port Range**: `80,443` → **Add**.

### 4. Serverga kirish (SSH)
- **Kompyuterdan (Windows/Mac):** terminal yoki PowerShell'da:
  ```
  ssh -i saqlangan_kalit.key ubuntu@PUBLIC_IP
  ```
- **Telefondan:** **Termius** ilovasini o'rnating.
  1. *Keychain* → saqlangan private key'ni import qiling.
  2. *New host*: manzil = Public IP, foydalanuvchi = `ubuntu`, kalit = import qilingan kalit.

So'ng **5-bo'lim**ga o'ting.

---

## B variant: Google Cloud (ro'yxatdan o'tish osonroq, brauzerdan kiriladi)

> **Ehtiyot bo'ling:** Google'da bepul chegaradan oshsa, kichik to'lov chiqishi mumkin. Masalan, oyiga 1 GB dan ortiq chiquvchi trafik yoki noto'g'ri disk turi. Ochishdan oldin: **Billing → Budgets & alerts → $1 budget** qo'ying.

1. https://console.cloud.google.com → karta bilan ro'yxatdan o'ting.
2. **Compute Engine → VM instances → Create instance**:
   - **Region**: `us-central1`, `us-west1` yoki `us-east1`. Bepul faqat shu uchtasida.
   - **Machine type**: **e2-micro**.
   - **Boot disk → Change**:
     - **Ubuntu 24.04 LTS** (x86/64);
     - disk turi **Standard persistent disk**;
     - hajmi **30 GB** gacha.
   - **Firewall**: ✅ *Allow HTTP traffic*, ✅ *Allow HTTPS traffic*.
3. **Create** → server ochilgach, uning qatoridagi **SSH** tugmasini bosing. Terminal brauzerda ochiladi, telefondan ham ishlaydi.

So'ng **5-bo'lim**ga o'ting.

---

## 5. O'rnatish (ikkala variant uchun bir xil)

Serverning terminalida shu ikki qatorni yozing:

```
curl -fsSLO https://raw.githubusercontent.com/asadullohnabiyev515-ux/milliy-sertifikat/main/tools/server/ornatish.sh
sudo bash ornatish.sh
```

Skript kalitlarni birma-bir so'raydi.
- Ularni Render'dan nusxalab qo'ying.
- Yozganda ekranda ko'rinmaydi, bu normal holat.
- **Domen** so'ralganda shunchaki **Enter** bosing. Avtomatik `IP.sslip.io` manzili beriladi va HTTPS bepul o'rnatiladi.

Oxirida skript manzilni chiqaradi, masalan: `https://1-2-3-4.sslip.io`.
- **"HTTPS ishlayapti ✅"** chiqsa, o'rnatish tugadi.
- HTTPS ishlamasa, 3-bo'limdagi (Oracle) yoki Firewall (Google) port sozlamasini tekshirib, `sudo systemctl restart caddy` buyrug'ini bering.

## 6. O'tish

1. Chiqqan manzilni **Claude'ga yuboring**. Mini app yangi serverga ulanadi.
2. Mini app yangi serverda ishlayotganini tekshirgach, **Render → milliy-imtihon → Settings → Suspend Web Service** bosing.
   - **Muhim:** ikkala server birga ishlasa, ikkita bot bir-biriga xalaqit beradi va ma'lumotlar ustma-ust yozilishi mumkin.
3. Bundan keyin Manual Deploy kerak emas. Server har 5 daqiqada GitHub'dagi yangi kodni o'zi oladi.

## Foydali buyruqlar

```
sudo systemctl status edutest     # holat
sudo journalctl -u edutest -f     # jonli jurnal (chiqish: Ctrl+C)
sudo systemctl restart edutest    # qayta ishga tushirish
sudo edutest-yangila              # GitHub'dan hozir yangilash
sudo nano /etc/edutest.env        # kalitlarni o'zgartirish (keyin: restart)
```

**Eslatma:** eski sertifikatlardagi QR kodlar Render manziliga olib boradi. Render to'xtatilgach, ular ochilmaydi. Yangi sertifikatlar yangi manzilni oladi.
