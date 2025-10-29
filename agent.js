// Agent สำหรับติดตั้งบนเครื่องที่ต้องการควบคุม
const io = require('socket.io-client');
const { exec } = require('child_process');
const os = require('os');

// กำหนดค่าการเชื่อมต่อ
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';
const AGENT_NAME = process.env.AGENT_NAME || os.hostname();
const AGENT_ID = process.env.AGENT_ID || `agent-${Math.random().toString(36).substr(2, 9)}`;

console.log('🤖 Starting Remote Control Agent...');
console.log('📡 Server URL:', SERVER_URL);
console.log('🖥️  Agent Name:', AGENT_NAME);
console.log('🆔 Agent ID:', AGENT_ID);

// เชื่อมต่อกับเซิร์ฟเวอร์
const socket = io(SERVER_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: Infinity
});

// เมื่อเชื่อมต่อสำเร็จ
socket.on('connect', () => {
  console.log('✅ Connected to server');
  
  // ลงทะเบียนตัวเองเป็น Agent
  socket.emit('register-agent', {
    agentId: AGENT_ID,
    agentName: AGENT_NAME,
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname(),
    osType: os.type(),
    osRelease: os.release()
  });
});

// เมื่อการเชื่อมต่อขาดหาย
socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
});

// เมื่อเชื่อมต่อใหม่
socket.on('reconnect', () => {
  console.log('🔄 Reconnected to server');
});

// รับคำสั่งเปิดโปรแกรม
socket.on('launch-program', (data) => {
  console.log('🚀 Launch program:', data.programPath);
  
  const { programPath, arguments: args = [] } = data;
  
  if (!programPath) {
    socket.emit('program-launch-error', { 
      error: 'โปรแกรม path จำเป็นต้องระบุ' 
    });
    return;
  }

  const platform = os.platform();
  let command;
  
  if (platform === 'win32') {
    // Windows
    command = `start "" "${programPath}"`;
    if (args.length > 0) {
      command += ` ${args.join(' ')}`;
    }
  } else if (platform === 'darwin') {
    // macOS
    command = `open "${programPath}"`;
    if (args.length > 0) {
      command += ` --args ${args.join(' ')}`;
    }
  } else {
    // Linux
    command = `"${programPath}"`;
    if (args.length > 0) {
      command += ` ${args.join(' ')}`;
    }
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error launching program:', error.message);
      socket.emit('program-launch-error', { 
        error: 'ไม่สามารถเปิดโปรแกรมได้', 
        details: error.message 
      });
    } else {
      console.log('✅ Program launched successfully');
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
  console.log('⚙️  System control:', data.action);
  
  const { action } = data;
  let command;
  const platform = os.platform();
  
  switch (action) {
    case 'shutdown':
      command = platform === 'win32' ? 'shutdown /s /t 5' : 
                platform === 'darwin' ? 'sudo shutdown -h +1' : 
                'sudo shutdown -h +1';
      break;
    case 'restart':
      command = platform === 'win32' ? 'shutdown /r /t 5' : 
                platform === 'darwin' ? 'sudo shutdown -r +1' : 
                'sudo reboot';
      break;
    case 'sleep':
      command = platform === 'win32' ? 'rundll32.exe powrprof.dll,SetSuspendState 0,1,0' : 
                platform === 'darwin' ? 'pmset sleepnow' : 
                'systemctl suspend';
      break;
    case 'lock':
      command = platform === 'win32' ? 'rundll32.exe user32.dll,LockWorkStation' : 
                platform === 'darwin' ? 'pmset displaysleepnow' : 
                'loginctl lock-session';
      break;
    default:
      socket.emit('system-control-error', { error: 'การกระทำไม่ถูกต้อง' });
      return;
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error executing system control:', error.message);
      socket.emit('system-control-error', { 
        error: 'ไม่สามารถดำเนินการได้', 
        details: error.message 
      });
    } else {
      console.log('✅ System control executed successfully');
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
  console.log('📊 Getting system info...');
  
  const systemInfo = {
    agentId: AGENT_ID,
    agentName: AGENT_NAME,
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname(),
    uptime: os.uptime(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    cpus: os.cpus().length,
    cpuModel: os.cpus()[0]?.model || 'Unknown',
    loadAverage: os.loadavg(),
    osType: os.type(),
    osRelease: os.release(),
    networkInterfaces: getNetworkInterfaces()
  };
  
  socket.emit('system-info', systemInfo);
  console.log('✅ System info sent');
});

// ดึงข้อมูล Network Interfaces
function getNetworkInterfaces() {
  const interfaces = os.networkInterfaces();
  const result = [];
  
  for (const [name, nets] of Object.entries(interfaces)) {
    for (const net of nets) {
      if (net.family === 'IPv4' && !net.internal) {
        result.push({
          interface: name,
          address: net.address,
          netmask: net.netmask,
          mac: net.mac
        });
      }
    }
  }
  
  return result;
}

// รับคำสั่ง ping
socket.on('ping', () => {
  socket.emit('pong', {
    agentId: AGENT_ID,
    timestamp: Date.now()
  });
});

// Error handling
socket.on('error', (error) => {
  console.error('❌ Socket error:', error);
});

// ส่งสถานะทุก 30 วินาที
setInterval(() => {
  socket.emit('agent-heartbeat', {
    agentId: AGENT_ID,
    agentName: AGENT_NAME,
    uptime: os.uptime(),
    freeMemory: os.freemem(),
    loadAverage: os.loadavg()[0],
    timestamp: Date.now()
  });
}, 30000);

console.log('✅ Agent is running and ready to receive commands');
console.log('Press Ctrl+C to stop');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping agent...');
  socket.emit('agent-disconnect', { agentId: AGENT_ID });
  socket.close();
  process.exit(0);
});
