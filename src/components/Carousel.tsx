"use client";

import useEmblaCarousel from "embla-carousel-react";
import { PropertyCard } from "./PropertyCard";
import { Listing } from "./Listings";

// Use the exact Listing type that matches your generated data

interface CarouselProps {
  properties: Listing[];
}

export default function Carousel({ properties }: CarouselProps) {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  // Empty state
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No properties available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Carousel Viewport */}
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex -ml-4">
          {properties.map((property) => (
            <div
              key={property.id} // Reliable unique key from faker
              className="flex-none pl-4 min-w-0
                         w-full
                         sm:w-1/2
                         lg:w-1/3"
            >
              <PropertyCard listing={property} />
            </div>
          ))}
        </div>
      </div>

      {/* Optional subtle dots (only if many items) */}
      {properties.length > 3 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array(Math.ceil(properties.length / 3))
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-gray-300 transition-all"
              />
            ))}
        </div>
      )}
    </div>
  );
}
