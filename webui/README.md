# Places Ingestor Web UI

เว็บ UI สำหรับค้นหาร้านค้าและธุรกิจต่างๆ จาก Google Places API ด้วยการเลือกจังหวัด > อำเภอ > ตำบล

## คุณสมบัติ

- 🏠 **เลือกพื้นที่**: Dropdown แบบลำดับชั้น จังหวัด → อำเภอ → ตำบล
- 🏪 **เลือกประเภทร้าน**: จาก config/terms.yaml หรือพิมพ์เอง
- 📍 **กำหนดรัศมี**: ระบุกิโลเมตร หรือค้นหาทั้งตำบล
- 🗺️ **แผนที่**: แสดง markers ของร้านที่พบ
- 📊 **ตาราง**: แสดงผลลัพธ์พร้อม export CSV
- 🔍 **ค้นหาแบบ Real-time**: ใช้ Google Places API v1

## เทคโนโลยี

### Backend
- **FastAPI** (Python) - REST API server
- **Google Places API v1** - ดึงข้อมูลร้านค้า
- **Pandas** - จัดการข้อมูล
- **Pydantic** - Validation

### Frontend
- **React + Vite** - UI framework
- **Tailwind CSS** - Styling
- **Leaflet** - แผนที่ (OpenStreetMap)
- **Axios** - HTTP client

## การติดตั้งและใช้งาน

### เตรียมของ
1. Python 3.10+
2. Node.js 18+
3. Google Places API Key (Places API New enabled)

### 1. ตั้งค่า API Key
```bash
# คัดลอกไฟล์ .env จาก project root มาใส่ในโฟลเดอร์ webui
cp ../.env .
# แก้ไข .env และใส่ PLACES_API_KEY=your_key_here
```

### 2. เริ่ม Backend (Terminal 1)
```powershell
# Windows PowerShell
.\start_backend.ps1
```

หรือรันด้วยตนเอง:
```bash
# สร้าง virtual environment (ครั้งแรกเท่านั้น)
python -m venv .venv
# เปิดใช้งาน venv
.\.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux

# ติดตั้ง dependencies
pip install -r backend/requirements.txt

# รัน backend
cd backend
python start.py
```

Backend จะรันที่: http://127.0.0.1:8000

### 3. เริ่ม Frontend (Terminal 2)
```powershell
# Windows PowerShell
.\start_frontend.ps1
```

หรือรันด้วยตนเอง:
```bash
cd frontend
npm install  # ครั้งแรกเท่านั้น
npm run dev
```

Frontend จะรันที่: http://127.0.0.1:5173

## การใช้งาน

1. **เลือกพื้นที่**: เลือกจังหวัด → อำเภอ → ตำบล ตามลำดับ
2. **เลือกประเภทร้าน**: จาก dropdown หรือพิมพ์คำค้นหาเอง
3. **กำหนดรัศมี** (ไม่บังคับ): ใส่ตัวเลขเป็นกิโลเมตร
   - มีรัศมี = ค้นหาแบบวงกลม จากจุดกลางตำบล
   - ไม่มีรัศมี = ค้นหาทั้งขอบเขตตำบล
4. **กดค้นหา**: รอผลลัพธ์
5. **ดูผล**: ในตารางและบนแผนที่
6. **Export CSV**: กดปุ่ม Export CSV

## API Endpoints

### Backend API (http://127.0.0.1:8000)

- `GET /meta/terms` - รายการประเภทร้านจาก terms.yaml
- `GET /meta/areas/provinces` - รายการจังหวัด
- `GET /meta/areas/amphoes?province_id=XX` - รายการอำเภอตามจังหวัด
- `GET /meta/areas/tambons?amphoe_id=YYY` - รายการตำบลตามอำเภอ
- `POST /search` - ค้นหาร้านค้า

### ตัวอย่าง Search Request
```json
{
  "province_id": "90",
  "amphoe_id": "9001",
  "tambon_id": "900101",
  "term": "restaurant",
  "freetext": null,
  "language": "th",
  "region": "TH",
  "radius_km": 1.5
}
```

## โครงสร้างไฟล์

```
webui/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── start.py             # เริ่ม server
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LocationSelector.jsx  # Cascading dropdowns
│   │   │   ├── SearchResults.jsx     # ตารางผลลัพธ์ + Export
│   │   │   └── MapView.jsx           # แผนที่ Leaflet
│   │   ├── App.jsx          # Main component
│   │   └── index.css        # Tailwind CSS
│   ├── package.json         # Node dependencies
│   └── tailwind.config.js   # Tailwind config
├── start_backend.ps1        # เริ่ม backend
├── start_frontend.ps1       # เริ่ม frontend
└── README.md               # ไฟล์นี้
```

## การแก้ปัญหา

### Backend ไม่เริ่ม
- ตรวจสอบ Python version (3.10+)
- ตรวจสอบ `.env` มี `PLACES_API_KEY`
- ตรวจสอบ virtual environment active

### Frontend ไม่เริ่ม
- ตรวจสอบ Node.js version (18+)
- รัน `npm install` ใหม่
- ตรวจสอบ backend รันอยู่ที่ port 8000

### CORS Error
- ตรวจสอบ backend อนุญาต `http://localhost:5173`
- ตรวจสอบ frontend เรียก `http://127.0.0.1:8000`

### ไม่มีผลค้นหา
- ตรวจสอบ Google Places API Key
- ตรวจสอบ API quota/billing
- ลองเปลี่ยนคำค้นหาหรือพื้นที่

## การพัฒนาต่อ

- เพิ่มข้อมูลจังหวัด/อำเภอ/ตำบลใน `admin_areas/*.json`
- เพิ่มประเภทร้านใน `config/terms.yaml`
- ปรับแต่ง UI ใน `frontend/src/components/`
- เพิ่ม endpoint ใน `backend/main.py`