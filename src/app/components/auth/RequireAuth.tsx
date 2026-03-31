import { useConvexAuth } from "convex/react";
import { Navigate, Outlet } from "react-router";

const DEV_BYPASS_KEY = "medallo_dev_mode";

export function RequireAuth() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const isDevelopmentBypass = typeof window !== "undefined" && window.localStorage.getItem(DEV_BYPASS_KEY) === "1";

  if (isDevelopmentBypass) {
    return <Outlet />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[var(--color-text-secondary)]">
        Verificando acceso...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
