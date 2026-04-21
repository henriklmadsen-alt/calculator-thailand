// Bird care cost calculator (KLC-0639)
export interface BirdCareInput {
  birdCount: number;
}
export interface BirdCareResult {
  feedCost: number;
  vetCare: number;
  housing: number;
  supplies: number;
  totalMonthly: number;
  totalAnnual: number;
}
export function calculateBirdCareCost(input: BirdCareInput): BirdCareResult {
  const feedCost = 300 * input.birdCount;
  const vetCare = 200;
  const housing = 500;
  const supplies = 200;
  const totalMonthly = feedCost + vetCare + housing + supplies;
  return {
    feedCost,
    vetCare,
    housing,
    supplies,
    totalMonthly,
    totalAnnual: totalMonthly * 12,
  };
}
