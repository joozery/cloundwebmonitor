# 🪟 คู่มือตั้งค่าสำหรับ Windows

## 📌 สถานการณ์: ควบคุมเครื่อง Windows จากเครื่องอื่น

---

## ⚙️ ขั้นตอนการตั้งค่า

### 🖥️ **ส่วนที่ 1: เครื่อง Windows (ที่ถูกควบคุม)**

#### 1. ติดตั้ง Node.js

**ดาวน์โหลดและติดตั้ง Node.js:**
- ไปที่: https://nodejs.org/
- ดาวน์โหลด LTS version (แนะนำ)
- ติดตั้งตามปกติ (กด Next ไปเรื่อยๆ)
- **รีสตาร์ทคอมพิวเตอร์** หลังติดตั้งเสร็จ

**ตรวจสอบการติดตั้ง:**
```cmd
# เปิด Command Prompt และพิมพ์:
node --version
npm --version
```

ถ้าเห็นเลขเวอร์ชัน แสดงว่าติดตั้งสำเร็จ ✅

---

#### 2. เตรียมไฟล์

**คัดลอกไฟล์เหล่านี้ไปยังเครื่อง Windows:**

สร้างโฟลเดอร์ เช่น `C:\RemoteControl\`

คัดลอกไฟล์:
- `agent.js`
- `package.json`
- `setup-windows-agent.bat`
- `start-agent.bat`

**วิธีคัดลอก:**
- ใช้ USB Drive
- ใช้ Cloud Storage (Google Drive, OneDrive)
- ใช้ Email
- ใช้ Network Share

---

#### 3. ติดตั้ง Dependencies

**เปิด Command Prompt (CMD) แบบ Administrator:**
1. กด Windows + X
2. เลือก "Command Prompt (Admin)" หรือ "Windows PowerShell (Admin)"

```cmd
# ไปยังโฟลเดอร์ที่เก็บไฟล์
cd C:\RemoteControl

# รัน setup script
setup-windows-agent.bat
```

หรือติดตั้งด้วยตนเอง:
```cmd
npm install socket.io-client
```

---

#### 4. หา IP Address ของ Server

**กรณีที่ 1: Server อยู่บน Mac ของคุณ**

บน Mac, เปิด Terminal และพิมพ์:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

จะได้ IP เช่น: `192.168.1.100`

**กรณีที่ 2: Server อยู่บนเครื่องอื่น**

หา IP ของเครื่องที่รัน Server

---

#### 5. แก้ไขไฟล์ start-agent.bat

เปิดไฟล์ `start-agent.bat` ด้วย Notepad

แก้ไขบรรทัดนี้:
```batch
REM ถ้า Server อยู่บน Mac (192.168.1.100)
set SERVER_URL=http://192.168.1.100:3001

REM ตั้งชื่อเครื่องตามต้องการ
set AGENT_NAME=My-Gaming-PC
```

บันทึกไฟล์

---

#### 6. เปิด Firewall (Windows)

**อนุญาตการเชื่อมต่อผ่าน Firewall:**

```cmd
REM เปิด CMD แบบ Administrator
netsh advfirewall firewall add rule name="Remote Control Agent" dir=out action=allow protocol=TCP remoteport=3001
```

หรือทำผ่าน GUI:
1. เปิด "Windows Defender Firewall"
2. คลิก "Advanced settings"
3. เลือก "Outbound Rules" > "New Rule"
4. เลือก "Port" > Next
5. เลือก "TCP" พิมพ์ `3001` > Next
6. เลือก "Allow the connection" > Next
7. ตั้งชื่อ "Remote Control" > Finish

---

#### 7. รัน Agent

**Double-click ไฟล์:** `start-agent.bat`

จะเห็นหน้าต่างแบบนี้:
```
========================================
 Remote Control Agent
========================================
Server: http://192.168.1.100:3001
Agent Name: My-Gaming-PC
Agent ID: agent-windows-12345
========================================

กำลังเชื่อมต่อกับ Server...
✅ Connected to server
✅ Agent registered: My-Gaming-PC (agent-windows-12345)
```

**✅ สำเร็จ!** เครื่อง Windows พร้อมถูกควบคุมแล้ว

---

### 💻 **ส่วนที่ 2: เครื่องควบคุม (Mac/PC/แท็บเล็ต)**

#### 1. ตรวจสอบว่า Server รันอยู่

บน Mac (เครื่องที่รัน Server):
```bash
cd "/Volumes/Back up data Devjuu/cloundwebsun"
node server-multi.js
```

จะเห็น:
```
🚀 Remote Control Server Started
🌐 Web interface: http://localhost:3001
```

---

#### 2. เปิด Web Interface

**เปิดเว็บเบราว์เซอร์ (Chrome, Firefox, Safari, Edge)**

ไปที่: `http://localhost:3000`

หรือถ้ารันบนเครื่องอื่น: `http://IP_ADDRESS:3000`

---

#### 3. เลือกเครื่อง Windows

บนหน้าเว็บ จะเห็นรายการเครื่อง:

```
🖥️ เลือกเครื่องที่ต้องการควบคุม

[🪟 My-Gaming-PC]
  DESKTOP-GAMING
  win32 | x64
  ● ออนไลน์
```

**คลิกเลือกเครื่อง** ที่ต้องการควบคุม

---

#### 4. เริ่มควบคุม!

**ตัวอย่างการใช้งาน:**

**เปิดโปรแกรม:**
```
Path: C:\Windows\System32\notepad.exe
กดปุ่ม "เปิดโปรแกรม"
```

**ดูข้อมูลระบบ:**
```
กดปุ่ม "โหลดข้อมูลระบบ"
จะเห็นข้อมูล CPU, RAM, เวลาทำงาน
```

**ควบคุมระบบ:**
- 🔒 ล็อคหน้าจอ Windows
- 😴 ทำให้ Windows หลับ
- 🔄 รีสตาร์ท Windows
- ⏹️ ปิดเครื่อง Windows

---

## 🎯 ตัวอย่าง Path โปรแกรมบน Windows

### โปรแกรมพื้นฐาน:
```
C:\Windows\System32\notepad.exe              (Notepad)
C:\Windows\System32\calc.exe                  (Calculator)
C:\Windows\System32\mspaint.exe               (Paint)
C:\Windows\explorer.exe                       (File Explorer)
```

### โปรแกรมที่ติดตั้งเอง:
```
C:\Program Files\Google\Chrome\Application\chrome.exe
C:\Program Files\Mozilla Firefox\firefox.exe
C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
C:\Program Files\VideoLAN\VLC\vlc.exe
```

### เกม:
```
C:\Program Files (x86)\Steam\steam.exe
C:\Program Files\Epic Games\Launcher\Portal\Binaries\Win64\EpicGamesLauncher.exe
```

---

## 🔧 การแก้ไขปัญหา

### ❌ ปัญหา: Agent เชื่อมต่อไม่ได้

**แก้ไข:**
```cmd
1. ตรวจสอบ Server_URL ว่าถูกต้อง
2. ตรวจสอบว่า Server รันอยู่
3. Ping ดู Server:
   ping 192.168.1.100

4. ตรวจสอบ Firewall
5. ปิด VPN/Antivirus ชั่วคราว
```

### ❌ ปัญหา: ไม่มีเครื่องแสดงบนเว็บ

**แก้ไข:**
```
1. ตรวจสอบว่า Agent รันอยู่บน Windows
2. ดู log ว่ามี "Connected to server" หรือไม่
3. กด F5 Refresh หน้าเว็บ
4. กดปุ่ม "🔄 รีเฟรช" บนหน้าเว็บ
```

### ❌ ปัญหา: ส่งคำสั่งแล้วไม่ทำงาน

**แก้ไข:**
```
1. ตรวจสอบ Path ของโปรแกรมว่าถูกต้อง
2. ลองรัน Agent แบบ Administrator
3. ดู log บน Agent window
```

---

## 🚀 ตั้งค่าให้รันอัตโนมัติ (Auto-start)

### วิธีที่ 1: Task Scheduler (แนะนำ)

1. เปิด "Task Scheduler"
2. คลิก "Create Basic Task"
3. ตั้งชื่อ: "Remote Control Agent"
4. Trigger: "When I log on"
5. Action: "Start a program"
6. Program: `C:\RemoteControl\start-agent.bat`
7. Finish

### วิธีที่ 2: Startup Folder

```
1. กด Windows + R
2. พิมพ์: shell:startup
3. วาง shortcut ของ start-agent.bat ไว้ในนี้
```

---

## 📱 ควบคุมจากมือถือ

เปิดเว็บเบราว์เซอร์บนมือถือ:
```
http://IP_ADDRESS:3000
```

**หมายเหตุ:** มือถือต้องอยู่ในเครือข่ายเดียวกัน หรือใช้ Port Forwarding

---

## 🌐 ควบคุมผ่าน Internet (ไม่ใช่ LAN)

### ใช้ ngrok (ง่ายที่สุด)

```bash
# บน Mac (Server)
ngrok http 3001

# จะได้ URL: https://abc123.ngrok.io

# บน Windows (Agent)
# แก้ไข start-agent.bat:
set SERVER_URL=https://abc123.ngrok.io
```

---

## 📋 สรุปขั้นตอน

### บนเครื่อง Windows (ที่ถูกควบคุม):
1. ✅ ติดตั้ง Node.js
2. ✅ คัดลอกไฟล์
3. ✅ รัน `setup-windows-agent.bat`
4. ✅ แก้ไข `start-agent.bat` (ใส่ Server URL)
5. ✅ รัน `start-agent.bat`

### บนเครื่องควบคุม (Mac/PC):
1. ✅ รัน Server: `node server-multi.js`
2. ✅ รัน Frontend: `cd client && npm start`
3. ✅ เปิดเว็บ: `http://localhost:3000`
4. ✅ เลือกเครื่อง Windows
5. ✅ เริ่มควบคุม!

---

## 🎉 สำเร็จ!

ตอนนี้คุณสามารถ:
- ✅ เปิดโปรแกรมบน Windows จากเว็บ
- ✅ ดูข้อมูลระบบ Windows
- ✅ ล็อค/หลับ/รีสตาร์ท/ปิดเครื่อง Windows
- ✅ ควบคุมได้จากทุกที่ (ถ้าตั้งค่า Internet)

**Happy Remote Controlling!** 🚀
