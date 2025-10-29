@echo off
REM ============================================
REM  Remote Control Agent - Configuration
REM ============================================
REM 
REM แก้ไขค่าเหล่านี้ตามต้องการ:
REM 

REM IP ของเครื่อง Mac (Server)
REM ค้นหาได้โดยเปิด Terminal บน Mac แล้วพิมพ์: ifconfig
set SERVER_URL=http://192.168.1.104:3001

REM ชื่อเครื่อง Windows นี้ (แก้ไขตามต้องการ)
set AGENT_NAME=Windows-PC

REM ============================================
REM  อย่าแก้ไขด้านล่างนี้
REM ============================================

echo Configuration saved!
echo.
echo Server URL: %SERVER_URL%
echo Agent Name: %AGENT_NAME%
echo.
echo บันทึกการตั้งค่าแล้ว
echo ต่อไปให้ Double-click "3-START-AGENT.bat"
echo.
pause
