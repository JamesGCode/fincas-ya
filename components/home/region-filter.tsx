"use client";
import { cn } from "@/lib/utils";
import { ScrollFade } from "../ui/scroll-fade";
import { MapPin, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RegionFilterProps {
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

export function RegionFilter({
  selectedRegion,
  onSelectRegion,
}: RegionFilterProps) {
  const regions = [
    { id: "todas", label: "Todas" },
    { id: "cerca-bogota", label: "Cerca a Bogotá" },
    { id: "melgar", label: "Melgar" },
    { id: "villavicencio", label: "Villavicencio" },
    { id: "anapoima", label: "Anapoima" },
    { id: "villeta", label: "Villeta" },
    { id: "playa", label: "Destinos de Playa" },
    { id: "luxury", label: "Fincas de Lujo" },
    { id: "eventos", label: "Eventos" },
  ];

  const visibleRegions = regions.slice(0, 4);
  const hiddenRegions = regions.slice(4);
  const isSelectedInHidden = hiddenRegions.some(
    (region) => region.id === selectedRegion,
  );
  const selectedHiddenRegion = hiddenRegions.find(
    (region) => region.id === selectedRegion,
  );

  return (
    <div className="container mx-auto px-4 mt-6">
      <ScrollFade className="w-full">
        <div className="flex items-center gap-3 pb-4">
          {visibleRegions.map((region) => (
            <button
              key={region.id}
              onClick={() => onSelectRegion(region.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap border cursor-pointer",
                selectedRegion === region.id
                  ? "bg-[#f9572a]/10 border-[#f9572a] text-[#f9572a]"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50",
              )}
            >
              <MapPin className="w-4 h-4" />
              {region.label}
            </button>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap border cursor-pointer outline-none",
                  isSelectedInHidden
                    ? "bg-[#f9572a]/10 border-[#f9572a] text-[#f9572a]"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50",
                )}
              >
                <MapPin className="w-4 h-4" />
                {isSelectedInHidden
                  ? selectedHiddenRegion?.label
                  : "Más filtros"}
                <ChevronDown
                  className={cn(
                    "w-4 h-4 opacity-70 transition-transform duration-300",
                    isSelectedInHidden && "rotate-0",
                  )}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-56 rounded-2xl p-2 border-gray-100 shadow-xl overflow-hidden"
            >
              {hiddenRegions.map((region) => (
                <DropdownMenuItem
                  key={region.id}
                  onClick={() => onSelectRegion(region.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors focus:bg-[#f9572a]/5 focus:text-[#f9572a]",
                    selectedRegion === region.id
                      ? "bg-[#f9572a]/5 text-[#f9572a] font-bold"
                      : "text-gray-600",
                  )}
                >
                  <MapPin className="w-4 h-4 opacity-50" />
                  <span className="text-sm font-medium">{region.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ScrollFade>
    </div>
  );
}
