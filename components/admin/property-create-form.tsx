"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { sileo } from "sileo";
import { useCreateProperty } from "@/hooks/use-properties";
import type { UpdatePropertyPayload } from "@/hooks/use-properties";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  X,
  MapPin,
  Users,
  DollarSign,
  FileText,
  ImageIcon,
  ListChecks,
  Video,
  Globe,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function PropertyCreateForm() {
  const router = useRouter();
  const createMutation = useCreateProperty();

  const [form, setForm] = useState<UpdatePropertyPayload>({
    title: "",
    description: "",
    location: "",
    capacity: 0,
    price: 0,
    features: [],
    coordinates: { lat: 0, lng: 0 },
    seasonPrices: {
      base: 0,
      baja: 0,
      media: 0,
      alta: 0,
      especiales: null,
    },
    files: [],
  });
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    if (createMutation.isSuccess) {
      sileo.success({ title: "¡Propiedad creada exitosamente!" });
      router.push("/properties");
    }
  }, [createMutation.isSuccess, router]);

  useEffect(() => {
    if (createMutation.isError) {
      sileo.error({
        title: "Error al crear la propiedad",
        description: "Intentalo de nuevo.",
      });
    }
  }, [createMutation.isError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(form);
    } catch (error) {
      console.error("Error al crear:", error);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setForm((prev) => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index),
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setForm((prev) => ({
        ...prev,
        files: [...(prev.files || []), ...newFiles],
      }));
    }
  };

  const removeFile = (index: number) => {
    setForm((prev) => ({
      ...prev,
      files: prev.files?.filter((_, i) => i !== index),
    }));
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setForm((prev) => ({
        ...prev,
        videoFile: file,
      }));
    }
  };

  const removeVideoFile = () => {
    setForm((prev) => ({
      ...prev,
      videoFile: undefined,
    }));
  };

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all duration-200 shadow-sm";
  const labelClass =
    "block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2.5 px-1";

  return (
    <div className="p-4 md:p-8 lg:p-10 bg-transparent min-h-[calc(100vh-4rem)] relative">
      <form
        onSubmit={handleSubmit}
        className="space-y-12 max-w-4xl mx-auto relative z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between top-[56px] md:top-[64px] z-20 bg-white/80 backdrop-blur-2xl py-4 md:py-5 -mx-4 md:-mx-6 px-4 md:px-6 mb-6 md:mb-10 transition-all duration-500 border-b border-gray-100/50">
          <div className="flex items-center gap-3 md:gap-6 w-full">
            <Link
              href="/properties"
              className="p-3 md:p-4 rounded-xl md:rounded-[20px] border border-gray-100 bg-white hover:bg-gray-50 shadow-sm transition-all active:scale-95 group shrink-0"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-3xl font-black tracking-tight leading-none bg-linear-to-br from-gray-900 via-gray-800 to-gray-500 bg-clip-text text-transparent truncate">
                Nueva Propiedad
              </h1>
              <div className="flex items-center gap-2 mt-1 md:mt-2">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-100">
                  <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[8px] md:text-[10px] font-black text-orange-600 uppercase tracking-widest leading-none">
                    Registro
                  </span>
                </div>
                <p className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest truncate">
                  FincasYa Admin
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <section className="rounded-[40px] bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500">
          <div className="flex items-center gap-4 px-6 md:px-8 py-5 md:py-7 border-b border-gray-50 bg-linear-to-br from-blue-50/50 to-transparent">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-200">
              <FileText className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h2 className="font-black text-lg md:text-xl text-gray-900 tracking-tight">
                Información básica
              </h2>
              <p className="text-[9px] md:text-[10px] font-black text-blue-400 uppercase tracking-widest mt-0.5">
                Identidad y descripción
              </p>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className={labelClass}>Título Premium</label>
                <input
                  type="text"
                  required
                  value={form.title || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Ej: Mansión del Sol en Copacabana"
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Ubicación Geográfica</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    required
                    value={form.location || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className={`${inputClass} pl-11`}
                    placeholder="Ej: Copacabana, Antioquia"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Reseña del Alojamiento</label>
              <textarea
                rows={6}
                required
                value={form.description || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className={`${inputClass} resize-none py-4 leading-relaxed`}
                placeholder="Describe la experiencia única que ofrece esta propiedad..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className={labelClass}>Capacidad Máxima</label>
                <div className="relative group">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="number"
                    required
                    value={form.capacity || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        capacity: Number(e.target.value),
                      }))
                    }
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Precio Base por Noche (COP)
                </label>
                <div className="relative group">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="number"
                    required
                    value={form.seasonPrices?.base || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                        seasonPrices: {
                          ...prev.seasonPrices!,
                          base: Number(e.target.value),
                        },
                      }))
                    }
                    className={`${inputClass} pl-11 font-black text-gray-900`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coordinates */}
        <section className="rounded-[40px] bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
          <div className="flex items-center gap-4 px-8 py-7 border-b border-gray-50 bg-linear-to-br from-indigo-50/50 to-transparent">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-xl text-gray-900 tracking-tight">
                Coordenadas
              </h2>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-0.5">
                Ubicación exacta satelital
              </p>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className={labelClass}>Latitud</label>
                <input
                  type="number"
                  step="any"
                  value={form.coordinates?.lat || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      coordinates: {
                        ...prev.coordinates!,
                        lat: Number(e.target.value),
                      },
                    }))
                  }
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Longitud</label>
                <input
                  type="number"
                  step="any"
                  value={form.coordinates?.lng || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      coordinates: {
                        ...prev.coordinates!,
                        lng: Number(e.target.value),
                      },
                    }))
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="rounded-[40px] bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
          <div className="flex items-center gap-4 px-8 py-7 border-b border-gray-50 bg-linear-to-br from-emerald-50/50 to-transparent">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
              <ListChecks className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-xl text-gray-900 tracking-tight">
                Características
              </h2>
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-0.5">
                {form.features?.length || 0} Amenidades registradas
              </p>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex flex-wrap gap-3">
              {form.features?.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-sm font-bold text-emerald-700 group/tag hover:border-emerald-300 transition-all duration-200"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-emerald-300 hover:text-emerald-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
              {!form.features?.length && (
                <div className="w-full py-10 border-2 border-dashed border-emerald-50 rounded-[32px] flex flex-col items-center justify-center text-emerald-200">
                  <ListChecks className="w-10 h-10 mb-2 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Sin características vinculadas
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addFeature())
                }
                placeholder="Agrega una nueva característica..."
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={addFeature}
                disabled={!newFeature.trim()}
                className="px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 transition-all active:scale-95 disabled:opacity-20"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Multimedia */}
        <section className="rounded-[40px] bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500">
          <div className="flex items-center justify-between px-8 py-7 border-b border-gray-50 bg-linear-to-br from-orange-50/50 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-200">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-black text-xl text-gray-900 tracking-tight">
                  Multimedia
                </h2>
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mt-0.5">
                  {form.files?.length || 0} Fotos seleccionadas
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {/* New Files Preview */}
              {form.files?.map((file, index) => (
                <div
                  key={`new-${index}`}
                  className="relative group rounded-3xl overflow-hidden aspect-square bg-orange-50/50 ring-2 ring-dashed ring-orange-200"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Nueva ${index + 1}`}
                    fill
                    className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-110"
                    onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-white/95 text-gray-500 hover:text-orange-600 shadow-xl opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="relative group">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center gap-4 w-full p-16 rounded-[48px] border-2 border-dashed border-gray-100 hover:border-orange-300 hover:bg-orange-50/30 text-gray-400 hover:text-orange-600 cursor-pointer transition-all duration-500"
              >
                <div className="p-6 rounded-[28px] bg-gray-50 group-hover:bg-orange-500 group-hover:text-white group-hover:scale-110 shadow-sm transition-all duration-500">
                  <Plus className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <span className="text-xl font-black tracking-tight block text-gray-900 group-hover:text-orange-700">
                    Añadir contenido visual
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1 block">
                    Formatos: JPG, PNG, WEBP (Máx 5MB)
                  </span>
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Video Upload Section */}
        <section className="rounded-[40px] bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-red-500/5 transition-all duration-500">
          <div className="flex items-center gap-4 px-8 py-7 border-b border-gray-50 bg-linear-to-br from-red-50/50 to-transparent">
            <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-200">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-xl text-gray-900 tracking-tight">
                Video de la Finca
              </h2>
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mt-0.5">
                Experiencia cinematográfica
              </p>
            </div>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              {form.videoFile ? (
                <div className="relative group rounded-[32px] overflow-hidden bg-gray-950 aspect-video ring-4 ring-white shadow-2xl max-h-[400px] mx-auto">
                  <video
                    src={URL.createObjectURL(form.videoFile)}
                    className="w-full h-full object-contain"
                    controls
                  />
                  <button
                    type="button"
                    onClick={removeVideoFile}
                    className="absolute top-5 right-5 p-3 rounded-2xl bg-white/95 text-gray-500 hover:text-red-600 shadow-2xl opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="relative group">
                  <input
                    type="file"
                    id="video-upload"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoSelect}
                  />
                  <label
                    htmlFor="video-upload"
                    className="flex flex-col items-center justify-center gap-4 w-full p-16 rounded-[48px] border-2 border-dashed border-gray-100 hover:border-red-300 hover:bg-red-50/30 text-gray-400 hover:text-red-600 cursor-pointer transition-all duration-500"
                  >
                    <div className="p-6 rounded-[28px] bg-gray-50 group-hover:bg-red-500 group-hover:text-white group-hover:scale-110 shadow-sm transition-all duration-500">
                      <Video className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <span className="text-xl font-black tracking-tight block text-gray-900 group-hover:text-red-700">
                        Subir Video de la Propiedad
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1 block">
                        Formato MP4 Recomendado
                      </span>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Botón de publicar */}
        <div className="sticky bottom-8 z-20 px-6 py-4 bg-white/60 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-2xl shadow-primary/20">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full inline-flex items-center justify-center gap-4 px-8 py-2 rounded-2xl bg-linear-to-r from-orange-600 to-primary text-white text-base font-black hover:from-orange-700 hover:to-primary/90 shadow-2xl shadow-primary/30 transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1 active:scale-[0.98] group"
          >
            {createMutation.isPending ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
              <>
                <div className="p-2 rounded-xl bg-white/20 group-hover:scale-125 transition-transform duration-500">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <span className="tracking-tight uppercase">
                  Publicar Propiedad Maestral
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Reuse Trash2 icon
function Trash2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}
