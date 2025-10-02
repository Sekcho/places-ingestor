@echo off
echo ========================================
echo  Places Ingestor - Restart Services
echo ========================================
echo.

REM Get current directory
set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

echo [1/3] Checking Railway Backend...
echo.
curl -s https://places-ingestor-v2-production.up.railway.app/ > nul
if %errorlevel% equ 0 (
    echo [OK] Backend is responding
) else (
    echo [WARNING] Backend might be sleeping - waking up...
    curl -s https://places-ingestor-v2-production.up.railway.app/meta/areas/provinces > nul
)
echo.

echo [2/3] Checking Vercel Frontend...
echo.
curl -s https://places-ingestor-v2.vercel.app/ > nul
if %errorlevel% equ 0 (
    echo [OK] Frontend is accessible
) else (
    echo [ERROR] Frontend is not accessible
    echo Please check: https://vercel.com/dashboard
)
echo.

echo [3/3] Connection Test...
echo.
curl -s https://places-ingestor-v2-production.up.railway.app/meta/areas/provinces > nul
if %errorlevel% equ 0 (
    echo [OK] Backend API is working
    echo.
    echo ========================================
    echo  Services Status: READY
    echo ========================================
    echo.
    echo Backend:  https://places-ingestor-v2-production.up.railway.app
    echo Frontend: https://places-ingestor-v2.vercel.app
    echo.
    echo TIP: If backend is slow, it might be waking from sleep (10-30s)
) else (
    echo [ERROR] Backend API is not responding
    echo.
    echo ========================================
    echo  Troubleshooting Steps:
    echo ========================================
    echo 1. Check Railway logs: https://railway.app/project/b15cbd96-6c86-4f63-8a15-72cb73cf7696
    echo 2. Redeploy if needed
    echo 3. Check environment variables
    echo 4. See DEPLOY_RAILWAY.md for details
)
echo.

echo Press any key to exit...
pause > nul
