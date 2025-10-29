#!/bin/bash
# สคริปต์ติดตั้งบน VPS
# รันด้วย: bash install-vps.sh

echo "========================================"
echo "  Remote Control - VPS Installation"
echo "========================================"
echo ""

# ตรวจสอบ root
if [ "$EUID" -ne 0 ]; then 
    echo "กรุณารันด้วย sudo หรือ root"
    exit 1
fi

# ติดตั้ง Node.js (ถ้ายังไม่มี)
if ! command -v node &> /dev/null; then
    echo "ติดตั้ง Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
else
    echo "✅ พบ Node.js $(node --version)"
fi

# ติดตั้ง PM2
if ! command -v pm2 &> /dev/null; then
    echo "ติดตั้ง PM2..."
    npm install -g pm2
else
    echo "✅ พบ PM2"
fi

# สร้างโฟลเดอร์
mkdir -p /root/remote-control
cd /root/remote-control

# ติดตั้ง dependencies
echo ""
echo "ติดตั้ง dependencies..."
npm install

# เปิด Firewall
echo ""
echo "ตั้งค่า Firewall..."
ufw allow 3001/tcp
ufw allow 3000/tcp
echo "✅ เปิด port 3001 และ 3000"

# สร้างไฟล์ systemd service
echo ""
echo "สร้าง systemd service..."
cat > /etc/systemd/system/remote-control.service << EOF
[Unit]
Description=Remote Control Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/remote-control
ExecStart=/usr/bin/node server-multi.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo ""
echo "========================================"
echo "  ติดตั้งสำเร็จ!"
echo "========================================"
echo ""
echo "วิธีใช้งาน:"
echo ""
echo "1. รัน Server:"
echo "   pm2 start server-multi.js --name remote-control"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "2. หรือใช้ systemd:"
echo "   systemctl enable remote-control"
echo "   systemctl start remote-control"
echo ""
echo "3. ดูสถานะ:"
echo "   pm2 status"
echo "   pm2 logs remote-control"
echo ""
echo "4. เปิดเว็บ:"
echo "   http://YOUR_VPS_IP:3000"
echo ""
echo "========================================"
