"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PropertyResponse } from "@/features/fincas/types/fincas.types";
import { useFeatures } from "@/features/admin/queries/features.queries";

interface FincaCardHomeProps {
  finca: PropertyResponse;
  badge?: {
    text: string;
    color?: "green" | "orange" | "blue" | "yellow";
  };
}
export function FincaCardHome({ finca, badge }: FincaCardHomeProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const { data: featuresCatalog } = useFeatures();
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % (finca.images?.length || 1));
  };
  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + (finca.images?.length || 1)) % (finca.images?.length || 1),
    );
  };
  return (
    <div className="group w-full block border border-gray-200 rounded-3xl p-4 hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-4">
        {/* Image Carousel */}
        <Link href={`/fincas/${finca.id}`}>
          <Image
            src={finca.images?.[currentImageIndex] || "/placeholder.jpg"}
            alt={finca.title || "Finca"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {/* Navigation Arrows (Visible on Hover) */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <ChevronLeft className="w-4 h-4 text-gray-900" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <ChevronRight className="w-4 h-4 text-gray-900" />
        </button>
        {/* Dots Indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {(finca.images || []).slice(0, 5).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors box-shadow shadow-sm",
                idx === currentImageIndex ? "bg-white" : "bg-white/50",
              )}
            />
          ))}
        </div>
        {/* Badge */}
        {badge ? (
          <div
            className={cn(
              "absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide text-white shadow-sm",
              badge.color === "green"
                ? "bg-green-600"
                : badge.color === "orange"
                  ? "bg-orange-500"
                  : badge.color === "yellow"
                    ? "bg-yellow-500 text-black"
                    : "bg-blue-600",
            )}
          >
            {badge.text}
          </div>
        ) : finca.isFavorite ? (
          <div className="absolute top-3 left-3 z-20 flex justify-center pointer-events-none">
            <div className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide text-gray-900 bg-[#eeebe7] shadow-lg flex items-center gap-1.5 uppercase">
              {/* <Star className="w-3.5 h-3.5 fill-[#f9572a] text-[#f9572a]" /> */}
              Favoritas entre viajeros
            </div>
          </div>
        ) : null}
        {/* Favorite Button */}
        <button
          className="absolute top-3 right-3 z-10 transition-transform active:scale-95"
          onClick={(e) => {
            e.preventDefault();
            setIsFavorited(!isFavorited);
          }}
        >
          <Heart
            className={cn(
              "w-6 h-6 drop-shadow-md transition-colors",
              isFavorited
                ? "fill-red-500 text-red-500"
                : "fill-black/50 text-white",
            )}
          />
        </button>
      </div>
      {/* Content */}
      <Link href={`/fincas/${finca.id}`} className="block">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-900 line-clamp-1 flex-1 mr-2">
            {finca.title}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-black text-black" />
            <span className="text-sm font-medium">3.8</span>
            <span className="text-sm text-gray-500">
              ({finca.reviewsCount})
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{finca.location}</span>
        </div>

        {/* Feature Icons */}
        {finca.features && finca.features.length > 0 && (
          <div className="flex items-center gap-2 mb-2">
            {finca.features.slice(0, 4).map((featureName, idx) => {
              const catalogItem = featuresCatalog?.find(
                (c) => c.name === featureName,
              );
              if (catalogItem?.iconUrl) {
                return (
                  <div
                    key={idx}
                    className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity"
                    title={featureName}
                  >
                    <img
                      src={catalogItem.iconUrl}
                      alt={featureName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        <div className="flex items-center gap-1.5 text-sm">
          {finca.priceOriginal && finca.priceOriginal > 0 && (
            <span className="text-[11px] text-gray-400 line-through decoration-red-400/50 mr-0.5 italic">
              ${finca.priceOriginal.toLocaleString("es-CO")}
            </span>
          )}
          <span className="font-bold text-gray-900">
            ${(finca.seasonPrices?.base || 0).toLocaleString("es-CO")}
          </span>
          <span className="text-gray-500 font-normal">noche</span>
          <span className="text-gray-300 mx-0.5">•</span>
          <span className="text-gray-500">{finca.capacity} personas</span>
        </div>
      </Link>
    </div>
  );
}
