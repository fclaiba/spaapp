import { motion } from "motion/react";
import { Star } from "lucide-react";
import { testimonials } from "../../data/spa";

export function TestimonialsSection() {
  return (
    <section id="testimonios" className="ux-section">
      <div className="ux-shell">
        <div className="mb-12 space-y-4">
          <span className="ux-overline">Testimonios</span>
          <h2
            className="ux-h2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Lo que dicen nuestros{" "}
            <em className="text-[var(--color-primary)]">clientes</em>
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8"
            >
              <div className="flex gap-1 text-[var(--color-primary)]" role="img" aria-label="5 estrellas">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" aria-hidden="true" />
                ))}
              </div>

              <p
                className="mt-6 text-lg leading-relaxed italic text-[var(--color-text-secondary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                "{item.quote}"
              </p>

              <div className="mt-8 border-t border-[var(--color-border-subtle)] pt-5">
                <p className="text-sm font-semibold text-[var(--color-primary)]">
                  {item.name}
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  {item.role}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
