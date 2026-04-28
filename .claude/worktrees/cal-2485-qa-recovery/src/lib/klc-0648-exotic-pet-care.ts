// Exotic pet care cost calculator (KLC-0648)
export type ExoticPetType = 'reptile' | 'small-mammal' | 'exotic-bird';
export interface ExoticPetInput {
  petType: ExoticPetType;
  petCount: number;
}
export interface ExoticPetResult {
  feedCost: number;
  vetCare: number;
  housing: number;
  supplies: number;
  totalMonthly: number;
  totalAnnual: number;
}
const EXOTIC_COSTS: Record<ExoticPetType, any> = {
  reptile: { feed: 500, vet: 1000, housing: 1500, supplies: 300 },
  'small-mammal': { feed: 300, vet: 800, housing: 1000, supplies: 200 },
  'exotic-bird': { feed: 600, vet: 1200, housing: 2000, supplies: 400 },
};
export function calculateExoticPetCare(input: ExoticPetInput): ExoticPetResult {
  const costs = EXOTIC_COSTS[input.petType];
  const feedCost = costs.feed * input.petCount;
  const vetCare = costs.vet;
  const housing = costs.housing;
  const supplies = costs.supplies;
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
