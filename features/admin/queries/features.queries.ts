import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import {
  fetchFeatures,
  createFeature,
  bulkUploadFeatures,
  updateFeature,
  deleteFeature,
} from "../api/features.api";

export function useFeatures() {
  return useQuery({
    queryKey: queryKeys.features.all,
    queryFn: fetchFeatures,
  });
}

export function useCreateFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.features.all });
    },
  });
}

export function useBulkUploadFeatures() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkUploadFeatures,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.features.all });
    },
  });
}

export function useUpdateFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.features.all });
    },
  });
}

export function useDeleteFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.features.all });
    },
  });
}
