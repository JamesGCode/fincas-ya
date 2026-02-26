import axios from "axios";

const api = axios.create({
  baseURL: "https://app.fincasya.cloud",
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
      // Manejo de errores HTTP
      switch (error.response.status) {
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
          console.error("Error:", error.response.status);
      }
    } else if (error.request) {
      console.error("Error de red: no se recibió respuesta");
    }
    return Promise.reject(error);
  },
);

export default api;
