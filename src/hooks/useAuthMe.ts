// hooks/useAuthMe.ts
import { authService } from "@/services/auth.service";
import { User } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";

export function useAuthMe() {
  const isClient = typeof window !== 'undefined';
  const hasToken = isClient ? !!localStorage.getItem("token") : false;

  return useQuery<User>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      // Check token sebelum fetch
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      
      console.log("useAuthMe: Fetching user data...");
      const userData = await authService.getCurrentUser();
      console.log("useAuthMe: User data fetched:", userData.name, userData.role_name);
      return userData;
    },
    retry: (failureCount, error: any) => {
      console.log("useAuthMe: Query failed, retry count:", failureCount, "Error:", error?.response?.status);
      // Jangan retry jika 401 (unauthorized) atau 403 (forbidden)
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      // Retry maksimal 1 kali untuk error lainnya
      return failureCount < 1;
    },
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    enabled: hasToken, // Hanya jalankan query jika ada token
  });
}