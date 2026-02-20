"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { sileo } from "sileo";
import { useProperty, useUpdateProperty } from "@/hooks/use-properties";
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
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyEditFormProps {
  propertyId: string;
}

export function PropertyEditForm({ propertyId }: PropertyEditFormProps) {
  const router = useRouter();
  const { data: property, isLoading, isError } = useProperty(propertyId);
  const updateMutation = useUpdateProperty();

  const [form, setForm] = useState<UpdatePropertyPayload>({});
  const [newFeature, setNewFeature] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    if (updateMutation.isSuccess) {
      sileo.success({ title: "¡Propiedad actualizada exitosamente!" });
    }
  }, [updateMutation.isSuccess]);

  useEffect(() => {
    if (updateMutation.isError) {
      sileo.error({
        title: "Error al actualizar la propiedad",
        description: "Intentalo de nuevo.",
      });
    }
  }, [updateMutation.isError]);

  useEffect(() => {
    if (property) {
      setForm({
        title: property.title,
        description: property.description,
        location: property.location,
        capacity: property.capacity,
        price: property.price,
        // Cargar seasonPrices completo
        seasonPrices: property.seasonPrices,
        images: property.images,
        features: property.features,
        video: property.video,
        coordinates: property.coordinates,
      });
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({ id: propertyId, payload: form });
    } catch (error) {
      console.error("Error al actualizar:", error);
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

  const addImage = () => {
    if (newImageUrl.trim()) {
      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), newImageUrl.trim()],
      }));
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
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

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 lg:p-10 bg-gray-50/50 min-h-[calc(100vh-3.5rem)]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <p className="text-gray-700 font-medium mb-1">
          No se pudo cargar la propiedad
        </p>
        <p className="text-gray-400 text-sm mb-4">
          Verifica que el ID sea correcto
        </p>
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/90 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al listado
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";
  const labelClass =
    "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2";

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-gray-50/50 min-h-[calc(100vh-3.5rem)]">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 z-10 bg-gray-50/50 backdrop-blur-sm py-4 -my-4 mb-4">
          <div className="flex items-center gap-4">
            <Link
              href="/properties"
              className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 shadow-sm transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {property.title}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Editar información de la propiedad
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <section className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <FileText className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-sm text-gray-700">
              Información básica
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Título de la propiedad</label>
                <input
                  type="text"
                  value={form.title || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Ej: Finca La Esperanza"
                />
              </div>
              <div>
                <label className={labelClass}>Ubicación</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    value={form.location || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className={`${inputClass} pl-10`}
                    placeholder="Ej: Copacabana, Antioquia"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Descripción detallada</label>
              <textarea
                rows={5}
                value={form.description || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className={`${inputClass} resize-none`}
                placeholder="Describe las comodidades, el entorno y lo que hace única a esta propiedad..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Capacidad (Personas)</label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="number"
                    value={form.capacity || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        capacity: Number(e.target.value),
                      }))
                    }
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Precio Base (COP)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="number"
                    value={form.seasonPrices?.base || form.price || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        seasonPrices: {
                          ...prev.seasonPrices,
                          base: Number(e.target.value),
                          baja: prev.seasonPrices?.baja ?? 0,
                          media: prev.seasonPrices?.media ?? 0,
                          alta: prev.seasonPrices?.alta ?? 0,
                          especiales: prev.seasonPrices?.especiales ?? null,
                        },
                      }))
                    }
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Video URL</label>
                <div className="relative">
                  <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    value={form.video || ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, video: e.target.value }))
                    }
                    className={`${inputClass} pl-10`}
                    placeholder="/fincas/video.mp4"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coordinates */}
        <section className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <Globe className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-sm text-gray-700">
              Coordenadas del mapa
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
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
              <div>
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
        <section className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <ListChecks className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-sm text-gray-700">
              Características y Comodidades
            </h2>
            <span className="ml-auto text-xs text-gray-400 font-medium bg-white px-2 py-1 rounded-md border border-gray-100">
              {form.features?.length || 0} items
            </span>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              {form.features?.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 group/tag hover:border-gray-300 transition-colors"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {!form.features?.length && (
                <p className="text-sm text-gray-400 italic">
                  No hay características agregadas aún
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addFeature())
                }
                placeholder="Ej: Piscina, Jacuzzi, Wifi..."
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={addFeature}
                disabled={!newFeature.trim()}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-primary shadow-sm transition-all disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <ImageIcon className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-sm text-gray-700">
              Galería de Imágenes
            </h2>
            <span className="ml-auto text-xs text-gray-400 font-medium bg-white px-2 py-1 rounded-md border border-gray-100">
              {(form.images?.length || 0) + (form.files?.length || 0)} fotos
            </span>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Existing Images */}
              {form.images?.map((img, index) => (
                <div
                  key={`existing-${index}`}
                  className="relative group rounded-xl overflow-hidden aspect-4/3 bg-gray-100 border border-gray-100"
                >
                  <Image
                    src={img}
                    alt={`Imagen ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-gray-500 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-wide bg-white/90 text-gray-600 px-2 py-0.5 rounded-md font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                    Existente
                  </span>
                </div>
              ))}

              {/* New Files */}
              {form.files?.map((file, index) => (
                <div
                  key={`new-${index}`}
                  className="relative group rounded-xl overflow-hidden aspect-4/3 bg-gray-100 border-2 border-dashed border-emerald-300"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Nueva ${index + 1}`}
                    fill
                    className="object-cover opacity-90 transition-transform duration-300 group-hover:scale-105"
                    onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-gray-500 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-wide bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold shadow-sm border border-emerald-200">
                    Nueva
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
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
                  className="flex flex-col items-center justify-center gap-2 w-full px-4 py-8 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 text-gray-500 hover:text-primary cursor-pointer transition-all group"
                >
                  <div className="p-3 rounded-full bg-gray-50 group-hover:bg-primary/10 transition-colors">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold">
                      Click para seleccionar imágenes
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      o arrastra y suelta aquí
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* <div className="relative py-2"> */}
            {/* <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div> */}
            {/* <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
                <span className="bg-white px-3 text-gray-400">
                  O agregar por URL
                </span>
              </div> */}
            {/* </div> */}

            {/* <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addImage())
                }
                placeholder="https://ejemplo.com/imagen.jpg"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={addImage}
                disabled={!newImageUrl.trim()}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-primary shadow-sm transition-all disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div> */}
          </div>
        </section>

        {/* Botón de guardar */}
        <div className="sticky bottom-4 z-10">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-primary text-secondary-foreground text-sm font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}
