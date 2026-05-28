#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'reports', 'seo');
const SITE = 'https://www.kamnuanlek.com';

const TOOLS = [
  {
    name: 'คำนวณค่าไฟฟ้า',
    path: '/คำนวณค่าไฟฟ้า/',
    angle: 'ช่วยเช็กค่าไฟบ้าน PEA/MEA จากจำนวนหน่วย พร้อม Ft และ VAT',
    communities: ['Pantip ห้องชายคา', 'Facebook กลุ่มเจ้าของบ้าน', 'LINE OpenChat คอนโด/บ้าน'],
  },
  {
    name: 'คำนวณผ่อนรถ',
    path: '/คำนวณผ่อนรถ/',
    angle: 'ดูค่างวดรถ 48-84 งวด ดอกเบี้ยรวม และยอดจัดไฟแนนซ์ก่อนตัดสินใจ',
    communities: ['Pantip รัชดา', 'Facebook กลุ่มรถมือสอง', 'X/Twitter auto finance threads'],
  },
  {
    name: 'คำนวณผ่อนบ้าน',
    path: '/คำนวณผ่อนบ้าน/',
    angle: 'เช็กค่างวดบ้านเบื้องต้นและดูว่างบรายเดือนรับไหวไหม',
    communities: ['Pantip บ้านและคอนโด', 'Facebook กลุ่มกู้บ้าน', 'LINE OpenChat อสังหา'],
  },
  {
    name: 'คำนวณ VAT 7%',
    path: '/คำนวณภาษีมูลค่าเพิ่ม/',
    angle: 'บวก VAT/ถอด VAT สำหรับร้านค้า ฟรีแลนซ์ และใบเสนอราคา',
    communities: ['Facebook กลุ่มบัญชี/ภาษี', 'Pantip สีลม', 'กลุ่ม SME ไทย'],
  },
  {
    name: 'คำนวณอายุ',
    path: '/คำนวณอายุ/',
    angle: 'ใส่วันเกิดแล้วรู้ปี เดือน วัน และใช้กับเอกสารที่ต้องการอายุแบบละเอียด',
    communities: ['Facebook กลุ่มครอบครัว', 'TikTok short utility posts', 'LINE กลุ่มโรงเรียน/ผู้ปกครอง'],
  },
];

const CHANNELS = [
  {
    channel: 'Pantip',
    rule: 'ตอบเฉพาะกระทู้ที่ถามจริง ใส่วิธีคิดก่อนลิงก์ และเปิดเผยว่าเป็นเว็บเครื่องมือฟรี',
  },
  {
    channel: 'Facebook Groups',
    rule: 'โพสต์แบบช่วยแก้ปัญหา ไม่โพสต์ซ้ำถี่ ใช้ภาพหน้าจอผลลัพธ์และลิงก์ UTM',
  },
  {
    channel: 'LINE OpenChat',
    rule: 'แชร์เมื่อมีคนถามเรื่องค่าใช้จ่ายจริง และใช้ข้อความสั้นพร้อมคำเตือนว่าเป็นค่าประมาณ',
  },
  {
    channel: 'X/Twitter',
    rule: 'ทำ thread สั้น 3-5 ข้อ พร้อมตัวอย่างตัวเลขและลิงก์เครื่องมือ',
  },
  {
    channel: 'Partner Blogs',
    rule: 'เสนอ iframe widget ฟรีให้บล็อกการเงิน/บ้าน/รถ ฝังในบทความของเขา',
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

function utmUrl(tool, source, medium = 'social') {
  const url = new URL(`${SITE}${tool.path}`);
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', medium);
  url.searchParams.set('utm_campaign', 'free_calculator_growth');
  url.searchParams.set('utm_content', tool.name.replace(/\s+/g, '_'));
  return url.toString();
}

function table(headers, rows) {
  if (!rows.length) return '_No rows._';
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows,
  ].join('\n');
}

function renderToolPack(tool) {
  const pantipUrl = utmUrl(tool, 'pantip', 'community');
  const facebookUrl = utmUrl(tool, 'facebook_group', 'community');
  const lineUrl = utmUrl(tool, 'line_openchat', 'community');

  return `### ${tool.name}

Primary angle: ${tool.angle}

Best communities: ${tool.communities.join(', ')}

Pantip answer draft:

> ลองใช้วิธีคิดแบบนี้ครับ/ค่ะ: กรอกตัวเลขหลักก่อน แล้วดูผลรวมเพื่อเช็กว่างบรับไหวไหม เครื่องมือนี้คำนวณให้ทันทีและใช้ฟรี: ${pantipUrl}

Facebook/LINE draft:

> ใครกำลังเช็กตัวเลขเรื่อง "${tool.name}" ลองใช้ตัวนี้ได้ครับ/ค่ะ กรอกข้อมูลแล้วเห็นผลทันที: ${facebookUrl}

Short post draft:

> ${tool.angle} ใช้ฟรีบนมือถือ: ${lineUrl}
`;
}

function renderReport(generatedDate) {
  const channelRows = CHANNELS.map((row) => `| ${row.channel} | ${row.rule} |`);
  const utmRows = TOOLS.flatMap((tool) => [
    `| ${tool.name} | Pantip | ${utmUrl(tool, 'pantip', 'community')} |`,
    `| ${tool.name} | Facebook | ${utmUrl(tool, 'facebook_group', 'community')} |`,
    `| ${tool.name} | LINE | ${utmUrl(tool, 'line_openchat', 'community')} |`,
  ]);

  return `# Manual Promotion Pack - ${generatedDate}

Generated: ${new Date().toISOString()}

This pack is for manual, non-paid traffic work. Use it only where the post genuinely answers an existing question. Do not spam communities or post affiliate-first copy.

## Channel Rules

${table(['Channel', 'Rule'], channelRows)}

## UTM Links

${table(['Tool', 'Channel', 'Tracked URL'], utmRows)}

## Ready-To-Post Drafts

${TOOLS.map(renderToolPack).join('\n')}

## Weekly Manual Promotion Checklist

- Answer 10 real Thai forum/social questions where a calculator directly solves the problem.
- Offer the free iframe widget to 5 Thai blogs or small business sites.
- Share 3 short examples using real-looking round numbers, not hype.
- Record which communities produce clicks in GA4/GSC annotations.
- Feed recurring questions back into the GSC query gap planner.
`;
}

const generatedDate = todayBangkok();
const markdown = renderReport(generatedDate);
fs.mkdirSync(REPORT_DIR, { recursive: true });
const latestMd = path.join(REPORT_DIR, 'manual-promotion-pack-latest.md');
const datedMd = path.join(REPORT_DIR, `manual-promotion-pack-${generatedDate}.md`);
const latestJson = path.join(REPORT_DIR, 'manual-promotion-pack-latest.json');
fs.writeFileSync(latestMd, markdown, 'utf8');
fs.writeFileSync(datedMd, markdown, 'utf8');
fs.writeFileSync(latestJson, JSON.stringify({
  generatedAt: new Date().toISOString(),
  tools: TOOLS.map((tool) => ({
    ...tool,
    links: {
      pantip: utmUrl(tool, 'pantip', 'community'),
      facebook: utmUrl(tool, 'facebook_group', 'community'),
      line: utmUrl(tool, 'line_openchat', 'community'),
    },
  })),
  channels: CHANNELS,
}, null, 2), 'utf8');

console.log(JSON.stringify({
  status: 'ok',
  tools: TOOLS.length,
  channels: CHANNELS.length,
  reports: { latestMd, latestJson, datedMd },
}, null, 2));
