"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useProperty } from "@/features/fincas/queries/fincas.queries";
import { useFeatures } from "@/features/admin/queries/features.queries";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ReservationCard } from "@/features/fincas/components/reservation-card";
import { HeroGallery } from "@/features/fincas/components/hero-gallery";
import { GuestFavorite } from "@/features/fincas/components/guest-favorite";
import { cn } from "@/lib/utils";
import { MapPin, Users, Star, Check, MessageCircle, Play } from "lucide-react";
import { ReviewsSection } from "@/features/reviews/components/reviews-section";
import { FincaMap } from "@/features/fincas/components/finca-map";
import { FincaDetailSkeleton } from "@/features/fincas/components/finca-detail-skeleton";

interface Props {
  params: Promise<{ id: string }>;
}

export default function FincaDetailPage({ params }: Props) {
  const { id } = use(params);
  const { data: finca, isLoading, isError } = useProperty(id);
  const { data: featuresCatalog } = useFeatures();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <FincaDetailSkeleton />
        <Footer />
      </div>
    );
  }

  if (isError || !finca) {
    notFound();
  }

  const isFavorite = finca.isFavorite ?? (finca.rating || 0) >= 4.8;
  const currentPrice = finca.seasonPrices?.base || 0;
  const priceOriginal = finca.priceOriginal || 0;

  return (
    <main
      className={cn(
        "min-h-screen bg-background transition-colors duration-700",
        isFavorite &&
          "bg-linear-to-b  from-neutral-50  to-white dark:from-[#0a0a0a] dark:to-background",
      )}
    >
      <Navbar />
      <div className="px-0 md:px-12 lg:px-20">
        <HeroGallery
          title={finca.title}
          images={finca.images || []}
          video={finca.video}
        />
        {/* Content */}
        <section className="md:pb-10 relative max-md:z-40 -mt-14 max-md:bg-white rounded-t-3xl md:rounded-none md:mt-0">
          <div className="container mx-auto px-0 md:px-6 lg:px-6">
            <div className="grid lg:grid-cols-3 max-lg:gap-10">
              {/* Main Info */}
              <div className="lg:col-span-2 lg:mr-10">
                <div
                  className={cn(
                    "py-6 max-md:px-5 max-md:pt-8 md:p-0 border-none",
                    isFavorite && "md:border-l md:border-primary/10",
                  )}
                >
                  <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                    {finca.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mb-4 mt-2 md:mt-8">
                    <Badge variant="secondary" className="gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      {finca.rating || 0}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="w-3 h-3" />
                      {finca.location}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Users className="w-3 h-3" />
                      {finca.capacity} Personas
                    </Badge>
                    {isFavorite && (
                      <Badge className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90 border-none">
                        <Star className="w-3 h-3 fill-current" />
                        Favorita
                      </Badge>
                    )}
                  </div>
                </div>
                {/* Mobile Reel (Video) - Only visible on mobile */}
                <div className="block lg:hidden mb-12 max-md:-mt-6 rounded-2xl overflow-hidden shadow-2xl border border-border/20 mx-3">
                  {finca.video && (
                    <div className="relative w-full h-[60vh]">
                      <video
                        src={finca.video}
                        className="w-full h-full object-cover"
                        controls={false}
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 pointer-events-none flex items-end p-6">
                        <div className="text-white">
                          <p className="font-bold text-lg mb-1">
                            Recorrido Virtual
                          </p>
                          <p className="text-sm opacity-80">
                            Descubre cada rincón
                          </p>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-full p-3">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground md:text-lg leading-relaxed mb-8 max-md:px-3">
                  {finca.description}
                </p>
                {isFavorite && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 max-md:px-3">
                    <GuestFavorite rating={finca.rating || 0} />
                  </div>
                )}
                <Separator className="my-8" />
                {/* Features / Services */}
                <div className="mb-12 max-md:px-3">
                  <h2 className="text-xl font-bold mb-6">
                    Lo que este lugar ofrece
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6">
                    {finca.features?.map((featureName, index) => {
                      const catalogItem = featuresCatalog?.find(
                        (c) => c.name === featureName,
                      );
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 py-2 transition-all hover:translate-x-1 duration-300"
                        >
                          <div className="w-10 h-10 rounded-xl bg-secondary/30 flex items-center justify-center shrink-0 p-2">
                            {catalogItem?.iconUrl ? (
                              <img
                                src={catalogItem.iconUrl}
                                alt={featureName}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Check className="w-4 h-4 text-foreground/50" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-foreground/80 truncate">
                            {featureName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Informative Messages and Terms */}
                <div className="space-y-6 mb-12 max-md:px-3">
                  <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-blue-900 text-sm leading-relaxed font-medium">
                      Siempre debes confirmar la disponibilidad con un experto,
                      comunícate con nosotros vía{" "}
                      <span className="text-blue-700 font-bold underline cursor-pointer">
                        Whatsapp
                      </span>
                      .
                    </p>
                  </div>
                  <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-2xl p-6 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-emerald-900 text-sm leading-relaxed">
                      Pregunta por descuentos especiales en los costos por noche
                      en temporada baja. Temporada fiestas de fin de año, semana
                      santa, puentes, tienen algunas condiciones en el número de
                      noches.
                    </p>
                  </div>
                </div>
                {/* Terms of Service Warning */}
                <div className="max-md:px-3">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center max-md:hidden">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">
                      Condiciones y Responsabilidades
                    </h3>
                  </div>
                  <div className="space-y-4 text-muted-foreground text-sm leading-relaxed px-2">
                    <p>
                      <strong className="text-foreground">FINCASYA</strong> no
                      se compromete a realizar devoluciones de dinero en caso de
                      cancelaciones fortuitas por razones ajenas a nuestra
                      voluntad, se aplazará la fecha en caso dado siempre y
                      cuando la novedad sea notificada como mínimo siete (7)
                      días hábiles antes de la fecha de ingreso registrada.
                    </p>
                    <p>
                      Nos reservamos el derecho de admisión en algunas
                      propiedades.
                    </p>
                    <p>
                      <strong className="text-foreground">FINCASYA</strong> no
                      se hará responsable de accidentes ocasionados durante su
                      estancia, tampoco por hurtos o daños ocasionados por
                      terceros.
                    </p>
                    <p>
                      El depósito se reintegrará bien sea a su salida o al día
                      siguiente de la desocupación una vez se haya concluido la
                      revisión legítima de la propiedad.
                    </p>
                    <p>
                      En caso de: perturbar el sector con malas prácticas y
                      desobediencia del código civil colombiano, riñas, altos
                      decibeles en horas no permitidas, fiestas y eventos
                      clandestinos no autorizados ni contratados, agresiones a
                      las autoridades o a terceros;{" "}
                      <strong className="text-foreground">FINCASYA</strong> no
                      tendrá ningún nivel de responsabilidad, las imputaciones,
                      multas y sanciones son y serán enteramente por cuenta y
                      responsabilidad del Contratante.
                    </p>
                    <p className="font-bold text-primary pt-2">
                      Todos los valores anteriormente mencionados NO incluyen
                      IVA.
                    </p>
                  </div>
                </div>
              </div>
              {/* Booking Card */}
              <div className="lg:col-span-1 max-md:px-3 md:ml-4">
                <ReservationCard
                  title={finca.title}
                  price={currentPrice}
                  priceOriginal={priceOriginal}
                  maxGuests={finca.capacity}
                  rating={finca.rating || 0}
                />
              </div>
            </div>
            {/* Reviews Section */}
            <ReviewsSection fincaId={finca.id} />
            {/* Map Section */}
            <FincaMap
              lat={finca.coordinates?.lat || 0}
              lng={finca.coordinates?.lng || 0}
              location={finca.location}
            />
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
