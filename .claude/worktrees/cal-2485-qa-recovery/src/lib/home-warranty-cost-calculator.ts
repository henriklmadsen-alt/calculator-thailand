/**
 * Thai Home Warranty Cost Calculator (คำนวณค่าประกันรับประกันบ้าน)
 *
 * Estimates cost of extended home warranty/home protection plans
 */

export type CoverageScope = 'appliances' | 'structural' | 'systems' | 'comprehensive';
export type PlanLength = '1year' | '2years' | '3years' | '5years';

export interface HomeWarrantyInput {
  homeAge: number;               // อายุบ้าน (ปี)
  coverageScope: CoverageScope;  // ขอบเขตการครอบคลุม
  planLength: PlanLength;        // ระยะเวลาแผน
  propertyValue: number;         // มูลค่ามูลค่า (THB)
}

export interface HomeWarrantyResult {
  coverageScope: string;
  planLength: string;
  yearsOfCoverage: number;
  annualPremium: number;
  totalPremiumCost: number;
  serviceCalls: number;
  estim atedAnnualServiceCost: number;
  totalCostIncludingService: number;
}

const COVERAGE_NAMES: Record<CoverageScope, string> = {
  appliances: 'เครื่องใช้ไฟฟ้า',
  structural: 'โครงสร้าง',
  systems: 'ระบบต่างๆ',
  comprehensive: 'ครอบคลุม',
};

const BASE_ANNUAL_COSTS: Record<CoverageScope, number> = {
  appliances: 5000,
  structural: 8000,
  systems: 10000,
  comprehensive: 15000,
};

const PLAN_LENGTH_YEARS: Record<PlanLength, number> = {
  '1year': 1,
  '2years': 2,
  '3years': 3,
  '5years': 5,
};

const PLAN_DISCOUNTS: Record<PlanLength, number> = {
  '1year': 1.0,
  '2years': 0.95,
  '3years': 0.90,
  '5years': 0.85,
};

const SERVICE_CALL_COSTS = 2500;
const AVG_SERVICE_CALLS_PER_YEAR = 1;

function getAgeAdjustment(homeAge: number): number {
  if (homeAge <= 5) return 1.0;
  if (homeAge <= 10) return 1.15;
  if (homeAge <= 20) return 1.35;
  return 1.60;
}

export function calculateHomeWarrantyCost(input: HomeWarrantyInput): HomeWarrantyResult {
  const baseAnnual = BASE_ANNUAL_COSTS[input.coverageScope];
  const ageAdjustment = getAgeAdjustment(input.homeAge);
  const planDiscount = PLAN_DISCOUNTS[input.planLength];
  const yearsOfCoverage = PLAN_LENGTH_YEARS[input.planLength];

  const annualPremium = Math.round(baseAnnual * ageAdjustment * planDiscount);
  const totalPremiumCost = annualPremium * yearsOfCoverage;

  const serviceCalls = AVG_SERVICE_CALLS_PER_YEAR * yearsOfCoverage;
  const estimatedAnnualServiceCost = SERVICE_CALL_COSTS * AVG_SERVICE_CALLS_PER_YEAR;
  const totalCostIncludingService = totalPremiumCost + (estimatedAnnualServiceCost * yearsOfCoverage);

  return {
    coverageScope: COVERAGE_NAMES[input.coverageScope],
    planLength: `${yearsOfCoverage} ปี`,
    yearsOfCoverage,
    annualPremium,
    totalPremiumCost,
    serviceCalls: Math.round(serviceCalls),
    estimatedAnnualServiceCost: Math.round(estimatedAnnualServiceCost),
    totalCostIncludingService: Math.round(totalCostIncludingService),
  };
}
