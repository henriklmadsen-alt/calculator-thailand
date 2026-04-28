export interface MenuPlanningInput {
  guestCount: number;
  appetizerItemCount: number;
  appetizerUnitPrice: number;
  mainCourseItemCount: number;
  mainCourseUnitPrice: number;
  dessertItemCount: number;
  dessertUnitPrice: number;
  beverageItemCount: number;
  beverageUnitPrice: number;
}

export interface MenuPlanningResult {
  appetizerCost: number;
  mainCourseCost: number;
  dessertCost: number;
  beverageCost: number;
  totalFoodCost: number;
  costPerGuest: number;
}

export function calculateMenuPlanning(input: MenuPlanningInput): MenuPlanningResult {
  const appetizerCost = Math.round(input.appetizerItemCount * input.appetizerUnitPrice * input.guestCount);
  const mainCourseCost = Math.round(input.mainCourseItemCount * input.mainCourseUnitPrice * input.guestCount);
  const dessertCost = Math.round(input.dessertItemCount * input.dessertUnitPrice * input.guestCount);
  const beverageCost = Math.round(input.beverageItemCount * input.beverageUnitPrice * input.guestCount);
  const totalFoodCost = Math.round(appetizerCost + mainCourseCost + dessertCost + beverageCost);
  const costPerGuest = Math.round(totalFoodCost / input.guestCount);

  return {
    appetizerCost,
    mainCourseCost,
    dessertCost,
    beverageCost,
    totalFoodCost,
    costPerGuest,
  };
}

export const EXAMPLE_1 = calculateMenuPlanning({
  guestCount: 50,
  appetizerItemCount: 2,
  appetizerUnitPrice: 50,
  mainCourseItemCount: 2,
  mainCourseUnitPrice: 150,
  dessertItemCount: 1,
  dessertUnitPrice: 30,
  beverageItemCount: 2,
  beverageUnitPrice: 40,
});

export const EXAMPLE_2 = calculateMenuPlanning({
  guestCount: 100,
  appetizerItemCount: 3,
  appetizerUnitPrice: 60,
  mainCourseItemCount: 2,
  mainCourseUnitPrice: 200,
  dessertItemCount: 1,
  dessertUnitPrice: 40,
  beverageItemCount: 2,
  beverageUnitPrice: 50,
});

export const EXAMPLE_3 = calculateMenuPlanning({
  guestCount: 150,
  appetizerItemCount: 3,
  appetizerUnitPrice: 70,
  mainCourseItemCount: 3,
  mainCourseUnitPrice: 250,
  dessertItemCount: 2,
  dessertUnitPrice: 50,
  beverageItemCount: 3,
  beverageUnitPrice: 60,
});
