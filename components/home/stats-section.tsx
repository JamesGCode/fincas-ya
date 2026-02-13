import { Star, Home, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatsSection() {
  const stats = [
    {
      id: 1,
      label: "Fincas verificadas",
      value: "+500",
      sub: "Revisadas personalmente",
    },
    {
      id: 2,
      label: "Calificación promedio",
      value: "4.8",
      icon: <Star className="w-5 h-5 text-orange-500 fill-orange-500 ml-1" />,
      sub: "De 5 estrellas",
    },
    {
      id: 3,
      label: "Huéspedes felices",
      value: "+10K",
      sub: "En el último año",
    },
  ];

  return (
    <div className="mt-8 container mx-auto px-4">
      <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-4 md:gap-20 max-w-4xl mx-auto">
        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className={cn(
              "flex flex-col items-center text-center shadow-xl md:shadow-none bg-white/5 md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none w-full md:w-auto border border-white/10 md:border-none backdrop-blur-sm md:backdrop-blur-none",
              index === 2 && "col-span-2 md:w-auto",
            )}
          >
            <div className="flex items-center justify-center text-xl md:text-3xl font-bold text-gray-900 mb-1">
              <span className="text-gray-300">{stat.value}</span>
              {stat.icon}
            </div>
            <div className="text-xs md:text-base text-gray-400 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
