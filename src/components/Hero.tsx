"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { US_STATES } from "@/lib/make-properties";
import { StateCode } from "@/lib/types/types";

interface LocationSuggestion {
  type: "state" | "city";
  stateCode: StateCode;
  stateName: string;
  city?: string;
  display: string;
}

export default function Hero() {
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Generate all location suggestions
  const getAllLocations = (): LocationSuggestion[] => {
    const locations: LocationSuggestion[] = [];

    Object.entries(US_STATES).forEach(([code, data]) => {
      const stateCode = code as StateCode;

      // Add state
      locations.push({
        type: "state",
        stateCode,
        stateName: data.name,
        display: `${data.name} (${code})`,
      });

      // Add cities
      data.cities.forEach((city) => {
        locations.push({
          type: "city",
          stateCode,
          stateName: data.name,
          city,
          display: `${city}, ${code}`,
        });
      });
    });

    return locations;
  };

  // Filter suggestions based on input
  const filterSuggestions = (input: string): LocationSuggestion[] => {
    if (!input.trim()) return [];

    const query = input.toLowerCase().trim();
    const allLocations = getAllLocations();

    return allLocations
      .filter((loc) => {
        const searchText = loc.display.toLowerCase();
        const stateNameLower = loc.stateName.toLowerCase();
        const cityLower = loc.city?.toLowerCase() || "";

        return (
          searchText.includes(query) ||
          stateNameLower.includes(query) ||
          cityLower.includes(query) ||
          loc.stateCode.toLowerCase().includes(query)
        );
      })
      .slice(0, 8); // Limit to 8 suggestions
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setLocation(value);
    const filtered = filterSuggestions(value);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedIndex(-1);
  };

  // Handle suggestion selection
  const selectSuggestion = (suggestion: LocationSuggestion) => {
    setLocation(suggestion.display);
    setShowSuggestions(false);
    setSuggestions([]);

    // Navigate immediately
    navigateToProperties(suggestion);
  };

  // Navigate to properties page
  const navigateToProperties = (suggestion: LocationSuggestion) => {
    const params = new URLSearchParams();
    params.set("state", suggestion.stateCode);

    if (suggestion.city) {
      params.set("city", suggestion.city);
    }

    router.push(`/properties?${params.toString()}`);
  };

  // Handle search button click
  const onSearch = () => {
    if (!location.trim()) return;

    // Try to match with existing suggestions
    const filtered = filterSuggestions(location);

    if (filtered.length > 0) {
      selectSuggestion(filtered[0]);
    } else {
      // If no match, try to extract state code
      const stateMatch = location.match(/\b([A-Z]{2})\b/);
      if (stateMatch && US_STATES[stateMatch[1]]) {
        const params = new URLSearchParams();
        params.set("state", stateMatch[1]);
        router.push(`/properties?${params.toString()}`);
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") onSearch();
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectSuggestion(suggestions[selectedIndex]);
        } else if (suggestions.length > 0) {
          selectSuggestion(suggestions[0]);
        } else {
          onSearch();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        {/* Search Box with Autocomplete */}
        <div className="relative max-w-xl mx-auto">
          <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter state or city (e.g., California, Miami, TX)"
                className="w-full px-4 py-3 rounded-md text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={location}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
              />

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-64 overflow-y-auto z-50"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.type}-${suggestion.stateCode}-${suggestion.city || ""}`}
                      className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                        index === selectedIndex ? "bg-blue-50" : ""
                      }`}
                      onClick={() => selectSuggestion(suggestion)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-800">
                            {suggestion.type === "city"
                              ? suggestion.city
                              : suggestion.stateName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {suggestion.type === "city"
                              ? `${suggestion.stateName} (${suggestion.stateCode})`
                              : `State - ${suggestion.stateCode}`}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 uppercase">
                          {suggestion.type}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button className="w-full sm:w-auto px-6 py-3" onClick={onSearch}>
              Search
            </Button>
          </div>

          {/* Helper text */}
          <p className="text-xs text-white/70 mt-2">
            Search by state name, state code, or city
          </p>
        </div>
      </div>
    </section>
  );
}
