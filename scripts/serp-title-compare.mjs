#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'reports', 'seo');
const USER_AGENT = 'Kamnuanlek-SERP-Title-Compare/1.0 (+https://www.kamnuanlek.com)';

const OUR_PAGES = [
  { topic: 'electricity', url: 'https://www.kamnuanlek.com/คำนวณค่าไฟฟ้า/' },
  { topic: 'vat', url: 'https://www.kamnuanlek.com/คำนวณภาษีมูลค่าเพิ่ม/' },
  { topic: 'age', url: 'https://www.kamnuanlek.com/คำนวณอายุ/' },
  { topic: 'car-loan', url: 'https://www.kamnuanlek.com/คำนวณผ่อนรถ/' },
  { topic: 'home-loan', url: 'https://www.kamnuanlek.com/คำนวณผ่อนบ้าน/' },
];

const COMPETITOR_PAGES = [
  {
    topic: 'electricity',
    competitor: 'LIFESARA',
    url: 'https://life-sara.com/electricity-calculator',
    serpBasis: 'Current Thai SERP check for "คำนวณค่าไฟฟ้า"',
  },
  {
    topic: 'vat',
    competitor: 'THcount',
    url: 'https://www.thcount.com/business-and-financial-tools/vat',
    serpBasis: 'Current Thai SERP check for "คำนวณ VAT"',
  },
  {
    topic: 'vat',
    competitor: 'VATCalculator.org',
    url: 'https://vatcalculator.org/th-vat-calculator',
    serpBasis: 'Current Thai SERP check for "คำนวณ VAT"',
  },
  {
    topic: 'age',
    competitor: 'ToolThaiD',
    url: 'https://www.toolthaid.com/p/age-calculator.html',
    serpBasis: 'Current Thai SERP check for "คำนวณอายุ"',
  },
  {
    topic: 'car-loan',
    competitor: 'Addnine',
    url: 'https://www.addnine.com/th/car-loan',
    serpBasis: 'Current Thai SERP check for "คำนวณผ่อนรถ"',
  },
  {
    topic: 'car-loan',
    competitor: 'KKP Advice Center',
    url: 'https://advicecenter.kkpfg.com/th/calculator/hp_installment',
    serpBasis: 'Current Thai SERP check for "คำนวณผ่อนรถ"',
  },
  {
    topic: 'car-loan',
    competitor: 'MoneyTools4u',
    url: 'https://www.moneytools4u.com/debt/car-loan/',
    serpBasis: 'Current Thai SERP check for "คำนวณผ่อนรถ"',
  },
];

function todayBangkok() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTitle(html) {
  return decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
}

function extractDescription(html) {
  return decodeEntities(html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] || '');
}

function titleScore(title, description) {
  const text = `${title} ${description}`.toLocaleLowerCase('th-TH');
  let score = 0;
  if (title.length >= 30 && title.length <= 68) score += 20;
  if (description.length >= 80 && description.length <= 170) score += 15;
  if (text.includes('คำนวณ') || text.includes('calculator')) score += 15;
  if (text.includes('ฟรี') || text.includes('free')) score += 10;
  if (text.includes('2569') || text.includes('2026')) score += 10;
  if (text.includes('ออนไลน์') || text.includes('online')) score += 10;
  if (/[0-9]/.test(title)) score += 10;
  if (title.includes('|') || title.includes('-')) score += 10;
  return score;
}

async function fetchMeta(page) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(page.url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': USER_AGENT },
    });
    const html = await response.text();
    const title = extractTitle(html);
    const description = extractDescription(html);
    return {
      ...page,
      status: response.status,
      ok: response.ok,
      title,
      description,
      titleLength: title.length,
      descriptionLength: description.length,
      score: titleScore(title, description),
    };
  } catch (error) {
    return {
      ...page,
      status: 0,
      ok: false,
      title: '',
      description: '',
      titleLength: 0,
      descriptionLength: 0,
      score: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

function table(headers, rows) {
  if (!rows.length) return '_No rows._';
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows,
  ].join('\n');
}

function mdCell(value, limit = 100) {
  const text = String(value || '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
  return text.length > limit ? `${text.slice(0, limit - 1)}...` : text;
}

function buildRecommendations(ours, competitors) {
  return OUR_PAGES.map((page) => {
    const own = ours.find((row) => row.topic === page.topic);
    const peers = competitors.filter((row) => row.topic === page.topic && row.ok);
    const bestPeer = peers.sort((a, b) => b.score - a.score)[0];
    const scoreGap = bestPeer ? Math.max(0, bestPeer.score - (own?.score || 0)) : 0;
    return {
      topic: page.topic,
      page: page.url,
      ourTitle: own?.title || '',
      ourScore: own?.score || 0,
      bestCompetitor: bestPeer?.competitor || '',
      bestCompetitorTitle: bestPeer?.title || '',
      bestCompetitorScore: bestPeer?.score || 0,
      scoreGap,
      action: scoreGap > 0
        ? 'Tighten the title around exact query wording, year, free/online utility, and the clearest result promise.'
        : 'Keep current title structure; monitor CTR before rewriting.',
    };
  });
}

function renderReport({ generatedDate, ours, competitors, recommendations }) {
  const ourRows = ours.map((row) => (
    `| ${row.topic} | ${row.status} | ${row.score} | ${row.titleLength} | ${row.descriptionLength} | ${mdCell(row.title, 80)} |`
  ));
  const competitorRows = competitors.map((row) => (
    `| ${row.topic} | ${row.competitor} | ${row.status} | ${row.score} | ${mdCell(row.title, 80)} | ${row.url} |`
  ));
  const recommendationRows = recommendations.map((row) => (
    `| ${row.topic} | ${row.ourScore} | ${row.bestCompetitor || 'n/a'} | ${row.bestCompetitorScore} | ${row.scoreGap} | ${mdCell(row.action, 90)} |`
  ));

  return `# SERP Title Competitor Comparison - ${generatedDate}

Generated: ${new Date().toISOString()}

The competitor set is seeded from current Thai SERP checks for electricity, VAT, age, and car-loan calculator queries. This report fetches live titles/metas and scores whether titles include exact utility wording, freshness, free/online intent, numbers, and a readable title pattern.

## Kamnuanlek Titles

${table(['Topic', 'HTTP', 'Score', 'Title Len', 'Meta Len', 'Title'], ourRows)}

## Competitor Titles

${table(['Topic', 'Competitor', 'HTTP', 'Score', 'Title', 'URL'], competitorRows)}

## Rewrite Decisions

${table(['Topic', 'Our Score', 'Best Peer', 'Peer Score', 'Gap', 'Action'], recommendationRows)}

## Competitor Sources

${COMPETITOR_PAGES.map((row) => `- ${row.competitor}: ${row.url} (${row.serpBasis})`).join('\n')}
`;
}

const generatedDate = todayBangkok();
const [ours, competitors] = await Promise.all([
  Promise.all(OUR_PAGES.map(fetchMeta)),
  Promise.all(COMPETITOR_PAGES.map(fetchMeta)),
]);
const recommendations = buildRecommendations(ours, competitors);
const markdown = renderReport({ generatedDate, ours, competitors, recommendations });

fs.mkdirSync(REPORT_DIR, { recursive: true });
const latestMd = path.join(REPORT_DIR, 'serp-title-competitor-comparison-latest.md');
const latestJson = path.join(REPORT_DIR, 'serp-title-competitor-comparison-latest.json');
const datedMd = path.join(REPORT_DIR, `serp-title-competitor-comparison-${generatedDate}.md`);
fs.writeFileSync(latestMd, markdown, 'utf8');
fs.writeFileSync(datedMd, markdown, 'utf8');
fs.writeFileSync(latestJson, JSON.stringify({
  generatedAt: new Date().toISOString(),
  ours,
  competitors,
  recommendations,
}, null, 2), 'utf8');

console.log(JSON.stringify({
  status: competitors.some((row) => row.ok) && ours.every((row) => row.ok) ? 'ok' : 'needs_attention',
  ownPages: ours.length,
  competitors: competitors.length,
  competitorFetchesOk: competitors.filter((row) => row.ok).length,
  reports: { latestMd, latestJson, datedMd },
}, null, 2));
