export interface EntertainmentMusicInput {
  djIncluded: boolean;
  djCost?: number;
  liveBandIncluded: boolean;
  liveBandCost?: number;
  musicianCount: number;
  musicianFeePerPerson: number;
  entertainmentDurationHours: number;
  durationOverageRate?: number;
  audioEquipmentCost: number;
}

export interface EntertainmentMusicResult {
  djCost: number;
  liveBandCost: number;
  musicianCost: number;
  durationOverageCost: number;
  audioEquipmentCost: number;
  totalEntertainmentCost: number;
}

export function calculateEntertainmentMusic(input: EntertainmentMusicInput): EntertainmentMusicResult {
  const djCost = input.djIncluded ? (input.djCost || 0) : 0;
  const liveBandCost = input.liveBandIncluded ? (input.liveBandCost || 0) : 0;
  const musicianCost = Math.round(input.musicianCount * input.musicianFeePerPerson);
  const durationOverageCost = Math.round(input.entertainmentDurationHours * (input.durationOverageRate || 0));
  const totalEntertainmentCost = Math.round(
    djCost + liveBandCost + musicianCost + durationOverageCost + input.audioEquipmentCost
  );

  return {
    djCost,
    liveBandCost,
    musicianCost,
    durationOverageCost,
    audioEquipmentCost: input.audioEquipmentCost,
    totalEntertainmentCost,
  };
}

export const EXAMPLE_1 = calculateEntertainmentMusic({
  djIncluded: true,
  djCost: 3000,
  liveBandIncluded: false,
  musicianCount: 0,
  musicianFeePerPerson: 0,
  entertainmentDurationHours: 4,
  audioEquipmentCost: 2000,
});

export const EXAMPLE_2 = calculateEntertainmentMusic({
  djIncluded: true,
  djCost: 4000,
  liveBandIncluded: true,
  liveBandCost: 8000,
  musicianCount: 2,
  musicianFeePerPerson: 1000,
  entertainmentDurationHours: 6,
  durationOverageRate: 500,
  audioEquipmentCost: 3000,
});

export const EXAMPLE_3 = calculateEntertainmentMusic({
  djIncluded: false,
  liveBandIncluded: true,
  liveBandCost: 12000,
  musicianCount: 4,
  musicianFeePerPerson: 1500,
  entertainmentDurationHours: 8,
  durationOverageRate: 600,
  audioEquipmentCost: 4000,
});
