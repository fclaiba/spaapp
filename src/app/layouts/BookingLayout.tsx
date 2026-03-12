import { ArrowLeft } from "lucide-react";
import { Link, Outlet } from "react-router";

export function BookingLayout() {
  return (
    <div className="min-h-screen pb-10">
      <header className="px-4 pt-4 sm:px-6">
        <div className="ux-shell flex items-center justify-between rounded-full border border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.88)] px-4 py-3 shadow-[0_12px_32px_rgba(17,17,17,0.06)] backdrop-blur-md sm:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-primary)]">
              Aman Wellness
            </p>
            <p className="ux-caption">Reserva guiada en tres pasos</p>
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
