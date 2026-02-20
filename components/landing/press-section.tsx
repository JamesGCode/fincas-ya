"use client";

import { Award, Newspaper, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function PressSection() {
  const milestones = [
    {
      id: 1,
      date: "25 de Febrero, 2026",
      title: "Reconocimiento en el Congreso de la República",
      description:
        "FincasYa será galardonada por su impacto en la digitalización del turismo rural y su aporte al desarrollo económico de las regiones colombianas.",
      icon: <Award className="w-8 h-8 text-orange-600" />,
      type: "Reconocimiento",
      color: "bg-orange-50",
    },
    // {
    //   id: 2,
    //   date: "Enero, 2026",
    //   title: "Expansión a Destinos de Playa",
    //   description:
    //     "Iniciamos operaciones en Santa Marta y Cartagena, integrando las mejores villas y apartamentos de lujo frente al mar.",
    //   icon: <Newspaper className="w-8 h-8 text-blue-600" />,
    //   type: "Hito",
    //   color: "bg-blue-50",
    // },
  ];

  return (
    <section id="prensa" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Hitos y Prensa
          </h2>
          <p className="text-gray-500 text-lg">
            Acompaña nuestro crecimiento y descubre los momentos que están
            definiendo el futuro del alquiler de fincas en Colombia.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 max-w-6xl mx-auto">
          {milestones.map((milestone) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: milestone.id * 0.1 }}
              className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-orange-200"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl ${milestone.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                  >
                    {milestone.icon}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5" />
                    {milestone.date}
                  </div>
                </div>

                <div className="inline-block px-3 py-1 rounded-full bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4 border border-gray-100">
                  {milestone.type}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors leading-tight">
                  {milestone.title}
                </h3>

                <p className="text-gray-500 leading-relaxed mb-8 grow">
                  {milestone.description}
                </p>

                <div className="flex items-center text-sm font-bold text-orange-600 group/link cursor-pointer">
                  Leer más
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/link:translate-x-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
