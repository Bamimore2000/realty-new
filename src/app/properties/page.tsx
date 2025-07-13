import ErrorPage from "@/components/Errorpage";
import PropertiesPageClient from "@/components/PropertyClient";
export interface Listing {
  title: string;
  price: string;
  bedBath: string;
  type: string;
  link: string;
  img: string;
  phone: string;
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
      `${
        process.env.BACKEND_API_URL ||
        "https://backendrealty-production.up.railway.app"
      }/search?location=${encodeURIComponent(location as string)}`,
      { cache: "no-store" }
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
