# 🚂 Railway Backend Deployment Guide

## ✅ Pre-requisites
- [ ] Railway account (https://railway.app)
- [ ] GitHub repository ที่มี code นี้
- [ ] Google Places API Key

---

## 📋 Step-by-Step Deployment

### Step 1: เข้า Railway Dashboard
1. ไปที่ https://railway.app
2. Login ด้วย GitHub account
3. คลิก **"New Project"**

### Step 2: Connect GitHub Repository
1. เลือก **"Deploy from GitHub repo"**
2. เลือก repository: `places_ingestor_starter` (หรือชื่อ repo ของคุณ)
3. คลิก **"Deploy Now"**

### Step 3: Configure Service Settings
1. หลัง deploy เสร็จ คลิกที่ service ที่สร้างขึ้น
2. ไปที่ **Settings** tab
3. ตั้งค่าดังนี้:

#### **Root Directory:**
```
webui/backend
```

#### **Build Command:** (ปล่อยว่างไว้ - ใช้ Dockerfile)
```
(leave empty)
```

#### **Start Command:** (ปล่อยว่างไว้ - ใช้ CMD ใน Dockerfile)
```
(leave empty)
```

### Step 4: Add Environment Variables
1. ไปที่ **Variables** tab
2. เพิ่มตัวแปรเหล่านี้:

```env
GOOGLE_PLACES_API_KEY=AIzaSyBHWBTHSswujpKnAKn-yho0fiVVxCR-nCo
PLACES_API_KEY=AIzaSyBHWBTHSswujpKnAKn-yho0fiVVxCR-nCo
DEFAULT_REGION=TH
DEFAULT_LANGUAGE=th
```

**⚠️ หมายเหตุ:** ใช้ API Key ของคุณเอง (ตัวอย่างข้างบนคือ demo key)

### Step 5: Generate Domain
1. ไปที่ **Settings** → **Networking**
2. คลิก **"Generate Domain"**
3. คุณจะได้ URL แบบนี้:
   ```
   https://places-ingestor-v2-production.up.railway.app
   ```
4. **บันทึก URL นี้ไว้** - จะต้องใช้ตอน config frontend

### Step 6: ตรวจสอบ Deployment
1. ไปที่ **Deployments** tab
2. รอจน status เป็น **"Success"** (ประมาณ 2-5 นาที)
3. คลิก **"View Logs"** เพื่อดู deployment logs

### Step 7: Test Backend API
เปิด browser หรือใช้ curl ทดสอบ:

```bash
# Test health check
curl https://YOUR-RAILWAY-URL.railway.app/

# Test provinces endpoint
curl https://YOUR-RAILWAY-URL.railway.app/meta/areas/provinces

# ควรได้ JSON array ของ 77 จังหวัด
```

---

## 🔍 Troubleshooting

### ❌ "Application not found" (404)
**สาเหตุ:** Root directory ตั้งผิด

**แก้ไข:**
1. ไปที่ Settings → General
2. ตั้ง Root Directory: `webui/backend`
3. Redeploy

### ❌ "Total tambons loaded: 0"
**สาเหตุ:** Admin areas data ไม่ถูก copy เข้า container

**แก้ไข:**
1. ตรวจสอบว่ามีโฟลเดอร์ `webui/backend/admin_areas/`
2. ตรวจสอบว่ามีไฟล์:
   - provinces.json
   - amphoes.json
   - tambons.json
3. Redeploy

### ❌ "Terms file not found"
**สาเหตุ:** terms.yaml ไม่อยู่ใน backend directory

**แก้ไข:**
1. ตรวจสอบว่ามีไฟล์ `webui/backend/terms.yaml`
2. ถ้าไม่มี copy จาก `config/terms.yaml`
3. Redeploy

### ❌ Deployment Failed
**สาเหตุ:** Python dependencies ติดตั้งไม่สำเร็จ

**แก้ไข:**
1. ดู logs ใน Deployments tab
2. ตรวจสอบ `requirements.txt`
3. แก้ไข dependencies version conflicts
4. Push to GitHub (จะ auto-redeploy)

---

## 📊 Railway Free Plan Limits

| Feature | Limit |
|---------|-------|
| Execution Time | 500 hours/month |
| Sleep After | 5 minutes of inactivity |
| Memory | 512 MB |
| CPU | Shared |
| Build Time | 10 minutes max |

**💡 Tips:**
- Backend จะ sleep หลังไม่มี traffic 5 นาที
- Cold start ใช้เวลา 10-30 วินาที
- ถ้าใช้เกิน 500 ชม./เดือน ต้องอัพเกรด plan

---

## 🔄 Auto-Deploy Setup

Railway จะ auto-deploy ทุกครั้งที่ push to GitHub:

1. ไปที่ **Settings** → **Service**
2. เปิด **"Automatic Deployments"**
3. เลือก branch: `main` (หรือ branch ที่ต้องการ)

**ตอนนี้ทุกครั้งที่:**
```bash
git add .
git commit -m "Update backend"
git push
```
**Railway จะ deploy ใหม่อัตโนมัติ!**

---

## 📝 Next Steps

หลัง deploy backend เสร็จ:

1. ✅ บันทึก Railway URL ไว้
2. ✅ ไปตั้งค่า Frontend บน Vercel (ดู `DEPLOY_VERCEL.md`)
3. ✅ อัพเดท `VITE_API_BASE_URL` ใน Vercel environment variables

---

## 🆘 Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Project Issues: https://github.com/your-repo/issues

---

**✨ Created by Claude Code** - Happy Deploying! 🚀
