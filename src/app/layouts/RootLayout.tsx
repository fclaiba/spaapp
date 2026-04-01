import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export function RootLayout() {
  return (
    <div className="ux-page overflow-x-hidden font-[var(--font-body)]">
      <ScrollToTop />
      <Outlet />
    </div>
  );
}
