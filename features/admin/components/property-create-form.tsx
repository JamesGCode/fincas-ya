"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { sileo } from "sileo";
import {
  useCreateProperty,
  useCatalogs,
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
  PlusCircle,
  Tag,
  BarChart3,
  Calendar,
  Trash2,
  AlertCircle,
  Eye,
  CalendarCheck,
  CheckCircle2,
  Star,
} from "lucide-react";
import Link from "next/link";
import { formatPriceInput, parseCOP } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
const PROPERTY_TYPES = [
  { value: "FINCA", label: "Finca" },
  { value: "CASA_CAMPESTRE", label: "Casa Campestre" },
  { value: "VILLA", label: "Villa" },
  { value: "HACIENDA", label: "Hacienda" },
  { value: "QUINTA", label: "Quinta" },
  { value: "APARTAMENTO", label: "Apartamento" },
  { value: "CASA", label: "Casa" },
  { value: "CASA_PRIVADA", label: "Casa Privada" },
  { value: "CASA_EN_CONJUNTO_CERRADO", label: "Casa en Conjunto Cerrado" },
  { value: "VILLA_PRIVADA", label: "Villa Privada" },
  { value: "CONDOMINIO", label: "Condominio" },
  { value: "YATE", label: "Yate" },
  { value: "ISLA", label: "Isla" },
];
const PROPERTY_CATEGORIES = [
  { value: "ECONOMICA", label: "Económica" },
  { value: "ESTANDAR", label: "Estándar" },
  { value: "PREMIUM", label: "Premium" },
  { value: "LUJO", label: "Lujo" },
  { value: "ECOTURISMO", label: "Ecoturismo" },
  { value: "CON_PISCINA", label: "Con Piscina" },
  { value: "CERCA_BOGOTA", label: "Cerca a Bogotá" },
  { value: "GRUPOS_GRANDES", label: "Grupos Grandes" },
  { value: "VIP", label: "VIP" },
];
export function PropertyCreateForm() {
  const router = useRouter();
  const createMutation = useCreateProperty();
  const { data: catalogs } = useCatalogs();
  const { data: featuresCatalog, isLoading: isLoadingFeatures } = useFeatures();

  const [form, setForm] = useState<UpdatePropertyPayload>({
    title: "",
    description: "",
    location: "",
    capacity: 0,
    code: "",
    type: "FINCA",
    category: "ESTANDAR",
    priceBase: 0,
    priceBaja: 0,
    priceMedia: 0,
    priceAlta: 0,
    pricing: [],
    lat: 0,
    lng: 0,
    features: [],
    featureIds: [],
    files: [],
    catalogIds: [],
    visible: true,
    reservable: true,
    priceOriginal: 0,
    isFavorite: false,
  });
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

  useEffect(() => {
    if (createMutation.isSuccess) {
      sileo.success({ title: "¡Propiedad creada exitosamente!" });
      router.push("/admin/properties");
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

  // Sync IDs from names once catalog is loaded (if any default features are set)
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
      }
    }
  }, [featuresCatalog, form.features]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(form);
    } catch (error) {}
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
      setForm((prev) => ({ ...prev, videoFile: file }));
    }
  };
  const removeVideoFile = () => {
    setForm((prev) => ({ ...prev, videoFile: undefined }));
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
  const inputClass =
    "w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all duration-200 shadow-sm";
  const labelClass =
    "block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2.5 px-1";
  return (
    <div className="p-4 md:p-8 lg:p-10 bg-transparent min-h-[calc(100vh-4rem)] relative">
      <form
        onSubmit={handleSubmit}
        className="space-y-8 max-w-4xl mx-auto relative z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between top-[56px] md:top-[64px] z-20 bg-white/80 backdrop-blur-2xl py-4 md:py-5 -mx-4 md:-mx-6 px-4 md:px-6 mb-6 md:mb-10 transition-all duration-500 border-b border-gray-100/50">
          <div className="flex items-center gap-3 md:gap-6 w-full">
            <Link
              href="/admin/properties"
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
            {/* Title + Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className={labelClass}>Título</label>
                <input
                  type="text"
                  required
                  value={form.title || ""}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/[^a-z0-9\s-]/g, "")
                      .trim()
                      .replace(/\s+/g, "-");
                    setForm((prev) => ({ ...prev, title, code: slug }));
                  }}
                  className={inputClass}
                  placeholder="Ej: Mansión del Sol en Copacabana"
                />
              </div>
              <div className="space-y-1.5">
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
            <div className="space-y-1.5">
              <label className={labelClass}>Ubicación Geográfica</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  required
                  value={form.location || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, location: e.target.value }))
                  }
                  className={`${inputClass} pl-11`}
                  placeholder="Ej: Melgar, Tolima"
                />
              </div>
            </div>
            {/* Description */}
            <div className="space-y-1.5">
              <label className={labelClass}>Descripción</label>
              <textarea
                rows={5}
                required
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
              <div className="space-y-1.5">
                <label className={labelClass}>Tipo de propiedad</label>
                <select
                  value={form.type || "FINCA"}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className={inputClass}
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Categoría</label>
                <select
                  value={form.category || "ESTANDAR"}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className={inputClass}
                >
                  {PROPERTY_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Capacidad máxima</label>
                <div className="relative group">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.capacity || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        capacity: Number(e.target.value),
                      }))
                    }
                    className={`${inputClass} pl-11`}
                    placeholder="15"
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
          </div>
        </section>
        {/* Pricing & Rules */}
        <section className="rounded-[40px] bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-green-500/5 transition-all duration-500">
          <div className="flex items-center gap-4 px-6 md:px-8 py-5 md:py-7 border-b border-gray-50 bg-linear-to-br from-green-50/50 to-transparent">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-green-600 text-white flex items-center justify-center shadow-lg shadow-green-200">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h2 className="font-black text-lg md:text-xl text-gray-900 tracking-tight">
                Tarifas y Temporadas
              </h2>
              <p className="text-[9px] md:text-[10px] font-black text-green-500 uppercase tracking-widest mt-0.5">
                Configuración de precios dinámicos
              </p>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-8">
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
                <label className={labelClass}>Precio Original (Tachado)</label>
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
                      enabledSeasons[season.id]
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
                            [season.id]: !prev[season.id],
                          }))
                        }
                        className={`w-10 h-6 rounded-full relative transition-colors ${
                          enabledSeasons[season.id]
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                            enabledSeasons[season.id] ? "left-5" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                    {enabledSeasons[season.id] && (
                      <div className="relative group animate-in fade-in slide-in-from-top-2 duration-300">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                        <input
                          type="text"
                          value={formatPriceInput(
                            (form[season.key] as number) || 0,
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
                      <p className="font-black text-gray-900">{rule.nombre}</p>
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
        </section>
        {/* Coordinates */}
        <section className="rounded-[40px] bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
          <div className="flex items-center gap-4 px-6 md:px-8 py-5 md:py-7 border-b border-gray-50 bg-linear-to-br from-indigo-50/50 to-transparent">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
              <Globe className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h2 className="font-black text-lg md:text-xl text-gray-900 tracking-tight">
                Coordenadas
              </h2>
              <p className="text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-0.5">
                Marca la ubicación exacta en el mapa
              </p>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <MapPickerComponent
              lat={form.lat || 0}
              lng={form.lng || 0}
              onChange={(newLat, newLng) =>
                setForm((prev) => ({ ...prev, lat: newLat, lng: newLng }))
              }
            />
            {/* Manual override inputs */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
              <div className="space-y-1.5">
                <label className={labelClass}>Latitud (manual)</label>
                <input
                  type="number"
                  step="any"
                  value={form.lat || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      lat: Number(e.target.value),
                    }))
                  }
                  className={inputClass}
                  placeholder="4.3007"
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Longitud (manual)</label>
                <input
                  type="number"
                  step="any"
                  value={form.lng || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      lng: Number(e.target.value),
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
          <div className="flex items-center gap-4 px-6 md:px-8 py-5 md:py-7 border-b border-gray-50 bg-linear-to-br from-orange-50/50 to-transparent">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-200">
              <ListChecks className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h2 className="font-black text-lg md:text-xl text-gray-900 tracking-tight">
                Características
              </h2>
              <p className="text-[9px] md:text-[10px] font-black text-orange-400 uppercase tracking-widest mt-0.5">
                {form.features?.length || 0} Amenidades seleccionadas
              </p>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <FeaturePicker
              selectedIds={form.featureIds || []}
              onToggle={toggleFeature}
              catalog={featuresCatalog || []}
              isLoading={isLoadingFeatures}
            />
          </div>
        </section>
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
        {/* Images */}
        <section className="rounded-[40px] bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500">
          <div className="flex items-center gap-4 px-6 md:px-8 py-5 md:py-7 border-b border-gray-50 bg-linear-to-br from-orange-50/50 to-transparent">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-200">
              <ImageIcon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h2 className="font-black text-lg md:text-xl text-gray-900 tracking-tight">
                Imágenes
              </h2>
              <p className="text-[9px] md:text-[10px] font-black text-orange-400 uppercase tracking-widest mt-0.5">
                {form.files?.length || 0} Fotos seleccionadas
              </p>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-8">
            {form.files && form.files.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {form.files.map((file, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative group rounded-2xl overflow-hidden aspect-square bg-orange-50/50 ring-2 ring-dashed ring-orange-200"
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
                      className="absolute top-2 right-2 p-1.5 rounded-xl bg-white/95 text-gray-500 hover:text-orange-600 shadow-xl opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                className="flex flex-col items-center justify-center gap-4 w-full p-12 rounded-[40px] border-2 border-dashed border-gray-100 hover:border-orange-300 hover:bg-orange-50/30 text-gray-400 hover:text-orange-600 cursor-pointer transition-all duration-500"
              >
                <div className="p-5 rounded-[24px] bg-gray-50 group-hover:bg-orange-500 group-hover:text-white group-hover:scale-110 shadow-sm transition-all duration-500">
                  <Plus className="w-7 h-7" />
                </div>
                <div className="text-center">
                  <span className="text-lg font-black tracking-tight block text-gray-900 group-hover:text-orange-700">
                    Añadir contenido visual
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1 block">
                    JPG, PNG, WEBP — Máx 10MB
                  </span>
                </div>
              </label>
            </div>
          </div>
        </section>
        {/* Video */}
        <section className="rounded-[40px] bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-red-500/5 transition-all duration-500">
          <div className="flex items-center gap-4 px-6 md:px-8 py-5 md:py-7 border-b border-gray-50 bg-linear-to-br from-red-50/50 to-transparent">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-200">
              <Video className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h2 className="font-black text-lg md:text-xl text-gray-900 tracking-tight">
                Video de la Finca
              </h2>
              <p className="text-[9px] md:text-[10px] font-black text-red-400 uppercase tracking-widest mt-0.5">
                MP4 recomendado — Máx 100MB
              </p>
            </div>
          </div>
          <div className="p-6 md:p-8">
            {form.videoFile ? (
              <div className="relative group rounded-[28px] overflow-hidden bg-gray-950 aspect-video ring-4 ring-white shadow-2xl max-h-[360px] mx-auto">
                <video
                  src={URL.createObjectURL(form.videoFile)}
                  className="w-full h-full object-contain"
                  controls
                />
                <button
                  type="button"
                  onClick={removeVideoFile}
                  className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/95 text-gray-500 hover:text-red-600 shadow-2xl opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-4 h-4" />
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
                  className="flex flex-col items-center justify-center gap-4 w-full p-12 rounded-[40px] border-2 border-dashed border-gray-100 hover:border-red-300 hover:bg-red-50/30 text-gray-400 hover:text-red-600 cursor-pointer transition-all duration-500"
                >
                  <div className="p-5 rounded-[24px] bg-gray-50 group-hover:bg-red-500 group-hover:text-white group-hover:scale-110 shadow-sm transition-all duration-500">
                    <Video className="w-7 h-7" />
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-black tracking-tight block text-gray-900 group-hover:text-red-700">
                      Subir Video
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1 block">
                      MP4, WEBM, MOV
                    </span>
                  </div>
                </label>
              </div>
            )}
          </div>
        </section>
        {/* Submit */}
        <div className="sticky bottom-8 z-9999 px-6 py-4 bg-white/60 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-2xl shadow-primary/20">
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
                  Publicar Propiedad
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
