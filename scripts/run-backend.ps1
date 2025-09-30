# Places Ingestor - Backend Server Script for PowerShell
# This script starts the FastAPI backend server

param(
    [switch]$StopExisting = $false,
    [switch]$Verbose = $false,
    [int]$Port = 8000
)

Write-Host "🚀 Places Ingestor - Backend Server" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "webui\backend\main.py")) {
    Write-Host "❌ Error: Backend files not found!" -ForegroundColor Red
    Write-Host "💡 Please run this script from the places_ingestor_starter root directory" -ForegroundColor Yellow
    exit 1
}

# Stop existing Python processes if requested
if ($StopExisting) {
    Write-Host "🛑 Stopping existing Python processes..." -ForegroundColor Yellow
    $pythonProcesses = Get-Process -Name "python*" -ErrorAction SilentlyContinue
    if ($pythonProcesses) {
        $pythonProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Stopped existing processes" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  No existing Python processes found" -ForegroundColor Cyan
    }
    Start-Sleep -Seconds 2
}

# Check if port is already in use
$portInUse = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️  Port $Port is already in use!" -ForegroundColor Yellow
    $process = Get-Process -Id $portInUse.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Process using port: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Yellow
        $stopProcess = Read-Host "Do you want to stop it? (y/N)"
        if ($stopProcess -eq "y" -or $stopProcess -eq "Y") {
            Stop-Process -Id $process.Id -Force
            Write-Host "✅ Process stopped" -ForegroundColor Green
            Start-Sleep -Seconds 2
        } else {
            Write-Host "❌ Cannot start server while port is occupied" -ForegroundColor Red
            exit 1
        }
    }
}

# Check environment setup
Write-Host "🔍 Checking environment setup..." -ForegroundColor Cyan

# Check if .env file exists
if (-not (Test-Path "webui\backend\.env")) {
    Write-Host "❌ Backend .env file not found!" -ForegroundColor Red
    Write-Host "💡 Run setup first: .\scripts\setup-env.ps1" -ForegroundColor Yellow
    exit 1
}

# Check if admin areas data exists
$adminAreasExist = Test-Path "webui\backend\admin_areas\provinces.json"
if (-not $adminAreasExist) {
    Write-Host "❌ Admin areas data not found!" -ForegroundColor Red
    Write-Host "💡 Ensure admin_areas directory contains provinces.json, amphoes.json, tambons.json" -ForegroundColor Yellow
    exit 1
}

# Check if terms.yaml exists
$termsExist = Test-Path "webui\backend\terms.yaml"
if (-not $termsExist) {
    Write-Host "❌ Terms configuration not found!" -ForegroundColor Red
    Write-Host "💡 Ensure terms.yaml exists in webui\backend\" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Environment setup verified" -ForegroundColor Green

# Check Python dependencies
Write-Host ""
Write-Host "📦 Checking Python dependencies..." -ForegroundColor Cyan
Push-Location "webui\backend"

try {
    $fastApiCheck = python -c "import fastapi; print(fastapi.__version__)" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ FastAPI found: $fastApiCheck" -ForegroundColor Green
    } else {
        throw "FastAPI not found"
    }

    $uvicornCheck = python -c "import uvicorn; print(uvicorn.__version__)" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Uvicorn found: $uvicornCheck" -ForegroundColor Green
    } else {
        throw "Uvicorn not found"
    }
}
catch {
    Write-Host "❌ Missing dependencies!" -ForegroundColor Red
    Write-Host "💡 Run: pip install -r requirements.txt" -ForegroundColor Yellow
    Pop-Location
    exit 1
}

# Display configuration
Write-Host ""
Write-Host "📋 Server Configuration:" -ForegroundColor Cyan
Write-Host "Host: 0.0.0.0" -ForegroundColor White
Write-Host "Port: $Port" -ForegroundColor White
Write-Host "Debug: True (Development Mode)" -ForegroundColor White
Write-Host "API Documentation: http://localhost:$Port/docs" -ForegroundColor White

# Load environment variables and display API key status
$envContent = Get-Content ".env" -Raw
$apiKeyMatch = $envContent | Select-String "GOOGLE_PLACES_API_KEY=(.+)"
if ($apiKeyMatch) {
    $apiKey = $apiKeyMatch.Matches[0].Groups[1].Value
    if ($apiKey -eq "demo-key-for-testing" -or $apiKey -eq "") {
        Write-Host "API Key: ⚠️  Demo/Missing (Search functionality limited)" -ForegroundColor Yellow
    } else {
        Write-Host "API Key: ✅ Configured" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🚀 Starting backend server..." -ForegroundColor Green
Write-Host "💡 Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "⏳ Server startup may take a few seconds..." -ForegroundColor Cyan

# Start the server
try {
    if ($Verbose) {
        Write-Host ""
        Write-Host "📝 Verbose mode enabled - showing detailed logs" -ForegroundColor Cyan
        $env:LOG_LEVEL = "DEBUG"
    }

    # Update PORT in environment if different
    if ($Port -ne 8000) {
        $env:PORT = $Port.ToString()
    }

    # Start the server with proper encoding
    $env:PYTHONIOENCODING = "utf-8"
    $env:PYTHONUNBUFFERED = "1"

    python start.py
}
catch {
    Write-Host ""
    Write-Host "❌ Server startup failed: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    Pop-Location
    Write-Host ""
    Write-Host "🛑 Backend server stopped" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 Troubleshooting tips:" -ForegroundColor Cyan
Write-Host "• Check if Python and pip are properly installed" -ForegroundColor White
Write-Host "• Verify all dependencies: pip list | findstr fastapi" -ForegroundColor White
Write-Host "• Check port availability: netstat -an | findstr :$Port" -ForegroundColor White
Write-Host "• Review logs above for specific error messages" -ForegroundColor White