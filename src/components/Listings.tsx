import { getRegionFromIp } from "@/actions"; // adjust path
import Carousel from "./Carousel";
import { Listing } from "@/app/properties/page";

export default async function Listings() {
  // 1. Fetch IP from ipify (this will be server IP in SSR)
  let ip = "";

  try {
    const ipRes = await fetch("https://api.ipify.org/?format=json");
    const ipData = await ipRes.json();
    ip = ipData.ip;
  } catch {
    ip = "8.8.8.8"; // fallback IP for demo
  }

  // 2. Call your server action to get region from IP
  const region = await getRegionFromIp(ip);

  // // 3. Use region to fetch listings
  // const res = await fetch(
  //   `https://backendrealty-production.up.railway.app/search?location=${encodeURIComponent(
  //     region
  //   )}`,
  //   { next: { revalidate: 60 } }
  const res = await fetch(
    `http://16.16.192.166:4001/search?location=${encodeURIComponent(region)}`,
    { next: { revalidate: 60 } }
  );

  console.log({ res });

  if (!res.ok) {
    return <div>Failed to load listings</div>;
  }

  const listings: Listing[] = await res.json();
  console.log({ listings });

  // const properties: Property[] = transformListings(
  //   listings.filter((listing) => listing.price)
  // );

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

      <Carousel properties={listings} />
    </main>
  );
}
