"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Heart,
  BedDouble,
  Bath,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Listing } from "@/types";

interface PropertyCardProps {
  property: Listing & {
    isLiked?: boolean;
    baths?: number;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Fallback / dummy values
  const {
    imgs = ["/placeholder.png"],
    isLiked = false,
    price = "$1,000",
    address = "Unknown Address",
    beds = 1,
    baths = 1,
    phone = "000-000-0000",
    emailButtonText = "Contact",
    link = "#",
    datePosted = new Date().toISOString(),
  } = property;

  const [liked, setLiked] = useState(Boolean(isLiked));
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  ]);

  const toggleLike = useCallback(() => {
    setLiked((prev) => !prev);
  }, []);

  return (
    <Card className="group relative overflow-hidden pt-0 rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-gray-200">
      {/* Image Carousel */}
      <div className="relative overflow-hidden bg-gray-100" ref={emblaRef}>
        <div className="flex">
          {imgs.slice(0, 1).map((src, index) => (
            <div key={src} className="relative select-none min-w-full h-72">
              <Image
                src={src}
                alt={`${address} image ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20" />
            </div>
          ))}
        </div>

        {/* Top Bar - Like Button & Date */}
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
          {/* Date Badge */}
          <div className="rounded-lg bg-white/98 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm border border-white/40">
            {new Date(datePosted).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          {/* Like Button */}
          <Button
            onClick={toggleLike}
            variant="ghost"
            size="icon"
            aria-label={liked ? "Unlike property" : "Like property"}
            className="h-9 w-9 rounded-lg bg-white/98 backdrop-blur-md shadow-sm border border-white/40 transition-all hover:scale-105 hover:bg-white hover:shadow-md"
          >
            <Heart
              className={`h-4 w-4 transition-all ${
                liked
                  ? "fill-rose-500 text-rose-500 scale-110"
                  : "text-gray-600 hover:text-rose-500"
              }`}
            />
          </Button>
        </div>

        {/* Bottom Badge - For Rent */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/98 backdrop-blur-md px-4 py-2 shadow-lg border border-white/40">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
              Available for Rent
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Price Section */}
        <div className="mb-4 flex items-end justify-between border-b border-gray-100 pb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-gray-900">
              {price}
            </span>
            <span className="text-sm font-medium text-gray-500 mb-1">
              per month
            </span>
          </div>
        </div>

        {/* Address */}
        <div className="mb-5 flex items-start gap-2.5">
          <div className="mt-0.5 rounded-lg bg-gray-50 p-2">
            <MapPin className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900">
              {address}
            </h3>
          </div>
        </div>

        {/* Property Features */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 px-4 py-3 border border-blue-100">
            <BedDouble className="h-5 w-5 text-blue-600" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">{beds}</span>
              <span className="text-xs text-gray-600">
                {beds === 1 ? "Bedroom" : "Bedrooms"}
              </span>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 px-4 py-3 border border-purple-100">
            <Bath className="h-5 w-5 text-purple-600" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">{baths}</span>
              <span className="text-xs text-gray-600">
                {baths === 1 ? "Bathroom" : "Bathrooms"}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        {(phone || emailButtonText) && (
          <div className="mb-5 space-y-2.5">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 transition-all hover:bg-gray-100 hover:shadow-sm group/phone"
              >
                <div className="rounded-lg bg-white p-2 shadow-sm border border-gray-100 group-hover/phone:border-blue-200 transition-colors">
                  <Phone className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 mb-0.5">
                    Phone
                  </p>
                  <p className="text-sm font-semibold text-gray-900">{phone}</p>
                </div>
              </a>
            )}
            {emailButtonText && (
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
                <div className="rounded-lg bg-white p-2 shadow-sm border border-gray-100">
                  <Mail className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 mb-0.5">
                    Contact
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {emailButtonText}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* View Details Button */}
        <Button
          onClick={() => window.open(link, "_blank")}
          className="w-full rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 py-6 font-semibold text-white shadow-md transition-all hover:shadow-lg hover:from-gray-800 hover:to-gray-700 active:scale-[0.98]"
        >
          <span>View Full Details</span>
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
