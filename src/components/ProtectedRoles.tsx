import { useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useAuthMe } from "@/hooks/useAuthMe";

// HOC untuk proteksi role
export function withRoleProtection<P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: string[]
) {
  return function ProtectedRoute(props: P) {
    const router = useRouter();
    const { data: user, isLoading } = useAuthMe();

    useEffect(() => {
      if (isLoading) return;

      if (!user) {
        router.replace("/auth/login");
        return;
      }

      // Menggunakan role_name string dari user
      const hasPermission = allowedRoles.includes(user.role);

      if (!hasPermission) {
        // Redirect to appropriate dashboard based on role instead of generic /dashboard
        const roleRedirects = {
          'system_admin': '/dashboard/owner',
         
          'student': '/dashboard/staff',
          'teacher': '/dashboard/owner'
        }

        const redirectPath = roleRedirects[user.role as keyof typeof roleRedirects]

        if (redirectPath) {
          router.replace(redirectPath);
        } else {
          // Unknown role, redirect to login
          localStorage.removeItem('token');
          router.replace("/auth/login");
        }
        return;
      }
    }, [isLoading, user, router]);

    // Loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      );
    }

    // Check access
    const hasPermission = user ? allowedRoles.includes(user.role) : false;

    if (!user || !hasPermission) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// Hook untuk permission check
export function usePermission(requiredRole: string | string[]): boolean {
  const { data: user } = useAuthMe();

  if (!user) return false;

  // Handle single role atau multiple roles
  return Array.isArray(requiredRole)
    ? requiredRole.includes(user.role)
    : user.role === requiredRole;
}