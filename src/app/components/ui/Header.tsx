import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, Menu, ShieldCheck, X } from "lucide-react";
import { Link } from "react-router";

const navLinks = [
  { label: "Servicios", href: "#servicios" },
  { label: "Como funciona", href: "#proceso" },
  { label: "Equipo", href: "#equipo" },
  { label: "Testimonios", href: "#testimonios" },
  { label: "FAQ", href: "#faq" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
        <div
          className={`ux-shell flex items-center justify-between rounded-full border px-4 py-3 transition-all sm:px-6 ${
            isScrolled
              ? "border-[var(--color-border-medium)] bg-[rgba(255,255,255,0.92)] shadow-[0_12px_32px_rgba(17,17,17,0.08)] backdrop-blur-md"
              : "border-transparent bg-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-semibold text-white">
              AW
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-primary)]">
                Aman Wellness
              </p>
              <p className="ux-caption">Reserva clara para tratamientos y wellness</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="ux-btn-ghost px-0 py-0 text-sm text-[var(--color-text-secondary)] hover:bg-transparent"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link to="/dashboard" className="ux-btn-ghost">
              <ShieldCheck size={16} />
              Admin
            </Link>
            <Link to="/agendar" className="ux-btn-primary">
              <CalendarDays size={16} />
              Reservar cita
            </Link>
          </div>

          <button
            type="button"
            className="ux-btn-secondary px-3 py-3 lg:hidden"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-label="Abrir menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-x-4 top-24 z-40 rounded-[28px] border border-[var(--color-border-medium)] bg-white p-5 shadow-[0_20px_60px_rgba(17,17,17,0.12)] lg:hidden"
          >
            <div className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex rounded-2xl px-4 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-subtle)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-4 grid gap-3">
              <Link to="/agendar" onClick={() => setIsOpen(false)} className="ux-btn-primary w-full">
                <CalendarDays size={16} />
                Reservar cita
              </Link>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="ux-btn-secondary w-full">
                <ShieldCheck size={16} />
                Ir al panel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
