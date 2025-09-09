export const locations = [
  { value: "main-gate", label: "Main Gate" },
  { value: "library", label: "University Library" },
  { value: "hostels", label: "Student Hostels" },
  { value: "dining-hall", label: "Dining Hall" },
  { value: "admin-block", label: "Administration Block" },
  { value: "sports-complex", label: "Sports Complex" },
  { value: "mbarara-town", label: "Mbarara Town Center" },
  { value: "hospital", label: "Mbarara Regional Hospital" },
];

export const popularRoutes = [
  {
    from: "Main Gate",
    to: "Library",
    distance: "1.5 km",
    singleFare: 2000,
    sharedFare: 500,
    estimatedTime: "5 min"
  },
  {
    from: "Hostels",
    to: "Dining Hall", 
    distance: "0.8 km",
    singleFare: 2000,
    sharedFare: 500,
    estimatedTime: "3 min"
  },
  {
    from: "Campus",
    to: "Mbarara Town",
    distance: "5.2 km",
    singleFare: 4600,
    sharedFare: 1150,
    estimatedTime: "15 min"
  },
  {
    from: "Library",
    to: "Sports Complex",
    distance: "2.1 km",
    singleFare: 2500,
    sharedFare: 625,
    estimatedTime: "7 min"
  },
  {
    from: "Campus",
    to: "Regional Hospital",
    distance: "3.8 km",
    singleFare: 3900,
    sharedFare: 975,
    estimatedTime: "12 min"
  }
];

export const weeklyEarnings = [
  { day: "Monday", amount: 89000 },
  { day: "Tuesday", amount: 112500 },
  { day: "Wednesday", amount: 95200 },
  { day: "Thursday", amount: 134800 },
  { day: "Friday", amount: 156300 },
  { day: "Saturday", amount: 78100 },
  { day: "Sunday", amount: 45600 }
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
