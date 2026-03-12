import { motion } from "motion/react";
import { CalendarRange } from "lucide-react";
import { teamMembers } from "../../data/spa";

export function TeamSection() {
  return (
    <section id="equipo" className="ux-section">
      <div className="ux-shell">
        <div className="mb-8 max-w-2xl space-y-4">
          <span className="ux-overline">Quien ejecuta la promesa</span>
          <h2 className="ux-h2">
            El estilo visual ya no tapa a las personas. El equipo aparece como prueba de confianza, no como decoracion.
          </h2>
          <p className="ux-body">
            Roles claros, especialidades claras y contexto suficiente para que el usuario entienda con quien va a atenderse.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <motion.article
              key={member.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.35, delay: index * 0.07 }}
              className="ux-card p-6"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)] text-lg font-semibold text-white">
                  {member.name
                    .split(" ")
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">{member.name}</h3>
                  <p className="text-sm text-[var(--color-accent)]">{member.role}</p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-[var(--color-text-secondary)]">{member.bio}</p>

              <div className="mt-6 rounded-[24px] bg-[var(--color-surface-subtle)] p-4">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">Disponibilidad orientativa</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <CalendarRange size={16} className="text-[var(--color-accent)]" />
                  Agenda visible al momento de reservar y confirmable desde el panel.
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
