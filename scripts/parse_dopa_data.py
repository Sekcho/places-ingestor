#!/usr/bin/env python3
"""
Parse DOPA (Department of Provincial Administration) data
and convert to JSON format for web UI
"""
import pandas as pd
import json
from pathlib import Path
import random

def load_dopa_csv(csv_path):
    """Load and clean DOPA CSV data"""
    # Read CSV file
    df = pd.read_csv(csv_path, encoding='utf-8-sig')

    # Find the header row (contains "รหัสจังหวัด")
    header_row = None
    for i, row in df.iterrows():
        if str(row.iloc[0]).startswith('รหัสจังหวัด'):
            header_row = i
            break

    if header_row is None:
        raise ValueError("Could not find header row")

    # Re-read with proper header
    df = pd.read_csv(csv_path, skiprows=header_row+1, names=[
        'admin_code', 'name_th', 'name_en', 'dissolution_date'
    ], encoding='utf-8-sig')

    # Clean admin_code column (remove any whitespace)
    df['admin_code'] = df['admin_code'].astype(str).str.strip()

    # Convert dissolution_date to string and filter
    df['dissolution_date'] = df['dissolution_date'].astype(str).str.strip()

    # Filter only active records (dissolution_date = '0')
    df = df[df['dissolution_date'] == '0'].copy()

    print(f"Total records loaded: {len(df)}")
    print(f"Sample admin codes: {df['admin_code'].head(10).tolist()}")
    print(f"Admin code lengths: {df['admin_code'].str.len().value_counts().sort_index()}")

    return df

def extract_provinces(df):
    """Extract provinces data"""
    provinces = []
    province_codes = df['admin_code'].str[:2].unique()

    for prov_code in sorted(province_codes):
        # Find province record (8 zeros after province code)
        prov_record = df[df['admin_code'] == prov_code + '000000']
        if not prov_record.empty:
            provinces.append({
                'id': prov_code,
                'name_th': prov_record.iloc[0]['name_th'],
                'name_en': prov_record.iloc[0]['name_en']
            })

    return provinces

def extract_amphoes(df):
    """Extract amphoes data"""
    amphoes = []

    # Get amphoe records (4 zeros at the end)
    amphoe_records = df[df['admin_code'].str.endswith('0000') &
                       ~df['admin_code'].str.endswith('000000')]

    for _, record in amphoe_records.iterrows():
        admin_code = record['admin_code']
        province_id = admin_code[:2]
        amphoe_id = admin_code[:4]

        amphoes.append({
            'id': amphoe_id,
            'province_id': province_id,
            'name_th': record['name_th'],
            'name_en': record['name_en']
        })

    return amphoes

def generate_coordinates(base_lat, base_lng, offset_range=0.05):
    """Generate realistic coordinates with small random offset"""
    lat_offset = random.uniform(-offset_range, offset_range)
    lng_offset = random.uniform(-offset_range, offset_range)

    lat = base_lat + lat_offset
    lng = base_lng + lng_offset

    # Create bbox around center point
    bbox_size = 0.02
    bbox = [
        lat - bbox_size, lng - bbox_size,
        lat + bbox_size, lng + bbox_size
    ]

    return {'lat': round(lat, 6), 'lng': round(lng, 6)}, bbox

def get_province_base_coordinates(province_id):
    """Get approximate base coordinates for each province"""
    coords = {
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
        '39': (16.4419, 102.8359),  # Khon Kaen
        '40': (17.4138, 102.7870),  # Udon Thani
        '41': (17.4860, 101.7223),  # Loei
        '42': (17.8782, 102.7412),  # Nong Khai
        '43': (16.1851, 103.3058),  # Maha Sarakham
        '44': (16.0564, 103.6536),  # Roi Et
        '45': (16.4322, 103.5055),  # Kalasin
        '46': (17.1555, 104.1490),  # Sakon Nakhon
        '47': (17.4074, 104.7686),  # Nakhon Phanom
        '48': (16.5426, 104.7235),  # Mukdahan
        '49': (18.7904, 98.9847),   # Chiang Mai
        '50': (18.5742, 99.0079),   # Lamphun
        '51': (18.2932, 99.4936),   # Lampang
        '52': (17.6200, 100.0994),  # Uttaradit
        '53': (18.1459, 100.1410),  # Phrae
        '54': (18.7756, 100.7730),  # Nan
        '55': (19.1717, 99.8954),   # Phayao
        '56': (19.9105, 99.8406),   # Chiang Rai
        '57': (19.2952, 97.9647),   # Mae Hong Son
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
    return coords.get(province_id, (13.7563, 100.5018))  # Default to Bangkok

def extract_tambons(df):
    """Extract tambons data with coordinates"""
    tambons = []

    # Get tambon records (not ending with '0000' or '000000')
    tambon_records = df[
        ~(df['admin_code'].str.endswith('0000') | df['admin_code'].str.endswith('000000'))
    ]

    print(f"Found {len(tambon_records)} tambon records")
    if len(tambon_records) > 0:
        print("Sample tambon records:")
        print(tambon_records.head())

    for _, record in tambon_records.iterrows():
        admin_code = record['admin_code']
        province_id = admin_code[:2]
        amphoe_id = admin_code[:4]
        tambon_id = admin_code[:6]

        # Get base coordinates for province
        base_lat, base_lng = get_province_base_coordinates(province_id)
        center, bbox = generate_coordinates(base_lat, base_lng)

        tambons.append({
            'id': tambon_id,
            'amphoe_id': amphoe_id,
            'name_th': record['name_th'],
            'name_en': record['name_en'],
            'center': center,
            'bbox': bbox
        })

    return tambons

def main():
    """Main function to process DOPA data"""
    # Paths
    csv_path = Path("d:/2025/Report/Area code/ccaatt.csv")
    output_dir = Path("D:/places_ingestor_starter/admin_areas")

    print("Loading DOPA CSV data...")
    df = load_dopa_csv(csv_path)
    print(f"Loaded {len(df)} active records")

    print("Extracting provinces...")
    provinces = extract_provinces(df)
    print(f"Found {len(provinces)} provinces")

    print("Extracting amphoes...")
    amphoes = extract_amphoes(df)
    print(f"Found {len(amphoes)} amphoes")

    print("Extracting tambons...")
    tambons = extract_tambons(df)
    print(f"Found {len(tambons)} tambons")

    # Save to JSON files
    print("Saving provinces.json...")
    with open(output_dir / "provinces.json", 'w', encoding='utf-8') as f:
        json.dump(provinces, f, ensure_ascii=False, indent=2)

    print("Saving amphoes.json...")
    with open(output_dir / "amphoes.json", 'w', encoding='utf-8') as f:
        json.dump(amphoes, f, ensure_ascii=False, indent=2)

    print("Saving tambons.json...")
    with open(output_dir / "tambons.json", 'w', encoding='utf-8') as f:
        json.dump(tambons, f, ensure_ascii=False, indent=2)

    print("All files updated successfully!")
    print(f"- Provinces: {len(provinces)}")
    print(f"- Amphoes: {len(amphoes)}")
    print(f"- Tambons: {len(tambons)}")

if __name__ == "__main__":
    main()