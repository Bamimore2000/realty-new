"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const [location, setLocation] = useState("");
  const router = useRouter();

  const onSearch = () => {
    if (!location.trim()) return;
    // Navigate to properties page with location as query param
    router.push(`/properties?location=${encodeURIComponent(location.trim())}`);
  };

  return (
    <section className="relative h-[85vh] flex items-center justify-center bg-gray-900 text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl px-4">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4 drop-shadow-md">
          Find your dream home today
        </h1>
        <p className="text-lg text-white/90 mb-6 drop-shadow">
          Browse homes, apartments, and neighborhoods near you.
        </p>

        {/* Search Box */}
        <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Enter city, ZIP, or address"
            className="flex-1 px-4 py-3 rounded-md text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
          />
          <Button className="w-full sm:w-auto px-6 py-3" onClick={onSearch}>
            Search
          </Button>
        </div>
      </div>
    </section>
  );
}
