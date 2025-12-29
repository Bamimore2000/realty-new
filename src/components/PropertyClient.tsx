/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { PropertyCard } from "@/components/PropertyCard";
import { Listing } from "@/components/Listings";
import Nav from "./Nav";

export default function PropertiesPageClient({
  properties,
  location,
  page,
}: {
  properties: any[];
  location: string;
  page: number;
}) {
  const [showFilters, setShowFilters] = useState(true);

  // Convert Property to Listing (same as in Listings.tsx)
  const listings: Listing[] = properties.map((prop) => ({
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
    <main className="max-w-5xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Properties in {location}</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-3 py-1 rounded bg-primary text-white hover:bg-primary/90 transition"
          aria-expanded={showFilters}
          aria-controls="filter-section"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <section id="filter-section" className="mb-6">
          <Nav />
        </section>
      )}

      {listings.length === 0 && (
        <p className="text-center text-gray-600">
          No properties found for &apos;{location}&apos;.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listings.map((listing) => (
          <PropertyCard key={listing.id} listing={listing} />
        ))}
      </div>

      {/* <Pagination location={location} currentPage={page} /> */}
    </main>
  );
}

export function Pagination({
  location,
  currentPage,
}: {
  location: string;
  currentPage: number;
}) {
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage + 1;

  return (
    <div className="mt-8 flex justify-center items-center gap-4">
      {prevPage ? (
        <Link
          href={`/properties?location=${encodeURIComponent(location)}&page=${prevPage}`}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Previous
        </Link>
      ) : (
        <button
          disabled
          className="px-4 py-2 bg-gray-200 rounded opacity-50 cursor-not-allowed"
        >
          Previous
        </button>
      )}

      <span>Page {currentPage}</span>

      <Link
        href={`/properties?location=${encodeURIComponent(location)}&page=${nextPage}`}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        Next
      </Link>
    </div>
  );
}
