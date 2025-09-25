# 🏪 Places Ingestor - Modern Web Application

**Professional Business Search System for Thailand using Google Places API v1**

A modern, responsive web application for searching businesses and locations across Thailand with beautiful UI/UX design, featuring a landing page, secure authentication, and interactive maps.

ดึงข้อมูลร้านค้ากลุ่ม HORECA / minimart / ร้านของชำ / โรงพยาบาล / ร้านอาหาร / ค่ายทหาร / แบรนด์ Modern Trade (7-Eleven, Lotus's Go Fresh, Big C Mini, Lotus, Makro, Big C, Central) ฯลฯ พร้อมฟิลด์: ชื่อร้าน, ที่อยู่, lat/lng, website, เบอร์โทร, ประเภท

## ✨ Features

### 🌐 **Modern Web Application**
- **Professional UI/UX**: Modern blue-themed design with Thailand map elements
- **Landing Page**: Beautiful hero section with animated Thailand map and location pins
- **Secure Authentication**: JWT-based login system with usage tracking
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Production Ready**: Configured for deployment on Vercel + Railway (free hosting)

### 🖥️ **Interactive Web Interface**
- **Cascading Dropdowns**: เลือกจังหวัด → อำเภอ → ตำบล แบบลำดับชั้น
- **ข้อมูลครบถ้วน**: 77 จังหวัด, 928 อำเภอ, 7,436 ตำบล (ตามกรมการปกครอง)
- **แผนที่**: แสดง markers ด้วย Leaflet + OpenStreetMap
- **Export CSV**: ส่งออกผลลัพธ์เป็น CSV
- **ค้นหาแบบ Real-time**: เชื่อมต่อ Google Places API v1 โดยตรง

### 📊 **CLI (Command Line)**
- รองรับคำสั่งไทย–อังกฤษผ่านไฟล์ `config/terms.yaml`
- ค้นหาแบบ center+radius หรือ bounding box
- รองรับ pagination และ deduplication

---

## 🚀 Quick Start

### Prerequisites
1. **Python 3.10+** and **Node.js 18+**
2. **Google Cloud Project** with **Places API (New)** enabled
3. **API Key** with appropriate restrictions
4. **Billing enabled** in Google Cloud

### 🌟 **Deployment Option (Recommended)**
Deploy to the cloud for free using our comprehensive deployment guide:
- **Frontend**: Deploy to [Vercel](https://vercel.com) (Free)
- **Backend**: Deploy to [Railway](https://railway.app) (Free $5 credit/month)
- **Setup Time**: 15-20 minutes
- **Cost**: Completely FREE for moderate usage

👉 **[View Deployment Guide →](DEPLOYMENT.md)**

### 💻 **Local Development**

### โครงสร้างโปรเจกต์
```
places_ingestor_starter/
├── webui/                          # 🆕 Web UI
│   ├── backend/                    # FastAPI backend
│   │   ├── main.py                # API endpoints
│   │   ├── start.py               # เริ่ม server
│   │   └── requirements.txt       # Python dependencies
│   ├── frontend/                  # React + Vite frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── LocationSelector.jsx
│   │   │   │   ├── SearchResults.jsx
│   │   │   │   └── MapView.jsx
│   │   │   └── App.jsx
│   │   ├── package.json
│   │   └── tailwind.config.js
│   ├── start_backend.ps1          # เริ่ม backend script
│   ├── start_frontend.ps1         # เริ่ม frontend script
│   └── README.md                  # คู่มือ Web UI
├── admin_areas/                   # 🆕 ข้อมูลการปกครอง
│   ├── provinces.json             # 77 จังหวัด
│   ├── amphoes.json              # 928 อำเภอ
│   └── tambons.json              # 7,436 ตำบล
├── scripts/                      # 🆕 Scripts
│   └── parse_dopa_data.py        # แปลงข้อมูล DOPA
├── config/
│   └── terms.yaml                # mapping คำค้นหา
├── src/
│   ├── places_client.py          # Google Places API client
│   └── pipeline.py               # CLI pipeline
├── data/                         # ไฟล์ CSV ที่ export
├── .env                          # API keys และ config
└── requirements.txt              # Python dependencies
```

---

## 🖥️ Web UI - ใช้งานผ่านเว็บเบราว์เซอร์

### เริ่มใช้งาน
```bash
# 1. ติดตั้ง dependencies
pip install -r requirements.txt
cd webui/frontend && npm install

# 2. ตั้งค่า API Key
# แก้ไข webui/.env และใส่ PLACES_API_KEY=your_api_key_here

# 3. เริ่ม backend (Terminal 1)
cd webui
.\start_backend.ps1
# หรือ: cd webui/backend && python start.py

# 4. เริ่ม frontend (Terminal 2)
cd webui
.\start_frontend.ps1
# หรือ: cd webui/frontend && npm run dev

# 5. เปิดเบราว์เซอร์
# http://127.0.0.1:5173
```

### การใช้งาน Web UI
1. **เลือกพื้นที่**: จังหวัด → อำเภอ → ตำบล
2. **เลือกประเภทร้าน**: จาก dropdown หรือพิมพ์เอง
3. **กำหนดรัศมี** (ไม่บังคับ): ระบุกิโลเมตร
4. **กดค้นหา**: รอผลลัพธ์
5. **ดูผลลัพธ์**: ในตารางและแผนที่
6. **Export**: กด Export CSV

### ตัวอย่างการใช้งาน
- **สงขลา → หาดใหญ่ → หาดใหญ่ → ร้านกาแฟ → 1 กม.**
  - ค้นหาร้านกาแฟในรัศมี 1 กม. จากจุดกลางตำบลหาดใหญ่
- **กรุงเทพฯ → บางรัก → สีลม → โรงแรม → ไม่ระบุรัศมี**
  - ค้นหาโรงแรมทั้งขอบเขตแขวงสีลม

---

## 💻 CLI - ใช้งานผ่าน Command Line

### การใช้งาน CLI
```bash
# ตั้งค่า environment
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt

# ตั้งค่า API Key
cp .env.example .env  # แล้วแก้ไข PLACES_API_KEY

# ค้นหาแบบวงกลม (center + radius)
python src/pipeline.py --term horeca --center 13.7563,100.5018 --radius_m 15000 --out data/bangkok_horeca.csv

# ค้นหาแบบสี่เหลี่ยม (bounding box)
python src/pipeline.py --term minimart --bbox 18.64,98.91,18.87,99.05 --out data/chiang_mai_minimart.csv

# ค้นหาด้วยคำไทย
python src/pipeline.py --term ร้านอาหาร --language th --region TH --center 7.0084,100.4747 --radius_m 5000
```

### คำสั่งที่รองรับ
```bash
python src/pipeline.py --help

# พารามิเตอร์หลัก
--term          # ประเภทร้าน: horeca|minimart|hospital|restaurant|ร้านอาหาร|ร้านของชำ
--language      # ภาษา: th (ไทย) หรือ en (อังกฤษ)
--region        # ภูมิภาค: TH (ประเทศไทย)

# การกำหนดพื้นที่ (เลือก 1 แบบ)
--center lat,lng --radius_m meters    # แบบวงกลม
--bbox sw_lat,sw_lng,ne_lat,ne_lng   # แบบสี่เหลี่ยม

# ไฟล์ผลลัพธ์
--out path/to/output.csv
```

---

## ⚙️ การตั้งค่า Google Places API

### สร้าง API Key
1. ไปที่ [Google Cloud Console](https://console.cloud.google.com)
2. สร้าง project หรือเลือก project ที่มี
3. เปิดใช้งาน **Places API (New)**
4. ไปที่ **APIs & Services > Credentials**
5. คลิก **Create Credentials > API Key**
6. คัดลอก API Key

### ตั้งค่า API Key Restrictions
#### สำหรับ Development/Testing
- **Application restrictions**: เลือก **None** หรือ **IP addresses**
- ถ้าเลือก IP addresses ให้เพิ่ม:
  - `127.0.0.1` (localhost)
  - IP ปัจจุบันของคุณ

#### สำหรับ Production
- **Application restrictions**: เลือก **HTTP referrers**
- เพิ่ม referrers:
  - `http://localhost:*`
  - `https://yourdomain.com/*`

#### API Restrictions
- เลือก **Restrict key**
- เพิ่ม **Places API (New)**

### แก้ปัญหา API Key
#### Error: "API KEY IP ADDRESS BLOCKED"
```bash
# ใน Google Cloud Console:
# 1. เลือก API Key
# 2. Application restrictions → IP addresses
# 3. เพิ่ม IP ปัจจุบัน หรือเปลี่ยนเป็น "None"
# 4. รอ 5-10 นาทีให้การตั้งค่าใหม่มีผล
```

#### Error: "API key not valid"
```bash
# ตรวจสอบ:
# 1. API Key ถูกต้อง (ขึ้นต้นด้วย AIza)
# 2. Places API (New) เปิดใช้งาน
# 3. Billing account active
# 4. API restrictions ไม่เข้มเกินไป
```

---

## 📊 ข้อมูลการปกครองไทย

### แหล่งข้อมูล
ข้อมูลมาจาก **กรมการปกครong กระทรวงมหาดไทย** (ณ วันที่ 1 กันยายน 2566)

### สถิติ
- **จังหวัด**: 77 จังหวัด
- **อำเภอ**: 928 อำเภอ
- **ตำบล**: 7,436 ตำบล (เฉพาะที่ยังใช้งาน)

### การอัปเดตข้อมูล
หากต้องการอัปเดตข้อมูลการปกครอง:
```bash
# 1. ใส่ไฟล์ CSV จาก DOPA ใน d:/2025/Report/Area code/ccaatt.csv
# 2. รันสคริปต์
python scripts/parse_dopa_data.py

# 3. รีสตาร์ท backend
cd webui/backend && python start.py
```

---

## 🏪 การค้นหาประเภทร้าน

### ประเภทร้านที่รองรับ (config/terms.yaml)

#### ร้านอาหาร/เครื่องดื่ม
- `horeca` / `horeca_plus`: ร้านอาหาร, คาเฟ่, บาร์, โรงแรม
- `restaurant` / `ร้านอาหาร`: ร้านอาหาร, ซีฟู้ด, BBQ, ฮาลาล
- `cafe`: คาเฟ่, ร้านกาแฟ, ชานม, เบเกอรี่

#### ร้านค้าปลีก
- `minimart` / `ร้านของชำ`: มินิมาร์ท, ร้านสะดวกซื้อ
- `seven_eleven`: 7-Eleven เฉพาะ
- `lotus_gofresh`: Lotus's Go Fresh
- `bigc_mini`: Big C Mini

#### ห้างและซูเปอร์มาร์เก็ต
- `lotus`: Lotus, Tesco Lotus
- `makro`: แม็คโคร
- `bigc`: บิ๊กซี, Big C Supercenter
- `central`: เซ็นทรัล, Central Plaza

#### บริการสาธารณะ
- `hospital` / `โรงพยาบาล`: โรงพยาบาล
- `military` / `ค่ายทหาร`: ค่ายทหาร, หน่วยทหาร

### การเพิ่มประเภทร้านใหม่
แก้ไขไฟล์ `config/terms.yaml`:
```yaml
ร้านใหม่:
  included_types: [store, shop]  # Google Places types
  keywords_th: ["ร้านใหม่", "ร้านแปลก"]
  keywords_en: ["new shop", "unique store"]
```

---

## 📈 ผลลัพธ์และการ Export

### รูปแบบข้อมูล CSV
```csv
name,formatted_address,lat,lng,website,phone_national,phone_international,types,place_id,resource_name,google_maps_uri,included_type,source_keyword
```

### ตัวอย่างข้อมูล
```csv
"ร้านกาแฟดีๆ","123 ถนนใหญ่ ตำบลหาดใหญ่ อำเภอหาดใหญ่ จังหวัดสงขลา",7.0084,100.4747,"https://example.com","074-123456","+66-74-123456","cafe|food|establishment","ChIJ...","places/ChIJ...","https://maps.google.com/?cid=123","cafe","คาเฟ่"
```

### ข้อมูลที่ได้
- **ข้อมูลพื้นฐาน**: ชื่อร้าน, ที่อยู่, พิกัด
- **ช่องทางติดต่อ**: เว็บไซต์, เบอร์โทร (ในประเทศ/ต่างประเทศ)
- **ประเภท**: Google Places types
- **ลิงก์**: Google Maps URI, Place ID

---

## 🔧 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

#### Backend ไม่เริ่ม
```bash
# ตรวจสอบ:
# 1. Python version (3.10+)
# 2. Virtual environment active
# 3. ไฟล์ .env มี PLACES_API_KEY
# 4. Port 8000 ไม่ถูกใช้งาน

# แก้ไข:
pip install -r webui/backend/requirements.txt
```

#### Frontend ไม่เริ่ม
```bash
# ตรวจสอบ:
# 1. Node.js version (18+)
# 2. npm dependencies ติดตั้งแล้ว
# 3. Backend รันอยู่ที่ :8000

# แก้ไข:
cd webui/frontend
npm install
npm run dev
```

#### CORS Error
```bash
# ตรวจสอบ:
# 1. Backend อนุญาต http://localhost:5173
# 2. Frontend เรียก http://127.0.0.1:8000
# 3. ไม่มี proxy หรือ firewall บล็อค

# แก้ไข: รีสตาร์ท backend และ frontend
```

#### ไม่มีผลค้นหา
```bash
# ตรวจสอบ:
# 1. API Key ถูกต้องและมี credit
# 2. Places API (New) เปิดใช้งาน
# 3. คำค้นหาและพื้นที่เหมาะสม
# 4. ข้อมูลตำบล/อำเภอถูกต้อง

# แก้ไข: ลองเปลี่ยนคำค้นหาหรือขยายรัศมี
```

### การตรวจสอบสถานะ
```bash
# ตรวจสอบ backend
curl http://127.0.0.1:8000/meta/terms

# ตรวจสอบ frontend
curl http://127.0.0.1:5173

# ตรวจสอบข้อมูลจังหวัด
curl http://127.0.0.1:8000/meta/areas/provinces
```

---

## 📚 เอกสารเพิ่มเติม

### API Documentation
- **Backend API**: http://127.0.0.1:8000/docs (เมื่อ backend รันอยู่)
- **Google Places API v1**: [developers.google.com/maps/documentation/places](https://developers.google.com/maps/documentation/places/web-service)

### ไฟล์สำคัญ
- `webui/README.md`: คู่มือโดยละเอียดสำหรับ Web UI
- `config/terms.yaml`: การตั้งค่าประเภทร้านค้า
- `scripts/parse_dopa_data.py`: สคริปต์แปลงข้อมูล DOPA

### การสนับสนุน
- **GitHub Issues**: รายงานปัญหาหรือขอฟีเจอร์ใหม่
- **Documentation**: อัปเดตเอกสารเมื่อมีการเปลี่ยนแปลง

---

## 📄 ข้อมูลการใช้งาน

### ข้อกำหนดทางกฎหมาย
- ใช้เฉพาะ **Google Places API (New)** อย่างเป็นทางการ
- แสดง attribution ตาม Google Maps Platform policy
- การเก็บข้อมูลต้องสอดคล้องกับกฎหมายคุ้มครองข้อมูลส่วนบุคคล

### ข้อจำกัด
- **API Quota**: ขึ้นกับ Google Cloud billing plan
- **Rate Limiting**: 1-1.5 วินาทีระหว่างการเรียก API
- **Field Mask**: ระบุเฉพาะฟิลด์ที่จำเป็นเพื่อประหยัดค่าใช้จ่าย

### ค่าใช้จ่าย
- **Text Search**: ~$32 per 1,000 requests
- **Place Details**: ~$17 per 1,000 requests
- **Field Mask**: ลดค่าใช้จ่ายโดยระบุเฉพาะฟิลด์ที่ต้องการ

---

**พัฒนาโดย**: Claude Code
**เวอร์ชัน**: 2.0 (พร้อม Web UI + ข้อมูล DOPA)
**อัปเดตล่าสุด**: ธันวาคม 2024