"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Shield, Headphones } from "lucide-react";

export function CTA() {
  return (
    <section className="py-32 relative overflow-hidden px-10">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-accent/20 z-0" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-widest mb-4 block">
              Para Propietarios
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-6 leading-tight tracking-tight">
              ¿Tienes una finca?
              <br />
              <span className="text-primary">Únete a nosotros</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-md leading-relaxed">
              Llega a miles de viajeros que buscan experiencias únicas. Publicar
              es gratis y nos encargamos de todo.
            </p>

            <div className="space-y-5 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Publica gratis</h4>
                  <p className="text-sm text-muted-foreground">
                    Sin costos ocultos ni comisiones mensuales.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Reservas seguras</h4>
                  <p className="text-sm text-muted-foreground">
                    Pagos protegidos y garantía de daños.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Soporte 24/7</h4>
                  <p className="text-sm text-muted-foreground">
                    Asistencia para ti y tus huéspedes.
                  </p>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="rounded-full text-base px-8 py-6 font-semibold group"
            >
              Registrar mi Finca
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-3xl p-8 text-center">
              <span className="text-5xl font-bold font-display text-primary block mb-2">
                500+
              </span>
              <span className="text-muted-foreground text-sm">Fincas</span>
            </div>
            <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-3xl p-8 text-center">
              <span className="text-5xl font-bold font-display text-primary block mb-2">
                15K+
              </span>
              <span className="text-muted-foreground text-sm">Huéspedes</span>
            </div>
            <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-3xl p-8 text-center">
              <span className="text-5xl font-bold font-display text-primary block mb-2">
                98%
              </span>
              <span className="text-muted-foreground text-sm">
                Satisfacción
              </span>
            </div>
            <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-3xl p-8 text-center">
              <span className="text-5xl font-bold font-display text-primary block mb-2">
                24/7
              </span>
              <span className="text-muted-foreground text-sm">Soporte</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
