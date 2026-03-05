import api from "@/lib/axios/client";
import type {
  FeatureCatalogItem,
  CreateFeaturePayload,
  UpdateFeaturePayload,
} from "../types/features.types";

export const fetchFeatures = async (): Promise<FeatureCatalogItem[]> => {
  const { data } = await api.get("/api/features");
  return data;
};

export const fetchFeatureById = async (
  id: string,
): Promise<FeatureCatalogItem> => {
  const { data } = await api.get(`/api/features/${id}`);
  return data;
};

export const createFeature = async (
  payload: CreateFeaturePayload,
): Promise<FeatureCatalogItem> => {
  const formData = new FormData();
  if (payload.name) formData.append("name", payload.name);
  if (payload.emoji) formData.append("emoji", payload.emoji);
  if (payload.icon) formData.append("icon", payload.icon);
  const { data } = await api.post("/api/features", formData);
  return data;
};

export const bulkUploadFeatures = async (
  files: File[],
): Promise<FeatureCatalogItem[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    // Ensure we only send .svg files and they have the correct filename
    if (file.name.toLowerCase().endsWith(".svg")) {
      formData.append("icons", file, file.name);
    }
  });
  const { data } = await api.post("/api/features/bulk", formData);
  return data;
};

export const updateFeature = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateFeaturePayload;
}): Promise<FeatureCatalogItem> => {
  const formData = new FormData();
  if (payload.name !== undefined) formData.append("name", payload.name);
  if (payload.emoji !== undefined) formData.append("emoji", payload.emoji);
  if (payload.icon) formData.append("icon", payload.icon);
  const { data } = await api.patch(`/api/features/${id}`, formData);
  return data;
};

export const deleteFeature = async (id: string): Promise<void> => {
  await api.delete(`/api/features/${id}`);
};
