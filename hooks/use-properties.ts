import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type { Finca } from "@/lib/data";

// ---------- Types ----------
export interface PropertyResponse {
  id: string;
  title: string;
  description: string;
  location: string;
  capacity: number;
  price: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  features: string[];
  video?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  seasonPrices?: {
    base: number;
    baja: number;
    media: number;
    alta: number;
    especiales: number | null;
  };
  isFavorite?: boolean;
  isNew?: boolean;
}

export interface UpdatePropertyPayload {
  title?: string;
  description?: string;
  location?: string;
  capacity?: number;
  price?: number;
  images?: string[];
  files?: File[]; // Nuevas imágenes para subir
  features?: string[];
  video?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  seasonPrices?: {
    base: number;
    baja: number;
    media: number;
    alta: number;
    especiales: number | null;
  };
}

// ---------- API functions ----------
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PropertiesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const fetchProperties = async (
  params: PropertiesParams = {},
): Promise<PaginatedResponse<PropertyResponse>> => {
  const { data } = await api.get("/properties", { params });
  return data;
};

export const fetchProperty = async (id: string): Promise<PropertyResponse> => {
  const { data } = await api.get(`/properties/${id}`);
  return data;
};

const updateProperty = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdatePropertyPayload;
}): Promise<PropertyResponse> => {
  // Si hay archivos, primero subimos solo las imágenes con FormData
  if (payload.files && payload.files.length > 0) {
    const formData = new FormData();

    // Solo agregar archivos de imagen (como en Postman)
    payload.files.forEach((file) => {
      formData.append("images", file);
    });

    // No establecer Content-Type manualmente — el navegador lo hace automáticamente
    // incluyendo el boundary necesario para multipart/form-data
    await api.patch(`/properties/${id}`, formData);
  }

  // Enviar los demás campos como JSON (sin los files)
  const { files, ...jsonPayload } = payload;

  // Solo enviar si hay campos para actualizar además de las imágenes
  const hasOtherFields = Object.keys(jsonPayload).length > 0;
  if (hasOtherFields) {
    const { data } = await api.patch(`/properties/${id}`, jsonPayload);
    return data;
  }

  // Si solo se subieron archivos, obtener la data actualizada
  const { data } = await api.get(`/properties/${id}`);
  return data;
};

// ---------- Hooks ----------

/** Obtener todas las propiedades paginadas */
export function useProperties(params: PropertiesParams = {}) {
  return useQuery({
    queryKey: [queryKeys.properties.all, params],
    queryFn: () => fetchProperties(params),
    placeholderData: (previousData) => previousData,
  });
}

/** Obtener una propiedad por ID */
export function useProperty(id: string) {
  return useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: () => fetchProperty(id),
    enabled: !!id,
  });
}

/** Mutation para actualizar una propiedad */
export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProperty,
    onSuccess: (_data, variables) => {
      // Invalidar la lista y el detalle
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.properties.detail(variables.id),
      });
    },
  });
}
