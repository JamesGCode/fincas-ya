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
import { Heart, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import { Finca } from "@/lib/data";

interface FincaCardProps {
  finca: Finca;
  index: number;
}

export function FincaCard({ finca, index }: FincaCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

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

              {/* Name and Price */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold line-clamp-1">
                    {finca.title}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-1 mt-1">
                    <Users className="w-3 h-3 inline mr-1" />
                    {finca.capacity} personas
                  </CardDescription>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-primary">
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
