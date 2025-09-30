# Places Ingestor - Environment Setup Script for PowerShell
# This script sets up the environment for local development

param(
    [string]$GooglePlacesKey = "",
    [string]$GoogleMapsKey = ""
)

Write-Host "🚀 Places Ingestor - Environment Setup" -ForegroundColor Green
Write-Host "=====================================`n" -ForegroundColor Green

# Check if running as Administrator (optional but recommended)
$currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  Note: Not running as Administrator. Some operations might fail." -ForegroundColor Yellow
}

# Set execution policy for current user (if needed)
$currentPolicy = Get-ExecutionPolicy -Scope CurrentUser
if ($currentPolicy -eq "Restricted") {
    Write-Host "🔧 Setting PowerShell execution policy..." -ForegroundColor Cyan
    try {
        Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
        Write-Host "✅ Execution policy updated" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to set execution policy: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "💡 Please run: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
    }
}

# Check if we're in the right directory
$currentDir = Get-Location
if (-not (Test-Path "webui\backend" -PathType Container)) {
    Write-Host "❌ Error: Not in the correct directory!" -ForegroundColor Red
    Write-Host "💡 Please run this script from the places_ingestor_starter root directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "📁 Working directory: $currentDir" -ForegroundColor Cyan

# Check Python installation
Write-Host "`n🐍 Checking Python installation..." -ForegroundColor Cyan
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Python not found! Please install Python 3.8+" -ForegroundColor Red
    Write-Host "💡 Download from: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}

# Check Node.js installation
Write-Host "`n📦 Checking Node.js installation..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version 2>&1
    $npmVersion = npm --version 2>&1
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js/npm not found! Please install Node.js" -ForegroundColor Red
    Write-Host "💡 Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Setup Backend Environment
Write-Host "`n🔧 Setting up Backend environment..." -ForegroundColor Cyan

# Install Python dependencies
Write-Host "📦 Installing Python dependencies..." -ForegroundColor Cyan
Push-Location "webui\backend"
try {
    pip install -r requirements.txt
    Write-Host "✅ Python dependencies installed" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to install Python dependencies: $($_.Exception.Message)" -ForegroundColor Red
    Pop-Location
    exit 1
}

# Create .env file for backend
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating backend .env file..." -ForegroundColor Cyan

    if ($GooglePlacesKey -eq "") {
        $GooglePlacesKey = Read-Host "Enter your Google Places API Key (or press Enter for demo key)"
        if ($GooglePlacesKey -eq "") {
            $GooglePlacesKey = "demo-key-for-testing"
            Write-Host "⚠️  Using demo key. Replace with real API key for full functionality." -ForegroundColor Yellow
        }
    }

    $backendEnv = @"
# Google Places API Configuration
GOOGLE_PLACES_API_KEY=$GooglePlacesKey

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS Configuration (Frontend URLs)
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://places-ingestor-v2.vercel.app

# Authentication
JWT_SECRET_KEY=demo-jwt-secret-key-for-local-development
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Logging
LOG_LEVEL=DEBUG
"@

    $backendEnv | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Backend .env file created" -ForegroundColor Green
} else {
    Write-Host "✅ Backend .env file already exists" -ForegroundColor Green
}

Pop-Location

# Setup Frontend Environment
Write-Host "`n🎨 Setting up Frontend environment..." -ForegroundColor Cyan

Push-Location "webui\frontend"

# Install Node.js dependencies
Write-Host "📦 Installing Node.js dependencies..." -ForegroundColor Cyan
try {
    npm install
    Write-Host "✅ Node.js dependencies installed" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to install Node.js dependencies: $($_.Exception.Message)" -ForegroundColor Red
    Pop-Location
    exit 1
}

# Create .env.local file for frontend
if (-not (Test-Path ".env.local")) {
    Write-Host "📝 Creating frontend .env.local file..." -ForegroundColor Cyan

    if ($GoogleMapsKey -eq "") {
        $GoogleMapsKey = Read-Host "Enter your Google Maps API Key (or press Enter for demo key)"
        if ($GoogleMapsKey -eq "") {
            $GoogleMapsKey = "demo-key-for-testing"
            Write-Host "⚠️  Using demo key. Maps functionality may not work properly." -ForegroundColor Yellow
        }
    }

    $frontendEnv = @"
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Google Maps API Key (required for map functionality)
VITE_GOOGLE_MAPS_API_KEY=$GoogleMapsKey

# Other environment variables
VITE_APP_NAME="Places Ingestor"
VITE_APP_VERSION="1.0.0"
"@

    $frontendEnv | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ Frontend .env.local file created" -ForegroundColor Green
} else {
    Write-Host "✅ Frontend .env.local file already exists" -ForegroundColor Green
}

Pop-Location

# Final checks
Write-Host "`n🔍 Verifying setup..." -ForegroundColor Cyan
$backendEnvExists = Test-Path "webui\backend\.env"
$frontendEnvExists = Test-Path "webui\frontend\.env.local"
$adminAreasExist = Test-Path "webui\backend\admin_areas\provinces.json"
$termsExist = Test-Path "webui\backend\terms.yaml"

Write-Host "Backend .env: $(if ($backendEnvExists) { '✅' } else { '❌' })" -ForegroundColor $(if ($backendEnvExists) { 'Green' } else { 'Red' })
Write-Host "Frontend .env.local: $(if ($frontendEnvExists) { '✅' } else { '❌' })" -ForegroundColor $(if ($frontendEnvExists) { 'Green' } else { 'Red' })
Write-Host "Admin areas data: $(if ($adminAreasExist) { '✅' } else { '❌' })" -ForegroundColor $(if ($adminAreasExist) { 'Green' } else { 'Red' })
Write-Host "Terms configuration: $(if ($termsExist) { '✅' } else { '❌' })" -ForegroundColor $(if ($termsExist) { 'Green' } else { 'Red' })

if ($backendEnvExists -and $frontendEnvExists -and $adminAreasExist -and $termsExist) {
    Write-Host "`n🎉 Setup completed successfully!" -ForegroundColor Green
    Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Run backend:  .\scripts\run-backend.ps1" -ForegroundColor White
    Write-Host "2. Run frontend: .\scripts\run-frontend.ps1" -ForegroundColor White
    Write-Host "3. Open: http://localhost:5173" -ForegroundColor White
} else {
    Write-Host "`n❌ Setup incomplete. Please check the errors above." -ForegroundColor Red
    exit 1
}

Write-Host "`n💡 Tip: You can pass API keys as parameters:" -ForegroundColor Yellow
Write-Host "   .\scripts\setup-env.ps1 -GooglePlacesKey 'YOUR_KEY' -GoogleMapsKey 'YOUR_KEY'" -ForegroundColor White