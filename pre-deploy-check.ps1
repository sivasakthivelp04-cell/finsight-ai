# FinSight AI - Pre-Deployment Checklist Script (PowerShell)

Write-Host "FinSight AI - Pre-Deployment Checklist" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (Test-Path .git) {
    Write-Host "[OK] Git repository initialized" -ForegroundColor Green
}
else {
    Write-Host "[FAIL] Git not initialized. Run: git init" -ForegroundColor Red
}

# Check if backend files exist
if (Test-Path "backend/requirements.txt") {
    Write-Host "[OK] Backend requirements.txt found" -ForegroundColor Green
}
else {
    Write-Host "[FAIL] Backend requirements.txt missing" -ForegroundColor Red
}

if (Test-Path "backend/render.yaml") {
    Write-Host "[OK] Render deployment config found" -ForegroundColor Green
}
else {
    Write-Host "[FAIL] Render deployment config missing" -ForegroundColor Red
}

# Check if frontend files exist
if (Test-Path "frontend/package.json") {
    Write-Host "[OK] Frontend package.json found" -ForegroundColor Green
}
else {
    Write-Host "[FAIL] Frontend package.json missing" -ForegroundColor Red
}

if (Test-Path "frontend/vercel.json") {
    Write-Host "[OK] Vercel deployment config found" -ForegroundColor Green
}
else {
    Write-Host "[FAIL] Vercel deployment config missing" -ForegroundColor Red
}

# Check for .env files
if (Test-Path "backend/.env") {
    Write-Host "[OK] Backend .env found" -ForegroundColor Green
}
else {
    Write-Host "[WARN] Backend .env not found (will use environment variables)" -ForegroundColor Yellow
}

if (Test-Path "frontend/.env.production") {
    Write-Host "[OK] Frontend .env.production found" -ForegroundColor Green
}
else {
    Write-Host "[FAIL] Frontend .env.production missing" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Push code to GitHub"
Write-Host "2. Deploy backend to Render"
Write-Host "3. Deploy frontend to Vercel"
Write-Host "4. Update environment variables"
Write-Host ""
Write-Host "See DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan
