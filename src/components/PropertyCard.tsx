"use client";

import Image from "next/image";
import { Listing } from "./Listings";
import { Bed, Bath, Square, Phone } from "lucide-react";

interface Props {
  listing: Listing;
}

export function PropertyCard({ listing }: Props) {
  const {
    title,
    priceFormatted,
    beds,
    baths,
    sqft,
    address,
    image,
    images,
    description,
    agent,
    phone,
    status,
    yearBuilt,
    amenities,
  } = listing;

  return (
    <div className="rounded-xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      {/* Image */}
      <div className="relative h-56 w-full">
        <Image src={image} alt={title} fill className="object-cover" priority />

        <span
          className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full ${
            status === "For Sale"
              ? "bg-green-600 text-white"
              : "bg-blue-600 text-white"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Price */}
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-semibold text-lg leading-tight">{title}</h3>
          <p className="font-bold text-lg text-primary">{priceFormatted}</p>
        </div>

        {/* Address */}
        <p className="text-sm text-muted-foreground">{address}</p>

        {/* Specs */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Bed size={16} /> {beds} Beds
          </span>
          <span className="flex items-center gap-1">
            <Bath size={16} /> {baths} Baths
          </span>
          <span className="flex items-center gap-1">
            <Square size={16} /> {sqft} sqft
          </span>
        </div>

        {/* Meta */}
        <div className="text-xs text-muted-foreground">
          Built in {yearBuilt}
        </div>

        {/* Description */}
        <p className="text-sm line-clamp-3">{description}</p>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {amenities.slice(0, 5).map((amenity) => (
              <span
                key={amenity}
                className="text-xs px-2 py-1 bg-muted rounded-md"
              >
                {amenity}
              </span>
            ))}
            {amenities.length > 5 && (
              <span className="text-xs text-muted-foreground">
                +{amenities.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Agent */}
        <div className="border-t pt-3 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">{agent}</p>
            <p className="text-xs text-muted-foreground">Listing Agent</p>
          </div>

          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 text-sm font-medium text-primary"
          >
            <Phone size={16} />
            Call
          </a>
        </div>
      </div>
    </div>
  );
}
