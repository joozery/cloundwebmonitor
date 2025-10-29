# 🌐 คู่มือการควบคุมคอมพิวเตอร์ทางไกล

## 📋 สารบัญ
1. [ภาพรวมระบบ](#ภาพรวมระบบ)
2. [การติดตั้งและตั้งค่า](#การติดตั้งและตั้งค่า)
3. [วิธีใช้งาน](#วิธีใช้งาน)
4. [การเชื่อมต่อผ่านอินเทอร์เน็ต](#การเชื่อมต่อผ่านอินเทอร์เน็ต)

---

## ภาพรวมระบบ

ระบบประกอบด้วย 3 ส่วนหลัก:

```
[คอมควบคุม]  <--Internet-->  [Server]  <--Internet-->  [คอมเป้าหมาย]
   (เว็บ)                      (Node.js)                    (Agent)
```

### ส่วนประกอบ:

1. **Server** - เซิร์ฟเวอร์กลางสำหรับรับส่งคำสั่ง
2. **Agent** - โปรแกรมที่ติดตั้งบนเครื่องที่ต้องการควบคุม
3. **Web Interface** - หน้าเว็บสำหรับควบคุม

---

## การติดตั้งและตั้งค่า

### 🖥️ ขั้นตอนที่ 1: ติดตั้ง Server

**บนเครื่องที่จะเป็น Server (สามารถเป็นเครื่องเดียวกับที่ควบคุมได้)**

```bash
# 1. ติดตั้ง dependencies
cd /path/to/cloundwebsun
npm install

# 2. รัน Server
node server-multi.js
```

Server จะรันที่ port 3001

### 🤖 ขั้นตอนที่ 2: ติดตั้ง Agent บนเครื่องเป้าหมาย

**บนทุกเครื่องที่ต้องการควบคุม:**

#### วิธีที่ 1: ติดตั้งบนเครื่องในเครือข่ายเดียวกัน (LAN)

```bash
# 1. คัดลอกไฟล์ไปยังเครื่องเป้าหมาย
# - agent.js
# - package.json

# 2. ติดตั้ง dependencies
npm install socket.io-client

# 3. รัน Agent (เชื่อมต่อ server ในเครือข่าย LAN)
SERVER_URL=http://192.168.1.100:3001 AGENT_NAME="My-Computer" node agent.js
```

**หา IP ของ Server:**
- **Windows**: `ipconfig`
- **Mac/Linux**: `ifconfig` หรือ `ip addr`

#### วิธีที่ 2: ติดตั้งบนเครื่องที่ต่างเครือข่าย (Internet)

```bash
# รัน Agent โดยเชื่อมต่อผ่าน Internet
SERVER_URL=http://your-domain.com:3001 AGENT_NAME="Remote-PC" node agent.js
```

### 🌐 ขั้นตอนที่ 3: เปิด Web Interface

**บนเครื่องที่จะควบคุม:**

```bash
# 1. ติดตั้ง frontend dependencies
cd client
npm install

# 2. รัน frontend (development mode)
npm start
```

เปิดเว็บเบราว์เซอร์: **http://localhost:3000**

---

## วิธีใช้งาน

### 1. เลือกเครื่องที่ต้องการควบคุม

เมื่อเปิดเว็บขึ้นมา จะเห็นรายการเครื่องที่เชื่อมต่ออยู่:

```
🖥️ เลือกเครื่องที่ต้องการควบคุม

[🍎 Mac-Office]          [🪟 Windows-Home]
  Mac-Office.local         Desktop-Gaming
  darwin | x64             win32 | x64
  ● ออนไลน์                ● ออนไลน์
```

คลิกเลือกเครื่องที่ต้องการควบคุม

### 2. ดูข้อมูลระบบ

กดปุ่ม **"โหลดข้อมูลระบบ"** เพื่อดูข้อมูลของเครื่องที่เลือก:
- ระบบปฏิบัติการ
- CPU cores
- หน่วยความจำ
- เวลาทำงาน
- ชื่อเครื่อง

### 3. เปิดโปรแกรม

#### ตัวอย่าง Path สำหรับแต่ละระบบ:

**Windows:**
```
C:\Program Files\Google\Chrome\Application\chrome.exe
C:\Windows\System32\notepad.exe
C:\Program Files\Mozilla Firefox\firefox.exe
```

**macOS:**
```
/Applications/Safari.app
/Applications/Calculator.app
/Applications/Google Chrome.app
/System/Applications/Notes.app
```

**Linux:**
```
/usr/bin/firefox
/usr/bin/gedit
/usr/bin/vlc
```

### 4. ควบคุมระบบ

- 🔒 **ล็อคหน้าจอ**: ล็อคหน้าจอเครื่องเป้าหมาย
- 😴 **หลับ**: เปลี่ยนเป็นโหมดหลับ
- 🔄 **รีสตาร์ท**: รีสตาร์ทเครื่อง (ระวัง!)
- ⏹️ **ปิดเครื่อง**: ปิดเครื่อง (ระวัง!)

---

## การเชื่อมต่อผ่านอินเทอร์เน็ต

### วิธีที่ 1: ใช้ Port Forwarding (Router)

#### ขั้นตอน:

1. **เข้า Router Settings**
   - เปิดเบราว์เซอร์ไปที่: `192.168.1.1` หรือ `192.168.0.1`
   - Login ด้วย username/password ของ router

2. **ตั้งค่า Port Forwarding**
   ```
   Service Name: Remote Control Server
   External Port: 3001
   Internal Port: 3001
   Internal IP: [IP ของเครื่อง Server]
   Protocol: TCP
   ```

3. **หา Public IP**
   - ไปที่: https://whatismyipaddress.com/
   - จดบันทึก IP address

4. **เชื่อมต่อจากภายนอก**
   ```bash
   # บนเครื่องเป้าหมาย (ต่างเครือข่าย)
   SERVER_URL=http://YOUR_PUBLIC_IP:3001 node agent.js
   ```

### วิธีที่ 2: ใช้ ngrok (แนะนำสำหรับทดสอบ)

```bash
# 1. ติดตั้ง ngrok
# ดาวน์โหลดจาก: https://ngrok.com/

# 2. รัน ngrok
ngrok http 3001

# 3. จะได้ URL เช่น:
# https://abc123.ngrok.io

# 4. ใช้ URL นี้เชื่อมต่อ
SERVER_URL=https://abc123.ngrok.io node agent.js
```

### วิธีที่ 3: Deploy บน Cloud Server

#### ใช้ VPS (เช่น DigitalOcean, AWS, Linode)

```bash
# 1. Upload โปรเจคไปยัง VPS

# 2. ติดตั้ง Node.js บน VPS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. ติดตั้ง dependencies
npm install

# 4. รัน server (แนะนำใช้ PM2)
npm install -g pm2
pm2 start server-multi.js
pm2 save
pm2 startup

# 5. เปิด firewall
sudo ufw allow 3001
```

จากนั้นใช้ URL: `http://YOUR_VPS_IP:3001`

---

## 🔒 ความปลอดภัย

### ⚠️ คำเตือนสำคัญ:

1. **ใช้เฉพาะในเครือข่ายที่เชื่อถือได้**
2. **อย่า expose ไปยัง Internet โดยไม่มีการป้องกัน**
3. **เพิ่มระบบ Authentication ก่อนใช้งานจริง**

### แนะนำ:

- ใช้ VPN สำหรับการเข้าถึง
- เพิ่มรหัสผ่านสำหรับ Agent
- ใช้ HTTPS แทน HTTP
- จำกัดการเข้าถึงด้วย IP whitelist

---

## 🛠️ การแก้ไขปัญหา

### Agent เชื่อมต่อไม่ได้

```bash
# ตรวจสอบว่า Server รันอยู่หรือไม่
curl http://localhost:3001/api/status

# ตรวจสอบ firewall
# Windows:
netsh advfirewall firewall add rule name="Remote Control" dir=in action=allow protocol=TCP localport=3001

# Mac:
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node

# Linux:
sudo ufw allow 3001
```

### ไม่สามารถเปิดโปรแกรมได้

- ตรวจสอบ path ของโปรแกรม
- ตรวจสอบสิทธิ์การเข้าถึง
- บน Linux อาจต้องใช้ `sudo`

---

## 📝 ตัวอย่างการใช้งาน

### สถานการณ์: ควบคุม PC ที่บ้านจากที่ทำงาน

#### ที่บ้าน (PC เป้าหมาย):

```bash
# ติดตั้ง Agent
npm install socket.io-client

# รัน Agent
SERVER_URL=http://your-server.com:3001 AGENT_NAME="Home-PC" node agent.js

# หรือตั้งค่าให้รันอัตโนมัติ (Windows)
# สร้างไฟล์ start-agent.bat:
@echo off
set SERVER_URL=http://your-server.com:3001
set AGENT_NAME=Home-PC
node agent.js
```

#### ที่ทำงาน (เครื่องควบคุม):

1. เปิดเว็บ: `http://your-server.com:3000`
2. เลือกเครื่อง "Home-PC"
3. เปิดโปรแกรม, ดูข้อมูล, หรือควบคุมระบบได้ทันที

---

## 📚 คำสั่งที่มีประโยชน์

### รัน Server แบบ Background (Linux/Mac)

```bash
# ใช้ PM2
npm install -g pm2
pm2 start server-multi.js --name remote-control
pm2 logs remote-control
pm2 stop remote-control
```

### รัน Agent แบบ Background

```bash
# Linux/Mac (nohup)
nohup SERVER_URL=http://server:3001 AGENT_NAME="My-PC" node agent.js &

# Windows (PowerShell)
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "agent.js"
```

### ตรวจสอบ Connection

```bash
# ดูรายการ Agents ที่เชื่อมต่อ
curl http://localhost:3001/api/agents

# ตรวจสอบสถานะ Server
curl http://localhost:3001/api/status
```

---

## 🎯 สรุป

1. **ติดตั้ง Server** บนเครื่องที่เป็นศูนย์กลาง
2. **ติดตั้ง Agent** บนทุกเครื่องที่ต้องการควบคุม
3. **เปิด Web Interface** เพื่อควบคุม
4. เลือกเครื่อง และส่งคำสั่ง!

---

## 📞 ติดต่อ & สนับสนุน

หากมีปัญหาหรือข้อสงสัย:
- ดู logs ใน terminal
- ตรวจสอบ network connection
- ตรวจสอบ firewall settings

**Happy Remote Controlling!** 🚀
