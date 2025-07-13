"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import PropertyCard from "./PropertyCard";

import { Property } from "@/types";

interface CarouselProps {
  properties: Property[];
}

export default function Carousel({ properties }: CarouselProps) {
  return (
    <Swiper
      modules={[Pagination, A11y]}
      spaceBetween={20}
      slidesPerView={1}
      // navigation
      pagination={{ clickable: true }}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      className=""
    >
      {properties.map((listing, i) => (
        <SwiperSlide className="pb-10" key={i}>
          <PropertyCard property={listing} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
