export interface CropInsuranceInput {
  cropValue: number; // THB - estimated crop value
  riskLevel: 'low' | 'medium' | 'high';
}

export interface CropInsuranceResult {
  cropValue: number;
  riskLevel: string;
  premiumRate: number; // percentage
  annualPremium: number;
  monthlyPremium: number;
  coverageAmount: number;
}

export function calculateCropInsurance(input: CropInsuranceInput): CropInsuranceResult {
  const rateMap: Record<string, number> = {
    low: 2.5,
    medium: 5,
    high: 8,
  };

  const rate = rateMap[input.riskLevel] || 5;
  const annualPremium = (input.cropValue * rate) / 100;
  const monthlyPremium = annualPremium / 12;

  return {
    cropValue: Math.round(input.cropValue),
    riskLevel: input.riskLevel === 'low' ? 'ต่ำ' : input.riskLevel === 'medium' ? 'ปานกลาง' : 'สูง',
    premiumRate: rate,
    annualPremium: Math.round(annualPremium),
    monthlyPremium: Math.round(monthlyPremium),
    coverageAmount: Math.round(input.cropValue * 0.8), // 80% coverage
  };
}

export const EXAMPLE_1 = calculateCropInsurance({ cropValue: 100000, riskLevel: 'low' });
export const EXAMPLE_2 = calculateCropInsurance({ cropValue: 200000, riskLevel: 'medium' });
export const EXAMPLE_3 = calculateCropInsurance({ cropValue: 300000, riskLevel: 'high' });
