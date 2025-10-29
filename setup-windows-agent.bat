@echo off
echo ========================================
echo  Remote Control Agent - Windows Setup
echo ========================================
echo.

REM ตรวจสอบว่ามี Node.js หรือไม่
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js ไม่ได้ติดตั้ง
    echo กรุณาติดตั้ง Node.js จาก https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] พบ Node.js แล้ว
node --version
echo.

REM ติดตั้ง dependencies
echo กำลังติดตั้ง dependencies...
call npm install socket.io-client
if %errorlevel% neq 0 (
    echo [ERROR] ติดตั้ง dependencies ไม่สำเร็จ
    pause
    exit /b 1
)

echo.
echo ========================================
echo  ติดตั้งสำเร็จ!
echo ========================================
echo.
echo วิธีใช้งาน:
echo 1. แก้ไขไฟล์ start-agent.bat
echo 2. ใส่ Server URL และชื่อเครื่อง
echo 3. Double-click start-agent.bat เพื่อเริ่มใช้งาน
echo.
pause
