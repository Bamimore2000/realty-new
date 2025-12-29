/* eslint-disable @typescript-eslint/no-explicit-any */
import ErrorPage from "@/components/Errorpage";
import PropertiesPageClient from "@/components/PropertyClient";
import { generateProperties } from "@/lib/make-properties";
import { StateCode } from "@/lib/types/types";
import { Listing } from "@/types";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PropertiesPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const page = 1;

  // Get state and city from new params
  const state = searchParams.state as string | undefined;
  const city = searchParams.city as string | undefined;

  // Validate state parameter exists
  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Missing Search Parameters
          </h2>
          <p className="text-gray-600">
            Please provide a state to search for properties.
          </p>
        </div>
      </div>
    );
  }

  // Validate state code
  const stateCode = state.toUpperCase() as StateCode;
  const validStateCodes = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  if (!validStateCodes.includes(stateCode)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Invalid State Code
          </h2>
          <p className="text-gray-600">
            &quot;{state}&quot; is not a valid US state code. Please try again.
          </p>
        </div>
      </div>
    );
  }

  let listings: any[] = [];
  let errorMessage = "";

  try {
    // Generate properties using the real estate faker
    const properties = generateProperties(50, {
      state: stateCode,
      ...(city && { city }),
    });
    listings = properties;

    // Convert to Listing format

    console.log(
      `Generated ${listings.length} properties for ${stateCode}${city ? ` in ${city}` : ""}`
    );
  } catch (error) {
    errorMessage = "Failed to generate property listings.";
    console.error(errorMessage, error);
  }

  if (errorMessage) {
    return <ErrorPage />;
  }

  // If no listings found (shouldn't happen with faker, but good to check)
  if (listings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Properties Found
          </h2>
          <p className="text-gray-600">
            Try searching in a different location or adjusting your filters.
          </p>
        </div>
      </div>
    );
  }

  // Create display location string
  const displayLocation = city ? `${city}, ${stateCode}` : `${stateCode}`;

  return (
    <PropertiesPageClient
      properties={listings}
      location={displayLocation}
      page={page}
    />
  );
}
