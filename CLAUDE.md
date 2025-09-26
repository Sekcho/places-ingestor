# Claude Code Development Guide

คู่มือนี้เป็นเอกสารสำหรับ Claude Code และ AI assistants ที่จะมาต่อยอดพัฒนาโปรเจค Places Ingestor ต่อ

## 🤖 Project Context

**Places Ingestor** เป็น web application สำหรับค้นหาสถานที่ธุรกิจในไทยผ่าน Google Places API โดยใช้ระบบการค้นหาแบบลำดับชั้น (จังหวัด → อำเภอ → ตำบล)

### Live URLs
- **Frontend:** https://places-ingestor-v2.vercel.app
- **Backend:** https://places-ingestor-v2-production.up.railway.app

## 🏗️ Architecture Overview

```
Frontend (Vercel)          Backend (Railway)          External APIs
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│ React + Vite    │────────│ FastAPI + Python│────────│ Google Places   │
│ Tailwind CSS    │  CORS  │ Docker Container│  API   │ Google Maps     │
│ Google Maps JS  │        │ JWT Auth        │        │                 │
└─────────────────┘        └─────────────────┘        └─────────────────┘
```

### Key Technologies
- **Frontend:** React 18, Vite, Tailwind CSS, Google Maps JavaScript API
- **Backend:** FastAPI, Pydantic, Docker, Railway
- **Database:** JSON files (provinces, amphoes, tambons)
- **APIs:** Google Places API v1, Google Maps JavaScript API

## 📂 Important Files & Paths

### Backend (`webui/backend/`)
```bash
main.py                 # Core API endpoints และ business logic
places_client.py         # Google Places API client with retry logic
terms.yaml              # Business type mappings (ร้านอาหาร → restaurant)
start.py                # Uvicorn server startup
admin_areas/            # Administrative area data
├── provinces.json      # 77 จังหวัด with coordinates
├── amphoes.json        # 928 อำเภอ with province relationships
└── tambons.json        # 7,436 ตำบล with coordinates & boundaries
```

### Frontend (`webui/frontend/`)
```bash
src/
├── components/         # React components
├── hooks/             # Custom React hooks
├── services/          # API communication
└── App.jsx           # Main application
```

## 🔧 Development Commands

### Local Development
```bash
# Backend
cd webui/backend
python start.py

# Frontend
cd webui/frontend
npm run dev
```

### Build & Deploy
```bash
# Backend builds automatically on Railway via Dockerfile
# Frontend builds automatically on Vercel via npm run build
```

### Testing & Linting
```bash
# Backend
cd webui/backend
python -m pytest    # If tests exist
black .             # Code formatting

# Frontend
cd webui/frontend
npm run lint        # ESLint
npm run build       # Production build test
```

## 🐛 Common Issues & Solutions

### 1. "Total tambons loaded: 0"
**Problem:** Admin areas data not loading
**Solution:**
```bash
# Check files exist
ls webui/backend/admin_areas/
# Expected: provinces.json, amphoes.json, tambons.json

# Check paths in main.py around line 42-44:
provinces_data = load_json_file(Path(__file__).parent / "admin_areas" / "provinces.json")
```

### 2. "Terms file not found"
**Problem:** terms.yaml not found
**Solution:**
```bash
# Copy terms.yaml to backend
cp config/terms.yaml webui/backend/terms.yaml

# Check path in main.py load_terms_data():
with open(Path(__file__).parent / "terms.yaml", 'r', encoding='utf-8') as f:
```

### 3. Only 20 search results (pagination issue)
**Problem:** Google Places API pagination not working
**Root Cause:** Usually missing `included_types` or wrong `strict_type_filtering`
**Solution:**
```python
# In main.py search endpoint, ensure:
strict_type_filtering=True if itype else False  # Not always False
```

### 4. CORS errors
**Problem:** Frontend can't connect to backend
**Solution:**
```python
# In main.py, check CORS middleware:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specific Vercel domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🔍 Search Logic Deep Dive

### Location Hierarchy
```python
# Search priority:
1. tambon_id (most specific) → 1.5km radius
2. amphoe_id (medium) → 5km radius
3. province_id (broad) → 30km radius
```

### Business Type Mapping
```yaml
# terms.yaml structure:
ร้านอาหาร:
  included_types: [restaurant]          # Google Places type
  keywords_th: ["ร้านอาหาร", "อาหาร"]   # Thai search terms
  keywords_en: ["restaurant", "food"]   # English search terms
```

### Pagination Implementation
```python
# Key pagination logic in main.py:
while True:
    data = search_text(..., page_token=page_token)
    places = data.get("places", [])
    # Process places...
    page_token = data.get("nextPageToken")
    if not page_token:
        break
    time.sleep(1.2)  # Rate limiting
```

## 🔑 Environment Variables

### Backend (.env)
```env
GOOGLE_PLACES_API_KEY=AIza...        # Required: Google Places API
PLACES_API_KEY=AIza...               # Legacy fallback name
```

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:8000           # Local backend
VITE_GOOGLE_MAPS_API_KEY=AIza...                  # Required: Google Maps
```

### Production
```env
# Railway (Backend)
GOOGLE_PLACES_API_KEY=AIza...

# Vercel (Frontend)
VITE_API_BASE_URL=https://places-ingestor-v2-production.up.railway.app
VITE_GOOGLE_MAPS_API_KEY=AIza...
```

## 📊 Data Structure Examples

### Search Request
```json
{
  "province_id": "90",
  "amphoe_id": "9001",
  "tambon_id": "900101",
  "term": "ร้านอาหาร",
  "language": "th",
  "region": "TH"
}
```

### Search Response
```json
{
  "results": [
    {
      "name": "ร้านอาหารดีลิเชียส",
      "formatted_address": "123 ถ.ราชดำเนิน หาดใหญ่ สงขลา",
      "lat": 7.0084,
      "lng": 100.4747,
      "place_id": "ChIJ...",
      "types": "restaurant|food",
      "phone": "074-123456",
      "website": "https://...",
      "google_maps_uri": "https://maps.google.com/?cid=..."
    }
  ]
}
```

## 🚀 Deployment Guide

### Railway (Backend)
1. Connect GitHub repository
2. Set root directory: `webui/backend`
3. Add environment variables
4. Auto-deploys on git push

### Vercel (Frontend)
1. Connect GitHub repository
2. Set root directory: `webui/frontend`
3. Build command: `npm run build`
4. Add environment variables
5. Auto-deploys on git push

## 🔄 Adding New Features

### New Business Type
1. Edit `webui/backend/terms.yaml`:
   ```yaml
   โรงแรม:
     included_types: [lodging]
     keywords_th: ["โรงแรม", "รีสอร์ท"]
     keywords_en: ["hotel", "resort"]
   ```
2. Test locally
3. Deploy

### New API Endpoint
1. Add to `webui/backend/main.py`:
   ```python
   @app.get("/new-endpoint")
   async def new_endpoint():
       return {"message": "Hello"}
   ```
2. Update frontend service calls
3. Test & deploy

### UI Changes
1. Edit components in `webui/frontend/src/components/`
2. Follow Tailwind CSS patterns
3. Test responsive design
4. Deploy to Vercel

## 🧪 Testing Strategy

### Manual Testing Checklist
- [ ] Province dropdown loads 77 provinces
- [ ] Amphoe dropdown updates based on province
- [ ] Tambon dropdown updates based on amphoe
- [ ] Search returns > 20 results for common terms
- [ ] Map shows markers correctly
- [ ] CSV export works
- [ ] Mobile responsive

### Debug Logs to Watch
```bash
# Backend logs (Railway):
DEBUG: Loaded 77 records from provinces.json
DEBUG: Loaded 928 records from amphoes.json
DEBUG: Loaded 7436 records from tambons.json
DEBUG: Found entry for 'ร้านอาหาร': {...}
DEBUG: Page 1 returned 20 places, next token: Yes
DEBUG: Search completed - Total results: 45
```

## 📈 Performance Optimization

### Backend
- Use pagination properly (`nextPageToken`)
- Implement rate limiting (1.2s between API calls)
- Cache administrative area data in memory
- Use `tenacity` for API retry logic

### Frontend
- Lazy load Google Maps
- Debounce search inputs
- Cache dropdown data
- Optimize bundle size

## 🔒 Security Considerations

- API keys in environment variables only
- CORS properly configured
- No sensitive data in client-side code
- JWT token validation (if implementing auth)

## 📝 Code Style

### Python (Backend)
```python
# Follow these patterns from existing code:
from typing import Dict, List, Optional
from pathlib import Path

# Use descriptive variable names
province_id_str = str(request.province_id)

# Add debug logging for troubleshooting
print(f"DEBUG: Looking for province_id '{province_id_str}'")
```

### JavaScript (Frontend)
```javascript
// Follow React hooks patterns
const [loading, setLoading] = useState(false);

// Use async/await
const handleSearch = async () => {
  try {
    const response = await searchPlaces(searchParams);
    setResults(response);
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

## 🎯 Future Enhancement Ideas

1. **Database Migration:** Move from JSON files to PostgreSQL
2. **Caching:** Add Redis for API response caching
3. **Real-time Updates:** WebSocket for live search results
4. **Advanced Filters:** Price range, ratings, hours
5. **Bulk Operations:** Search multiple areas at once
6. **Analytics:** Track popular searches and areas
7. **API Rate Limiting:** Implement per-user limits
8. **Offline Support:** PWA with service workers

## 💡 Claude Code Specific Notes

When working on this project:

1. **Always check Railway logs** for backend issues
2. **Test pagination thoroughly** - it's the most common issue
3. **Verify admin_areas data loading** first when debugging
4. **Check terms.yaml mapping** for business type issues
5. **Use debug logging extensively** - already set up
6. **Follow existing patterns** rather than reinventing

### Quick Debug Commands
```bash
# Check if all data files loaded correctly:
curl https://places-ingestor-v2-production.up.railway.app/meta/areas/provinces | jq length

# Test search with debug:
curl -X POST https://places-ingestor-v2-production.up.railway.app/search \
  -H "Content-Type: application/json" \
  -d '{"province_id":"90","term":"ร้านอาหาร","language":"th"}'
```

---

**สร้างโดย Claude Code** - เอกสารนี้ช่วยให้ AI assistants คนต่อไปสามารถเข้าใจและต่อยอดโปรเจคได้อย่างรวดเร็ว 🚀