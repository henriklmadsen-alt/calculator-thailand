// Travel Cost Calculator — คำนวณค่าเดินทาง
// Estimates total travel budget for Thai outbound travelers

export type TripType = 'budget' | 'moderate' | 'luxury';

export interface TravelCostInput {
  destination: string;
  days: number;
  travelers: number;
  tripType: TripType;
  flightCost: number;       // round-trip per person
  hotelCostPerNight: number; // per room per night
  foodPerDay: number;        // per person per day
  transportPerDay: number;   // per person per day
  insurance: number;         // per person for entire trip
  activities: number;        // per person for entire trip
  rooms: number;             // number of rooms (default 1)
}

export interface TravelCostBreakdownItem {
  category: string;
  label: string;
  unitCost: number;
  unitLabel: string;
  quantity: number;
  total: number;
}

export interface TravelCostResult {
  destination: string;
  days: number;
  nights: number;
  travelers: number;
  rooms: number;
  tripType: TripType;
  breakdown: TravelCostBreakdownItem[];
  grandTotal: number;
  perPerson: number;
  perPersonPerDay: number;
}

export const DESTINATIONS = [
  { value: 'japan', label: 'ญี่ปุ่น' },
  { value: 'south_korea', label: 'เกาหลีใต้' },
  { value: 'china', label: 'จีน' },
  { value: 'vietnam', label: 'เวียดนาม' },
  { value: 'singapore', label: 'สิงคโปร์' },
  { value: 'malaysia', label: 'มาเลเซีย' },
  { value: 'indonesia', label: 'อินโดนีเซีย' },
  { value: 'philippines', label: 'ฟิลิปปินส์' },
  { value: 'india', label: 'อินเดีย' },
  { value: 'europe', label: 'ยุโรป' },
  { value: 'australia', label: 'ออสเตรเลีย' },
  { value: 'usa', label: 'สหรัฐอเมริกา' },
  { value: 'other', label: 'อื่นๆ' },
] as const;

export const TRIP_TYPES = [
  { value: 'budget', label: 'ประหยัด' },
  { value: 'moderate', label: 'ปานกลาง' },
  { value: 'luxury', label: 'หรูหรา' },
] as const;

function sanitize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateTravelCost(input: TravelCostInput): TravelCostResult {
  const days = Math.max(1, Math.round(sanitize(input.days)));
  const nights = Math.max(0, days - 1);
  const travelers = Math.max(1, Math.round(sanitize(input.travelers)));
  const rooms = Math.max(1, Math.round(sanitize(input.rooms)));

  const flightCost = sanitize(input.flightCost);
  const hotelCostPerNight = sanitize(input.hotelCostPerNight);
  const foodPerDay = sanitize(input.foodPerDay);
  const transportPerDay = sanitize(input.transportPerDay);
  const insurance = sanitize(input.insurance);
  const activities = sanitize(input.activities);

  const totalFlights = roundCurrency(flightCost * travelers);
  const totalHotel = roundCurrency(hotelCostPerNight * nights * rooms);
  const totalFood = roundCurrency(foodPerDay * days * travelers);
  const totalTransport = roundCurrency(transportPerDay * days * travelers);
  const totalInsurance = roundCurrency(insurance * travelers);
  const totalActivities = roundCurrency(activities * travelers);

  const breakdown: TravelCostBreakdownItem[] = [
    {
      category: 'flights',
      label: 'ค่าตั๋วเครื่องบิน',
      unitCost: flightCost,
      unitLabel: 'บาท/คน',
      quantity: travelers,
      total: totalFlights,
    },
    {
      category: 'hotel',
      label: 'ค่าที่พัก',
      unitCost: hotelCostPerNight,
      unitLabel: `บาท/คืน × ${rooms} ห้อง`,
      quantity: nights,
      total: totalHotel,
    },
    {
      category: 'food',
      label: 'ค่าอาหาร',
      unitCost: foodPerDay,
      unitLabel: 'บาท/คน/วัน',
      quantity: days * travelers,
      total: totalFood,
    },
    {
      category: 'transport',
      label: 'ค่าขนส่งในพื้นที่',
      unitCost: transportPerDay,
      unitLabel: 'บาท/คน/วัน',
      quantity: days * travelers,
      total: totalTransport,
    },
    {
      category: 'insurance',
      label: 'ค่าประกันเดินทาง',
      unitCost: insurance,
      unitLabel: 'บาท/คน',
      quantity: travelers,
      total: totalInsurance,
    },
    {
      category: 'activities',
      label: 'ค่ากิจกรรม/ช้อปปิ้ง',
      unitCost: activities,
      unitLabel: 'บาท/คน',
      quantity: travelers,
      total: totalActivities,
    },
  ];

  const grandTotal = roundCurrency(
    totalFlights + totalHotel + totalFood + totalTransport + totalInsurance + totalActivities,
  );
  const perPerson = roundCurrency(grandTotal / travelers);
  const perPersonPerDay = roundCurrency(perPerson / days);

  return {
    destination: input.destination,
    days,
    nights,
    travelers,
    rooms,
    tripType: input.tripType,
    breakdown,
    grandTotal,
    perPerson,
    perPersonPerDay,
  };
}
