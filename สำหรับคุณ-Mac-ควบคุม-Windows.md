# 🍎 Mac ควบคุม Windows ทางไกล - คู่มือฉบับเร็ว

## ✅ สถานะปัจจุบัน (บน Mac ของคุณ)

### Server กำลังรันอยู่ที่:
- **Backend**: http://localhost:3001 ✅
- **Frontend**: http://localhost:3000 ✅
- **IP ของ Mac**: `192.168.1.104`

---

## 📦 **ไฟล์สำหรับนำไปติดตั้งบน Windows**

ผมได้สร้างโฟลเดอร์ให้แล้วที่:
```
/Volumes/Back up data Devjuu/cloundwebsun/FOR-WINDOWS/
```

ไฟล์ในโฟลเดอร์:
```
FOR-WINDOWS/
├── README-FIRST.txt          # อ่านก่อน!
├── คู่มือการใช้งาน.txt       # คู่มือภาษาไทย
├── 1-INSTALL.bat             # ติดตั้ง
├── 2-CONFIG.bat              # ตั้งค่า (แก้ไข IP)
├── 3-START-AGENT.bat         # เริ่มใช้งาน
├── agent.js                  # โปรแกรมหลัก
└── package.json              # Dependencies
```

---

## 🚀 **ขั้นตอนการใช้งาน (ทำตามลำดับ)**

### **ส่วนที่ 1: คัดลอกไฟล์ไปยัง Windows**

**วิธีที่ 1: ใช้ USB Drive**
1. เสียบ USB เข้า Mac
2. Copy โฟลเดอร์ `FOR-WINDOWS` ไปใน USB
3. นำ USB ไปเสียบเครื่อง Windows
4. Copy โฟลเดอร์ `FOR-WINDOWS` ไปที่ `C:\`

**วิธีที่ 2: ใช้ Cloud (Google Drive, OneDrive)**
1. Upload โฟลเดอร์ `FOR-WINDOWS` ไปยัง Cloud
2. ดาวน์โหลดบนเครื่อง Windows
3. แตกไฟล์ไว้ที่ `C:\`

**วิธีที่ 3: ใช้ Email**
1. Zip โฟลเดอร์ `FOR-WINDOWS`
2. ส่ง Email ให้ตัวเอง
3. เปิด Email บนเครื่อง Windows แล้วดาวน์โหลด

---

### **ส่วนที่ 2: ติดตั้งบนเครื่อง Windows**

#### 1. ติดตั้ง Node.js (ครั้งแรกเท่านั้น)

```
1. เปิดเบราว์เซอร์ไปที่: https://nodejs.org/
2. กดดาวน์โหลด "LTS" (ปุ่มเขียว)
3. Double-click ไฟล์ที่ดาวน์โหลด
4. กด Next จนจบ
5. รีสตาร์ทเครื่อง Windows (สำคัญมาก!)
```

#### 2. ติดตั้ง Agent

```
1. เปิดโฟลเดอร์ C:\FOR-WINDOWS\
2. Double-click "1-INSTALL.bat"
3. รอจนกว่าจะเห็น "ติดตั้งสำเร็จ!"
```

#### 3. ตั้งค่า Server URL

```
1. คลิกขวาที่ "2-CONFIG.bat"
2. เลือก "Edit" หรือ "Edit with Notepad"
3. จะเห็นบรรทัดนี้:

   set SERVER_URL=http://192.168.1.104:3001
   set AGENT_NAME=Windows-PC

4. แก้ไข AGENT_NAME เป็นชื่อที่ต้องการ เช่น:
   set AGENT_NAME=Gaming-PC

5. กด Ctrl+S (Save)
6. ปิด Notepad
```

#### 4. เริ่มใช้งาน Agent

```
1. Double-click "3-START-AGENT.bat"
2. จะเห็นหน้าต่างสีฟ้าแบบนี้:

   ========================================
     Remote Control Agent - Running
   ========================================
   Server: http://192.168.1.104:3001
   Agent Name: Gaming-PC
   ========================================
   
   [INFO] กำลังเชื่อมต่อกับ Mac...
   ✅ Connected to server
   ✅ Agent registered: Gaming-PC

3. ✅ สำเร็จ! อย่าปิดหน้าต่างนี้
```

---

### **ส่วนที่ 3: ควบคุมจาก Mac**

#### 1. เปิดเว็บควบคุม

```
เปิด Safari หรือ Chrome บน Mac
ไปที่: http://localhost:3000
```

#### 2. เลือกเครื่อง Windows

```
จะเห็นหน้าเว็บแบบนี้:

🌐 Remote Computer Control Center

🖥️ เลือกเครื่องที่ต้องการควบคุม

┌─────────────────────┐
│ 🪟 Gaming-PC        │
│ DESKTOP-GAMING      │
│ win32 | x64         │
│ ● ออนไลน์           │
└─────────────────────┘

👆 คลิกที่การ์ดนี้
```

#### 3. ทดลองเปิดโปรแกรม

```
🚀 เปิดโปรแกรมบน Gaming-PC

Path ของโปรแกรม:
┌─────────────────────────────────────────┐
│ C:\Windows\System32\notepad.exe         │
└─────────────────────────────────────────┘

[  เปิดโปรแกรม  ]  👈 กดปุ่มนี้
```

**Notepad จะเปิดบนเครื่อง Windows ทันที!** 🎉

---

## 🎯 **ตัวอย่าง Path โปรแกรมที่ใช้ได้**

### โปรแกรมพื้นฐาน Windows:
```
C:\Windows\System32\notepad.exe          (Notepad)
C:\Windows\System32\calc.exe             (Calculator)
C:\Windows\System32\mspaint.exe          (Paint)
C:\Windows\explorer.exe                  (File Explorer)
C:\Windows\System32\cmd.exe              (Command Prompt)
```

### เบราว์เซอร์:
```
C:\Program Files\Google\Chrome\Application\chrome.exe
C:\Program Files\Mozilla Firefox\firefox.exe
C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
```

### โปรแกรมอื่นๆ:
```
C:\Program Files\VideoLAN\VLC\vlc.exe
C:\Program Files\Adobe\Adobe Photoshop 2024\Photoshop.exe
C:\Program Files (x86)\Steam\steam.exe
```

**วิธีหา Path:**
1. เปิด File Explorer บน Windows
2. หาโปรแกรมที่ต้องการ
3. คลิกขวา > Properties
4. Copy ค่าใน "Location" + "Name"

---

## ⚙️ **ฟีเจอร์ที่ใช้ได้**

### 1. เปิดโปรแกรม
- ใส่ Path ของโปรแกรม
- กดปุ่ม "เปิดโปรแกรม"

### 2. ดูข้อมูลระบบ
- กดปุ่ม "โหลดข้อมูลระบบ"
- ดู CPU, RAM, เวลาทำงาน

### 3. ควบคุมระบบ
- 🔒 **ล็อคหน้าจอ**: ล็อคหน้าจอ Windows
- 😴 **หลับ**: เข้าโหมดหลับ
- 🔄 **รีสตาร์ท**: รีสตาร์ทเครื่อง (ระวัง!)
- ⏹️ **ปิดเครื่อง**: ปิดเครื่อง Windows (ระวัง!)

### 4. บันทึกการทำงาน
- ดู Log ทางด้านขวา
- แสดงทุกคำสั่งที่ส่งไป

---

## 🔧 **แก้ไขปัญหาที่พบบ่อย**

### ❌ ปัญหา: ไม่เห็นเครื่อง Windows บนเว็บ

**แก้ไข:**
```
1. ตรวจสอบว่า Agent รันอยู่บน Windows (ดูหน้าต่าง CMD)
2. ควรเห็น "✅ Connected to server"
3. กด F5 รีเฟรชหน้าเว็บ
4. กดปุ่ม "🔄 รีเฟรช" บนหน้าเว็บ
```

### ❌ ปัญหา: Agent เชื่อมต่อไม่ได้

**แก้ไข:**
```
1. ตรวจสอบว่า Mac และ Windows อยู่ในเครือข่ายเดียวกัน
   (ต่อ WiFi เดียวกัน หรือต่อ Router เดียวกัน)

2. ตรวจสอบ IP ของ Mac (บน Terminal):
   ifconfig | grep "inet " | grep -v 127.0.0.1

3. ถ้า IP เปลี่ยน ต้องแก้ไข 2-CONFIG.bat บน Windows

4. Ping ทดสอบ (บน Windows Command Prompt):
   ping 192.168.1.104
   
   ถ้าได้ "Reply from..." แสดงว่าเชื่อมต่อได้
   ถ้าได้ "Request timed out" แสดงว่าเชื่อมต่อไม่ได้
```

### ❌ ปัญหา: ส่งคำสั่งแล้วไม่ทำงาน

**แก้ไข:**
```
1. ตรวจสอบ Path ว่าถูกต้อง
2. ลอง Copy-Paste Path จาก File Explorer
3. รัน Agent แบบ Administrator:
   - คลิกขวา "3-START-AGENT.bat"
   - เลือก "Run as administrator"
```

---

## 📱 **ควบคุมจากมือถือ**

ถ้าต้องการควบคุมจากมือถือ (iPhone/iPad):

```
1. เชื่อมต่อ WiFi เดียวกับ Mac
2. เปิด Safari
3. ไปที่: http://192.168.1.104:3000
4. จะเห็นหน้าเว็บเหมือนบน Mac
```

---

## 🎮 **ตั้งค่าให้รันอัตโนมัติ**

ถ้าต้องการให้ Windows เปิดเครื่องแล้ว Agent ทำงานอัตโนมัติ:

```
1. กด Windows + R
2. พิมพ์: shell:startup
3. กด Enter
4. คลิกขวาใน Folder นี้ > New > Shortcut
5. Browse ไปที่ C:\FOR-WINDOWS\3-START-AGENT.bat
6. ตั้งชื่อ: "Remote Control Agent"
7. Finish

ตอนนี้ทุกครั้งที่เปิดเครื่อง Windows จะรัน Agent อัตโนมัติ
```

---

## 📊 **สรุป**

### บน Mac:
```bash
✅ รัน Server: node server-multi.js
✅ รัน Frontend: npm start (ในโฟลเดอร์ client)
✅ เปิดเว็บ: http://localhost:3000
```

### บน Windows:
```
✅ ติดตั้ง Node.js แล้ว
✅ คัดลอกไฟล์ FOR-WINDOWS แล้ว
✅ รัน 1-INSTALL.bat แล้ว
✅ แก้ไข 2-CONFIG.bat แล้ว (ใส่ IP: 192.168.1.104)
✅ รัน 3-START-AGENT.bat แล้ว
✅ เห็น "✅ Connected to server"
```

### บนเว็บ:
```
✅ เปิด http://localhost:3000
✅ เห็นเครื่อง Windows
✅ คลิกเลือกเครื่อง
✅ ส่งคำสั่งได้แล้ว!
```

---

## 🎉 **เริ่มใช้งานได้เลย!**

ตอนนี้คุณสามารถ:
- ✅ เปิดโปรแกรมบน Windows จาก Mac
- ✅ ดูข้อมูลระบบ Windows
- ✅ ล็อค/หลับ/รีสตาร์ท/ปิดเครื่อง Windows
- ✅ ควบคุมได้จากทุกที่ในเครือข่าย
- ✅ ดู Log การทำงานแบบ Real-time

**Happy Remote Controlling!** 🚀

---

## 📞 ต้องการความช่วยเหลือ?

ดูคู่มือเพิ่มเติม:
- `FOR-WINDOWS/คู่มือการใช้งาน.txt` - คู่มือภาษาไทยละเอียด
- `WINDOWS-SETUP-GUIDE.md` - คู่มือภาษาไทยฉบับเต็ม
- `QUICK-START.md` - คู่มือเริ่มต้นอย่างเร็ว
- `REMOTE-CONTROL-GUIDE.md` - คู่มือการควบคุมทางไกล
