/**
 * Calculator Metadata Registry — CAL-3720 Implementation
 *
 * Maps each calculator to its full SEO metadata, intent classification, and internal-link structure.
 * This is the single source of truth for calculator pages in the redesign.
 *
 * Implements CAL-3719 Section 3 (Internal-Link Blueprint) and Section 4 (Metadata/Schema Deltas).
 */

import { CalculatorMetadata, IntentClass } from './seo-data-model';

/**
 * Priority calculators for CAL-3716 redesign (first wave).
 * These pages are fully populated with intent classification and complete metadata.
 * Baseline for pattern extension to remaining 30+ calculators.
 */
export const priorityCalculators: Record<string, CalculatorMetadata> = {
  // ── TAX: Income & Deductions Cluster ──
  '/คำนวณภาษีเงินได้บุคคลธรรมดา/': {
    href: '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
    title: 'คำนวณภาษีเงินได้ 2569 — รู้ผลทันที',
    intentClass: 'calculate-now',
    clusterKey: 'tax-income',
    description: 'คำนวณภาษีเงินได้ 2569 ฟรี รู้ผลทันที พร้อมลดหย่อนครบทุกรายการ',
    h1: 'คำนวณภาษีเงินได้ 2569 — รู้ผลทันที',
    supportText: 'ทำอะไรได้: คำนวณภาษีเงินได้บุคคลธรรมดาตามข้อมูลจริงของคุณ',
    relatedCalculators: [
      {
        href: '/คำนวณเงินเดือนสุทธิ/',
        title: 'คำนวณเงินเดือนสุทธิ',
        desc: 'เงินเดือนหลังหักภาษีและประกันสังคม',
        clusterKey: 'tax-income',
        intentClass: 'calculate-now',
        linkRole: 'same-intent',
        priority: 'primary',
      },
      {
        href: '/คำนวณลดหย่อนบิดามารดา/',
        title: 'คำนวณลดหย่อนบิดามารดา',
        desc: 'ลดหย่อนพ่อแม่ 30,000 บาท/คน สูงสุด 4 คน',
        clusterKey: 'tax-income',
        intentClass: 'calculate-now',
        linkRole: 'same-intent',
        priority: 'secondary',
      },
      {
        href: '/คำนวณลดหย่อนคู่สมรส/',
        title: 'คำนวณลดหย่อนคู่สมรส',
        desc: 'ลดหย่อนคู่สมรส 60,000 บาท',
        clusterKey: 'tax-income',
        intentClass: 'calculate-now',
        linkRole: 'same-intent',
        priority: 'secondary',
      },
    ],
    relatedArticles: [
      {
        href: '/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/',
        title: 'ภาษีเงินได้ 2569 คำนวณ วิธีลดหย่อน',
        desc: 'แนะนำวิธีลดหย่อนภาษีครบทุกรายการ',
        clusterKey: 'tax-income',
        intentClass: 'learn-before-action',
        linkRole: 'example-support',
        priority: 'primary',
        author: 'คณะทีม Kamnuanlek',
      },
    ],
    trust: {
      updatedDate: '2026-05-16',
      source: 'สรรพากรแห่งประเทศไทย',
      author: 'คณะทีม Kamnuanlek',
    },
  },

  // ── INCOME & BENEFITS Cluster ──
  '/คำนวณเงินเดือนสุทธิ/': {
    href: '/คำนวณเงินเดือนสุทธิ/',
    title: 'คำนวณเงินเดือนสุทธิ 2569 — รู้เงินจริงของคุณ',
    intentClass: 'calculate-now',
    clusterKey: 'income-salary',
    description: 'คำนวณเงินเดือนสุทธิหลังหักภาษีและประกันสังคม ฟรี รู้ผลทันที',
    h1: 'คำนวณเงินเดือนสุทธิ 2569 — รู้เงินจริงของคุณ',
    supportText: 'ทำอะไรได้: คำนวณเงินเดือนจริงที่ได้รับหลังหักทั้งหมด',
    relatedCalculators: [
      {
        href: '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
        title: 'คำนวณภาษีเงินได้',
        desc: 'ภาษีเงินได้ตามขั้นบันได 2569 พร้อมลดหย่อน',
        clusterKey: 'income-salary',
        intentClass: 'calculate-now',
        linkRole: 'same-intent',
        priority: 'primary',
      },
      {
        href: '/คำนวณค่าโอที/',
        title: 'คำนวณค่าโอที',
        desc: 'ค่าโอที 1.5 เท่า 2 เท่า 3 เท่า',
        clusterKey: 'income-salary',
        intentClass: 'calculate-now',
        linkRole: 'same-intent',
        priority: 'secondary',
      },
      {
        href: '/คำนวณเบี้ยประกันสังคม/',
        title: 'คำนวณเบี้ยประกันสังคม',
        desc: 'เบี้ยประกันสังคมพนักงาน 5%',
        clusterKey: 'income-salary',
        intentClass: 'calculate-now',
        linkRole: 'same-intent',
        priority: 'secondary',
      },
    ],
    relatedArticles: [
      {
        href: '/บทความ/เงินเดือนสุทธิ-2569-คำนวณวิธีการ/',
        title: 'เงินเดือนสุทธิ 2569 คำนวณวิธีการ',
        desc: 'วิธีคำนวณเงินเดือนสุทธิให้ถูกต้อง',
        clusterKey: 'income-salary',
        intentClass: 'learn-before-action',
        linkRole: 'example-support',
        priority: 'primary',
        author: 'คณะทีม Kamnuanlek',
      },
    ],
    trust: {
      updatedDate: '2026-05-16',
      source: 'สำนักงานประกันสังคม',
      author: 'คณะทีม Kamnuanlek',
    },
  },

  // ── LOANS & MORTGAGES Cluster ──
  '/คำนวณผ่อนบ้าน/': {
    href: '/คำนวณผ่อนบ้าน/',
    title: 'คำนวณผ่อนบ้าน 2569 — เห็นค่างวดชัดเจน',
    intentClass: 'calculate-now',
    clusterKey: 'loan-mortgage',
    description: 'คำนวณค่างวดสินเชื่อบ้าน ผ่อนลดต้นลดดอก ฟรี เปรียบเทียบได้',
    h1: 'คำนวณผ่อนบ้าน 2569 — เห็นค่างวดชัดเจน',
    supportText: 'ทำอะไรได้: คำนวณค่างวดบ้านและดูตารางผ่อนแบบละเอียด',
    relatedCalculators: [
      {
        href: '/คำนวณสินเชื่อบ้าน/',
        title: 'คำนวณสินเชื่อบ้าน',
        desc: 'วงเงินสินเชื่อบ้านที่ได้อนุมัติ',
        clusterKey: 'loan-mortgage',
        intentClass: 'calculate-now',
        linkRole: 'same-intent',
        priority: 'primary',
      },
      {
        href: '/คำนวณสัดส่วนค่าเช่าต่อรายได้/',
        title: 'คำนวณสัดส่วนค่าเช่าต่อรายได้',
        desc: 'ค่าเช่าเหมาะสมตามหลัก 30%',
        clusterKey: 'loan-mortgage',
        intentClass: 'learn-before-action',
        linkRole: 'upstream-planning',
        priority: 'secondary',
      },
      {
        href: '/คำนวณ-dti-อัตราหนี้สินต่อรายได้/',
        title: 'คำนวณ DTI',
        desc: 'อัตราหนี้สินต่อรายได้ (Debt-to-Income)',
        clusterKey: 'loan-mortgage',
        intentClass: 'calculate-now',
        linkRole: 'same-intent',
        priority: 'secondary',
      },
    ],
    relatedArticles: [
      {
        href: '/บทความ/สินเชื่อบ้าน-2569-วิธีเลือก/',
        title: 'สินเชื่อบ้าน 2569 วิธีเลือก',
        desc: 'เปรียบเทียบเงื่อนไขสินเชื่อบ้านต่างๆ',
        clusterKey: 'loan-mortgage',
        intentClass: 'learn-before-action',
        linkRole: 'example-support',
        priority: 'primary',
        author: 'คณะทีม Kamnuanlek',
      },
    ],
    trust: {
      updatedDate: '2026-05-16',
      source: 'ธนาคารแห่งประเทศไทย',
      author: 'คณะทีม Kamnuanlek',
    },
  },

  // ── UTILITIES & COSTS Cluster ──
  '/คำนวณค่าไฟฟ้า/': {
    href: '/คำนวณค่าไฟฟ้า/',
    title: 'คำนวณค่าไฟฟ้า 2569 — ประหยัดชาญฉลาด',
    intentClass: 'calculate-now',
    clusterKey: 'utilities-cost',
    description: 'คำนวณค่าไฟฟ้าประจำเดือน ฟรี ดูแนวโน้มค่าใช้จ่าย',
    h1: 'คำนวณค่าไฟฟ้า 2569 — ประหยัดชาญฉลาด',
    supportText: 'ทำอะไรได้: คำนวณค่าไฟฟ้าแต่ละชั้นและดูแนวโน้ม',
    relatedCalculators: [
      {
        href: '/คำนวณค่าน้ำประปา/',
        title: 'คำนวณค่าน้ำประปา',
        desc: 'ค่าน้ำประปาแต่ละชั้นตามอัตรา',
        clusterKey: 'utilities-cost',
        intentClass: 'calculate-now',
        linkRole: 'same-intent',
        priority: 'primary',
      },
      {
        href: '/คำนวณค่าแก๊สประชาชน/',
        title: 'คำนวณค่าแก๊สประชาชน',
        desc: 'ค่าแก๊สประชาชนแต่ละชั้น',
        clusterKey: 'utilities-cost',
        intentClass: 'calculate-now',
        linkRole: 'same-intent',
        priority: 'secondary',
      },
      {
        href: '/คำนวณค่าเน็ต/',
        title: 'คำนวณค่าเน็ต',
        desc: 'เปรียบเทียบแพ็คเน็ตจากผู้ให้บริการต่างๆ',
        clusterKey: 'utilities-cost',
        intentClass: 'calculate-now',
        linkRole: 'same-intent',
        priority: 'secondary',
      },
    ],
    relatedArticles: [
      {
        href: '/บทความ/ประหยัดค่าไฟฟ้า-2569/',
        title: 'ประหยัดค่าไฟฟ้า 2569 วิธีลดค่าใช้จ่าย',
        desc: '10 วิธีประหยัดค่าไฟฟ้าในชีวิตประจำวัน',
        clusterKey: 'utilities-cost',
        intentClass: 'learn-before-action',
        linkRole: 'example-support',
        priority: 'primary',
        author: 'คณะทีม Kamnuanlek',
      },
    ],
    trust: {
      updatedDate: '2026-05-16',
      source: 'การไฟฟ้าแห่งประเทศไทย',
      author: 'คณะทีม Kamnuanlek',
    },
  },

  // ── OVERTIME & BENEFITS Cluster ──
  '/คำนวณค่าโอที/': {
    href: '/คำนวณค่าโอที/',
    title: 'คำนวณค่าโอที 2569 — รู้ค่าตอบแทนจริง',
    intentClass: 'calculate-now',
    clusterKey: 'income-salary',
    description: 'คำนวณค่าโอที 1.5 เท่า 2 เท่า 3 เท่า ฟรี สะดวก รวดเร็ว',
    h1: 'คำนวณค่าโอที 2569 — รู้ค่าตอบแทนจริง',
    supportText: 'ทำอะไรได้: คำนวณค่าโอทีตามอัตราเวลาต่างๆ',
    relatedCalculators: [
      {
        href: '/คำนวณเงินเดือนสุทธิ/',
        title: 'คำนวณเงินเดือนสุทธิ',
        desc: 'เงินเดือนหลังหักภาษีและประกันสังคม',
        clusterKey: 'income-salary',
        intentClass: 'calculate-now',
        linkRole: 'same-intent',
        priority: 'primary',
      },
      {
        href: '/คำนวณเบี้ยประกันสังคม/',
        title: 'คำนวณเบี้ยประกันสังคม',
        desc: 'เบี้ยประกันสังคมพนักงาน 5%',
        clusterKey: 'income-salary',
        intentClass: 'calculate-now',
        linkRole: 'same-intent',
        priority: 'secondary',
      },
      {
        href: '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
        title: 'คำนวณภาษีเงินได้',
        desc: 'ภาษีเงินได้ตามขั้นบันได 2569 พร้อมลดหย่อน',
        clusterKey: 'income-salary',
        intentClass: 'calculate-now',
        linkRole: 'same-intent',
        priority: 'secondary',
      },
    ],
    relatedArticles: [
      {
        href: '/บทความ/ค่าโอที-2569-วิธีคำนวณ/',
        title: 'ค่าโอที 2569 วิธีคำนวณ',
        desc: 'วิธีคำนวณค่าโอทีตามประมวลคุณภาพแรงงาน',
        clusterKey: 'income-salary',
        intentClass: 'learn-before-action',
        linkRole: 'example-support',
        priority: 'primary',
        author: 'คณะทีม Kamnuanlek',
      },
    ],
    trust: {
      updatedDate: '2026-05-16',
      source: 'กระทรวงแรงงาน',
      author: 'คณะทีม Kamnuanlek',
    },
  },
};

/**
 * Get calculator metadata by href.
 * Returns null if not found (for pages not yet in priority registry).
 */
export function getCalculatorMetadata(href: string): CalculatorMetadata | null {
  return priorityCalculators[href] || null;
}

/**
 * List of all priority calculator hrefs (first wave of redesign).
 */
export function getPriorityCalculatorHrefs(): string[] {
  return Object.keys(priorityCalculators);
}

/**
 * Get calculators by cluster key.
 */
export function getCalculatorsByCluster(clusterKey: string): CalculatorMetadata[] {
  return Object.values(priorityCalculators).filter(
    (calc) => calc.clusterKey === clusterKey
  );
}

export default priorityCalculators;
