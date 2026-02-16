"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Users, MapPin } from "lucide-react";
import { StatsSection } from "./stats-section";
import Image from "next/image";

interface HeroSectionProps {
  filters: {
    destination: string;
    guests: string;
  };
  setFilters: (filters: { destination: string; guests: string }) => void;
}

export function HeroSection({ filters, setFilters }: HeroSectionProps) {
  return (
    <div
      id="inicio"
      className="relative min-h-fit md:h-[30vh] md:min-h-[360px] w-full flex flex-col items-center justify-center overflow-hidden bg-black py-10 md:py-0"
    >
      <div className="relative z-20 container mx-auto px-4 flex flex-col items-center text-center mt-0 3xl:mt-10">
        <Image
          src="/icons/fincas-ya-logo.png"
          alt="FincasYA"
          width={500}
          height={500}
          className="object-contain shrink-0 w-80 h-auto my-6"
        />
        {/* Search Bar */}
        <div className="w-full max-w-4xl bg-white rounded-xl p-4 md:p-2 md:pl-6 shadow-2xl flex flex-col md:flex-row items-center gap-1 md:gap-2">
          <div className="flex-1 w-full md:w-auto flex items-center gap-3 md:border-r border-gray-100 md:border-gray-200 pb-4 md:pb-0 md:pr-4">
            <div className="bg-gray-50 md:bg-transparent p-2.5 md:p-0 rounded-full md:rounded-none">
              <MapPin className="w-5 h-5 text-gray-500 md:hidden" />
            </div>
            <div className="text-left w-full">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                Destino
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400 hidden md:block" />
                <Input
                  type="text"
                  placeholder="¿A dónde vamos?"
                  className="border-0 p-0 h-auto text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 font-medium bg-transparent text-base"
                  value={filters.destination}
                  onChange={(e) =>
                    setFilters({ ...filters, destination: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="flex-1 w-full md:w-auto flex items-center gap-3 md:border-r border-gray-100 md:border-gray-200 pb-4 md:pb-0 md:px-4">
            <div className="bg-gray-50 md:bg-transparent p-2.5 md:p-0 rounded-full md:rounded-none">
              <Calendar className="w-5 h-5 text-gray-500 md:hidden" />
            </div>
            <div className="text-left w-full">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                Fechas
              </label>
              <div className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <Calendar className="w-4 h-4 hidden md:block" />
                <span className="text-sm font-medium text-gray-900 md:text-gray-400">
                  Agregar fechas
                </span>
              </div>
            </div>
          </div>

          {/* Guests */}
          <div className="flex-1 w-full md:w-auto flex items-center gap-3 pb-4 md:pb-0 md:px-4">
            <div className="bg-gray-50 md:bg-transparent p-2.5 md:p-0 rounded-full md:rounded-none">
              <Users className="w-5 h-5 text-gray-500 md:hidden" />
            </div>
            <div className="text-left w-full">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                Huéspedes
              </label>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400 hidden md:block" />
                <Input
                  type="number"
                  placeholder="¿Cuántos?"
                  className="border-0 p-0 h-auto text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 font-medium bg-transparent text-base"
                  value={filters.guests}
                  onChange={(e) =>
                    setFilters({ ...filters, guests: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <Button className="w-full md:w-auto inline-flex rounded-xl bg-[#f9572a] hover:bg-[#fa6b43] text-white px-8 py-4 md:py-6 h-12 transition-all shadow-md hover:shadow-lg text-lg md:text-base font-semibold mt-2 md:mt-0">
            <Search className="w-5 h-5 mr-2" />
            Buscar
          </Button>
        </div>
      </div>

      <StatsSection />
    </div>
  );
}
