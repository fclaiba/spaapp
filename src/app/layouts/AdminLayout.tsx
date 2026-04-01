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
    { icon: Settings, label: "Configuración", href: "/dashboard/configuracion" },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const currentNav = navItems.find(
    (item) => location.pathname === item.href || (item.href !== "/dashboard" && location.pathname.startsWith(item.href)),
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <Toaster position="top-right" />

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <div className="px-4 py-4 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside
            className={`fixed inset-y-4 left-4 z-50 flex w-[260px] flex-col rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-transform lg:static lg:translate-x-0 ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-[120%]"
            }`}
          >
            <div className="flex items-center gap-3 border-b border-[var(--color-border-subtle)] pb-5">
              <img
                src="/LogotipoPNG.png"
                alt="Medallo Spa"
                className="h-10 w-auto mix-blend-multiply"
              />
            </div>

            <nav className="flex-1 space-y-1 py-6">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.href !== "/dashboard" && location.pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--color-accent-soft)] text-[var(--color-primary)]"
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
            <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-xl border border-[var(--color-border-medium)] p-3 text-[var(--color-text-secondary)] lg:hidden"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu size={18} />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="ux-overline">Panel operativo</p>
                    <span className="ux-badge">
                      {currentNav?.label ?? "Admin"}
                    </span>
                  </div>
                  <h1
                    className="mt-2 text-2xl text-[var(--color-text-primary)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {currentNav?.label ?? "Panel"}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="text-right">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">Medallo Spa Team</p>
                  <p className="ux-caption">Administración y operaciones</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-primary)]">
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
