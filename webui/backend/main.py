from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json
import yaml
import sys
import os
import uuid
import datetime
from pathlib import Path

# Import places_client from same directory
from places_client import search_text, get_place_details

# Add project root to environment
project_root = Path(__file__).parent.parent.parent
os.chdir(project_root)

from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="Places Ingestor Web UI API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins temporarily
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load admin areas data
def load_json_file(file_path: Path) -> List[Dict]:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

provinces_data = load_json_file(project_root / "admin_areas" / "provinces.json")
amphoes_data = load_json_file(project_root / "admin_areas" / "amphoes.json")
tambons_data = load_json_file(project_root / "admin_areas" / "tambons.json")

# Province coordinates (from parse_dopa_data.py)
PROVINCE_COORDINATES = {
    '10': (13.7563, 100.5018),  # Bangkok
    '11': (13.5990, 100.5998),  # Samut Prakan
    '12': (13.8621, 100.5144),  # Nonthaburi
    '13': (14.0208, 100.5250),  # Pathum Thani
    '14': (14.3692, 100.5877),  # Ayutthaya
    '15': (14.5896, 100.4550),  # Ang Thong
    '16': (14.7995, 100.6532),  # Lopburi
    '17': (14.8818, 100.3928),  # Sing Buri
    '18': (15.1847, 100.1256),  # Chai Nat
    '19': (14.5289, 100.9103),  # Saraburi
    '20': (13.3622, 100.9847),  # Chonburi
    '21': (12.6802, 101.2828),  # Rayong
    '22': (12.6117, 102.1038),  # Chanthaburi
    '23': (12.2436, 102.5151),  # Trat
    '24': (13.6904, 101.0779),  # Chachoengsao
    '25': (14.0460, 101.3686),  # Prachin Buri
    '26': (14.2069, 101.2130),  # Nakhon Nayok
    '27': (13.8240, 102.0640),  # Sa Kaeo
    '30': (14.9799, 102.0977),  # Nakhon Ratchasima
    '31': (14.9930, 103.1029),  # Buriram
    '32': (14.8818, 103.4936),  # Surin
    '33': (15.1186, 104.3220),  # Sisaket
    '34': (15.2441, 104.8466),  # Ubon Ratchathani
    '35': (15.7940, 104.1450),  # Yasothon
    '36': (15.8067, 102.0314),  # Chaiyaphum
    '37': (15.8650, 104.6260),  # Amnat Charoen
    '38': (17.2038, 102.4410),  # Nong Bua Lam Phu
    '40': (16.4419, 102.8359),  # Khon Kaen
    '41': (17.4138, 102.7870),  # Udon Thani
    '42': (17.4860, 101.7223),  # Loei
    '43': (17.8782, 102.7412),  # Nong Khai
    '44': (16.1851, 103.3058),  # Maha Sarakham
    '45': (16.0564, 103.6536),  # Roi Et
    '46': (16.4322, 103.5055),  # Kalasin
    '47': (17.1555, 104.1490),  # Sakon Nakhon
    '48': (17.4074, 104.7686),  # Nakhon Phanom
    '49': (16.5426, 104.7235),  # Mukdahan
    '50': (18.7904, 98.9847),   # Chiang Mai
    '51': (18.5742, 99.0079),   # Lamphun
    '52': (18.2932, 99.4936),   # Lampang
    '53': (17.6200, 100.0994),  # Uttaradit
    '54': (18.1459, 100.1410),  # Phrae
    '55': (18.7756, 100.7730),  # Nan
    '56': (19.1717, 99.8954),   # Phayao
    '57': (19.9105, 99.8406),   # Chiang Rai
    '58': (19.2952, 97.9647),   # Mae Hong Son
    '60': (15.7047, 100.1372),  # Nakhon Sawan
    '61': (15.3791, 99.4160),   # Uthai Thani
    '62': (16.4827, 99.5226),   # Kamphaeng Phet
    '63': (16.8697, 99.1260),   # Tak
    '64': (17.0077, 99.8236),   # Sukhothai
    '65': (16.8211, 100.2659),  # Phitsanulok
    '66': (16.4381, 100.3500),  # Phichit
    '67': (16.4194, 101.1590),  # Phetchabun
    '70': (13.5282, 99.8135),   # Ratchaburi
    '71': (14.0227, 99.5452),   # Kanchanaburi
    '72': (14.4745, 100.1212),  # Suphanburi
    '73': (13.8199, 100.0440),  # Nakhon Pathom
    '74': (13.5477, 100.2745),  # Samut Sakhon
    '75': (13.4140, 100.0021),  # Samut Songkhram
    '76': (13.1117, 99.9388),   # Phetchaburi
    '77': (11.8130, 99.7970),   # Prachuap Khiri Khan
    '80': (8.4304, 99.9631),    # Nakhon Si Thammarat
    '81': (8.0863, 98.9063),    # Krabi
    '82': (8.4504, 98.5309),    # Phang Nga
    '83': (7.8804, 98.3923),    # Phuket
    '84': (9.1382, 99.3215),    # Surat Thani
    '85': (9.9539, 98.6359),    # Ranong
    '86': (10.4930, 99.1802),   # Chumphon
    '90': (7.0084, 100.4747),   # Songkhla
    '91': (6.6238, 100.0673),   # Satun
    '92': (7.5563, 99.6210),    # Trang
    '93': (7.6166, 100.0744),   # Phatthalung
    '94': (6.8693, 101.2502),   # Pattani
    '95': (6.5398, 101.2800),   # Yala
    '96': (6.4254, 101.8253),   # Narathiwat
}

# Load terms data
def load_terms_data() -> Dict:
    try:
        with open(project_root / "config" / "terms.yaml", 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    except FileNotFoundError:
        return {}

terms_data = load_terms_data()

# Authentication and Usage Counter
AUTH_DATA_FILE = Path("auth_data.json")  # Create in current directory for Railway

def load_auth_data():
    """Load authentication and usage data"""
    try:
        with open(AUTH_DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        # Initialize with default data
        default_data = {
            "users": {
                "Admin": "Lead@25"
            },
            "usage_count": 0,
            "sessions": {}
        }
        save_auth_data(default_data)
        return default_data

def save_auth_data(data):
    """Save authentication and usage data"""
    with open(AUTH_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def generate_session_token():
    """Generate a unique session token"""
    return str(uuid.uuid4())

def increment_usage_count():
    """Increment and return usage count"""
    auth_data = load_auth_data()
    auth_data["usage_count"] += 1
    save_auth_data(auth_data)
    return auth_data["usage_count"]

def validate_credentials(username: str, password: str) -> bool:
    """Validate user credentials"""
    auth_data = load_auth_data()
    return auth_data["users"].get(username) == password

# Pydantic models
class SearchRequest(BaseModel):
    province_id: Optional[str] = None
    amphoe_id: Optional[str] = None
    tambon_id: Optional[str] = None
    term: Optional[str] = None
    freetext: Optional[str] = None
    language: str = "th"
    region: str = "TH"
    radius_km: Optional[float] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    token: str
    message: str
    usage_count: int

class PlaceResult(BaseModel):
    province: Optional[str] = None
    name: Optional[str] = None
    formatted_address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    website: Optional[str] = None
    phone_national: Optional[str] = None
    types: Optional[str] = None
    google_maps_uri: Optional[str] = None
    place_id: Optional[str] = None
    source_term: Optional[str] = None

# API Endpoints
@app.get("/")
async def root():
    return {"message": "Places Ingestor Web UI API", "status": "healthy"}

@app.get("/health")
async def health_check():
    """Health check endpoint for Railway"""
    return {"status": "healthy", "timestamp": datetime.datetime.now().isoformat()}

@app.post("/auth/login")
async def login(request: LoginRequest):
    """Authenticate user and return session token"""
    if not validate_credentials(request.username, request.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Generate session token
    token = generate_session_token()
    usage_count = increment_usage_count()

    # Store session (simple in-memory for now)
    auth_data = load_auth_data()
    auth_data["sessions"][token] = {
        "username": request.username,
        "login_time": datetime.datetime.now().isoformat(),
        "active": True
    }
    save_auth_data(auth_data)

    return LoginResponse(
        success=True,
        token=token,
        message="Login successful",
        usage_count=usage_count
    )

@app.get("/auth/usage-count")
async def get_usage_count():
    """Get current usage count"""
    auth_data = load_auth_data()
    return {"usage_count": auth_data["usage_count"]}

@app.get("/meta/terms")
async def get_terms():
    """Get available business terms from terms.yaml"""
    # Reload terms data every time to get latest changes
    current_terms_data = load_terms_data()
    result = []
    for key, value in current_terms_data.items():
        if isinstance(value, dict):
            result.append({
                "key": key,
                "label_th": value.get("keywords_th", [key])[0] if value.get("keywords_th") else key,
                "included_types": value.get("included_types", [])
            })
    return result

@app.get("/meta/areas/provinces")
async def get_provinces():
    """Get all provinces"""
    return provinces_data

@app.get("/meta/areas/amphoes")
async def get_amphoes(province_id: str = Query(..., description="Province ID")):
    """Get amphoes by province ID"""
    return [a for a in amphoes_data if a["province_id"] == province_id]

@app.get("/meta/areas/tambons")
async def get_tambons(amphoe_id: str = Query(..., description="Amphoe ID")):
    """Get tambons by amphoe ID"""
    return [t for t in tambons_data if t["amphoe_id"] == amphoe_id]

def build_queries_for_term(term: str, language: str) -> tuple[List[str], List[str]]:
    """Build queries based on term mapping"""
    entry = terms_data.get(term) or terms_data.get(term.capitalize()) or terms_data.get(term.lower())
    if not entry:
        entry = terms_data.get("other", {"included_types": [], "keywords_th": [], "keywords_en": []})

    included_types = entry.get("included_types", []) or []
    if language.startswith("th"):
        kws = entry.get("keywords_th", []) or entry.get("keywords_en", [])
    else:
        kws = entry.get("keywords_en", []) or entry.get("keywords_th", [])

    return included_types, kws

def get_search_coordinates_and_radius(request: SearchRequest):
    """Determine search center and radius based on hierarchy level"""
    center_lat, center_lng = None, None
    default_radius_km = None

    if request.tambon_id:
        # Tambon level - most specific
        tambon = next((t for t in tambons_data if t["id"] == request.tambon_id), None)
        if tambon and "center" in tambon:
            center_lat, center_lng = tambon["center"]["lat"], tambon["center"]["lng"]
            default_radius_km = 1.5  # Very specific radius for tambon
    elif request.amphoe_id:
        # Amphoe level - medium specificity
        # Calculate amphoe center from its tambons
        amphoe_tambons = [t for t in tambons_data if t["amphoe_id"] == request.amphoe_id and "center" in t]
        if amphoe_tambons:
            avg_lat = sum(t["center"]["lat"] for t in amphoe_tambons) / len(amphoe_tambons)
            avg_lng = sum(t["center"]["lng"] for t in amphoe_tambons) / len(amphoe_tambons)
            center_lat, center_lng = avg_lat, avg_lng
            default_radius_km = 5  # Smaller radius for amphoe to avoid cross-province results
    elif request.province_id:
        # Province level - broadest search
        if request.province_id in PROVINCE_COORDINATES:
            center_lat, center_lng = PROVINCE_COORDINATES[request.province_id]
            default_radius_km = 30  # Reduced radius for province

    return center_lat, center_lng, default_radius_km

@app.post("/search")
async def search_places(request: SearchRequest):
    """Search places based on location and business type"""
    api_key = os.getenv("GOOGLE_PLACES_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Missing GOOGLE_PLACES_API_KEY environment variable")

    # Get search coordinates based on hierarchy level
    center_lat, center_lng, default_radius_km = get_search_coordinates_and_radius(request)

    if not center_lat or not center_lng:
        raise HTTPException(status_code=400, detail="Could not determine search location")

    # Determine search query
    search_term = request.freetext or request.term or "restaurant"

    # Determine final radius
    final_radius_km = request.radius_km if request.radius_km else default_radius_km

    # Build location parameters - always use circle for flexibility
    location_bias_circle = (center_lat, center_lng, int(final_radius_km * 1000))
    location_restriction_rect = None

    # Build search queries
    if request.freetext:
        # Direct freetext search
        inc_types = [None]
        keywords = [request.freetext]
    else:
        # Use term mapping
        inc_types, keywords = build_queries_for_term(search_term, request.language)
        if not keywords:
            keywords = [search_term]
        if not inc_types:
            inc_types = [None]

    # Collect results
    seen_ids = set()
    results = []

    try:
        for itype in inc_types:
            for kw in keywords:
                page_token = None
                while True:
                    data = search_text(
                        api_key=api_key,
                        text_query=kw,
                        language_code=request.language,
                        region_code=request.region,
                        included_type=itype,
                        strict_type_filtering=False,  # Use False for higher recall as per README
                        location_bias_circle=location_bias_circle,
                        location_restriction_rect=location_restriction_rect,
                        page_token=page_token,
                        page_size=20,
                    )

                    places = data.get("places", [])
                    for p in places:
                        pid = p.get("id") or (p.get("name", "").split("/")[-1] if p.get("name") else None)
                        if not pid or pid in seen_ids:
                            continue
                        seen_ids.add(pid)

                        # Get detailed info
                        try:
                            details = get_place_details(
                                api_key=api_key,
                                place_name_or_id=pid,
                                language_code=request.language
                            )

                            display_name = (p.get("displayName") or {}).get("text") or details.get("displayName", {}).get("text")
                            loc = p.get("location") or details.get("location", {})

                            # Find province name
                            province_name = None
                            if request.province_id:
                                prov = next((p for p in provinces_data if p["id"] == request.province_id), None)
                                if prov:
                                    province_name = prov["name_th"]

                            result = PlaceResult(
                                province=province_name,
                                name=display_name,
                                formatted_address=details.get("formattedAddress") or p.get("formattedAddress"),
                                lat=loc.get("latitude"),
                                lng=loc.get("longitude"),
                                website=details.get("websiteUri"),
                                phone_national=details.get("nationalPhoneNumber"),
                                types="|".join(details.get("types", []) or p.get("types", [])),
                                google_maps_uri=details.get("googleMapsUri") or p.get("googleMapsUri"),
                                place_id=pid,
                                source_term=kw
                            )
                            results.append(result)

                        except Exception as e:
                            # Skip if details fetch fails
                            print(f"Failed to fetch details for {pid}: {e}")
                            continue

                    page_token = data.get("nextPageToken")
                    if not page_token:
                        break

                    # Rate limiting
                    import time
                    time.sleep(1.2)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

    return [result.dict() for result in results]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)