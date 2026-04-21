// Pet insurance premium calculator (KLC-0630)
// Monthly insurance cost estimates for pets in Thailand

export type PetType = 'dog' | 'cat';
export type Coverage = 'basic' | 'standard' | 'premium';

export interface PetInsuranceInput {
  petType: PetType;
  coverage: Coverage;
  age: number; // years
}

export interface PetInsuranceResult {
  monthlyPremium: number;
  annualPremium: number;
  annualLimit: number;
}

const INSURANCE_RATES: Record<PetType, Record<Coverage, { monthly: number; limit: number }>> = {
  dog: {
    basic: { monthly: 300, limit: 50000 },
    standard: { monthly: 600, limit: 150000 },
    premium: { monthly: 1200, limit: 500000 },
  },
  cat: {
    basic: { monthly: 200, limit: 40000 },
    standard: { monthly: 400, limit: 120000 },
    premium: { monthly: 800, limit: 400000 },
  },
};

export function calculatePetInsurance(input: PetInsuranceInput): PetInsuranceResult {
  const { petType, coverage, age } = input;

  if (age < 1 || age > 15) throw new Error('Age must be 1–15 years');

  const rates = INSURANCE_RATES[petType][coverage];
  // Age increases premium by 5% per year over age 7
  const ageMultiplier = age > 7 ? 1 + (age - 7) * 0.05 : 1;
  const monthlyPremium = Math.round(rates.monthly * ageMultiplier);
  const annualPremium = monthlyPremium * 12;

  return {
    monthlyPremium,
    annualPremium,
    annualLimit: rates.limit,
  };
}
