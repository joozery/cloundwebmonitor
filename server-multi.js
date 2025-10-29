const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
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

// เก็บข้อมูล Agents (เครื่องที่ถูกควบคุม)
const connectedAgents = new Map();

// เก็บข้อมูล Clients (เว็บที่ควบคุม)
const connectedClients = new Map();

// API Routes
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online', 
    connectedAgents: connectedAgents.size,
    connectedClients: connectedClients.size,
    timestamp: new Date().toISOString()
  });
});

// ดูรายการ Agents ที่เชื่อมต่อ
app.get('/api/agents', (req, res) => {
  const agents = Array.from(connectedAgents.values()).map(agent => ({
    agentId: agent.agentId,
    agentName: agent.agentName,
    platform: agent.platform,
    arch: agent.arch,
    hostname: agent.hostname,
    connectedAt: agent.connectedAt,
    lastHeartbeat: agent.lastHeartbeat,
    socketId: agent.socketId
  }));
  
  res.json({ 
    success: true,
    count: agents.length,
    agents: agents
  });
});

// ส่งคำสั่งไปยัง Agent เฉพาะเครื่อง
app.post('/api/agent/:agentId/launch-program', (req, res) => {
  const { agentId } = req.params;
  const { programPath, arguments: args = [] } = req.body;
  
  const agent = connectedAgents.get(agentId);
  
  if (!agent) {
    return res.status(404).json({ 
      error: 'ไม่พบ Agent นี้',
      agentId: agentId
    });
  }
  
  if (!programPath) {
    return res.status(400).json({ error: 'โปรแกรม path จำเป็นต้องระบุ' });
  }
  
  // ส่งคำสั่งไปยัง Agent
  io.to(agent.socketId).emit('launch-program', {
    programPath: programPath,
    arguments: args
  });
  
  res.json({ 
    success: true, 
    message: 'ส่งคำสั่งเปิดโปรแกรมไปยัง Agent แล้ว',
    agentId: agentId,
    agentName: agent.agentName
  });
});

// ส่งคำสั่งควบคุมระบบไปยัง Agent
app.post('/api/agent/:agentId/system-control', (req, res) => {
  const { agentId } = req.params;
  const { action } = req.body;
  
  const agent = connectedAgents.get(agentId);
  
  if (!agent) {
    return res.status(404).json({ 
      error: 'ไม่พบ Agent นี้',
      agentId: agentId
    });
  }
  
  // ส่งคำสั่งไปยัง Agent
  io.to(agent.socketId).emit('system-control', { action });
  
  res.json({ 
    success: true, 
    message: `ส่งคำสั่ง ${action} ไปยัง Agent แล้ว`,
    agentId: agentId,
    agentName: agent.agentName
  });
});

// ขอข้อมูลระบบจาก Agent
app.get('/api/agent/:agentId/system-info', (req, res) => {
  const { agentId } = req.params;
  
  const agent = connectedAgents.get(agentId);
  
  if (!agent) {
    return res.status(404).json({ 
      error: 'ไม่พบ Agent นี้',
      agentId: agentId
    });
  }
  
  // ส่งคำสั่งขอข้อมูลไปยัง Agent
  io.to(agent.socketId).emit('get-system-info');
  
  res.json({ 
    success: true, 
    message: 'ส่งคำสั่งขอข้อมูลระบบแล้ว',
    agentId: agentId
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('🔌 New connection:', socket.id);
  
  // ลงทะเบียน Agent (เครื่องที่ถูกควบคุม)
  socket.on('register-agent', (data) => {
    const { agentId, agentName, platform, arch, hostname, osType, osRelease } = data;
    
    connectedAgents.set(agentId, {
      agentId,
      agentName,
      platform,
      arch,
      hostname,
      osType,
      osRelease,
      socketId: socket.id,
      connectedAt: new Date(),
      lastHeartbeat: new Date()
    });
    
    console.log(`✅ Agent registered: ${agentName} (${agentId})`);
    console.log(`   Platform: ${platform} | Hostname: ${hostname}`);
    
    // แจ้ง clients ทั้งหมดว่ามี agent ใหม่
    io.emit('agent-list-updated', {
      agents: Array.from(connectedAgents.values()).map(a => ({
        agentId: a.agentId,
        agentName: a.agentName,
        platform: a.platform,
        hostname: a.hostname,
        connectedAt: a.connectedAt
      }))
    });
    
    socket.emit('registration-success', {
      message: 'ลงทะเบียนสำเร็จ',
      agentId: agentId
    });
  });
  
  // ลงทะเบียน Client (เว็บที่ควบคุม)
  socket.on('register-client', (data) => {
    connectedClients.set(socket.id, {
      socketId: socket.id,
      connectedAt: new Date(),
      ...data
    });
    
    console.log(`👤 Client registered: ${socket.id}`);
    
    // ส่งรายการ agents ที่มีให้ client
    socket.emit('agent-list-updated', {
      agents: Array.from(connectedAgents.values()).map(a => ({
        agentId: a.agentId,
        agentName: a.agentName,
        platform: a.platform,
        hostname: a.hostname,
        connectedAt: a.connectedAt,
        lastHeartbeat: a.lastHeartbeat
      }))
    });
  });
  
  // Agent Heartbeat
  socket.on('agent-heartbeat', (data) => {
    const { agentId } = data;
    const agent = connectedAgents.get(agentId);
    
    if (agent) {
      agent.lastHeartbeat = new Date();
      agent.uptime = data.uptime;
      agent.freeMemory = data.freeMemory;
      agent.loadAverage = data.loadAverage;
    }
  });
  
  // รับผลลัพธ์จาก Agent และส่งต่อให้ Clients ทั้งหมด
  socket.on('program-launched', (data) => {
    io.emit('program-launched', data);
  });
  
  socket.on('program-launch-error', (data) => {
    io.emit('program-launch-error', data);
  });
  
  socket.on('system-control-success', (data) => {
    io.emit('system-control-success', data);
  });
  
  socket.on('system-control-error', (data) => {
    io.emit('system-control-error', data);
  });
  
  socket.on('system-info', (data) => {
    io.emit('system-info', data);
  });
  
  // คำสั่งจาก Client ไปยัง Agent เฉพาะเครื่อง
  socket.on('send-to-agent', (data) => {
    const { agentId, event, payload } = data;
    const agent = connectedAgents.get(agentId);
    
    if (agent) {
      io.to(agent.socketId).emit(event, payload);
      console.log(`📤 Sent to agent ${agentName}: ${event}`);
    } else {
      socket.emit('error', {
        message: 'ไม่พบ Agent ที่ระบุ',
        agentId: agentId
      });
    }
  });
  
  // ขอรายการ Agents
  socket.on('get-agent-list', () => {
    socket.emit('agent-list-updated', {
      agents: Array.from(connectedAgents.values()).map(a => ({
        agentId: a.agentId,
        agentName: a.agentName,
        platform: a.platform,
        hostname: a.hostname,
        connectedAt: a.connectedAt,
        lastHeartbeat: a.lastHeartbeat
      }))
    });
  });
  
  // Agent Disconnect
  socket.on('agent-disconnect', (data) => {
    const { agentId } = data;
    connectedAgents.delete(agentId);
    console.log(`❌ Agent disconnected: ${agentId}`);
    
    // แจ้ง clients ทั้งหมด
    io.emit('agent-list-updated', {
      agents: Array.from(connectedAgents.values()).map(a => ({
        agentId: a.agentId,
        agentName: a.agentName,
        platform: a.platform,
        hostname: a.hostname
      }))
    });
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log('🔌 Disconnected:', socket.id);
    
    // ลบ client ถ้าเป็น client
    connectedClients.delete(socket.id);
    
    // ลบ agent ถ้าเป็น agent
    for (const [agentId, agent] of connectedAgents.entries()) {
      if (agent.socketId === socket.id) {
        connectedAgents.delete(agentId);
        console.log(`❌ Agent disconnected: ${agentId}`);
        
        // แจ้ง clients ทั้งหมด
        io.emit('agent-list-updated', {
          agents: Array.from(connectedAgents.values()).map(a => ({
            agentId: a.agentId,
            agentName: a.agentName,
            platform: a.platform,
            hostname: a.hostname
          }))
        });
        break;
      }
    }
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

server.listen(PORT, () => {
  console.log('═══════════════════════════════════════════');
  console.log('🚀 Remote Control Server Started');
  console.log('═══════════════════════════════════════════');
  console.log(`🌐 Web interface: http://localhost:${PORT}`);
  console.log(`📡 WebSocket ready on port ${PORT}`);
  console.log('');
  console.log('📌 To control remote computers:');
  console.log('   1. Install agent on target computer');
  console.log('   2. Run: node agent.js');
  console.log('   3. Open web interface to control');
  console.log('═══════════════════════════════════════════');
});
