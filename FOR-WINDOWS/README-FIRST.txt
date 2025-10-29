========================================
  สำหรับติดตั้งบนเครื่อง Windows
========================================

คัดลอกโฟลเดอร์นี้ทั้งหมดไปยังเครื่อง Windows

ขั้นตอน:
1. ติดตั้ง Node.js จาก https://nodejs.org/
2. รีสตาร์ทเครื่อง Windows
3. Double-click "1-INSTALL.bat"
4. แก้ไขไฟล์ "2-CONFIG.bat" (ใส่ IP ของ Mac)
5. Double-click "3-START-AGENT.bat"

IP ของ Mac ที่ต้องใส่: 192.168.1.104

ตัวอย่างการแก้ไข 2-CONFIG.bat:
set SERVER_URL=http://192.168.1.104:3001
set AGENT_NAME=My-Windows-PC

========================================
