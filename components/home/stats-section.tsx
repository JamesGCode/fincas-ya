import { Star, Home, Users } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      id: 1,
      label: "Fincas verificadas",
      value: "500+",
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
      value: "10K+",
      sub: "En el último año",
    },
  ];

  return (
    <div className="relative z-30 mt-8 md:-mt-20 container mx-auto px-4 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white/90 backdrop-blur-md border border-gray-100 p-6 rounded-2xl flex flex-col items-center text-center shadow-xl"
          >
            <div className="flex items-center justify-center text-3xl font-bold text-gray-900 mb-1">
              <span className="text-orange-500 mr-2">{stat.value}</span>
              {stat.icon}
            </div>
            <div className="text-gray-900 font-medium">{stat.label}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
