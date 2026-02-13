"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <header
      className={cn(
        "w-full z-50 transition-all duration-300 py-5",
        isHome ? "absolute top-0 px-6" : "relative bg-background px-6 mb-8",
      )}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
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

        {/* Desktop Navigation & Actions */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <Link
              href="/#inicio"
              className={cn(
                "text-sm font-medium transition-colors hover:text-orange-500",
                isHome ? "text-white" : "text-foreground",
              )}
            >
              Inicio
            </Link>
            <Link
              href="/#fincas"
              className={cn(
                "text-sm font-medium transition-colors hover:text-orange-500",
                isHome ? "text-white" : "text-foreground",
              )}
            >
              Fincas
            </Link>
            <Link
              href="/#como-funciona"
              className={cn(
                "text-sm font-medium transition-colors hover:text-orange-500",
                isHome ? "text-white" : "text-foreground",
              )}
            >
              Cómo Funciona
            </Link>
          </nav>

          <Button
            className="bg-[#f9572a] hover:bg-[#fa6b43] text-white rounded-full transition-all shadow-md hover:shadow-lg px-6"
            onClick={() => {
              const el = document.getElementById("finca-propietario");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            ¿Tienes una finca?
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn(
            "md:hidden p-2",
            isHome ? "text-white" : "text-foreground",
          )}
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
              href="#inicio"
              className="text-base font-medium text-foreground p-3 hover:bg-black/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="#fincas"
              className="text-base font-medium text-foreground p-3 hover:bg-black/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Fincas
            </Link>
            <Link
              href="#como-funciona"
              className="text-base font-medium text-foreground p-3 hover:bg-black/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Cómo Funciona
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-border/50 mt-2">
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const el = document.getElementById("finca-propietario");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                ¿Tienes una finca?
              </Button>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
