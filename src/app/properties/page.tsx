import ErrorPage from "@/components/Errorpage";
import PropertiesPageClient from "@/components/PropertyClient";
export interface Listing {
  address: string;
  propertyType: string;
  price: string;
  beds: string;
  imgs: string[];
  link: string;
  phone: string;
  emailButtonText: string;
  datePosted: string;
}
type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PropertiesPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const page = 1;

  const location = searchParams.location;
  if (!location) {
    return (
      <p className="p-8 text-center text-red-600">
        Please provide a location query parameter.
      </p>
    );
  }

  let listings: Listing[] = [];
  let errorMessage = "";

  try {
    const res = await fetch(
      `http://16.16.192.166:4001/search?location=${encodeURIComponent(location as string)}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      errorMessage = `Failed to load listings: ${res.status} ${res.statusText}`;
      console.error(errorMessage);
    } else {
      try {
        listings = await res.json();
        console.log("Listings fetched successfully:", listings);
      } catch (jsonError) {
        errorMessage = "Failed to parse response JSON.";
        console.error(errorMessage, jsonError);
      }
    }
  } catch (fetchError) {
    errorMessage = "Network or fetch error occurred.";
    console.error(errorMessage, fetchError);
  }

  if (errorMessage) {
    return <ErrorPage />;
  }

  return (
    <PropertiesPageClient
      listings={listings}
      location={location as string}
      page={page}
    />
  );
}
