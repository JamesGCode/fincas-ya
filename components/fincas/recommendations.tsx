"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Finca } from "@/lib/data";
import { ScrollFade } from "@/components/ui/scroll-fade";

interface RecommendationsProps {
  fincas: Finca[];
  currentId: string;
}

export function Recommendations({ fincas, currentId }: RecommendationsProps) {
  const recommendations = fincas.filter((f) => f.id !== currentId).slice(0, 4);

  if (recommendations.length === 0) return null;

  return (
    <section className="py-10 border-t border-border/30 mt-8">
      <h2 className="text-xl md:text-2xl font-bold  max-md:px-3 mb-8 tracking-tight">
        También te puede interesar
      </h2>

      <ScrollFade dragToScroll className="pb-4 px-4">
        <div className="flex gap-5 w-full">
          {recommendations.map((finca, index) => (
            <motion.div
              key={finca.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="min-w-[280px] md:min-w-[320px]"
            >
              <Link href={`/fincas/${finca.id}`} className="block group">
                <div className="relative h-44 rounded-2xl overflow-hidden mb-3">
                  <Image
                    src={finca.images[0]}
                    alt={finca.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-semibold text-sm line-clamp-1">
                      {finca.title}
                    </h3>
                    <p className="text-white/70 text-xs">{finca.location}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between px-1">
                  <span className="font-bold text-sm">
                    ${finca.price.toLocaleString("es-CO")}
                    <span className="text-muted-foreground text-xs font-normal">
                      {" "}
                      /noche
                    </span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </ScrollFade>
    </section>
  );
}
