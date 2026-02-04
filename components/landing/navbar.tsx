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
    <motion.header
      className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 py-5`}
      // className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 ${
      //   isScrolled
      //     ? "bg-background/80 backdrop-blur-xl py-3 border-b border-border/50"
      //     : "bg-transparent py-5"
      // }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/fincas-ya-logo.png"
            alt="FincasYa"
            width={120}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        {/* <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="#"
            className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
          >
            Fincas
          </Link>
          <Link
            href="#"
            className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
          >
            Servicios
          </Link>
          <Link
            href="#"
            className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
          >
            Nosotros
          </Link>
        </nav> */}

        {/* <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" className="text-sm font-medium">
            Iniciar Sesión
          </Button>
          <Button className="rounded-full px-5 text-sm font-semibold">
            Registrarse
          </Button>
        </div> */}

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
    </motion.header>
  );
}
