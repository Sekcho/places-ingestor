# 🚀 Quick Start Guide - Places Ingestor

คู่มือเริ่มต้นใช้งานแบบรวดเร็ว สำหรับ deploy ทั้ง Backend (Railway) และ Frontend (Vercel)

---

## 📋 Checklist ก่อนเริ่ม

- [ ] บัญชี Railway (https://railway.app)
- [ ] บัญชี Vercel (https://vercel.com)
- [ ] GitHub repository ที่มี code นี้
- [ ] Google Places API Key
- [ ] Google Maps JavaScript API Key

---

## 🎯 เป้าหมาย

Deploy Places Ingestor ให้ใช้งานได้ภายใน **15 นาที**

**ผลลัพธ์:**
- ✅ Backend API รันบน Railway (free)
- ✅ Frontend รันบน Vercel (free)
- ✅ เชื่อมต่อกันผ่าน HTTPS
- ✅ พร้อมใช้งานจริง

---

## 🔥 Quick Deploy (5 ขั้นตอน)

### 1️⃣ Deploy Backend บน Railway (5 นาที)

```bash
# 1. Login Railway
https://railway.app → Login with GitHub

# 2. New Project
Click "New Project" → "Deploy from GitHub repo"

# 3. เลือก Repository
places_ingestor_starter → Deploy Now

# 4. Configure Settings
Settings → Root Directory: webui/backend

# 5. Add Environment Variables
Variables → Add:
  GOOGLE_PLACES_API_KEY=YOUR_API_KEY
  PLACES_API_KEY=YOUR_API_KEY
  DEFAULT_REGION=TH
  DEFAULT_LANGUAGE=th

# 6. Generate Domain
Settings → Networking → Generate Domain
# บันทึก URL: https://xxxxx.railway.app
```

**✅ Test Backend:**
```bash
curl https://YOUR-RAILWAY-URL.railway.app/meta/areas/provinces
# ควรได้ JSON array ของ 77 จังหวัด
```

---

### 2️⃣ Deploy Frontend บน Vercel (5 นาที)

```bash
# 1. Login Vercel
https://vercel.com → Login with GitHub

# 2. Import Repository
Add New Project → Import places_ingestor_starter

# 3. Configure Project
Framework Preset: Vite
Root Directory: webui/frontend
Build Command: npm run build
Output Directory: dist

# 4. Add Environment Variables
VITE_API_BASE_URL=https://YOUR-RAILWAY-URL.railway.app
VITE_GOOGLE_MAPS_API_KEY=YOUR_MAPS_API_KEY
VITE_APP_NAME=Places Ingestor

# 5. Deploy
Click "Deploy" → รอ 1-3 นาที
# จะได้ URL: https://your-app.vercel.app
```

**✅ Test Frontend:**
เปิดเบราว์เซอร์ไปที่ Vercel URL:
- [ ] Dropdown จังหวัดแสดง 77 จังหวัด
- [ ] เลือกจังหวัดแล้ว dropdown อำเภอ update
- [ ] ค้นหา "ร้านอาหาร" ได้ผลลัพธ์
- [ ] แผนที่แสดง markers
- [ ] Export CSV ทำงาน

---

### 3️⃣ Verify Connection (2 นาที)

Test ว่า Frontend เชื่อมต่อ Backend ได้:

```bash
# เปิด Browser DevTools (F12) → Console
# Run:
fetch('https://YOUR-RAILWAY-URL.railway.app/meta/areas/provinces')
  .then(r => r.json())
  .then(d => console.log(d))

# ควรเห็น array ของจังหวัด
```

---

### 4️⃣ Setup Auto-Deploy (1 นาที)

**Railway:** (auto-enabled)
```bash
# ทุกครั้งที่ push to main branch จะ deploy อัตโนมัติ
git push → Railway auto-deploys backend
```

**Vercel:** (auto-enabled)
```bash
# ทุกครั้งที่ push to main branch จะ deploy อัตโนมัติ
git push → Vercel auto-deploys frontend
```

---

### 5️⃣ Final Testing (2 นาที)

Full flow test:

1. **เลือกพื้นที่:**
   - จังหวัด: สงขลา
   - อำเภอ: หาดใหญ่
   - ตำบล: หาดใหญ่

2. **ค้นหา:**
   - ประเภท: ร้านอาหาร
   - คลิก "ค้นหา"

3. **ตรวจสอบผลลัพธ์:**
   - [ ] มีผลลัพธ์มากกว่า 20 รายการ
   - [ ] แผนที่แสดง markers ถูกต้อง
   - [ ] คลิก marker แสดงข้อมูลสถานที่
   - [ ] Export CSV ได้

**🎉 ถ้าผ่านทั้งหมด = Deploy สำเร็จ!**

---

## 🐛 Quick Troubleshooting

### ❌ Backend: "Application not found"
```bash
# แก้ไข:
Railway → Settings → Root Directory: webui/backend → Redeploy
```

### ❌ Frontend: "Failed to fetch"
```bash
# แก้ไข:
Vercel → Settings → Environment Variables
ตรวจสอบ VITE_API_BASE_URL ใช้ Railway URL ที่ถูกต้อง
→ Redeploy
```

### ❌ Map ไม่แสดง
```bash
# แก้ไข:
Google Cloud Console → APIs & Services
เปิด Maps JavaScript API
เพิ่ม *.vercel.app/* ใน API restrictions
```

### ❌ Dropdown ว่างเปล่า
```bash
# แก้ไข:
ตรวจสอบ Railway logs:
Railway → Deployments → View Logs
ดูว่า admin_areas data โหลดได้ครบ 77/928/7436 ไหม
```

---

## 📊 URLs & Resources

### Your URLs:
```bash
# Backend (Railway):
https://YOUR-PROJECT.railway.app

# Frontend (Vercel):
https://YOUR-APP.vercel.app

# GitHub Repo:
https://github.com/YOUR-USERNAME/places_ingestor_starter
```

### Dashboards:
- **Railway:** https://railway.app/project/YOUR-PROJECT-ID
- **Vercel:** https://vercel.com/YOUR-USERNAME/YOUR-APP
- **Google Cloud:** https://console.cloud.google.com

---

## 🔄 Development Workflow

### Local Development:
```bash
# 1. Backend
cd webui/backend
python start.py
# → http://localhost:8000

# 2. Frontend
cd webui/frontend
npm run dev
# → http://localhost:5173
```

### Push to Production:
```bash
git add .
git commit -m "Update features"
git push

# Auto-deploy:
# Railway (backend) → ใช้เวลา 2-5 นาที
# Vercel (frontend) → ใช้เวลา 1-3 นาที
```

---

## 💡 Pro Tips

### 1. Monitor Railway Sleep
```bash
# Railway free plan sleeps หลัง 5 นาที
# Wake up ด้วย:
curl https://YOUR-RAILWAY-URL.railway.app/
```

### 2. Check Logs
```bash
# Railway logs:
Railway Dashboard → Deployments → View Logs

# Vercel logs:
Vercel Dashboard → Deployments → Function Logs

# Browser logs:
F12 → Console tab
```

### 3. API Key Security
```bash
# ✅ ใช้ Environment Variables
# ❌ ห้าม hardcode ใน code

# ตรวจสอบ .gitignore:
.env
.env.local
auth_data.json
```

### 4. Performance
```bash
# Backend pagination:
# ตั้ง strict_type_filtering=True เพื่อได้ผลลัพธ์มากกว่า 20

# Frontend:
# ใช้ debounce สำหรับ search input
# Cache dropdown data ใน localStorage
```

---

## 📚 ขั้นตอนถัดไป

หลัง deploy สำเร็จ:

1. **อ่านเอกสารเพิ่มเติม:**
   - `DEPLOY_RAILWAY.md` - Railway deployment details
   - `DEPLOY_VERCEL.md` - Vercel deployment details
   - `CLAUDE.md` - Development guide for AI/Claude

2. **ปรับแต่ง:**
   - เพิ่ม Custom Domain
   - Setup Analytics
   - เพิ่ม Business Types ใน `terms.yaml`

3. **Scale Up:**
   - Upgrade Railway plan (ถ้าใช้เกิน 500 ชม./เดือน)
   - Upgrade Vercel plan (ถ้าใช้ bandwidth เกิน 100GB)
   - เพิ่ม CDN สำหรับ static files

---

## 🆘 Need Help?

### Documentation:
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- Google Places API: https://developers.google.com/maps/documentation/places

### Support:
- Railway Discord: https://discord.gg/railway
- Vercel Support: https://vercel.com/support
- Project Issues: https://github.com/YOUR-REPO/issues

---

## ✅ Deployment Checklist

**Pre-deployment:**
- [ ] API keys พร้อมใช้งาน
- [ ] Code push to GitHub
- [ ] `.env` files configured

**Railway (Backend):**
- [ ] Project created
- [ ] Repository connected
- [ ] Root directory: `webui/backend`
- [ ] Environment variables added
- [ ] Domain generated
- [ ] Health check passed

**Vercel (Frontend):**
- [ ] Project created
- [ ] Repository connected
- [ ] Root directory: `webui/frontend`
- [ ] Environment variables added
- [ ] Build successful
- [ ] Site accessible

**Testing:**
- [ ] Provinces dropdown works
- [ ] Amphoes dropdown updates
- [ ] Tambons dropdown updates
- [ ] Search returns results (>20)
- [ ] Map displays markers
- [ ] CSV export works
- [ ] Mobile responsive

**Production:**
- [ ] Auto-deploy enabled
- [ ] Monitoring setup
- [ ] URLs documented
- [ ] Team members invited

---

**✨ Created by Claude Code** - เริ่มต้นใช้งานได้ภายใน 15 นาที! 🚀
