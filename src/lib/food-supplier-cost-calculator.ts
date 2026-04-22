export interface FoodSupplierInput {
  orderedQuantity: number;
  pricePerUnit: number;
  shippingCost: number;
  storageFeesPerMonth: number;
  handlingProcessingCost: number;
}

export interface FoodSupplierResult {
  productCost: number;
  totalAcquisitionCost: number;
  costPerUnit: number;
  monthlyStorageCost: number;
  totalCostWithStorage: number;
  wasteAllowancePercentage: number;
  netCostPerUnit: number;
}

export function calculateFoodSupplier(input: FoodSupplierInput): FoodSupplierResult {
  const productCost = Math.round(input.orderedQuantity * input.pricePerUnit);
  const totalAcquisitionCost = Math.round(
    productCost + input.shippingCost + input.handlingProcessingCost
  );
  const costPerUnit = Math.round(totalAcquisitionCost / input.orderedQuantity);
  const monthlyStorageCost = Math.round(input.storageFeesPerMonth);
  const totalCostWithStorage = Math.round(totalAcquisitionCost + monthlyStorageCost);

  const wasteAllowancePercentage = 5; // Standard 5% waste allowance
  const netCostPerUnit = Math.round((totalCostWithStorage / input.orderedQuantity) * (1 + wasteAllowancePercentage / 100));

  return {
    productCost,
    totalAcquisitionCost,
    costPerUnit,
    monthlyStorageCost,
    totalCostWithStorage,
    wasteAllowancePercentage,
    netCostPerUnit,
  };
}

export const EXAMPLE_1 = calculateFoodSupplier({
  orderedQuantity: 500,
  pricePerUnit: 100,
  shippingCost: 5000,
  storageFeesPerMonth: 3000,
  handlingProcessingCost: 2000,
});

export const EXAMPLE_2 = calculateFoodSupplier({
  orderedQuantity: 1000,
  pricePerUnit: 150,
  shippingCost: 8000,
  storageFeesPerMonth: 5000,
  handlingProcessingCost: 3500,
});

export const EXAMPLE_3 = calculateFoodSupplier({
  orderedQuantity: 750,
  pricePerUnit: 120,
  shippingCost: 6000,
  storageFeesPerMonth: 4000,
  handlingProcessingCost: 2500,
});
