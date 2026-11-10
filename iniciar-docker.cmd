@echo off
cd /d "%~dp0"
docker info >nul 2>nul
if errorlevel 1 (
  echo Inicia Docker Desktop y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)
docker compose config --quiet
if errorlevel 1 (
  echo Prepara la configuracion privada con npm run docker:setup.
  pause
  exit /b 1
)
docker compose up -d --build --wait --wait-timeout 90
if errorlevel 1 (
  echo No se pudo iniciar CampusTrade. Revisa docker compose logs app.
  pause
  exit /b 1
)
echo CampusTrade esta listo:
for /f %%a in ('docker compose port app 3000') do echo http://%%a
echo Los datos e imagenes se conservan en volumenes de Docker.
pause
