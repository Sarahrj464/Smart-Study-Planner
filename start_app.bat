@echo off
cls
echo ==========================================
echo    🚀 STARTING STUDYPULSE
echo ==========================================
echo.
echo 🧊 1. Cleaning up old containers...
docker-compose down

echo 📦 2. Building and Starting containers (please wait)...
docker-compose up -d --build

echo ⏳ 2. Waiting for services to be ready...
timeout /t 3 /nobreak > nul

echo 🌐 3. Opening your browser...
start http://localhost:5173

echo.
echo ✅ SUCCESS! Your app is opening at http://localhost:5173
echo.
echo 📝 Showing only important Backend logs (skipping health checks)...
echo Press Ctrl+C to stop viewing logs (this won't stop the app).
echo.
docker-compose logs -f backend
