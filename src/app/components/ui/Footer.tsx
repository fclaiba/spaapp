import { Link } from "react-router";
import { Instagram, Phone } from "lucide-react";
import { useSpaSnapshot } from "../../lib/spaStore";

const footerLinks = [
  { label: "Servicios", href: "#servicios" },
  { label: "Proceso", href: "#proceso" },
  { label: "Equipo", href: "#equipo" },
  { label: "Testimonios", href: "#testimonios" },
  { label: "FAQ", href: "#faq" },
];

const socialLinks = [
  {
    label: "@medallospa",
    href: "https://instagram.com/medallospa",
    icon: Instagram,
  },
  {
    label: "347 362 2889",
    href: "https://wa.me/13473622889",
    icon: Phone,
  },
];

export function Footer() {
  const { settings } = useSpaSnapshot();

  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center justify-center"
          aria-label="Medallo Spa — Inicio"
        >
          <img
            src="/logo.svg"
            alt="Medallo Spa"
            className="h-20 w-auto mix-blend-multiply sm:h-24"
          />
        </Link>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--color-text-tertiary)]">
          {settings.address}
        </p>

        {/* Social links */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-5">
          {socialLinks.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[12px] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)]"
            >
              <s.icon size={14} className="text-[var(--color-primary)]" />
              {s.label}
            </a>
          ))}
          <a
            href="https://www.tiktok.com/@_lareinadelossueros"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[12px] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--color-primary)]">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.79 1.53V6.77a4.85 4.85 0 0 1-1.02-.08z"/>
            </svg>
            @_lareinadelossueros
          </a>
        </div>

        <nav className="mt-6 flex flex-wrap items-center justify-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-nav-muted)] transition-colors hover:text-[var(--color-primary)]"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/agendar"
            className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
          >
            Reservar
          </Link>
        </nav>

        <div className="mx-auto mt-8 h-px w-16 bg-gradient-to-r from-transparent via-[var(--color-border-medium)] to-transparent" />

        <p className="mt-6 text-[11px] text-[var(--color-text-tertiary)]">
          {settings.businessName} &copy; {new Date().getFullYear()}. Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  );
}
