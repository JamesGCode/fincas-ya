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
} from "lucide-react";
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
    <div className="p-6 md:p-8 lg:p-10 space-y-8 bg-gray-50/50 min-h-[calc(100vh-3.5rem)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Gestión de Propiedades
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra todas las fincas y propiedades del catálogo
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefetching}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
          />
          Actualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Propiedades
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalProperties}</p>
        </div>

        <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Capacidad Total
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalCapacity}</p>
        </div>

        <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Rating Promedio
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-3xl font-bold text-gray-900">{avgRating}</p>
            <span className="text-sm text-gray-400">/ 5.0</span>
          </div>
        </div>
      </div>

      {/* Search + Table */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o ubicación..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-[200px] bg-gray-50 border-gray-200 rounded-lg h-[42px] text-sm">
                <Filter className="w-4 h-4 text-gray-400 mr-1" />
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(search || region !== "all") && (
              <span className="text-xs text-gray-400">
                {currentProperties.length} resultados
              </span>
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
