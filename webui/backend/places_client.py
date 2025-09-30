import requests
from typing import Dict, Any, Optional, Tuple
from tenacity import retry, stop_after_attempt, wait_exponential_jitter, retry_if_exception_type

PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"
PLACES_DETAILS_URL_TMPL = "https://places.googleapis.com/v1/places/{place_id}"  # place_id is bare like 'ChIJ...'

class PlacesError(Exception):
    pass

def _headers(api_key: str, field_mask: str) -> Dict[str, str]:
    return {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": field_mask,
    }

@retry(reraise=True, stop=stop_after_attempt(5), wait=wait_exponential_jitter(initial=1, max=10), retry=retry_if_exception_type((requests.RequestException, PlacesError)))
def search_text(
    api_key: str,
    text_query: str,
    language_code: str = "th",
    region_code: Optional[str] = None,
    included_type: Optional[str] = None,
    strict_type_filtering: bool = False,
    location_bias_circle: Optional[Tuple[float, float, int]] = None,  # (lat, lng, radius_m)
    location_restriction_rect: Optional[Tuple[float, float, float, float]] = None,  # (sw_lat, sw_lng, ne_lat, ne_lng)
    page_token: Optional[str] = None,
    page_size: int = 20,
    include_pure_service_area_businesses: bool = False,
) -> Dict[str, Any]:
    """
    Call Places Text Search (v1). Returns the JSON dict body.
    """
    body: Dict[str, Any] = {
        "textQuery": text_query,
        "languageCode": language_code,
        "pageSize": min(max(page_size, 1), 20),  # Google Places API hard limit is 20
        "includePureServiceAreaBusinesses": include_pure_service_area_businesses,
    }
    if region_code:
        body["regionCode"] = region_code
    if included_type:
        body["includedType"] = included_type
        if strict_type_filtering:
            body["strictTypeFiltering"] = True
    if location_bias_circle and location_restriction_rect:
        raise ValueError("Cannot set both locationBias and locationRestriction")
    if location_bias_circle:
        lat, lng, radius = location_bias_circle
        body["locationBias"] = {"circle": {"center": {"latitude": lat, "longitude": lng}, "radius": int(radius)}}
    if location_restriction_rect:
        if isinstance(location_restriction_rect, dict):
            # Already in correct format from main.py
            body["locationRestriction"] = {"rectangle": location_restriction_rect}
        else:
            # Legacy tuple format (sw_lat, sw_lng, ne_lat, ne_lng)
            sw_lat, sw_lng, ne_lat, ne_lng = location_restriction_rect
            body["locationRestriction"] = {"rectangle": {"low": {"latitude": sw_lat, "longitude": sw_lng}, "high": {"latitude": ne_lat, "longitude": ne_lng}}}
    if page_token:
        body["pageToken"] = page_token

    # For Text Search responses, field mask paths start with "places."
    field_mask = ",".join([
        "places.name",
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.location",
        "places.types",
        "places.googleMapsUri",
    ])
    resp = requests.post(PLACES_TEXT_SEARCH_URL, headers=_headers(api_key, field_mask), json=body, timeout=30)
    if resp.status_code >= 400:
        raise PlacesError(f"TextSearch HTTP {resp.status_code}: {resp.text}")
    return resp.json()

@retry(reraise=True, stop=stop_after_attempt(5), wait=wait_exponential_jitter(initial=1, max=10), retry=retry_if_exception_type((requests.RequestException, PlacesError)))
def get_place_details(
    api_key: str,
    place_name_or_id: str,
    language_code: str = "th",
) -> Dict[str, Any]:
    """
    Call Places Details (v1) for a single place by place_id (bare like 'ChIJ...') or 'places/ChIJ...'.
    """
    # Place Details field mask uses top-level fields (no "places.")
    field_mask = ",".join([
        "name",
        "id",
        "displayName",
        "formattedAddress",
        "location",
        "websiteUri",
        "nationalPhoneNumber",
        "internationalPhoneNumber",
        "types",
        "googleMapsUri",
    ])
    pid = place_name_or_id.split("/")[-1]  # normalize
    url = PLACES_DETAILS_URL_TMPL.format(place_id=pid)
    params = {"languageCode": language_code}
    resp = requests.get(url, headers=_headers(api_key, field_mask), params=params, timeout=30)
    if resp.status_code >= 400:
        raise PlacesError(f"PlaceDetails HTTP {resp.status_code}: {resp.text}")
    return resp.json()
