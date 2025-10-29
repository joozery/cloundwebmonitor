#!/bin/bash
# สคริปต์ติดตั้งอัตโนมัติบน VPS
# รันบน VPS: bash INSTALL-NOW.sh

echo "========================================"
echo "  🚀 Remote Control - VPS Installation"
echo "========================================"
echo ""

# ไปยังโฟลเดอร์
cd /var/www/cloundwebsun

# ติดตั้ง Node.js (ถ้ายังไม่มี)
if ! command -v node &> /dev/null; then
    echo "📦 ติดตั้ง Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    echo "✅ ติดตั้ง Node.js เสร็จแล้ว: $(node --version)"
else
    echo "✅ พบ Node.js: $(node --version)"
fi

# ติดตั้ง dependencies
echo ""
echo "📦 ติดตั้ง dependencies..."
npm install

# ติดตั้ง PM2 (ถ้ายังไม่มี)
if ! command -v pm2 &> /dev/null; then
    echo ""
    echo "📦 ติดตั้ง PM2..."
    npm install -g pm2
    echo "✅ ติดตั้ง PM2 เสร็จแล้ว"
else
    echo "✅ พบ PM2"
fi

# เปิด Firewall
echo ""
echo "🔥 ตั้งค่า Firewall..."
ufw allow 3001/tcp 2>/dev/null || echo "UFW ไม่พร้อมใช้งาน (ไม่เป็นไร)"
echo "✅ เปิด port 3001"

# หยุด process เก่า (ถ้ามี)
pm2 delete remote-control 2>/dev/null || echo "ไม่มี process เก่า"

# รัน Server
echo ""
echo "🚀 เริ่มรัน Server..."
pm2 start server-multi.js --name remote-control

# บันทึกและตั้งค่า auto-start
pm2 save
pm2 startup | grep "sudo" | bash 2>/dev/null || echo "Startup command ถูกตั้งค่าแล้ว"

echo ""
echo "========================================"
echo "  ✅ ติดตั้งสำเร็จ!"
echo "========================================"
echo ""
echo "🌐 เปิดเว็บที่: http://72.60.195.203:3001"
echo ""
echo "📊 ดูสถานะ:"
echo "   pm2 status"
echo "   pm2 logs remote-control"
echo ""
echo "🛑 หยุด:"
echo "   pm2 stop remote-control"
echo ""
echo "🔄 รีสตาร์ท:"
echo "   pm2 restart remote-control"
echo ""
echo "========================================"
