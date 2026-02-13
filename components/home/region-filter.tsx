"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";
import { ScrollFade } from "../ui/scroll-fade";
import { fincas } from "@/lib/data";

interface RegionFilterProps {
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

export function RegionFilter({
  selectedRegion,
  onSelectRegion,
}: RegionFilterProps) {
  // Extract unique cities from fincas
  const cities = Array.from(
    new Set(
      fincas
        .map((finca) => {
          // Split by comma or hyphen to get the city name (first part)
          return finca.location.split(/[,-]/)[0].trim();
        })
        .filter((city) => {
          const lower = city.toLowerCase();
          // Filter out invalid or placeholder names
          return (
            city.length > 3 &&
            !lower.includes("donde") &&
            !lower.includes("?") &&
            !lower.includes("nan") &&
            !lower.includes("test")
          );
        })
        .map((city) => {
          // Title Case Normalization
          let normalized = city
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          // Fix specific typos
          if (normalized === "Villacencio") return "Villavicencio";

          return normalized;
        }),
    ),
  ).sort();

  const regions = [
    { id: "favoritas", label: "Favoritas" },
    ...cities.map((city) => ({ id: city, label: city })),
  ];

  return (
    <div className="container mx-auto px-4 mb-12">
      <ScrollFade className="w-full">
        <div className="flex items-center gap-3 pb-4">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => onSelectRegion(region.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border",
                selectedRegion === region.id
                  ? "bg-[#f9572a]/10 border-[#f9572a] text-[#f9572a]"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50",
              )}
            >
              {region.label}
            </button>
          ))}
        </div>
      </ScrollFade>
    </div>
  );
}
