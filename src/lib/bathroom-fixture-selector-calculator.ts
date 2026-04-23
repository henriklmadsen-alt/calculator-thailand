export interface BathroomFixtureSelectorInput {
  sinkCost: number;
  toiletCost: number;
  showerCost: number;
  bathtubCost: number;
}

export interface BathroomFixtureSelectorResult {
  sinkCost: number;
  toiletCost: number;
  showerCost: number;
  bathtubCost: number;
  result: number;
}

export function calculateBathroomFixtureSelector(input: BathroomFixtureSelectorInput): BathroomFixtureSelectorResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    sinkCost: input.sinkCost,
    toiletCost: input.toiletCost,
    showerCost: input.showerCost,
    bathtubCost: input.bathtubCost,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateBathroomFixtureSelector({
  sinkCost: 8000, toiletCost: 12000, showerCost: 15000, bathtubCost: 20000,
});

export const EXAMPLE_2 = calculateBathroomFixtureSelector({
  sinkCost: 15000, toiletCost: 20000, showerCost: 25000, bathtubCost: 35000,
});

export const EXAMPLE_3 = calculateBathroomFixtureSelector({
  sinkCost: 12000, toiletCost: 16000, showerCost: 20000, bathtubCost: 28000,
});

