export interface FareCalculation {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  total: number;
  sharedTotal: number;
  distance: number;
  estimatedTime: number;
}

const BASE_FARE = 2000; // UGX for first 2km
const PER_KM_RATE = 500; // UGX per km after first 2km
const PER_MINUTE_RATE = 50; // UGX per minute
const STUDENT_DISCOUNT = 0.1; // 10% student discount
const NIGHT_SURCHARGE = 0.25; // 25% surcharge between 10PM-6AM

export function calculateFare(
  fromLocation: string,
  toLocation: string,
  passengers: number = 1,
  scheduledTime?: Date
): FareCalculation {
  // Mock distance and time calculation based on locations
  const distance = calculateDistance(fromLocation, toLocation);
  const estimatedTime = Math.ceil(distance * 3.2); // Rough estimate: 3.2 min per km
  
  let baseFare = BASE_FARE;
  let distanceFare = distance > 2 ? (distance - 2) * PER_KM_RATE : 0;
  let timeFare = estimatedTime * PER_MINUTE_RATE;
  
  let subtotal = baseFare + distanceFare + timeFare;
  
  // Apply student discount
  subtotal = subtotal * (1 - STUDENT_DISCOUNT);
  
  // Apply night surcharge if applicable
  if (scheduledTime && isNightTime(scheduledTime)) {
    subtotal = subtotal * (1 + NIGHT_SURCHARGE);
  }
  
  const total = Math.round(subtotal);
  const sharedTotal = Math.round(total / Math.max(passengers, 1));
  
  return {
    baseFare: Math.round(baseFare * (1 - STUDENT_DISCOUNT)),
    distanceFare: Math.round(distanceFare * (1 - STUDENT_DISCOUNT)),
    timeFare: Math.round(timeFare * (1 - STUDENT_DISCOUNT)),
    total,
    sharedTotal,
    distance,
    estimatedTime
  };
}

function calculateDistance(from: string, to: string): number {
  // Mock distance calculation based on location pairs
  const distanceMap: Record<string, Record<string, number>> = {
    "main-gate": {
      "library": 1.5,
      "hostels": 2.1,
      "dining-hall": 1.8,
      "admin-block": 0.9,
      "sports-complex": 2.8,
      "mbarara-town": 5.2,
      "hospital": 4.1
    },
    "library": {
      "main-gate": 1.5,
      "hostels": 1.2,
      "dining-hall": 0.8,
      "admin-block": 1.1,
      "sports-complex": 2.1,
      "mbarara-town": 4.8,
      "hospital": 3.8
    },
    "hostels": {
      "main-gate": 2.1,
      "library": 1.2,
      "dining-hall": 0.8,
      "admin-block": 1.8,
      "sports-complex": 1.5,
      "mbarara-town": 4.2,
      "hospital": 3.2
    }
    // Add more location pairs as needed
  };
  
  return distanceMap[from]?.[to] || 3.2; // Default distance if not found
}

function isNightTime(date: Date): boolean {
  const hour = date.getHours();
  return hour >= 22 || hour < 6; // 10PM to 6AM
}
