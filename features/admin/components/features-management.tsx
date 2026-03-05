"use client";

import { useState, useRef } from "react";
import { sileo } from "sileo";
import {
  useFeatures,
  useCreateFeature,
  useBulkUploadFeatures,
  useUpdateFeature,
  useDeleteFeature,
} from "@/features/admin/queries/features.queries";
import type { FeatureCatalogItem } from "@/features/admin/types/features.types";
import {
  Plus,
  Upload,
  Pencil,
  Trash2,
  Loader2,
  Sparkles,
  Search,
  X,
  Image as ImageIcon,
} from "lucide-react";
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

export function FeaturesManagement() {
  const { data: features, isLoading } = useFeatures();
  const createMutation = useCreateFeature();
  const bulkMutation = useBulkUploadFeatures();
  const updateMutation = useUpdateFeature();
  const deleteMutation = useDeleteFeature();

  const [search, setSearch] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [editingFeature, setEditingFeature] =
    useState<FeatureCatalogItem | null>(null);
  const [deletingFeature, setDeletingFeature] =
    useState<FeatureCatalogItem | null>(null);

  // Create form
  const [newName, setNewName] = useState("");
  const [newIconFile, setNewIconFile] = useState<File | null>(null);

  // Edit form
  const [editName, setEditName] = useState("");
  const [editIconFile, setEditIconFile] = useState<File | null>(null);

  // Bulk
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const bulkInputRef = useRef<HTMLInputElement>(null);

  const filteredFeatures = features?.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  // ────── Create ──────
  const handleCreate = async () => {
    if (!newName.trim() || !newIconFile) {
      sileo.error({ title: "Nombre e icono SVG son requeridos" });
      return;
    }
    try {
      await createMutation.mutateAsync({
        name: newName.trim(),
        icon: newIconFile,
      });
      sileo.success({ title: "Feature creada exitosamente" });
      setShowCreateDialog(false);
      setNewName("");
      setNewIconFile(null);
    } catch {
      sileo.error({ title: "Error al crear la feature" });
    }
  };

  // ────── Bulk Upload ──────
  const handleBulk = async () => {
    if (bulkFiles.length === 0) {
      sileo.error({ title: "Selecciona al menos un archivo SVG" });
      return;
    }
    try {
      const result = await bulkMutation.mutateAsync(bulkFiles);
      sileo.success({
        title: `${Array.isArray(result) ? result.length : 0} features creadas`,
      });
      setShowBulkDialog(false);
      setBulkFiles([]);
    } catch {
      sileo.error({ title: "Error en la carga masiva" });
    }
  };

  // ────── Update ──────
  const handleUpdate = async () => {
    if (!editingFeature) return;
    try {
      await updateMutation.mutateAsync({
        id: editingFeature._id,
        payload: {
          name: editName.trim() || undefined,
          icon: editIconFile || undefined,
        },
      });
      sileo.success({ title: "Feature actualizada" });
      setEditingFeature(null);
      setEditName("");
      setEditIconFile(null);
    } catch {
      sileo.error({ title: "Error al actualizar la feature" });
    }
  };

  // ────── Delete ──────
  const handleDelete = async () => {
    if (!deletingFeature) return;
    try {
      await deleteMutation.mutateAsync(deletingFeature._id);
      sileo.success({ title: "Feature eliminada" });
      setDeletingFeature(null);
    } catch {
      sileo.error({
        title: "No se pudo eliminar",
        description: "Puede estar vinculada a una finca.",
      });
      setDeletingFeature(null);
    }
  };

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all duration-200 shadow-sm";
  const labelClass =
    "block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1";

  return (
    <div className="p-4 md:p-8 lg:p-10 bg-transparent min-h-[calc(100vh-4rem)] relative">
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-linear-to-br from-gray-900 via-gray-800 to-gray-500 bg-clip-text text-transparent">
              Catálogo de Características
            </h1>
            <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mt-1">
              {features?.length || 0} features registradas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBulkDialog(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <Upload className="w-4 h-4" />
              Carga Masiva
            </button>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Nueva Feature
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar feature..."
            className={`${inputClass} pl-11`}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Features Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-3xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : filteredFeatures && filteredFeatures.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredFeatures.map((feature) => (
              <div
                key={feature._id}
                className="group relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-100 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center p-2.5 group-hover:scale-110 transition-transform duration-300">
                  {feature.iconUrl ? (
                    <img
                      src={feature.iconUrl}
                      alt={feature.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Sparkles className="w-6 h-6 text-emerald-400" />
                  )}
                </div>
                {/* Name */}
                <span className="text-sm font-bold text-gray-800 text-center leading-tight">
                  {feature.name}
                </span>
                {/* Actions overlay */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => {
                      setEditingFeature(feature);
                      setEditName(feature.name);
                      setEditIconFile(null);
                    }}
                    className="p-2 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
                    title="Editar"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingFeature(feature)}
                    className="p-2 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-red-600 hover:border-red-200 shadow-sm transition-all"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-[40px] border-2 border-dashed border-gray-100 bg-gray-50/30">
            <Sparkles className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-400">
              {search
                ? "Sin resultados para la búsqueda"
                : "No hay features registradas aún"}
            </p>
            {!search && (
              <p className="text-xs text-gray-400 mt-1">
                Crea tu primera feature con el botón de arriba
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Create Dialog ── */}
      <AlertDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <AlertDialogContent className="rounded-3xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black tracking-tight">
              Nueva Feature
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500">
              Agrega una característica al catálogo con su icono SVG.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-5 py-4">
            <div>
              <label className={labelClass}>Nombre</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={inputClass}
                placeholder="Ej: Piscina"
              />
            </div>
            <div>
              <label className={labelClass}>Icono SVG</label>
              <label className="flex flex-col items-center justify-center gap-2 w-full p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30 cursor-pointer transition-all">
                <input
                  type="file"
                  accept=".svg"
                  className="hidden"
                  onChange={(e) => setNewIconFile(e.target.files?.[0] || null)}
                />
                {newIconFile ? (
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <ImageIcon className="w-5 h-5" />
                    {newIconFile.name}
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-300" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Seleccionar SVG
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">
              Cancelar
            </AlertDialogCancel>
            <button
              onClick={handleCreate}
              disabled={createMutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              {createMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Crear Feature
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Bulk Upload Dialog ── */}
      <AlertDialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <AlertDialogContent className="rounded-3xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black tracking-tight">
              Carga Masiva de Features
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500">
              Sube múltiples archivos SVG. El nombre de cada feature se toma del
              nombre del archivo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label
              className="flex flex-col items-center justify-center gap-3 w-full p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30 cursor-pointer transition-all"
              onClick={() => bulkInputRef.current?.click()}
            >
              <input
                ref={bulkInputRef}
                type="file"
                accept=".svg"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    setBulkFiles(Array.from(e.target.files));
                  }
                }}
              />
              <Upload className="w-8 h-8 text-gray-300" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Seleccionar archivos SVG
              </span>
            </label>
            {bulkFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
                  {bulkFiles.length} archivos seleccionados
                </p>
                <div className="max-h-40 overflow-y-auto space-y-1.5 px-1">
                  {bulkFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{f.name}</span>
                      <button
                        onClick={() =>
                          setBulkFiles((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          )
                        }
                        className="ml-auto text-gray-300 hover:text-red-500 shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">
              Cancelar
            </AlertDialogCancel>
            <button
              onClick={handleBulk}
              disabled={bulkMutation.isPending || bulkFiles.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              {bulkMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Subir {bulkFiles.length} archivos
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Edit Dialog ── */}
      <AlertDialog
        open={!!editingFeature}
        onOpenChange={(open) => !open && setEditingFeature(null)}
      >
        <AlertDialogContent className="rounded-3xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black tracking-tight">
              Editar Feature
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500">
              Modifica el nombre y/o el icono SVG de la feature.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-5 py-4">
            <div>
              <label className={labelClass}>Nombre</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Icono SVG (opcional, reemplaza el actual)
              </label>
              <label className="flex flex-col items-center justify-center gap-2 w-full p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all">
                <input
                  type="file"
                  accept=".svg"
                  className="hidden"
                  onChange={(e) => setEditIconFile(e.target.files?.[0] || null)}
                />
                {editIconFile ? (
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                    <ImageIcon className="w-5 h-5" />
                    {editIconFile.name}
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-300" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Cambiar icono SVG
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">
              Cancelar
            </AlertDialogCancel>
            <button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {updateMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Guardar Cambios
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Delete Dialog ── */}
      <AlertDialog
        open={!!deletingFeature}
        onOpenChange={(open) => !open && setDeletingFeature(null)}
      >
        <AlertDialogContent className="rounded-3xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black">
              Eliminar &quot;{deletingFeature?.name}&quot;
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Si la feature está vinculada a
              alguna finca, la eliminación fallará.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
