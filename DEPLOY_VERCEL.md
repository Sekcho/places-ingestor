# ▲ Vercel Frontend Deployment Guide

## ✅ Pre-requisites
- [ ] Vercel account (https://vercel.com)
- [ ] GitHub repository ที่มี code นี้
- [ ] Railway Backend URL (จาก deploy backend ก่อนหน้า)
- [ ] Google Maps API Key

---

## 📋 Step-by-Step Deployment

### Step 1: เข้า Vercel Dashboard
1. ไปที่ https://vercel.com
2. Login ด้วย GitHub account
3. คลิก **"Add New Project"**

### Step 2: Import GitHub Repository
1. เลือก **"Import Git Repository"**
2. เลือก repository: `places_ingestor_starter`
3. คลิก **"Import"**

### Step 3: Configure Project Settings
ตั้งค่าดังนี้:

#### **Framework Preset:**
```
Vite
```

#### **Root Directory:**
```
webui/frontend
```

#### **Build Command:**
```
npm run build
```

#### **Output Directory:**
```
dist
```

#### **Install Command:**
```
npm install
```

### Step 4: Add Environment Variables
1. ขยาย **"Environment Variables"** section
2. เพิ่มตัวแปรเหล่านี้:

```env
VITE_API_BASE_URL=https://YOUR-RAILWAY-URL.railway.app
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBHWBTHSswujpKnAKn-yho0fiVVxCR-nCo
VITE_APP_NAME=Places Ingestor
VITE_APP_VERSION=1.0.0
```

**⚠️ สำคัญ:**
- แทนที่ `YOUR-RAILWAY-URL` ด้วย URL จริงของ Railway backend
- ใช้ Google Maps API Key ของคุณเอง

**ตัวอย่าง:**
```env
VITE_API_BASE_URL=https://places-ingestor-v2-production.up.railway.app
```

### Step 5: Deploy
1. คลิก **"Deploy"**
2. รอจน deployment เสร็จ (ประมาณ 1-3 นาที)
3. Vercel จะสร้าง URL ให้อัตโนมัติ:
   ```
   https://places-ingestor-v2.vercel.app
   ```

### Step 6: Test Frontend
1. เปิด Vercel URL ในเบราว์เซอร์
2. ทดสอบฟีเจอร์:
   - [ ] Dropdown จังหวัดโหลดได้ (77 จังหวัด)
   - [ ] เลือกจังหวัด → Dropdown อำเภอ update
   - [ ] เลือกอำเภอ → Dropdown ตำบล update
   - [ ] ค้นหา "ร้านอาหาร" → ได้ผลลัพธ์
   - [ ] แผนที่แสดง markers
   - [ ] Export CSV ได้

---

## 🔍 Troubleshooting

### ❌ "Failed to fetch" / CORS Error
**สาเหตุ:** Backend URL ผิด หรือ backend ไม่ทำงาน

**แก้ไข:**
1. ตรวจสอบ `VITE_API_BASE_URL` ใน Vercel Environment Variables
2. ทดสอบ backend URL ใน browser:
   ```
   https://YOUR-RAILWAY-URL.railway.app/meta/areas/provinces
   ```
3. ถ้า backend ไม่ตอบ ให้ไป wake up หรือ redeploy Railway
4. Redeploy Vercel

### ❌ "API key not valid" / Map ไม่โหลด
**สาเหตุ:** Google Maps API Key ผิดหรือไม่มี permission

**แก้ไข:**
1. ตรวจสอบ `VITE_GOOGLE_MAPS_API_KEY`
2. ไปที่ Google Cloud Console
3. เปิด Maps JavaScript API
4. เพิ่ม Vercel domain ใน API restrictions:
   ```
   *.vercel.app/*
   ```
5. Redeploy Vercel

### ❌ Dropdown ว่างเปล่า
**สาเหตุ:** Backend ไม่ส่งข้อมูล admin areas

**แก้ไข:**
1. เปิด Browser DevTools (F12) → Console
2. ดู error messages
3. ตรวจสอบ Network tab → ดู API calls
4. ถ้า backend error ให้แก้ที่ Railway ก่อน
5. Redeploy Vercel

### ❌ Build Failed
**สาเหตุ:** Dependencies error หรือ syntax error

**แก้ไข:**
1. ดู Build logs ใน Vercel dashboard
2. แก้ไข code ตาม error
3. Push to GitHub (จะ auto-redeploy)

---

## 🔄 Auto-Deploy Setup

Vercel auto-deploy ทุกครั้งที่ push to GitHub (ตั้งค่าอัตโนมัติ)

**ตอนนี้ทุกครั้งที่:**
```bash
git add .
git commit -m "Update frontend"
git push
```
**Vercel จะ deploy ใหม่อัตโนมัติ!**

### Preview Deployments
Vercel สร้าง preview URL สำหรับทุก branch และ PR:
- `main` branch → Production URL
- Feature branches → Preview URLs
- Pull Requests → Preview URLs

---

## 🌐 Custom Domain (Optional)

### เพิ่ม Custom Domain:
1. ไปที่ Vercel Project → **Settings** → **Domains**
2. คลิก **"Add Domain"**
3. ใส่ domain ของคุณ: `yourdomain.com`
4. Follow DNS setup instructions
5. รอ DNS propagate (5-30 นาที)

**ตัวอย่าง:**
```
places-finder.yourdomain.com
```

---

## ⚙️ Environment Variables Management

### เพิ่ม/แก้ไข Environment Variables:
1. Vercel Project → **Settings** → **Environment Variables**
2. เลือก Environment: Production / Preview / Development
3. Add/Edit variables
4. **Redeploy** เพื่อใช้งานค่าใหม่

### Production vs Preview vs Development:
```env
# Production (main branch)
VITE_API_BASE_URL=https://places-ingestor-v2-production.up.railway.app

# Preview (feature branches)
VITE_API_BASE_URL=https://places-ingestor-v2-staging.up.railway.app

# Development (local)
VITE_API_BASE_URL=http://localhost:8000
```

---

## 📊 Vercel Free Plan Limits

| Feature | Limit |
|---------|-------|
| Bandwidth | 100 GB/month |
| Build Time | 6,000 minutes/month |
| Deployments | Unlimited |
| Team Members | 1 |
| Custom Domains | Unlimited |

**💡 Tips:**
- Frontend ไม่ sleep (static hosting)
- แต่ backend (Railway) จะ sleep หลัง 5 นาที
- ใช้ Vercel Analytics (ฟรี) เพื่อดู performance

---

## 🔗 Connect Backend & Frontend

ตรวจสอบว่า 2 services เชื่อมต่อกันถูกต้อง:

### 1. ตรวจสอบ Frontend .env:
```bash
echo $VITE_API_BASE_URL
# ควรได้ Railway URL
```

### 2. ตรวจสอบ Backend CORS:
ใน `webui/backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # หรือเฉพาะ Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Test Connection:
```bash
# From browser console (F12):
fetch('https://YOUR-RAILWAY-URL.railway.app/meta/areas/provinces')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## 📝 Next Steps

หลัง deploy ทั้ง 2 services เสร็จ:

1. ✅ ทดสอบ full flow: เลือกพื้นที่ → ค้นหา → ดู map → export CSV
2. ✅ เพิ่ม Custom Domain (ถ้าต้องการ)
3. ✅ Setup monitoring (Vercel Analytics)
4. ✅ Invite team members (ถ้ามี)

---

## 🆘 Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Community: https://github.com/vercel/vercel/discussions

---

**✨ Created by Claude Code** - Happy Deploying! 🚀
