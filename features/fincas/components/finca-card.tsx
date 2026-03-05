"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Users, Star, Check } from "lucide-react";
import { cn, getSeededRating } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import { PropertyResponse } from "@/features/fincas/types/fincas.types";
import { useFeatures } from "@/features/admin/queries/features.queries";

interface FincaCardProps {
  finca: PropertyResponse;
  index: number;
  badge?: {
    text: string;
    color?: "green" | "orange" | "blue";
  };
}
export function FincaCard({ finca, index, badge }: FincaCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { data: featuresCatalog } = useFeatures();

  return (
    <div className="w-full">
      <Link href={`/fincas/${finca.id}`} className="block group">
        <Card
          className={cn(
            "w-full border-0 rounded-3xl not-prose overflow-hidden p-0 transition-transform duration-300 group-hover:-translate-y-1",
          )}
        >
          <CardContent className="p-0 overflow-hidden">
            {/* Image */}
            <div className="aspect-3/2 h-full relative overflow-hidden">
              <Image
                src={finca.images[0]}
                alt={finca.title}
                fill
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Badge */}
              {badge && (
                <div
                  className={cn(
                    "absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-white",
                    badge.color === "green"
                      ? "bg-green-600"
                      : badge.color === "orange"
                        ? "bg-orange-500"
                        : "bg-blue-600",
                  )}
                >
                  {badge.text}
                </div>
              )}
              {/* Favorita Badge */}
              {finca.isFavorite && (
                <div className="absolute top-3 inset-x-3 z-20 flex justify-center pointer-events-none">
                  <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-gray-900 bg-[#eeebe7] shadow-lg flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-[#f9572a] text-[#f9572a]" />
                    Favoritas entre viajeros
                  </div>
                </div>
              )}
              {/* Favorite Button */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-3 right-3 z-10 bg-black/20 backdrop-blur-sm hover:bg-black/40 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  setIsFavorited(!isFavorited);
                }}
              >
                <Heart
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isFavorited
                      ? "fill-red-500 text-red-500"
                      : "text-white hover:text-red-500",
                  )}
                />
              </Button>
            </div>
            {/* Info */}
            <div className="p-5 -mt-8 z-10 relative bg-neutral-800 rounded-t-3xl">
              {/* Location Tag */}
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{finca.location}</span>
              </div>

              {/* Feature Icons (Only SVG icons) */}
              {(() => {
                const featuresWithIcons = finca.features
                  ?.map((name) => featuresCatalog?.find((c) => c.name === name))
                  .filter((c) => !!c?.iconUrl)
                  .slice(0, 4);

                if (!featuresWithIcons || featuresWithIcons.length === 0)
                  return null;

                return (
                  <div className="flex items-center gap-2 mb-3">
                    {featuresWithIcons.map((catalogItem, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                        title={catalogItem?.name}
                      >
                        <img
                          src={catalogItem?.iconUrl}
                          alt={catalogItem?.name}
                          className="w-full h-full object-contain filter invert"
                        />
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Name and Price */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold line-clamp-1">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px] text-muted-foreground">
                        {getSeededRating(finca.id)}
                      </span>
                    </div>
                    {finca.title}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-1 mt-1">
                    <Users className="w-3 h-3 inline mr-1" />
                    {finca.capacity} personas
                  </CardDescription>
                </div>
                <div className="text-right shrink-0">
                  {finca.priceOriginal && finca.priceOriginal > 0 && (
                    <p className="text-xs text-muted-foreground line-through decoration-red-500/50">
                      ${finca.priceOriginal.toLocaleString("es-CO")}
                    </p>
                  )}
                  <p className="text-xl font-bold text-white">
                    ${finca.price.toLocaleString("es-CO")}
                  </p>
                  <span className="text-xs text-muted-foreground">/noche</span>
                </div>
              </div>
              {/* Button */}
              <Button className="w-full rounded-xl">Ver Detalles</Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
