@echo off
REM run-all.bat – Run all services in separate terminals

echo =======================================
echo 🚀 Starting all services...
echo =======================================

start cmd /k "cd api-gateway && npm start"
start cmd /k "cd auth-service && npm start"
start cmd /k "cd course-service && npm start"
start cmd /k "cd enrollment-service && npm start"
start cmd /k "cd payment-service && npm start"

echo.
echo ✅ All services started in separate windows!
pause