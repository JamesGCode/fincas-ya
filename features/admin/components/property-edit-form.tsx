"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { sileo } from "sileo";
import {
  useProperty,
  useUpdateProperty,
  useAddPropertyImage,
  useDeletePropertyImage,
  useUploadPropertyVideo,
  useDeletePropertyVideo,
  useDeleteProperty,
  useCatalogs,
  useLinkPropertyFeature,
  useUnlinkPropertyFeature,
} from "@/features/fincas/queries/fincas.queries";
import { useFeatures } from "@/features/admin/queries/features.queries";
import { FeaturePicker } from "./feature-picker";
import type { UpdatePropertyPayload } from "@/features/fincas/types/fincas.types";
import { MapPicker as MapPickerComponent } from "./map-picker";
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
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  PlusCircle,
  AlertTriangle,
  Eye,
  CalendarCheck,
  Star,
} from "lucide-react";
import Link from "next/link";
import { formatPriceInput, parseCOP } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
interface PropertyEditFormProps {
  propertyId: string;
}
export function PropertyEditForm({ propertyId }: PropertyEditFormProps) {
  const { data: property, isLoading, isError } = useProperty(propertyId);
  const updateMutation = useUpdateProperty();
  const deleteImageMutation = useDeletePropertyImage();
  const deleteVideoMutation = useDeletePropertyVideo();
  const deletePropertyMutation = useDeleteProperty();
  const linkFeatureMutation = useLinkPropertyFeature();
  const unlinkFeatureMutation = useUnlinkPropertyFeature();
  const { data: catalogs } = useCatalogs();
  const { data: featuresCatalog, isLoading: isLoadingFeatures } = useFeatures();
  const router = useRouter();

  // Initialization ref
  const hasInitialized = useRef(false);
  const initialFeatures = useRef<string[]>([]);
  const [form, setForm] = useState<UpdatePropertyPayload>({});
  const [enabledSeasons, setEnabledSeasons] = useState({
    baja: false,
    media: false,
    alta: false,
  });
  const [newRule, setNewRule] = useState({
    nombre: "",
    fechaDesde: "",
    fechaHasta: "",
    valorUnico: 0,
    activa: true,
    descripcion: "",
  });
  // Multi-select state
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);
  // Delete video dialog state
  const [showDeleteVideoDialog, setShowDeleteVideoDialog] = useState(false);
  const [showDeletePropertyDialog, setShowDeletePropertyDialog] =
    useState(false);
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
        code: property.code,
        type: property.type,
        category: property.category,
        // Flat price fields (what the API actually accepts)
        priceBase:
          property.priceBase ?? property.seasonPrices?.base ?? property.price,
        priceBaja: property.priceBaja ?? property.seasonPrices?.baja ?? 0,
        priceMedia: property.priceMedia ?? property.seasonPrices?.media ?? 0,
        priceAlta: property.priceAlta ?? property.seasonPrices?.alta ?? 0,
        pricing: property.pricing || property.seasonPrices?.rules || [],
        // Flat coords
        lat: property.lat ?? property.coordinates?.lat,
        lng: property.lng ?? property.coordinates?.lng,
        // Legacy nested (kept for display fallback)
        price: property.price,
        seasonPrices: property.seasonPrices,
        images: property.images,
        imageItems: property.imageItems,
        features: property.features || [],
        files: [],
        videoFile: undefined,
        catalogIds: property.catalogIds || [],
        featureIds: property.featureIds || [],
        visible: property.visible ?? true,
        reservable: property.reservable ?? true,
        priceOriginal: property.priceOriginal || 0,
        isFavorite: property.isFavorite || false,
      });
      initialFeatures.current = property.featureIds || [];
      setEnabledSeasons({
        baja: !!(property.priceBaja || property.seasonPrices?.baja),
        media: !!(property.priceMedia || property.seasonPrices?.media),
        alta: !!(property.priceAlta || property.seasonPrices?.alta),
      });
    }
  }, [property]);

  // Map names to IDs once catalog is loaded (since API only returns names)
  useEffect(() => {
    if (
      featuresCatalog &&
      form.features &&
      form.features.length > 0 &&
      (!form.featureIds || form.featureIds.length === 0)
    ) {
      const mappedIds = form.features
        .map((name) => featuresCatalog.find((c) => c.name === name)?._id)
        .filter(Boolean) as string[];

      if (mappedIds.length > 0) {
        setForm((prev) => ({ ...prev, featureIds: mappedIds }));
        if (!hasInitialized.current) {
          initialFeatures.current = mappedIds;
          hasInitialized.current = true;
        }
      }
    }
  }, [featuresCatalog, form.features]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currentIds = form.featureIds || [];
      const toAddIds = currentIds.filter(
        (id) => !initialFeatures.current.includes(id),
      );
      const toRemoveIds = initialFeatures.current.filter(
        (id) => !currentIds.includes(id),
      );

      // 1. Unlink removed features
      await Promise.all(
        toRemoveIds.map((id) => {
          const catalogItem = featuresCatalog?.find((c) => c._id === id);
          if (!catalogItem) return Promise.resolve();
          return unlinkFeatureMutation.mutateAsync({
            id: propertyId,
            name: catalogItem.name,
            featureId: id,
          });
        }),
      );

      // 2. Link added features
      await Promise.all(
        toAddIds.map((id) => {
          const catalogItem = featuresCatalog?.find((c) => c._id === id);
          if (!catalogItem) return Promise.resolve();
          return linkFeatureMutation.mutateAsync({
            id: propertyId,
            name: catalogItem.name,
            featureId: id,
          });
        }),
      );

      // 3. Update main property
      const { features, catalogIds, featureIds, ...payloadWithoutFeatures } =
        form;
      await updateMutation.mutateAsync({
        id: propertyId,
        payload: payloadWithoutFeatures,
      });

      // Update initial features ref after success
      initialFeatures.current = currentIds;

      sileo.success({ title: "¡Propiedad y características actualizadas!" });
    } catch (error) {
      sileo.error({ title: "Error al sincronizar cambios" });
    }
  };
  const addPricingRule = () => {
    if (!newRule.nombre || !newRule.fechaDesde || !newRule.fechaHasta) {
      sileo.error({ title: "Por favor completa todos los campos de la regla" });
      return;
    }
    setForm((prev) => ({
      ...prev,
      pricing: [...(prev.pricing || []), { ...newRule }],
    }));
    setNewRule({
      nombre: "",
      fechaDesde: "",
      fechaHasta: "",
      valorUnico: 0,
      activa: true,
      descripcion: "",
    });
  };
  const removePricingRule = (index: number) => {
    setForm((prev) => ({
      ...prev,
      pricing: prev.pricing?.filter((_, i) => i !== index),
    }));
  };
  const toggleRuleActive = (index: number) => {
    setForm((prev) => ({
      ...prev,
      pricing: prev.pricing?.map((rule, i) =>
        i === index ? { ...rule, activa: !rule.activa } : rule,
      ),
    }));
  };

  const toggleFeature = (featureId: string) => {
    setForm((prev) => {
      const currentIds = prev.featureIds || [];
      const isSelected = currentIds.includes(featureId);

      const newIds = isSelected
        ? currentIds.filter((id) => id !== featureId)
        : [...currentIds, featureId];

      // Derived names for features array (to keep compatibility if needed elsewhere)
      const newNames = newIds
        .map((id) => featuresCatalog?.find((c) => c._id === id)?.name)
        .filter(Boolean) as string[];

      return {
        ...prev,
        featureIds: newIds,
        features: newNames,
      };
    });
  };

  // Image handlingvidual image selection
  const toggleImageSelection = (index: number) => {
    setSelectedImages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };
  // Select / deselect all
  const toggleSelectAll = () => {
    if (selectedImages.size === (form.images?.length || 0)) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set((form.images || []).map((_, i) => i)));
    }
  };
  // Delete all selected images
  const deleteSelectedImages = async () => {
    if (selectedImages.size === 0) return;
    setIsDeletingSelected(true);
    const indices = Array.from(selectedImages).sort((a, b) => b - a); // descending to keep indices stable
    try {
      await Promise.all(
        indices.map((index) => {
          // Use imageItems (has id+url) if available, else skip
          const imageItem = form.imageItems?.[index];
          if (!imageItem) return Promise.resolve();
          return deleteImageMutation.mutateAsync({ imageId: imageItem.id });
        }),
      );
      // Remove from local state (descending order to preserve indices)
      setForm((prev) => ({
        ...prev,
        images: prev.images?.filter((_, i) => !selectedImages.has(i)),
        imageItems: prev.imageItems?.filter((_, i) => !selectedImages.has(i)),
      }));
      sileo.success({
        title: `${selectedImages.size} ${selectedImages.size === 1 ? "imagen eliminada" : "imágenes seleccionadas"} correctamente`,
      });
      setSelectedImages(new Set());
    } catch (error) {
      sileo.error({ title: "Error al eliminar las imágenes seleccionadas" });
    } finally {
      setIsDeletingSelected(false);
    }
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
  const removeCurrentVideo = () => {
    setShowDeleteVideoDialog(true);
  };
  const toggleCatalog = (catalogId: string) => {
    setForm((prev) => {
      const currentIds = prev.catalogIds || [];
      const newIds = currentIds.includes(catalogId)
        ? currentIds.filter((id) => id !== catalogId)
        : [...currentIds, catalogId];
      return { ...prev, catalogIds: newIds };
    });
  };
  const confirmDeleteVideo = async () => {
    try {
      await deleteVideoMutation.mutateAsync({ id: propertyId });
      setForm((prev) => ({ ...prev, video: "" }));
      sileo.success({ title: "Video eliminado correctamente" });
    } catch (error) {
      sileo.error({ title: "Error al eliminar el video" });
    } finally {
      setShowDeleteVideoDialog(false);
    }
  };
  const confirmDeleteProperty = async () => {
    try {
      await deletePropertyMutation.mutateAsync(propertyId);
      sileo.success({ title: "Propiedad eliminada correctamente" });
      router.push("/admin/properties");
    } catch (error) {
      sileo.error({ title: "Error al eliminar la propiedad" });
    } finally {
      setShowDeletePropertyDialog(false);
    }
  };
  if (isLoading) {
    return (
      <div className="p-6 md:p-8 lg:p-10 bg-gray-50/50 min-h-[calc(100vh-4rem)]">
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
          href="/admin/properties"
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/90 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al listado
        </Link>
      </div>
    );
  }
  const inputClass =
    "w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all duration-200 shadow-sm";
  const labelClass =
    "block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2.5 px-1";
  const totalImages = form.images?.length || 0;
  const allSelected = selectedImages.size === totalImages && totalImages > 0;
  return (
    <div className="p-4 md:p-8 lg:p-10 bg-gray-50/50 min-h-[calc(100vh-4rem)]">
      <form
        onSubmit={handleSubmit}
        className="space-y-8 md:space-y-12 max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between top-[56px] md:top-[64px] z-20 py-0 -mx-4 md:-mx-6 px-4 md:px-6 mb-6 md:mb-10 transition-all duration-500 border-b border-gray-100/50">
          <div className="flex items-center gap-3 md:gap-6 w-full">
            <Link
              href="/admin/properties"
              className="p-3 md:p-4 rounded-xl md:rounded-[20px] border border-gray-100 bg-white hover:bg-gray-50 shadow-sm transition-all active:scale-95 group shrink-0"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-3xl font-black tracking-tight leading-none bg-linear-to-br from-gray-900 via-gray-800 to-gray-500 bg-clip-text text-transparent truncate">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 mt-1 md:mt-2">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">
                    Edición
                  </span>
                </div>
                <p className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest truncate">
                  {property.location}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Basic Info */}
        <section className="rounded-[40px] bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500">
          <div className="flex items-center gap-4 px-8 py-7 border-b border-gray-50 bg-linear-to-br from-blue-50/50 to-transparent">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-200">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-xl text-gray-900 tracking-tight">
                Información básica
              </h2>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-0.5">
                Identidad y descripción del inmueble
              </p>
            </div>
          </div>
          <div className="p-8 space-y-8">
            {/* Title + Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className={labelClass}>Título</label>
                <input
                  type="text"
                  value={form.title || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Ej: Mansión del Sol en Copacabana"
                />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Código único</label>
                <input
                  type="text"
                  value={form.code || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, code: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Ej: FINCA001 o villa-el-sol"
                />
              </div>
            </div>
            {/* Location */}
            <div className="space-y-1">
              <label className={labelClass}>Ubicación Geográfica</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={form.location || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, location: e.target.value }))
                  }
                  className={`${inputClass} pl-11`}
                  placeholder="Ej: Copacabana, Antioquia"
                />
              </div>
            </div>
            {/* Description */}
            <div className="space-y-1">
              <label className={labelClass}>Descripción</label>
              <textarea
                rows={5}
                value={form.description || ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className={`${inputClass} resize-none py-4 leading-relaxed`}
                placeholder="Describe la experiencia única que ofrece esta propiedad..."
              />
            </div>
            {/* Type + Category + Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className={labelClass}>Tipo de propiedad</label>
                <select
                  value={form.type || "FINCA"}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className={inputClass}
                >
                  {[
                    { value: "FINCA", label: "Finca" },
                    { value: "CASA_CAMPESTRE", label: "Casa Campestre" },
                    { value: "VILLA", label: "Villa" },
                    { value: "HACIENDA", label: "Hacienda" },
                    { value: "QUINTA", label: "Quinta" },
                    { value: "APARTAMENTO", label: "Apartamento" },
                    { value: "CASA", label: "Casa" },
                    { value: "CASA_PRIVADA", label: "Casa Privada" },
                    {
                      value: "CASA_EN_CONJUNTO_CERRADO",
                      label: "Casa en Conjunto Cerrado",
                    },
                    { value: "VILLA_PRIVADA", label: "Villa Privada" },
                    { value: "CONDOMINIO", label: "Condominio" },
                    { value: "YATE", label: "Yate" },
                  ].map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Categoría</label>
                <select
                  value={form.category || "ESTANDAR"}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className={inputClass}
                >
                  {[
                    { value: "ECONOMICA", label: "Económica" },
                    { value: "ESTANDAR", label: "Estándar" },
                    { value: "PREMIUM", label: "Premium" },
                    { value: "LUJO", label: "Lujo" },
                    { value: "ECOTURISMO", label: "Ecoturismo" },
                    { value: "CON_PISCINA", label: "Con Piscina" },
                    { value: "CERCA_BOGOTA", label: "Cerca a Bogotá" },
                    { value: "GRUPOS_GRANDES", label: "Grupos Grandes" },
                    { value: "VIP", label: "VIP" },
                  ].map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Capacidad máxima</label>
                <div className="relative group">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="number"
                    min={1}
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
            </div>
            {/* Visibility & Reseravility Switches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Visible en el catálogo
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Mostrar esta propiedad al público
                    </p>
                  </div>
                </div>
                <Switch
                  checked={form.visible}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, visible: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Permitir reservaciones
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Habilitar reservas para esta propiedad
                    </p>
                  </div>
                </div>
                <Switch
                  checked={form.reservable}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, reservable: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <Star className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900 leading-none">
                      Favorita entre viajeros
                    </span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Marcar como propiedad destacada
                    </p>
                  </div>
                </div>
                <Switch
                  checked={form.isFavorite}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, isFavorite: checked }))
                  }
                />
              </div>
            </div>
            {/* Pricing & Rules */}
            <div className="space-y-8 pt-4">
              <div className="h-px bg-gray-100 w-full" />
              {/* Base Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className={labelClass}>Precio Base (Por noche)</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                    <input
                      type="text"
                      required
                      value={formatPriceInput(form.priceBase || 0)}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          priceBase: parseCOP(e.target.value),
                        }))
                      }
                      className={`${inputClass} pl-11 font-black text-lg text-green-700`}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Precio Original (Tachado)
                  </label>
                  <div className="relative group">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                    <input
                      type="text"
                      value={formatPriceInput(form.priceOriginal || 0)}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          priceOriginal: parseCOP(e.target.value),
                        }))
                      }
                      className={`${inputClass} pl-11 font-black text-lg text-red-700/50`}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              <div className="h-px bg-gray-100 w-full" />
              {/* Optional Fixed Seasons */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xs text-gray-400 uppercase tracking-widest">
                    Temporadas Definidas
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(
                    [
                      { id: "baja", label: "Baja", key: "priceBaja" },
                      { id: "media", label: "Media", key: "priceMedia" },
                      { id: "alta", label: "Alta", key: "priceAlta" },
                    ] as const
                  ).map((season) => (
                    <div
                      key={season.id}
                      className={`p-4 rounded-3xl border transition-all ${
                        enabledSeasons[season.id as keyof typeof enabledSeasons]
                          ? "bg-white border-green-200 shadow-sm"
                          : "bg-gray-50 border-gray-100 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                          {season.label}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setEnabledSeasons((prev) => ({
                              ...prev,
                              [season.id]:
                                !prev[season.id as keyof typeof enabledSeasons],
                            }))
                          }
                          className={`w-10 h-6 rounded-full relative transition-colors ${
                            enabledSeasons[
                              season.id as keyof typeof enabledSeasons
                            ]
                              ? "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                              enabledSeasons[
                                season.id as keyof typeof enabledSeasons
                              ]
                                ? "left-5"
                                : "left-1"
                            }`}
                          />
                        </button>
                      </div>
                      {enabledSeasons[
                        season.id as keyof typeof enabledSeasons
                      ] && (
                        <div className="relative group animate-in fade-in slide-in-from-top-2 duration-300">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                          <input
                            type="text"
                            value={formatPriceInput(
                              (form[
                                season.key as keyof UpdatePropertyPayload
                              ] as number) || 0,
                            )}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                [season.key]: parseCOP(e.target.value),
                              }))
                            }
                            className={`${inputClass} h-10! pl-8 text-sm font-bold`}
                            placeholder="0"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-px bg-gray-100 w-full" />
              {/* Rules Management */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    Reglas de Temporada
                  </h3>
                </div>
                {/* Rules List */}
                <div className="grid grid-cols-1 gap-4">
                  {form.pricing?.map((rule, index) => (
                    <div
                      key={index}
                      className={`flex flex-col md:flex-row items-start md:items-center gap-4 p-5 rounded-3xl border transition-all ${
                        rule.activa
                          ? "bg-green-50/30 border-green-100"
                          : "bg-gray-50 border-gray-100 opacity-75"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-gray-900">
                          {rule.nombre}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-gray-500 whitespace-nowrap bg-white px-2 py-0.5 rounded-full border border-gray-100">
                            {rule.fechaDesde} — {rule.fechaHasta}
                          </span>
                          <span className="text-sm font-black text-green-600">
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              maximumFractionDigits: 0,
                            }).format(rule.valorUnico)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          type="button"
                          onClick={() => toggleRuleActive(index)}
                          className={`p-2 rounded-xl transition-all ${
                            rule.activa
                              ? "bg-green-500 text-white shadow-md shadow-green-200"
                              : "bg-gray-200 text-gray-500"
                          }`}
                          title={rule.activa ? "Desactivar" : "Activar"}
                        >
                          {rule.activa ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => removePricingRule(index)}
                          className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!form.pricing || form.pricing.length === 0) && (
                    <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-[32px] bg-gray-50/30">
                      <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-gray-400">
                        No hay reglas de temporada configuradas
                      </p>
                    </div>
                  )}
                </div>
                {/* Add New Rule Form */}
                <div className="bg-gray-50/50 rounded-[32px] p-6 border border-gray-100 space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">
                    Nueva Regla de Temporada
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-500 uppercase px-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={newRule.nombre}
                        onChange={(e) =>
                          setNewRule((prev) => ({
                            ...prev,
                            nombre: e.target.value,
                          }))
                        }
                        className={inputClass}
                        placeholder="Ej: Semana Santa"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-500 uppercase px-1">
                        Desde
                      </label>
                      <input
                        type="date"
                        value={newRule.fechaDesde}
                        onChange={(e) =>
                          setNewRule((prev) => ({
                            ...prev,
                            fechaDesde: e.target.value,
                          }))
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-500 uppercase px-1">
                        Hasta
                      </label>
                      <input
                        type="date"
                        value={newRule.fechaHasta}
                        onChange={(e) =>
                          setNewRule((prev) => ({
                            ...prev,
                            fechaHasta: e.target.value,
                          }))
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-500 uppercase px-1">
                        Valor por noche
                      </label>
                      <input
                        type="text"
                        value={formatPriceInput(newRule.valorUnico || 0)}
                        onChange={(e) =>
                          setNewRule((prev) => ({
                            ...prev,
                            valorUnico: parseCOP(e.target.value),
                          }))
                        }
                        className={inputClass}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addPricingRule}
                    className="w-full h-12 rounded-2xl bg-green-600 text-white font-black text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Agregar Regla
                  </button>
                </div>
              </div>
            </div>
            {/* Catalog Selection */}
            <section className="p-6 md:p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500 group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  <ListChecks className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h2 className="font-black text-lg md:text-xl text-gray-900 tracking-tight">
                    Catálogos vinculados
                  </h2>
                  <p className="text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-0.5">
                    Dónde aparecerá esta finca
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {catalogs?.map((catalog) => {
                  const isActive = form.catalogIds?.includes(catalog._id);
                  return (
                    <button
                      key={catalog._id}
                      type="button"
                      onClick={() => toggleCatalog(catalog._id)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-300 ${
                        isActive
                          ? "bg-indigo-50/50 border-indigo-200 text-indigo-700 shadow-sm"
                          : "bg-gray-50/50 border-transparent text-gray-500 hover:bg-white hover:border-gray-100 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isActive
                            ? "bg-indigo-500 border-indigo-500"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        {isActive && (
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="font-bold text-xs md:text-sm truncate">
                        {catalog.name}
                      </span>
                    </button>
                  );
                })}
                {(!catalogs || catalogs.length === 0) && (
                  <div className="col-span-full py-8 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                    No hay catálogos disponibles
                  </div>
                )}
              </div>
            </section>
            <div className="space-y-1">
              <label className={labelClass}>Video de la Finca</label>
              <div className="space-y-4">
                {form.video || form.videoFile ? (
                  <div className="relative group rounded-2xl overflow-hidden bg-gray-900 aspect-video ring-1 ring-gray-200 shadow-sm max-h-[400px] mx-auto">
                    {form.videoFile ? (
                      <video
                        src={URL.createObjectURL(form.videoFile)}
                        className="w-full h-full object-contain"
                        controls
                      />
                    ) : (
                      <video
                        src={form.video}
                        className="w-full h-full object-contain"
                        controls
                      />
                    )}
                    <button
                      type="button"
                      onClick={
                        form.videoFile ? removeVideoFile : removeCurrentVideo
                      }
                      className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 text-gray-500 hover:text-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/20">
                        {form.videoFile ? "Por subir" : "Actual"}
                      </span>
                    </div>
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
                      className="flex flex-col items-center justify-center gap-2 w-full p-8 rounded-2xl border-2 border-dashed border-gray-100 hover:border-primary/30 hover:bg-primary/5 text-gray-400 hover:text-primary cursor-pointer transition-all duration-300"
                    >
                      <Video className="w-8 h-8 mb-1" />
                      <span className="text-sm font-black uppercase tracking-widest">
                        Subir Video de la Propiedad
                      </span>
                    </label>
                  </div>
                )}
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
                Ubicación Satelital
              </h2>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-0.5">
                Marca la ubicación exacta en el mapa
              </p>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <MapPickerComponent
              lat={form.lat ?? 0}
              lng={form.lng ?? 0}
              onChange={(newLat: number, newLng: number) =>
                setForm((prev) => ({ ...prev, lat: newLat, lng: newLng }))
              }
            />
            {/* Manual override inputs */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
              <div className="space-y-1">
                <label className={labelClass}>Latitud (manual)</label>
                <input
                  type="number"
                  step="any"
                  value={form.lat ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      lat:
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                    }))
                  }
                  className={inputClass}
                  placeholder="4.3007"
                />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Longitud (manual)</label>
                <input
                  type="number"
                  step="any"
                  value={form.lng ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      lng:
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                    }))
                  }
                  className={inputClass}
                  placeholder="-74.8006"
                />
              </div>
            </div>
          </div>
        </section>
        {/* Features */}
        <section className="rounded-[40px] bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500">
          <div className="flex items-center gap-4 px-8 py-7 border-b border-gray-50 bg-linear-to-br from-orange-50/50 to-transparent">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-200">
              <ListChecks className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-xl text-gray-900 tracking-tight">
                Características & Amenidades
              </h2>
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mt-0.5">
                {form.features?.length || 0} Amenidades seleccionadas
              </p>
            </div>
          </div>
          <div className="p-8">
            <FeaturePicker
              selectedIds={form.featureIds || []}
              onToggle={toggleFeature}
              catalog={featuresCatalog || []}
              isLoading={isLoadingFeatures}
            />
          </div>
        </section>
        {/* Images */}
        <section className="rounded-[40px] bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500">
          <div className="flex items-center justify-between px-8 py-7 border-b border-gray-50 bg-linear-to-br from-orange-50/50 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-200">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-black text-xl text-gray-900 tracking-tight">
                  Multimedia & Galería
                </h2>
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mt-0.5">
                  {(form.images?.length || 0) + (form.files?.length || 0)} Total
                  de archivos
                </p>
              </div>
            </div>
            {/* Action Buttons: Select All & Delete Selected */}
            {totalImages > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 active:scale-95 shadow-sm
                    ${
                      allSelected
                        ? "bg-gray-900 text-white border-gray-900 hover:bg-black"
                        : "bg-white text-gray-500 border-gray-100 hover:border-orange-200 hover:text-orange-600 hover:bg-orange-50/50"
                    }`}
                >
                  {allSelected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Todas seleccionadas</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-gray-300" />
                      <span>Seleccionar todas</span>
                    </>
                  )}
                </button>

                {/* Delete Selected Button - Now moved here */}
                {selectedImages.size > 0 && (
                  <button
                    type="button"
                    onClick={deleteSelectedImages}
                    disabled={isDeletingSelected}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-red-500/20"
                  >
                    {isDeletingSelected ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    <span>Eliminar ({selectedImages.size})</span>
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="p-8 space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {/* Existing Images — selectable */}
              {form.images?.map((img, index) => {
                const isSelected = selectedImages.has(index);
                return (
                  <div
                    key={`existing-${index}`}
                    onClick={() => toggleImageSelection(index)}
                    className={`relative group rounded-3xl overflow-hidden aspect-square bg-gray-100 cursor-pointer
                      ring-2 shadow-sm transition-all duration-200
                      ${
                        isSelected
                          ? "ring-orange-500 scale-[0.97] shadow-orange-100"
                          : "ring-gray-100 hover:ring-orange-200 hover:scale-[0.98]"
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`Imagen ${index + 1}`}
                      fill
                      className={`object-cover transition-all duration-500 ${isSelected ? "brightness-75" : "group-hover:scale-110"}`}
                    />
                    {/* Overlay on selected */}
                    <div
                      className={`absolute inset-0 transition-all duration-300 ${
                        isSelected
                          ? "bg-orange-900/20"
                          : "bg-black/0 group-hover:bg-linear-to-t group-hover:from-black/50 group-hover:via-transparent"
                      }`}
                    />
                    {/* Checkbox indicator */}
                    <div
                      className={`absolute top-3 right-3 transition-all duration-200 ${isSelected ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 transition-all duration-200
                        ${
                          isSelected
                            ? "bg-orange-500 border-orange-500"
                            : "bg-white/80 border-white backdrop-blur-sm"
                        }`}
                      >
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    {/* Badge */}
                    <div
                      className={`absolute bottom-3 left-3 transition-all duration-200 ${isSelected ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100 translate-y-[10px] group-hover:translate-y-0"}`}
                    >
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border
                        ${
                          isSelected
                            ? "bg-orange-500 text-white border-orange-400"
                            : "bg-white/30 backdrop-blur-md text-white border-white/20"
                        }`}
                      >
                        {isSelected ? "Seleccionada" : "Digital"}
                      </span>
                    </div>
                  </div>
                );
              })}
              {/* New Files */}
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
                    className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 text-gray-500 hover:text-orange-600 shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-orange-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                      Nueva
                    </span>
                  </div>
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
                className="flex flex-col items-center justify-center gap-4 w-full p-12 rounded-[40px] border-2 border-dashed border-gray-100 hover:border-orange-200 hover:bg-orange-50/20 text-gray-400 hover:text-orange-600 cursor-pointer transition-all duration-500"
              >
                <div className="p-5 rounded-[24px] bg-gray-50 group-hover:bg-orange-100 group-hover:scale-110 transition-all duration-500">
                  <Plus className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <span className="text-lg font-black tracking-tight block">
                    Añadir contenido visual
                  </span>
                  <span className="text-sm font-bold opacity-60 mt-1 block">
                    Sube archivos JPG, PNG o WebP de alta calidad
                  </span>
                </div>
              </label>
            </div>
          </div>
        </section>
        {/* Danger Zone */}
        <section className="rounded-[40px] bg-red-50/30 border border-red-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-red-500/5 transition-all duration-500">
          <div className="flex items-center gap-4 px-8 py-7 border-b border-red-50 bg-linear-to-br from-red-50/50 to-transparent">
            <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-200">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-xl text-red-900 tracking-tight">
                Zona de Peligro
              </h2>
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mt-0.5">
                Acciones irreversibles
              </p>
            </div>
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-base font-black text-gray-900 tracking-tight">
                  Eliminar esta propiedad
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Una vez que elimines una propiedad, no hay vuelta atrás. Por
                  favor, asegúrate.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeletePropertyDialog(true)}
                className="inline-flex items-center justify-center gap-3 px-8 py-3 rounded-2xl bg-white border-2 border-red-100 text-red-600 font-black hover:bg-red-50 hover:border-red-200 transition-all active:scale-95 group shadow-sm hover:shadow-md"
              >
                <Trash2 className="w-5 h-5 group-hover:shake" />
                Eliminar Propiedad
              </button>
            </div>
          </div>
        </section>
        {/* Botón de guardar */}
        <div className="sticky bottom-4 z-[9999] px-6 py-4 bg-white/60 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-2xl shadow-orange-500/20">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full inline-flex items-center justify-center gap-4 px-8 py-2 rounded-2xl bg-linear-to-r from-orange-600 to-orange-500 text-white text-base font-black hover:from-orange-700 hover:to-orange-600 shadow-2xl shadow-orange-500/30 transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1 active:scale-[0.98] group"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
              <>
                <div className="p-2 rounded-xl bg-white/20 group-hover:scale-125 transition-transform duration-500">
                  <Save className="w-6 h-6" />
                </div>
                <span className="tracking-tight uppercase">
                  Sincronizar Cambios
                </span>
              </>
            )}
          </button>
        </div>
      </form>
      {/* Delete Video Confirmation Dialog */}
      <AlertDialog
        open={showDeleteVideoDialog}
        onOpenChange={setShowDeleteVideoDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar video actual?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el video de la propiedad. Podrás subir uno
              nuevo después de guardar los cambios.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDeleteVideo();
              }}
              disabled={deleteVideoMutation.isPending}
              className="bg-red-500! hover:bg-red-600 text-white"
            >
              {deleteVideoMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Delete Property Confirmation Dialog */}
      <AlertDialog
        open={showDeletePropertyDialog}
        onOpenChange={setShowDeletePropertyDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              la propiedad y todos sus datos asociados del servidor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDeleteProperty();
              }}
              disabled={deletePropertyMutation.isPending}
              className="bg-red-500! hover:bg-red-600 text-white"
            >
              {deletePropertyMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Sí, eliminar propiedad
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
