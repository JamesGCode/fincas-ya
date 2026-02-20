import { Search, Calendar, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="bg-white py-24 relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 mb-8">
          <Sparkles className="w-4 h-4 text-orange-600" />
          <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
            Experiencia Simplificada
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
          Busca y reserva en{" "}
          <span className="text-primary italic">segundos</span>
        </h2>

        <p className="text-gray-500 max-w-2xl mx-auto mb-16 text-lg">
          Hemos rediseñado el proceso para que encuentres tu descanso ideal sin
          complicaciones.
        </p>

        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            {/* Card Glow */}
            <div className="absolute -inset-1 bg-linear-to-r from-orange-400 to-primary rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

            <div className="relative bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-12 overflow-hidden hover:border-orange-200 transition-all duration-500">
              {/* Glass Inner Glow */}
              <div className="absolute inset-0 bg-linear-to-br from-white via-transparent to-orange-50/30 opacity-50 pointer-events-none" />

              <div className="flex-1 text-left relative z-10">
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 shadow-inner">
                      <Search className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1">
                        Explora el Paraíso
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Filtra por destino, presupuesto y comodidades premium.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 shadow-inner">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1">
                        Sincroniza tus Fechas
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Disponibilidad en tiempo real para confirmar tu viaje al
                        instante.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 shadow-inner">
                      <Users className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1">
                        Invita a los Tuyos
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Espacios verificados con capacidad garantizada para todo
                        tu grupo.
                      </p>
                    </div>
                  </div>
                </div>

                {/* <div className="mt-12">
                  <Button
                    size="lg"
                    className="rounded-2xl px-10 h-16 text-lg font-black tracking-tight shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 bg-linear-to-r from-orange-600 to-primary"
                    onClick={() =>
                      document
                        .getElementById("fincas")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Comenzar Búsqueda
                  </Button>
                </div> */}
              </div>

              <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-full max-h-[400px] rounded-3xl overflow-hidden shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-700">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
                  alt="Busca y Reserva"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
