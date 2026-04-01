import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router";

const navLinks = [
  { label: "Servicios", href: "#servicios" },
  { label: "Proceso", href: "#proceso" },
  { label: "Equipo", href: "#equipo" },
  { label: "Testimonios", href: "#testimonios" },
  { label: "FAQ", href: "#faq" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-4 left-1/2 z-50 w-[92%] max-w-6xl -translate-x-1/2 rounded-full transition-all duration-500 ${
          isScrolled
            ? "bg-[#0E0E0E]/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "bg-[#0E0E0E]/60"
        } border border-[rgba(77,70,53,0.25)] backdrop-blur-2xl`}
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-8">
          <Link
            to="/"
            className="font-[var(--font-display)] text-lg tracking-[0.2em] text-[var(--color-primary)] sm:text-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            MEDALLO SPA
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#D0C5AF] transition-colors hover:text-[var(--color-primary)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/dashboard"
              className="px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#99907c] transition-colors hover:text-[var(--color-primary)]"
            >
              Admin
            </Link>
            <Link
              to="/agendar"
              className="rounded-full px-6 py-2.5 text-sm tracking-tight transition-all duration-300 hover:scale-[0.97]"
              style={{
                fontFamily: "var(--font-display)",
                background: "linear-gradient(135deg, #d4af37 0%, #f2ca50 50%, #d4af37 100%)",
                color: "#554300",
                boxShadow: "0 8px 24px rgba(212,175,55,0.2)",
              }}
            >
              Reservar
            </Link>
          </div>

          <button
            type="button"
            className="rounded-full border border-[var(--color-border-medium)] p-2.5 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)] lg:hidden"
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
            className="fixed inset-x-4 top-20 z-40 rounded-3xl border border-[var(--color-border-medium)] bg-[#0E0E0E]/95 p-6 shadow-[0_24px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl lg:hidden"
          >
            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex rounded-2xl px-4 py-3.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[rgba(212,175,55,0.08)] hover:text-[var(--color-primary)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-4 grid gap-3">
              <Link
                to="/agendar"
                onClick={() => setIsOpen(false)}
                className="ux-btn-primary w-full text-center"
              >
                Reservar cita
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="ux-btn-secondary w-full text-center"
              >
                Panel admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
