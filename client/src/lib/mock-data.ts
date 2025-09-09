export const locations = [
  { value: "temple-entrance", label: "Temple Main Entrance" },
  { value: "library", label: "University Library" },
  { value: "hostels", label: "Student Hostels" },
  { value: "dining-hall", label: "Dining Hall" },
  { value: "admin-block", label: "Administration Block" },
  { value: "sports-complex", label: "Sports Complex" },
  { value: "tirupathi-town", label: "Tirupathi Town Center" },
  { value: "hospital", label: "SVIMS Hospital" },
  { value: "railway-station", label: "Tirupathi Railway Station" },
  { value: "bus-station", label: "Central Bus Station" },
];

export const popularRoutes = [
  {
    from: "Temple Entrance",
    to: "Library",
    distance: "1.5 km",
    singleFare: 30,
    sharedFare: 10,
    estimatedTime: "5 min"
  },
  {
    from: "Hostels",
    to: "Dining Hall", 
    distance: "0.8 km",
    singleFare: 25,
    sharedFare: 8,
    estimatedTime: "3 min"
  },
  {
    from: "Campus",
    to: "Tirupathi Town",
    distance: "5.2 km",
    singleFare: 80,
    sharedFare: 25,
    estimatedTime: "15 min"
  },
  {
    from: "Library",
    to: "Sports Complex",
    distance: "2.1 km",
    singleFare: 40,
    sharedFare: 12,
    estimatedTime: "7 min"
  },
  {
    from: "Campus",
    to: "Railway Station",
    distance: "3.8 km",
    singleFare: 65,
    sharedFare: 20,
    estimatedTime: "12 min"
  }
];

export const weeklyEarnings = [
  { day: "Monday", amount: 1580 },
  { day: "Tuesday", amount: 2025 },
  { day: "Wednesday", amount: 1740 },
  { day: "Thursday", amount: 2385 },
  { day: "Friday", amount: 2820 },
  { day: "Saturday", amount: 1425 },
  { day: "Sunday", amount: 890 }
];

export const demandData = [
  { location: "Library", level: "High", color: "green" },
  { location: "Hostels", level: "Medium", color: "yellow" },
  { location: "Main Gate", level: "Very High", color: "red" },
  { location: "Dining", level: "Low", color: "blue" },
  { location: "Admin", level: "Medium", color: "yellow" },
  { location: "Sports", level: "High", color: "green" },
  { location: "Parking", level: "Low", color: "blue" },
  { location: "Town Route", level: "Very High", color: "red" }
];

export const peakHours = [
  { time: "7:00 - 9:00 AM", percentage: 85, color: "red" },
  { time: "12:00 - 2:00 PM", percentage: 65, color: "green" },
  { time: "5:00 - 7:00 PM", percentage: 92, color: "red" },
  { time: "9:00 - 11:00 PM", percentage: 45, color: "yellow" }
];
