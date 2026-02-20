"use client";

import { useState, useEffect } from "react";
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
    currentPage,
    itemsPerPage,
    setSearch,
    setRegion,
    setCurrentPage,
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

  const isFiltering = region !== "all";

  const {
    data: propertiesData,
    isLoading,
    isRefetching,
  } = useProperties({
    page: isFiltering ? 1 : currentPage,
    limit: isFiltering ? 1000 : itemsPerPage,
    search,
  });

  const properties = propertiesData?.data || [];
  const serverTotal = propertiesData?.total || 0;

  // Filtrar por región y ordenar alfabéticamente
  const filteredProperties = [...properties]
    .filter((p) => {
      if (region === "all") return true;
      if (region === "Playa") {
        const loc = p.location.toLowerCase();
        return loc.includes("santa marta") || loc.includes("cartagena");
      }
      return p.location.toLowerCase().includes(region.toLowerCase());
    })
    .sort((a, b) => a.title.localeCompare(b.title, "es"));

  // Paginación: client-side cuando hay filtro, server-side cuando no
  const totalItems = isFiltering ? filteredProperties.length : serverTotal;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const currentProperties = isFiltering
    ? filteredProperties.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      )
    : filteredProperties;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
  };

  const totalProperties = totalItems;
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
    <div className="p-8 lg:p-12 space-y-10 bg-white min-h-[calc(100vh-4rem)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Propiedades
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Gestión y administración del catálogo de fincas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefetching}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-100 bg-white text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            Sincronizar
          </button>

          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-sm font-bold text-white hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            Nueva Finca
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="group rounded-3xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-emerald-500"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Activos
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-black text-gray-900 tracking-tighter">
              {totalProperties}
            </p>
            <p className="text-xs font-bold text-gray-400 capitalize">
              Fincas publicadas
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group rounded-3xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-500"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Capacidad
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-black text-gray-900 tracking-tighter">
              {totalCapacity}
            </p>
            <p className="text-xs font-bold text-gray-400 capitalize">
              Huéspedes totales
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="group rounded-3xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-amber-500"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6 text-amber-500" />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Calidad
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-gray-900 tracking-tighter">
                {avgRating}
              </p>
              <span className="text-sm font-bold text-gray-400">/ 5.0</span>
            </div>
            <p className="text-xs font-bold text-gray-400 capitalize">
              Rating promedio
            </p>
          </div>
        </motion.div>
      </div>

      {/* Search + Table Container */}
      <div className="rounded-[2rem] bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Search Bar Refined */}
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, ubicación, detalles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/30 transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-full md:w-[220px] bg-gray-50/50 border-gray-100 rounded-2xl h-[48px]! text-sm font-bold text-gray-600">
                <Filter className="w-4 h-4 text-gray-400 mr-2" />
                <SelectValue placeholder="Todas las regiones" />
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
                className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
                title="Limpiar filtros"
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

          {totalPages > 1 && (
            <Pagination className="w-auto mx-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className="cursor-pointer"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    aria-disabled={currentPage === 1}
                    style={{
                      pointerEvents: currentPage === 1 ? "none" : "auto",
                      opacity: currentPage === 1 ? 0.5 : 1,
                    }}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    if (
                      totalPages > 7 &&
                      page > 1 &&
                      page < totalPages &&
                      Math.abs(page - currentPage) > 1
                    ) {
                      if (Math.abs(page - currentPage) === 2) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          className="cursor-pointer"
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  },
                )}

                <PaginationItem>
                  <PaginationNext
                    className="cursor-pointer"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    aria-disabled={currentPage === totalPages}
                    style={{
                      pointerEvents:
                        currentPage === totalPages ? "none" : "auto",
                      opacity: currentPage === totalPages ? 0.5 : 1,
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
