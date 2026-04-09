@echo off
set NODE_ENV=production
set PORT=3000
cd /d %~dp0

if exist "C:\Program Files\nodejs\node.exe" (
  "C:\Program Files\nodejs\node.exe" server.js
) else (
  echo Node.js not found. Please install Node.js LTS or fix PATH.
  pause
)