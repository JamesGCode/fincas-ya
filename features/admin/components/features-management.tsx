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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Create form
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("");
  const [newIconFile, setNewIconFile] = useState<File | null>(null);

  // Edit form
  const [editName, setEditName] = useState("");
  const [editEmoji, setEditEmoji] = useState("");
  const [editIconFile, setEditIconFile] = useState<File | null>(null);

  // Bulk
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const bulkInputRef = useRef<HTMLInputElement>(null);

  const filteredFeatures = features?.filter((f) =>
    (f.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  // ────── Create ──────
  const handleCreate = async () => {
    if (!newName.trim() && !newEmoji.trim() && !newIconFile) {
      sileo.error({
        title: "Datos insuficientes",
        description: "Debes ingresar al menos un nombre, un emoji o un icono.",
      });
      return;
    }
    try {
      await createMutation.mutateAsync({
        name: newName.trim() || undefined,
        emoji: newEmoji.trim() || undefined,
        icon: newIconFile || undefined,
      });
      sileo.success({ title: "Feature creada exitosamente" });
      setShowCreateDialog(false);
      setNewName("");
      setNewEmoji("");
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
          name: editName.trim(),
          emoji: editEmoji.trim() || undefined,
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
      setSelectedIds((prev) => prev.filter((id) => id !== deletingFeature._id));
    } catch {
      sileo.error({
        title: "No se pudo eliminar",
        description: "Puede estar vinculada a una finca.",
      });
      setDeletingFeature(null);
    }
  };

  // ────── Bulk Delete ──────
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkDeleting(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (const id of selectedIds) {
        try {
          await deleteMutation.mutateAsync(id);
          successCount++;
        } catch {
          failCount++;
        }
      }

      if (successCount > 0) {
        sileo.success({
          title: "Eliminación completada",
          description: `${successCount} features eliminadas.${failCount > 0 ? ` ${failCount} fallaron.` : ""}`,
        });
      } else if (failCount > 0) {
        sileo.error({
          title: "Error al eliminar",
          description: "Ninguna feature pudo ser eliminada.",
        });
      }
      setSelectedIds([]);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (!filteredFeatures) return;
    const allVisibleIds = filteredFeatures.map((f) => f._id);
    const allSelected = allVisibleIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      // Unselect only the currently visible ones
      setSelectedIds((prev) =>
        prev.filter((id) => !allVisibleIds.includes(id)),
      );
    } else {
      // Add all visible ones to selection (avoiding duplicates)
      setSelectedIds((prev) =>
        Array.from(new Set([...prev, ...allVisibleIds])),
      );
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
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={isBulkDeleting}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 font-bold text-sm hover:bg-red-100 transition-all shadow-sm disabled:opacity-50"
              >
                {isBulkDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Eliminar ({selectedIds.length})
              </button>
            )}
            <button
              onClick={() => setShowBulkDialog(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <Upload className="w-4 h-4" />
              Carga Masiva
            </button>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Nueva Feature
            </button>
          </div>
        </div>

        {/* Search & Selection */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
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

          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 text-orange-600 font-bold text-xs hover:bg-orange-100 transition-all border border-orange-100"
            >
              {filteredFeatures &&
              filteredFeatures.length > 0 &&
              filteredFeatures.every((f) => selectedIds.includes(f._id))
                ? "Desmarcar Todos"
                : "Seleccionar Todos"}
            </button>
            {selectedIds.length > 0 && (
              <button
                onClick={() => setSelectedIds([])}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-400 font-bold text-xs hover:bg-gray-100 transition-all border border-gray-100"
              >
                Limpiar Selección
              </button>
            )}
          </div>
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
                onClick={() => toggleSelect(feature._id)}
                className={`group relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-white border transition-all duration-300 cursor-pointer ${
                  selectedIds.includes(feature._id)
                    ? "border-orange-500 shadow-xl shadow-orange-500/10 ring-2 ring-orange-500/20"
                    : "border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-100"
                }`}
              >
                {/* Selection indicator */}
                <div
                  className={`absolute top-4 left-4 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                    selectedIds.includes(feature._id)
                      ? "bg-orange-500 border-orange-500"
                      : "bg-white border-gray-200 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {selectedIds.includes(feature._id) && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center p-2.5 transition-transform duration-300 group-hover:scale-110 ${
                    selectedIds.includes(feature._id)
                      ? "bg-orange-100 border-orange-200"
                      : "bg-orange-50 border border-orange-100"
                  }`}
                >
                  {feature.iconUrl ? (
                    <img
                      src={feature.iconUrl}
                      alt={feature.name}
                      className="w-full h-full object-contain"
                    />
                  ) : feature.emoji ? (
                    <span className="text-3xl selection:bg-transparent">
                      {feature.emoji}
                    </span>
                  ) : (
                    <Sparkles className="w-6 h-6 text-orange-400" />
                  )}
                </div>
                {/* Name */}
                <h3 className="font-bold text-sm text-gray-900 text-center line-clamp-2 px-2">
                  <span className="mr-1">{feature.emoji}</span>
                  {feature.name || (
                    <span className="text-gray-300 italic">Sin nombre</span>
                  )}
                </h3>
                {/* Actions overlay */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingFeature(feature);
                      setEditName(feature.name);
                      setEditEmoji(feature.emoji || "");
                      setEditIconFile(null);
                    }}
                    className="p-2 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
                    title="Editar"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingFeature(feature);
                    }}
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
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <label className={labelClass}>Nombre</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={inputClass}
                  placeholder="Ej: Piscina"
                />
              </div>
              <div className="col-span-1">
                <label className={labelClass}>Emoji</label>
                <input
                  type="text"
                  value={newEmoji}
                  onChange={(e) => setNewEmoji(e.target.value)}
                  className={`${inputClass} text-center text-xl`}
                  placeholder=""
                  maxLength={2}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Icono SVG</label>
              <label className="flex flex-col items-center justify-center gap-2 w-full p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50/30 cursor-pointer transition-all">
                <input
                  type="file"
                  accept=".svg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file && !file.name.toLowerCase().endsWith(".svg")) {
                      sileo.error({ title: "El archivo debe ser .svg" });
                      return;
                    }
                    setNewIconFile(file);
                  }}
                />
                {newIconFile ? (
                  <div className="flex items-center gap-2 text-orange-700 font-bold text-sm">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-700 transition-all disabled:opacity-50"
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
              className="flex flex-col items-center justify-center gap-3 w-full p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50/30 cursor-pointer transition-all"
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
                    const files = Array.from(e.target.files).filter((f) =>
                      f.name.toLowerCase().endsWith(".svg"),
                    );
                    setBulkFiles(files);
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-700 transition-all disabled:opacity-50"
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
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <label className={labelClass}>Nombre</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="col-span-1">
                <label className={labelClass}>Emoji</label>
                <input
                  type="text"
                  value={editEmoji}
                  onChange={(e) => setEditEmoji(e.target.value)}
                  className={`${inputClass} text-center text-xl`}
                  maxLength={2}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>
                Icono SVG (Opcional, reemplaza el actual)
              </label>
              <label className="flex flex-col items-center justify-center gap-2 w-full p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50/30 cursor-pointer transition-all">
                <input
                  type="file"
                  accept=".svg"
                  className="hidden"
                  onChange={(e) => setEditIconFile(e.target.files?.[0] || null)}
                />
                {editIconFile ? (
                  <div className="flex items-center gap-2 text-orange-700 font-bold text-sm">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-700 transition-all disabled:opacity-50"
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
              className="bg-red-600! hover:bg-red-700! text-white rounded-xl"
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
