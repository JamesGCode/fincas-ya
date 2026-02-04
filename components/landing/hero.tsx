"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useMediaQuery } from "react-responsive";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  const isTablet = useMediaQuery({
    query: "(max-width: 1024px)",
  });

  useGSAP(() => {
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-container",
        start: "10% top",
        end: "bottom top",
        scrub: true,
      },
    });
    heroTl.to(".hero-container", {
      rotate: 5,
      scale: 0.9,
      yPercent: 40,
      ease: "power1.inOut",
    });
  });

  return (
    // <section className="relative h-screen w-full overflow-hidden">
    <section className="hero-container sticky top-0  w-full h-dvh overflow-hidden">
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
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Left - Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-20"
          >
            <h1 className="text-white text-6xl md:text-8xl lg:text-[120px] font-bold leading-[0.9] tracking-tight text-center">
              Encuentra
              <br />
              <span className="font-light text-center">tu Finca</span>
            </h1>

            {/* Top Left Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white/80 text-sm max-w-sm leading-relaxed text-center mx-auto mt-3"
            >
              Descubre las mejores fincas de descanso en Colombia, con todas las
              comodidades para tu escapada perfecta.
            </motion.p>

            {/* Contact Button */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8"
            >
              <Button
                size="lg"
                className="rounded-full px-6 py-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 font-medium group"
              >
                Contáctanos
                <span className="ml-2 w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ArrowRight className="w-4 h-4 text-black group-hover:text-white" />
                </span>
              </Button>
            </motion.div> */}
          </motion.div>

          {/* Right - Feature Text */}
          {/* <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-xs text-right lg:text-left"
          >
            <h3 className="text-white text-2xl md:text-3xl font-semibold mb-3 leading-tight">
              Naturaleza
              <br />y confort
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Experiencias únicas en propiedades verificadas con piscina, zonas
              verdes y servicios premium.
            </p>
          </motion.div> */}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 bg-white rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
