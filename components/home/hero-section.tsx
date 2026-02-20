"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Calendar as CalendarIcon,
  Users,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { StatsSection } from "./stats-section";
import Image from "next/image";
import { useHomeStore } from "@/hooks/use-home-store";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const {
    dateRange,
    setDateRange,
    guests,
    setGuests,
    destination,
    setDestination,
  } = useHomeStore();

  const formattedDateRange = useMemo(() => {
    if (dateRange?.from) {
      if (dateRange.to) {
        return `${format(dateRange.from, "dd MMM", { locale: es })} - ${format(
          dateRange.to,
          "dd MMM",
          { locale: es },
        )}`;
      }
      return format(dateRange.from, "dd MMM", { locale: es });
    }
    return "Agregar fechas";
  }, [dateRange]);

  return (
    <div
      id="inicio"
      className="relative min-h-fit md:h-[30vh] md:min-h-[360px] w-full flex flex-col items-center justify-center overflow-hidden bg-black py-10 md:py-0"
    >
      <div className="relative z-20 container mx-auto px-4 flex flex-col items-center text-center mt-0 3xl:mt-10">
        <Image
          src="/fincas-ya-logo-2.png"
          alt="FincasYA"
          width={500}
          height={500}
          priority
          className="object-contain shrink-0 w-80 h-auto my-6"
        />
        {/* Search Bar */}
        <div className="w-full max-w-5xl bg-white rounded-2xl p-4 md:p-2 md:pl-8 shadow-2xl flex flex-col md:flex-row items-center gap-1 md:gap-2">
          {/* Destination */}
          <div className="flex-1 w-full md:w-auto flex items-center gap-4 md:border-r border-gray-100 md:border-gray-200 pb-4 md:pb-0 md:pr-4">
            <div className="bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-full md:rounded-none">
              <MapPin className="w-5 h-5 text-gray-500 md:hidden" />
            </div>
            <div className="text-left w-full">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                Destino
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400 hidden md:block" />
                <Input
                  type="text"
                  placeholder="¿A dónde vamos?"
                  className="border-0 p-0 h-8 text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 font-bold bg-transparent text-base"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Dates Picker */}
          <div className="flex-1 w-full md:w-auto flex items-center gap-4 md:border-r border-gray-100 md:border-gray-200 pb-4 md:pb-0 md:px-6">
            <div className="bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-full md:rounded-none">
              <CalendarIcon className="w-5 h-5 text-gray-500 md:hidden" />
            </div>
            <div className="text-left w-full">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                Fechas
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 text-gray-400 cursor-pointer w-full hover:bg-gray-50/50 -ml-2 px-2 py-1 rounded-lg transition-colors">
                    <CalendarIcon className="w-5 h-5 text-gray-400 hidden md:block" />
                    <span
                      className={cn(
                        "text-base font-bold",
                        dateRange?.from ? "text-gray-900" : "text-gray-400",
                      )}
                    >
                      {formattedDateRange}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-100" align="center">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date()}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Guests */}
          <div className="flex-1 w-full md:w-auto flex items-center gap-4 pb-4 md:pb-0 md:px-6">
            <div className="bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-full md:rounded-none">
              <Users className="w-5 h-5 text-gray-500 md:hidden" />
            </div>
            <div className="text-left w-full group">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                Huéspedes
              </label>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400 hidden md:block" />
                <Input
                  type="number"
                  placeholder="¿Cuántos?"
                  min={1}
                  className="border-0 p-0 h-8 text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 font-bold bg-transparent text-base"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <Button
            className="w-full md:w-auto inline-flex items-center justify-center rounded-2xl bg-[#f9572a] hover:bg-[#fa6b43] text-white px-10 h-16 transition-all shadow-xl shadow-orange-200/20 hover:shadow-orange-200/40 text-lg font-black mt-2 md:mt-0 active:scale-95 group"
            onClick={() => {
              const element = document.getElementById("fincas");
              element?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <Search className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
            Buscar
          </Button>
        </div>
      </div>

      <StatsSection />
    </div>
  );
}
