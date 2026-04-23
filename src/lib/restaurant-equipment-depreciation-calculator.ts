export interface RestaurantEquipmentDepreciationInput {
  equipmentCost: number;
  usefulLifeYears: number;
  salvageValue: number;
}

export interface RestaurantEquipmentDepreciationResult {
  depreciableAmount: number;
  annualDepreciation: number;
  monthlyDepreciation: number;
  depreciationPercentage: number;
}

export function calculateRestaurantEquipmentDepreciation(input: RestaurantEquipmentDepreciationInput): RestaurantEquipmentDepreciationResult {
  const depreciableAmount = Math.round(input.equipmentCost - input.salvageValue);
  const annualDepreciation = Math.round(depreciableAmount / input.usefulLifeYears);
  const monthlyDepreciation = Math.round(annualDepreciation / 12);
  const depreciationPercentage = Math.round((annualDepreciation / input.equipmentCost) * 100);

  return {
    depreciableAmount,
    annualDepreciation,
    monthlyDepreciation,
    depreciationPercentage,
  };
}

export const EXAMPLE_1 = calculateRestaurantEquipmentDepreciation({
  equipmentCost: 500000,
  usefulLifeYears: 10,
  salvageValue: 50000,
});

export const EXAMPLE_2 = calculateRestaurantEquipmentDepreciation({
  equipmentCost: 1000000,
  usefulLifeYears: 8,
  salvageValue: 100000,
});

export const EXAMPLE_3 = calculateRestaurantEquipmentDepreciation({
  equipmentCost: 750000,
  usefulLifeYears: 10,
  salvageValue: 75000,
});
