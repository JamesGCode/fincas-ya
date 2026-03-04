"use client";

import { PropertyResponse } from "@/features/fincas/types/fincas.types";
import { FincaCardHome } from "@/features/home/components/finca-card-home";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchX } from "lucide-react";

interface FeaturedFincasProps {
  fincas: PropertyResponse[];
  title?: string;
}

export function FeaturedFincas({
  fincas,
  title = "Favoritas entre huéspedes",
}: FeaturedFincasProps) {
  if (fincas.length === 0) {
    return (
      <section className="container mx-auto px-4 mb-20 mt-8">
        <EmptyState
          title="No se encontraron fincas"
          description="No hemos encontrado propiedades que coincidan con tus criterios. Intenta ajustar los filtros o prueba otra categoría."
          icon={SearchX}
        />
      </section>
    );
  }

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
            badge={finca.isNew ? { text: "Nueva", color: "yellow" } : undefined}
          />
        ))}
      </div>
    </section>
  );
}
