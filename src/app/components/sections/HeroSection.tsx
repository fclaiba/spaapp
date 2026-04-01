import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1920&q=80&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#131313]/40 via-[#131313]/20 to-[#131313]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-32 pb-24 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <p className="ux-overline">
            MEDALLO SPA &mdash; Aesthetics & IV Vitamins
          </p>

          <h1
            className="ux-h1 mx-auto max-w-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Belleza que{" "}
            <em className="text-glow text-[var(--color-primary)]">
              transforma
            </em>
          </h1>

          <p className="mx-auto max-w-xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            Encuentra el tratamiento correcto, entiende el resultado esperado y
            reserva sin fricción.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/agendar" className="ux-btn-primary">
              Reserva tu experiencia
            </Link>
            <a
              href="#servicios"
              className="group inline-flex items-center gap-2 text-sm tracking-wide text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)]"
            >
              Descubrir servicios
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">
          Scroll
        </span>
        <div className="h-12 w-px bg-gradient-to-b from-[var(--color-primary)] to-transparent" />
      </motion.div>
    </section>
  );
}
