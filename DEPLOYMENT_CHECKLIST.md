# ✅ Deployment Checklist

Use this checklist to track your deployment progress.

---

## Pre-Deployment

- [ ] Code is working locally (backend + frontend)
- [ ] All tests pass
- [ ] Environment variables documented
- [ ] .gitignore configured
- [ ] Sensitive data removed from code

---

## GitHub Setup

- [ ] GitHub account created
- [ ] New repository created
- [ ] Git initialized locally
- [ ] Code committed
- [ ] Code pushed to GitHub

**Commands:**
```bash
git init
git add .
git commit -m "Initial deployment"
git remote add origin https://github.com/YOUR_USERNAME/finsight-ai.git
git branch -M main
git push -u origin main
```

---

## Backend Deployment (Render)

- [ ] Render account created
- [ ] Repository connected to Render
- [ ] Blueprint deployed (from render.yaml)
- [ ] Database provisioned
- [ ] Backend service running
- [ ] Backend URL noted: `_______________________________`

**Environment Variables Set:**
- [ ] `DATABASE_URL` (auto-generated)
- [ ] `SECRET_KEY` (auto-generated)
- [ ] `ENVIRONMENT=production`
- [ ] `BACKEND_CORS_ORIGINS` (update after frontend)
- [ ] `SMTP_HOST` (optional)
- [ ] `SMTP_PORT` (optional)
- [ ] `SMTP_USERNAME` (optional)
- [ ] `SMTP_PASSWORD` (optional)
- [ ] `EMAIL_FROM` (optional)
- [ ] `OPENAI_API_KEY` (optional)

**Verification:**
- [ ] Visit backend URL - shows "FinSight AI Backend is running"
- [ ] Visit `/docs` - shows API documentation
- [ ] Check logs - no errors

---

## Frontend Deployment (Vercel)

- [ ] Vercel account created
- [ ] Repository imported to Vercel
- [ ] Root directory set to `frontend`
- [ ] Framework detected as Vite
- [ ] Environment variable added
- [ ] Deployment successful
- [ ] Frontend URL noted: `_______________________________`

**Environment Variables Set:**
- [ ] `VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1`

**Verification:**
- [ ] Visit frontend URL - app loads
- [ ] No console errors
- [ ] Can navigate between pages

---

## Connect Frontend to Backend

- [ ] Update `BACKEND_CORS_ORIGINS` in Render
  - Value: `https://your-app.vercel.app,https://your-app-*.vercel.app`
- [ ] Backend redeployed (automatic)
- [ ] Frontend can communicate with backend

**Verification:**
- [ ] Upload test data - works
- [ ] Dashboard loads - shows data
- [ ] Reports page - shows reports
- [ ] Settings page - can update

---

## Email Configuration (Optional)

**Gmail Setup:**
- [ ] 2FA enabled on Gmail
- [ ] App password generated
- [ ] SMTP variables added to Render
- [ ] Backend redeployed

**SendGrid Setup (Alternative):**
- [ ] SendGrid account created
- [ ] API key generated
- [ ] SMTP variables added to Render
- [ ] Backend redeployed

**Verification:**
- [ ] Test email sent successfully
- [ ] Check backend logs for confirmation

---

## Database Verification

- [ ] Database is running
- [ ] Tables created automatically
- [ ] Can insert data (via upload)
- [ ] Can retrieve data (via dashboard)
- [ ] Data persists after backend redeploy

**Tables to Verify:**
- [ ] `companies`
- [ ] `financial_uploads`
- [ ] `reports`

---

## Security Checklist

- [ ] No `.env` files committed to Git
- [ ] All secrets in environment variables
- [ ] HTTPS enabled (automatic)
- [ ] CORS configured correctly
- [ ] Passwords hashed (bcrypt)
- [ ] Database connection secure
- [ ] Email credentials not hardcoded

---

## Testing

**Functional Tests:**
- [ ] Login works
- [ ] Upload CSV/Excel file
- [ ] Dashboard shows analysis
- [ ] Financial health score displayed
- [ ] Risks and recommendations shown
- [ ] Reports page lists all reports
- [ ] Can view individual report
- [ ] Settings page loads
- [ ] Can update company settings
- [ ] Settings persist after refresh

**Performance Tests:**
- [ ] Frontend loads in < 3 seconds
- [ ] Backend responds in < 2 seconds (after spin-up)
- [ ] File upload completes successfully
- [ ] No console errors

**Email Tests (if configured):**
- [ ] Password reset email sends
- [ ] Email received in inbox
- [ ] Email content correct

---

## Documentation

- [ ] README.md updated with deployment URLs
- [ ] DEPLOYMENT.md reviewed
- [ ] Environment variables documented
- [ ] API endpoints documented

---

## Monitoring Setup (Optional)

- [ ] UptimeRobot account created
- [ ] Backend URL added to monitor
- [ ] Ping interval: 5 minutes
- [ ] Email alerts configured

---

## Backup Strategy

- [ ] Database backup method documented
- [ ] `.env` files backed up securely
- [ ] Code pushed to GitHub (backup)

---

## Post-Deployment

- [ ] Share frontend URL with stakeholders
- [ ] Monitor logs for first 24 hours
- [ ] Test all features in production
- [ ] Document any issues
- [ ] Create support documentation

---

## Custom Domain (Optional)

**Vercel:**
- [ ] Domain purchased
- [ ] Domain added in Vercel settings
- [ ] DNS configured
- [ ] SSL certificate issued

**Render:**
- [ ] Custom domain added
- [ ] DNS configured
- [ ] SSL certificate issued
- [ ] Update CORS origins

---

## Troubleshooting Completed

If you encountered issues, document solutions:

**Issue 1:**
- Problem: _______________________________
- Solution: _______________________________

**Issue 2:**
- Problem: _______________________________
- Solution: _______________________________

**Issue 3:**
- Problem: _______________________________
- Solution: _______________________________

---

## Final Verification

- [ ] All features work in production
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Data persists correctly
- [ ] Email service works (if configured)

---

## URLs Reference

**Frontend (Vercel):**
```
https://_______________________________
```

**Backend (Render):**
```
https://_______________________________
```

**API Docs:**
```
https://_______________________________/docs
```

**Database (Render):**
```
Connection string in Render dashboard
```

---

## Next Steps

- [ ] Monitor application for 1 week
- [ ] Gather user feedback
- [ ] Plan feature updates
- [ ] Consider upgrading to paid tier (if needed)
- [ ] Set up analytics (optional)
- [ ] Create user documentation

---

## Success! 🎉

- [ ] **Deployment Complete**
- [ ] **All Tests Passed**
- [ ] **Application Live**

**Deployed By:** _______________________________  
**Date:** _______________________________  
**Version:** 1.0.0

---

**Notes:**

_______________________________
_______________________________
_______________________________
_______________________________
