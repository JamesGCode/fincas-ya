import { Search, Image, CheckCircle } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Busca",
      description: "Elige destino, fechas y número de huéspedes",
      icon: <Search className="w-6 h-6 text-orange-500" />,
      color: "bg-orange-100",
    },
    {
      id: 2,
      title: "Compara",
      description: "Revisa fotos, reseñas y precios de fincas verificadas",
      icon: <Image className="w-6 h-6 text-orange-500" />,
      color: "bg-orange-100",
    },
    {
      id: 3,
      title: "Reserva",
      description: "Pago seguro con confirmación inmediata",
      icon: <CheckCircle className="w-6 h-6 text-orange-500" />,
      color: "bg-orange-100",
    },
  ];

  return (
    <section id="como-funciona" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Así de fácil funciona
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-16">
          De la búsqueda a la reserva en 3 simples pasos
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
          {/* Connector Line (Desktop only) */}
          <div className="hidden md:block absolute top-18 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-gray-200 -z-10" />

          {steps.map((step) => (
            <div
              key={step.id}
              className="group flex flex-col items-center relative z-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-orange-500/10 hover:border-orange-200"
            >
              <div
                className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-inner`}
              >
                {step.icon}
              </div>

              <div className="absolute top-4 right-4 bg-orange-50 text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border border-orange-100">
                Paso {step.id}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                {step.title}
              </h3>
              <p className="text-gray-500 max-w-xs leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
