import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router";
import { useSpaSnapshot } from "../../lib/spaStore";

export function Footer() {
  const { settings } = useSpaSnapshot();

  return (
    <footer className="ux-section pb-10 pt-8">
      <div className="ux-shell">
        <div className="ux-card grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:p-10">
          <div className="space-y-4">
            <span className="ux-overline">Reserva sin friccion</span>
            <h2 className="ux-h2 max-w-lg">
              La experiencia empieza antes del tratamiento: claridad, confianza y siguiente paso obvio.
            </h2>
            <p className="ux-body max-w-xl">
              {settings.headline} El objetivo no es impresionar con ruido visual, sino ayudarte a reservar rapido y llegar con expectativa correcta.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/agendar" className="ux-btn-primary">
                <CalendarDays size={16} />
                Reservar ahora
              </Link>
              <Link to="/dashboard" className="ux-btn-secondary">
                Ver panel operativo
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="ux-h3">Contacto</h3>
            <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
              <p className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 text-[var(--color-accent)]" />
                <span>{settings.address}</span>
              </p>
              <p className="flex items-center gap-3">
                <Phone size={16} className="text-[var(--color-accent)]" />
                <span>{settings.phone}</span>
              </p>
              <p className="flex items-center gap-3">
                <Mail size={16} className="text-[var(--color-accent)]" />
                <span>{settings.email}</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="ux-h3">Atajos</h3>
            <div className="grid gap-2 text-sm">
              <a href="#servicios" className="ux-btn-ghost justify-start rounded-2xl border border-transparent px-0">
                Ver servicios
              </a>
              <a href="#proceso" className="ux-btn-ghost justify-start rounded-2xl border border-transparent px-0">
                Entender el proceso
              </a>
              <a href="#faq" className="ux-btn-ghost justify-start rounded-2xl border border-transparent px-0">
                Resolver dudas
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 px-2 text-xs text-[var(--color-text-tertiary)] sm:flex-row sm:items-center sm:justify-between">
          <p>{settings.businessName} © {new Date().getFullYear()}.</p>
          <p>Diseñado para que cada pantalla tenga una accion clara y verificable.</p>
        </div>
      </div>
    </footer>
  );
}
