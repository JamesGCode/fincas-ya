"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { RegionFilter } from "@/components/home/region-filter";
import { FeaturedFincas } from "@/components/home/featured-fincas";
import { HowItWorks } from "@/components/home/how-it-works";
import { CtaSection } from "@/components/home/cta-section";
import { fincas } from "@/lib/data";
import { useState, useMemo } from "react";

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState("favoritas");
  const [filters, setFilters] = useState({
    destination: "",
    guests: "",
  });

  const filteredFincas = useMemo(() => {
    let result = fincas;

    // Filter by destination
    if (filters.destination) {
      result = result.filter((f) =>
        f.location.toLowerCase().includes(filters.destination.toLowerCase()),
      );
    }

    // Filter by guests (capacity)
    if (filters.guests) {
      const guestsCount = parseInt(filters.guests);
      if (!isNaN(guestsCount)) {
        result = result.filter((f) => f.capacity >= guestsCount);
      }
    }

    // Filter by region/favorites (Tabs)
    if (selectedRegion === "favoritas") {
      // Show only favorite fincas
      return result
        .filter((f) => f.isFavorite)
        .sort((a, b) => b.rating - a.rating);
    }

    // Region Filtering Logic
    const REGION_MAPPING: Record<string, string[]> = {
      llanos: [
        "villavicencio",
        "restrepo",
        "acacias",
        "puerto lopez",
        "apiay",
        "pachaquiaro",
        "meta",
        "vanguardia",
      ],
      cundinamarca: [
        "viotá",
        "anapoima",
        "la mesa",
        "tocaima",
        "girardot",
        "ricaurte",
        "nilo",
        "apulo",
        "tenjo",
        "nocaima",
        "chinauta",
        "fusagasugá",
        "la vega",
        "villeta",
        "bogota",
      ],
      tolima: ["melgar", "carmen de apicala", "icononzo"],
      "eje-cafetero": [
        "quimbaya",
        "parque del cafe",
        "el guadual",
        "armenia",
        "pereira",
        "manizales",
        "quindio",
        "risaralda",
        "caldas",
      ],
      santander: ["san gil", "barichara", "socorro", "bucaramanga"],
    };

    const targetLocations = REGION_MAPPING[selectedRegion] || [];

    return result.filter((f) => {
      const location = f.location.toLowerCase();
      // Check if finca location matches any of the mapped locations for the selected region
      return targetLocations.some((target) => location.includes(target));
    });
  }, [selectedRegion, filters]);

  const sectionTitle = useMemo(() => {
    if (filters.destination) return `Resultados para "${filters.destination}"`;
    if (selectedRegion === "favoritas") return "Favoritas entre huéspedes";

    const regionLabels: Record<string, string> = {
      "eje-cafetero": "Eje Cafetero",
      tolima: "Tolima",
      cundinamarca: "Cundinamarca",
      llanos: "Llanos Orientales",
    };

    return `Fincas en ${regionLabels[selectedRegion] || selectedRegion}`;
  }, [selectedRegion, filters.destination]);

  // Limit removed to show all filtered items
  const displayFincas = filteredFincas;

  return (
    <main className="relative min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <HeroSection filters={filters} setFilters={setFilters} />

      <div id="fincas" className="max-w-[1600px] w-full mx-auto px-4 md:px-8">
        <RegionFilter
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />
        <FeaturedFincas fincas={displayFincas} title={sectionTitle} />
      </div>

      <HowItWorks />
      <CtaSection />
      <Footer />
    </main>
  );
}
