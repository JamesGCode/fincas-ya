"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <header className="container mx-auto z-50 transition-all duration-300 py-5">
      <div className="px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/favicon.png"
            alt="FincasYa"
            width={120}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50"
        >
          <nav className="flex flex-col p-6 gap-2">
            <Link
              href="/"
              className="text-base font-medium text-foreground p-3 hover:bg-white/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="#"
              className="text-base font-medium text-foreground p-3 hover:bg-white/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Fincas
            </Link>
            <Link
              href="#"
              className="text-base font-medium text-foreground p-3 hover:bg-white/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Servicios
            </Link>
            <Link
              href="#"
              className="text-base font-medium text-foreground p-3 hover:bg-white/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Nosotros
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-border/50 mt-2">
              <Button variant="outline" className="w-full rounded-full">
                Iniciar Sesión
              </Button>
              <Button className="w-full rounded-full">Registrarse</Button>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
