@echo off
color 0B
REM ============================================
REM  Remote Control Agent - Start
REM ============================================

REM โหลดการตั้งค่าจาก 2-CONFIG.bat
call 2-CONFIG.bat >nul 2>nul

REM ตั้ง Agent ID อัตโนมัติ
set AGENT_ID=agent-windows-%RANDOM%

cls
echo ========================================
echo   Remote Control Agent - Running
echo ========================================
echo Server: %SERVER_URL%
echo Agent Name: %AGENT_NAME%
echo Agent ID: %AGENT_ID%
echo ========================================
echo.
echo [INFO] กำลังเชื่อมต่อกับ Mac...
echo [INFO] กด Ctrl+C เพื่อหยุด
echo.

REM ไปยังโฟลเดอร์ที่มี agent.js
cd /d "%~dp0"

REM รัน Agent
node agent.js

if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] เกิดข้อผิดพลาด
    echo.
    echo ตรวจสอบ:
    echo 1. Mac รัน Server อยู่หรือไม่
    echo 2. IP ใน 2-CONFIG.bat ถูกต้องหรือไม่
    echo 3. เครื่อง Windows และ Mac อยู่ในเครือข่ายเดียวกันหรือไม่
    echo 4. Firewall บน Mac อนุญาต port 3001 หรือไม่
    echo.
)

pause
