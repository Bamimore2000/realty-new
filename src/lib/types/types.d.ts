// src/lib/real-estate/types.ts

export type StateCode =
  | "AL"
  | "AK"
  | "AZ"
  | "AR"
  | "CA"
  | "CO"
  | "CT"
  | "DE"
  | "FL"
  | "GA"
  | "HI"
  | "ID"
  | "IL"
  | "IN"
  | "IA"
  | "KS"
  | "KY"
  | "LA"
  | "ME"
  | "MD"
  | "MA"
  | "MI"
  | "MN"
  | "MS"
  | "MO"
  | "MT"
  | "NE"
  | "NV"
  | "NH"
  | "NJ"
  | "NM"
  | "NY"
  | "NC"
  | "ND"
  | "OH"
  | "OK"
  | "OR"
  | "PA"
  | "RI"
  | "SC"
  | "SD"
  | "TN"
  | "TX"
  | "UT"
  | "VT"
  | "VA"
  | "WA"
  | "WV"
  | "WI"
  | "WY";

export interface StateData {
  name: string;
  cities: string[];
  avgPrice: number;
  priceVariation: number;
}

export interface PropertyType {
  type: string;
  weight: number;
  bedRange: [number, number];
  bathRange: [number, number];
  sqftRange: [number, number];
}

export interface Address {
  street: string;
  city: string;
  state: StateCode;
  stateFullName: string;
  zip: string;
  full: string;
}

export interface Contact {
  agent: string;
  phone: string;
  email: string;
}

export interface Property {
  id: string;
  propertyType: string;
  status: "For Sale" | "For Rent";
  price: number;
  priceFormatted: string;
  beds: number;
  baths: number;
  sqft: number;
  lotSize: number | null;
  address: Address;
  amenities: string[];
  yearBuilt: number;
  images: string[];
  contact: Contact;
  description: string;
  listingDate: string;
}

export interface GeneratePropertiesOptions {
  state?: StateCode;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  minSqft?: number;
  maxSqft?: number;
  propertyType?: string;
}
