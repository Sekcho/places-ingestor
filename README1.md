# Places Ingestor (Google Places API v1)

ดึงรายชื่อร้านค้ากลุ่ม HORECA / minimart / ร้านของชำ / โรงพยาบาล / ร้านอาหาร / ค่ายทหาร ฯลฯ
จาก Google Places API (New, v1) พร้อมฟิลด์: ชื่อร้าน, address, lat/lng, website, เบอร์โทร, types
และรองรับคำสั่งไทย–อังกฤษผ่านไฟล์ `config/terms.yaml`

## 0) เตรียมของ
- Python 3.10+
- สร้าง Google Cloud Project + เปิดใช้งาน Places API (New) และสร้าง API Key
- ตั้งข้อจำกัด Key (API restrictions + client restrictions ตามสภาพใช้งาน — แนะนำ IP restriction สำหรับ backend)

## 1) Setup
```bash
cd places_ingestor
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # และใส่ค่า PLACES_API_KEY=...
```

## 2) ใช้งานแบบเร็ว
- ค้นหา HORECA ในกรุงเทพฯ (วงกลมรัศมี 15 กม.) ภาษาไทย
```bash
python src/pipeline.py --term horeca --language th --region TH --center 13.7563,100.5018 --radius_m 15000 --out data/bkk_horeca.csv
```
- ค้นหา minimart ในเชียงใหม่ด้วยกรอบสี่เหลี่ยม (bbox)
```bash
python src/pipeline.py --term minimart --bbox 18.64,98.91,18.87,99.05 --out data/cnx_minimart.csv
```

## 3) Output
ได้ไฟล์ CSV มีคอลัมน์:
`name, formatted_address, lat, lng, website, phone_national, phone_international, types, place_id, resource_name, google_maps_uri, included_type, source_keyword`

## 4) ปรับแต่ง term/คำค้น
แก้ไข `config/terms.yaml` เพื่อเพิ่ม/แก้ mapping ไทย–อังกฤษ → included types + keywords
- หมายเหตุ: `includedType` ใน Places v1 เรียกได้ทีละ 1 ประเภทเท่านั้น โค้ดจะ fan-out ให้อัตโนมัติ

## 5) หมายเหตุทางกฎระเบียบ
- ใช้เฉพาะ Google Places API (New) อย่างเป็นทางการ หลีกเลี่ยงการ scrape
- แสดง attribution ตามนโยบายหากใช้ข้อมูลบน UI
- อีเมลลูกค้าไม่ได้อยู่ใน Places โดยตรง—หากต้องการควร enrich จาก website ของร้าน (ภายใต้นโยบาย/กฎหมายที่เกี่ยวข้อง)
