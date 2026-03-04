import api from "@/lib/axios/client";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "editor" | "owner";
  phone?: string;
  position?: string;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean; // We'll manage this via role or a separate field if found
}

export interface UpdateUserData {
  name?: string;
  role?: "admin" | "user" | "editor" | "owner";
  phone?: string;
  position?: string;
  documentId?: string;
  isActive?: boolean;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user" | "editor" | "owner";
  phone?: string;
  position?: string;
  documentId?: string;
}

/**
 * Get all registered users (Admin only)
 */
export async function getUsers(limit: number = 50): Promise<User[]> {
  const response = await api.get<User[]>(`/api/users?limit=${limit}`);
  return response.data;
}

/**
 * Create a new user (Admin only)
 */
export async function createUser(data: CreateUserData): Promise<User> {
  const response = await api.post<User>(`/api/users`, data);
  return response.data;
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User> {
  const response = await api.get<User>(`/api/users/${id}`);
  return response.data;
}

/**
 * Update user information or role
 */
export async function updateUser(
  id: string,
  data: UpdateUserData,
): Promise<User> {
  const response = await api.put<User>(`/api/users/${id}`, data);
  return response.data;
}

/**
 * Delete a user permanently
 */
export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/api/users/${id}`);
}
