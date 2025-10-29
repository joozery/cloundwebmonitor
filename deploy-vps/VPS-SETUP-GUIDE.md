# 🚀 คู่มือติดตั้งบน VPS

## 📋 สิ่งที่ต้องมี:
- VPS (Ubuntu 20.04/22.04 หรือ Debian)
- ไฟล์ทั้งหมดในโฟลเดอร์นี้
- SSH access ไปยัง VPS

---

## 🎯 วิธีที่ 1: Upload ด้วย SCP (แนะนำ)

### **ขั้นตอนที่ 1: เตรียมไฟล์บน Mac**

```bash
cd "/Volumes/Back up data Devjuu/cloundwebsun"

# สร้าง tar file
tar -czf remote-control.tar.gz \
  server-multi.js \
  agent.js \
  package.json \
  client/build
```

### **ขั้นตอนที่ 2: Upload ไปยัง VPS**

```bash
# เปลี่ยน YOUR_VPS_IP เป็น IP ของ VPS ของคุณ
scp remote-control.tar.gz root@YOUR_VPS_IP:/root/

# Upload สคริปต์ติดตั้ง
scp deploy-vps/install-vps.sh root@YOUR_VPS_IP:/root/
```

### **ขั้นตอนที่ 3: SSH เข้า VPS**

```bash
ssh root@YOUR_VPS_IP
```

### **ขั้นตอนที่ 4: แตกไฟล์และติดตั้ง**

```bash
# แตกไฟล์
cd /root
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
ufw allow 3000
```

### **ขั้นตอนที่ 5: รัน Server**

```bash
# รัน Server ด้วย PM2
pm2 start server-multi.js --name remote-control

# ตั้งค่าให้รันอัตโนมัติ
pm2 startup
pm2 save

# ดูสถานะ
pm2 status
pm2 logs remote-control
```

---

## 🎯 วิธีที่ 2: ใช้ Git (ถ้ามี GitHub)

### **บน Mac:**

```bash
cd "/Volumes/Back up data Devjuu/cloundwebsun"

# Init git (ถ้ายังไม่มี)
git init
git add .
git commit -m "Remote control app"

# Push ไปยัง GitHub
git remote add origin https://github.com/YOUR_USERNAME/remote-control.git
git push -u origin main
```

### **บน VPS:**

```bash
# Clone จาก GitHub
cd /root
git clone https://github.com/YOUR_USERNAME/remote-control.git
cd remote-control

# ติดตั้ง Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# ติดตั้ง dependencies
npm install

# ถ้ายังไม่ build frontend
cd client
npm install
npm run build
cd ..

# ติดตั้ง PM2
npm install -g pm2

# รัน Server
pm2 start server-multi.js --name remote-control
pm2 startup
pm2 save
```

---

## 🎯 วิธีที่ 3: Copy-Paste ด้วยมือ (ง่ายที่สุด)

### **1. สร้างไฟล์บน VPS:**

```bash
ssh root@YOUR_VPS_IP

# สร้างโฟลเดอร์
mkdir -p /root/remote-control
cd /root/remote-control

# ติดตั้ง Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
```

### **2. สร้างไฟล์ server-multi.js:**

```bash
nano server-multi.js
```

Copy เนื้อหาจากไฟล์ `server-multi.js` บน Mac แล้ว Paste เข้าไป  
กด `Ctrl+X`, `Y`, `Enter` เพื่อบันทึก

### **3. สร้างไฟล์ agent.js:**

```bash
nano agent.js
```

Copy เนื้อหาจากไฟล์ `agent.js` บน Mac แล้ว Paste เข้าไป  
กด `Ctrl+X`, `Y`, `Enter` เพื่อบันทึก

### **4. สร้างไฟล์ package.json:**

```bash
nano package.json
```

Copy เนื้อหาจากไฟล์ `package.json` บน Mac แล้ว Paste เข้าไป  
กด `Ctrl+X`, `Y`, `Enter` เพื่อบันทึก

### **5. ติดตั้งและรัน:**

```bash
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
```

---

## ✅ **ตรวจสอบว่าทำงาน:**

```bash
# ดูสถานะ PM2
pm2 status

# ดู logs
pm2 logs remote-control

# ทดสอบ API
curl http://localhost:3001/api/status
```

ควรเห็น:
```json
{"status":"online","connectedAgents":0,"connectedClients":0,"timestamp":"..."}
```

---

## 🌐 **เปิดเว็บควบคุม:**

เปิดเบราว์เซอร์:
```
http://YOUR_VPS_IP:3001
```

---

## 🖥️ **เชื่อมต่อ Windows Agent กับ VPS:**

แก้ไข `2-CONFIG.bat` บน Windows:

```batch
set SERVER_URL=http://YOUR_VPS_IP:3001
set AGENT_NAME=Windows-PC
```

รัน Agent:
```cmd
cd C:\FOR-WINDOWS
node agent.js
```

---

## 📊 **คำสั่ง PM2 ที่มีประโยชน์:**

```bash
# ดูสถานะ
pm2 status

# ดู logs แบบ real-time
pm2 logs remote-control

# รีสตาร์ท
pm2 restart remote-control

# หยุด
pm2 stop remote-control

# เริ่มใหม่
pm2 start remote-control

# ลบออก
pm2 delete remote-control

# ดู resource usage
pm2 monit
```

---

## 🔒 **เพิ่มความปลอดภัย (Optional):**

### **1. ใช้ Nginx + SSL:**

```bash
# ติดตั้ง Nginx
apt install -y nginx certbot python3-certbot-nginx

# ขอ SSL Certificate (ต้องมี Domain)
certbot --nginx -d your-domain.com

# แก้ไข Nginx
nano /etc/nginx/sites-available/default
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
systemctl restart nginx
```

จากนั้นใช้: `https://your-domain.com`

### **2. ตั้งรหัสผ่าน:**

```bash
apt install apache2-utils
htpasswd -c /etc/nginx/.htpasswd admin

# แก้ไข Nginx config เพิ่ม:
# auth_basic "Remote Control";
# auth_basic_user_file /etc/nginx/.htpasswd;
```

---

## 🐛 **แก้ไขปัญหา:**

### **ปัญหา: Port ถูกใช้งานอยู่**

```bash
# หา process ที่ใช้ port 3001
lsof -i :3001

# ฆ่า process
kill -9 PID
```

### **ปัญหา: Firewall บล็อค**

```bash
# ตรวจสอบ Firewall
ufw status

# เปิด port
ufw allow 3001
ufw allow 3000

# Reload
ufw reload
```

### **ปัญหา: PM2 ไม่รัน**

```bash
# ลบและเริ่มใหม่
pm2 delete remote-control
pm2 start server-multi.js --name remote-control
pm2 save
```

---

## 📝 **สรุป:**

1. ✅ Upload ไฟล์ไปยัง VPS (SCP/Git/Copy-Paste)
2. ✅ ติดตั้ง Node.js และ PM2
3. ✅ รัน `npm install`
4. ✅ เปิด Firewall port 3001
5. ✅ รัน Server ด้วย PM2
6. ✅ เปิดเว็บที่ `http://VPS_IP:3001`
7. ✅ เชื่อมต่อ Agent จาก Windows

**เสร็จแล้ว!** 🎉

---

## 💡 **Tips:**

- ใช้ PM2 แทน node ตรงๆ เพื่อให้รันตลอดเวลา
- ตั้ง `pm2 startup` เพื่อให้รันอัตโนมัติเมื่อ VPS รีสตาร์ท
- ใช้ `pm2 logs` เพื่อดู error
- Backup ไฟล์สำคัญเป็นประจำ

---

**หากมีปัญหาตรงไหนให้ถาม!** 😊
