========================================
  วิธีย้ายไปยัง VPS (ง่ายที่สุด!)
========================================

ขั้นตอนที่ 1: เตรียมไฟล์
----------------------------------------

บน Mac Terminal:

cd "/Volumes/Back up data Devjuu/cloundwebsun/deploy-vps"

# สร้าง tar file
tar -czf remote-control.tar.gz server-multi.js agent.js package.json

========================================

ขั้นตอนที่ 2: Upload ไปยัง VPS
----------------------------------------

# เปลี่ยน YOUR_VPS_IP เป็น IP ของ VPS ของคุณ
scp remote-control.tar.gz root@YOUR_VPS_IP:/root/

========================================

ขั้นตอนที่ 3: SSH เข้า VPS
----------------------------------------

ssh root@YOUR_VPS_IP

========================================

ขั้นตอนที่ 4: ติดตั้งบน VPS
----------------------------------------

# แตกไฟล์
cd /root
mkdir remote-control
tar -xzf remote-control.tar.gz -C remote-control/
cd remote-control

# ติดตั้ง Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# ติดตั้ง dependencies
npm install

# ติดตั้ง PM2
npm install -g pm2

# เปิด Firewall
ufw allow 3001

# รัน Server
pm2 start server-multi.js --name remote-control
pm2 startup
pm2 save

========================================

ขั้นตอนที่ 5: ทดสอบ
----------------------------------------

# ดูสถานะ
pm2 status

# ดู logs
pm2 logs remote-control

# เปิดเบราว์เซอร์
http://YOUR_VPS_IP:3001

========================================

ขั้นตอนที่ 6: เชื่อมต่อจาก Windows
----------------------------------------

แก้ไข 2-CONFIG.bat บน Windows:

set SERVER_URL=http://YOUR_VPS_IP:3001
set AGENT_NAME=Windows-PC

รัน:
cd C:\FOR-WINDOWS
node agent.js

========================================

เสร็จแล้ว! 🎉

ตอนนี้คุณสามารถ:
- เปิดเว็บได้จากทุกที่: http://YOUR_VPS_IP:3001
- ควบคุม Windows จากทุกที่ในโลก
- ไม่ต้องเปิด Mac ทิ้งไว้

========================================

คำสั่งที่มีประโยชน์:
----------------------------------------

pm2 status              - ดูสถานะ
pm2 logs                - ดู logs
pm2 restart remote-control - รีสตาร์ท
pm2 stop remote-control - หยุด
pm2 start remote-control - เริ่ม

========================================

อ่านคู่มือละเอียดที่:
VPS-SETUP-GUIDE.md

========================================
