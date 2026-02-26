import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";

// ---------- Types matching REAL API responses ----------

/**
 * Image item with id+url — returned by GET /api/fincas/:id as "imageItems"
 * Used for delete operations where we need the imageId.
 */
export interface PropertyImageItem {
  id: string;
  url: string;
}

export interface PricingRule {
  nombre: string;
  fechaDesde: string;
  fechaHasta: string;
  valorUnico: number;
  activa: boolean;
}

export interface Catalog {
  _id: string;
  id?: string;
  name: string;
  isDefault: boolean;
  order: number;
  whatsappCatalogId?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Mirrors the actual API response from GET /api/fincas and GET /api/fincas/:id.
 *
 * List endpoint shape: { hasMore, properties: PropertyResponse[] }
 * Detail shape: PropertyResponse directly
 *
 * Key notes:
 * - `_id`       — Convex document ID (used everywhere as the property id)
 * - `images`    — plain string[] (CDN URLs) — used by display components
 * - `imageItems`— [{id, url}] — only present in the detail endpoint; used to delete by id
 * - Coordinates — flat `lat` / `lng` fields (not nested)
 * - Prices      — flat `priceBase` / `priceBaja` / `priceMedia` / `priceAlta`
 */
export interface PropertyResponse {
  _id: string;
  /** Always populated by normalizeProperty() from _id */
  id: string;
  title: string;
  description: string;
  location: string;
  capacity: number;
  category?: string;
  type?: string;
  code?: string;
  // Fixed seasonal prices (optional)
  priceBase?: number;
  priceBaja?: number;
  priceMedia?: number;
  priceAlta?: number;
  // Dynamic rules
  pricing?: PricingRule[];
  // Shortcut for display (always populated by normalizeProperty)
  price: number;
  // Images: plain URLs from list & detail
  images: string[];
  // Image objects with ids — only in detail response
  imageItems?: PropertyImageItem[];
  features: string[];
  video?: string;
  // Flat coords
  lat?: number;
  lng?: number;
  catalogIds?: string[];
  // Legacy nested (some components read this)
  /** Always populated by normalizeProperty (defaults to {lat:0,lng:0}) */
  coordinates: { lat: number; lng: number };
  // Legacy nested prices (some components read this)
  seasonPrices?: {
    base: number;
    baja: number;
    media: number;
    alta: number;
    rules: PricingRule[];
  };
  rating: number;
  reviewsCount: number;
  isFavorite?: boolean;
  isNew?: boolean;
  createdAt?: number;
  updatedAt?: number;
  _creationTime?: number;
}

/** List endpoint response */
export interface PaginatedResponse<T> {
  hasMore: boolean;
  properties: T[];
  // nextCursor is present when the API evolves to support it
  nextCursor?: string | null;
  // The migrated code also may produce a .data field — keep for compat
  data?: T[];
  total?: number;
}

export interface PropertiesParams {
  limit?: number;
  location?: string;
  minCapacity?: number;
  type?: string;
  category?: string;
  maxPrice?: number;
  cursor?: string;
}

export interface UpdatePropertyPayload {
  title?: string;
  description?: string;
  location?: string;
  capacity?: number;
  price?: number;
  code?: string;
  type?: string;
  category?: string;
  priceBase?: number;
  priceBaja?: number;
  priceMedia?: number;
  priceAlta?: number;
  pricing?: PricingRule[];
  lat?: number;
  lng?: number;
  catalogIds?: string[];
  features?: string[];
  video?: string;
  images?: string[];
  imageItems?: PropertyImageItem[];
  coordinates?: { lat: number; lng: number };
  seasonPrices?: {
    base: number;
    baja: number;
    media: number;
    alta: number;
    rules: PricingRule[];
  };
  files?: File[];
  videoFile?: File;
}

// ---------- Helpers ----------

/**
 * Normalises any PropertyResponse so that:
 * - `.id` is always populated (falls back to `._id`)
 * - `.coordinates` is populated from flat lat/lng
 * - `.seasonPrices` is populated from flat price fields
 * - `.price` defaults to priceBase
 */
export function normalizeProperty(p: any): PropertyResponse {
  return {
    ...p,
    id: p._id || p.id,
    price: p.priceBase ?? 0,
    reviewsCount: p.reviewsCount ?? 0,
    coordinates:
      p.coordinates ??
      (p.lat !== undefined && p.lng !== undefined
        ? { lat: p.lat, lng: p.lng }
        : { lat: 0, lng: 0 }),
    seasonPrices: {
      base: p.priceBase ?? 0,
      baja: p.priceBaja ?? 0,
      media: p.priceMedia ?? 0,
      alta: p.priceAlta ?? 0,
      rules: p.pricing || [],
    },
  };
}

// ---------- API functions ----------

export const fetchProperties = async (
  params: PropertiesParams = {},
): Promise<PaginatedResponse<PropertyResponse>> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== "" && v !== undefined && v !== null,
    ),
  );
  const { data } = await api.get("/api/fincas", { params: cleanParams });
  // Normalise items
  if (data.properties) {
    data.properties = data.properties.map(normalizeProperty);
  }
  return data;
};

export const fetchProperty = async (id: string): Promise<PropertyResponse> => {
  const { data } = await api.get(`/api/fincas/${id}`);
  return normalizeProperty(data);
};

export const fetchCatalogs = async (): Promise<Catalog[]> => {
  const { data } = await api.get("/api/catalogs");
  return data;
};

const createProperty = async (
  payload: UpdatePropertyPayload,
): Promise<PropertyResponse> => {
  const formData = new FormData();

  if (payload.title) formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  if (payload.location) formData.append("location", payload.location);
  if (payload.capacity !== undefined)
    formData.append("capacity", String(payload.capacity));
  if (payload.code) formData.append("code", payload.code);
  if (payload.type) formData.append("type", payload.type);
  if (payload.category) formData.append("category", payload.category);

  if (payload.catalogIds && payload.catalogIds.length > 0) {
    payload.catalogIds.forEach((id) => formData.append("catalogIds", id));
  }

  // Pricing Rules
  if (payload.priceBase !== undefined)
    formData.append("priceBase", String(payload.priceBase));
  if (payload.priceBaja !== undefined)
    formData.append("priceBaja", String(payload.priceBaja));
  if (payload.priceMedia !== undefined)
    formData.append("priceMedia", String(payload.priceMedia));
  if (payload.priceAlta !== undefined)
    formData.append("priceAlta", String(payload.priceAlta));

  if (payload.pricing) {
    formData.append("pricing", JSON.stringify(payload.pricing));
  }

  // Flat coords
  const coords = payload.coordinates;
  const lat = payload.lat ?? coords?.lat;
  const lng = payload.lng ?? coords?.lng;
  if (lat !== undefined) formData.append("lat", String(lat));
  if (lng !== undefined) formData.append("lng", String(lng));

  if (payload.features) {
    payload.features.forEach((f) => formData.append("features", f));
  }

  if (payload.files) {
    payload.files.forEach((file) => formData.append("images", file));
  }

  const { data } = await api.post("/api/fincas", formData);
  return normalizeProperty(data);
};

const updateProperty = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdatePropertyPayload;
}): Promise<PropertyResponse> => {
  const formData = new FormData();

  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.description !== undefined)
    formData.append("description", payload.description);
  if (payload.location !== undefined)
    formData.append("location", payload.location);
  if (payload.capacity !== undefined)
    formData.append("capacity", String(payload.capacity));
  if (payload.code !== undefined) formData.append("code", payload.code);
  if (payload.type !== undefined) formData.append("type", payload.type);
  if (payload.category !== undefined)
    formData.append("category", payload.category);

  if (payload.catalogIds !== undefined) {
    payload.catalogIds.forEach((id) => formData.append("catalogIds", id));
  }

  // Pricing Rules
  if (payload.priceBase !== undefined)
    formData.append("priceBase", String(payload.priceBase));
  if (payload.priceBaja !== undefined)
    formData.append("priceBaja", String(payload.priceBaja));
  if (payload.priceMedia !== undefined)
    formData.append("priceMedia", String(payload.priceMedia));
  if (payload.priceAlta !== undefined)
    formData.append("priceAlta", String(payload.priceAlta));

  if (payload.pricing) {
    formData.append("pricing", JSON.stringify(payload.pricing));
  }

  const coords = payload.coordinates;
  const lat = payload.lat ?? coords?.lat;
  const lng = payload.lng ?? coords?.lng;
  if (lat !== undefined) formData.append("lat", String(lat));
  if (lng !== undefined) formData.append("lng", String(lng));

  if (payload.features) {
    payload.features.forEach((f) => formData.append("features", f));
  }

  if (payload.files && payload.files.length > 0) {
    payload.files.forEach((file) => formData.append("images", file));
  }

  const { data } = await api.put(`/api/fincas/${id}`, formData);
  return normalizeProperty(data);
};

const addPropertyImage = async ({
  id,
  file,
}: {
  id: string;
  file: File;
}): Promise<PropertyResponse> => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post(`/api/fincas/${id}/images`, formData);
  return normalizeProperty(data);
};

const deletePropertyImage = async ({
  imageId,
}: {
  imageId: string;
}): Promise<void> => {
  await api.delete(`/api/fincas/images/${imageId}`);
};

const uploadPropertyVideo = async ({
  id,
  videoFile,
}: {
  id: string;
  videoFile: File;
}): Promise<PropertyResponse> => {
  const formData = new FormData();
  formData.append("video", videoFile);
  const { data } = await api.post(`/api/fincas/${id}/video`, formData);
  return normalizeProperty(data);
};

const deletePropertyVideo = async ({ id }: { id: string }): Promise<void> => {
  await api.delete(`/api/fincas/${id}/video`);
};

const deleteProperty = async (id: string): Promise<void> => {
  await api.delete(`/api/fincas/${id}`);
};

// ---------- Hooks ----------

/** Retorna la lista de propiedades. `data.properties` contiene el array (o `data.data` por compat). */
export function useProperties(params: PropertiesParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.properties.all, params],
    queryFn: () => fetchProperties(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: () => fetchProperty(id),
    enabled: !!id,
  });
}

export function useCatalogs() {
  return useQuery({
    queryKey: ["catalogs"],
    queryFn: fetchCatalogs,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProperty,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.properties.detail(variables.id),
      });
    },
  });
}

export function useAddPropertyImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPropertyImage,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.properties.detail(variables.id),
      });
    },
  });
}

export function useDeletePropertyImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePropertyImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
    },
  });
}

export function useUploadPropertyVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadPropertyVideo,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.properties.detail(variables.id),
      });
    },
  });
}

export function useDeletePropertyVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePropertyVideo,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.properties.detail(variables.id),
      });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
    },
  });
}
