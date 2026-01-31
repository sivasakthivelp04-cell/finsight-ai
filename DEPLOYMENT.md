# 🚀 FinSight AI - Deployment Guide

## 📋 Deployment Summary

This document outlines the complete deployment process for the FinSight AI full-stack application using **FREE tier services**.

---

## 🏗️ Architecture Overview

### **Stack Components**

| Component | Technology | Hosting Platform | Tier |
|-----------|-----------|------------------|------|
| **Frontend** | React (Vite) | Vercel | Free |
| **Backend** | FastAPI (Python 3.10+) | Render | Free |
| **Database** | PostgreSQL | Render PostgreSQL | Free |
| **Email** | SMTP | Gmail/SendGrid | Free |

---

## 🎯 What Has Been Done

### ✅ 1. Deployment Configuration Files Created

#### **Backend (Render)**
- **File**: `backend/render.yaml`
- **Purpose**: Automated deployment configuration for Render
- **Features**:
  - PostgreSQL database provisioning
  - Environment variable management
  - Auto-deployment from Git
  - CORS configuration
  - Email service integration

#### **Frontend (Vercel)**
- **File**: `frontend/vercel.json`
- **Purpose**: Vercel deployment configuration
- **Features**:
  - Build command: `npm install && npm run build`
  - Output directory: `dist`
  - SPA routing support

- **File**: `frontend/.env.production`
- **Purpose**: Production environment variables
- **Contains**: Backend API URL (to be updated after backend deployment)

### ✅ 2. Security Features Already Implemented

- ✅ **Password Hashing**: Using `passlib[bcrypt]` (see `requirements.txt`)
- ✅ **Environment Variables**: All sensitive data in `.env` files
- ✅ **CORS Protection**: Configurable origins
- ✅ **JWT Authentication**: Token-based auth ready
- ✅ **Database Migrations**: SQLAlchemy + Alembic support

### ✅ 3. Email Service Configuration

- ✅ **SMTP Integration**: `app/services/email_service.py`
- ✅ **Fallback Mode**: Simulates emails when SMTP not configured
- ✅ **Environment Variables**:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USERNAME`
  - `SMTP_PASSWORD`
  - `EMAIL_FROM`

---

## 🚀 Deployment Steps

### **Step 1: Prepare Your Code Repository**

1. **Initialize Git** (if not already done):
   ```bash
   cd c:\Users\SIVA\Downloads\Guvi_HCL
   git init
   git add .
   git commit -m "Initial commit - FinSight AI"
   ```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., `finsight-ai`)
   - Push your code:
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/finsight-ai.git
     git branch -M main
     git push -u origin main
     ```

---

### **Step 2: Deploy Backend to Render**

#### **2.1 Create Render Account**
1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Authorize Render to access your repositories

#### **2.2 Deploy Backend Service**

1. **Click "New +" → "Blueprint"**
2. **Connect your GitHub repository**
3. **Render will detect `render.yaml`** and create:
   - PostgreSQL database (`finsight-db`)
   - Web service (`finsight-backend`)

4. **Configure Environment Variables** (in Render Dashboard):
   
   Navigate to: **Your Service → Environment**

   | Variable | Value | Notes |
   |----------|-------|-------|
   | `DATABASE_URL` | *Auto-generated* | From PostgreSQL database |
   | `SECRET_KEY` | *Auto-generated* | For JWT tokens |
   | `ENVIRONMENT` | `production` | Production mode |
   | `BACKEND_CORS_ORIGINS` | `https://your-frontend.vercel.app` | Update after frontend deployment |
   | `OPENAI_API_KEY` | `sk-...` | (Optional) Your OpenAI key |
   | `SMTP_HOST` | `smtp.gmail.com` | Gmail SMTP |
   | `SMTP_PORT` | `587` | TLS port |
   | `SMTP_USERNAME` | `your-email@gmail.com` | Your Gmail |
   | `SMTP_PASSWORD` | `your-app-password` | Gmail App Password* |
   | `EMAIL_FROM` | `noreply@yourdomain.com` | Sender email |

   **\*Gmail App Password**: 
   - Go to https://myaccount.google.com/apppasswords
   - Generate a new app password for "Mail"
   - Use this instead of your regular password

5. **Wait for Deployment** (~5-10 minutes)
6. **Note Your Backend URL**: `https://finsight-backend.onrender.com`

#### **2.3 Verify Backend Deployment**

Visit: `https://finsight-backend.onrender.com/`

Expected response:
```json
{
  "message": "FinSight AI Backend is running",
  "status": "online"
}
```

API Docs: `https://finsight-backend.onrender.com/docs`

---

### **Step 3: Deploy Frontend to Vercel**

#### **3.1 Create Vercel Account**
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

#### **3.2 Deploy Frontend**

1. **Click "Add New..." → "Project"**
2. **Import your GitHub repository**
3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variable**:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://finsight-backend.onrender.com/api/v1`
   - (Use your actual Render backend URL)

5. **Click "Deploy"**

6. **Note Your Frontend URL**: `https://finsight-ai.vercel.app`

---

### **Step 4: Connect Frontend to Backend**

#### **4.1 Update Backend CORS**

Go to Render Dashboard → Your Backend Service → Environment

Update `BACKEND_CORS_ORIGINS`:
```
https://finsight-ai.vercel.app,https://finsight-ai-*.vercel.app
```

This allows your Vercel frontend to communicate with the backend.

#### **4.2 Redeploy Backend**

Render will auto-redeploy when you save environment variables.

---

### **Step 5: Database Setup**

#### **5.1 Database Migrations**

The database tables are **automatically created** on first startup via:
- `app/core/database.py` → `init_db()` function
- Called in `app/main.py` → `@app.on_event("startup")`

#### **5.2 Verify Database**

1. Go to Render Dashboard → Your Database
2. Click "Connect" → Copy the connection string
3. Use a PostgreSQL client (e.g., pgAdmin, DBeaver) to connect
4. Verify tables exist:
   - `companies`
   - `financial_uploads`
   - `reports`

---

### **Step 6: Configure Email Service**

#### **Option A: Gmail SMTP (Free)**

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Add to Render Environment Variables**:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

#### **Option B: SendGrid (Free - 100 emails/day)**

1. Sign up at https://sendgrid.com
2. Create an API key
3. **Add to Render Environment Variables**:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USERNAME=apikey
   SMTP_PASSWORD=your-sendgrid-api-key
   EMAIL_FROM=noreply@yourdomain.com
   ```

---

### **Step 7: Test Email Service**

#### **7.1 Test Endpoint** (if you have one)

Use the API docs at `https://finsight-backend.onrender.com/docs`

Look for password reset or email endpoints and test them.

#### **7.2 Check Logs**

In Render Dashboard → Your Service → Logs

Look for email-related logs to verify sending.

---

## 🔒 Security Checklist

- ✅ **Passwords Hashed**: Using bcrypt via `passlib`
- ✅ **Environment Variables**: No hardcoded credentials
- ✅ **HTTPS Enabled**: Automatic on Render & Vercel
- ✅ **CORS Configured**: Only allowed origins
- ✅ **Database Persistent**: Render PostgreSQL with backups
- ✅ **Secret Key**: Auto-generated by Render

---

## 📊 Database Persistence

### **How Data Persists Across Redeployments**

1. **PostgreSQL Database** is **separate** from the web service
2. **Database is NOT deleted** when you redeploy the backend
3. **Connection via `DATABASE_URL`** environment variable
4. **Render Free Tier**:
   - Database expires after **90 days of inactivity**
   - Automatic backups available
   - Can upgrade to paid tier for longer retention

### **Database Backup** (Recommended)

```bash
# From Render Dashboard → Database → Connect
pg_dump -h your-db-host -U your-user -d finsight_db > backup.sql
```

---

## 🌐 Accessing Your Deployed Application

### **Frontend URL**
```
https://finsight-ai.vercel.app
```

### **Backend URL**
```
https://finsight-backend.onrender.com
```

### **API Documentation**
```
https://finsight-backend.onrender.com/docs
```

---

## 🔄 Redeployment Process

### **Frontend (Vercel)**
- **Auto-deploys** on every `git push` to `main` branch
- Manual redeploy: Vercel Dashboard → Your Project → Redeploy

### **Backend (Render)**
- **Auto-deploys** on every `git push` to `main` branch
- Manual redeploy: Render Dashboard → Your Service → Manual Deploy

### **Database**
- **Never redeployed** - data persists
- Only reset if you manually delete the database

---

## 🐛 Troubleshooting

### **Issue: Backend Not Starting**

**Check Logs**: Render Dashboard → Your Service → Logs

Common issues:
- Missing environment variables
- Database connection failed
- Python dependency errors

**Solution**:
```bash
# Verify requirements.txt has all dependencies
# Check DATABASE_URL is set correctly
# Ensure Python version is 3.10+
```

### **Issue: Frontend Can't Connect to Backend**

**Check**:
1. `VITE_API_BASE_URL` is set in Vercel
2. `BACKEND_CORS_ORIGINS` includes your Vercel URL
3. Backend is running (visit backend URL)

**Solution**:
```bash
# Update Vercel environment variable
# Redeploy frontend
```

### **Issue: Email Not Sending**

**Check**:
1. SMTP credentials are correct
2. Gmail App Password (not regular password)
3. Check backend logs for errors

**Solution**:
```bash
# Test with email simulation mode first (no SMTP_HOST)
# Verify SMTP settings in Render dashboard
```

### **Issue: Database Connection Failed**

**Check**:
1. `DATABASE_URL` is set in Render
2. Database is running (Render Dashboard → Database)

**Solution**:
```bash
# Verify connection string format:
# postgresql://user:password@host:5432/database
```

---

## 📈 Monitoring & Maintenance

### **Render Free Tier Limitations**
- **Backend**: Spins down after 15 minutes of inactivity
- **First request** after spin-down takes ~30 seconds
- **Database**: 90 days retention, then deleted if inactive

### **Keeping Backend Active** (Optional)

Use a service like **UptimeRobot** (free):
1. Sign up at https://uptimerobot.com
2. Add monitor: `https://finsight-backend.onrender.com/`
3. Ping every 5 minutes to keep it active

---

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Frontend loads at Vercel URL
- ✅ Backend responds at Render URL
- ✅ API docs accessible at `/docs`
- ✅ Can upload financial data
- ✅ Dashboard shows analysis
- ✅ Reports are saved and retrievable
- ✅ Settings can be updated
- ✅ Email service sends test emails
- ✅ Data persists after redeployment

---

## 📞 Support & Resources

### **Documentation**
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- FastAPI: https://fastapi.tiangolo.com
- React: https://react.dev

### **Free Tier Limits**
- **Render**: 750 hours/month (enough for 1 service)
- **Vercel**: Unlimited deployments, 100GB bandwidth
- **PostgreSQL**: 1GB storage, 90 days retention

---

## 🔐 Environment Variables Reference

### **Backend (.env)**
```env
DATABASE_URL=postgresql://user:password@host:5432/finsight_db
SECRET_KEY=your-secret-key-here
ENVIRONMENT=production
BACKEND_CORS_ORIGINS=https://your-frontend.vercel.app
OPENAI_API_KEY=sk-your-key-here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

### **Frontend (.env.production)**
```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
```

---

## 📝 Next Steps After Deployment

1. **Test All Features**:
   - Upload sample financial data
   - View dashboard insights
   - Check reports page
   - Update company settings
   - Test email functionality

2. **Custom Domain** (Optional):
   - Vercel: Add custom domain in project settings
   - Render: Add custom domain in service settings

3. **Monitoring**:
   - Set up UptimeRobot for backend
   - Monitor Render logs for errors
   - Check Vercel analytics

4. **Backup Strategy**:
   - Export database weekly
   - Keep backup of `.env` files
   - Document any custom configurations

---

## 🏆 Congratulations!

Your FinSight AI application is now **live and production-ready**! 🎉

**Share your deployment**:
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-api.onrender.com`

---

**Last Updated**: 2026-01-31  
**Version**: 1.0.0  
**Deployment Stack**: Render + Vercel + PostgreSQL
