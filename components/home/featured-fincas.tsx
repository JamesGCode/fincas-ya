"use client";

import { Finca } from "@/lib/data";
import { FincaCardHome } from "@/components/home/finca-card-home";

interface FeaturedFincasProps {
  fincas: Finca[];
  title?: string;
}

export function FeaturedFincas({
  fincas,
  title = "Favoritas entre huéspedes",
}: FeaturedFincasProps) {
  return (
    <section className="container mx-auto md:px-4 mb-20 mt-2">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-2xl md:text-[33px] font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-500">{fincas.length} fincas disponibles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 md:gap-y-12">
        {fincas.map((finca, index) => (
          <FincaCardHome
            key={finca.id}
            finca={finca}
            badge={
              index === 0
                ? { text: "Favorito", color: "orange" }
                : index === 1
                  ? { text: "Nueva", color: "green" }
                  : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}
