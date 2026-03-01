import axios from "axios";

const isServer = typeof window === "undefined";

const api = axios.create({
  baseURL: isServer
    ? process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    : "", // Use absolute URL on the server
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
        console.error("No autorizado o token expirado");
        if (window.location.pathname !== "/admin/login") {
          window.location.href = `/admin/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
        }
      }

      // Manejo de errores HTTP
      switch (status) {
        case 401:
          console.error("No autorizado");
          break;
        case 403:
          console.error("Acceso denegado");
          break;
        case 404:
          console.error("Recurso no encontrado");
          break;
        case 500:
          console.error("Error del servidor");
          break;
        default:
          console.error("Error:", status);
      }
    } else if (error.request) {
      console.error("Error de red: no se recibió respuesta");
    }
    return Promise.reject(error);
  },
);

export default api;
