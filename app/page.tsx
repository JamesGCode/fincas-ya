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

    return result.filter((f) =>
      f.location.toLowerCase().includes(selectedRegion.toLowerCase()),
    );
  }, [selectedRegion, filters]);

  const sectionTitle = useMemo(() => {
    if (filters.destination) return `Resultados para "${filters.destination}"`;
    if (selectedRegion === "favoritas") return "Favoritas entre huéspedes";
    return `Fincas en ${selectedRegion}`;
  }, [selectedRegion, filters.destination]);

  // Limit removed to show all filtered items
  const displayFincas = filteredFincas;

  return (
    <main className="relative min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <HeroSection filters={filters} setFilters={setFilters} />
      <StatsSection />

      <div id="fincas" className="max-w-7xl w-full mx-auto">
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
