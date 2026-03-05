"use client";

import { useState } from "react";
import { Search, ListChecks, Plus, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FeatureCatalogItem } from "../types/features.types";

interface FeaturePickerProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
  catalog: FeatureCatalogItem[];
  isLoading?: boolean;
}

export function FeaturePicker({
  selectedIds,
  onToggle,
  catalog,
  isLoading,
}: FeaturePickerProps) {
  const [search, setSearch] = useState("");

  const filteredCatalog = catalog.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedFeatures = catalog.filter((item) =>
    selectedIds.includes(item._id),
  );

  return (
    <div className="space-y-4">
      {/* Selected Features Summary */}
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {selectedFeatures.length === 0 ? (
          <p className="text-sm text-gray-400 italic py-2 px-1">
            No hay características seleccionadas aún.
          </p>
        ) : (
          selectedFeatures.map((feature) => (
            <div
              key={feature._id}
              className="group relative flex flex-col items-center justify-center p-2 rounded-xl border border-orange-100 bg-orange-50/30 text-orange-700 min-w-[70px] transition-all hover:bg-orange-50 animate-in fade-in zoom-in-95 duration-200"
            >
              <button
                type="button"
                onClick={() => onToggle(feature._id)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white border border-orange-100 text-orange-500 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-100"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1.5 mb-1 shadow-xs ring-1 ring-orange-100/50 overflow-hidden">
                {feature.iconUrl ? (
                  <img
                    src={feature.iconUrl}
                    alt={feature.name}
                    className="w-full h-full object-contain"
                  />
                ) : feature.emoji ? (
                  <span className="text-xl selection:bg-transparent">
                    {feature.emoji}
                  </span>
                ) : (
                  <div className="w-full h-full bg-orange-50" />
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-center leading-tight truncate w-full px-1">
                {feature.name}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Main Trigger Button */}
      <Dialog onOpenChange={(open) => !open && setSearch("")}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 rounded-2xl border-2 border-dashed border-gray-100 hover:border-orange-200 hover:bg-orange-50/10 text-gray-400 hover:text-orange-600 transition-all group"
            disabled={isLoading}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gray-50 group-hover:bg-orange-100 transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-black text-[11px] uppercase tracking-widest">
                Gestionar Amenidades ({selectedIds.length})
              </span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
          <DialogHeader className="bg-linear-to-br from-orange-600/80 to-orange-500/80 p-8">
            <DialogTitle className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
                <ListChecks className="w-6 h-6" />
              </div>
              Seleccionar Amenidades
            </DialogTitle>
            <div className="mt-4 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-white transition-colors" />
              <Input
                placeholder="Buscar por nombre (ej: Piscina, Wifi, Jacuzzi...)"
                className="pl-11 h-12 bg-orange-200 border-white text-white rounded-2xl focus-visible:ring-orange-50 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] p-8">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-28 rounded-2xl bg-gray-50 animate-pulse border border-gray-100"
                  />
                ))}
              </div>
            ) : filteredCatalog.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredCatalog.map((feature) => {
                  const isSelected = selectedIds.includes(feature._id);
                  return (
                    <button
                      key={feature._id}
                      type="button"
                      onClick={() => onToggle(feature._id)}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-300 text-center gap-2 group
                        ${
                          isSelected
                            ? "bg-orange-50/50 border-orange-200 text-orange-700 shadow-lg shadow-orange-500/5 scale-100"
                            : "bg-white border-gray-100 text-gray-500 hover:border-orange-100 hover:bg-orange-50/20 hover:text-orange-600 hover:scale-[1.02]"
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md animate-in zoom-in-50 duration-200">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center p-2.5 transition-all duration-500 overflow-hidden
                        ${isSelected ? "bg-orange-100/50 shadow-inner" : "bg-gray-50 group-hover:bg-white group-hover:shadow-sm"}
                      `}
                      >
                        {feature.iconUrl ? (
                          <img
                            src={feature.iconUrl}
                            alt={feature.name}
                            className="w-full h-full object-contain"
                          />
                        ) : feature.emoji ? (
                          <span className="text-2xl selection:bg-transparent">
                            {feature.emoji}
                          </span>
                        ) : (
                          <div className="w-full h-full bg-orange-50/20" />
                        )}
                      </div>
                      <span className="font-black text-[10px] uppercase tracking-wider leading-tight">
                        {feature.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 text-gray-300">
                  <Search className="w-8 h-8" />
                </div>
                <p className="font-black text-gray-400 uppercase tracking-widest text-xs">
                  No se encontraron resultados para "{search}"
                </p>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-4 text-orange-500 font-bold text-sm hover:underline"
                >
                  Limpiar búsqueda
                </button>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
