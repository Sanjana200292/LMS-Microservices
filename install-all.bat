@echo off
REM install-all.bat – Install dependencies for all services

echo =======================================
echo 📦 Installing dependencies...
echo =======================================

cd api-gateway
call npm install
cd ..

cd auth-service
call npm install
cd ..

cd course-service
call npm install
cd ..

cd enrollment-service
call npm install
cd ..

cd payment-service
call npm install
cd ..

echo.
echo =======================================
echo ✅ All dependencies installed!
echo =======================================
pause