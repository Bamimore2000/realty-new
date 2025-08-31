"use client";
import { Listing } from "@/app/properties/page";
import { useState } from "react";
import Nav from "./Nav";
import Link from "next/link";

// Client wrapper component to use useState
export default function PropertiesPageClient({
  listings,
  location,
  page,
}: {
  listings: Listing[];
  location: string;
  page: number;
}) {
  const [showFilters, setShowFilters] = useState(true);

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
          No listings found for &apos;{location}&apos;.
        </p>
      )}

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...listings.filter((listing) => listing.price)].map(
          (
            {
              address,
              price,
              beds,
              propertyType,
              link,
              imgs,
              phone,
              emailButtonText,
              datePosted,
            },
            i
          ) => (
            <li
              key={i}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
            >
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={imgs[0]} // Use first image from array
                  alt={address}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="font-semibold text-lg">{address}</h2>
                  <p>
                    {price} — {beds}
                  </p>
                  <p className="italic text-sm">{propertyType}</p>
                  {phone && <p className="mt-2">{phone}</p>}
                  {emailButtonText && (
                    <p className="mt-1 text-sm text-blue-600">
                      {emailButtonText}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Posted: {new Date(datePosted).toLocaleDateString()}
                  </p>
                </div>
              </a>
            </li>
          )
        )}
      </ul>

      <Pagination location={location} currentPage={page} />
    </main>
  );
}

function Pagination({
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
          href={`/properties?location=${encodeURIComponent(
            location
          )}&page=${prevPage}`}
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
        href={`/properties?location=${encodeURIComponent(
          location
        )}&page=${nextPage}`}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        Next
      </Link>
    </div>
  );
}
