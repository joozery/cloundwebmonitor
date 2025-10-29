# 🖥️ Remote Computer Control

เว็บแอพพลิเคชันสำหรับควบคุมคอมพิวเตอร์ทางไกลผ่านเว็บเบราว์เซอร์

## ✨ ฟีเจอร์

- 🚀 เปิดโปรแกรมบนเครื่องปลายทาง
- 📊 ดูข้อมูลระบบ (CPU, RAM, เวลาทำงาน)
- ⚙️ ควบคุมระบบ (ล็อคหน้าจอ, หลับ, รีสตาร์ท, ปิดเครื่อง)
- 📝 บันทึกการทำงานแบบ real-time
- 🔌 การเชื่อมต่อแบบ WebSocket
- 📱 Responsive Design

## 🛠️ เทคโนโลยีที่ใช้

### Backend
- Node.js + Express
- Socket.IO (WebSocket)
- Child Process (สำหรับรันคำสั่งระบบ)

### Frontend
- React.js
- Socket.IO Client
- Axios (HTTP requests)
- CSS3 (Modern UI)

## 🚀 การติดตั้งและใช้งาน

### 1. ติดตั้ง Dependencies

```bash
# ติดตั้ง dependencies สำหรับ backend
npm install

# ติดตั้ง dependencies สำหรับ frontend
cd client
npm install
cd ..
```

### 2. เริ่มต้นเซิร์ฟเวอร์

```bash
# เริ่มต้น backend server
npm start

# หรือใช้ development mode
npm run dev
```

### 3. เริ่มต้น Frontend (ใน terminal ใหม่)

```bash
cd client
npm start
```

### 4. เข้าถึงแอพพลิเคชัน

- Backend API: http://localhost:3001
- Frontend: http://localhost:3000
- WebSocket: ws://localhost:3001

## 📋 การใช้งาน

### เปิดโปรแกรม
1. ระบุ path ของโปรแกรมที่ต้องการเปิด
2. เพิ่ม arguments (ถ้ามี)
3. กดปุ่ม "เปิดโปรแกรม"

### ดูข้อมูลระบบ
1. กดปุ่ม "โหลดข้อมูลระบบ"
2. ดูข้อมูล CPU, RAM, เวลาทำงาน

### ควบคุมระบบ
- **ล็อคหน้าจอ**: ล็อคหน้าจอคอมพิวเตอร์
- **หลับ**: เปลี่ยนเป็นโหมดหลับ
- **รีสตาร์ท**: รีสตาร์ทเครื่อง
- **ปิดเครื่อง**: ปิดเครื่องคอมพิวเตอร์

## 🔒 ความปลอดภัย

⚠️ **คำเตือน**: แอพนี้มีสิทธิ์ในการควบคุมระบบคอมพิวเตอร์ ควรใช้ในสภาพแวดล้อมที่ปลอดภัยเท่านั้น

### ข้อแนะนำด้านความปลอดภัย:
- ใช้ในเครือข่ายส่วนตัวเท่านั้น
- ตั้งรหัสผ่านสำหรับการเข้าถึง
- จำกัดการเข้าถึงด้วย IP address
- ใช้ HTTPS ในสภาพแวดล้อม production

## 🛡️ การปรับปรุงความปลอดภัย

สำหรับการใช้งานจริง ควรเพิ่ม:
- Authentication system
- Authorization levels
- Rate limiting
- Input validation
- Logging และ monitoring
- SSL/TLS encryption

## 📁 โครงสร้างโปรเจค

```
remote-computer-control/
├── server.js              # Backend server
├── package.json           # Backend dependencies
├── client/                # React frontend
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styles
│   │   └── index.js       # React entry point
│   └── package.json       # Frontend dependencies
└── README.md              # Documentation
```

## 🔧 การปรับแต่ง

### เปลี่ยน Port
แก้ไขใน `server.js`:
```javascript
const PORT = process.env.PORT || 3001;
```

### เปลี่ยน API URL
แก้ไขใน `client/src/App.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
```

## 🐛 การแก้ไขปัญหา

### ไม่สามารถเปิดโปรแกรมได้
- ตรวจสอบ path ของโปรแกรม
- ตรวจสอบสิทธิ์การเข้าถึงไฟล์
- ตรวจสอบว่าโปรแกรมติดตั้งแล้ว

### การเชื่อมต่อขาดหาย
- ตรวจสอบว่าเซิร์ฟเวอร์ทำงานอยู่
- ตรวจสอบ firewall settings
- ตรวจสอบ network connection

## 📄 License

MIT License - ใช้ได้อย่างอิสระ

## 🤝 Contributing

ยินดีรับการปรับปรุงและข้อเสนอแนะ!

---

**หมายเหตุ**: แอพนี้สร้างขึ้นเพื่อการศึกษาและใช้งานส่วนตัว กรุณาใช้อย่างมีความรับผิดชอบ
