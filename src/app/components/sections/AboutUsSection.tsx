import { motion } from "motion/react";
import { CalendarClock, ShieldCheck, Sparkle } from "lucide-react";
import { trustPoints } from "../../data/spa";

const processSteps = [
  {
    title: "1. Descubre",
    description:
      "El home explica qué ofrece la app y presenta categorías entendibles, no nombres grandilocuentes.",
  },
  {
    title: "2. Decide",
    description:
      "Cada servicio explica precio, duración y resultado esperado para reducir fricción y duda.",
  },
  {
    title: "3. Confirma",
    description:
      "La reserva termina con un resumen accionable y el panel ya recibe la nueva cita.",
  },
];

export function AboutUsSection() {
  return (
    <section id="proceso" className="ux-section">
      <div className="ux-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8 lg:p-10"
        >
          <span className="ux-overline">Proceso</span>
          <h2
            className="ux-h2 mt-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Tu camino hacia el{" "}
            <em className="text-[var(--color-primary)]">bienestar</em>
          </h2>
          <p className="ux-body mt-4">
            Se elimina la distancia entre marketing y operación. Lo que ves en la
            landing coincide con lo que puedes reservar.
          </p>

          <div className="mt-8 space-y-4">
            {processSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-xl bg-[var(--color-surface-subtle)] p-5"
              >
                <p
                  className="text-sm font-semibold text-[var(--color-primary)]"
                >
                  {step.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1 }}
          className="grid gap-6"
        >
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8 lg:p-10">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl p-5" style={{ background: "linear-gradient(135deg, #d4af37 0%, #f2ca50 100%)" }}>
                <ShieldCheck size={20} className="text-[#554300]" />
                <p className="mt-5 text-lg font-semibold text-[#554300]">Confianza</p>
                <p className="mt-2 text-sm leading-relaxed text-[#554300]/70">
                  Sin pagos falsos ni confirmaciones simuladas.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] p-5">
                <CalendarClock size={20} className="text-[var(--color-primary)]" />
                <p className="mt-5 text-lg font-semibold text-[var(--color-text-primary)]">
                  Orientación
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  El siguiente paso siempre es visible y defendible.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] p-5">
                <Sparkle size={20} className="text-[var(--color-primary)]" />
                <p className="mt-5 text-lg font-semibold text-[var(--color-text-primary)]">
                  Simplicidad
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  Menos opciones por pantalla, decisiones más rápidas.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8">
            <span className="ux-overline">Por qué confiar</span>
            <ul className="mt-4 space-y-3">
              {trustPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 rounded-xl bg-[var(--color-surface-subtle)] px-4 py-4 text-sm leading-relaxed text-[var(--color-text-secondary)]"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
