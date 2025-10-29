@echo off
color 0A
echo ========================================
echo   Remote Control Agent - Installation
echo ========================================
echo.

REM ตรวจสอบ Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] ไม่พบ Node.js
    echo.
    echo กรุณาติดตั้ง Node.js ก่อน:
    echo 1. ไปที่ https://nodejs.org/
    echo 2. ดาวน์โหลด LTS version
    echo 3. ติดตั้งตามปกติ
    echo 4. รีสตาร์ทเครื่อง Windows
    echo 5. รันไฟล์นี้อีกครั้ง
    echo.
    pause
    exit /b 1
)

echo [OK] พบ Node.js
node --version
npm --version
echo.

echo กำลังติดตั้ง dependencies...
echo.
call npm install socket.io-client

if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] การติดตั้งล้มเหลว
    echo.
    pause
    exit /b 1
)

color 0A
echo.
echo ========================================
echo   ติดตั้งสำเร็จ!
echo ========================================
echo.
echo ขั้นตอนต่อไป:
echo 1. แก้ไขไฟล์ "2-CONFIG.bat"
echo 2. ใส่ IP ของ Mac และชื่อเครื่อง
echo 3. Double-click "3-START-AGENT.bat"
echo.
pause
