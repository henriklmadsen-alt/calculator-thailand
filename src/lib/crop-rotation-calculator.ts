export interface CropRotationInput {
  totalRai: number;
  yearsCycle: number;
}

export interface CropRotationResult {
  raiPerCrop: number;
  rotation1Income: number;
  rotation2Income: number;
  totalIncome: number;
}

export function calculateCropRotation(input: CropRotationInput): CropRotationResult {
  const raiPerCrop = input.totalRai / 3;
  const rotation1Income = raiPerCrop * 450 * 6;
  const rotation2Income = raiPerCrop * 4000 * 3.5;
  const totalIncome = (rotation1Income + rotation2Income) * input.yearsCycle;

  return {
    raiPerCrop: Math.round(raiPerCrop),
    rotation1Income: Math.round(rotation1Income),
    rotation2Income: Math.round(rotation2Income),
    totalIncome: Math.round(totalIncome),
  };
}

export const EXAMPLE_1 = calculateCropRotation({ totalRai: 30, yearsCycle: 1 });
export const EXAMPLE_2 = calculateCropRotation({ totalRai: 60, yearsCycle: 3 });
