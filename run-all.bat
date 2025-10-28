@echo off
echo Starting Laundry Management System...
echo.

echo Installing dependencies for all applications...
echo.

echo [1/3] Installing Admin Panel dependencies...
cd "admin panel"
call npm install
if %errorlevel% neq 0 (
    echo Failed to install admin panel dependencies
    pause
    exit /b 1
)
cd ..

echo [2/3] Installing Customer App dependencies...
cd customer
call npm install
if %errorlevel% neq 0 (
    echo Failed to install customer app dependencies
    pause
    exit /b 1
)
cd ..

echo [3/3] Installing Partner App dependencies...
cd partner
call npm install
if %errorlevel% neq 0 (
    echo Failed to install partner app dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo All dependencies installed successfully!
echo.
echo Starting all applications...
echo - Admin Panel: http://localhost:3000
echo - Customer App: http://localhost:3001  
echo - Partner App: http://localhost:3002
echo.

start "Admin Panel" cmd /k "cd \"admin panel\" && npm run dev"
timeout /t 3 /nobreak >nul
start "Customer App" cmd /k "cd customer && npm run dev"
timeout /t 3 /nobreak >nul
start "Partner App" cmd /k "cd partner && npm run dev"

echo All applications are starting...
echo Check the opened terminal windows for status.
pause