"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  ChevronLeft,
  LogOut,
  Brain,
  MessageSquare,
} from "lucide-react";
import { useEffect } from "react";
import { sileo } from "sileo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { logout, getSession } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";

const navItems = [
  {
    label: "Propiedades",
    href: "/admin/properties",
    icon: Building2,
  },
  {
    label: "Base de Conocimiento",
    href: "/admin/knowledge",
    icon: Brain,
  },
  {
    label: "Conversaciones",
    href: "/admin/conversations",
    icon: MessageSquare,
  },
];

function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, clearUser } = useAuthStore();
  // Load session on mount if not already in store
  useEffect(() => {
    if (!user) {
      getSession().then((sessionUser) => {
        if (sessionUser) setUser(sessionUser);
      });
    }
  }, [user, setUser]);
  async function handleLogout() {
    try {
      await logout();
      clearUser();
      sileo.success({ title: "Sesión cerrada correctamente" });
      router.push("/admin/login");
    } catch {
      sileo.error({ title: "Error al cerrar sesión" });
    }
  }

  // Get user initials for avatar
  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : (user?.email?.[0]?.toUpperCase() ?? "AD");

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-zinc-200 bg-zinc-100"
    >
      {/* Header */}
      <SidebarHeader className="p-4 border-b border-zinc-200/50 bg-transparent">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              asChild
              tooltip="FincasYa Admin"
              className="hover:bg-transparent"
            >
              <Link href="/admin/properties">
                <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-orange-50 overflow-hidden shadow-inner">
                  <Image
                    src="/favicon.png"
                    alt="FincasYa"
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <span className="truncate font-bold text-gray-900">
                    FincasYa
                  </span>
                  <span className="truncate text-[10px] font-medium text-gray-400 uppercase tracking-tighter">
                    Dashboard Admin
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* Navigation */}
      <SidebarContent className="px-2 py-4 bg-transparent">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">
            Gestión de Plataforma
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={`
                        h-10 px-4 rounded-xl transition-all duration-200
                        ${
                          isActive
                            ? "bg-primary! text-white! font-bold shadow-md shadow-primary/20"
                            : "text-gray-500 hover:bg-gray-200/50 hover:text-gray-900"
                        }
                      `}
                    >
                      <Link href={item.href}>
                        <item.icon
                          className={`w-4 h-4 ${isActive ? "text-white!" : "text-gray-400"}`}
                        />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-zinc-200/50 bg-transparent space-y-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Volver al sitio"
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
            >
              <Link href="/">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Sitio Web</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Cerrar Sesión"
              className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : (user?.email?.[0]?.toUpperCase() ?? "AD");
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-white relative">
        {/* Aesthetic Background Elements - Contained to avoid horizontal overflow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-100/20 rounded-full blur-[100px]" />
        </div>
        {!pathname.startsWith("/admin/conversations") && (
          <header className="flex h-14 md:h-[60.4px] shrink-0 items-center justify-between gap-2 border-b border-gray-100 bg-white/40 backdrop-blur-md px-4 md:px-6 sticky top-0 z-10">
            <div className="flex items-center gap-3 md:gap-4">
              <SidebarTrigger className="-ml-1 text-gray-400 hover:text-gray-900 transition-colors" />
              <div className="h-4 w-px bg-gray-100" />
              <div className="flex flex-col">
                <span className="text-sm md:text-base font-bold text-gray-900 tracking-tight whitespace-nowrap">
                  Panel Admin
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-semibold text-gray-700 leading-none">
                    {user.name || "Administrador"}
                  </span>
                  <span className="text-[10px] text-gray-400 leading-none mt-0.5">
                    {user.email}
                  </span>
                </div>
              )}
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[9px] md:text-[10px] font-bold text-orange-500 uppercase shadow-sm">
                {initials}
              </div>
            </div>
          </header>
        )}
        <div className="flex-1 bg-transparent relative z-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
