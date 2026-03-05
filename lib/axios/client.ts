import axios from "axios";

const isServer = typeof window === "undefined";
const BACKEND_URL = "https://app.fincasya.cloud";

const api = axios.create({
  baseURL: isServer ? BACKEND_URL : "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Cuando enviamos FormData, eliminar el Content-Type para que el
    // navegador lo establezca automáticamente con el boundary correcto
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      let isAuthError = status === 401 || status === 403;
      if (
        status === 400 &&
        data &&
        typeof data.message === "string" &&
        data.message.includes("InvalidAuthHeader")
      ) {
        isAuthError = true;
      }
      if (isAuthError && !isServer) {
        const pathname = window.location.pathname;
        const isAdminPath = pathname.startsWith("/admin");

        if (isAdminPath && pathname !== "/admin/login") {
          // Intentar limpiar el store de autenticación si estamos en el cliente
          // Esto ayuda a evitar bucles si el estado local se quedó "pegado"
          try {
            // Importación dinámica para evitar ciclos de dependencia
            import("@/features/auth/store/auth.store").then((mod) => {
              mod.useAuthStore.getState().clearUser();
            });
          } catch (e) {
            console.error("Error clearing auth store:", e);
          }

          window.location.href = `/admin/login?callbackUrl=${encodeURIComponent(pathname)}`;
        }
      }
      // Manejo de errores HTTP
      switch (status) {
        case 401:
          break;
        case 403:
          break;
        case 404:
          break;
        case 500:
          break;
        default:
      }
    } else if (error.request) {
    }
    return Promise.reject(error);
  },
);

export default api;
