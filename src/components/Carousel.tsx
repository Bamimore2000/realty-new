"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Listing } from "@/types";
import PropertyCard from "./PropertyCard";

// Dummy/random helper functions
const getRandomPrice = () => `$${Math.floor(Math.random() * 5000 + 500)}`;
const getRandomBeds = () => `${Math.floor(Math.random() * 5 + 1)}`;
const getRandomPhone = () =>
  `+1-${Math.floor(100 + Math.random() * 900)}-${Math.floor(
    100 + Math.random() * 900
  )}-${Math.floor(1000 + Math.random() * 9000)}`;
const getRandomEmailText = () => "Contact";

interface CarouselProps {
  properties: Listing[];
}

// Fill in missing fields with dummy/random values (leave images untouched)
const sanitizeListing = (listing: Listing): Listing => {
  return {
    address: listing.address || "Unknown Address",
    propertyType: listing.propertyType || "Apartment",
    price: listing.price || getRandomPrice(),
    beds: listing.beds || getRandomBeds(),
    imgs: listing.imgs || [], // do not modify images
    link: listing.link || "#",
    phone: listing.phone || getRandomPhone(),
    emailButtonText: listing.emailButtonText || getRandomEmailText(),
    datePosted: listing.datePosted || new Date().toISOString(),
    source: listing.source || "Unknown",
  };
};

export default function Carousel({ properties }: CarouselProps) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    loop: false,
    skipSnaps: false,
  });

  if (!properties.length) return null;

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-5">
        {properties.map((listing, idx) => (
          <div
            key={`${listing.address}-${idx}`}
            className="min-w-full sm:min-w-[48%] lg:min-w-[32%]"
          >
            <PropertyCard property={sanitizeListing(listing)} />
          </div>
        ))}
      </div>
    </div>
  );
}
