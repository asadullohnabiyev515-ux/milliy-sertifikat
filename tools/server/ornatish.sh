#!/usr/bin/env bash
# EduTest backend (milliy-imtihon) ni bepul VPS'ga (Oracle Cloud / Google Cloud, Ubuntu 22.04/24.04)
# o'rnatadi: Python muhit, systemd xizmati, Caddy (avtomatik HTTPS), har 5 daqiqada GitHub'dan
# avtomatik yangilanish (Render'dagi "Auto-Deploy" o'rniga).
#
# Ishga tushirish (serverga SSH orqali kirib):
#   curl -fsSLO https://raw.githubusercontent.com/asadullohnabiyev515-ux/milliy-sertifikat/main/tools/server/ornatish.sh
#   sudo bash ornatish.sh
#
# Qayta ishga tushirish xavfsiz: kalitlar qayta so'ralmaydi (/etc/edutest.env saqlanadi).
set -euo pipefail

REPO="asadullohnabiyev515-ux/milliy-imtihon"
DIR="/opt/edutest"
ENVF="/etc/edutest.env"
USR="edutest"
PORT=8000

[ "$(id -u)" = "0" ] || { echo "sudo bilan ishga tushiring: sudo bash ornatish.sh"; exit 1; }
say(){ printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }

say "1/8 Tizim paketlari"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y python3 python3-venv python3-pip git curl ca-certificates \
  fonts-dejavu-core iptables

say "2/8 Swap (xotira kichik serverlar uchun)"
if [ "$(swapon --show | wc -l)" -eq 0 ]; then
  fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

say "3/8 Kalitlar (Render > Environment sahifasidan nusxalang)"
touch "$ENVF"; chmod 600 "$ENVF"
sor(){ # nom, majburiymi
  local nom="$1" maj="$2" qiymat="" izoh=""
  if grep -q "^${nom}=" "$ENVF"; then echo "  ${nom}: bor (o'zgarmaydi)"; return; fi
  while :; do
    if [ "$maj" = 1 ]; then izoh=""; else izoh=" (ixtiyoriy, Enter = o'tkazib yuborish)"; fi
    read -r -s -p "  ${nom}${izoh}: " qiymat </dev/tty; echo
    [ -n "$qiymat" ] || [ "$maj" = 0 ] && break
    echo "  Bu kalit majburiy."
  done
  [ -n "$qiymat" ] && printf '%s=%s\n' "$nom" "$qiymat" >> "$ENVF"
  return 0
}
for k in TG_BOT_TOKEN SUPABASE_URL SUPABASE_KEY PAYMENT_TOKEN GH_TOKEN; do sor "$k" 1; done
for k in ANTHROPIC_API_KEY GEMINI_API_KEY ESKI_BOT_TOKEN TG_AUTH_QATIY; do sor "$k" 0; done

say "4/8 Domen (HTTPS uchun)"
IP="$(curl -fsS4 https://api.ipify.org || curl -fsS4 https://ifconfig.me)"
if grep -q '^SERVER_URL=' "$ENVF"; then
  DOMEN="$(grep '^SERVER_URL=' "$ENVF" | sed 's#^SERVER_URL=https://##')"
else
  STANDART="${IP//./-}.sslip.io"
  read -r -p "  Domen [Enter = ${STANDART}]: " DOMEN </dev/tty || true
  DOMEN="${DOMEN:-$STANDART}"
  {
    echo "SERVER_URL=https://${DOMEN}"
    echo "KEEP_ALIVE=0"
    echo "BACKEND_URL=http://127.0.0.1:${PORT}"
  } >> "$ENVF"
fi
echo "  Manzil: https://${DOMEN}"

say "5/8 Kodni yuklab olish"
id "$USR" >/dev/null 2>&1 || useradd --system --create-home --shell /usr/sbin/nologin "$USR"
GH_TOKEN="$(grep '^GH_TOKEN=' "$ENVF" | cut -d= -f2-)"
if [ ! -d "$DIR/.git" ]; then
  git clone --depth 50 "https://x-access-token:${GH_TOKEN}@github.com/${REPO}.git" "$DIR"
else
  git -C "$DIR" remote set-url origin "https://x-access-token:${GH_TOKEN}@github.com/${REPO}.git"
  git -C "$DIR" fetch -q origin main && git -C "$DIR" reset -q --hard origin/main
fi
chown -R "$USR:$USR" "$DIR"; chmod 750 "$DIR"
git config --system --add safe.directory "$DIR" 2>/dev/null || true

say "6/8 Python kutubxonalari (bir necha daqiqa)"
runuser -u "$USR" -- python3 -m venv "$DIR/.venv"
runuser -u "$USR" -- "$DIR/.venv/bin/pip" install -q --upgrade pip
runuser -u "$USR" -- "$DIR/.venv/bin/pip" install -q -r "$DIR/requirements.txt"

say "7/8 Xizmatlar (systemd)"
cat > /etc/systemd/system/edutest.service <<EOF
[Unit]
Description=EduTest backend (FastAPI + Telegram bot)
After=network-online.target
Wants=network-online.target

[Service]
User=${USR}
WorkingDirectory=${DIR}
EnvironmentFile=${ENVF}
# Bitta worker: bot va xotiradagi kesh bitta jarayonda bo'lishi shart
ExecStart=${DIR}/.venv/bin/uvicorn main:app --host 127.0.0.1 --port ${PORT} --workers 1 --proxy-headers
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

cat > /usr/local/bin/edutest-yangila <<EOF
#!/usr/bin/env bash
# GitHub main'da yangi commit bo'lsa: yuklab oladi, kerak bo'lsa kutubxonalarni yangilaydi, qayta ishga tushiradi
set -e
cd ${DIR}
ESKI=\$(git rev-parse HEAD)
runuser -u ${USR} -- git fetch -q origin main
YANGI=\$(git rev-parse origin/main)
[ "\$ESKI" = "\$YANGI" ] && exit 0
runuser -u ${USR} -- git reset -q --hard origin/main
if ! git diff --quiet "\$ESKI" "\$YANGI" -- requirements.txt; then
  runuser -u ${USR} -- ${DIR}/.venv/bin/pip install -q -r requirements.txt
fi
systemctl restart edutest
echo "Yangilandi: \$ESKI -> \$YANGI"
EOF
chmod 755 /usr/local/bin/edutest-yangila

cat > /etc/systemd/system/edutest-yangila.service <<EOF
[Unit]
Description=EduTest: GitHub'dan avtomatik yangilash
[Service]
Type=oneshot
ExecStart=/usr/local/bin/edutest-yangila
EOF
cat > /etc/systemd/system/edutest-yangila.timer <<EOF
[Unit]
Description=EduTest: har 5 daqiqada yangilanishni tekshirish
[Timer]
OnBootSec=2min
OnUnitActiveSec=5min
[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable --now edutest edutest-yangila.timer
systemctl restart edutest

say "8/8 HTTPS (Caddy) va firewall"
if ! command -v caddy >/dev/null; then
  apt-get install -y caddy || {
    apt-get install -y debian-keyring debian-archive-keyring apt-transport-https gnupg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
    apt-get update -y && apt-get install -y caddy
  }
fi
cat > /etc/caddy/Caddyfile <<EOF
${DOMEN} {
    encode gzip
    reverse_proxy 127.0.0.1:${PORT}
}
EOF
# Oracle Ubuntu rasmlarida 80/443 portlar iptables'da yopiq bo'ladi
for p in 80 443; do
  iptables -C INPUT -p tcp --dport $p -j ACCEPT 2>/dev/null || iptables -I INPUT -p tcp --dport $p -j ACCEPT
done
command -v netfilter-persistent >/dev/null && netfilter-persistent save >/dev/null 2>&1 || true
systemctl enable caddy >/dev/null 2>&1 || true
systemctl restart caddy

say "Tekshirish"
for i in $(seq 1 30); do curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null 2>&1 && break; sleep 2; done
if curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null 2>&1; then echo "  Ilova ishlayapti ✅"; else
  echo "  Ilova ishga tushmadi ❌ — jurnal: sudo journalctl -u edutest -n 50"; fi
sleep 5
if curl -fsS "https://${DOMEN}/" >/dev/null 2>&1; then echo "  HTTPS ishlayapti ✅  https://${DOMEN}"; else
  echo "  HTTPS hali ishlamadi — bulut panelida 80 va 443 portlar ochiqligini tekshiring (yo'riqnomaga qarang)."
  echo "  Keyin: sudo systemctl restart caddy"; fi

cat <<EOF

Tayyor. Server manzili:  https://${DOMEN}
Shu manzilni Claude'ga yuboring — mini app shu serverga ulanadi.

DIQQAT: mini app yangi serverga o'tgach, Render'dagi xizmatni to'xtating (Suspend),
aks holda ikkita bot bir vaqtda ishlab, bir-biriga xalaqit beradi.

Foydali buyruqlar:
  sudo systemctl status edutest        # holat
  sudo journalctl -u edutest -f        # jonli jurnal
  sudo systemctl restart edutest       # qayta ishga tushirish
  sudo edutest-yangila                 # GitHub'dan hozir yangilash
EOF
