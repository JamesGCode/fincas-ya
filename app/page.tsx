"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/home/hero-section";
import { RegionFilter } from "@/components/home/region-filter";
import { FeaturedFincas } from "@/components/home/featured-fincas";
import { HowItWorks } from "@/components/home/how-it-works";
import { CtaSection } from "@/components/home/cta-section";
import { useProperties, PropertyResponse } from "@/hooks/use-properties";
import { useState, useMemo, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useHomeStore } from "@/hooks/use-home-store";

export default function Home() {
  const {
    category,
    destination,
    guests,
    setCategory,
    setDestination,
    setGuests,
  } = useHomeStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const filters = { destination, guests };
  const handleSetFilters = (
    newFilters:
      | { destination: string; guests: string }
      | ((prev: { destination: string; guests: string }) => {
          destination: string;
          guests: string;
        }),
  ) => {
    let result;
    if (typeof newFilters === "function") {
      result = newFilters({ destination, guests });
    } else {
      result = newFilters;
    }
    setDestination(result.destination);
    setGuests(result.guests);
  };

  const { data: propertiesData, isLoading } = useProperties({ limit: 1000 });
  const fincas = useMemo(() => propertiesData?.data || [], [propertiesData]);

  const filteredFincas = useMemo(() => {
    let result = fincas;

    // Filter by destination
    if (destination) {
      result = result.filter((f: PropertyResponse) =>
        (f.location || "").toLowerCase().includes(destination.toLowerCase()),
      );
    }

    // Filter by guests (capacity)
    if (guests) {
      const guestsCount = parseInt(guests);
      if (!isNaN(guestsCount)) {
        result = result.filter(
          (f: PropertyResponse) => f.capacity >= guestsCount,
        );
      }
    }

    // Region Filtering Logic
    const REGION_MAPPING: Record<string, string[]> = {
      "cerca-bogota": [
        "viotá",
        "cundinamarca",
        "tocaima",
        "tenjo",
        "girardot",
        "nocaima",
      ],
      melgar: ["melgar"],
      villavicencio: ["villavicencio"],
      anapoima: ["anapoima"],
      villeta: ["villeta"],
      playa: ["santa marta", "cartagena"],
      luxury: [],
      eventos: [],
    };

    // Special handling for "Luxury"
    if (category === "luxury") {
      return result.filter(
        (f: PropertyResponse) =>
          (f.title || "").toLowerCase().includes("luxury") ||
          (f.description || "").toLowerCase().includes("lujo") ||
          (f.seasonPrices?.base || 0) >= 3000000,
      );
    }

    // Special handling for "Eventos"
    if (category === "eventos") {
      return result.filter((f: PropertyResponse) => {
        const searchText =
          `${f.title || ""} ${f.description || ""} ${f.location || ""}`.toLowerCase();
        return (
          searchText.includes("evento") ||
          searchText.includes("boda") ||
          searchText.includes("matrimonio") ||
          searchText.includes("fiesta") ||
          searchText.includes("reunión")
        );
      });
    }

    const targetLocations = REGION_MAPPING[category] || [];

    if (targetLocations.length > 0) {
      return result.filter((f: PropertyResponse) => {
        const location = (f.location || "").toLowerCase();
        return targetLocations.some((target) => location.includes(target));
      });
    }

    return result;
  }, [category, destination, guests, fincas]);

  const sectionTitle = useMemo(() => {
    if (destination) return `Resultados para "${destination}"`;

    const regionLabels: Record<string, string> = {
      "cerca-bogota": "Cerca a Bogotá",
      melgar: "Melgar",
      villavicencio: "Villavicencio",
      anapoima: "Anapoima",
      villeta: "Villeta",
      playa: "Destinos de Playa",
      luxury: "Fincas de Lujo",
      eventos: "Fincas para Eventos",
    };

    return regionLabels[category] || "Fincas Destacadas";
  }, [category, destination]);

  const displayFincas = filteredFincas;

  // Render logic
  return (
    <main className="relative min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      {!isHydrated ? (
        <div className="container mx-auto px-0 md:px-0 mb-20 mt-8 py-20">
          {/* Skeleton for Hero/Initial load */}
          <div className="w-full h-96 bg-gray-100 animate-pulse mb-8" />
          <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8">
            <div className="flex gap-4 mb-8 overflow-x-auto">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-32 rounded-full" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton className="aspect-4/3 w-full rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Footer />
        </div>
      ) : (
        <>
          <HeroSection filters={filters} setFilters={handleSetFilters} />

          <div
            id="fincas"
            className="max-w-[1600px] w-full mx-auto px-4 md:px-8"
          >
            <RegionFilter
              selectedRegion={category}
              onSelectRegion={setCategory}
            />
            {isLoading ? (
              <div className="container mx-auto px-0 md:px-0 mb-20 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="flex flex-col gap-3">
                      <Skeleton className="aspect-4/3 w-full rounded-2xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <FeaturedFincas fincas={displayFincas} title={sectionTitle} />
            )}
          </div>

          <HowItWorks />
          <CtaSection />
          <Footer />
        </>
      )}
    </main>
  );
}
