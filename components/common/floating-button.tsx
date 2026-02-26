"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function FloatingButton() {
  const pathname = usePathname();

  // No mostrar en rutas de admin o propiedades
  if (pathname.startsWith("/admin") || pathname.startsWith("/properties"))
    return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      className="fixed md:bottom-8 md:right-8 bottom-4 right-4 z-9999"
    >
      <Link
        href="https://wa.me/573157773937"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center bg-[#40c351] hover:bg-[#6ad078] text-neutral-900 h-14 min-w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group border border-neutral-200 overflow-hidden"
      >
        <div className="flex items-center justify-center w-14 h-14 shrink-0">
          <Image
            src="/icons/whatsapp.svg"
            alt="WhatsApp"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
        </div>
        <span className="font-semibold text-sm max-w-0 overflow-hidden group-hover:max-w-xs group-hover:pr-6 transition-all duration-500 ease-in-out whitespace-nowrap">
          Chatea con nosotros
        </span>
      </Link>
    </motion.div>
  );
}
