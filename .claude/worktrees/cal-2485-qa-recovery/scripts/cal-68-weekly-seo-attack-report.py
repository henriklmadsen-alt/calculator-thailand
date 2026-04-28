#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from html import unescape
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote, unquote, urljoin
from urllib.request import Request, urlopen
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
PAGES_ROOT = ROOT / 'src' / 'pages'
CUSTOM_DOMAIN = 'https://www.kamnuanlek.com'
RAILWAY_DOMAIN = 'https://calculator-thailand-production.up.railway.app'
REPORT_PATH = ROOT / 'reports' / 'cal-68-weekly-seo-attack-report-latest.md'
JSON_PATH = ROOT / 'reports' / 'cal-68-weekly-seo-attack-report-latest.json'
USER_AGENT = 'Mozilla/5.0 (compatible; CAL-68 SEO heartbeat bot)'

NS = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}

@dataclass
class Cluster:
    calculator_route: str
    calculator_keyword_th: str
    calculator_keyword_en: str
    article_route: str | None
    article_keyword_th: str | None
    article_keyword_en: str | None
    business_value: int
    intent_score: int
    ai_surface_score: int
    notes: str


CLUSTERS: list[Cluster] = [
    Cluster('/คำนวณภาษีเงินได้บุคคลธรรมดา/', 'คำนวณภาษีเงินได้', 'thai income tax calculator', '/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/', 'ภาษีเงินได้ 2569', 'income tax deductions thailand', 10, 10, 8, 'Highest commercial intent; directly tied to salary, compliance, and annual search demand spikes.'),
    Cluster('/คำนวณเงินเดือนสุทธิ/', 'คํานวณเงินเดือนสุทธิ', 'net salary calculator thailand', '/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/', 'เงินเดือนสุทธิ 2569', 'net salary after tax thailand', 10, 10, 8, 'Strong everyday utility + monetizable employment audience.'),
    Cluster('/คำนวณผ่อนบ้าน/', 'คํานวณผ่อนบ้าน', 'mortgage calculator thailand', '/บทความ/รีไฟแนนซ์บ้าน-2569-คุ้มไหม-ดอกเบี้ยใหม่ต้องลดเท่าไร/', 'รีไฟแนนซ์บ้าน 2569', 'refinance mortgage thailand', 10, 9, 8, 'High RPM finance cluster; adjacent refinance article already exists.'),
    Cluster('/คำนวณค่าโอนบ้าน/', 'คํานวณค่าโอนบ้าน', 'property transfer fee calculator thailand', '/บทความ/ค่าโอนบ้าน-2569-มีอะไรบ้าง-คำนวณอย่างไร/', 'ค่าโอนบ้าน 2569', 'property transfer fees thailand', 10, 10, 9, 'High-value purchase intent and currently broken on live site.'),
    Cluster('/คำนวณดอกเบี้ยบัตรเครดิต/', 'คํานวณดอกเบี้ยบัตรเครดิต', 'credit card interest calculator thailand', '/บทความ/ดอกเบี้ยบัตรเครดิต-คิดยังไง-จ่ายขั้นต่ำ-2569/', 'ดอกเบี้ยบัตรเครดิต คิดยังไง', 'credit card minimum payment thailand', 9, 10, 8, 'High CPC finance cluster with strong AI-answer potential.'),
    Cluster('/คำนวณผ่อนรถ/', 'คํานวณผ่อนรถ', 'car loan calculator thailand', '/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/', 'ค่างวดรถยนต์ 2569', 'car installment calculator thailand', 9, 9, 7, 'Commercial intent and lead-generation adjacency.'),
    Cluster('/คำนวณค่าโอที/', 'คํานวณโอที', 'overtime calculator thailand', '/บทความ/คำนวณค่าโอที-2569-กฎหมายแรงงาน/', 'โอที 2569', 'overtime law thailand', 8, 9, 8, 'Broad labor-intent reach; currently has live slug drift symptoms.'),
    Cluster('/คำนวณอัตราแลกเปลี่ยน/', 'คํานวณอัตราแลกเปลี่ยน', 'exchange rate calculator thailand', '/บทความ/คำนวณอัตราแลกเปลี่ยน-บาท-สกุลเงิน-2569/', 'อัตราแลกเปลี่ยน บาท 2569', 'baht exchange rate calculator', 8, 9, 9, 'Good AI-answer surface + travel/finance utility.'),
    Cluster('/คำนวณภาษีมูลค่าเพิ่ม/', 'คํานวณ VAT', 'vat calculator thailand', '/บทความ/ภาษีมูลค่าเพิ่ม-7-คิดยังไง-สูตรบวกภาษี-ถอดภาษี-ตั้งราคาขายให้ไม่ขาดทุน/', 'VAT 7% คิดยังไง', 'vat 7 calculation thailand', 8, 9, 8, 'Strong SMB intent and repeat usage.'),
    Cluster('/คำนวณดอกเบี้ยเงินฝาก/', 'คํานวณดอกเบี้ยเงินฝาก', 'deposit interest calculator thailand', '/บทความ/เงินฝาก-vs-กองทุน-เปรียบเทียบ-2569/', 'เงินฝาก vs กองทุน', 'deposit vs fund thailand', 7, 8, 7, 'Useful trust-building finance cluster.'),
    Cluster('/คำนวณค่าไฟฟ้า/', 'คํานวณค่าไฟฟ้า', 'electricity bill calculator thailand', '/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/', 'ค่าไฟฟ้า 2569', 'electricity bill formula thailand', 7, 8, 8, 'Everyday utility + strong snippet/FAQ opportunities.'),
    Cluster('/คำนวณเปอร์เซ็นต์/', 'คํานวณเปอร์เซ็นต์', 'percentage calculator', '/บทความ/คำนวณเปอร์เซ็นต์-2569-สูตรลัด-ส่วนลด-กำไร/', 'สูตรเปอร์เซ็นต์ ส่วนลด กำไร', 'percentage discount formula', 7, 8, 8, 'Very broad top-of-funnel utility with AI-answer potential.'),
    Cluster('/คำนวณอายุ/', 'คํานวณอายุ', 'age calculator', '/บทความ/คำนวณอายุ-2569-นับอายุจากวันเกิด-แบบละเอียด/', 'นับอายุจากวันเกิด', 'age from date of birth', 6, 8, 7, 'Broad utility cluster; should convert well from SERP snippets and AI summaries.'),
]


def fetch(url: str, method: str = 'GET') -> tuple[int, dict[str, str], str]:
    request = Request(url, headers={'User-Agent': USER_AGENT}, method=method)
    try:
        with urlopen(request, timeout=25) as response:
            body = response.read().decode('utf-8', errors='replace')
            return response.status, dict(response.headers.items()), body
    except HTTPError as exc:
        body = exc.read().decode('utf-8', errors='replace')
        return exc.code, dict(exc.headers.items()), body
    except URLError as exc:
        return 0, {}, f'URL error: {exc}'


def extract_title(html: str) -> str | None:
    match = re.search(r'<title>(.*?)</title>', html, re.I | re.S)
    return unescape(re.sub(r'\s+', ' ', match.group(1))).strip() if match else None


def extract_canonical(html: str) -> str | None:
    match = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']', html, re.I)
    return unescape(match.group(1)).strip() if match else None


def extract_meta_description(html: str) -> str | None:
    match = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
    return unescape(match.group(1)).strip() if match else None


def detect_schema(html: str, needle: str) -> bool:
    return needle.lower() in html.lower()


def route_in_sitemap(route: str, sitemap_routes: set[str]) -> bool:
    return route in sitemap_routes


def collect_sitemap_routes() -> set[str]:
    routes: set[str] = set()
    status, _, index_body = fetch(urljoin(CUSTOM_DOMAIN, '/sitemap-index.xml'))
    if status != 200:
        return routes
    root = ET.fromstring(index_body)
    sitemap_urls = [loc.text.strip() for loc in root.findall('.//sm:loc', NS) if loc.text]
    for sitemap_url in sitemap_urls:
        s_status, _, sitemap_body = fetch(sitemap_url)
        if s_status != 200:
            continue
        s_root = ET.fromstring(sitemap_body)
        for loc in s_root.findall('.//sm:loc', NS):
            if not loc.text:
                continue
            text = loc.text.strip()
            if text.startswith(CUSTOM_DOMAIN):
                route = text[len(CUSTOM_DOMAIN):]
            else:
                route = re.sub(r'^https?://[^/]+', '', text)
            route = unquote(route or '/')
            routes.add(route or '/')
    return routes


def title_risk(title: str | None) -> str:
    if not title:
        return 'missing'
    n = len(title)
    if n > 65:
        return 'long'
    if n < 35:
        return 'short'
    return 'ok'


def encode_route(route: str) -> str:
    return quote(route, safe='/%-._~')


def live_snapshot(route: str) -> dict:
    encoded_route = encode_route(route)
    custom_status, custom_headers, custom_body = fetch(urljoin(CUSTOM_DOMAIN, encoded_route))
    railway_status, _, railway_body = fetch(urljoin(RAILWAY_DOMAIN, encoded_route))
    html = custom_body if custom_status else railway_body
    canonical = extract_canonical(html)
    title = extract_title(html)
    description = extract_meta_description(html)
    faq = detect_schema(html, 'FAQPage')
    breadcrumb = detect_schema(html, 'BreadcrumbList')
    article_schema = detect_schema(html, '"@type":"Article"') or detect_schema(html, '"@type": "Article"')
    return {
        'route': route,
        'custom_status': custom_status,
        'railway_status': railway_status,
        'canonical': canonical,
        'title': title,
        'title_risk': title_risk(title),
        'description_present': bool(description),
        'faq_schema': faq,
        'breadcrumb_schema': breadcrumb,
        'article_schema': article_schema,
        'railway_origin_canonical': canonical.startswith(RAILWAY_DOMAIN) if canonical else False,
    }


def calculate_priority(cluster: Cluster, calc: dict, article: dict | None, in_sitemap_calc: bool, in_sitemap_article: bool | None) -> int:
    priority = cluster.business_value * 5 + cluster.intent_score * 3 + cluster.ai_surface_score * 2
    if calc['custom_status'] != 200:
        priority += 30
    if article and article['custom_status'] != 200:
        priority += 20
    if calc['railway_origin_canonical']:
        priority += 12
    if article and article['railway_origin_canonical']:
        priority += 8
    if not in_sitemap_calc:
        priority += 15
    if article and in_sitemap_article is False:
        priority += 10
    if calc['title_risk'] == 'long':
        priority += 3
    if article and article['title_risk'] == 'long':
        priority += 2
    return priority


def summarize_action(calc: dict, article: dict | None, in_sitemap_calc: bool, in_sitemap_article: bool | None) -> str:
    actions = []
    if calc['custom_status'] != 200:
        actions.append('restore calculator route to 200')
    if article and article['custom_status'] != 200:
        actions.append('restore article route to 200')
    if calc['railway_origin_canonical'] or (article and article['railway_origin_canonical']):
        actions.append('switch canonical host to www.kamnuanlek.com')
    if not in_sitemap_calc or (article and in_sitemap_article is False):
        actions.append('reconcile sitemap with published slugs')
    if calc['title_risk'] == 'long' or (article and article['title_risk'] == 'long'):
        actions.append('tighten title length for CTR')
    if not actions:
        actions.append('expand FAQs and internal-link anchors for ranking lift')
    return '; '.join(actions)


def main() -> None:
    generated_at = datetime.now(timezone.utc).isoformat()
    sitemap_routes = collect_sitemap_routes()
    results = []

    for cluster in CLUSTERS:
        calc = live_snapshot(cluster.calculator_route)
        article = live_snapshot(cluster.article_route) if cluster.article_route else None
        in_sitemap_calc = route_in_sitemap(cluster.calculator_route, sitemap_routes)
        in_sitemap_article = route_in_sitemap(cluster.article_route, sitemap_routes) if cluster.article_route else None
        priority = calculate_priority(cluster, calc, article, in_sitemap_calc, in_sitemap_article)
        results.append({
            'cluster': cluster,
            'calculator': calc,
            'article': article,
            'in_sitemap_calculator': in_sitemap_calc,
            'in_sitemap_article': in_sitemap_article,
            'priority_score': priority,
            'recommended_action': summarize_action(calc, article, in_sitemap_calc, in_sitemap_article),
        })

    results.sort(key=lambda item: item['priority_score'], reverse=True)

    winners = []
    losers = []
    for item in results:
        calc = item['calculator']
        article = item['article']
        if calc['custom_status'] == 200 and item['in_sitemap_calculator'] and not calc['railway_origin_canonical']:
            winners.append(item)
        if calc['custom_status'] != 200 or not item['in_sitemap_calculator'] or calc['railway_origin_canonical']:
            losers.append(item)

    lines = []
    lines.append('# CAL-68 Weekly SEO Attack Report')
    lines.append('')
    lines.append(f'- Generated at (UTC): {generated_at}')
    lines.append(f'- Live audit hosts: `{CUSTOM_DOMAIN}` and `{RAILWAY_DOMAIN}`')
    lines.append(f'- Live sitemap routes discovered: `{len(sitemap_routes)}`')
    lines.append('- Ranking note: GSC/watchlist inputs are still unavailable, so this cycle uses live indexation/readiness signals as the movement proxy.')
    lines.append('')
    lines.append('## Executive Summary')
    lines.append('')
    top = results[:5]
    for item in top:
        c: Cluster = item['cluster']
        calc = item['calculator']
        article = item['article']
        lines.append(f"- `{c.calculator_keyword_th}`: priority `{item['priority_score']}`; calc `{calc['custom_status']}`; article `{article['custom_status'] if article else 'n/a'}`; sitemap calc `{item['in_sitemap_calculator']}`; action: {item['recommended_action']}.")
    lines.append('')
    lines.append('## Prioritized Keyword Universe')
    lines.append('')
    lines.append('| Priority | Cluster | Primary keyword (TH) | Secondary keyword (EN) | Business | Intent | AI surface | Calculator | Article | Sitemap calc | Sitemap article | Priority score |')
    lines.append('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |')
    for idx, item in enumerate(results, start=1):
        c: Cluster = item['cluster']
        article = item['article']
        lines.append(
            f"| {idx} | {c.calculator_route} | {c.calculator_keyword_th} | {c.calculator_keyword_en} | {c.business_value}/10 | {c.intent_score}/10 | {c.ai_surface_score}/10 | {item['calculator']['custom_status']} | {article['custom_status'] if article else 'n/a'} | {'yes' if item['in_sitemap_calculator'] else 'no'} | {'yes' if item['in_sitemap_article'] else ('n/a' if c.article_route is None else 'no')} | {item['priority_score']} |"
        )
    lines.append('')
    lines.append('## Weekly Attack List')
    lines.append('')
    for idx, item in enumerate(results[:7], start=1):
        c: Cluster = item['cluster']
        lines.append(f"{idx}. {c.calculator_keyword_th} / {c.calculator_keyword_en}")
        lines.append(f"   - Calculator route: `{c.calculator_route}`")
        if c.article_route:
            lines.append(f"   - Article route: `{c.article_route}`")
        lines.append(f"   - Why now: {c.notes}")
        lines.append(f"   - Fix next: {item['recommended_action']}")
    lines.append('')
    lines.append('## Winners / Losers (Movement Proxy)')
    lines.append('')
    lines.append('### Winners')
    if winners:
        for item in winners[:3]:
            c: Cluster = item['cluster']
            lines.append(f"- `{c.calculator_keyword_th}`: live 200, in sitemap, canonical aligned.")
    else:
        lines.append('- No true winners yet; canonical-host drift blocks a clean SEO pass on most high-value routes.')
    lines.append('')
    lines.append('### Losers')
    for item in losers[:6]:
        c: Cluster = item['cluster']
        calc = item['calculator']
        article = item['article']
        reasons = []
        if calc['custom_status'] != 200:
            reasons.append(f"calculator {calc['custom_status']}")
        if article and article['custom_status'] != 200:
            reasons.append(f"article {article['custom_status']}")
        if calc['railway_origin_canonical']:
            reasons.append('calculator canonical -> Railway')
        if article and article['railway_origin_canonical']:
            reasons.append('article canonical -> Railway')
        if not item['in_sitemap_calculator']:
            reasons.append('calculator missing from sitemap')
        if article and item['in_sitemap_article'] is False:
            reasons.append('article missing from sitemap')
        lines.append(f"- `{c.calculator_keyword_th}`: {', '.join(reasons)}.")
    lines.append('')
    lines.append('## Route-Level Evidence')
    lines.append('')
    lines.append('| Keyword | Calculator status | Article status | Calc canonical | Article canonical | Title risk | FAQ/Breadcrumb | Recommended action |')
    lines.append('| --- | --- | --- | --- | --- | --- | --- | --- |')
    for item in results:
        c: Cluster = item['cluster']
        calc = item['calculator']
        article = item['article']
        faq_breadcrumb = f"calc FAQ={'yes' if calc['faq_schema'] else 'no'}, crumb={'yes' if calc['breadcrumb_schema'] else 'no'}"
        if article:
            faq_breadcrumb += f"; article FAQ={'yes' if article['faq_schema'] else 'no'}, crumb={'yes' if article['breadcrumb_schema'] else 'no'}"
        lines.append(
            f"| {c.calculator_keyword_th} | {calc['custom_status']} | {article['custom_status'] if article else 'n/a'} | {calc['canonical'] or 'missing'} | {article['canonical'] if article else 'n/a'} | {calc['title_risk']}/{article['title_risk'] if article else 'n/a'} | {faq_breadcrumb} | {item['recommended_action']} |"
        )
    lines.append('')
    lines.append('## Suggested Cross-Functional Requests')
    lines.append('')
    lines.append('1. CTO: align canonical host to `https://www.kamnuanlek.com` across all live pages and regenerate sitemap from the same host/source-of-truth.')
    lines.append('2. CTO: restore broken transfer-fee cluster routes (`/คำนวณค่าโอนบ้าน/` + supporting article) before next crawl window.')
    lines.append('3. CMO/SEO: once host + sitemap parity are fixed, submit recrawl for transfer-fee, OT, electricity, age, and percent clusters and refresh title/FAQ copy where noted.')
    lines.append('4. Ops: provide GSC query/page exports or restore first-party API ingestion so next cycle can report actual ranking movement instead of readiness proxies.')

    REPORT_PATH.write_text('\n'.join(lines) + '\n', encoding='utf-8')

    json_payload = {
        'generated_at': generated_at,
        'custom_domain': CUSTOM_DOMAIN,
        'railway_domain': RAILWAY_DOMAIN,
        'live_sitemap_route_count': len(sitemap_routes),
        'results': [
            {
                'cluster': item['cluster'].__dict__,
                'calculator': item['calculator'],
                'article': item['article'],
                'in_sitemap_calculator': item['in_sitemap_calculator'],
                'in_sitemap_article': item['in_sitemap_article'],
                'priority_score': item['priority_score'],
                'recommended_action': item['recommended_action'],
            }
            for item in results
        ],
    }
    JSON_PATH.write_text(json.dumps(json_payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(REPORT_PATH)
    print(JSON_PATH)


if __name__ == '__main__':
    main()
