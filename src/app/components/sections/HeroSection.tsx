import { motion } from "motion/react";
import { ArrowRight, CalendarClock, CircleCheckBig, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { landingHighlights } from "../../data/spa";

export function HeroSection() {
  return (
    <section className="ux-section pb-6 pt-8">
      <div className="ux-shell">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-medium)] bg-[var(--color-surface)] px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-[var(--color-accent)]">
              <Sparkles size={16} className="text-[var(--color-accent)]" />
              Tu bienestar, nuestra prioridad
            </div>

            <div className="space-y-5">
              <span className="ux-overline">Treatments · Aesthetics · IV Therapy</span>
              <h1 className="ux-h1 max-w-4xl">
                Belleza que <em className="text-[var(--color-accent)]">transforma</em>
              </h1>
              <p className="ux-body max-w-2xl text-base sm:text-lg">
                Encuentra el tratamiento correcto, entiende el resultado esperado y reserva sin friccion.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/agendar" className="ux-btn-primary">
                <CalendarClock size={18} />
                Empezar reserva
              </Link>
              <a href="#servicios" className="ux-btn-secondary">
                Ver servicios primero
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {landingHighlights.map((item) => (
                <div key={item.label} className="ux-card rounded-[24px] p-5">
                  <p className="text-2xl font-semibold text-[var(--color-text-primary)]">{item.value}</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">{item.label}</p>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="ux-card overflow-hidden rounded-[28px] p-6 sm:p-8"
          >
            <div className="rounded-[24px] bg-[var(--color-primary)] p-6 text-[var(--color-surface)]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[rgba(253,250,247,0.75)]">
                  Flujo principal
                </span>
                <span className="border border-[rgba(253,250,247,0.35)] bg-[rgba(253,250,247,0.08)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
                  Premium
                </span>
              </div>
              <div className="mt-8 space-y-4">
                {[
                  "Elegir servicio sin adivinar.",
                  "Ver duracion, precio y resultado esperado.",
                  "Confirmar turno con un resumen claro.",
                ].map((step) => (
                  <div
                    key={step}
                    className="flex items-start gap-3 rounded-[20px] border border-[rgba(253,250,247,0.22)] bg-[rgba(253,250,247,0.08)] p-4"
                  >
                    <CircleCheckBig size={18} className="mt-0.5 shrink-0 text-white" />
                    <p className="text-sm leading-6 text-white/86">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] p-5">
                <p className="ux-overline">Para usuarios nuevos</p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-text-primary)]">
                  La primera accion importante siempre queda visible: reservar o explorar servicios.
                </p>
              </div>
              <div className="rounded-[24px] border border-[var(--color-border-subtle)] p-5">
                <p className="ux-overline">Para operaciones</p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-text-primary)]">
                  Cada reserva llega al panel administrativo con datos utiles, no solo con una pantalla de exito vacia.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
