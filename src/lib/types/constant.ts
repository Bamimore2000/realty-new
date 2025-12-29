// src/lib/real-estate/constants.ts

import type { StateData, PropertyType } from "./types";

export const US_STATES: Record<string, StateData> = {
  AL: {
    name: "Alabama",
    cities: ["Birmingham", "Montgomery", "Mobile", "Huntsville"],
    avgPrice: 180000,
    priceVariation: 0.4,
  },
  AK: {
    name: "Alaska",
    cities: ["Anchorage", "Fairbanks", "Juneau"],
    avgPrice: 320000,
    priceVariation: 0.5,
  },
  AZ: {
    name: "Arizona",
    cities: ["Phoenix", "Tucson", "Mesa", "Scottsdale", "Chandler"],
    avgPrice: 410000,
    priceVariation: 0.6,
  },
  AR: {
    name: "Arkansas",
    cities: ["Little Rock", "Fort Smith", "Fayetteville"],
    avgPrice: 160000,
    priceVariation: 0.4,
  },
  CA: {
    name: "California",
    cities: [
      "Los Angeles",
      "San Francisco",
      "San Diego",
      "San Jose",
      "Sacramento",
      "Oakland",
      "Fresno",
    ],
    avgPrice: 750000,
    priceVariation: 1.2,
  },
  CO: {
    name: "Colorado",
    cities: ["Denver", "Colorado Springs", "Aurora", "Boulder"],
    avgPrice: 550000,
    priceVariation: 0.7,
  },
  CT: {
    name: "Connecticut",
    cities: ["Hartford", "New Haven", "Stamford", "Bridgeport"],
    avgPrice: 320000,
    priceVariation: 0.5,
  },
  DE: {
    name: "Delaware",
    cities: ["Wilmington", "Dover", "Newark"],
    avgPrice: 280000,
    priceVariation: 0.4,
  },
  FL: {
    name: "Florida",
    cities: [
      "Miami",
      "Tampa",
      "Orlando",
      "Jacksonville",
      "Fort Lauderdale",
      "Naples",
    ],
    avgPrice: 380000,
    priceVariation: 0.7,
  },
  GA: {
    name: "Georgia",
    cities: ["Atlanta", "Augusta", "Columbus", "Savannah"],
    avgPrice: 290000,
    priceVariation: 0.5,
  },
  HI: {
    name: "Hawaii",
    cities: ["Honolulu", "Pearl City", "Hilo"],
    avgPrice: 820000,
    priceVariation: 0.8,
  },
  ID: {
    name: "Idaho",
    cities: ["Boise", "Meridian", "Nampa"],
    avgPrice: 420000,
    priceVariation: 0.5,
  },
  IL: {
    name: "Illinois",
    cities: ["Chicago", "Aurora", "Naperville", "Joliet"],
    avgPrice: 270000,
    priceVariation: 0.6,
  },
  IN: {
    name: "Indiana",
    cities: ["Indianapolis", "Fort Wayne", "Evansville"],
    avgPrice: 190000,
    priceVariation: 0.4,
  },
  IA: {
    name: "Iowa",
    cities: ["Des Moines", "Cedar Rapids", "Davenport"],
    avgPrice: 170000,
    priceVariation: 0.3,
  },
  KS: {
    name: "Kansas",
    cities: ["Wichita", "Overland Park", "Kansas City"],
    avgPrice: 180000,
    priceVariation: 0.4,
  },
  KY: {
    name: "Kentucky",
    cities: ["Louisville", "Lexington", "Bowling Green"],
    avgPrice: 175000,
    priceVariation: 0.4,
  },
  LA: {
    name: "Louisiana",
    cities: ["New Orleans", "Baton Rouge", "Shreveport"],
    avgPrice: 200000,
    priceVariation: 0.4,
  },
  ME: {
    name: "Maine",
    cities: ["Portland", "Lewiston", "Bangor"],
    avgPrice: 310000,
    priceVariation: 0.5,
  },
  MD: {
    name: "Maryland",
    cities: ["Baltimore", "Columbia", "Germantown", "Silver Spring"],
    avgPrice: 380000,
    priceVariation: 0.6,
  },
  MA: {
    name: "Massachusetts",
    cities: ["Boston", "Worcester", "Springfield", "Cambridge"],
    avgPrice: 580000,
    priceVariation: 0.7,
  },
  MI: {
    name: "Michigan",
    cities: ["Detroit", "Grand Rapids", "Ann Arbor", "Lansing"],
    avgPrice: 210000,
    priceVariation: 0.5,
  },
  MN: {
    name: "Minnesota",
    cities: ["Minneapolis", "St. Paul", "Rochester", "Duluth"],
    avgPrice: 310000,
    priceVariation: 0.5,
  },
  MS: {
    name: "Mississippi",
    cities: ["Jackson", "Gulfport", "Biloxi"],
    avgPrice: 150000,
    priceVariation: 0.3,
  },
  MO: {
    name: "Missouri",
    cities: ["Kansas City", "St. Louis", "Springfield", "Columbia"],
    avgPrice: 190000,
    priceVariation: 0.4,
  },
  MT: {
    name: "Montana",
    cities: ["Billings", "Missoula", "Bozeman"],
    avgPrice: 430000,
    priceVariation: 0.6,
  },
  NE: {
    name: "Nebraska",
    cities: ["Omaha", "Lincoln", "Bellevue"],
    avgPrice: 220000,
    priceVariation: 0.4,
  },
  NV: {
    name: "Nevada",
    cities: ["Las Vegas", "Henderson", "Reno", "Carson City"],
    avgPrice: 420000,
    priceVariation: 0.6,
  },
  NH: {
    name: "New Hampshire",
    cities: ["Manchester", "Nashua", "Concord"],
    avgPrice: 410000,
    priceVariation: 0.5,
  },
  NJ: {
    name: "New Jersey",
    cities: ["Newark", "Jersey City", "Paterson", "Elizabeth"],
    avgPrice: 480000,
    priceVariation: 0.6,
  },
  NM: {
    name: "New Mexico",
    cities: ["Albuquerque", "Las Cruces", "Santa Fe"],
    avgPrice: 280000,
    priceVariation: 0.5,
  },
  NY: {
    name: "New York",
    cities: ["New York City", "Buffalo", "Rochester", "Syracuse", "Albany"],
    avgPrice: 420000,
    priceVariation: 1.0,
  },
  NC: {
    name: "North Carolina",
    cities: ["Charlotte", "Raleigh", "Greensboro", "Durham", "Asheville"],
    avgPrice: 310000,
    priceVariation: 0.5,
  },
  ND: {
    name: "North Dakota",
    cities: ["Fargo", "Bismarck", "Grand Forks"],
    avgPrice: 260000,
    priceVariation: 0.4,
  },
  OH: {
    name: "Ohio",
    cities: ["Columbus", "Cleveland", "Cincinnati", "Toledo"],
    avgPrice: 190000,
    priceVariation: 0.4,
  },
  OK: {
    name: "Oklahoma",
    cities: ["Oklahoma City", "Tulsa", "Norman"],
    avgPrice: 170000,
    priceVariation: 0.4,
  },
  OR: {
    name: "Oregon",
    cities: ["Portland", "Eugene", "Salem", "Bend"],
    avgPrice: 520000,
    priceVariation: 0.7,
  },
  PA: {
    name: "Pennsylvania",
    cities: ["Philadelphia", "Pittsburgh", "Allentown", "Erie"],
    avgPrice: 240000,
    priceVariation: 0.5,
  },
  RI: {
    name: "Rhode Island",
    cities: ["Providence", "Warwick", "Cranston"],
    avgPrice: 380000,
    priceVariation: 0.5,
  },
  SC: {
    name: "South Carolina",
    cities: ["Charleston", "Columbia", "Myrtle Beach", "Greenville"],
    avgPrice: 260000,
    priceVariation: 0.5,
  },
  SD: {
    name: "South Dakota",
    cities: ["Sioux Falls", "Rapid City", "Aberdeen"],
    avgPrice: 240000,
    priceVariation: 0.4,
  },
  TN: {
    name: "Tennessee",
    cities: ["Nashville", "Memphis", "Knoxville", "Chattanooga"],
    avgPrice: 280000,
    priceVariation: 0.5,
  },
  TX: {
    name: "Texas",
    cities: [
      "Houston",
      "Dallas",
      "Austin",
      "San Antonio",
      "Fort Worth",
      "El Paso",
    ],
    avgPrice: 310000,
    priceVariation: 0.6,
  },
  UT: {
    name: "Utah",
    cities: ["Salt Lake City", "Provo", "West Valley City"],
    avgPrice: 480000,
    priceVariation: 0.6,
  },
  VT: {
    name: "Vermont",
    cities: ["Burlington", "Montpelier", "Rutland"],
    avgPrice: 340000,
    priceVariation: 0.5,
  },
  VA: {
    name: "Virginia",
    cities: ["Virginia Beach", "Norfolk", "Richmond", "Arlington"],
    avgPrice: 370000,
    priceVariation: 0.6,
  },
  WA: {
    name: "Washington",
    cities: ["Seattle", "Spokane", "Tacoma", "Bellevue"],
    avgPrice: 610000,
    priceVariation: 0.8,
  },
  WV: {
    name: "West Virginia",
    cities: ["Charleston", "Huntington", "Morgantown"],
    avgPrice: 140000,
    priceVariation: 0.3,
  },
  WI: {
    name: "Wisconsin",
    cities: ["Milwaukee", "Madison", "Green Bay"],
    avgPrice: 250000,
    priceVariation: 0.4,
  },
  WY: {
    name: "Wyoming",
    cities: ["Cheyenne", "Casper", "Laramie"],
    avgPrice: 320000,
    priceVariation: 0.5,
  },
};

export const STREET_NAMES = {
  common: [
    "Main",
    "Oak",
    "Maple",
    "Park",
    "Washington",
    "Elm",
    "Lake",
    "Hill",
    "Pine",
    "Cedar",
  ] as const,
  west: ["Canyon", "Desert", "Mesa", "Sierra", "Pacific"] as const,
};

export const STREET_SUFFIXES = [
  "St",
  "Ave",
  "Dr",
  "Ln",
  "Rd",
  "Blvd",
  "Way",
  "Ct",
  "Pl",
  "Cir",
] as const;

export const PROPERTY_TYPES: PropertyType[] = [
  {
    type: "Single Family Home",
    weight: 50,
    bedRange: [2, 5],
    bathRange: [1, 4],
    sqftRange: [1000, 4000],
  },
  {
    type: "Townhouse",
    weight: 15,
    bedRange: [2, 4],
    bathRange: [2, 3],
    sqftRange: [1200, 2500],
  },
  {
    type: "Condo",
    weight: 20,
    bedRange: [1, 3],
    bathRange: [1, 2],
    sqftRange: [700, 1800],
  },
  {
    type: "Multi-Family",
    weight: 8,
    bedRange: [2, 6],
    bathRange: [2, 5],
    sqftRange: [1500, 5000],
  },
  {
    type: "Apartment",
    weight: 7,
    bedRange: [0, 3],
    bathRange: [1, 2],
    sqftRange: [500, 1500],
  },
];

export const AMENITIES = [
  "Central Air",
  "Heating",
  "Hardwood Floors",
  "Granite Countertops",
  "Stainless Steel Appliances",
  "Walk-in Closet",
  "Fireplace",
  "Balcony",
  "Patio",
  "Garage",
  "Dishwasher",
  "Washer/Dryer",
  "Pool",
  "Gym",
  "Pet Friendly",
  "Parking",
  "Storage",
  "Deck",
] as const;

export const AREA_CODES_BY_STATE: Record<string, number[]> = {
  CA: [
    213, 310, 323, 408, 415, 510, 562, 619, 626, 650, 661, 707, 714, 760, 805,
    818, 831, 858, 909, 916, 925, 949, 951,
  ],
  TX: [
    210, 214, 254, 281, 361, 409, 430, 432, 469, 512, 682, 713, 737, 806, 817,
    830, 832, 903, 915, 936, 940, 956, 972, 979,
  ],
  NY: [
    212, 315, 347, 516, 518, 585, 607, 631, 646, 716, 718, 845, 914, 917, 929,
  ],
  FL: [
    239, 305, 321, 352, 386, 407, 561, 727, 754, 772, 786, 813, 850, 863, 904,
    941, 954,
  ],
};

export const IMAGE_POOLS = {
  // Modern house exteriors
  exterior: [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994", // Modern house front
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be", // White modern house
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6", // Luxury home exterior
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9", // Contemporary house
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", // Beautiful home front
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c", // Suburban house
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf", // House with garage
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83", // Modern architecture
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2", // Classic home
    "https://images.unsplash.com/photo-1558036117-15d82a90b9b1", // Two story house
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750", // Modern white house
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811", // Brick house
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6", // Colonial style
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126", // House with pool
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914", // Craftsman style
    "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e", // Ranch style
    "https://images.unsplash.com/photo-1572120360610-d971b9d7767c", // Victorian house
    "https://images.unsplash.com/photo-1628012209120-71fa3742740a", // Beach house
    "https://images.unsplash.com/photo-1591474200742-8e512e6f98f8", // Mountain home
    "https://images.unsplash.com/photo-1598228723793-52759bba239c", // Tudor style
  ] as const,

  // Living rooms & main spaces
  livingRoom: [
    "https://images.unsplash.com/photo-1556912167-f556f1f39fdf", // Modern living room
    "https://images.unsplash.com/photo-1556909172-54557c7e4fb7", // Cozy living space
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511", // Contemporary living
    "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d", // Bright living room
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af", // Elegant living space
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7", // Minimalist living
    "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e", // Luxury living room
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6", // Open concept
    "https://images.unsplash.com/photo-1600210492493-0946911123ea", // Family room
    "https://images.unsplash.com/photo-1615529328331-f8917597711f", // Mid-century modern
  ] as const,

  // Kitchen spaces
  kitchen: [
    "https://images.unsplash.com/photo-1556911220-bff31c812dba", // Modern kitchen
    "https://images.unsplash.com/photo-1565538810643-b5bdb714032a", // White kitchen
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136", // Luxury kitchen
    "https://images.unsplash.com/photo-1600585152220-90363fe7e115", // Contemporary kitchen
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea", // Kitchen island
    "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4", // Open kitchen
    "https://images.unsplash.com/photo-1556909212-d5b604d0c90d", // Bright kitchen
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f", // Chef's kitchen
    "https://images.unsplash.com/photo-1590490360182-c33d57733427", // Farmhouse kitchen
    "https://images.unsplash.com/photo-1556912173-46c336c7fd55", // Marble kitchen
  ] as const,

  // Bedrooms
  bedroom: [
    "https://images.unsplash.com/photo-1615529182904-14819c35db37", // Master bedroom
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace", // Modern bedroom
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2", // Cozy bedroom
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0", // Luxury bedroom
    "https://images.unsplash.com/photo-1616137466211-f939a420be84", // Minimalist bedroom
    "https://images.unsplash.com/photo-1615529328331-f8917597711f", // Contemporary bedroom
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af", // Elegant bedroom
    "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2", // Bright bedroom
    "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5", // Guest bedroom
    "https://images.unsplash.com/photo-1540518614846-7eded433c457", // Teen bedroom
  ] as const,

  // Bathrooms
  bathroom: [
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14", // Modern bathroom
    "https://images.unsplash.com/photo-1620626011761-996317b8d101", // Luxury bathroom
    "https://images.unsplash.com/photo-1584622781628-1a3b0b6d1b2f", // Spa bathroom
    "https://images.unsplash.com/photo-1605284489948-1e76d9a5e3cc", // Master bathroom
    "https://images.unsplash.com/photo-1604709177225-055f99402ea3", // Contemporary bathroom
    "https://images.unsplash.com/photo-1507652313519-d4e9174996dd", // White bathroom
    "https://images.unsplash.com/photo-1595514535116-52abd1ab4ea8", // Marble bathroom
    "https://images.unsplash.com/photo-1585264550248-1778be3b6368", // Guest bathroom
    "https://images.unsplash.com/photo-1633453446904-0606bb3e7e7e", // Walk-in shower
    "https://images.unsplash.com/photo-1564540574945-a0a80e71b01e", // Tub and shower
  ] as const,

  // Dining rooms
  dining: [
    "https://images.unsplash.com/photo-1617806118233-18e1de247200", // Dining room
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0", // Formal dining
    "https://images.unsplash.com/photo-1600210492493-0946911123ea", // Dining area
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f", // Modern dining
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c", // Elegant dining
    "https://images.unsplash.com/photo-1604014237800-1c9102c219da", // Breakfast nook
    "https://images.unsplash.com/photo-1565182999561-18d7dc61c393", // Dining space
    "https://images.unsplash.com/photo-1595428774223-ef52624120d2", // Open dining
  ] as const,

  // Outdoor spaces
  outdoor: [
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde", // Backyard
    "https://images.unsplash.com/photo-1600585152220-90363fe7e115", // Patio
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d", // Pool area
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea", // Deck
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d", // Garden
    "https://images.unsplash.com/photo-1600047508788-786f3865b4b9", // Outdoor living
    "https://images.unsplash.com/photo-1600047509782-20d39509f26d", // Balcony
    "https://images.unsplash.com/photo-1600573472556-32c4833d3b95", // Fire pit
    "https://images.unsplash.com/photo-1600566752734-e8e2e8f0b8c1", // Landscaping
    "https://images.unsplash.com/photo-1598655961338-2932e68bbe0b", // BBQ area
  ] as const,

  // Home offices & studies
  office: [
    "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04", // Home office
    "https://images.unsplash.com/photo-1593062096033-9a26b09da705", // Study room
    "https://images.unsplash.com/photo-1585260072160-07343fc8cbf8", // Modern office
    "https://images.unsplash.com/photo-1595428774223-ef52624120d2", // Work from home
    "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e", // Bright office
    "https://images.unsplash.com/photo-1562664377-5f5c4dba3f61", // Executive office
  ] as const,

  // Special features
  special: [
    "https://images.unsplash.com/photo-1534889156217-d643df14f14a", // Wine cellar
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f", // Home gym
    "https://images.unsplash.com/photo-1598655962451-23a0d8b11907", // Home theater
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f", // Game room
    "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d", // Library
    "https://images.unsplash.com/photo-1600121848594-d8644e57abab", // Walk-in closet
    "https://images.unsplash.com/photo-1600121848594-d8644e57abab", // Mudroom
    "https://images.unsplash.com/photo-1556912167-f556f1f39fdf", // Bonus room
  ] as const,
};
