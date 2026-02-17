"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isFincaPage = pathname.includes("/fincas/");

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string,
  ) => {
    if (isHome) {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={cn(
        "w-full z-50 transition-all duration-300 py-5",
        isHome ? "absolute top-0 px-6" : "relative bg-background px-6 mb-0",
      )}
    >
      <div
        className={cn(
          "flex items-center max-w-7xl mx-auto",
          isFincaPage ? "justify-between" : "justify-end",
        )}
      >
        {isFincaPage && (
          <Link href="/" className="relative z-50">
            <Image
              src="/favicon.png"
              alt="Fincas Ya"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
          </Link>
        )}
        {/* Desktop Navigation & Actions */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <Link
              href="/#inicio"
              onClick={(e) => handleScroll(e, "inicio")}
              className={cn(
                "text-sm font-medium transition-colors hover:text-orange-500",
                isHome ? "text-white" : "text-foreground",
              )}
            >
              Inicio
            </Link>
            <Link
              href="/#fincas"
              onClick={(e) => handleScroll(e, "fincas")}
              className={cn(
                "text-sm font-medium transition-colors hover:text-orange-500",
                isHome ? "text-white" : "text-foreground",
              )}
            >
              Fincas
            </Link>
            <Link
              href="/#como-funciona"
              onClick={(e) => handleScroll(e, "como-funciona")}
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
              href="/#inicio"
              className="text-base font-medium text-foreground p-3 hover:bg-black/5 rounded-lg"
              onClick={(e) => handleScroll(e, "inicio")}
            >
              Inicio
            </Link>
            <Link
              href="/#fincas"
              className="text-base font-medium text-foreground p-3 hover:bg-black/5 rounded-lg"
              onClick={(e) => handleScroll(e, "fincas")}
            >
              Fincas
            </Link>
            <Link
              href="/#como-funciona"
              className="text-base font-medium text-foreground p-3 hover:bg-black/5 rounded-lg"
              onClick={(e) => handleScroll(e, "como-funciona")}
            >
              Cómo Funciona
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-border/50 mt-2">
              <Button
                className="w-full bg-[#f9572a] hover:bg-[#fa6b43] text-white rounded-full transition-all shadow-md hover:shadow-lg"
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
