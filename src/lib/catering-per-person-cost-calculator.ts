/**
 * Catering Per-Person Cost Calculator (คำนวณค่าเลี้ยงต่อคน)
 */

export interface CateringPerPersonInput {
  totalCateringBudget: number;
  numberOfGuests: number;
}

export interface CateringPerPersonResult {
  totalCateringBudget: number;
  numberOfGuests: number;
  perPersonCost: number;
}

export function calculateCateringPerPerson(input: CateringPerPersonInput): CateringPerPersonResult {
  const perPersonCost = Math.round(input.totalCateringBudget / input.numberOfGuests);

  return {
    totalCateringBudget: input.totalCateringBudget,
    numberOfGuests: input.numberOfGuests,
    perPersonCost,
  };
}

export const EXAMPLE_1 = calculateCateringPerPerson({
  totalCateringBudget: 15000,
  numberOfGuests: 50,
});

export const EXAMPLE_2 = calculateCateringPerPerson({
  totalCateringBudget: 40000,
  numberOfGuests: 100,
});

export const EXAMPLE_3 = calculateCateringPerPerson({
  totalCateringBudget: 100000,
  numberOfGuests: 200,
});
