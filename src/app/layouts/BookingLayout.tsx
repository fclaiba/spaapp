import { ArrowLeft } from "lucide-react";
import { Link, Outlet } from "react-router";

export function BookingLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-10">
      <header className="px-4 pt-4 sm:px-6">
        <div className="ux-shell flex items-center justify-between rounded-full border border-[var(--color-border-subtle)] bg-white/90 px-4 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-2xl sm:px-6">
          <div>
            <p
              className="text-sm font-semibold tracking-[0.2em] text-[var(--color-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              MEDALLO SPA
            </p>
          </div>
          <Link to="/" className="ux-btn-secondary">
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="ux-shell pt-8">
        <Outlet />
      </main>
    </div>
  );
}
