"use client";

import { Property } from "@/types";
import { Button } from "@/components/ui/button";
import { Heart, HeartOff, BedDouble, Bath, MapPin } from "lucide-react";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Card, CardContent } from "@/components/ui/card";
import { Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

interface Props {
  property: Property & { views?: number; maxViews?: number };
}

export default function PropertyCard({ property }: Props) {
  const [liked, setLiked] = useState(property.isLiked || false);

  return (
    <Card className="group relative rounded-2xl py-0 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br from-white to-gray-100">
      {/* Image Slider */}
      <div className="relative overflow-hidden">
        <Swiper
          modules={[Autoplay, A11y]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: true }}
          className="rounded-t-2xl"
          a11y={{
            prevSlideMessage: "Previous slide",
            nextSlideMessage: "Next slide",
          }}
        >
          {property.images.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-52 overflow-hidden">
                <Image
                  src={img}
                  alt={`Property image ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={i === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Like Button */}
        <Button
          onClick={() => setLiked(!liked)}
          variant="ghost"
          size="icon"
          aria-label={liked ? "Unlike property" : "Like property"}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          {liked ? (
            <Heart className="w-6 h-6 text-gray-600 fill-gray-600 transition-transform duration-300" />
          ) : (
            <HeartOff className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors duration-300" />
          )}
        </Button>
      </div>

      <CardContent className="p-5 space-y-3">
        {/* Title and Status */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 truncate">
            {property.title}
          </h3>
          <span className="text-sm font-semibold bg-gray-300 text-gray-700 text-center px-3 py-1 rounded-full uppercase tracking-wide select-none">
            {"For Rent"}
          </span>
        </div>

        {/* Address */}
        <div className="flex items-center text-sm text-gray-500 gap-2">
          <MapPin className="w-5 h-5 text-gray-500" />
          <span className="truncate">{property.address}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-gray-500" />
            <span>{extractBeds(property.address)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="w-5 h-5 text-gray-500" />
            <span>{extractBaths(property.address)}</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-2xl font-extrabold text-gray-900">
            ${property.price.toLocaleString()}
          </p>
          <Button
            variant="outline"
            className="border-gray-500 text-gray-700 hover:bg-gray-700 hover:text-white transition-colors duration-300"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper functions
function extractBeds(address: string) {
  const match = address.match(/(\d+)\s*bed/i);
  return match ? `${match[1]} Beds` : "-";
}

function extractBaths(address: string) {
  const match = address.match(/(\d+)\s*bath/i);
  return match ? `${match[1]} Baths` : "-";
}
