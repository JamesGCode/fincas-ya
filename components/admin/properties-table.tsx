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
      <div className="hidden md:grid grid-cols-[56px_2fr_1.2fr_80px_120px_50px] gap-4 px-5 py-3 bg-gray-50/80 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        <span></span>
        <span>Propiedad</span>
        <span>Ubicación</span>
        <span className="text-center">Capac.</span>
        <span className="text-right">Precio / noche</span>
        <span></span>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-50">
        {properties.map((property) => (
          <div
            key={property.id}
            className="grid grid-cols-1 md:grid-cols-[56px_2fr_1.2fr_80px_120px_50px] gap-3 md:gap-4 items-center px-5 py-4 hover:bg-gray-50/60 transition-colors group"
          >
            {/* Image */}
            <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 hidden md:block">
              {property.images?.[0] ? (
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  width={56}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                  N/A
                </div>
              )}
            </div>

            {/* Name */}
            <div className="min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">
                {property.title}
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-sm text-gray-500 min-w-0">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
              <span className="truncate">{property.location}</span>
            </div>

            {/* Capacity */}
            <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
              <Users className="w-3.5 h-3.5 text-gray-400 md:hidden" />
              <span>{property.capacity}</span>
            </div>

            {/* Price */}
            <div className="text-right text-sm font-semibold text-emerald-600">
              {formatPrice(property.seasonPrices?.base ?? property.price ?? 0)}
            </div>

            {/* Edit button */}
            <div className="flex justify-end">
              <Link
                href={`/properties/${property.id}/edit`}
                className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all md:opacity-0 md:group-hover:opacity-100"
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
