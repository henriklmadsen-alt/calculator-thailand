export interface EquipmentRentalInput {
  chairQuantity: number;
  chairCost: number;
  tableQuantity: number;
  tableCost: number;
  tentQuantity: number;
  tentCost: number;
  canopyQuantity: number;
  canopyCost: number;
  deliveryCost: number;
  setupLaborCost: number;
}

export interface EquipmentRentalResult {
  chairCost: number;
  tableCost: number;
  tentCost: number;
  canopyCost: number;
  deliveryCost: number;
  setupLaborCost: number;
  totalEquipmentCost: number;
}

export function calculateEquipmentRental(input: EquipmentRentalInput): EquipmentRentalResult {
  const totalEquipmentCost = Math.round(
    input.chairCost +
    input.tableCost +
    input.tentCost +
    input.canopyCost +
    input.deliveryCost +
    input.setupLaborCost
  );

  return {
    chairCost: input.chairCost,
    tableCost: input.tableCost,
    tentCost: input.tentCost,
    canopyCost: input.canopyCost,
    deliveryCost: input.deliveryCost,
    setupLaborCost: input.setupLaborCost,
    totalEquipmentCost,
  };
}

export const EXAMPLE_1 = calculateEquipmentRental({
  chairQuantity: 30,
  chairCost: 3000,
  tableQuantity: 8,
  tableCost: 3000,
  tentQuantity: 1,
  tentCost: 5000,
  canopyQuantity: 0,
  canopyCost: 0,
  deliveryCost: 2000,
  setupLaborCost: 2000,
});

export const EXAMPLE_2 = calculateEquipmentRental({
  chairQuantity: 60,
  chairCost: 6000,
  tableQuantity: 15,
  tableCost: 6000,
  tentQuantity: 2,
  tentCost: 10000,
  canopyQuantity: 2,
  canopyCost: 4000,
  deliveryCost: 3000,
  setupLaborCost: 3000,
});

export const EXAMPLE_3 = calculateEquipmentRental({
  chairQuantity: 100,
  chairCost: 10000,
  tableQuantity: 25,
  tableCost: 10000,
  tentQuantity: 3,
  tentCost: 15000,
  canopyQuantity: 3,
  canopyCost: 6000,
  deliveryCost: 5000,
  setupLaborCost: 5000,
});
