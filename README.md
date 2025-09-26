# Places Ingestor - Modern Web Application

Places Ingestor เป็นเว็บแอปพลิเคชันสำหรับค้นหาและเก็บข้อมูลสถานที่ธุรกิจในประเทศไทยผ่าน Google Places API โดยรองรับการค้นหาตามลำดับชั้นการปปกครอง (จังหวัด → อำเภอ → ตำบล)

## 🌟 Live Demo

- **Frontend (ใช้งานจริง):** https://places-ingestor-v2.vercel.app
- **Backend API:** https://places-ingestor-v2-production.up.railway.app

## ✨ Features

- 🗺️ **ค้นหาตามพื้นที่:** จังหวัด → อำเภอ → ตำบล (77 จังหวัด, 928 อำเภอ, 7,436 ตำบล)
- 🏪 **ประเภทธุรกิจ:** ร้านอาหาร, คาเฟ่, โรงพยาบาล, ร้านสะดวกซื้อ, ปั๊มน้ำมัน และอื่นๆ อีกมากมาย
- 📊 **แสดงผลหลากหลาย:** ตารางข้อมูล, แผนที่ Google Maps, สถิติ
- 📤 **Export ข้อมูล:** ดาวน์โหลดเป็น CSV
- 🔄 **Pagination:** ดึงข้อมูลทั้งหมดจาก Google Places API (ไม่จำกัดแค่ 20 รายการ)
- 🌐 **Multi-language:** ภาษาไทย/อังกฤษ
- 🔐 **Authentication:** ระบบ JWT

## 🏗️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **UI:** Tailwind CSS + Lucide Icons
- **Maps:** Google Maps JavaScript API
- **Deploy:** Vercel

### Backend
- **Framework:** FastAPI (Python)
- **API:** Google Places API v1
- **Deploy:** Railway
- **Container:** Docker

## 📁 Project Structure

```
places_ingestor_starter/
├── webui/
│   ├── frontend/           # React app (Vercel)
│   │   ├── src/
│   │   ├── public/
│   │   ├── vercel.json
│   │   └── ...
│   └── backend/            # FastAPI app (Railway)
│       ├── main.py         # หลัก API endpoints
│       ├── places_client.py # Google Places API client
│       ├── terms.yaml      # ประเภทธุรกิจและ keywords
│       ├── admin_areas/    # ข้อมูลจังหวัด/อำเภอ/ตำบล
│       ├── Dockerfile
│       └── ...
├── src/                    # Original pipeline scripts
├── config/
│   └── terms.yaml         # Term mapping สำหรับ local
├── admin_areas/           # Administrative area data
└── README.md
```

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd places_ingestor_starter
```

### 2. Setup Environment Variables

#### Backend (.env)
```bash
cd webui/backend
cp .env.example .env
```

แก้ไข `.env`:
```env
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

#### Frontend (.env.local)
```bash
cd webui/frontend
```

สร้าง `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. ติดตั้ง Dependencies

#### Backend
```bash
cd webui/backend
pip install -r requirements.txt
```

#### Frontend
```bash
cd webui/frontend
npm install
```

### 4. Run Local Development

#### Backend (Terminal 1)
```bash
cd webui/backend
python start.py
# API จะรันที่ http://localhost:8000
```

#### Frontend (Terminal 2)
```bash
cd webui/frontend
npm run dev
# Web app จะรันที่ http://localhost:5173
```

## 🌐 Deploy to Production

### Backend (Railway)
1. Push code ไป GitHub
2. เชื่อม Railway กับ GitHub repository
3. ตั้งค่า Environment Variables:
   - `GOOGLE_PLACES_API_KEY`
4. Railway จะ deploy อัตโนมัติจาก `webui/backend/`

### Frontend (Vercel)
1. เชื่อม Vercel กับ GitHub repository
2. ตั้งค่า Root Directory: `webui/frontend`
3. ตั้งค่า Environment Variables:
   - `VITE_API_BASE_URL=https://your-backend-url.railway.app`
   - `VITE_GOOGLE_MAPS_API_KEY`
4. Vercel จะ deploy อัตโนมัติ

## 🔧 Configuration

### Business Terms (terms.yaml)
แก้ไขประเภทธุรกิจและ keywords ได้ที่ `webui/backend/terms.yaml`:

```yaml
ร้านอาหาร:
  included_types: [restaurant]
  keywords_th: ["ร้านอาหาร", "อาหารตามสั่ง", "ก๋วยเตี๋ยว"]
  keywords_en: ["restaurant", "food", "noodle"]

คาเฟ่:
  included_types: [cafe]
  keywords_th: ["คาเฟ่", "กาแฟ", "ชานม"]
  keywords_en: ["cafe", "coffee", "tea"]
```

### Administrative Areas
ข้อมูลจังหวัด/อำเภอ/ตำบลอยู่ที่ `webui/backend/admin_areas/`:
- `provinces.json` - 77 จังหวัด
- `amphoes.json` - 928 อำเภอ
- `tambons.json` - 7,436 ตำบล

## 📡 API Endpoints

### Authentication
- `POST /auth/login` - เข้าสู่ระบบ
- `GET /auth/usage-count` - ดูจำนวนการใช้งาน

### Search
- `POST /search` - ค้นหาสถานที่
- `GET /meta/terms` - ดูประเภทธุรกิจที่รองรับ

### Administrative Areas
- `GET /meta/areas/provinces` - รายชื่อจังหวัด
- `GET /meta/areas/amphoes?province_id=X` - รายชื่ออำเภอ
- `GET /meta/areas/tambons?amphoe_id=X` - รายชื่อตำบล

## 🔑 Google API Setup

### 1. Google Cloud Console
1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้าง Project ใหม่หรือเลือก Project ที่มี
3. เปิดใช้งาน APIs:
   - Places API (New)
   - Maps JavaScript API

### 2. สร้าง API Keys
1. ไปที่ Credentials → Create Credentials → API Key
2. ตั้งค่า Restrictions (แนะนำ):
   - **Places API Key:** HTTP referrers หรือ IP addresses
   - **Maps API Key:** HTTP referrers สำหรับเว็บไซต์

### 3. ตั้งค่า Billing
- Google Places API ต้องมี Billing Account
- มี Free tier $200/เดือน

## 🐛 Troubleshooting

### Common Issues

#### 1. "Total tambons loaded: 0"
```bash
# ตรวจสอบว่า admin_areas ถูกคัดลอกแล้ว
ls webui/backend/admin_areas/
```

#### 2. "Terms file not found"
```bash
# ตรวจสอบว่า terms.yaml อยู่ใน backend
ls webui/backend/terms.yaml
```

#### 3. CORS Error
- ตรวจสอบ `VITE_API_BASE_URL` ใน frontend
- ตรวจสอบ CORS settings ใน `main.py`

#### 4. Google API Quota Exceeded
- ตรวจสอบ usage ใน Google Cloud Console
- เพิ่ม quota หรือ billing limit

### Debug Mode
เปิด debug logging ใน backend:
```python
# ใน main.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📊 Data Sources

- **Administrative Areas:** กรมการปกครอง (DOPA)
- **Business Data:** Google Places API
- **Coordinates:** OpenStreetMap + Google Places

## 🔄 Development Workflow

### Local Testing
1. รัน backend และ frontend locally
2. ทดสอบ search functionality
3. ตรวจสอบ API responses และ pagination

### Deployment Testing
1. Deploy ไป Railway/Vercel
2. ทดสอบ production URLs
3. ตรวจสอบ environment variables

### Adding New Business Types
1. แก้ไข `terms.yaml`
2. เพิ่ม keywords และ included_types
3. Test การค้นหา
4. Deploy

## 🤝 Contributing

1. Fork repository
2. สร้าง feature branch
3. Commit changes
4. สร้าง Pull Request

## 📝 License

MIT License - ใช้งานได้อย่างอิสระ

## 🆘 Support

หากมีปัญหาหรือต้องการความช่วยเหลือ:
1. เช็ค Issues ใน repository
2. สร้าง Issue ใหม่พร้อม error logs
3. ระบุ browser, OS, และขั้นตอนที่ทำ

---

**🎉 Happy Coding!** สร้างโดย Claude Code และพร้อมให้ทุกคนต่อยอดต่อไป