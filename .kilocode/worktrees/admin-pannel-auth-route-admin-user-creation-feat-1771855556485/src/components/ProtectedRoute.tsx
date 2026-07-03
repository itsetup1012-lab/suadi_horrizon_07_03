'use client';

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  console.log('🔐 [DEBUG] ProtectedRoute Check:', {
    path: pathname,
    isAuthenticated,
    willRedirect: !isAuthenticated
  });

  if (!isAuthenticated) {
    console.log('🚫 [DEBUG] ProtectedRoute: Authentication failed, redirecting to login');
    router.push("/login");
    return null;
  }

  console.log('✅ [DEBUG] ProtectedRoute: Access granted, rendering children');
  return <>{children}</>;
}
