@echo off
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js ni npm.
  echo Instala Node.js LTS desde https://nodejs.org y vuelve a abrir este archivo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Instalando dependencias por primera vez...
  if exist "package-lock.json" (
    call npm ci
  ) else (
    call npm install
  )
  if errorlevel 1 (
    echo La instalacion no se pudo completar.
    pause
    exit /b 1
  )
)

echo.
echo Iniciando CampusTrade...
call npm run dev -- --open
pause
