# Places Ingestor - Frontend Development Server Script for PowerShell
# This script starts the Vite development server for the React frontend

param(
    [switch]$StopExisting = $false,
    [switch]$Build = $false,
    [switch]$Preview = $false,
    [int]$Port = 5173,
    [switch]$NetworkHost = $false
)

Write-Host "🎨 Places Ingestor - Frontend Server" -ForegroundColor Blue
Write-Host "==================================`n" -ForegroundColor Blue

# Check if we're in the right directory
if (-not (Test-Path "webui\frontend\package.json")) {
    Write-Host "❌ Error: Frontend files not found!" -ForegroundColor Red
    Write-Host "💡 Please run this script from the places_ingestor_starter root directory" -ForegroundColor Yellow
    exit 1
}

# Stop existing Node processes if requested
if ($StopExisting) {
    Write-Host "🛑 Stopping existing Node.js processes..." -ForegroundColor Yellow
    $nodeProcesses = Get-Process -Name "node*" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        $nodeProcesses | Where-Object { $_.MainWindowTitle -match "vite|Places Ingestor" } | Stop-Process -Force
        Write-Host "✅ Stopped existing processes" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  No existing Node.js processes found" -ForegroundColor Cyan
    }
    Start-Sleep -Seconds 2
}

# Check if port is already in use (unless it's build mode)
if (-not $Build) {
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
}

# Check environment setup
Write-Host "🔍 Checking environment setup..." -ForegroundColor Cyan

Push-Location "webui\frontend"

# Check if .env.local file exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Frontend .env.local file not found!" -ForegroundColor Red
    Write-Host "💡 Run setup first: .\scripts\setup-env.ps1" -ForegroundColor Yellow
    Pop-Location
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "❌ Node modules not found!" -ForegroundColor Red
    Write-Host "💡 Run: npm install" -ForegroundColor Yellow
    Pop-Location
    exit 1
}

Write-Host "✅ Environment setup verified" -ForegroundColor Green

# Check Node.js and npm
Write-Host "`n📦 Checking Node.js setup..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version 2>&1
    $npmVersion = npm --version 2>&1
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js/npm not found!" -ForegroundColor Red
    Pop-Location
    exit 1
}

# Load and display environment configuration
Write-Host "`n📋 Frontend Configuration:" -ForegroundColor Cyan
$envContent = Get-Content ".env.local" -Raw

$apiUrlMatch = $envContent | Select-String "VITE_API_BASE_URL=(.+)"
if ($apiUrlMatch) {
    $apiUrl = $apiUrlMatch.Matches[0].Groups[1].Value
    Write-Host "API Base URL: $apiUrl" -ForegroundColor White
}

$mapsKeyMatch = $envContent | Select-String "VITE_GOOGLE_MAPS_API_KEY=(.+)"
if ($mapsKeyMatch) {
    $mapsKey = $mapsKeyMatch.Matches[0].Groups[1].Value
    if ($mapsKey -eq "demo-key-for-testing" -or $mapsKey -eq "") {
        Write-Host "Maps API Key: ⚠️  Demo/Missing (Maps functionality limited)" -ForegroundColor Yellow
    } else {
        Write-Host "Maps API Key: ✅ Configured" -ForegroundColor Green
    }
}

# Determine which command to run
if ($Build) {
    Write-Host "`n🏗️  Building production version..." -ForegroundColor Green
    $command = "npm run build"
    Write-Host "Command: $command" -ForegroundColor Cyan
}
elseif ($Preview) {
    Write-Host "`n👀 Starting preview server..." -ForegroundColor Green
    $command = "npm run preview"
    Write-Host "Command: $command" -ForegroundColor Cyan
}
else {
    Write-Host "`n🚀 Starting development server..." -ForegroundColor Green

    # Build command with options
    $viteArgs = @()
    if ($Port -ne 5173) {
        $viteArgs += "--port $Port"
    }
    if ($NetworkHost) {
        $viteArgs += "--host"
    }

    $command = "npm run dev"
    if ($viteArgs.Count -gt 0) {
        $command += " -- " + ($viteArgs -join " ")
    }

    Write-Host "Command: $command" -ForegroundColor Cyan
    Write-Host "Port: $Port" -ForegroundColor White
    Write-Host "Host: $(if ($NetworkHost) { '0.0.0.0 (network accessible)' } else { 'localhost (local only)' })" -ForegroundColor White
    Write-Host "URL: http://localhost:$Port" -ForegroundColor White

    if (-not $Build -and -not $Preview) {
        Write-Host "`n💡 Press Ctrl+C to stop the server" -ForegroundColor Yellow
        Write-Host "⏳ Server startup may take a few seconds..." -ForegroundColor Cyan
    }
}

# Check if backend is running (for dev mode)
if (-not $Build -and -not $Preview) {
    Write-Host "`n🔍 Checking backend connection..." -ForegroundColor Cyan
    try {
        $backendResponse = Invoke-WebRequest -Uri "http://localhost:8000/meta/areas/provinces" -TimeoutSec 3 -ErrorAction Stop
        if ($backendResponse.StatusCode -eq 200) {
            Write-Host "✅ Backend is running and accessible" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "⚠️  Backend not accessible at http://localhost:8000" -ForegroundColor Yellow
        Write-Host "💡 Start backend first: .\scripts\run-backend.ps1" -ForegroundColor Yellow
        Write-Host "🔄 Frontend will still start, but API calls will fail" -ForegroundColor Cyan
    }
}

# Execute the command
try {
    Write-Host "`n▶️  Executing: $command" -ForegroundColor Green

    # Set environment for better output
    $env:FORCE_COLOR = "1"
    $env:CI = "false"

    # Execute the npm command
    Invoke-Expression $command
}
catch {
    Write-Host "`n❌ Command failed: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    Pop-Location
    if (-not $Build) {
        Write-Host "`n🛑 Frontend server stopped" -ForegroundColor Yellow
    }
}

if ($Build) {
    # Check if build was successful
    if (Test-Path "dist") {
        Write-Host "`n✅ Build completed successfully!" -ForegroundColor Green
        Write-Host "📁 Output directory: webui\frontend\dist" -ForegroundColor Cyan
        Write-Host "💡 To preview: .\scripts\run-frontend.ps1 -Preview" -ForegroundColor Yellow
    } else {
        Write-Host "`n❌ Build failed - no dist directory created" -ForegroundColor Red
    }
}

Write-Host "`n💡 Troubleshooting tips:" -ForegroundColor Cyan
Write-Host "• Check if Node.js and npm are properly installed" -ForegroundColor White
Write-Host "• Verify dependencies: npm list" -ForegroundColor White
Write-Host "• Clear cache: npm cache clean --force" -ForegroundColor White
Write-Host "• Reinstall: Remove node_modules and run npm install" -ForegroundColor White
Write-Host "• Check backend is running for full functionality" -ForegroundColor White