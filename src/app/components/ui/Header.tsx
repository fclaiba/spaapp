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
      <header className="sticky top-0 z-50 border-b border-[var(--color-border-subtle)] bg-[var(--color-background)] px-3 pt-4 sm:px-6">
        <div
          className={`ux-shell flex items-center justify-between border-b px-4 pb-4 transition-all sm:px-6 ${
            isScrolled
              ? "border-[var(--color-border-medium)]"
              : "border-[var(--color-border-subtle)]"
          }`}
        >
          <Link to="/" className="flex items-center">
            <img
              src="/logo.svg"
              alt="Medallo Spa"
              className="h-16 w-auto sm:h-20 object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="ux-btn-ghost border-b-2 border-transparent px-3 py-3 text-[12px] tracking-[0.12em] hover:border-[var(--color-accent)] hover:bg-transparent"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/dashboard" className="ux-btn-ghost">
              <ShieldCheck size={16} />
              Admin
            </Link>
            <Link to="/agendar" className="ux-btn-primary whitespace-nowrap">
              <CalendarDays size={16} />
              Reservar cita
            </Link>
          </div>

          <button
            type="button"
            className="ux-btn-secondary px-3 py-3.5 lg:hidden"
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
            className="fixed inset-x-4 top-24 z-40 rounded-[24px] border border-[var(--color-border-medium)] bg-[var(--color-surface)] p-6 shadow-[0_12px_32px_rgba(184,146,74,0.18)] lg:hidden"
          >
            <div className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex rounded-2xl px-4 py-4 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-subtle)]"
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
