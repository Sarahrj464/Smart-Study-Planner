@echo off
cls
echo ==========================================
echo    🚀 STARTING STUDYPULSE (CLEAN MODE)
echo ==========================================
echo.
echo 🧊 1. Shutting down existing services...
docker-compose down --remove-orphans

echo 📦 2. Building and Starting in background...
docker-compose up -d --build

echo ⏳ 3. Waiting for services to stabilize...
timeout /t 10 /nobreak > nul

echo 🔍 4. Checking health status...
docker ps --format "table {{.Names}}\t{{.Status}}"

echo.
echo 🌐 5. Opening StudyPulse...
start http://localhost:5173

echo.
echo ✅ DONE! The app is running in the background.
echo No more noisy logs in this terminal.
echo.
echo TIP: If you need to see logs, run: docker-compose logs -f backend
echo.
pause
