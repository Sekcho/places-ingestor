import argparse, os, sys, json, time
from typing import Dict, List, Tuple, Optional
from pathlib import Path
from dotenv import load_dotenv
import pandas as pd
from tqdm import tqdm
import yaml
from places_client import search_text, get_place_details

def parse_center(s: str) -> Tuple[float, float]:
    lat, lng = s.split(",")
    return float(lat.strip()), float(lng.strip())

def parse_bbox(s: str) -> Tuple[float, float, float, float]:
    a, b, c, d = s.split(",")
    return float(a), float(b), float(c), float(d)

def load_terms(path: Path) -> Dict:
    import yaml
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def build_queries_for_term(term: str, mapping: Dict, language: str) -> Tuple[List[str], List[str]]:
    entry = mapping.get(term) or mapping.get(term.capitalize()) or mapping.get(term.lower())
    if not entry:
        entry = mapping.get("other", {"included_types": [], "keywords_th": [], "keywords_en": []})
    included_types = entry.get("included_types", []) or []
    if language.startswith("th"):
        kws = entry.get("keywords_th", []) or entry.get("keywords_en", [])
    else:
        kws = entry.get("keywords_en", []) or entry.get("keywords_th", [])
    return included_types, kws

def run(term: str, language: str, region: Optional[str], center: Optional[str], radius_m: Optional[int], bbox: Optional[str], out_csv: Path):
    load_dotenv()
    api_key = os.getenv("PLACES_API_KEY")
    if not api_key:
        raise RuntimeError("Missing PLACES_API_KEY (set in .env or environment)")
    terms_map = load_terms(Path(__file__).resolve().parent.parent / "config" / "terms.yaml")

    inc_types, keywords = build_queries_for_term(term, terms_map, language)
    if not keywords:
        keywords = [term]

    location_bias_circle = None
    location_restriction_rect = None
    if center and radius_m:
        lat, lng = parse_center(center)
        location_bias_circle = (lat, lng, int(radius_m))
    elif bbox:
        sw_lat, sw_lng, ne_lat, ne_lng = parse_bbox(bbox)
        location_restriction_rect = (sw_lat, sw_lng, ne_lat, ne_lng)

    seen_ids = set()
    rows_basic: List[Dict] = []
    inc_types_eff = inc_types if inc_types else [None]
    for itype in inc_types_eff:
        for kw in keywords:
            page_token = None
            while True:
                data = search_text(
                    api_key=api_key,
                    text_query=kw,
                    language_code=language,
                    region_code=region,
                    included_type=itype,
                    strict_type_filtering=True if itype else False,
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
                    display_name = (p.get("displayName") or {}).get("text")
                    loc = p.get("location") or {}
                    lat = loc.get("latitude")
                    lng = loc.get("longitude")
                    rows_basic.append({
                        "place_id": pid,
                        "resource_name": p.get("name"),
                        "name": display_name,
                        "formatted_address": p.get("formattedAddress"),
                        "lat": lat,
                        "lng": lng,
                        "types": "|".join(p.get("types", [])),
                        "google_maps_uri": p.get("googleMapsUri"),
                        "source_keyword": kw,
                        "included_type": itype or "",
                    })
                page_token = data.get("nextPageToken")
                if not page_token:
                    break
                time.sleep(1.2)

    df_basic = pd.DataFrame(rows_basic)
    if df_basic.empty:
        print("No results from Text Search. Exiting.")
        out_csv.parent.mkdir(parents=True, exist_ok=True)
        df_basic.to_csv(out_csv, index=False, encoding="utf-8-sig")
        return

    enriched_rows: List[Dict] = []
    for _, row in tqdm(df_basic.iterrows(), total=len(df_basic), desc="Fetching details"):
        pid = row["place_id"]
        details = get_place_details(api_key=api_key, place_name_or_id=pid, language_code=language)
        enriched_rows.append({
            **row,
            "website": details.get("websiteUri"),
            "phone_national": details.get("nationalPhoneNumber"),
            "phone_international": details.get("internationalPhoneNumber"),
            "formatted_address": details.get("formattedAddress") or row.get("formatted_address"),
            "lat": (details.get("location") or {}).get("latitude") or row.get("lat"),
            "lng": (details.get("location") or {}).get("longitude") or row.get("lng"),
            "types": "|".join(details.get("types", [])) or row.get("types"),
            "google_maps_uri": details.get("googleMapsUri") or row.get("google_maps_uri"),
        })

    df_out = pd.DataFrame(enriched_rows)
    columns = [
        "name", "formatted_address", "lat", "lng",
        "website", "phone_national", "phone_international",
        "types", "place_id", "resource_name", "google_maps_uri",
        "included_type", "source_keyword"
    ]
    for c in columns:
        if c not in df_out.columns:
            df_out[c] = None
    df_out = df_out[columns]

    out_csv.parent.mkdir(parents=True, exist_ok=True)
    df_out.to_csv(out_csv, index=False, encoding="utf-8-sig")
    print(f"Wrote {len(df_out):,} rows to {out_csv}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Harvest POIs from Google Places (v1) with Thai/English terms.")
    parser.add_argument("--term", required=True, help="horeca|minimart|hospital|restaurant|military|ร้านของชำ|โรงพยาบาล|ร้านอาหาร|ค่ายทหาร|other|<custom>")
    parser.add_argument("--language", default=os.getenv("DEFAULT_LANGUAGE", "th"), help="th or en (default: th)")
    parser.add_argument("--region", default=os.getenv("DEFAULT_REGION", "TH"), help="CLDR region e.g., TH")
    geog = parser.add_mutually_exclusive_group(required=True)
    geog.add_argument("--center", help="lat,lng (used with --radius_m)")
    geog.add_argument("--bbox", help="sw_lat,sw_lng,ne_lat,ne_lng (rectangle restriction)")
    parser.add_argument("--radius_m", type=int, help="Meters (required with --center)")
    parser.add_argument("--out", default=str(Path(__file__).resolve().parent.parent / "data" / "export.csv"), help="Output CSV path")
    args = parser.parse_args()
    if args.center and not args.radius_m:
        parser.error("--radius_m is required when using --center")
    run(
        term=args.term,
        language=args.language,
        region=args.region,
        center=args.center,
        radius_m=args.radius_m,
        bbox=args.bbox,
        out_csv=Path(args.out),
    )
