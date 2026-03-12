import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <div className="ux-page overflow-x-hidden font-[var(--font-body)]">
      <Outlet />
    </div>
  );
}
