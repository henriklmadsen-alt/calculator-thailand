const TRAILING_SLASH_EXCEPTIONS = new Set(['/robots.txt', '/sitemap.xml', '/sitemap-0.xml', '/sitemap-index.xml']);

const STATIC_INDEX_PATHS = new Set([
  '/',
  '/about/',
  '/about/methodology/',
  '/affiliate-disclosure/',
  '/glossary/',
  '/glossary/apr/',
  '/ข้อมูลการเงิน-ประเทศไทย/',
  '/เกี่ยวกับ-kamnuanlek/',
  '/ข้อกำหนดการใช้งาน/',
  '/บทความ/',
  '/แผนผังเว็บไซต์/',
]);

const INDEXABLE_PREFIXES = [
  '/บทความ/',
  '/หมวดหมู่/',
  '/guides/',
  '/how-to/',
  '/comparisons/',
];

const EXCLUDED_PREFIXES = [
  '/admin/',
  '/api/',
  '/calculator/',
  '/downloads/',
  '/edge-cases/',
  '/embed/',
  '/go/',
  '/phase3-variants/',
];

const REDIRECT_SOURCE_PATHS = new Set([
  '/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวดและดอกเบี้ย/',
  '/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/',
  '/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/',
]);

const CANONICAL_REPLACEMENTS = new Map([
  ['/คำนวณดอกเบี้ยทบต้น/', '/คำนวณ-ดอกเบี้ยทบต้น/'],
  ['/คำนวณค่างวดบัตรเครดิต/', '/คำนวณดอกเบี้ยบัตรเครดิต/'],
  ['/คำนวณ-มูลค่าปัจจุบัน-present-value/', '/คำนวณมูลค่าปัจจุบัน/'],
  ['/คำนวณ-มูลค่าอนาคต-future-value/', '/คำนวณมูลค่าในอนาคต/'],
  ['/คำนวณ-klc0577-ค่าไฟฟ้า-mea/', '/คำนวณค่าไฟฟ้า/'],
  ['/คำนวณประกันtopup/', '/คำนวณประกัน-top-up/'],
  ['/คำนวณส่วนลดncd/', '/คำนวณส่วนลด-ncd/'],
]);

const EXACT_PREMIUM_CALCULATORS = new Set([
  '/คำนวณค่าไฟฟ้า/',
  '/คำนวณอายุ/',
  '/คำนวณภาษีมูลค่าเพิ่ม/',
  '/คำนวณค่าโอที/',
  '/คำนวณ-bmi/',
  '/คำนวณผ่อนรถ/',
  '/คำนวณผ่อนบ้าน/',
  '/คำนวณผ่อนกู้/',
  '/คำนวณเงินเดือนสุทธิ/',
  '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
  '/คำนวณภาษีเงินเดือนและประกันสังคม/',
  '/คำนวณประกันสังคม/',
  '/คำนวณประกันสังคมมาตรา39/',
  '/คำนวณประกันสังคมมาตรา40/',
  '/คำนวณดอกเบี้ยเงินฝาก/',
  '/คำนวณเปอร์เซ็นต์/',
  '/คำนวณภาษีที่ดิน/',
  '/คำนวณค่าภาษีรถยนต์/',
  '/คำนวณค่าจ้างรายวันเป็นรายเดือน/',
  '/คำนวณค่าเช่าร้าน/',
  '/คำนวณค่าห้องพัก/',
  '/คำนวณค่าน้ำ/',
  '/คำนวณค่าส่งพัสดุ/',
  '/คำนวณอัตราแลกเปลี่ยน/',
  '/คำนวณแปลงดอกเบี้ย-flat-effective/',
  '/คำนวณดอกเบี้ยบัตรเครดิต/',
  '/คำนวณผ่อนมือถือ/',
  '/คำนวณผ่อนสินเชื่อส่วนบุคคล/',
  '/คำนวณค่างวดสินเชื่อรถ/',
  '/คำนวณวงเงินกู้บ้าน/',
  '/คำนวณคุณสมบัติกู้บ้าน/',
  '/คำนวณเงินดาวน์/',
  '/คำนวณเงินเกษียณ/',
  '/คำนวณเงินสำรองฉุกเฉิน/',
  '/คำนวณงบประมาณ-50-30-20/',
  '/คำนวณกองทุนฉุกเฉิน-เติบโต/',
  '/คำนวณเป้าหมายการออม/',
  '/คำนวณเงินฝากประจำรายเดือน/',
  '/คำนวณประหยัดรีไฟแนนซ์บ้าน/',
  '/คำนวณโปะบ้าน/',
  '/คำนวณภาษีคืน-ภาษีจ่ายเพิ่ม/',
  '/คำนวณลดหย่อน-SSF-RMF/',
  '/คำนวณลดหย่อนดอกเบี้ยบ้าน/',
  '/คำนวณลดหย่อนประกันชีวิต/',
  '/คำนวณเบี้ยประกันรถยนต์/',
  '/คำนวณเบี้ยประกันสุขภาพ/',
  '/คำนวณเบี้ยประกันชีวิต/',
  '/คำนวณเบี้ยประกันบ้าน/',
  '/คำนวณเบี้ยประกันการเดินทาง/',
  '/คำนวณทุนประกันชีวิต/',
  '/คำนวณเปรียบเทียบสินเชื่อ/',
  '/คำนวณเปรียบเทียบบัตรเครดิต/',
  '/คำนวณเปรียบเทียบซื้อรถ-vs-เช่า/',
  '/คำนวณเปรียบเทียบฟรีแลนซ์กับพนักงานประจำ/',
  '/คำนวณดอกเบี้ยทบต้น/',
  '/คำนวณมูลค่าปัจจุบัน/',
  '/คำนวณมูลค่าในอนาคต/',
  '/คำนวณ-dca-เฉลี่ยต้นทุน/',
  '/คำนวณ-npv-มูลค่าปัจจุบันสุทธิ/',
  '/คำนวณ-irr-อัตราผลตอบแทนภายใน/',
  '/คำนวณ-cagr-อัตราเติบโตทบต้นรายปี/',
]);

const CRITICAL_KEYWORDS = [
  'ค่าไฟฟ้า',
  'ค่าไฟ',
  'อายุ',
  'ภาษีมูลค่าเพิ่ม',
  'vat',
  'โอที',
  'bmi',
  'ผ่อนรถ',
  'ผ่อนบ้าน',
  'ผ่อนกู้',
  'สินเชื่อรถ',
  'สินเชื่อบ้าน',
  'เงินเดือนสุทธิ',
  'ประกันสังคม',
  'ภาษีเงินได้',
  'ภาษีที่ดิน',
  'ดอกเบี้ยเงินฝาก',
  'เปอร์เซ็นต์',
];

const STRONG_KEYWORDS = [
  'บัตรเครดิต',
  'ดอกเบี้ยบัตรเครดิต',
  'ค่าน้ำ',
  'ค่าส่งพัสดุ',
  'ค่าห้องพัก',
  'ค่าเช่าร้าน',
  'ค่าแรง',
  'ค่าจ้าง',
  'เงินเกษียณ',
  'กองทุนฉุกเฉิน',
  'เงินสำรองฉุกเฉิน',
  'เงินดาวน์',
  'วงเงินกู้',
  'ลดหย่อน',
  'รีไฟแนนซ์',
  'ประกันรถยนต์',
  'ประกันสุขภาพ',
  'ประกันชีวิต',
  'อัตราแลกเปลี่ยน',
  'แปลงหน่วย',
  'ดอกเบี้ยทบต้น',
];

const MODERATE_KEYWORDS = [
  'dca',
  'npv',
  'irr',
  'cagr',
  'apr',
  'roi',
  'wacc',
  'ภาษีนิติบุคคล',
  'ภาษีธุรกิจ',
  'ภาษีรถยนต์',
  'ภาษีนำเข้า',
  'หัก-ณ-ที่จ่าย',
  'รายได้ฟรีแลนซ์',
  'งบประมาณ',
  'เป้าหมายการออม',
  'เงินฝากประจำ',
  'กู้บ้าน',
  'กู้เงินทุนบ้าน',
  'ผ่อนสินเชื่อ',
  'ประกันภัย',
  'เบี้ยประกัน',
  'ประกัน-top-up',
  'ทุนประกัน',
  'หนี้',
  'snowball',
  'avalanche',
];

const LOW_VALUE_HINTS = [
  'nail',
  'hair',
  'spa',
  'makeup',
  'salon',
  'fashion',
  'tailoring',
  'massage',
  'wellness',
  'event',
  'wedding',
  'flower',
  'decoration',
  'pet',
  'กีฬา',
  'งานอดิเรก',
  'อื่นๆ',
  'ทั่วไป',
  'ค่าว่างแบบ',
  'ลบเลื่อ',
];

export function normalizePolicyPath(input) {
  if (!input) return '/';
  let raw = String(input);
  try {
    raw = new URL(raw, 'https://www.kamnuanlek.com').pathname;
  } catch {
    raw = raw.split('?')[0].split('#')[0];
  }
  try {
    raw = decodeURIComponent(raw);
  } catch {}
  if (!raw.startsWith('/')) raw = `/${raw}`;
  if (TRAILING_SLASH_EXCEPTIONS.has(raw)) return raw;
  return raw.endsWith('/') ? raw : `${raw}/`;
}

function startsWithAny(pathname, prefixes) {
  return prefixes.some((prefix) => pathname.startsWith(prefix));
}

function containsAny(pathname, terms) {
  const lower = pathname.toLocaleLowerCase('th-TH');
  return terms.some((term) => lower.includes(term.toLocaleLowerCase('th-TH')));
}

function scoreCalculator(pathname) {
  if (!pathname.startsWith('/คำนวณ')) return 0;
  if (EXACT_PREMIUM_CALCULATORS.has(pathname)) return 120;

  let score = 18;
  const lower = pathname.toLocaleLowerCase('th-TH');
  if (lower.includes('klc')) score -= 24;
  if (/[a-z]/i.test(pathname) && !containsAny(pathname, ['bmi', 'vat', 'apr', 'dca', 'npv', 'irr', 'roi', 'cagr', 'wacc'])) {
    score -= 10;
  }
  if (containsAny(pathname, CRITICAL_KEYWORDS)) score += 58;
  if (containsAny(pathname, STRONG_KEYWORDS)) score += 38;
  if (containsAny(pathname, MODERATE_KEYWORDS)) score += 22;
  if (containsAny(pathname, LOW_VALUE_HINTS)) score -= 42;
  if (lower.includes('ประกัน') || lower.includes('สินเชื่อ')) score += 16;
  if (lower.includes('ภาษี') || lower.includes('เงินเดือน')) score += 14;
  if (lower.includes('ค่าไฟ') || lower.includes('ไฟฟ้า')) score += 18;
  return score;
}

export function getIndexPolicyForPath(input) {
  const pathname = normalizePolicyPath(input);

  if (REDIRECT_SOURCE_PATHS.has(pathname)) {
    return {
      path: pathname,
      index: false,
      robots: 'noindex, follow, noarchive',
      priority: null,
      reason: 'redirect_source',
    };
  }

  const canonicalPath = CANONICAL_REPLACEMENTS.get(pathname);
  if (canonicalPath) {
    return {
      path: pathname,
      index: false,
      robots: 'noindex, follow, noarchive',
      canonicalPath,
      priority: null,
      reason: 'canonical_duplicate',
    };
  }

  if (startsWithAny(pathname, EXCLUDED_PREFIXES)) {
    return {
      path: pathname,
      index: false,
      robots: 'noindex, follow, noarchive',
      priority: null,
      reason: 'excluded_utility_path',
    };
  }

  if (STATIC_INDEX_PATHS.has(pathname)) {
    return {
      path: pathname,
      index: true,
      robots: 'index, follow',
      priority: pathname === '/' ? 1.0 : 0.7,
      reason: 'static_trust_or_hub_page',
    };
  }

  if (startsWithAny(pathname, INDEXABLE_PREFIXES)) {
    return {
      path: pathname,
      index: true,
      robots: 'index, follow',
      priority: pathname.startsWith('/บทความ/') ? 0.75 : 0.8,
      reason: 'quality_content_or_hub_prefix',
    };
  }

  const calculatorScore = scoreCalculator(pathname);
  if (calculatorScore >= 55) {
    return {
      path: pathname,
      index: true,
      robots: 'index, follow',
      priority: calculatorScore >= 100 ? 0.95 : 0.85,
      score: calculatorScore,
      reason: 'premium_calculator',
    };
  }

  return {
    path: pathname,
    index: false,
    robots: 'noindex, follow, noarchive',
    priority: null,
    score: calculatorScore,
    reason: pathname.startsWith('/คำนวณ') ? 'niche_or_thin_calculator' : 'not_in_index_core',
  };
}

export function getIndexPolicyForUrl(url) {
  return getIndexPolicyForPath(url);
}

export function isIndexablePath(input) {
  return getIndexPolicyForPath(input).index;
}

export function getCanonicalPathForPath(input) {
  return getIndexPolicyForPath(input).canonicalPath || normalizePolicyPath(input);
}

export function getIndexPolicySummary(paths) {
  const rows = paths.map((path) => getIndexPolicyForPath(path));
  const byReason = rows.reduce((acc, row) => {
    acc[row.reason] = (acc[row.reason] || 0) + 1;
    return acc;
  }, {});
  return {
    total: rows.length,
    indexable: rows.filter((row) => row.index).length,
    nonIndexable: rows.filter((row) => !row.index).length,
    byReason,
  };
}
