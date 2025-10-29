import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [systemInfo, setSystemInfo] = useState(null);
  const [programPath, setProgramPath] = useState('');
  const [programArgs, setProgramArgs] = useState('');
  const [status, setStatus] = useState('กำลังเชื่อมต่อ...');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // เชื่อมต่อ WebSocket
    const newSocket = io(API_BASE_URL);
    setSocket(newSocket);

    // Event listeners
    newSocket.on('connect', () => {
      setConnected(true);
      setStatus('เชื่อมต่อสำเร็จ');
      addLog('เชื่อมต่อกับเซิร์ฟเวอร์สำเร็จ', 'success');
      
      // ลงทะเบียนเป็น Client
      newSocket.emit('register-client', {
        userAgent: navigator.userAgent
      });
      
      // ขอรายการ Agents
      newSocket.emit('get-agent-list');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      setStatus('การเชื่อมต่อขาดหาย');
      addLog('การเชื่อมต่อขาดหาย', 'error');
    });

    newSocket.on('agent-list-updated', (data) => {
      setAgents(data.agents || []);
      addLog(`อัพเดทรายการเครื่อง: ${data.agents?.length || 0} เครื่อง`, 'info');
    });

    newSocket.on('program-launched', (data) => {
      addLog(`✅ เปิดโปรแกรมสำเร็จ: ${data.program}`, 'success');
    });

    newSocket.on('program-launch-error', (data) => {
      addLog(`❌ ไม่สามารถเปิดโปรแกรมได้: ${data.error}`, 'error');
    });

    newSocket.on('system-control-success', (data) => {
      addLog(`✅ ดำเนินการสำเร็จ: ${data.message}`, 'success');
    });

    newSocket.on('system-control-error', (data) => {
      addLog(`❌ เกิดข้อผิดพลาด: ${data.error}`, 'error');
    });

    newSocket.on('system-info', (data) => {
      setSystemInfo(data);
      addLog('📊 ได้รับข้อมูลระบบ', 'info');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const refreshAgentList = () => {
    if (socket && connected) {
      socket.emit('get-agent-list');
      addLog('🔄 รีเฟรชรายการเครื่อง', 'info');
    }
  };

  const launchProgram = async () => {
    if (!selectedAgent) {
      addLog('❌ กรุณาเลือกเครื่องที่ต้องการควบคุม', 'error');
      return;
    }

    if (!programPath.trim()) {
      addLog('❌ กรุณาระบุ path ของโปรแกรม', 'error');
      return;
    }

    const args = programArgs.split(' ').filter(arg => arg.trim());
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/agent/${selectedAgent.agentId}/launch-program`,
        {
          programPath: programPath.trim(),
          arguments: args
        }
      );
      
      addLog(`📤 ส่งคำสั่งเปิดโปรแกรมไปยัง ${selectedAgent.agentName}`, 'info');
    } catch (error) {
      addLog(`❌ ไม่สามารถส่งคำสั่ง: ${error.message}`, 'error');
    }
  };

  const systemControl = async (action) => {
    if (!selectedAgent) {
      addLog('❌ กรุณาเลือกเครื่องที่ต้องการควบคุม', 'error');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/agent/${selectedAgent.agentId}/system-control`,
        { action }
      );
      
      addLog(`📤 ส่งคำสั่ง ${action} ไปยัง ${selectedAgent.agentName}`, 'info');
    } catch (error) {
      addLog(`❌ ไม่สามารถส่งคำสั่ง: ${error.message}`, 'error');
    }
  };

  const getSystemInfo = async () => {
    if (!selectedAgent) {
      addLog('❌ กรุณาเลือกเครื่องที่ต้องการดูข้อมูล', 'error');
      return;
    }

    try {
      await axios.get(`${API_BASE_URL}/api/agent/${selectedAgent.agentId}/system-info`);
      addLog(`📤 ขอข้อมูลระบบจาก ${selectedAgent.agentName}`, 'info');
    } catch (error) {
      addLog(`❌ ไม่สามารถขอข้อมูล: ${error.message}`, 'error');
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'win32': return '🪟';
      case 'darwin': return '🍎';
      case 'linux': return '🐧';
      default: return '🖥️';
    }
  };

  const getProgramPlaceholder = () => {
    if (!selectedAgent) return 'เลือกเครื่องก่อน...';
    
    switch (selectedAgent.platform) {
      case 'win32':
        return 'C:\\Program Files\\Notepad++\\notepad++.exe';
      case 'darwin':
        return '/Applications/Calculator.app';
      case 'linux':
        return '/usr/bin/firefox';
      default:
        return 'ระบุ path ของโปรแกรม';
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌐 Remote Computer Control Center</h1>
        <p>ควบคุมคอมพิวเตอร์หลายเครื่องทางไกลผ่านเว็บเบราว์เซอร์</p>
        
        <div className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          {status}
        </div>
      </header>

      <main className="main-content">
        <div className="control-panel">
          {/* Agent Selection */}
          <div className="section">
            <div className="section-header">
              <h2>🖥️ เลือกเครื่องที่ต้องการควบคุม</h2>
              <button onClick={refreshAgentList} className="btn btn-secondary btn-sm">
                🔄 รีเฟรช
              </button>
            </div>
            
            {agents.length === 0 ? (
              <div className="no-agents">
                <p>⚠️ ไม่มีเครื่องที่เชื่อมต่ออยู่</p>
                <p className="hint">ติดตั้งและรัน Agent บนเครื่องที่ต้องการควบคุม</p>
                <code>node agent.js</code>
              </div>
            ) : (
              <div className="agents-grid">
                {agents.map((agent) => (
                  <div
                    key={agent.agentId}
                    className={`agent-card ${selectedAgent?.agentId === agent.agentId ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedAgent(agent);
                      setSystemInfo(null);
                      addLog(`🎯 เลือกเครื่อง: ${agent.agentName}`, 'info');
                    }}
                  >
                    <div className="agent-icon">
                      {getPlatformIcon(agent.platform)}
                    </div>
                    <div className="agent-info">
                      <h3>{agent.agentName}</h3>
                      <p className="agent-hostname">{agent.hostname}</p>
                      <p className="agent-platform">{agent.platform} | {agent.arch}</p>
                      <p className="agent-status">
                        <span className="status-dot-small"></span>
                        ออนไลน์
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedAgent && (
            <>
              {/* System Info */}
              <div className="section">
                <h2>📊 ข้อมูลระบบ: {selectedAgent.agentName}</h2>
                <button onClick={getSystemInfo} className="btn btn-info">
                  โหลดข้อมูลระบบ
                </button>
                
                {systemInfo && systemInfo.agentId === selectedAgent.agentId && (
                  <div className="system-info">
                    <div className="info-grid">
                      <div className="info-item">
                        <strong>ระบบปฏิบัติการ:</strong> {systemInfo.platform}
                      </div>
                      <div className="info-item">
                        <strong>สถาปัตยกรรม:</strong> {systemInfo.arch}
                      </div>
                      <div className="info-item">
                        <strong>ชื่อเครื่อง:</strong> {systemInfo.hostname}
                      </div>
                      <div className="info-item">
                        <strong>เวลาทำงาน:</strong> {Math.floor(systemInfo.uptime / 3600)} ชั่วโมง
                      </div>
                      <div className="info-item">
                        <strong>หน่วยความจำ:</strong> {Math.round(systemInfo.freeMemory / 1024 / 1024 / 1024)} GB / {Math.round(systemInfo.totalMemory / 1024 / 1024 / 1024)} GB
                      </div>
                      <div className="info-item">
                        <strong>CPU:</strong> {systemInfo.cpus} cores
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Launch Program */}
              <div className="section">
                <h2>🚀 เปิดโปรแกรมบน {selectedAgent.agentName}</h2>
                <div className="form-group">
                  <label>Path ของโปรแกรม:</label>
                  <input
                    type="text"
                    value={programPath}
                    onChange={(e) => setProgramPath(e.target.value)}
                    placeholder={getProgramPlaceholder()}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Arguments (ไม่บังคับ):</label>
                  <input
                    type="text"
                    value={programArgs}
                    onChange={(e) => setProgramArgs(e.target.value)}
                    placeholder="เช่น --new-window"
                    className="form-input"
                  />
                </div>
                <button onClick={launchProgram} className="btn btn-primary">
                  เปิดโปรแกรม
                </button>
              </div>

              {/* System Control */}
              <div className="section">
                <h2>⚙️ ควบคุมระบบ: {selectedAgent.agentName}</h2>
                <div className="control-buttons">
                  <button 
                    onClick={() => systemControl('lock')} 
                    className="btn btn-warning"
                  >
                    🔒 ล็อคหน้าจอ
                  </button>
                  <button 
                    onClick={() => systemControl('sleep')} 
                    className="btn btn-warning"
                  >
                    😴 หลับ
                  </button>
                  <button 
                    onClick={() => systemControl('restart')} 
                    className="btn btn-danger"
                  >
                    🔄 รีสตาร์ท
                  </button>
                  <button 
                    onClick={() => systemControl('shutdown')} 
                    className="btn btn-danger"
                  >
                    ⏹️ ปิดเครื่อง
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Logs */}
        <div className="logs-section">
          <div className="logs-header">
            <h2>📝 บันทึกการทำงาน</h2>
            <button onClick={clearLogs} className="btn btn-secondary btn-sm">
              ล้างบันทึก
            </button>
          </div>
          <div className="logs-container">
            {logs.length === 0 ? (
              <div className="log-item info">
                <span className="log-message">รอการทำงาน...</span>
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`log-item ${log.type}`}>
                  <span className="log-time">[{log.timestamp}]</span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
