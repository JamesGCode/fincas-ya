"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil, MapPin, Users } from "lucide-react";
import type { PropertyResponse } from "@/hooks/use-properties";

interface PropertiesTableProps {
  properties: PropertyResponse[];
  isLoading: boolean;
}

export function PropertiesTable({
  properties,
  isLoading,
}: PropertiesTableProps) {
  if (isLoading) {
    return (
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="w-14 h-10 rounded-lg bg-gray-100 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-24 bg-gray-50 rounded animate-pulse" />
            </div>
            <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (!properties?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <MapPin className="w-7 h-7 text-gray-300" />
        </div>
        <p className="text-gray-500 text-sm font-medium">
          No se encontraron propiedades
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Intenta con otro término de búsqueda
        </p>
      </div>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div>
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-[80px_2.5fr_1.5fr_100px_150px_60px] gap-4 px-8 py-4 bg-gray-50/30 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
        <span>Imagen</span>
        <span>Propiedad & Detalles</span>
        <span>Ubicación</span>
        <span className="text-center">Capacidad</span>
        <span className="text-right">Tarifa / noche</span>
        <span></span>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-50">
        {properties.map((property) => (
          <div
            key={property.id}
            className="grid grid-cols-1 md:grid-cols-[80px_2.5fr_1.5fr_100px_150px_60px] gap-3 md:gap-4 items-center px-8 py-5 hover:bg-orange-50/20 transition-all group relative"
          >
            {/* Active Indicator Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Image */}
            <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 hidden md:block shadow-sm ring-1 ring-gray-100 group-hover:scale-105 transition-transform duration-300">
              {property.images?.[0] ? (
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  width={64}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] font-bold">
                  S/I
                </div>
              )}
            </div>

            {/* Name & Details */}
            <div className="min-w-0">
              <Link
                href={`/properties/${property.id}/edit`}
                className="font-bold text-sm text-gray-950 truncate group-hover:text-orange-600 transition-colors block"
              >
                {property.title}
              </Link>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded tracking-widest uppercase">
                  Verificada
                </span>
                {property.rating > 4.5 && (
                  <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded tracking-widest uppercase">
                    Premium
                  </span>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <span className="truncate">{property.location}</span>
            </div>

            {/* Capacity */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full ring-1 ring-gray-100">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-sm font-black text-gray-700">
                  {property.capacity}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-sm font-black text-gray-900">
                {formatPrice(
                  property.seasonPrices?.base ?? property.price ?? 0,
                )}
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                Temporada Base
              </p>
            </div>

            {/* Edit button */}
            <div className="flex justify-end">
              <Link
                href={`/properties/${property.id}/edit`}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-orange-600 hover:bg-orange-100 transition-all md:opacity-0 md:group-hover:opacity-100 shadow-sm md:shadow-none bg-white md:bg-transparent"
              >
                <Pencil className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
