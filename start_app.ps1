
# FinSight AI Startup Script

Write-Host "Starting FinSight AI..." -ForegroundColor Cyan

# 1. Backend Setup
Write-Host "Setting up Backend..." -ForegroundColor Yellow
cd backend
if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..."
    python -m venv venv
}

# Activate venv - handling different shell types
if (Test-Path "venv\Scripts\Activate.ps1") {
    . .\venv\Scripts\Activate.ps1
} else {
    Write-Host "Warning: Could not active venv automatically. Ensuring packages are installed globally or in user scope if venv fails."
}

Write-Host "Installing/Verifying Backend Dependencies..."
pip install -r requirements.txt

# Start Backend in a new process/tab if possible, or just background it
Write-Host "Starting Backend Server..." -ForegroundColor Green
Start-Process -NoNewWindow -FilePath "uvicorn" -ArgumentList "app.main:app --reload --port 8000"

# 2. Frontend Setup
cd ..\frontend
Write-Host "Setting up Frontend..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing Frontend Dependencies..."
    npm install
}

Write-Host "Starting Frontend Server..." -ForegroundColor Green
# Start frontend and keep the window open
npm run dev
