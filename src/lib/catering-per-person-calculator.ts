export interface CateringPerPersonInput {
  numberOfGuests: number;
  foodCostPerPerson: number;
  beverageCostPerPerson: number;
  serviceChargePercentage: number;
  decorationRentPercentage: number;
  staffingCostPercentage: number;
}

export interface CateringPerPersonResult {
  foodCostTotal: number;
  beverageCostTotal: number;
  subtotal: number;
  serviceCharge: number;
  decorationRent: number;
  staffingCost: number;
  totalCateringCost: number;
  costPerPerson: number;
}

export function calculateCateringPerPerson(input: CateringPerPersonInput): CateringPerPersonResult {
  const foodCostTotal = Math.round(input.numberOfGuests * input.foodCostPerPerson);
  const beverageCostTotal = Math.round(input.numberOfGuests * input.beverageCostPerPerson);
  const subtotal = Math.round(foodCostTotal + beverageCostTotal);

  const serviceCharge = Math.round(subtotal * (input.serviceChargePercentage / 100));
  const decorationRent = Math.round(subtotal * (input.decorationRentPercentage / 100));
  const staffingCost = Math.round(subtotal * (input.staffingCostPercentage / 100));

  const totalCateringCost = Math.round(subtotal + serviceCharge + decorationRent + staffingCost);
  const costPerPerson = Math.round(totalCateringCost / input.numberOfGuests);

  return {
    foodCostTotal,
    beverageCostTotal,
    subtotal,
    serviceCharge,
    decorationRent,
    staffingCost,
    totalCateringCost,
    costPerPerson,
  };
}

export const EXAMPLE_1 = calculateCateringPerPerson({
  numberOfGuests: 100,
  foodCostPerPerson: 150,
  beverageCostPerPerson: 50,
  serviceChargePercentage: 10,
  decorationRentPercentage: 5,
  staffingCostPercentage: 15,
});

export const EXAMPLE_2 = calculateCateringPerPerson({
  numberOfGuests: 200,
  foodCostPerPerson: 180,
  beverageCostPerPerson: 60,
  serviceChargePercentage: 12,
  decorationRentPercentage: 8,
  staffingCostPercentage: 18,
});

export const EXAMPLE_3 = calculateCateringPerPerson({
  numberOfGuests: 150,
  foodCostPerPerson: 170,
  beverageCostPerPerson: 55,
  serviceChargePercentage: 11,
  decorationRentPercentage: 6,
  staffingCostPercentage: 16,
});
