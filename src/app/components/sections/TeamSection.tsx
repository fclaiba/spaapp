import { motion } from "motion/react";
import { CalendarRange } from "lucide-react";
import { teamMembers } from "../../data/spa";

export function TeamSection() {
  return (
    <section id="equipo" className="ux-section">
      <div className="ux-shell">
        <div className="mb-12 max-w-2xl space-y-4">
          <span className="ux-overline">Nuestro equipo</span>
          <h2
            className="ux-h2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Quién ejecuta la{" "}
            <em className="text-[var(--color-primary)]">promesa</em>
          </h2>
          <p className="ux-body">
            Roles claros, especialidades claras y contexto suficiente para que
            entiendas con quién vas a atenderte.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <motion.article
              key={member.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8"
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold"
                  style={{
                    background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
                    color: "var(--color-primary-foreground)",
                  }}
                >
                  {member.name
                    .split(" ")
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div>
                  <h3
                    className="text-xl text-[var(--color-text-primary)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {member.name}
                  </h3>
                  <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-primary)]">
                    {member.role}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {member.bio}
              </p>

              <div className="mt-6 rounded-xl bg-[var(--color-surface-subtle)] p-4">
                <p className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)]">
                  <CalendarRange size={16} className="text-[var(--color-primary)]" />
                  Agenda visible al momento de reservar.
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
