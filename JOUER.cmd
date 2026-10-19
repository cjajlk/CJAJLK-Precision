@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js est necessaire pour lancer le serveur local.
  pause
  exit /b 1
)
echo Ouvrez http://127.0.0.1:4173 dans votre navigateur.
node server.mjs
pause
