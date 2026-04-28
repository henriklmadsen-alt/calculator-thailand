// Rabbit care cost calculator (KLC-0640)
export interface RabbitCareInput {
  rabbitCount: number;
}
export interface RabbitCareResult {
  feedCost: number;
  housing: number;
  vetCare: number;
  supplies: number;
  totalMonthly: number;
  totalAnnual: number;
}
export function calculateRabbitCare(input: RabbitCareInput): RabbitCareResult {
  const feedCost = 250 * input.rabbitCount;
  const housing = 1000;
  const vetCare = 300;
  const supplies = 200;
  const totalMonthly = feedCost + housing + vetCare + supplies;
  return {
    feedCost,
    housing,
    vetCare,
    supplies,
    totalMonthly,
    totalAnnual: totalMonthly * 12,
  };
}
