/**
 * Action Chain Mappings (Feature #3: Related Action Chains)
 *
 * Maps calculator URL paths to contextual "next step" suggestions.
 * These are natural workflow progressions — shown after a user gets a result.
 *
 * Rules:
 * - All paths must match actual pages/ directory names exactly
 * - Labels: Thai, verb-first, max 40 chars, conversational
 * - Returns undefined for unmapped paths (graceful no-op)
 */

export interface ActionChain {
  href: string;
  label: string;
  emoji: string;
}

export const actionChains: Record<string, ActionChain> = {
  // ── Income Tax ────────────────────────────────────────────────────────
  '/คำนวณภาษีเงินได้บุคคลธรรมดา/': {
    href: '/คำนวณเงินเกษียณ/',
    label: 'วางแผนเงินเกษียณต่อเลย',
    emoji: '🏖️',
  },
  '/คำนวณภาษีเงินเดือนและประกันสังคม/': {
    href: '/คำนวณลดหย่อน-SSF-RMF/',
    label: 'ลดหย่อนภาษี SSF/RMF',
    emoji: '📉',
  },
  '/คำนวณภาษีเงินได้นิติบุคคล/': {
    href: '/คำนวณ-vat-สำหรับธุรกิจ/',
    label: 'คำนวณ VAT ธุรกิจต่อ',
    emoji: '🏢',
  },

  // ── VAT & Business Tax ────────────────────────────────────────────────
  '/คำนวณ-vat-สำหรับธุรกิจ/': {
    href: '/คำนวณภาษีเงินได้นิติบุคคล/',
    label: 'คำนวณภาษีนิติบุคคลด้วย',
    emoji: '📋',
  },
  '/คำนวณ-vat-หลายรายการ/': {
    href: '/คำนวณภาษีเงินได้นิติบุคคล/',
    label: 'คำนวณภาษีนิติบุคคลด้วย',
    emoji: '📋',
  },

  // ── Loans ────────────────────────────────────────────────────────────
  '/คำนวณผ่อนรถ/': {
    href: '/คำนวณ-deductible-ประกันรถ/',
    label: 'เปรียบเทียบประกันรถด้วย',
    emoji: '🚗',
  },
  '/คำนวณค่างวดสินเชื่อรถ/': {
    href: '/คำนวณ-deductible-ประกันรถ/',
    label: 'เปรียบเทียบประกันรถด้วย',
    emoji: '🚗',
  },
  '/คำนวณผ่อนบ้าน/': {
    href: '/คำนวณความสามารถซื้อบ้านครั้งแรก/',
    label: 'ดูความสามารถซื้อบ้านก่อน',
    emoji: '🏠',
  },
  '/คำนวณคุณสมบัติกู้บ้าน/': {
    href: '/คำนวณผ่อนบ้าน/',
    label: 'คำนวณค่างวดบ้านต่อเลย',
    emoji: '🏦',
  },
  '/คำนวณความสามารถซื้อบ้านครั้งแรก/': {
    href: '/คำนวณผ่อนบ้าน/',
    label: 'คำนวณค่างวดบ้านต่อเลย',
    emoji: '🏠',
  },
  '/คำนวณผ่อนผ่อน-bmi/': {
    href: '/คำนวณเบี้ยประกันสุขภาพ/',
    label: 'ดูเบี้ยประกันสุขภาพของคุณ',
    emoji: '🏥',
  },

  // ── BMI & Health ─────────────────────────────────────────────────────
  '/คำนวณ-bmi/': {
    href: '/คำนวณเบี้ยประกันสุขภาพ/',
    label: 'ดูเบี้ยประกันสุขภาพของคุณ',
    emoji: '🏥',
  },

  // ── Salary & OT ──────────────────────────────────────────────────────
  '/คำนวณค่าโอที/': {
    href: '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
    label: 'คำนวณภาษีเงินได้ด้วย',
    emoji: '💸',
  },
  '/คำนวณขึ้นเงินเดือน/': {
    href: '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
    label: 'คำนวณภาษีหลังขึ้นเงินเดือน',
    emoji: '💸',
  },
  '/คำนวณค่าชดเชย/': {
    href: '/คำนวณเงินเกษียณ/',
    label: 'วางแผนเงินเกษียณต่อเลย',
    emoji: '🏖️',
  },

  // ── Social Security & Retirement ──────────────────────────────────────
  '/คำนวณประกันสังคม/': {
    href: '/คำนวณเงินเกษียณ/',
    label: 'วางแผนเงินเกษียณต่อเลย',
    emoji: '🏖️',
  },
  '/คำนวณประกันสังคมมาตรา39/': {
    href: '/คำนวณเงินเกษียณ/',
    label: 'วางแผนเงินเกษียณต่อเลย',
    emoji: '🏖️',
  },
  '/คำนวณเงินบำนาญรายปี/': {
    href: '/คำนวณเป้าหมายเงินเกษียณ/',
    label: 'ตั้งเป้าหมายเกษียณที่ชัดเจน',
    emoji: '📊',
  },
  '/คำนวณเงินเกษียณ/': {
    href: '/คำนวณมูลค่าอนาคต-SSF-RMF/',
    label: 'ลงทุน SSF/RMF เพิ่มเกษียณ',
    emoji: '📈',
  },
  '/คำนวณมูลค่าอนาคตกองทุนสำรองเลี้ยงชีพ/': {
    href: '/คำนวณเป้าหมายเงินเกษียณ/',
    label: 'ตั้งเป้าหมายเกษียณที่ชัดเจน',
    emoji: '🏖️',
  },

  // ── SSF / RMF ─────────────────────────────────────────────────────────
  '/คำนวณมูลค่าอนาคต-SSF-RMF/': {
    href: '/คำนวณลดหย่อน-SSF-RMF/',
    label: 'ดูลดหย่อนภาษีที่ได้รับ',
    emoji: '📉',
  },
  '/คำนวณลดหย่อน-SSF-RMF/': {
    href: '/คำนวณมูลค่าอนาคต-SSF-RMF/',
    label: 'คำนวณผลตอบแทน SSF/RMF',
    emoji: '📈',
  },

  // ── Electricity & Utilities ───────────────────────────────────────────
  '/คำนวณค่าไฟฟ้า/': {
    href: '/คำนวณค่าไฟโซลาร์เซลล์/',
    label: 'ประหยัดด้วยโซลาร์เซลล์',
    emoji: '⚡',
  },
  '/คำนวณ-klc0577-ค่าไฟฟ้า-mea/': {
    href: '/คำนวณค่าไฟโซลาร์เซลล์/',
    label: 'ประหยัดด้วยโซลาร์เซลล์',
    emoji: '⚡',
  },

  // ── Gold & Investment ─────────────────────────────────────────────────
  '/คำนวณค่าทองคำ/': {
    href: '/คำนวณ-dca-เฉลี่ยต้นทุน/',
    label: 'ลงทุน DCA ทองคำให้ฉลาดขึ้น',
    emoji: '🥇',
  },
  '/คำนวณอัตราแลกเปลี่ยน/': {
    href: '/คำนวณ-cagr-อัตราเติบโตทบต้นรายปี/',
    label: 'คำนวณผลตอบแทนรวม CAGR',
    emoji: '📈',
  },
  '/คำนวณ-apr/': {
    href: '/คำนวณ-dca-เฉลี่ยต้นทุน/',
    label: 'ลงทุน DCA ลดความเสี่ยง',
    emoji: '📊',
  },

  // ── Insurance ─────────────────────────────────────────────────────────
  '/คำนวณทุนประกันชีวิต/': {
    href: '/คำนวณเบี้ยประกันชีวิต/',
    label: 'คำนวณเบี้ยประกันที่ต้องจ่าย',
    emoji: '🛡️',
  },
  '/คำนวณประกันชีวิต/': {
    href: '/คำนวณลดหย่อนประกันชีวิต/',
    label: 'ลดหย่อนภาษีด้วยประกันชีวิต',
    emoji: '📉',
  },
};

/**
 * Get the action chain for a calculator path.
 * Returns undefined if no mapping exists (graceful no-op).
 */
export function getActionChain(calcPath: string): ActionChain | undefined {
  return actionChains[calcPath];
}

/**
 * Check if a calculator has an action chain mapping.
 */
export function hasActionChain(calcPath: string): boolean {
  return calcPath in actionChains;
}
