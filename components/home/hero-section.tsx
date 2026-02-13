"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Users, MapPin } from "lucide-react";
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
      className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-[#131313]/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Finca"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-20 container mx-auto px-4 flex flex-col items-center text-center mt-20 md:mt-[-50px]">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
          Reserva tu finca perfecta{" "}
          <span className="text-orange-500">en minutos</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl font-light">
          Más de 500 fincas verificadas en las mejores regiones de Colombia
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-4xl bg-white rounded-xl p-6 md:p-2 md:pl-6 shadow-2xl flex flex-col md:flex-row items-center gap-6 md:gap-2">
          {/* Destination */}
          <div className="flex-1 w-full md:w-auto flex items-center gap-3 border-b md:border-b-0 md:border-r border-gray-100 md:border-gray-200 pb-6 md:pb-0 md:pr-4">
            <div className="bg-gray-50 md:bg-transparent p-2.5 md:p-0 rounded-full md:rounded-none">
              <MapPin className="w-5 h-5 text-gray-500 md:hidden" />
            </div>
            <div className="text-left w-full">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                Destino
              </label>
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

          {/* Dates */}
          <div className="flex-1 w-full md:w-auto flex items-center gap-3 border-b md:border-b-0 md:border-r border-gray-100 md:border-gray-200 pb-6 md:pb-0 md:px-4">
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

          {/* Search Button */}
          <Button className="hidden md:inline-flex md:w-auto rounded-xl bg-[#f9572a] hover:bg-[#fa6b43] text-white px-8 py-4 md:py-6 h-auto transition-all shadow-md hover:shadow-lg text-lg md:text-base font-semibold">
            <Search className="w-5 h-5 mr-2" />
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
}
