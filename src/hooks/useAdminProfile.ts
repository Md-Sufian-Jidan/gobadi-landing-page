import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getAdminProfile } from "@/services/adminAuth.service";

/**
 * Shared admin profile cache used by the Header and the Settings page, so a
 * profile update is reflected everywhere without a full page reload.
 */
export function useAdminProfile() {
  return useQuery({
    queryKey: queryKeys.adminProfile(),
    queryFn: async () => {
      const result = await getAdminProfile();
      if (!result.status) {
        throw new Error(result.message);
      }
      return result.data;
    },
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
