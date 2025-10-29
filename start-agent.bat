@echo off
REM ============================================
REM  Remote Control Agent - Start Script
REM ============================================

REM ตั้งค่า Server URL (แก้ไขตรงนี้)
REM ถ้า Server อยู่เครื่องเดียวกัน: http://localhost:3001
REM ถ้า Server อยู่คนละเครื่อง: http://IP_ADDRESS:3001
REM ตัวอย่าง: http://192.168.1.100:3001
set SERVER_URL=http://localhost:3001

REM ตั้งชื่อเครื่อง (แก้ไขตามต้องการ)
set AGENT_NAME=Windows-Gaming-PC

REM ตั้ง Agent ID (ไม่ต้องแก้ไข)
set AGENT_ID=agent-windows-%RANDOM%

echo ========================================
echo  Remote Control Agent
echo ========================================
echo Server: %SERVER_URL%
echo Agent Name: %AGENT_NAME%
echo Agent ID: %AGENT_ID%
echo ========================================
echo.
echo กำลังเชื่อมต่อกับ Server...
echo กด Ctrl+C เพื่อหยุด
echo.

REM รัน Agent
node agent.js

pause
