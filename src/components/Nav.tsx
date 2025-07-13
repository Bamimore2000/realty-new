"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function Nav() {
  const [location, setLocation] = useState("");
  const router = useRouter();
  const [propertyType, setPropertyType] = useState<string | undefined>(
    undefined
  );
  const [minPrice, setMinPrice] = useState<string | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<string | undefined>(undefined);

  // Handler for the filter button click (to be customized)
  const handleFilter = () => {
    if (location)
      router.push(`/properties?location=${encodeURIComponent(location)}`);
  };

  return (
    <header className="sticky z-20 bg-white shadow-sm border-b py-4 px-6 rounded-md flex flex-col md:flex-row items-center gap-4 md:gap-6 md:justify-between">
      <div className="flex flex-wrap gap-4 w-full md:w-auto">
        <Input
          placeholder="Location (e.g. Houston)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full md:w-48"
        />

        <Select
          value={propertyType}
          onValueChange={setPropertyType}
          defaultValue=""
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
          </SelectContent>
        </Select>

        <Select value={minPrice} onValueChange={setMinPrice} defaultValue="">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Min Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="500">$500</SelectItem>
            <SelectItem value="1000">$1,000</SelectItem>
            <SelectItem value="1500">$1,500</SelectItem>
          </SelectContent>
        </Select>

        <Select value={maxPrice} onValueChange={setMaxPrice} defaultValue="">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Max Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2000">$2,000</SelectItem>
            <SelectItem value="3000">$3,000</SelectItem>
            <SelectItem value="4000">$4,000</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleFilter} className="bg-primary text-white">
          Filter
        </Button>
      </div>
    </header>
  );
}
