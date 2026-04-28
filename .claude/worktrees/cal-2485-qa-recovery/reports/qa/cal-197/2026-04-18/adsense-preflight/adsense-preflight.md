# AdSense Launch Preflight

Base URL: https://www.kamnuanlek.com
Generated at: 2026-04-18T17:33:29

Passed: 7
Failed: 2

## Checks

- [PASS] (high) ads.txt status 200 - status=200 url=https://www.kamnuanlek.com/ads.txt
- [PASS] (high) ads.txt publisher line present - expected='google.com, pub-5753152813183301, DIRECT, f08c47fec0942fa0'
- [PASS] (medium) robots.txt status 200 - status=200 url=https://www.kamnuanlek.com/robots.txt
- [PASS] (high) robots allow root crawl - allow_root=True disallow_all=False
- [PASS] (high) robots sitemap host matches custom domain - hosts=www.kamnuanlek.com
- [PASS] (high) representative routes return 200 - routes=/คำนวณค่าไฟฟ้า/, /คำนวณดอกเบี้ยบัตรเครดิต/, /คำนวณผ่อนรถ/
- [FAIL] (high) AdSense client token present in representative HTML - expected_client=ca-pub-5753152813183301
- [FAIL] (high) representative routes contain ad script/slot behavior - requires ads script + ins/slot markers
- [PASS] (high) canonical host uses custom domain - expected_host=www.kamnuanlek.com

## Representative route evidence

- /คำนวณค่าไฟฟ้า/: status=200, canonical_host=www.kamnuanlek.com, ads_script=False, ads_ins=False, slot_attrs=0, expected_client=False
- /คำนวณดอกเบี้ยบัตรเครดิต/: status=200, canonical_host=www.kamnuanlek.com, ads_script=False, ads_ins=False, slot_attrs=0, expected_client=False
- /คำนวณผ่อนรถ/: status=200, canonical_host=www.kamnuanlek.com, ads_script=False, ads_ins=False, slot_attrs=0, expected_client=False

