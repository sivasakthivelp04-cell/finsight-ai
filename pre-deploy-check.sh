#!/bin/bash

# FinSight AI - Pre-Deployment Checklist Script

echo "🚀 FinSight AI - Pre-Deployment Checklist"
echo "=========================================="
echo ""

# Check if git is initialized
if [ -d .git ]; then
    echo "✅ Git repository initialized"
else
    echo "❌ Git not initialized. Run: git init"
fi

# Check if backend files exist
if [ -f "backend/requirements.txt" ]; then
    echo "✅ Backend requirements.txt found"
else
    echo "❌ Backend requirements.txt missing"
fi

if [ -f "backend/render.yaml" ]; then
    echo "✅ Render deployment config found"
else
    echo "❌ Render deployment config missing"
fi

# Check if frontend files exist
if [ -f "frontend/package.json" ]; then
    echo "✅ Frontend package.json found"
else
    echo "❌ Frontend package.json missing"
fi

if [ -f "frontend/vercel.json" ]; then
    echo "✅ Vercel deployment config found"
else
    echo "❌ Vercel deployment config missing"
fi

# Check for .env files
if [ -f "backend/.env" ]; then
    echo "✅ Backend .env found"
else
    echo "⚠️  Backend .env not found (will use environment variables)"
fi

if [ -f "frontend/.env.production" ]; then
    echo "✅ Frontend .env.production found"
else
    echo "❌ Frontend .env.production missing"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Push code to GitHub"
echo "2. Deploy backend to Render"
echo "3. Deploy frontend to Vercel"
echo "4. Update environment variables"
echo ""
echo "See DEPLOYMENT.md for detailed instructions"
