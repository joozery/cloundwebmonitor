# 🚀 Quick Start Guide - ควบคุมคอมทางไกล

## 📍 คุณอยู่ตรงไหน?

### 🍎 กรณีที่ 1: ฉันอยู่บน Mac (ต้องการควบคุมเครื่องอื่น)

#### ขั้นตอนที่ 1: รัน Server บน Mac

```bash
cd "/Volumes/Back up data Devjuu/cloundwebsun"

# รัน Server
node server-multi.js
```

เปิด Terminal ใหม่:
```bash
# รัน Frontend
cd "/Volumes/Back up data Devjuu/cloundwebsun/client"
npm start
```

#### ขั้นตอนที่ 2: ตั้งค่าเครื่องที่ต้องการควบคุม

**บนเครื่อง Windows:**
1. ติดตั้ง Node.js จาก https://nodejs.org/
2. คัดลอกไฟล์เหล่านี้ไปยัง Windows:
   - `agent.js`
   - `package.json`
   - `start-agent.bat`
3. แก้ไข `start-agent.bat`:
   ```batch
   REM หา IP ของ Mac: เปิด Terminal พิมพ์ ifconfig
   set SERVER_URL=http://192.168.1.XXX:3001
   set AGENT_NAME=My-Windows-PC
   ```
4. เปิด CMD และติดตั้ง:
   ```cmd
   cd C:\RemoteControl
   npm install socket.io-client
   ```
5. Double-click `start-agent.bat`

**บนเครื่อง Mac อื่น:**
```bash
# หา IP ของ Server Mac
# บน Terminal พิมพ์: ifconfig | grep inet

cd /path/to/agent
npm install socket.io-client
SERVER_URL=http://192.168.1.XXX:3001 AGENT_NAME="My-Mac" node agent.js
```

#### ขั้นตอนที่ 3: เปิดเว็บควบคุม

เปิดเบราว์เซอร์: http://localhost:3000

จะเห็นรายการเครื่องทั้งหมด เลือกเครื่องที่ต้องการควบคุม!

---

### 🪟 กรณีที่ 2: ฉันอยู่บน Windows (ต้องการควบคุมเครื่องอื่น)

#### ขั้นตอนที่ 1: รัน Server บน Windows

```cmd
cd C:\cloundwebsun

REM รัน Server
node server-multi.js
```

เปิด CMD ใหม่:
```cmd
REM รัน Frontend
cd C:\cloundwebsun\client
npm start
```

#### ขั้นตอนที่ 2: ตั้งค่าเครื่องที่ต้องการควบคุม

ทำเหมือนกรณีที่ 1 แต่เปลี่ยน IP เป็นของ Windows Server

---

## 🎯 ตัวอย่างการใช้งาน

### หา IP Address

**Mac:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# หรือ
ipconfig getifaddr en0
```

**Windows:**
```cmd
ipconfig
```
มองหา "IPv4 Address"

### Path ตัวอย่าง

**Windows:**
```
C:\Windows\System32\notepad.exe
C:\Program Files\Google\Chrome\Application\chrome.exe
```

**Mac:**
```
/Applications/Calculator.app
/Applications/Safari.app
```

**Linux:**
```
/usr/bin/firefox
/usr/bin/gedit
```

---

## 🔧 แก้ไขปัญหาเร็ว

### ไม่เห็นเครื่องบนเว็บ

```bash
# 1. ตรวจสอบ Server รันอยู่หรือไม่
curl http://localhost:3001/api/status

# 2. ตรวจสอบ Agent รันอยู่หรือไม่ (ดูหน้าต่าง CMD/Terminal)

# 3. กด F5 รีเฟรชหน้าเว็บ

# 4. กดปุ่ม 🔄 รีเฟรช บนหน้าเว็บ
```

### Agent เชื่อมต่อไม่ได้

```bash
# 1. ตรวจสอบ Firewall
# Mac:
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node

# Windows (CMD แบบ Admin):
netsh advfirewall firewall add rule name="Remote Control" dir=out action=allow protocol=TCP remoteport=3001

# 2. Ping ดู Server
ping 192.168.1.XXX

# 3. ตรวจสอบ SERVER_URL ในไฟล์ start script
```

---

## 📂 โครงสร้างไฟล์

```
cloundwebsun/
├── server-multi.js          # Server (รันบนเครื่องกลาง)
├── agent.js                 # Agent (รันบนเครื่องที่ถูกควบคุม)
├── start-agent.bat          # สำหรับ Windows
├── package.json
└── client/                  # Frontend
    └── npm start
```

---

## 🎬 สรุปเป็นขั้นตอน

### เครื่อง Server (ที่รัน server-multi.js)
```bash
# ติดตั้ง
npm install

# รัน Server
node server-multi.js

# รัน Frontend (terminal ใหม่)
cd client && npm start
```

### เครื่องที่ถูกควบคุม (Agent)
```bash
# ติดตั้ง
npm install socket.io-client

# Windows
start-agent.bat

# Mac/Linux
SERVER_URL=http://IP:3001 AGENT_NAME="My-PC" node agent.js
```

### เครื่องควบคุม
```
เปิดเบราว์เซอร์: http://localhost:3000
หรือ: http://SERVER_IP:3000
```

---

## 🌟 เริ่มใช้งานได้เลย!

1. **รัน Server** บนเครื่องหนึ่ง (Mac/Windows/Linux)
2. **รัน Agent** บนเครื่องที่ต้องการควบคุม
3. **เปิดเว็บ** เลือกเครื่อง แล้วควบคุม!

**มีปัญหา?** อ่านคู่มือละเอียด:
- Windows: `WINDOWS-SETUP-GUIDE.md`
- ทั่วไป: `REMOTE-CONTROL-GUIDE.md`

---

**Happy Controlling! 🎮**
