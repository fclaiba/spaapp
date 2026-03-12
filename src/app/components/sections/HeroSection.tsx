import { motion } from "motion/react";
import { ArrowRight, CalendarClock, CircleCheckBig, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { landingHighlights } from "../../data/spa";

export function HeroSection() {
  return (
    <section className="ux-section pb-10 pt-8">
      <div className="ux-shell">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-medium)] bg-white px-4 py-2 text-sm text-[var(--color-text-secondary)]">
              <Sparkles size={16} className="text-[var(--color-accent)]" />
              Estetica, wellness y seguimiento con una reserva clara
            </div>

            <div className="space-y-5">
              <span className="ux-overline">Propuesta de valor en 5 segundos</span>
              <h1 className="ux-h1 max-w-4xl">
                Encuentra el tratamiento correcto, entiende el resultado esperado y reserva sin pedir ayuda.
              </h1>
              <p className="ux-body max-w-2xl text-base sm:text-lg">
                Aman Wellness deja de vender “lujo” abstracto y pasa a resolver una tarea concreta: descubrir un servicio confiable, elegir horario y confirmar con tranquilidad.
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
                <div key={item.label} className="ux-card p-5">
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
            className="ux-card overflow-hidden p-6 sm:p-8"
          >
            <div className="rounded-[28px] bg-[linear-gradient(135deg,#111111_0%,#3f2d1e_40%,#dbc4a6_140%)] p-6 text-white">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/72">
                  Flujo principal
                </span>
                <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                  JTBD #1
                </span>
              </div>
              <div className="mt-8 space-y-4">
                {[
                  "Elegir servicio sin adivinar.",
                  "Ver duracion, precio y resultado esperado.",
                  "Confirmar turno con un resumen claro.",
                ].map((step) => (
                  <div key={step} className="flex items-start gap-3 rounded-3xl bg-white/8 p-4">
                    <CircleCheckBig size={18} className="mt-0.5 shrink-0 text-white" />
                    <p className="text-sm leading-6 text-white/86">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-[var(--color-surface-subtle)] p-5">
                <p className="ux-overline">Para usuarios nuevos</p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-text-primary)]">
                  La primera accion importante siempre queda visible: reservar o explorar servicios.
                </p>
              </div>
              <div className="rounded-[28px] border border-[var(--color-border-subtle)] p-5">
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
