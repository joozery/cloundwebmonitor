const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { exec, spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// เก็บข้อมูลการเชื่อมต่อ
const connectedClients = new Map();

// API Routes
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online', 
    connectedClients: connectedClients.size,
    timestamp: new Date().toISOString()
  });
});

// เปิดโปรแกรมบนเครื่องปลายทาง
app.post('/api/launch-program', (req, res) => {
  const { programPath, arguments = [] } = req.body;
  
  if (!programPath) {
    return res.status(400).json({ error: 'โปรแกรม path จำเป็นต้องระบุ' });
  }

  try {
    // ตรวจสอบ OS และเปิดโปรแกรมตามระบบปฏิบัติการ
    const platform = process.platform;
    let command;
    
    if (platform === 'win32') {
      // Windows
      command = `start "" "${programPath}"`;
      if (arguments.length > 0) {
        command += ` ${arguments.join(' ')}`;
      }
    } else if (platform === 'darwin') {
      // macOS
      command = `open "${programPath}"`;
      if (arguments.length > 0) {
        command += ` --args ${arguments.join(' ')}`;
      }
    } else {
      // Linux
      command = `"${programPath}"`;
      if (arguments.length > 0) {
        command += ` ${arguments.join(' ')}`;
      }
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error launching program:', error);
        return res.status(500).json({ 
          error: 'ไม่สามารถเปิดโปรแกรมได้', 
          details: error.message 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'เปิดโปรแกรมสำเร็จ',
        output: stdout,
        command: command
      });
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'เกิดข้อผิดพลาดในการเปิดโปรแกรม', 
      details: err.message 
    });
  }
});

// รับรายการโปรแกรมที่ติดตั้ง
app.get('/api/installed-programs', (req, res) => {
  const platform = process.platform;
  let command;
  
  if (platform === 'win32') {
    // Windows - ดูโปรแกรมที่ติดตั้ง
    command = 'wmic product get name,version /format:csv';
  } else if (platform === 'darwin') {
    // macOS - ดูแอพใน Applications
    command = 'ls /Applications | grep ".app"';
  } else {
    // Linux - ดูโปรแกรมที่ติดตั้ง
    command = 'dpkg -l | grep "^ii" | awk \'{print $2}\'';
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error getting installed programs:', error);
      return res.status(500).json({ 
        error: 'ไม่สามารถดึงรายการโปรแกรมได้', 
        details: error.message 
      });
    }
    
    res.json({ 
      success: true, 
      programs: stdout.split('\n').filter(line => line.trim()),
      platform: platform
    });
  });
});

// ควบคุมระบบ
app.post('/api/system-control', (req, res) => {
  const { action } = req.body;
  
  let command;
  const platform = process.platform;
  
  switch (action) {
    case 'shutdown':
      command = platform === 'win32' ? 'shutdown /s /t 0' : 'sudo shutdown -h now';
      break;
    case 'restart':
      command = platform === 'win32' ? 'shutdown /r /t 0' : 'sudo reboot';
      break;
    case 'sleep':
      command = platform === 'win32' ? 'rundll32.exe powrprof.dll,SetSuspendState 0,1,0' : 'pmset sleepnow';
      break;
    case 'lock':
      command = platform === 'win32' ? 'rundll32.exe user32.dll,LockWorkStation' : 'pmset displaysleepnow';
      break;
    default:
      return res.status(400).json({ error: 'การกระทำไม่ถูกต้อง' });
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error executing system control:', error);
      return res.status(500).json({ 
        error: 'ไม่สามารถดำเนินการได้', 
        details: error.message 
      });
    }
    
    res.json({ 
      success: true, 
      message: `ดำเนินการ ${action} สำเร็จ`,
      action: action
    });
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // เก็บข้อมูล client
  connectedClients.set(socket.id, {
    id: socket.id,
    connectedAt: new Date(),
    ip: socket.handshake.address
  });

  // ส่งข้อมูลสถานะไปยัง client
  socket.emit('status', {
    message: 'เชื่อมต่อสำเร็จ',
    clientId: socket.id,
    serverTime: new Date().toISOString()
  });

  // รับคำสั่งจาก client
  socket.on('launch-program', (data) => {
    const { programPath, arguments = [] } = data;
    
    if (!programPath) {
      socket.emit('error', { message: 'โปรแกรม path จำเป็นต้องระบุ' });
      return;
    }

    const platform = process.platform;
    let command;
    
    if (platform === 'win32') {
      command = `start "" "${programPath}"`;
      if (arguments.length > 0) {
        command += ` ${arguments.join(' ')}`;
      }
    } else if (platform === 'darwin') {
      command = `open "${programPath}"`;
      if (arguments.length > 0) {
        command += ` --args ${arguments.join(' ')}`;
      }
    } else {
      command = `"${programPath}"`;
      if (arguments.length > 0) {
        command += ` ${arguments.join(' ')}`;
      }
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        socket.emit('program-launch-error', { 
          error: 'ไม่สามารถเปิดโปรแกรมได้', 
          details: error.message 
        });
      } else {
        socket.emit('program-launched', { 
          success: true, 
          message: 'เปิดโปรแกรมสำเร็จ',
          program: programPath
        });
      }
    });
  });

  // รับคำสั่งควบคุมระบบ
  socket.on('system-control', (data) => {
    const { action } = data;
    
    let command;
    const platform = process.platform;
    
    switch (action) {
      case 'shutdown':
        command = platform === 'win32' ? 'shutdown /s /t 0' : 'sudo shutdown -h now';
        break;
      case 'restart':
        command = platform === 'win32' ? 'shutdown /r /t 0' : 'sudo reboot';
        break;
      case 'sleep':
        command = platform === 'win32' ? 'rundll32.exe powrprof.dll,SetSuspendState 0,1,0' : 'pmset sleepnow';
        break;
      case 'lock':
        command = platform === 'win32' ? 'rundll32.exe user32.dll,LockWorkStation' : 'pmset displaysleepnow';
        break;
      default:
        socket.emit('system-control-error', { error: 'การกระทำไม่ถูกต้อง' });
        return;
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        socket.emit('system-control-error', { 
          error: 'ไม่สามารถดำเนินการได้', 
          details: error.message 
        });
      } else {
        socket.emit('system-control-success', { 
          success: true, 
          message: `ดำเนินการ ${action} สำเร็จ`,
          action: action
        });
      }
    });
  });

  // รับคำสั่งดูข้อมูลระบบ
  socket.on('get-system-info', () => {
    const os = require('os');
    const systemInfo = {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      uptime: os.uptime(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpus: os.cpus().length,
      loadAverage: os.loadavg()
    };
    
    socket.emit('system-info', systemInfo);
  });

  // เมื่อ client disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    connectedClients.delete(socket.id);
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Web interface: http://localhost:${PORT}`);
  console.log(`📡 WebSocket ready for real-time communication`);
});
