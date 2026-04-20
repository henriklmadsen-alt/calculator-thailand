export type CropType = 'rice' | 'cassava' | 'corn';

export interface CropYieldInput {
  cropType: CropType;
  raiSize: number;
  pricePerUnit: number;
}

export interface CropYieldResult {
  cropType: CropType;
  raiSize: number;
  estimatedYield: number;
  pricePerUnit: number;
  estimatedIncome: number;
}

export function calculateCropYield(input: CropYieldInput): CropYieldResult {
  const yieldPerRai: Record<CropType, number> = {
    rice: 450,
    cassava: 4000,
    corn: 800,
  };

  const yield_ = input.raiSize * yieldPerRai[input.cropType];
  const income = yield_ * input.pricePerUnit;

  return {
    cropType: input.cropType,
    raiSize: input.raiSize,
    estimatedYield: Math.round(yield_),
    pricePerUnit: input.pricePerUnit,
    estimatedIncome: Math.round(income),
  };
}

export const EXAMPLE_1 = calculateCropYield({ cropType: 'rice', raiSize: 10, pricePerUnit: 6 });
export const EXAMPLE_2 = calculateCropYield({ cropType: 'cassava', raiSize: 15, pricePerUnit: 3.5 });
export const EXAMPLE_3 = calculateCropYield({ cropType: 'corn', raiSize: 20, pricePerUnit: 5 });
