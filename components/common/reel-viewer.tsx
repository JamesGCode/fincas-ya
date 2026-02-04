"use client";

import { useRef, useState } from "react";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ScrollFade } from "@/components/ui/scroll-fade";

interface ReelViewerProps {
  videos: string[];
}

export function ReelViewer({ videos }: ReelViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const togglePlay = (index: number, videoEl: HTMLVideoElement) => {
    if (playingIndex === index) {
      videoEl.pause();
      setPlayingIndex(null);
    } else {
      const allVideos = scrollRef.current?.querySelectorAll("video");
      allVideos?.forEach((v) => v.pause());

      videoEl.play();
      setPlayingIndex(index);
    }
  };

  if (!videos || videos.length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight">
          Videos de la Finca
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="rounded-xl h-9 w-9"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="rounded-xl h-9 w-9"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollFade ref={scrollRef} dragToScroll className="pb-4">
        <div className="flex gap-4 snap-x snap-mandatory">
          {videos.map((video, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative shrink-0 w-[260px] h-[400px] rounded-2xl overflow-hidden snap-start bg-card border border-border/30 group ml-1"
            >
              <video
                src={video}
                loop
                muted
                playsInline
                className="w-full h-full object-cover pointer-events-none"
              />

              <div
                className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity cursor-pointer ${
                  playingIndex === index
                    ? "opacity-0 group-hover:opacity-100"
                    : "opacity-100"
                }`}
                onClick={(e) => {
                  const videoEl = e.currentTarget
                    .previousElementSibling as HTMLVideoElement;
                  togglePlay(index, videoEl);
                }}
              >
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                  {playingIndex === index ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollFade>
    </section>
  );
}
