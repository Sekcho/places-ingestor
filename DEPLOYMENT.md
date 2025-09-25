# 🚀 Places Ingestor - Deployment Guide

## Overview
Deploy Places Ingestor using **Vercel (Frontend)** + **Railway (Backend)** for free hosting.

---

## 📋 Pre-requisites

1. ✅ GitHub account
2. ✅ Google Places API Key ([Get here](https://developers.google.com/places/web-service/get-api-key))
3. ✅ Vercel account ([Sign up](https://vercel.com))
4. ✅ Railway account ([Sign up](https://railway.app))

---

## 🔧 Step 1: Push to GitHub

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: Places Ingestor"

# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/places-ingestor.git
git branch -M main
git push -u origin main
```

---

## 🖥️ Step 2: Deploy Frontend (Vercel)

### 2.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Connect your GitHub account
4. Select `places-ingestor` repository
5. **Root Directory**: `webui/frontend`

### 2.2 Configure Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2.3 Add Environment Variables
In Vercel dashboard → Settings → Environment Variables:

| Name | Value |
|------|-------|
| `VITE_API_BASE_URL` | `https://YOUR-BACKEND-URL.railway.app` |
| `VITE_APP_NAME` | `Places Ingestor` |
| `VITE_APP_VERSION` | `1.0.0` |

### 2.4 Deploy
Click **"Deploy"** - Your frontend will be available at: `https://your-project.vercel.app`

---

## ⚙️ Step 3: Deploy Backend (Railway)

### 3.1 Create New Project
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose `places-ingestor` repository
5. **Root Directory**: `webui/backend`

### 3.2 Add Environment Variables
In Railway dashboard → Variables:

| Name | Value |
|------|-------|
| `GOOGLE_PLACES_API_KEY` | `your-actual-api-key` |
| `HOST` | `0.0.0.0` |
| `PORT` | `8000` |
| `DEBUG` | `False` |
| `FRONTEND_URL` | `https://your-project.vercel.app` |
| `ALLOWED_ORIGINS` | `https://your-project.vercel.app` |
| `JWT_SECRET_KEY` | `your-super-secret-key-here` |

### 3.3 Deploy
Railway will auto-deploy. Your backend will be available at: `https://YOUR-PROJECT.railway.app`

---

## 🔄 Step 4: Connect Frontend to Backend

### 4.1 Update Frontend Environment Variables
Go back to Vercel → Settings → Environment Variables:

Update `VITE_API_BASE_URL` with your actual Railway URL:
```
VITE_API_BASE_URL=https://YOUR-PROJECT.railway.app
```

### 4.2 Update Backend CORS
In Railway → Variables, update:
```
ALLOWED_ORIGINS=https://your-project.vercel.app,http://localhost:3000
```

### 4.3 Redeploy Both Services
- **Vercel**: Will auto-redeploy when you update env vars
- **Railway**: Will auto-redeploy when you push to GitHub

---

## ✅ Step 5: Test Deployment

1. **Visit your Vercel URL**: `https://your-project.vercel.app`
2. **Test Landing Page**: Should load properly
3. **Test Login**: Try logging in with your credentials
4. **Test API Connection**: Check browser console for any errors

---

## 🔧 Troubleshooting

### Common Issues:

**❌ CORS Error**
- Check `ALLOWED_ORIGINS` in Railway includes your Vercel URL
- Make sure there are no trailing slashes

**❌ API Connection Failed**
- Verify `VITE_API_BASE_URL` in Vercel matches your Railway URL
- Check Railway logs for backend errors

**❌ Build Failed**
- Check build logs in Vercel/Railway dashboard
- Verify all dependencies are in package.json/requirements.txt

**❌ Environment Variables Not Working**
- Restart both services after updating env vars
- Check variable names are spelled correctly (case-sensitive)

---

## 📊 Monitoring

### Vercel
- **Analytics**: Built-in traffic analytics
- **Logs**: Real-time function logs
- **Performance**: Core Web Vitals monitoring

### Railway
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Application logs
- **Deployments**: Deployment history

---

## 🔒 Security Best Practices

1. ✅ **API Keys**: Never commit real API keys to Git
2. ✅ **CORS**: Only allow your frontend domain
3. ✅ **HTTPS**: Both services use HTTPS automatically
4. ✅ **Environment Variables**: Use for all sensitive config

---

## 📈 Scaling

### Free Tier Limits:
- **Vercel**: Unlimited bandwidth for personal use
- **Railway**: $5 credit/month (~550 hours)

### If you need more:
- **Vercel Pro**: $20/month for teams
- **Railway Hobby**: $5/month for higher limits

---

## 🎉 Success!

Your Places Ingestor is now live at:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-project.railway.app`

Share your live URL and start generating business leads! 🚀