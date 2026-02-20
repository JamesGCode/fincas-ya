"use client";

import { Share2, Heart, Play, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SOCIAL_NETWORKS = [
  {
    name: "Instagram",
    logo: "/ig.png",
    handle: "FincasYa.com",
    description: "Fotos y videos de nuestras fincas más espectaculares.",
    link: "https://www.instagram.com/fincasya.com_alquileres/?hl=es",
    color: "from-[#833ab4] via-[#fd1d1d] to-[#fcb045]",
    stats: "112k+ seguidores",
    hoverIcon: Play,
  },
  {
    name: "Facebook",
    logo: "/fc.png",
    handle: "fincasya.com_alquileres",
    description: "Únete a nuestra comunidad y comparte tus experiencias.",
    link: "https://www.facebook.com/FincasYa/mentions/",
    color: "from-[#1877F2] to-[#0052D4]",
    stats: "12k+ seguidores",
    hoverIcon: MessageCircle,
  },
  {
    name: "TikTok",
    logo: "/tiktok.png",
    handle: "fincasya.com",
    description:
      "Recorridos virtuales y contenido exclusivo detrás de cámaras.",
    link: "https://www.tiktok.com/@fincasya.com",
    color: "from-[#000000] to-[#25F4EE]",
    stats: "44k+ seguidores",
    hoverIcon: Play,
  },
];

export function SocialSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <Share2 className="w-3.5 h-3.5" />
            Nuestra Comunidad
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
            Síguenos en{" "}
            <span className="text-primary italic">nuestras redes</span>
          </h2>
          <p className="text-lg text-gray-600 font-medium leading-relaxed">
            Descubre ofertas exclusivas, nuevas propiedades y el estilo de vida
            FincasYa en tus redes sociales favoritas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {SOCIAL_NETWORKS.map((social, index) => (
            <Link
              key={social.name}
              href={social.link}
              target="_blank"
              className="group relative"
            >
              <div className="h-full bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col items-center text-center group-hover:-translate-y-2 group-hover:border-primary/20">
                {/* Modern Background Gradient Glow */}
                <div
                  className={cn(
                    "absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500",
                    social.color,
                  )}
                />

                {/* Animated Icon Container */}
                <div className="relative mb-8 pt-4">
                  <div
                    className={cn(
                      "w-24 h-24 rounded-[32px] bg-linear-to-br flex items-center justify-center p-0.5 shadow-lg transform group-hover:rotate-6 transition-all duration-500",
                      social.color,
                    )}
                  >
                    <div className="w-full h-full bg-white rounded-[30px] flex items-center justify-center group-hover:bg-transparent transition-colors duration-500 relative overflow-hidden">
                      <div className="relative w-12 h-12">
                        <Image
                          src={social.logo}
                          alt={social.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Floating Notification-like Badge */}
                  <div className="absolute -top-1 -right-1 w-8 h-8 rounded-2xl bg-white shadow-md flex items-center justify-center translate-x-2 group-hover:translate-x-3 transition-transform duration-500">
                    <Heart className="w-4 h-4 text-primary fill-primary" />
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-2xl font-black text-gray-900 mb-1">
                    {social.name}
                  </h3>
                  <p className="text-primary font-bold text-sm">
                    {social.handle}
                  </p>
                </div>

                <p className="text-gray-500 text-sm mb-8 px-4 leading-relaxed font-medium">
                  {social.description}
                </p>

                <div className="mt-auto w-full">
                  <div className="flex items-center justify-center gap-2 mb-6 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 py-2 rounded-2xl">
                    {social.stats}
                  </div>

                  {/* <div
                    className={cn(
                      "w-full py-4 rounded-3xl text-white font-black text-sm flex items-center justify-center gap-2 transition-all duration-500 shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                      social.color,
                    )}
                  >
                    Ir al perfil
                    <social.hoverIcon className="w-4 h-4 animate-pulse" />
                  </div> */}
                </div>

                {/* Decorative Dots Pattern */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity duration-500">
                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(16)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-black"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Collective Invitation Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-4">
            <span className="w-12 h-px bg-gray-200" />
            Únete a los +110,000 seguidores
            <span className="w-12 h-px bg-gray-200" />
          </p>
        </div>
      </div>
    </section>
  );
}
