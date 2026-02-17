"use client";

import { motion } from "framer-motion";

interface GuestFavoriteProps {
  rating: number;
}

export function GuestFavorite({ rating }: GuestFavoriteProps) {
  return (
    <div className="w-full mb-6 group">
      <div className="bg-linear-to-br from-[#d4af37] via-[#f9e29c] to-[#aa8a2e] border border-[#d4af37]/50 rounded-2xl p-4 py-8 flex items-center justify-between shadow-xl relative overflow-hidden transition-all duration-500 hover:scale-[1.01]">
        {/* Shine effect overlay */}
        <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent pointer-events-none" />

        <div className="flex items-center md:gap-4 gap-2 relative z-10">
          <div className="flex items-center gap-1">
            <div className="text-center px-1">
              <p className="md:text-sm text-xs font-extrabold leading-tight text-neutral-900  uppercase tracking-tight">
                Favorito entre
                <br />
                huéspedes
              </p>
            </div>
          </div>

          <div className="h-10 w-px bg-neutral-900/20 md:mx-2" />

          <p className="text-neutral-800 text-xs font-bold max-w-[180px] leading-snug">
            Uno de los alojamientos más populares y mejor valorados.
          </p>
        </div>

        <div className="flex items-center gap-3 pr-2 relative z-10">
          <div className="text-right">
            <p className="md:text-3xl text-xl font-black text-neutral-900 leading-none mb-0.5 drop-shadow-sm">
              {rating.toFixed(2)}
            </p>
            <div className="flex gap-0.5 justify-end">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className="size-2 md:size-3 fill-neutral-900 text-neutral-900"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M15.09 3.09a1 1 0 0 1 1.82 0l4.24 8.59 9.48 1.38a1 1 0 0 1 .55 1.7l-6.86 6.69 1.62 9.44a1 1 0 0 1-1.45 1.05L16 27.49l-8.49 4.46a1 1 0 0 1-1.45-1.05l1.62-9.44-6.86-6.69a1 1 0 0 1 .55-1.7l9.48-1.38 4.24-8.59z"></path>
    </svg>
  );
}
