# 🚀 Quick Deployment Guide

## Prerequisites
- GitHub account
- Render account (sign up at https://render.com)
- Vercel account (sign up at https://vercel.com)

## 5-Minute Deployment

### 1️⃣ Push to GitHub (2 minutes)

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial deployment"

# Create GitHub repo and push
# (Follow GitHub instructions to create repo)
git remote add origin https://github.com/YOUR_USERNAME/finsight-ai.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy Backend to Render (2 minutes)

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml`
5. Click **"Apply"**
6. Wait ~5 minutes for deployment
7. **Copy your backend URL**: `https://finsight-backend-XXXX.onrender.com`

### 3️⃣ Deploy Frontend to Vercel (1 minute)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
4. Add Environment Variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend.onrender.com/api/v1` (from step 2)
5. Click **"Deploy"**
6. **Copy your frontend URL**: `https://finsight-ai.vercel.app`

### 4️⃣ Update CORS (30 seconds)

1. Go to Render Dashboard → Your Backend Service
2. Click **"Environment"**
3. Update `BACKEND_CORS_ORIGINS`:
   ```
   https://finsight-ai.vercel.app,https://finsight-ai-*.vercel.app
   ```
4. Save (auto-redeploys)

### 5️⃣ Configure Email (Optional - 2 minutes)

In Render Dashboard → Environment, add:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com
```

**Get Gmail App Password**: https://myaccount.google.com/apppasswords

---

## ✅ Done!

Visit your app at: `https://finsight-ai.vercel.app`

For detailed instructions, see **DEPLOYMENT.md**

---

## 🆘 Troubleshooting

**Backend not starting?**
- Check Render logs: Dashboard → Service → Logs

**Frontend can't connect?**
- Verify `VITE_API_BASE_URL` in Vercel
- Check CORS settings in Render

**Email not working?**
- Use Gmail App Password (not regular password)
- Check SMTP settings in Render logs

---

## 📚 Resources

- Full Deployment Guide: `DEPLOYMENT.md`
- Backend Config: `backend/render.yaml`
- Frontend Config: `frontend/vercel.json`
- Environment Templates: `.env.template` files
