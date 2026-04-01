import { Link } from "react-router";
import { useSpaSnapshot } from "../../lib/spaStore";

const footerLinks = [
  { label: "Servicios", href: "#servicios" },
  { label: "Proceso", href: "#proceso" },
  { label: "Equipo", href: "#equipo" },
  { label: "Testimonios", href: "#testimonios" },
  { label: "FAQ", href: "#faq" },
];

export function Footer() {
  const { settings } = useSpaSnapshot();

  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-[#0e0e0e] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <Link
          to="/"
          className="inline-block text-2xl tracking-[0.25em] text-[var(--color-primary)] sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          MEDALLO SPA
        </Link>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--color-text-tertiary)]">
          {settings.address}
        </p>

        <nav className="mt-8 flex flex-wrap items-center justify-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] uppercase tracking-[0.2em] text-[#4D4635] transition-colors hover:text-[var(--color-primary)]"
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
