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
    <div className="bg-white/50 backdrop-blur-sm">
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-[80px_2.5fr_1.5fr_100px_150px_60px] gap-4 px-8 py-5 bg-linear-to-r from-gray-50/50 via-gray-50/30 to-transparent border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
        <span>Imagen</span>
        <span>Propiedad & Detalles</span>
        <span>Ubicación</span>
        <span className="text-center">Capacidad</span>
        <span className="text-right">Tarifa / noche</span>
        <span></span>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-50/50">
        {properties.map((property) => (
          <div
            key={property.id}
            className="flex flex-col md:grid md:grid-cols-[80px_2.5fr_1.5fr_100px_150px_60px] gap-4 md:gap-4 items-start md:items-center px-6 md:px-8 py-6 hover:bg-orange-50/30 transition-all group relative border-l-4 border-l-transparent hover:border-l-orange-500"
          >
            {/* Mobile Header (Image + Title + Edit Button) */}
            <div className="flex w-full md:hidden gap-4 items-center mb-2">
              <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 shadow-sm ring-1 ring-gray-100">
                {property.images?.[0] ? (
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    width={56}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-[8px] font-bold">
                    S/I
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/properties/${property.id}/edit`}
                  className="font-black text-sm text-gray-900 truncate block tracking-tight leading-tight"
                >
                  {property.title}
                </Link>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[8px] font-black text-white bg-emerald-500 px-1.5 py-0.5 rounded-full tracking-widest uppercase">
                    Verificada
                  </span>
                </div>
              </div>
              <Link
                href={`/properties/${property.id}/edit`}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-orange-500 bg-orange-50 shadow-sm active:scale-95 shrink-0"
              >
                <Pencil className="w-4 h-4" />
              </Link>
            </div>

            {/* Desktop Image */}
            <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 hidden md:block shadow-md ring-1 ring-gray-100 group-hover:scale-110 transition-all duration-500 group-hover:shadow-orange-200/50">
              {property.images?.[0] ? (
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  width={64}
                  height={48}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] font-bold">
                  S/I
                </div>
              )}
            </div>

            {/* Desktop Name & Details */}
            <div className="min-w-0 hidden md:block">
              <Link
                href={`/properties/${property.id}/edit`}
                className="font-black text-sm text-gray-900 truncate group-hover:text-orange-600 transition-colors block tracking-tight"
              >
                {property.title}
              </Link>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[9px] font-black text-white bg-emerald-500 px-2 py-0.5 rounded-full tracking-widest uppercase shadow-sm shadow-emerald-200">
                  Verificada
                </span>
                {property.rating > 4.5 && (
                  <span className="text-[9px] font-black text-white bg-amber-500 px-2 py-0.5 rounded-full tracking-widest uppercase shadow-sm shadow-amber-200">
                    Premium
                  </span>
                )}
              </div>
            </div>

            {/* Location (Shared with mobile refinements) */}
            <div className="flex items-center gap-3 md:gap-2 text-xs font-bold text-gray-500 min-w-0 w-full md:w-auto mt-2 md:mt-0">
              <div className="w-8 h-8 rounded-xl bg-gray-50 md:group-hover:bg-orange-100/50 flex items-center justify-center shrink-0 transition-colors">
                <MapPin className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>
              <span className="truncate group-hover:text-gray-900 transition-colors">
                {property.location}
              </span>
            </div>

            {/* Capacity & Price (Flex container for mobile) */}
            <div className="flex items-center justify-between w-full md:contents gap-4 mt-3 md:mt-0">
              {/* Capacity */}
              <div className="flex items-center md:justify-center">
                <div className="flex items-center gap-2 bg-gray-50 md:group-hover:bg-white px-3 py-2 rounded-xl ring-1 ring-gray-100 transition-all">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-black text-gray-700">
                    {property.capacity}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-base font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                  {formatPrice(
                    property.seasonPrices?.base ?? property.price ?? 0,
                  )}
                </p>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                  Temporada Base
                </p>
              </div>
            </div>

            {/* Desktop Edit button */}
            <div className="hidden md:flex justify-end pr-2">
              <Link
                href={`/properties/${property.id}/edit`}
                className="w-11 h-11 flex items-center justify-center rounded-2xl text-gray-400 hover:text-white hover:bg-orange-500 transition-all opacity-0 group-hover:opacity-100 shadow-sm hover:shadow-lg hover:shadow-orange-200 active:scale-95"
              >
                <Pencil className="w-5 h-5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
