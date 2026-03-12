import { motion } from "motion/react";
import { CalendarClock, ShieldCheck, Sparkle } from "lucide-react";
import { trustPoints } from "../../data/spa";

const processSteps = [
  {
    title: "1. Descubre",
    description: "El home explica que ofrece la app y presenta categorias entendibles, no nombres grandilocuentes.",
  },
  {
    title: "2. Decide",
    description: "Cada servicio explica precio, duracion y resultado esperado para reducir friccion y duda.",
  },
  {
    title: "3. Confirma",
    description: "La reserva termina con un resumen accionable y el panel ya recibe la nueva cita.",
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
          className="ux-card p-8 lg:p-10"
        >
          <span className="ux-overline">Modelo mental correcto</span>
          <h2 className="ux-h2 mt-4">
            La interfaz se reorganiza alrededor de como piensa el usuario: “quiero resolver algo y reservarlo”.
          </h2>
          <p className="ux-body mt-4">
            Se elimina la distancia entre marketing y operacion. Lo que el usuario ve en la landing coincide con lo que puede reservar y con lo que el equipo gestiona despues.
          </p>

          <div className="mt-8 space-y-4">
            {processSteps.map((step) => (
              <div key={step.title} className="rounded-[24px] bg-[var(--color-surface-subtle)] p-5">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{step.description}</p>
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
          <div className="ux-card overflow-hidden p-8 lg:p-10">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-[24px] bg-[var(--color-primary)] p-5 text-white">
                <ShieldCheck size={20} />
                <p className="mt-5 text-lg font-semibold">Confianza</p>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  Sin pagos falsos ni confirmaciones simuladas.
                </p>
              </div>
              <div className="rounded-[24px] border border-[var(--color-border-subtle)] p-5">
                <CalendarClock size={20} className="text-[var(--color-accent)]" />
                <p className="mt-5 text-lg font-semibold">Orientacion</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                  El siguiente paso siempre es visible y defendible.
                </p>
              </div>
              <div className="rounded-[24px] border border-[var(--color-border-subtle)] p-5">
                <Sparkle size={20} className="text-[var(--color-accent)]" />
                <p className="mt-5 text-lg font-semibold">Simplicidad</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                  Menos opciones por pantalla, decisiones mas rapidas.
                </p>
              </div>
            </div>
          </div>

          <div className="ux-card p-8">
            <span className="ux-overline">Por que confiar</span>
            <ul className="mt-4 space-y-3">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 rounded-2xl bg-[var(--color-surface-subtle)] px-4 py-4 text-sm leading-6 text-[var(--color-text-secondary)]">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]" />
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
