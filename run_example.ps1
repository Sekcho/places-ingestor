
# Activate venv (first time run: python -m venv .venv; pip install -r requirements.txt)
. .\.venv\Scripts\Activate.ps1
# Bangkok HORECA, 15km radius
python .\src\pipeline.py --term horeca --language th --region TH --center 13.7563,100.5018 --radius_m 15000 --out .\data\bkk_horeca.csv
