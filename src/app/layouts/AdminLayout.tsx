import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { CalendarDays, LayoutDashboard, LogOut, Menu, Settings, ShieldCheck, Users } from "lucide-react";
import { Toaster } from "../components/ui/sonner";
import { useAuthActions } from "@convex-dev/auth/react";

const DEV_BYPASS_KEY = "medallo_dev_mode";

export function AdminLayout() {
  const location = useLocation();
  const { signOut } = useAuthActions();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Resumen", href: "/dashboard" },
    { icon: CalendarDays, label: "Citas", href: "/dashboard/citas" },
    { icon: Users, label: "Clientes", href: "/dashboard/clientes" },
    { icon: Settings, label: "Configuracion", href: "/dashboard/configuracion" },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const currentNav = navItems.find(
    (item) => location.pathname === item.href || (item.href !== "/dashboard" && location.pathname.startsWith(item.href)),
  );

  return (
    <div className="min-h-screen bg-transparent text-[var(--color-text-primary)]">
      <Toaster position="top-right" />

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(17,17,17,0.18)] backdrop-blur-sm lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <div className="px-4 py-4 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside
            className={`fixed inset-y-4 left-4 z-50 flex w-[260px] flex-col rounded-[32px] border border-[var(--color-border-subtle)] bg-white p-5 shadow-[0_24px_60px_rgba(17,17,17,0.14)] transition-transform lg:static lg:translate-x-0 ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-[120%]"
            }`}
          >
            <div className="flex items-center gap-3 border-b border-[var(--color-border-subtle)] pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] font-semibold text-white">
                MS
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-primary)]">
                  Medallo Admin
                </p>
                <p className="ux-caption">Operacion y seguimiento</p>
              </div>
            </div>

            <nav className="flex-1 space-y-2 py-6">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.href !== "/dashboard" && location.pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-3 border-t border-[var(--color-border-subtle)] pt-5">
              <Link to="/" className="ux-btn-secondary w-full justify-center">
                Volver al sitio
              </Link>
              <button
                type="button"
                onClick={() => {
                  window.localStorage.removeItem(DEV_BYPASS_KEY);
                  void signOut();
                }}
                className="ux-btn-ghost w-full justify-center gap-2"
              >
                <LogOut size={15} />
                Cerrar sesión
              </button>
            </div>
          </aside>

          <main className="min-w-0">
            <header className="ux-card mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="ux-btn-secondary px-3 py-3 lg:hidden"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu size={18} />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="ux-overline">Panel operativo</p>
                    <span className="rounded-full bg-[var(--color-surface-subtle)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                      {currentNav?.label ?? "Admin"}
                    </span>
                  </div>
                  <h1 className="mt-2 text-2xl font-semibold text-[var(--color-text-primary)]">
                    {currentNav?.label ?? "Panel"}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="text-right">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">Medallo Spa Team</p>
                  <p className="ux-caption">Administracion y operaciones</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-subtle)] text-[var(--color-primary)]">
                  <ShieldCheck size={18} />
                </div>
              </div>
            </header>

            <div className="pb-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
