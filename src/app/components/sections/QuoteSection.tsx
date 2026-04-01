import { motion } from "motion/react";

export function QuoteSection() {
  return (
    <section className="bg-[var(--color-surface-subtle)] py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />

          <blockquote
            className="text-2xl leading-relaxed italic text-[var(--color-text-primary)] sm:text-3xl lg:text-5xl lg:leading-snug"
            style={{ fontFamily: "var(--font-display)" }}
          >
            "La verdadera belleza no se impone — se revela cuando el cuerpo
            encuentra su equilibrio."
          </blockquote>

          <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />

          <cite className="block text-[10px] not-italic uppercase tracking-[0.4em] text-[var(--color-text-tertiary)]">
            Dra. Laura Medallo — Directora Clínica
          </cite>
        </motion.div>
      </div>
    </section>
  );
}
