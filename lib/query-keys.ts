/**
 * Centralized query keys for React Query.
 *
 * Usage:
 *   queryKeys.properties.all        → ["properties"]
 *   queryKeys.properties.detail(id) → ["properties", id]
 *
 * Invalidation example:
 *   queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
 */
export const queryKeys = {
  properties: {
    all: ["properties"] as const,
    detail: (id: string) => ["properties", id] as const,
  },
  // Agrega más entidades aquí conforme crezca la app
  // users: {
  //   all: ["users"] as const,
  //   detail: (id: string) => ["users", id] as const,
  // },
} as const;
