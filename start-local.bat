@echo off
echo ========================================
echo  Places Ingestor - Local Development
echo ========================================
echo.

REM Get current directory
set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

echo Starting Backend and Frontend locally...
echo.

REM Check if Python is installed
python --version > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.9+ from https://www.python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [1/4] Checking Backend dependencies...
cd webui\backend
if not exist .env (
    echo [WARNING] .env file not found in backend
    echo Please create webui\backend\.env with your API keys
    echo See .env file for template
    pause
    exit /b 1
)

echo [2/4] Checking Frontend dependencies...
cd ..\frontend
if not exist node_modules (
    echo [INFO] Installing frontend dependencies...
    call npm install
)

if not exist .env.local (
    echo [WARNING] .env.local not found in frontend
    echo Creating default .env.local...
    (
        echo VITE_API_BASE_URL=http://localhost:8000
        echo VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
        echo VITE_APP_NAME=Places Ingestor
        echo VITE_APP_VERSION=1.0.0
    ) > .env.local
    echo.
    echo [ACTION REQUIRED] Please update .env.local with your Google Maps API Key
    notepad .env.local
)

echo.
echo [3/4] Starting Backend Server...
cd ..\backend
start "Backend Server" cmd /k "python start.py"
timeout /t 3 > nul

echo [4/4] Starting Frontend Dev Server...
cd ..\frontend
start "Frontend Dev Server" cmd /k "npm run dev"
timeout /t 3 > nul

echo.
echo ========================================
echo  Services Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C in each window to stop servers
echo.
echo Opening frontend in browser...
timeout /t 3 > nul
start http://localhost:5173

echo.
echo Press any key to exit this window...
pause > nul
