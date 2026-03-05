import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import { PropertiesParams } from "../types/fincas.types";
import {
  fetchProperties,
  fetchProperty,
  fetchCatalogs,
  createProperty,
  updateProperty,
  addPropertyImage,
  deletePropertyImage,
  uploadPropertyVideo,
  deletePropertyVideo,
  deleteProperty,
  linkPropertyFeature,
  unlinkPropertyFeature,
} from "../api/fincas.api";

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

export function useLinkPropertyFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: linkPropertyFeature,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.properties.detail(variables.id),
      });
    },
  });
}

export function useUnlinkPropertyFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unlinkPropertyFeature,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.properties.detail(variables.id),
      });
    },
  });
}
