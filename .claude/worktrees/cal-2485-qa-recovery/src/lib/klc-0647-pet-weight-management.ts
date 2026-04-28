// Pet weight management calculator (KLC-0647)
export interface PetWeightInput {
  currentWeight: number;
  targetWeight: number;
  currentFoodCost: number;
}
export interface PetWeightResult {
  weightToLose: number;
  recommendedFoodCost: number;
  moneySavedPerMonth: number;
  moneySavedPerYear: number;
}
export function calculatePetWeightManagement(input: PetWeightInput): PetWeightResult {
  const weightToLose = input.currentWeight - input.targetWeight;
  const reduction = weightToLose / input.currentWeight;
  const recommendedFoodCost = input.currentFoodCost * (1 - reduction);
  const moneySavedPerMonth = input.currentFoodCost - recommendedFoodCost;
  return {
    weightToLose,
    recommendedFoodCost,
    moneySavedPerMonth,
    moneySavedPerYear: moneySavedPerMonth * 12,
  };
}
