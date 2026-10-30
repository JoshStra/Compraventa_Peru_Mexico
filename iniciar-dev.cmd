@echo off
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js ni npm.
  echo Instala Node.js LTS desde https://nodejs.org y vuelve a abrir este archivo.
  pause
  exit /b 1
)

call npm ls --workspaces --depth=0 >nul 2>nul
if errorlevel 1 (
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
if not exist "backend\.env" (
  echo Configura backend\.env siguiendo README.md antes de iniciar.
  pause
  exit /b 1
)
echo Compilando CampusTrade...
call npm run build
if errorlevel 1 (
  pause
  exit /b 1
)
echo Iniciando la aplicacion completa. Abre la URL indicada por el servidor.
call npm start
pause
