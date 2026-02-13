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
  const [selectedRegion, setSelectedRegion] = useState("todas");

  const filteredFincas = useMemo(() => {
    if (selectedRegion === "todas") {
      // Show all fincas, favorites first
      return [...fincas].sort((a, b) => {
        if (a.isFavorite === b.isFavorite) {
          return b.rating - a.rating;
        }
        return a.isFavorite ? -1 : 1;
      });
    }
    return fincas.filter((f) =>
      f.location.toLowerCase().includes(selectedRegion.toLowerCase()),
    );
  }, [selectedRegion]);

  // Limit to 6 items to match design "6 fincas disponibles"
  const displayFincas = filteredFincas.slice(0, 6);

  return (
    <main className="relative min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <StatsSection />

      <div id="fincas" className="max-w-7xl w-full mx-auto">
        <RegionFilter
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />
        <FeaturedFincas fincas={displayFincas} />
      </div>

      <HowItWorks />
      <CtaSection />
      <Footer />
    </main>
  );
}
