/**
 * Action Chain Mappings (Feature #3: Related Action Chains)
 *
 * Maps calculator paths to their contextual "next step" suggestions.
 * These are natural progressions in user workflows.
 *
 * Example: income tax calculator → retirement planning
 *
 * Schema: Record<path, { href, label, emoji }>
 *
 * Start with 20 high-traffic calculators as specified in CAL-969.
 */

export interface ActionChain {
  href: string;
  label: string;
  emoji: string;
}

export const actionChains: Record<string, ActionChain> = {
  // Finance / Tax
  '/คำนวณภาษีเงินได้บุคคลธรรมชาติ/': {
    href: '/วางแผนการเกษียณอายุ/',
    label: 'วางแผนการเกษียณอายุ',
    emoji: '🏖️',
  },
  '/คำนวณภาษีสรรพสามิต/': {
    href: '/คำนวณลักษณะอื่นของภาษี/',
    label: 'ภาษีรูปแบบอื่น',
    emoji: '📋',
  },
  '/คำนวณภาษีมูลค่าเพิ่ม/': {
    href: '/คำนวณภาษีเงินได้บุคคลธรรมชาติ/',
    label: 'ภาษีเงินได้',
    emoji: '💰',
  },

  // Loans & Insurance
  '/คำนวณสินเชื่อรถยนต์/': {
    href: '/คำนวณประกันภัยรถยนต์/',
    label: 'ประกันภัยรถยนต์',
    emoji: '🚗',
  },
  '/คำนวณสินเชื่อบ้าน/': {
    href: '/คำนวณประกันภัยบ้าน/',
    label: 'ประกันภัยบ้าน',
    emoji: '🏠',
  },
  '/คำนวณสินเชื่อส่วนบุคคล/': {
    href: '/คำนวณประกันภัยอุบัติเหตุบุคคล/',
    label: 'ประกันภัยอุบัติเหตุ',
    emoji: '🛡️',
  },
  '/คำนวณประกันภัยรถยนต์/': {
    href: '/คำนวณสินเชื่อรถยนต์/',
    label: 'สินเชื่อรถยนต์',
    emoji: '💳',
  },

  // Health & Wellness
  '/คำนวณดัชนีมวลกาย/': {
    href: '/คำนวณแคลอรี่การออกกำลังกาย/',
    label: 'แคลอรี่การออกกำลังกาย',
    emoji: '💪',
  },
  '/คำนวณต้นทุนการดูแลสุขภาพ/': {
    href: '/คำนวณประกันภัยสุขภาพ/',
    label: 'ประกันภัยสุขภาพ',
    emoji: '🏥',
  },

  // Property & Real Estate
  '/คำนวณต้นทุนการซื้ออสังหาริมทรัพย์/': {
    href: '/คำนวณอัตราผลตอบแทนจากการลงทุนอสังหาริมทรัพย์/',
    label: 'ผลตอบแทนการลงทุน',
    emoji: '📈',
  },
  '/คำนวณค่าเช่าบ้าน/': {
    href: '/คำนวณรายได้จากการเช่าอสังหาริมทรัพย์/',
    label: 'รายได้จากการเช่า',
    emoji: '💵',
  },

  // Salary & Work
  '/คำนวณค่าตอบแทนการทำงานนอกเวลา/': {
    href: '/คำนวณเงินอุดหนุนการว่างงาน/',
    label: 'สิทธิการว่างงาน',
    emoji: '📊',
  },
  '/คำนวณเงินได้ขั้นต่ำ/': {
    href: '/คำนวณภาษีเงินได้บุคคลธรรมชาติ/',
    label: 'ภาษีเงินได้',
    emoji: '💸',
  },

  // Utilities & Daily Life
  '/คำนวณค่าไฟฟ้า/': {
    href: '/คำนวณแผงโซลาร์เซลล์/',
    label: 'พลังงานเพื่อการประหยัด',
    emoji: '⚡',
  },
  '/คำนวณค่าน้ำประปา/': {
    href: '/คำนวณการเก็บรักษาน้ำฝน/',
    label: 'การอนุรักษ์น้ำ',
    emoji: '💧',
  },
  '/คำนวณค่าโทรศัพท์/': {
    href: '/คำนวณค่าใช้สอยอื่นๆ/',
    label: 'ค่าใช้สอยรวม',
    emoji: '📱',
  },

  // Savings & Investment
  '/คำนวณเงินออม/': {
    href: '/คำนวณการลงทุน/',
    label: 'กลยุทธ์การลงทุน',
    emoji: '📈',
  },
  '/คำนวณการลงทุนอสังหาริมทรัพย์/': {
    href: '/คำนวณต้นทุนการซื้ออสังหาริมทรัพย์/',
    label: 'ต้นทุนการซื้อ',
    emoji: '🏢',
  },

  // Travel & Entertainment
  '/คำนวณค่าใช้จ่ายการเดินทาง/': {
    href: '/คำนวณค่าโรงแรม/',
    label: 'ค่าที่พักแรม',
    emoji: '🏨',
  },
  '/คำนวณค่าอาหารและการสนับสนุน/': {
    href: '/คำนวณค่าตั๋วการเดินทาง/',
    label: 'ค่าตั๋วการเดินทาง',
    emoji: '🎫',
  },
};

/**
 * Get the action chain for a calculator path
 * Returns undefined if no mapping exists (graceful no-op)
 */
export function getActionChain(calcPath: string): ActionChain | undefined {
  return actionChains[calcPath];
}

/**
 * Check if a calculator has an action chain
 */
export function hasActionChain(calcPath: string): boolean {
  return calcPath in actionChains;
}
