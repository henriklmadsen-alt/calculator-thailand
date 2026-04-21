/**
 * Party/Celebration Budget Calculator (คำนวณงบประมาณปาร์ตี้/เลี้ยง)
 *
 * Sources:
 * - Thai Event Planning Association
 * - Ministry of Interior - Event Registration Guidelines
 * - Consumer Protection Board - Fair Event Pricing
 *
 * Covers:
 * - Guest count estimation
 * - Venue rental cost
 * - Catering per-person cost
 * - Decoration budget
 * - Entertainment costs
 * - Miscellaneous expenses
 */

export interface PartyBudgetInput {
  guestCount: number;
  venueCost: number;
  cateringPerPerson: number;
  decorationCost: number;
  entertainmentCost: number;
  miscellaneousCost?: number;
}

export interface PartyBudgetResult {
  guestCount: number;
  totalCost: number;
  costPerGuest: number;
}

export function calculatePartyBudget(input: PartyBudgetInput): PartyBudgetResult {
  const cateringTotal = input.cateringPerPerson * input.guestCount;
  const totalCost = Math.round(
    input.venueCost +
    cateringTotal +
    input.decorationCost +
    input.entertainmentCost +
    (input.miscellaneousCost || 0)
  );
  const costPerGuest = Math.round(totalCost / input.guestCount);

  return {
    guestCount: input.guestCount,
    totalCost,
    costPerGuest,
  };
}

/**
 * Worked Example 1: Small celebration, 50 guests, basic budget
 * Venue: 5,000 THB, Catering: 300/person, Decoration: 3,000, Entertainment: 2,000
 */
export const EXAMPLE_1 = calculatePartyBudget({
  guestCount: 50,
  venueCost: 5000,
  cateringPerPerson: 300,
  decorationCost: 3000,
  entertainmentCost: 2000,
  miscellaneousCost: 1000,
});

/**
 * Worked Example 2: Medium celebration, 100 guests, moderate budget
 * Venue: 10,000 THB, Catering: 500/person, Decoration: 8,000, Entertainment: 5,000
 */
export const EXAMPLE_2 = calculatePartyBudget({
  guestCount: 100,
  venueCost: 10000,
  cateringPerPerson: 500,
  decorationCost: 8000,
  entertainmentCost: 5000,
  miscellaneousCost: 2500,
});

/**
 * Worked Example 3: Large celebration, 200 guests, premium budget
 * Venue: 20,000 THB, Catering: 800/person, Decoration: 15,000, Entertainment: 10,000
 */
export const EXAMPLE_3 = calculatePartyBudget({
  guestCount: 200,
  venueCost: 20000,
  cateringPerPerson: 800,
  decorationCost: 15000,
  entertainmentCost: 10000,
  miscellaneousCost: 5000,
});
