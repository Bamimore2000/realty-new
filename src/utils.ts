import { Listing } from './app/properties/page';

import { Property } from "@/types";

export function transformListings(listings: Listing[]): Property[] {
    console.log({ listings })
    return listings.map((listing, index) => ({
        id: `listing-${index}`, // or generate a UUID if needed
        title: listing.title,
        address: `${listing.type} • ${listing.bedBath} • ${listing.phone}`,
        price: Number(listing.price.replace(/[^\d]/g, "")), // strip symbols, commas
        images: [listing.img], // assuming one image, wrap in array
        isLiked: false,
    }));
}
