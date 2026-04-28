export interface FoodDeliveryCostInput {
  baseFee: number;
  distanceKm: number;
  distanceFeePerKm: number;
  smallOrderFee: number;
  orderValue: number;
  deliveryFeePercentage: number;
  packagingMaterials: number;
}

export interface FoodDeliveryCostResult {
  baseFee: number;
  distanceFee: number;
  smallOrderFee: number;
  percentageFee: number;
  packagingCost: number;
  totalDeliveryCost: number;
  deliveryFeePercentageOfOrder: number;
  suggestedMinimumOrder: number;
}

export function calculateFoodDeliveryCost(input: FoodDeliveryCostInput): FoodDeliveryCostResult {
  const baseFee = Math.round(input.baseFee);
  const distanceFee = Math.round(input.distanceKm * input.distanceFeePerKm);
  const smallOrderFee = input.orderValue < 200 ? input.smallOrderFee : 0;
  const percentageFee = Math.round(input.orderValue * (input.deliveryFeePercentage / 100));
  const packagingCost = Math.round(input.packagingMaterials);

  const totalDeliveryCost = Math.round(baseFee + distanceFee + smallOrderFee + percentageFee + packagingCost);
  const deliveryFeePercentageOfOrder = input.orderValue > 0 ? Math.round((totalDeliveryCost / input.orderValue) * 100) : 0;
  const suggestedMinimumOrder = Math.round(totalDeliveryCost * 3); // Ensure 33% margin

  return {
    baseFee,
    distanceFee,
    smallOrderFee,
    percentageFee,
    packagingCost,
    totalDeliveryCost,
    deliveryFeePercentageOfOrder,
    suggestedMinimumOrder,
  };
}

export const EXAMPLE_1 = calculateFoodDeliveryCost({
  baseFee: 30,
  distanceKm: 5,
  distanceFeePerKm: 10,
  smallOrderFee: 30,
  orderValue: 300,
  deliveryFeePercentage: 2,
  packagingMaterials: 20,
});

export const EXAMPLE_2 = calculateFoodDeliveryCost({
  baseFee: 40,
  distanceKm: 8,
  distanceFeePerKm: 12,
  smallOrderFee: 40,
  orderValue: 500,
  deliveryFeePercentage: 3,
  packagingMaterials: 30,
});

export const EXAMPLE_3 = calculateFoodDeliveryCost({
  baseFee: 35,
  distanceKm: 6,
  distanceFeePerKm: 11,
  smallOrderFee: 35,
  orderValue: 400,
  deliveryFeePercentage: 2.5,
  packagingMaterials: 25,
});
