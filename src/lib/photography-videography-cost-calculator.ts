export interface PhotographyVideoInput {
  hourlyRate: number;
  hours: number;
  videographerIncluded: boolean;
  videographerCost?: number;
  printPackageCost?: number;
}

export interface PhotographyVideoResult {
  photographyCost: number;
  videographerCost: number;
  printPackageCost: number;
  totalPhotographyCost: number;
}

export function calculatePhotographyVideo(input: PhotographyVideoInput): PhotographyVideoResult {
  const photographyCost = Math.round(input.hourlyRate * input.hours);
  const videographerCost = input.videographerIncluded ? (input.videographerCost || 0) : 0;
  const printPackageCost = input.printPackageCost || 0;
  const totalPhotographyCost = Math.round(photographyCost + videographerCost + printPackageCost);

  return {
    photographyCost,
    videographerCost,
    printPackageCost,
    totalPhotographyCost,
  };
}

export const EXAMPLE_1 = calculatePhotographyVideo({
  hourlyRate: 800,
  hours: 4,
  videographerIncluded: false,
  printPackageCost: 2000,
});

export const EXAMPLE_2 = calculatePhotographyVideo({
  hourlyRate: 1200,
  hours: 6,
  videographerIncluded: true,
  videographerCost: 5000,
  printPackageCost: 3000,
});

export const EXAMPLE_3 = calculatePhotographyVideo({
  hourlyRate: 1500,
  hours: 8,
  videographerIncluded: true,
  videographerCost: 7000,
  printPackageCost: 5000,
});
