import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { testimonials } from "../../data/spa";

export function TestimonialsSection() {
  return (
    <section id="testimonios" className="ux-section">
      <div className="ux-shell">
        <div className="mb-8 max-w-2xl space-y-4">
          <span className="ux-overline">Prueba social util</span>
          <h2 className="ux-h2">Los testimonios refuerzan decisiones, no rellenan la pagina.</h2>
          <p className="ux-body">
            Se usan para validar claridad, confianza y rapidez del flujo, que es lo que realmente reduce abandono.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.35, delay: index * 0.07 }}
              className="ux-card p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-[var(--color-accent)]">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} size={14} fill="currentColor" />
                  ))}
                </div>
                <Quote size={18} className="text-[var(--color-accent)]" />
              </div>

              <p className="mt-6 text-base leading-7 text-[var(--color-text-secondary)]">"{item.quote}"</p>

              <div className="mt-8 border-t border-[var(--color-border-subtle)] pt-5">
                <p className="text-base font-semibold text-[var(--color-text-primary)]">{item.name}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{item.role}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
