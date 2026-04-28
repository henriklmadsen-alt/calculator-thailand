import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTravelCost } from './travel-cost-calculator.ts';

function closeTo(actual: number, expected: number, tolerance = 0.01): void {
  assert.ok(Math.abs(actual - expected) <= tolerance, `Expected ${actual} to be within ${tolerance} of ${expected}`);
}

test('calculates 5-day Japan trip for 2 people, 1 room', () => {
  const result = calculateTravelCost({
    destination: 'japan',
    days: 5,
    travelers: 2,
    tripType: 'moderate',
    flightCost: 15000,
    hotelCostPerNight: 2500,
    foodPerDay: 1500,
    transportPerDay: 500,
    insurance: 500,
    activities: 3000,
    rooms: 1,
  });

  assert.equal(result.days, 5);
  assert.equal(result.nights, 4);
  assert.equal(result.travelers, 2);
  assert.equal(result.rooms, 1);

  // flights: 15000 * 2 = 30000
  closeTo(result.breakdown[0].total, 30000);
  // hotel: 2500 * 4 nights * 1 room = 10000
  closeTo(result.breakdown[1].total, 10000);
  // food: 1500 * 5 days * 2 people = 15000
  closeTo(result.breakdown[2].total, 15000);
  // transport: 500 * 5 * 2 = 5000
  closeTo(result.breakdown[3].total, 5000);
  // insurance: 500 * 2 = 1000
  closeTo(result.breakdown[4].total, 1000);
  // activities: 3000 * 2 = 6000
  closeTo(result.breakdown[5].total, 6000);

  // grand total = 30000+10000+15000+5000+1000+6000 = 67000
  closeTo(result.grandTotal, 67000);
  // per person = 67000/2 = 33500
  closeTo(result.perPerson, 33500);
  // per person per day = 33500/5 = 6700
  closeTo(result.perPersonPerDay, 6700);
});

test('calculates 1-day trip (0 nights, no hotel cost)', () => {
  const result = calculateTravelCost({
    destination: 'singapore',
    days: 1,
    travelers: 1,
    tripType: 'budget',
    flightCost: 5000,
    hotelCostPerNight: 2000,
    foodPerDay: 800,
    transportPerDay: 300,
    insurance: 200,
    activities: 1000,
    rooms: 1,
  });

  assert.equal(result.nights, 0);
  // hotel: 2000 * 0 nights * 1 = 0
  closeTo(result.breakdown[1].total, 0);
  // grand total = 5000 + 0 + 800 + 300 + 200 + 1000 = 7300
  closeTo(result.grandTotal, 7300);
  closeTo(result.perPerson, 7300);
  closeTo(result.perPersonPerDay, 7300);
});

test('calculates 3-day trip for 4 people with 2 rooms', () => {
  const result = calculateTravelCost({
    destination: 'europe',
    days: 3,
    travelers: 4,
    tripType: 'luxury',
    flightCost: 30000,
    hotelCostPerNight: 5000,
    foodPerDay: 3000,
    transportPerDay: 1000,
    insurance: 1500,
    activities: 10000,
    rooms: 2,
  });

  assert.equal(result.nights, 2);
  assert.equal(result.rooms, 2);

  // flights: 30000 * 4 = 120000
  closeTo(result.breakdown[0].total, 120000);
  // hotel: 5000 * 2 nights * 2 rooms = 20000
  closeTo(result.breakdown[1].total, 20000);
  // food: 3000 * 3 * 4 = 36000
  closeTo(result.breakdown[2].total, 36000);
  // transport: 1000 * 3 * 4 = 12000
  closeTo(result.breakdown[3].total, 12000);
  // insurance: 1500 * 4 = 6000
  closeTo(result.breakdown[4].total, 6000);
  // activities: 10000 * 4 = 40000
  closeTo(result.breakdown[5].total, 40000);

  // grand total = 120000+20000+36000+12000+6000+40000 = 234000
  closeTo(result.grandTotal, 234000);
  closeTo(result.perPerson, 58500);
  closeTo(result.perPersonPerDay, 19500);
});

test('handles zero/missing optional costs gracefully', () => {
  const result = calculateTravelCost({
    destination: 'vietnam',
    days: 3,
    travelers: 1,
    tripType: 'budget',
    flightCost: 5000,
    hotelCostPerNight: 1000,
    foodPerDay: 500,
    transportPerDay: 0,
    insurance: 0,
    activities: 0,
    rooms: 1,
  });

  closeTo(result.breakdown[3].total, 0); // transport
  closeTo(result.breakdown[4].total, 0); // insurance
  closeTo(result.breakdown[5].total, 0); // activities
  // 5000 + (1000*2) + (500*3) + 0 + 0 + 0 = 8500
  closeTo(result.grandTotal, 8500);
});
