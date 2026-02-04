"use client";

import { useRef } from "react";
// import { cards } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    src: "/fincas/lennon/lennon.mp4",
    rotation: "rotate-z-[-10deg]",
    name: "Madison",
    img: "/images/p1.png",
    translation: "translate-y-[-5%]",
  },
  {
    src: "/fincas/lennon/lennon.mp4",
    rotation: "rotate-z-[4deg]",
    name: "Alexander",
    img: "/images/p2.png",
  },
  {
    src: "/fincas/lennon/lennon.mp4",
    rotation: "rotate-z-[-4deg]",
    name: "Andrew",
    img: "/images/p3.png",
    translation: "translate-y-[-5%]",
  },
  {
    src: "/fincas/lennon/lennon.mp4",
    rotation: "rotate-z-[4deg]",
    name: "Bryan",
    img: "/images/p4.png",
    translation: "translate-y-[5%]",
  },
  {
    src: "/fincas/lennon/lennon.mp4",
    rotation: "rotate-z-[-10deg]",
    name: "Chris",
    img: "/images/p5.png",
  },
  // {
  //   src: "/videos/f6.mp4",
  //   rotation: "rotate-z-[4deg]",
  //   name: "Devante",
  //   img: "/images/p6.png",
  //   translation: "translate-y-[5%]",
  // },
  // {
  //   src: "/videos/f7.mp4",
  //   rotation: "rotate-z-[-3deg]",
  //   name: "Melisa",
  //   img: "/images/p7.png",
  //   translation: "translate-y-[10%]",
  // },
];

export function Reels() {
  const vdRef = useRef<(HTMLVideoElement | null)[]>([]);

  useGSAP(() => {
    // gsap.set(".testimonials-section", {
    //   // marginTop: "-140vh",
    // });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "top bottom",
        end: "200% top",
        scrub: true,
      },
    });

    // Animate the single background title
    tl.fromTo(
      ".bg-title",
      { scale: 0.8, opacity: 0.1 },
      { scale: 1.2, opacity: 0.2, duration: 2, ease: "power2.out" },
    );

    // Initial setup for cards - start off-screen left
    gsap.set(".vd-card", {
      x: "-0vw", // or -70vw
      rotate: (index) => (index % 2 === 0 ? 20 : -20),
      force3D: true,
    });

    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "top top",
        end: "+=300%",
        scrub: 1,
        pin: true,
        preventOverlaps: true,
        fastScrollEnd: true,
      },
    });

    // Animate cards stacking with horizontal offset
    pinTl.to(".vd-card", {
      x: (index) => {
        const offset = 280; // Significantly increased spacing
        return (index - (cards.length - 1) / 2) * offset;
      },
      rotate: (index) => {
        // Create a gentle "fan" effect
        const totalCards = cards.length;
        const middleIndex = (totalCards - 1) / 2;
        return (index - middleIndex) * 12; // Slightly more rotation for fan effect
      },
      stagger: 0.8,
      duration: 3,
      ease: "power2.inOut",
      force3D: true,
    });

    // Final subtle "breathing" or settles? No, scrubbing handles it.
  });

  const handlePlay = (index: number) => {
    const video = vdRef.current[index];
    if (video) {
      video.play();
    }
  };

  const handlePause = (index: number) => {
    const video = vdRef.current[index];
    if (video) {
      video.pause();
    }
  };

  return (
    <section className="testimonials-section bg-linear-to-b from-background via-accent/5 to-background relative w-full h-screen overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1 className="bg-title text-white/50 uppercase text-[25vw] font-black tracking-tighter transition-opacity duration-500 will-change-transform hardware-accelerated">
          Reels
        </h1>
      </div>

      <div className="pin-box relative w-full h-full flex items-center justify-center z-10">
        {cards.map((card, index) => (
          <div
            key={index}
            className="vd-card md:w-96 w-80 h-[500px] md:h-[600px] flex-none md:rounded-[2vw] rounded-3xl overflow-hidden absolute border-[.5vw] border-[#131313] shadow-2xl will-change-transform"
            style={{
              zIndex: index,
              backfaceVisibility: "hidden",
            }}
            onMouseEnter={() => handlePlay(index)}
            onMouseLeave={() => handlePause(index)}
          >
            <video
              ref={(el) => {
                vdRef.current[index] = el;
              }}
              src={card.src}
              playsInline
              muted
              loop
              preload="metadata"
              className="size-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
