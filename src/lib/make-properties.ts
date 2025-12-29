// src/lib/real-estate/index.ts

// Export all types
export type {
  StateCode,
  StateData,
  PropertyType,
  Address,
  Contact,
  Property,
} from "./types/types";

// Export constants
export {
  US_STATES,
  STREET_NAMES,
  STREET_SUFFIXES,
  PROPERTY_TYPES,
  AMENITIES,
  AREA_CODES_BY_STATE,
  IMAGE_POOLS,
} from "./types/constant";

// Export utilities
export { SeededRandom, generatePhone } from "./types/utils";

// Export main generator functions
export { generateProperty, generateProperties } from "./types/generator";
