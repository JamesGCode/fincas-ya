"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Shield,
  User as UserIcon,
  Trash2,
  Pencil,
  Loader2,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Lock,
  UserPlus,
} from "lucide-react";
import {
  getUsers,
  updateUser,
  deleteUser,
  createUser,
  User,
} from "../api/users.api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sileo } from "sileo";

interface UserManagementProps {
  searchTerm?: string;
  refreshKey?: number;
  onOpenCreate?: (fn: () => void) => void;
}

export function UserManagement({
  searchTerm = "",
  refreshKey = 0,
  onOpenCreate,
}: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      sileo.error({ title: "Error al cargar usuarios" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshKey]);

  // Expose open create dialog to parent
  useEffect(() => {
    if (onOpenCreate) {
      onOpenCreate(() => setShowCreateDialog(true));
    }
  }, [onOpenCreate]);

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsUpdating(true);
    try {
      const formData = new FormData(e.currentTarget);
      await updateUser(editingUser.id, {
        name: formData.get("name") as string,
        role: formData.get("role") as User["role"],
        phone: formData.get("phone") as string,
        position: formData.get("position") as string,
        documentId: formData.get("documentId") as string,
      });
      sileo.success({ title: "Usuario actualizado correctamente" });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error(error);
      sileo.error({ title: "Error al actualizar usuario" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createUser({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        role: formData.get("role") as User["role"],
        phone: (formData.get("phone") as string) || undefined,
        position: (formData.get("position") as string) || undefined,
        documentId: (formData.get("documentId") as string) || undefined,
      });
      sileo.success({ title: "Usuario creado correctamente" });
      setShowCreateDialog(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      sileo.error({ title: "Error al crear usuario" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    try {
      await deleteUser(deletingUser.id);
      sileo.success({ title: "Usuario eliminado correctamente" });
      setDeletingUser(null);
      fetchUsers();
    } catch (error) {
      console.error(error);
      sileo.error({ title: "Error al eliminar usuario" });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getRoleBadge = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return (
          <span className="text-[9px] font-black text-white bg-orange-500 px-2 py-0.5 rounded-full tracking-widest uppercase shadow-sm shadow-orange-200">
            Admin
          </span>
        );
      case "editor":
        return (
          <span className="text-[9px] font-black text-white bg-blue-500 px-2 py-0.5 rounded-full tracking-widest uppercase shadow-sm shadow-blue-200">
            Editor
          </span>
        );
      case "owner":
        return (
          <span className="text-[9px] font-black text-white bg-emerald-500 px-2 py-0.5 rounded-full tracking-widest uppercase shadow-sm shadow-emerald-200">
            Dueño
          </span>
        );
      default:
        return (
          <span className="text-[9px] font-black text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full tracking-widest uppercase ring-1 ring-gray-200">
            Usuario
          </span>
        );
    }
  };

  // Skeleton
  if (isLoading && users.length === 0) {
    return (
      <div className="divide-y divide-gray-50">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 md:px-8 py-6">
            <div className="w-12 h-12 rounded-full bg-gray-100 animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-32 bg-gray-50 rounded animate-pulse" />
            </div>
            <div className="hidden md:block h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
            <div className="hidden md:block h-4 w-28 bg-gray-100 rounded animate-pulse" />
            <div className="hidden md:flex gap-2 mr-2">
              <div className="w-10 h-10 bg-gray-100 rounded-2xl animate-pulse" />
              <div className="w-10 h-10 bg-gray-100 rounded-2xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (filteredUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <Users className="w-7 h-7 text-gray-300" />
        </div>
        <p className="text-gray-500 text-sm font-medium">
          No se encontraron usuarios
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Intenta con otro término de búsqueda
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-[64px_2fr_1.5fr_1.5fr_100px] gap-4 px-8 py-5 bg-linear-to-r from-gray-50/50 via-gray-50/30 to-transparent border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
        <span>Perfil</span>
        <span>Nombre & Email</span>
        <span>Rol & Cargo</span>
        <span>Documento & Teléfono</span>
        <span className="text-right pr-4">Acciones</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50/50">
        {filteredUsers.map((user) => (
          <div
            key={user.id || (user as any)._id || user.email}
            className="flex flex-col md:grid md:grid-cols-[64px_2fr_1.5fr_1.5fr_100px] gap-4 md:gap-4 items-start md:items-center px-6 md:px-8 py-6 hover:bg-orange-50/30 transition-all group relative border-l-4 border-l-transparent hover:border-l-orange-500"
          >
            {/* ── Mobile: top row ── */}
            <div className="flex w-full md:hidden gap-4 items-center mb-1">
              <div className="w-12 h-12 rounded-full shrink-0 bg-gray-100 text-gray-600 font-black text-sm uppercase flex items-center justify-center shadow-sm ring-1 ring-gray-100">
                {user.name?.charAt(0) || user.email.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-black text-sm text-gray-900 truncate block tracking-tight leading-tight">
                  {user.name || "Sin nombre"}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  {getRoleBadge(user.role)}
                </div>
              </div>
              <button
                onClick={() => setEditingUser(user)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-orange-500 bg-orange-50 shadow-sm active:scale-95 shrink-0"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            {/* ── Desktop: Avatar ── */}
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 hidden md:flex items-center justify-center font-black text-base uppercase bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors duration-300">
              {user.name?.charAt(0) || user.email.charAt(0)}
            </div>

            {/* ── Name & Email ── */}
            <div className="min-w-0 hidden md:block">
              <span className="font-black text-sm text-gray-900 truncate group-hover:text-orange-600 transition-colors block tracking-tight">
                {user.name || "Sin nombre"}
              </span>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>

            {/* ── Role & Position ── */}
            <div className="flex flex-col gap-1 w-full md:w-auto mt-1 md:mt-0">
              {/* email shown on mobile only */}
              <div className="flex md:hidden items-center gap-1.5 text-xs text-gray-400 mb-1">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="hidden md:flex">{getRoleBadge(user.role)}</div>
              {user.position && (
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                  {user.position}
                </span>
              )}
            </div>

            {/* ── Document & Phone ── */}
            <div className="flex flex-row md:flex-col justify-between md:justify-start gap-3 md:gap-1 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t border-gray-100 md:border-none">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 group-hover:bg-white ring-1 ring-gray-100 transition-colors text-xs font-bold text-gray-700 w-fit">
                <Shield className="w-3.5 h-3.5 text-gray-400" />
                <span>{user.documentId || "Sin doc."}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <Phone className="w-3.5 h-3.5" />
                  {user.phone}
                </div>
              )}
            </div>

            {/* ── Desktop Actions ── */}
            <div className="hidden md:flex justify-end gap-2 pr-2">
              <button
                onClick={() => setEditingUser(user)}
                className="w-11 h-11 flex items-center justify-center rounded-2xl text-gray-400 hover:text-white hover:bg-orange-500 transition-all opacity-0 group-hover:opacity-100 shadow-sm hover:shadow-lg hover:shadow-orange-200 active:scale-95"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDeletingUser(user)}
                className="w-11 h-11 flex items-center justify-center rounded-2xl text-gray-400 hover:text-white hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-sm hover:shadow-lg hover:shadow-red-200 active:scale-95 cursor-pointer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Create User Dialog ── */}
      <Dialog
        open={showCreateDialog}
        onOpenChange={(open) => !open && setShowCreateDialog(false)}
      >
        <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
          <form onSubmit={handleCreateUser}>
            <div className="bg-indigo-600 p-8 text-white relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <UserPlus className="w-32 h-32" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight relative z-10">
                  Crear Usuario
                </DialogTitle>
                <DialogDescription className="text-indigo-100 opacity-90 font-medium relative z-10">
                  Completa los datos para crear un nuevo acceso al sistema.
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="p-8 space-y-5 bg-white">
              <div className="grid grid-cols-2 gap-5">
                {/* Name */}
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <UserIcon className="w-3 h-3" /> Nombre Completo *
                  </label>
                  <Input
                    name="name"
                    required
                    placeholder="Ej. Juan Pérez"
                    className="border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white h-11"
                  />
                </div>
                {/* Email */}
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Correo Electrónico *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    required
                    placeholder="usuario@ejemplo.com"
                    className="border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white h-11"
                  />
                </div>
                {/* Password */}
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Contraseña *
                  </label>
                  <Input
                    name="password"
                    type="password"
                    required
                    placeholder="Mínimo 6 caracteres"
                    className="border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white h-11"
                  />
                </div>
                {/* Role */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-3 h-3" /> Rol *
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      defaultValue="user"
                      className="w-full h-11 border border-gray-100 bg-gray-50/50 rounded-xl px-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all appearance-none cursor-pointer text-gray-900 font-medium"
                    >
                      <option value="admin">Administrador</option>
                      <option value="editor">Editor</option>
                      <option value="owner">Dueño</option>
                      <option value="user">Usuario</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Position */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" /> Cargo
                  </label>
                  <Input
                    name="position"
                    placeholder="Ej. Gerente"
                    className="border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white h-11"
                  />
                </div>
                {/* Document */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-3 h-3" /> Documento
                  </label>
                  <Input
                    name="documentId"
                    placeholder="Ej. 1234567890"
                    className="border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white h-11"
                  />
                </div>
                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Phone className="w-3 h-3" /> Teléfono
                  </label>
                  <Input
                    name="phone"
                    placeholder="Ej. 3001234567"
                    className="border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white h-11"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="p-8 bg-gray-50/50 border-t border-gray-100 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="rounded-xl border-gray-200 font-bold h-11 px-6"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold h-11 px-8 shadow-lg shadow-indigo-200 active:scale-95"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Usuario"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ── */}
      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      >
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
          <form onSubmit={handleUpdateUser}>
            <div className="bg-orange-500 p-8 text-white relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Shield className="w-32 h-32" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight relative z-10">
                  Editar Usuario
                </DialogTitle>
                <DialogDescription className="text-orange-100 opacity-90 font-medium relative z-10">
                  Permisos de acceso para <strong>{editingUser?.email}</strong>.
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="p-8 space-y-5 bg-white">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <UserIcon className="w-3 h-3" /> Nombre Completo
                  </label>
                  <Input
                    name="name"
                    defaultValue={editingUser?.name}
                    className="border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-3 h-3" /> Rol
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      defaultValue={editingUser?.role}
                      className="w-full h-11 border border-gray-100 bg-gray-50/50 rounded-xl px-3 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all appearance-none cursor-pointer text-gray-900 font-medium"
                    >
                      <option value="admin">Administrador</option>
                      <option value="editor">Editor</option>
                      <option value="owner">Dueño</option>
                      <option value="user">Usuario</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" /> Cargo
                  </label>
                  <Input
                    name="position"
                    defaultValue={editingUser?.position}
                    className="border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-3 h-3" /> Documento
                  </label>
                  <Input
                    name="documentId"
                    defaultValue={editingUser?.documentId}
                    className="border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Phone className="w-3 h-3" /> Teléfono
                  </label>
                  <Input
                    name="phone"
                    defaultValue={editingUser?.phone}
                    className="border-gray-100 bg-gray-50/50 rounded-xl focus:bg-white h-11"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="p-8 bg-gray-50/50 border-t border-gray-100 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingUser(null)}
                className="rounded-xl border-gray-200 font-bold h-11 px-6"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold h-11 px-8 shadow-lg shadow-orange-200 active:scale-95"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete AlertDialog ── */}
      <AlertDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
      >
        <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-8">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6 ring-8 ring-red-50/50">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tight">
              ¿Eliminar acceso?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 mt-2 font-medium">
              Se revocará el acceso de{" "}
              <strong className="text-gray-900">{deletingUser?.email}</strong>.
              Esta acción puede revertirse luego si es necesario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="rounded-xl border-gray-200 font-bold h-11 px-6">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteUser();
              }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold h-11 px-8 shadow-lg shadow-red-100 active:scale-95"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Sí, eliminar acceso"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
