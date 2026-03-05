/**
 * Auth API functions.
 * These call /api/auth/* on the SAME Next.js domain, which are proxied
 * to the backend by app/api/auth/[...path]/route.ts.
 * This ensures Set-Cookie headers from the backend are set on the correct domain.
 *
 * Uses a dedicated axios instance (without baseURL) so requests go to
 * the local proxy instead of directly to the backend.
 */
import axios from "axios";
const authApi = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}
export interface LoginCredentials {
  email: string;
  password: string;
}
export interface AuthResponse {
  user: AuthUser;
}
/**
 * Login with email and password.
 * The backend sets session cookies automatically via the proxy.
 */
export async function login(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  const response = await authApi.post<AuthResponse>(
    "/api/auth/login",
    credentials,
  );
  return response.data;
}
/**
 * Logout the current user.
 * The backend clears the session cookies via the proxy.
 */
export async function logout(): Promise<void> {
  await authApi.post("/api/auth/sign-out");
}
/**
 * Get the current session/user from the backend.
 * Returns null if not authenticated.
 */
export async function getSession(): Promise<AuthUser | null> {
  try {
    const response = await authApi.get<{ user: AuthUser }>("/api/auth/session");
    return response.data?.user ?? null;
  } catch {
    return null;
  }
}
/**
 * Get the current authenticated user.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await authApi.get<AuthUser>("/api/auth/me");
    return response.data ?? null;
  } catch {
    return null;
  }
}
