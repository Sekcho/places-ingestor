# PowerShell script to start the React frontend
Write-Host "Starting Places Ingestor Frontend..." -ForegroundColor Green

# Change to frontend directory
cd frontend

# Check if node_modules exists
if (!(Test-Path ".\node_modules")) {
    Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the development server
Write-Host "Starting Vite development server at http://127.0.0.1:5173" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
npm run dev