import { getRegionFromIp } from "@/actions";
import Carousel from "./Carousel";
import { generateProperties, Property, US_STATES } from "@/lib/make-properties"; // ← adjust path if needed
import { StateCode } from "@/lib/types/types";

// Define your Listing type (adjust as needed to match your Carousel component)
export interface Listing {
  id: string;
  title: string;
  price: number;
  priceFormatted: string;
  beds: number;
  baths: number;
  sqft: number;
  address: string;
  image: string;
  images: string[];
  description: string;
  agent: string;
  phone: string;
  status: "For Sale" | "For Rent";
  yearBuilt: number;
  amenities: string[];
}

// Map common variations to state codes
const REGION_TO_STATE_CODE: Record<string, string> = {
  texas: "TX",
  tx: "TX",
  california: "CA",
  ca: "CA",
  "new york": "NY",
  ny: "NY",
  florida: "FL",
  fl: "FL",
  // Add more as needed
};

export default async function Listings() {
  let region = "Texas"; // Display name (human-readable)
  let stateCode: keyof typeof US_STATES = "TX"; // Default to Texas

  try {
    // 1. Fetch public IP
    let ip = "";
    try {
      const ipRes = await fetch("https://api.ipify.org/?format=json", {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });
      if (ipRes.ok) {
        const data = await ipRes.json();
        ip = data.ip;
      }
    } catch (err) {
      console.warn("Failed to fetch IP, using fallback");
      ip = "8.8.8.8";
    }

    // 2. Detect region from IP
    const detectedRegion = await getRegionFromIp(ip);

    if (
      detectedRegion &&
      typeof detectedRegion === "string" &&
      detectedRegion.trim()
    ) {
      const normalized = detectedRegion.trim().toLowerCase();

      // Case 1: Direct match in our alias map
      if (REGION_TO_STATE_CODE[normalized]) {
        stateCode = REGION_TO_STATE_CODE[normalized] as keyof typeof US_STATES;
        region = US_STATES[stateCode].name; // Use full state name for display
      }
      // Case 2: 2-letter state code
      else if (
        normalized.length === 2 &&
        normalized.toUpperCase() in US_STATES
      ) {
        stateCode = normalized.toUpperCase() as keyof typeof US_STATES;
        region = US_STATES[stateCode].name;
      }
      // Case 3: Full state name match (e.g. "california")
      else if (
        Object.values(US_STATES).some(
          (state) => state.name.toLowerCase() === normalized
        )
      ) {
        const matchedState = Object.entries(US_STATES).find(
          ([, data]) => data.name.toLowerCase() === normalized
        );
        if (matchedState) {
          stateCode = matchedState[0] as keyof typeof US_STATES;
          region = matchedState[1].name;
        }
      }
      // Optional: You could add city fallback here later
      else {
        console.log(
          `Unrecognized region "${detectedRegion}", falling back to Texas`
        );
      }
    }
  } catch (error) {
    console.error("Error during region detection:", error);
    // Defaults already set to Texas
  }

  // 3. Generate 20 properties for the selected state
  const generated: Property[] = generateProperties(20, {
    state: stateCode as StateCode,
  });

  const listings: Listing[] = generated.map((prop) => ({
    id: prop.id,
    title: `${prop.beds} Bed ${prop.propertyType} in ${prop.address.city}`,
    price: prop.price,
    priceFormatted: prop.priceFormatted,
    beds: prop.beds,
    baths: prop.baths,
    sqft: prop.sqft,
    address: prop.address.full,
    image: prop.images[0],
    images: prop.images,
    description: prop.description,
    agent: prop.contact.agent,
    phone: prop.contact.phone,
    status: prop.status,
    yearBuilt: prop.yearBuilt,
    amenities: prop.amenities,
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-primary mb-2">
          Discover Homes in {region}
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Explore top properties available in{" "}
          <span className="font-medium">{region}</span>. Scroll through and find
          your dream space.
        </p>
      </div>

      {listings.length > 0 ? (
        <Carousel properties={listings} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No properties available at this time.</p>
        </div>
      )}
    </main>
  );
}
