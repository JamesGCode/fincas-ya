"use client";

import { motion } from "framer-motion";

export function CTAVideo() {
  return (
    <section className="sticky top-0  w-full h-dvh overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/3770033/3770033-hd_1920_1080_25fps.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full container mx-auto px-14 flex flex-col justify-center pt-32">
        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row items-center justify-start gap-8">
          {/* Left - Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-20"
          >
            <h1 className="text-white text-6xl md:text-8xl lg:text-[120px] font-bold leading-[0.9] tracking-tight">
              Encuentra
              <br />
              <span className="font-light">tu Finca</span>
            </h1>

            {/* Top Left Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white/80 text-sm max-w-sm leading-relaxed mt-3"
            >
              Descubre las mejores fincas de descanso en Colombia, con todas las
              comodidades para tu escapada perfecta.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
