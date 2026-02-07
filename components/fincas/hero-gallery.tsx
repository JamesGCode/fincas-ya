"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Play, X } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface HeroGalleryProps {
  title: string;
  images: string[];
  video?: string;
}

export function HeroGallery({ title, images, video }: HeroGalleryProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  const nextPhoto = () => {
    setPhotoIndex((prev) => (prev + 1) % images.length);
  };

  const prevPhoto = () => {
    setPhotoIndex((prev) => (prev + images.length - 1) % images.length);
  };

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className="md:pt-14 pb-8">
      {/* Back button */}
      {/* <div className="container mx-auto md:px-4 mb-8 px-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a fincas
        </Link>
      </div> */}

      <div className="container mx-auto px-0 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto lg:h-[70vh]">
          {/* Carousel - Col Span 2 */}
          <div className="lg:col-span-2 h-[60vh] lg:h-full relative rounded-none md:rounded-2xl overflow-hidden group">
            <Carousel
              className="w-full h-full"
              opts={{ loop: true }}
              plugins={[
                Autoplay({
                  delay: 4000,
                }),
              ]}
              setApi={setApi}
            >
              <CarouselContent className="h-full ml-0">
                {images.map((image, index) => (
                  <CarouselItem key={index} className="pl-0 h-full w-full">
                    <div
                      className="relative w-full h-full cursor-zoom-in"
                      onClick={() => openLightbox(index)}
                    >
                      <Image
                        src={image}
                        alt={`${title} - Imagen ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity bg-white/20 border-none text-white hover:bg-white/40" />
              <CarouselNext className="right-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity bg-white/20 border-none text-white hover:bg-white/40" />

              {/* Dots / Indicators (Desktop) */}
              <div className="hidden md:flex absolute bottom-6 left-0 right-0 justify-center gap-2 z-10 pointer-events-none">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-all bg-white/50 hover:bg-white/80 pointer-events-auto",
                      current === index + 1 && "w-6 bg-white",
                    )}
                    onClick={() => api?.scrollTo(index)}
                  />
                ))}
              </div>

              {/* Mobile Counter (1/X) */}
              <div className="md:hidden absolute top-4 right-4 z-10 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/10">
                  {current} / {count}
                </div>
              </div>
            </Carousel>
          </div>

          {/* Video Card - Desktop Only (Hidden on Mobile) */}
          <div className="hidden lg:block lg:col-span-1 h-full relative rounded-2xl overflow-hidden bg-black group">
            <Dialog>
              <DialogTrigger asChild>
                <div className="w-full h-full cursor-zoom-in relative">
                  {video ? (
                    <video
                      src={video}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-500">
                      No video available
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-1 fill-white" />
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] w-full bg-black/90 border-none p-0 shadow-2xl outline-none">
                <DialogTitle className="sr-only">Video de {title}</DialogTitle>
                {video && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                    <video
                      src={video}
                      className="w-full h-full"
                      controls
                      autoPlay
                    />
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Image Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-screen w-screen h-screen bg-black/95 border-none p-0 flex flex-col items-center justify-center outline-none backdrop-blur-xl z-60">
          <DialogTitle className="sr-only">Galería de {title}</DialogTitle>

          {/* Close Button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full h-full flex-1 flex items-center justify-center p-0 md:p-10 overflow-hidden">
            {/* Navigation Buttons */}
            <button
              onClick={prevPhoto}
              className="absolute left-2 md:left-8 z-50 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
              aria-label="Anterior imagen"
            >
              <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <button
              onClick={nextPhoto}
              className="absolute right-2 md:right-8 z-50 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors rotate-180 backdrop-blur-sm"
              aria-label="Siguiente imagen"
            >
              <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <div className="relative w-full h-full max-h-[75vh] md:max-h-[85vh]">
              <Image
                src={images[photoIndex]}
                alt={`${title} - Fullscreen ${photoIndex + 1}`}
                fill
                className="object-contain"
                priority
                quality={100}
              />
            </div>
          </div>

          {/* Thumbnails - Optimized for scroll */}
          <div className="h-[100px] w-full bg-black/40 backdrop-blur-md flex items-center justify-center overflow-hidden shrink-0">
            <div className="flex gap-2 overflow-x-auto p-4 snap-x no-scrollbar w-full max-w-7xl justify-start md:justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setPhotoIndex(idx)}
                  className={cn(
                    "relative h-16 w-24 shrink-0 rounded-md overflow-hidden transition-all border-2 snap-center cursor-pointer",
                    photoIndex === idx
                      ? "border-white opacity-100 scale-105"
                      : "border-transparent opacity-40 hover:opacity-80",
                  )}
                >
                  <Image
                    src={img}
                    alt={`Thumb ${idx}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
