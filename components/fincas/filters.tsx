"use client";

import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export interface FilterValues {
  destination: string;
  guests: string;
}

interface FiltersProps {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
}

export function Filters({ values, onChange }: FiltersProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-16 relative z-30 px-4">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Location */}
          <div className="flex-1 group">
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  Destino
                </span>
                <input
                  type="text"
                  placeholder="¿A dónde vamos?"
                  value={values.destination}
                  onChange={(e) =>
                    onChange({ ...values, destination: e.target.value })
                  }
                  className="block w-full bg-transparent border-0 p-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="flex-1 group">
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  Fechas
                </span>
                <input
                  type="text"
                  placeholder="Agregar fechas"
                  className="block w-full bg-transparent border-0 p-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-sm font-medium"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Guests */}
          <div className="flex-1 group">
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  Huéspedes
                </span>
                <select
                  value={values.guests}
                  onChange={(e) =>
                    onChange({ ...values, guests: e.target.value })
                  }
                  className="block w-full bg-transparent border-0 p-0 text-foreground focus:outline-none focus:ring-0 text-sm font-medium appearance-none cursor-pointer"
                >
                  <option value="" className="bg-background">
                    ¿Cuántos?
                  </option>
                  <option value="1-5" className="bg-background">
                    1 - 5 Personas
                  </option>
                  <option value="6-10" className="bg-background">
                    6 - 10 Personas
                  </option>
                  <option value="11-20" className="bg-background">
                    11 - 20 Personas
                  </option>
                  <option value="20+" className="bg-background">
                    Más de 20
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Button */}
          {/* <Button
            size="lg"
            className="h-auto py-4 px-8 rounded-xl bg-[#fe4a19] text-white hover:bg-[#fe4a19]/90 font-semibold text-sm gap-2 lg:w-auto w-full transition-colors"
          >
            <Search className="w-5 h-5" />
            <span className="lg:hidden xl:inline">Buscar</span>
          </Button> */}
        </div>
      </div>
    </div>
  );
}
