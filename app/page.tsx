"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/home/hero-section";
import { RegionFilter } from "@/components/home/region-filter";
import { FeaturedFincas } from "@/components/home/featured-fincas";
import { CtaSection } from "@/components/home/cta-section";
import { useProperties, PropertyResponse } from "@/hooks/use-properties";
import { useState, useMemo, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useHomeStore } from "@/hooks/use-home-store";
import { SocialSection } from "@/components/home/social-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";

export default function Home() {
  const { category, destination, guests, propertyName, setCategory } =
    useHomeStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const { data: propertiesData, isLoading } = useProperties({ limit: 1000 });
  const fincas = useMemo(
    () => propertiesData?.properties || propertiesData?.data || [],
    [propertiesData],
  );

  // 1. Stage 1: Filter by search bar criteria (Destination + Guests)
  const searchFilteredFincas = useMemo(() => {
    let result = fincas;

    // Filter by destination (search bar)
    if (destination) {
      result = result.filter((f: PropertyResponse) =>
        (f.location || "").toLowerCase().includes(destination.toLowerCase()),
      );
    }

    // Filter by guests (search bar)
    if (guests) {
      const guestsCount = parseInt(guests);
      if (!isNaN(guestsCount)) {
        result = result.filter(
          (f: PropertyResponse) => f.capacity >= guestsCount,
        );
      }
    }

    // Filter by name (search bar)
    if (propertyName) {
      result = result.filter((f: PropertyResponse) =>
        (f.title || "").toLowerCase().includes(propertyName.toLowerCase()),
      );
    }

    return result;
  }, [destination, guests, fincas, propertyName]);

  // 2. Stage 2: Calculate available regions based on search results
  const availableRegions = useMemo(() => {
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

    const available = new Set<string>();

    searchFilteredFincas.forEach((f) => {
      const location = (f.location || "").toLowerCase();
      const title = (f.title || "").toLowerCase();
      const description = (f.description || "").toLowerCase();

      // Check standard regions
      Object.entries(REGION_MAPPING).forEach(([id, targets]) => {
        if (targets.some((t) => location.includes(t))) {
          available.add(id);
        }
      });

      // Check Luxury
      if (
        title.includes("luxury") ||
        description.includes("lujo") ||
        (f.seasonPrices?.base || 0) >= 3000000
      ) {
        available.add("luxury");
      }

      // Check Eventos
      const searchText = `${title} ${description} ${location}`;
      if (
        searchText.includes("evento") ||
        searchText.includes("boda") ||
        searchText.includes("matrimonio") ||
        searchText.includes("fiesta") ||
        searchText.includes("reunión")
      ) {
        available.add("eventos");
      }
    });

    return Array.from(available);
  }, [searchFilteredFincas]);

  // 3. Stage 3: Final filter by category (Region Tab)
  const filteredFincas = useMemo(() => {
    let result = searchFilteredFincas;

    // Region Filtering Logic (Tabs)
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
  }, [category, searchFilteredFincas]);

  const sectionTitle = useMemo(() => {
    if (destination && filteredFincas.length > 0)
      return `Resultados para "${destination}"`;

    const regionLabels: Record<string, string> = {
      todas: "Todas las Fincas",
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
  }, [category, destination, filteredFincas.length]);
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
          <HeroSection />

          <div
            id="fincas"
            className="max-w-[1600px] w-full mx-auto px-4 md:px-8"
          >
            <RegionFilter
              selectedRegion={category}
              onSelectRegion={setCategory}
              availableRegions={availableRegions}
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

          <SocialSection />
          <TestimonialsSection />
          <CtaSection />
          <Footer />
        </>
      )}
    </main>
  );
}
