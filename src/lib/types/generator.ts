// src/lib/real-estate/generator.ts

import type {
  StateCode,
  Address,
  Property,
  GeneratePropertiesOptions,
} from "./types";
import {
  US_STATES,
  STREET_NAMES,
  STREET_SUFFIXES,
  PROPERTY_TYPES,
  AMENITIES,
  IMAGE_POOLS,
} from "./constant";
import { SeededRandom, generatePhone } from "./utils";

export function generateProperty(
  id: number,
  stateCode: StateCode | null = null
): Property {
  const rng = new SeededRandom(id);

  const states = Object.keys(US_STATES) as StateCode[];
  const state: StateCode = stateCode || rng.pick(states);
  const stateData = US_STATES[state];

  const city = rng.pick(stateData.cities);

  const streetNumber = rng.range(100, 9999);
  const streetName = rng.pick([...STREET_NAMES.common, ...STREET_NAMES.west]);
  const streetSuffix = rng.pick(STREET_SUFFIXES);
  const zipCode = rng.range(10000, 99999);

  const address: Address = {
    street: `${streetNumber} ${streetName} ${streetSuffix}`,
    city,
    state,
    stateFullName: stateData.name,
    zip: zipCode.toString().padStart(5, "0"),
    full: `${streetNumber} ${streetName} ${streetSuffix}, ${city}, ${state} ${zipCode}`,
  };

  const propertyTypeItem = rng.pickWeighted(PROPERTY_TYPES);
  const propertyType = propertyTypeItem.type;

  const beds = rng.range(
    propertyTypeItem.bedRange[0],
    propertyTypeItem.bedRange[1]
  );
  const baths =
    rng.range(propertyTypeItem.bathRange[0], propertyTypeItem.bathRange[1]) +
    (rng.next() > 0.5 ? 0.5 : 0);
  const sqft = rng.range(
    propertyTypeItem.sqftRange[0],
    propertyTypeItem.sqftRange[1]
  );
  const lotSize =
    propertyType === "Single Family Home" ? sqft * rng.range(2, 4) : null;

  const basePrice = stateData.avgPrice;
  const priceMultiplier = 0.5 + rng.next() * stateData.priceVariation;
  const sizeMultiplier = sqft / 2000;
  const price =
    Math.round((basePrice * priceMultiplier * sizeMultiplier) / 1000) * 1000;

  const numAmenities = rng.range(3, 8);
  const shuffledAmenities = [...AMENITIES];
  for (let i = shuffledAmenities.length - 1; i > 0; i--) {
    const j = rng.range(0, i);
    [shuffledAmenities[i], shuffledAmenities[j]] = [
      shuffledAmenities[j],
      shuffledAmenities[i],
    ];
  }
  const selectedAmenities = shuffledAmenities.slice(0, numAmenities);

  // Generate realistic image distribution
  const numImages = rng.range(5, 20);
  const images: string[] = [];

  // Always start with 1-2 exterior shots
  const numExterior = rng.range(1, 3);
  for (let i = 0; i < numExterior; i++) {
    const baseUrl = rng.pick(IMAGE_POOLS.exterior);
    images.push(`${baseUrl}?w=800&h=600&fit=crop&auto=format`);
  }

  // Create a weighted pool for interior shots
  const interiorPools = [
    { pool: IMAGE_POOLS.livingRoom, weight: 3 }, // Most common
    { pool: IMAGE_POOLS.kitchen, weight: 3 },
    { pool: IMAGE_POOLS.bedroom, weight: 2 },
    { pool: IMAGE_POOLS.bathroom, weight: 2 },
    { pool: IMAGE_POOLS.dining, weight: 1 },
    { pool: IMAGE_POOLS.outdoor, weight: 2 },
    { pool: IMAGE_POOLS.office, weight: 1 },
    { pool: IMAGE_POOLS.special, weight: 0.5 },
  ];

  // Fill remaining images with varied interior shots
  const remainingImages = numImages - numExterior;
  for (let i = 0; i < remainingImages; i++) {
    const selectedPool = rng.pickWeighted(interiorPools);
    const baseUrl = rng.pick(selectedPool.pool);
    images.push(`${baseUrl}?w=800&h=600&fit=crop&auto=format`);
  }

  const agentFirstNames = [
    "John",
    "Sarah",
    "Michael",
    "Jennifer",
    "David",
    "Lisa",
    "Robert",
    "Emily",
  ] as const;
  const agentLastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
  ] as const;

  const today = new Date();
  const listingDate = new Date(
    today.getTime() - rng.range(0, 90) * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0];

  return {
    id: `prop_${id}`,
    propertyType,
    status: rng.next() > 0.8 ? "For Sale" : "For Rent",
    price,
    priceFormatted: `$${price.toLocaleString()}`,
    beds,
    baths,
    sqft,
    lotSize,
    address,
    amenities: selectedAmenities,
    yearBuilt: rng.range(1950, 2024),
    images,
    contact: {
      agent: `${rng.pick(agentFirstNames)} ${rng.pick(agentLastNames)}`,
      phone: generatePhone(state),
      email: `agent${id}@realestate.com`,
    },
    description: `Beautiful ${propertyType.toLowerCase()} in ${city}, ${stateData.name}. Features ${beds} bedrooms, ${baths} bathrooms, and ${sqft} square feet of living space.`,
    listingDate,
  };
}

export function generateProperties(
  count: number = 100,
  options: GeneratePropertiesOptions = {}
): Property[] {
  const {
    state,
    city,
    minPrice,
    maxPrice,
    beds,
    baths,
    minSqft,
    maxSqft,
    propertyType,
  } = options;

  const properties: Property[] = [];
  let id = 0;

  while (properties.length < count) {
    const prop = generateProperty(id++, state);

    if (city && prop.address.city !== city) continue;
    if (minPrice && prop.price < minPrice) continue;
    if (maxPrice && prop.price > maxPrice) continue;
    if (beds !== undefined && prop.beds !== beds) continue;
    if (baths !== undefined && prop.baths !== baths) continue;
    if (minSqft && prop.sqft < minSqft) continue;
    if (maxSqft && prop.sqft > maxSqft) continue;
    if (propertyType && prop.propertyType !== propertyType) continue;

    properties.push(prop);
  }

  return properties;
}
