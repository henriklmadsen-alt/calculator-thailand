/**
 * Thai Life Insurance Premium Estimator (คำนวณค่าเบี้ยประกันชีวิต)
 *
 * Sources:
 * - คปภ. (OIC) — Office of Insurance Commission, Thailand
 * - อัตราเบี้ยประกันชีวิตอ้างอิง (reference mortality tables)
 * - Thai Standard Ordinary (TSO) mortality table
 *
 * Insurance types:
 *   สะสมทรัพย์ (Endowment)    — ครบสัญญาได้เงินคืน + คุ้มครองชีวิต
 *   ตลอดชีพ (Whole Life)       — คุ้มครองตลอดชีวิต
 *   ชั่วระยะเวลา (Term Life)   — คุ้มครองตามระยะเวลา เบี้ยถูกสุด
 *
 * Factors: age, gender, coverage amount, policy term, payment frequency
 *
 * Note: This is an estimation tool. Actual premiums vary by insurer
 * and individual underwriting factors (health, occupation, smoking).
 */

export type InsurancePlanType = 'endowment' | 'wholeLife' | 'term';
export type Gender = 'male' | 'female';
export type PaymentFrequency = 'annual' | 'semiannual' | 'quarterly' | 'monthly';

export interface LifeInsuranceInput {
  age: number;
  gender: Gender;
  coverageAmount: number;
  planType: InsurancePlanType;
  policyTerm: number;
  paymentFrequency: PaymentFrequency;
}

export interface LifeInsuranceResult {
  planType: InsurancePlanType;
  planTypeName: string;
  premiumPerPeriod: number;
  annualPremium: number;
  totalPremium: number;
  coverageAmount: number;
  policyTerm: number;
  paymentFrequency: PaymentFrequency;
  paymentFrequencyName: string;
  periodsPerYear: number;
  totalPaymentYears: number;
  maturityBenefit: number;
  deathBenefit: number;
  taxDeduction: number;
  ratePerThousand: number;
}

export interface ComparisonResult {
  plans: LifeInsuranceResult[];
  inputSummary: {
    age: number;
    gender: Gender;
    genderName: string;
    coverageAmount: number;
    policyTerm: number;
    paymentFrequency: PaymentFrequency;
    paymentFrequencyName: string;
  };
}

const PLAN_TYPE_NAMES: Record<InsurancePlanType, string> = {
  endowment: 'สะสมทรัพย์',
  wholeLife: 'ตลอดชีพ',
  term: 'ชั่วระยะเวลา',
};

const FREQUENCY_NAMES: Record<PaymentFrequency, string> = {
  annual: 'รายปี',
  semiannual: 'ราย 6 เดือน',
  quarterly: 'ราย 3 เดือน',
  monthly: 'รายเดือน',
};

const PERIODS_PER_YEAR: Record<PaymentFrequency, number> = {
  annual: 1,
  semiannual: 2,
  quarterly: 4,
  monthly: 12,
};

/**
 * Frequency loading factors — paying more frequently costs slightly more
 * due to administrative costs and lost investment income.
 * Reference: Thai insurance industry standard loadings.
 */
const FREQUENCY_LOADING: Record<PaymentFrequency, number> = {
  annual: 1.0,
  semiannual: 1.02,
  quarterly: 1.04,
  monthly: 1.06,
};

/**
 * Base annual premium rates per 1,000 THB of coverage.
 * Derived from Thai Standard Ordinary (TSO) mortality tables
 * and typical Thai insurer pricing structures.
 *
 * Rates increase with age reflecting higher mortality risk.
 */
function getBaseRate(age: number, gender: Gender, planType: InsurancePlanType): number {
  // Age-based mortality factor (per 1,000 THB coverage, annual)
  const ageFactor = getAgeFactor(age, gender);

  // Plan type base multiplier
  switch (planType) {
    case 'endowment':
      // Endowment: higher premium because it includes savings component
      // Returns sum assured at maturity
      return ageFactor * 2.8 + 18;
    case 'wholeLife':
      // Whole life: moderate premium, lifetime coverage
      return ageFactor * 2.2 + 8;
    case 'term':
      // Term life: pure protection, lowest premium
      return ageFactor * 1.0;
  }
}

/**
 * Age-based mortality factor per 1,000 THB.
 * Approximation based on TSO mortality table patterns.
 * Female rates are ~15-20% lower reflecting longer life expectancy.
 */
function getAgeFactor(age: number, gender: Gender): number {
  const genderDiscount = gender === 'female' ? 0.82 : 1.0;

  if (age <= 20) return 1.8 * genderDiscount;
  if (age <= 25) return 2.0 * genderDiscount;
  if (age <= 30) return 2.5 * genderDiscount;
  if (age <= 35) return 3.2 * genderDiscount;
  if (age <= 40) return 4.5 * genderDiscount;
  if (age <= 45) return 6.5 * genderDiscount;
  if (age <= 50) return 9.5 * genderDiscount;
  if (age <= 55) return 14.0 * genderDiscount;
  if (age <= 60) return 20.0 * genderDiscount;
  if (age <= 65) return 28.0 * genderDiscount;
  return 38.0 * genderDiscount;
}

/**
 * Policy term adjustment — shorter terms have slightly higher per-year cost
 * for endowment due to compressed savings; longer terms cost more for term life.
 */
function getTermAdjustment(policyTerm: number, planType: InsurancePlanType): number {
  if (planType === 'wholeLife') return 1.0; // whole life ignores term

  if (planType === 'endowment') {
    if (policyTerm <= 10) return 1.35;
    if (policyTerm <= 15) return 1.10;
    if (policyTerm <= 20) return 1.0;
    return 0.95;
  }

  // Term life — longer terms slightly more expensive
  if (policyTerm <= 5) return 0.85;
  if (policyTerm <= 10) return 1.0;
  if (policyTerm <= 15) return 1.10;
  if (policyTerm <= 20) return 1.18;
  return 1.25;
}

/** Maturity benefit (endowment only) */
function getMaturityBenefit(coverageAmount: number, planType: InsurancePlanType): number {
  if (planType === 'endowment') return coverageAmount;
  return 0;
}

/**
 * Tax deduction — life insurance premiums are deductible up to 100,000 THB/year
 * per Revenue Department regulations.
 */
function getTaxDeduction(annualPremium: number): number {
  return Math.min(annualPremium, 100000);
}

export function calculateLifeInsurance(input: LifeInsuranceInput): LifeInsuranceResult {
  const { age, gender, coverageAmount, planType, policyTerm, paymentFrequency } = input;

  const effectiveTerm = planType === 'wholeLife' ? (90 - age) : policyTerm;
  const paymentYears = planType === 'wholeLife' ? Math.min(20, effectiveTerm) : policyTerm;

  const baseRate = getBaseRate(age, gender, planType);
  const termAdj = getTermAdjustment(policyTerm, planType);
  const frequencyLoading = FREQUENCY_LOADING[paymentFrequency];
  const periodsPerYear = PERIODS_PER_YEAR[paymentFrequency];

  // Annual premium before frequency loading
  const ratePerThousand = baseRate * termAdj;
  const annualPremiumBase = (coverageAmount / 1000) * ratePerThousand;
  const annualPremium = Math.round(annualPremiumBase * frequencyLoading);

  // Per-period premium
  const premiumPerPeriod = Math.round(annualPremium / periodsPerYear);

  // Total premium over policy life
  const totalPremium = annualPremium * paymentYears;

  return {
    planType,
    planTypeName: PLAN_TYPE_NAMES[planType],
    premiumPerPeriod,
    annualPremium,
    totalPremium,
    coverageAmount,
    policyTerm: effectiveTerm,
    paymentFrequency,
    paymentFrequencyName: FREQUENCY_NAMES[paymentFrequency],
    periodsPerYear,
    totalPaymentYears: paymentYears,
    maturityBenefit: getMaturityBenefit(coverageAmount, planType),
    deathBenefit: coverageAmount,
    taxDeduction: getTaxDeduction(annualPremium),
    ratePerThousand: Math.round(ratePerThousand * 100) / 100,
  };
}

/** Calculate all 3 plan types for comparison */
export function calculateAllPlans(input: Omit<LifeInsuranceInput, 'planType'>): ComparisonResult {
  const plans: InsurancePlanType[] = ['endowment', 'wholeLife', 'term'];
  return {
    plans: plans.map((planType) => calculateLifeInsurance({ ...input, planType })),
    inputSummary: {
      age: input.age,
      gender: input.gender,
      genderName: input.gender === 'male' ? 'ชาย' : 'หญิง',
      coverageAmount: input.coverageAmount,
      policyTerm: input.policyTerm,
      paymentFrequency: input.paymentFrequency,
      paymentFrequencyName: FREQUENCY_NAMES[input.paymentFrequency],
    },
  };
}
