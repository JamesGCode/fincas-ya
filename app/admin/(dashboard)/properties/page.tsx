"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProperties } from "@/hooks/use-properties";
import { usePropertiesStore } from "@/hooks/use-properties-store";
import { PropertiesTable } from "@/components/admin/properties-table";
import {
  Building2,
  Search,
  RefreshCw,
  Users,
  Star,
  Filter,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PropertiesPage() {
  const [isMounted, setIsMounted] = useState(false);
  const {
    search,
    region,
    itemsPerPage,
    setSearch,
    setRegion,
    setItemsPerPage,
  } = usePropertiesStore();

  const queryClient = useQueryClient();

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const REGIONS = [
    { value: "all", label: "Todas las regiones" },
    { value: "Melgar", label: "Melgar" },
    { value: "Villavicencio", label: "Villavicencio" },
    { value: "Anapoima", label: "Anapoima" },
    { value: "Villeta", label: "Villeta" },
    { value: "Playa", label: "Destinos de Playa" },
  ];

  // API returns all properties at once — do client-side pagination
  const [pageIndex, setPageIndex] = useState(0);

  const {
    data: propertiesData,
    isLoading,
    isRefetching,
  } = useProperties({
    location: region !== "all" ? region : undefined,
  });

  const properties = propertiesData?.properties || propertiesData?.data || [];

  // Client-side search + sort
  const filteredProperties = [...properties]
    .filter((p) => {
      if (!search) return true;
      return p.title.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => a.title.localeCompare(b.title, "es"));

  // Client-side pagination slice
  const pageStart = pageIndex * itemsPerPage;
  const currentProperties = filteredProperties.slice(
    pageStart,
    pageStart + itemsPerPage,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProperties.length / itemsPerPage),
  );
  const hasPrev = pageIndex > 0;
  const hasNext = pageIndex < totalPages - 1;

  const goNext = () => {
    if (hasNext) setPageIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (hasPrev) setPageIndex((i) => i - 1);
  };

  // Reset to page 0 when region or itemsPerPage changes
  useEffect(() => {
    setPageIndex(0);
  }, [region, itemsPerPage, search]);

  const router = useRouter();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
  };

  const totalProperties = propertiesData?.total ?? properties.length;
  const totalCapacity = properties.reduce((sum, p) => sum + p.capacity, 0) || 0;
  const avgRating = properties.length
    ? (
        properties.reduce((sum, p) => sum + p.rating, 0) / properties.length
      ).toFixed(1)
    : "0";

  if (!isMounted) {
    return null; // O un skeleton de carga completa si se prefiere
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-6 md:space-y-10 bg-transparent min-h-[calc(100vh-4rem)] relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-linear-to-br from-gray-900 via-gray-800 to-gray-500 bg-clip-text text-transparent">
            Propiedades
          </h1>
          <p className="text-[10px] md:text-sm text-gray-500 mt-1 font-bold uppercase tracking-wider opacity-60">
            Catálogo Maestro de Fincas
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefetching}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-gray-100 bg-white/60 backdrop-blur-sm text-xs md:text-sm font-bold text-gray-600 hover:bg-white hover:text-gray-900 shadow-sm transition-all disabled:opacity-50 active:scale-95"
          >
            <RefreshCw
              className={`w-3 h-3 md:w-4 md:h-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            <span className="hidden xs:inline">Sincronizar</span>
            <span className="xs:hidden">Sinc.</span>
          </button>

          <button
            onClick={() => router.push("/admin/properties/new")}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-gray-900 text-xs md:text-sm font-black text-white hover:bg-black shadow-xl shadow-gray-200 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden xs:inline">Nueva Finca</span>
            <span className="xs:hidden">Nueva</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          className="group rounded-3xl md:rounded-[32px] bg-linear-to-br from-white to-emerald-50/30 border border-emerald-100/50 p-6 md:p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all cursor-default"
        >
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Building2 className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <span className="text-[9px] md:text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 md:px-3 py-1 md:py-1.5 rounded-full uppercase tracking-widest border border-emerald-100">
              Activos
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">
              {totalProperties}
            </p>
            <p className="text-[9px] md:text-xs font-black text-emerald-600/60 uppercase tracking-widest">
              Fincas publicadas
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -5 }}
          className="group rounded-3xl md:rounded-[32px] bg-linear-to-br from-white to-blue-50/30 border border-blue-100/50 p-6 md:p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all cursor-default"
        >
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Users className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <span className="text-[9px] md:text-[10px] font-black text-blue-600 bg-blue-50 px-2 md:px-3 py-1 md:py-1.5 rounded-full uppercase tracking-widest border border-blue-100">
              Carga
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">
              {totalCapacity}
            </p>
            <p className="text-[9px] md:text-xs font-black text-blue-600/60 uppercase tracking-widest">
              Huéspedes totales
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5 }}
          className="group rounded-3xl md:rounded-[32px] bg-linear-to-br from-white to-amber-50/30 border border-amber-100/50 p-6 md:p-8 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all cursor-default"
        >
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Star className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <span className="text-[9px] md:text-[10px] font-black text-amber-600 bg-amber-50 px-2 md:px-3 py-1 md:py-1.5 rounded-full uppercase tracking-widest border border-amber-100">
              Rating
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">
                {avgRating}
              </p>
              <span className="text-xs md:text-sm font-black text-amber-500/60 tracking-widest uppercase">
                Estrellas
              </span>
            </div>
            <p className="text-[9px] md:text-xs font-black text-amber-600/60 uppercase tracking-widest">
              Calidad promedio
            </p>
          </div>
        </motion.div>
      </div> */}

      {/* Search + Table Container */}
      <div className="rounded-[2rem] bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Search Bar Refined */}
        <div className="p-4 md:p-6 border-b border-gray-50 flex flex-col md:flex-row items-center gap-3 md:gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, ubicación..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl md:rounded-2xl pl-11 pr-4 py-2.5 md:py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/30 transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-full md:w-[220px] bg-gray-50/50 border-gray-100 rounded-xl md:rounded-2xl h-[44px] md:h-[48px]! text-sm font-bold text-gray-600">
                <Filter className="w-4 h-4 text-gray-400 mr-2" />
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                {REGIONS.map((r) => (
                  <SelectItem
                    key={r.value}
                    value={r.value}
                    className="text-sm font-medium"
                  >
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(search || region !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setRegion("all");
                }}
                className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
                title="Limpiar"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <PropertiesTable
          properties={currentProperties || []}
          isLoading={isLoading}
        />

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Mostrar</span>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(v) => setItemsPerPage(Number(v))}
            >
              <SelectTrigger className="w-[72px] h-8 text-xs bg-gray-50 border-gray-200 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>por página</span>
          </div>

          {(hasPrev || hasNext) && (
            <Pagination className="w-auto mx-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className="cursor-pointer"
                    onClick={goPrev}
                    aria-disabled={!hasPrev}
                    style={{
                      pointerEvents: !hasPrev ? "none" : "auto",
                      opacity: !hasPrev ? 0.5 : 1,
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-3 py-1.5 text-xs font-bold text-gray-500">
                    Pág. {pageIndex + 1} / {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    className="cursor-pointer"
                    onClick={goNext}
                    aria-disabled={!hasNext}
                    style={{
                      pointerEvents: !hasNext ? "none" : "auto",
                      opacity: !hasNext ? 0.5 : 1,
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
