/**
 * Related Calculators Recommendation Engine
 * Topic clusters for internal linking and discovery
 */

export interface RelatedCalculator {
  title: string;
  href: string;
  reason: string; // Why this is related
}

export interface CalculatorCluster {
  clusterId: string;
  topic: string;
  calculators: string[]; // href paths
}

// Topic clusters map calculators by semantic relationship
export const topicClusters: CalculatorCluster[] = [
  {
    clusterId: 'tax-income',
    topic: 'Tax: Income & Deductions',
    calculators: [
      '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
      '/คำนวณภาษีครึ่งปี/',
    ],
  },
  {
    clusterId: 'tax-business',
    topic: 'Tax: VAT & Business',
    calculators: [
      '/คำนวณภาษีมูลค่าเพิ่ม/',
      '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
    ],
  },
  {
    clusterId: 'tax-property',
    topic: 'Tax: Property & Vehicles',
    calculators: [
      '/คำนวณภาษีที่ดิน/',
      '/คำนวณค่าภาษีรถยนต์/',
    ],
  },
  {
    clusterId: 'loan-mortgage',
    topic: 'Loans: Mortgages & Home Finance',
    calculators: [
      '/คำนวณสินเชื่อบ้าน/',
      '/คำนวณค่างวดสินเชื่อ/',
    ],
  },
  {
    clusterId: 'loan-vehicle',
    topic: 'Loans: Vehicle & Auto Finance',
    calculators: [
      '/คำนวณค่างวดสินเชื่อรถยนต์/',
      '/คำนวณค่างวดสินเชื่อ/',
    ],
  },
  {
    clusterId: 'loan-personal',
    topic: 'Loans: Personal & Consumer Finance',
    calculators: [
      '/คำนวณสินเชื่อส่วนบุคคล/',
      '/คำนวณค่างวดสินเชื่อ/',
    ],
  },
  {
    clusterId: 'insurance-life',
    topic: 'Insurance: Life & Protection',
    calculators: [
      '/คำนวณประกันชีวิต/',
      '/คำนวณเบี้ยประกัน/',
    ],
  },
  {
    clusterId: 'investment-return',
    topic: 'Investment: Returns & Growth',
    calculators: [
      '/คำนวณผลตอบแทนการลงทุน/',
      '/คำนวณดอกเบี้ยทบต้น/',
    ],
  },
  {
    clusterId: 'savings-compound',
    topic: 'Savings: Compound Interest & Growth',
    calculators: [
      '/คำนวณดอกเบี้ยทบต้น/',
      '/คำนวณเงินออมรายเดือน/',
    ],
  },
  {
    clusterId: 'health-bmi',
    topic: 'Health: BMI & Fitness',
    calculators: [
      '/คำนวณ-bmi/',
      '/คำนวณน้ำหนักอุดมคติ/',
    ],
  },
  {
    clusterId: 'business-profit',
    topic: 'Business: Profit & Pricing',
    calculators: [
      '/คำนวณราคาขายให้ไม่ขาดทุน/',
      '/คำนวณกำไรขั้นต่อ/',
    ],
  },
];

// Pillar pages: high-authority calculator hubs
export const pillarPages = [
  {
    href: '/ภาษี/',
    title: 'Tax Calculators Hub',
    cluster: ['tax-income', 'tax-business', 'tax-property'],
  },
  {
    href: '/สินเชื่อ/',
    title: 'Loan Calculators Hub',
    cluster: ['loan-mortgage', 'loan-vehicle', 'loan-personal'],
  },
  {
    href: '/การลงทุน/',
    title: 'Investment Calculators Hub',
    cluster: ['investment-return', 'savings-compound'],
  },
  {
    href: '/สุขภาพ/',
    title: 'Health Calculators Hub',
    cluster: ['health-bmi'],
  },
];

// Get related calculators for a given calculator
export function getRelatedCalculators(
  calculatorHref: string,
  maxResults: number = 3
): RelatedCalculator[] {
  // Find clusters that contain this calculator
  const relevantClusters = topicClusters.filter((cluster) =>
    cluster.calculators.includes(calculatorHref)
  );

  if (relevantClusters.length === 0) {
    return [];
  }

  // Collect all related calculators from matching clusters
  const relatedSet = new Set<string>();
  relevantClusters.forEach((cluster) => {
    cluster.calculators.forEach((calc) => {
      if (calc !== calculatorHref) {
        relatedSet.add(calc);
      }
    });
  });

  // Convert to RelatedCalculator objects with reasoning
  const related: RelatedCalculator[] = Array.from(relatedSet).map((href) => {
    const clusterNames = relevantClusters
      .filter((c) => c.calculators.includes(href))
      .map((c) => c.topic)
      .join(', ');

    return {
      title: extractCalculatorTitle(href),
      href,
      reason: clusterNames,
    };
  });

  return related.slice(0, maxResults);
}

// Helper: extract calculator title from href
function extractCalculatorTitle(href: string): string {
  // Remove leading/trailing slashes and convert from Thai URL slug to title
  const slug = href.replace(/\//g, '').replace(/\-/g, ' ');
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

// Get pillar pages for a cluster
export function getPillarPagesForCluster(clusterId: string) {
  return pillarPages.filter((page) => page.cluster.includes(clusterId));
}

// Get all calculators in a cluster
export function getCalculatorsInCluster(clusterId: string) {
  const cluster = topicClusters.find((c) => c.clusterId === clusterId);
  return cluster ? cluster.calculators : [];
}
