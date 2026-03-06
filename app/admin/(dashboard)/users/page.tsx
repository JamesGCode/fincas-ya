"use client";

import { useState, useCallback, useRef } from "react";
import { UserManagement } from "@/features/admin/components/user-management";
import { Users, Search, RefreshCw, UserPlus } from "lucide-react";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const openCreateRef = useRef<() => void>(() => {});

  const handleOpenCreate = useCallback((fn: () => void) => {
    openCreateRef.current = fn;
  }, []);

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-6 md:space-y-10 bg-transparent min-h-[calc(100vh-4rem)] relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-linear-to-br from-gray-900 via-gray-800 to-gray-500 bg-clip-text text-transparent">
            Usuarios
          </h1>
          <p className="text-[10px] md:text-sm text-gray-500 mt-1 font-bold uppercase tracking-wider opacity-60">
            Gestión de Accesos a la Plataforma
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          {/* <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-gray-100 bg-white/60 backdrop-blur-sm text-xs md:text-sm font-bold text-gray-600 hover:bg-white hover:text-gray-900 shadow-sm transition-all active:scale-95"
          >
            <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
            <span>Sincronizar</span>
          </button> */}
          <button
            onClick={() => openCreateRef.current?.()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 active:scale-95"
          >
            <UserPlus className="w-3 h-3 md:w-4 md:h-4" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Search + Table Container */}
      <div className="rounded-[2rem] bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="p-4 md:p-6 border-b border-gray-50 flex flex-col md:flex-row items-center gap-3 md:gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl md:rounded-2xl pl-11 pr-4 py-2.5 md:py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/30 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 whitespace-nowrap">
            <Users className="w-3.5 h-3.5" />
            <span>Solo Admin</span>
          </div>
        </div>

        {/* User List */}
        <UserManagement
          searchTerm={search}
          refreshKey={refreshKey}
          onOpenCreate={handleOpenCreate}
        />
      </div>
    </div>
  );
}
