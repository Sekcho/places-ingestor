# PowerShell script to start the FastAPI backend
Write-Host "Starting Places Ingestor Backend..." -ForegroundColor Green

# Check if virtual environment exists, create if not
if (!(Test-Path ".\.venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\.venv\Scripts\Activate.ps1

# Install backend requirements
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r .\backend\requirements.txt

# Check if .env exists
if (!(Test-Path ".\.env")) {
    Write-Host "Warning: .env file not found. Please copy .env and add your PLACES_API_KEY" -ForegroundColor Red
    Write-Host "You can copy from the project root directory" -ForegroundColor Yellow
    exit 1
}

# Start the backend server
Write-Host "Starting FastAPI server at http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
cd backend
python start.py