"use client";

import { useRef, useState, useMemo } from "react";
import { fincas } from "@/lib/data";
import { FincaCard } from "@/components/fincas/finca-card";
import { Filters, FilterValues } from "@/components/fincas/filters";
import { ScrollFade } from "../ui/scroll-fade";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DestinationTab = "todas" | "cundinamarca" | "eje-cafetero" | "tolima";

export function FincaList() {
  const [filters, setFilters] = useState<FilterValues>({
    destination: "",
    guests: "",
  });
  const [activeTab, setActiveTab] = useState<DestinationTab>("todas");

  // Filter fincas based on filter values
  const filteredFincas = useMemo(() => {
    return fincas.filter((finca) => {
      // Destination filter
      if (
        filters.destination &&
        !finca.location
          .toLowerCase()
          .includes(filters.destination.toLowerCase())
      ) {
        return false;
      }

      // Guests filter
      if (filters.guests) {
        const capacity = finca.capacity;
        switch (filters.guests) {
          case "1-5":
            if (capacity < 1 || capacity > 5) return false;
            break;
          case "6-10":
            if (capacity < 6 || capacity > 10) return false;
            break;
          case "11-20":
            if (capacity < 11 || capacity > 20) return false;
            break;
          case "20+":
            if (capacity <= 20) return false;
            break;
        }
      }

      return true;
    });
  }, [filters]);

  // Regional sections
  const favoriteFincas = filteredFincas.filter((f) => f.rating >= 4.8);
  const tolimaFincas = filteredFincas.filter((f) =>
    f.location.toLowerCase().includes("tolima"),
  );
  const cundinamarcaFincas = filteredFincas.filter((f) =>
    f.location.toLowerCase().includes("cundinamarca"),
  );
  const ejeCafeteroFincas = filteredFincas.filter(
    (f) =>
      f.location.toLowerCase().includes("quindío") ||
      f.location.toLowerCase().includes("caldas") ||
      f.location.toLowerCase().includes("risaralda") ||
      f.location.toLowerCase().includes("armenia"),
  );

  return (
    <section className="pt-14 pb-48 container mx-auto lg:px-20">
      <div className="text-center mb-12">
        <Image
          src="/icons/fincas-ya-logo.png"
          alt="Fincas Ya"
          width={100}
          height={100}
          className="w-56 h-auto object-contain mx-auto mb-8 pointer-events-none select-none"
        />
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-2 tracking-tight">
          Explora Todas las Fincas
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          ✨ Encuentra el lugar perfecto para tu próxima escapada ✨
        </p>
      </div>

      {/* Mobile: ScrollFade with pill buttons */}
      <div className="md:hidden mb-12">
        <ScrollFade className="px-4">
          <div className="flex gap-2">
            {[
              { value: "todas", label: "🌎 Todas" },
              { value: "cundinamarca", label: "🏔️ Cundinamarca" },
              { value: "eje-cafetero", label: "☕ Eje Cafetero" },
              { value: "tolima", label: "🌴 Tolima" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as DestinationTab)}
                className={`py-2.5 px-5 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                  activeTab === tab.value
                    ? "bg-white text-black shadow-lg"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </ScrollFade>
      </div>

      {/* Desktop: Original Tabs component */}
      <div className="hidden md:flex justify-center mb-12">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as DestinationTab)}
          className="w-full max-w-2xl"
        >
          <TabsList className="grid w-full grid-cols-4 p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl group-data-[orientation=horizontal]/tabs:h-auto!">
            <TabsTrigger value="todas" className="py-2.5 rounded-lg">
              🌎 Todas
            </TabsTrigger>
            <TabsTrigger value="cundinamarca" className="py-2.5 rounded-lg">
              🏔️ Cundinamarca
            </TabsTrigger>
            <TabsTrigger value="eje-cafetero" className="py-2.5 rounded-lg">
              ☕ Eje Cafetero
            </TabsTrigger>
            <TabsTrigger value="tolima" className="py-2.5 rounded-lg">
              🌴 Tolima
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Filters values={filters} onChange={setFilters} />

      <div className="mt-16">
        {activeTab === "todas" ? (
          <div className="space-y-20">
            {/* Curated Overview for "Todas" */}
            {favoriteFincas.length > 0 && (
              <CarouselSection
                title="✨ Favoritas entre Huéspedes"
                subtitle="Las propiedades mejor calificadas por nuestra comunidad 🎉"
                icon={
                  <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                }
                fincas={favoriteFincas}
              />
            )}

            {cundinamarcaFincas.length > 0 && (
              <CarouselSection
                title="🏔️ Fincas en Cundinamarca"
                subtitle="Descubre las mejores propiedades cerca de Bogotá 🌄"
                fincas={cundinamarcaFincas}
              />
            )}

            {ejeCafeteroFincas.length > 0 && (
              <CarouselSection
                title="☕ Fincas en el Eje Cafetero"
                subtitle="Explora la región cafetera de Colombia ☕🌿"
                fincas={ejeCafeteroFincas}
              />
            )}

            {tolimaFincas.length > 0 && (
              <CarouselSection
                title="🌴 Fincas en Tolima"
                subtitle="Relájate en el clima cálido del Tolima 🌴☀️"
                fincas={tolimaFincas}
              />
            )}

            {filteredFincas.length > 0 && (
              <CarouselSection
                title="🌟 Todas las Fincas"
                subtitle="Explora nuestra colección completa 🗺️"
                fincas={filteredFincas}
              />
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Grid display for specific region */}
            <div className="max-md:px-3">
              <h3 className="text-2xl md:text-3xl font-bold font-display tracking-tight mb-8 capitalize flex items-center gap-2">
                {activeTab === "cundinamarca" && "🏔️ Cundinamarca"}
                {activeTab === "eje-cafetero" && "☕ Eje Cafetero"}
                {activeTab === "tolima" && "🌴 Tolima"}
              </h3>

              {filteredFincas.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {filteredFincas.map((finca, index) => (
                    <FincaCard key={finca.id} finca={finca} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">
                    😕 No se encontraron fincas en esta región con los filtros
                    seleccionados.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "todas" && filteredFincas.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              😕 No se encontraron fincas con los filtros seleccionados.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

interface CarouselSectionProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  fincas: typeof fincas;
}

function CarouselSection({
  title,
  subtitle,
  icon,
  fincas,
}: CarouselSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="max-md:px-4">
          <h3 className="text-2xl md:text-3xl font-bold font-display tracking-tight flex items-center gap-2">
            {icon}
            {title}
          </h3>
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="rounded-full hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="rounded-full hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <ScrollFade ref={scrollRef} className="pb-4 px-4">
        <div className="flex gap-6">
          {fincas.map((finca, index) => (
            <div key={finca.id} className="w-[300px] md:w-[340px] shrink-0">
              <FincaCard finca={finca} index={index} />
            </div>
          ))}
        </div>
      </ScrollFade>
    </div>
  );
}
