// Pet cost (ค่าเลี้ยงสัตว์) monthly estimator — Thai market prices.
// No official government formula; estimates based on typical pet market
// prices in Thailand (2569) from veterinary clinics, pet shops, and surveys.

export type PetType = 'dog' | 'cat';
export type DogSize = 'small' | 'medium' | 'large';
export type FoodQuality = 'budget' | 'standard' | 'premium';

export interface PetCostInput {
  petType: PetType;
  /** Dog size — only used when petType is 'dog' */
  dogSize?: DogSize;
  /** Number of pets (1–10) */
  petCount: number;
  /** Food quality tier */
  foodQuality: FoodQuality;
  /** Include grooming costs */
  includeGrooming: boolean;
  /** Include pet insurance estimate */
  includeInsurance: boolean;
}

export interface PetCostResult {
  /** Monthly food cost per pet */
  foodPerPet: number;
  /** Monthly veterinary cost per pet (averaged from annual) */
  vetPerPet: number;
  /** Monthly grooming cost per pet (0 if not included) */
  groomingPerPet: number;
  /** Monthly supplies/accessories per pet */
  suppliesPerPet: number;
  /** Monthly litter cost per pet (cats only) */
  litterPerPet: number;
  /** Monthly insurance per pet (0 if not included) */
  insurancePerPet: number;
  /** Total monthly cost per pet */
  totalPerPet: number;
  /** Total monthly cost for all pets */
  totalMonthly: number;
  /** Estimated annual cost for all pets */
  totalAnnual: number;
  /** Number of pets */
  petCount: number;
}

// ── Thai market price data (THB/month, 2569 estimates) ──

interface PriceRange {
  budget: number;
  standard: number;
  premium: number;
}

interface PetPriceProfile {
  food: PriceRange;
  vet: number;        // monthly average (annual ÷ 12)
  grooming: number;   // per month
  supplies: number;   // toys, beds, bowls, leash — averaged
  litter: number;     // cats only (monthly)
  insurance: number;  // monthly estimate
}

const DOG_PRICES: Record<DogSize, PetPriceProfile> = {
  small: {
    food: { budget: 800, standard: 1500, premium: 2500 },
    vet: 500,
    grooming: 500,
    supplies: 300,
    litter: 0,
    insurance: 400,
  },
  medium: {
    food: { budget: 1200, standard: 2200, premium: 3500 },
    vet: 700,
    grooming: 800,
    supplies: 400,
    litter: 0,
    insurance: 550,
  },
  large: {
    food: { budget: 2000, standard: 3500, premium: 5500 },
    vet: 900,
    grooming: 1200,
    supplies: 500,
    litter: 0,
    insurance: 700,
  },
};

const CAT_PRICES: PetPriceProfile = {
  food: { budget: 600, standard: 1200, premium: 2200 },
  vet: 450,
  grooming: 350,
  supplies: 250,
  litter: 400,
  insurance: 350,
};

export function calculatePetCost(input: PetCostInput): PetCostResult {
  const { petType, dogSize, petCount, foodQuality, includeGrooming, includeInsurance } = input;

  if (petCount < 1 || petCount > 10 || !Number.isInteger(petCount)) {
    throw new Error('Pet count must be an integer between 1 and 10');
  }

  const profile: PetPriceProfile =
    petType === 'dog' ? DOG_PRICES[dogSize || 'medium'] : CAT_PRICES;

  const foodPerPet = profile.food[foodQuality];
  const vetPerPet = profile.vet;
  const groomingPerPet = includeGrooming ? profile.grooming : 0;
  const suppliesPerPet = profile.supplies;
  const litterPerPet = petType === 'cat' ? profile.litter : 0;
  const insurancePerPet = includeInsurance ? profile.insurance : 0;

  const totalPerPet =
    foodPerPet + vetPerPet + groomingPerPet + suppliesPerPet + litterPerPet + insurancePerPet;

  const totalMonthly = totalPerPet * petCount;
  const totalAnnual = totalMonthly * 12;

  return {
    foodPerPet,
    vetPerPet,
    groomingPerPet,
    suppliesPerPet,
    litterPerPet,
    insurancePerPet,
    totalPerPet,
    totalMonthly,
    totalAnnual,
    petCount,
  };
}
