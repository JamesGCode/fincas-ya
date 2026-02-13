"use client";

import { Finca } from "@/lib/data";
import { FincaCardHome } from "@/components/home/finca-card-home";

interface FeaturedFincasProps {
  fincas: Finca[];
}

export function FeaturedFincas({ fincas }: FeaturedFincasProps) {
  return (
    <section className="container mx-auto px-4 mb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Favoritas entre huéspedes
          </h2>
          <p className="text-gray-500">{fincas.length} fincas disponibles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
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
