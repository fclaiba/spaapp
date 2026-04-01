import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { serviceCategories, services } from "../../data/spa";
import { useModal } from "../modals/ModalContext";

const categoryImages: Record<string, string> = {
  sueroterapia:
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80&auto=format&fit=crop",
  faciales:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80&auto=format&fit=crop",
  esteticos:
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80&auto=format&fit=crop",
  corporales:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop",
  laser:
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80&auto=format&fit=crop",
};

export function ServicesGridSection() {
  const { openCategory } = useModal();

  const bentoCategories = serviceCategories.slice(0, 4);
  const extraCategories = serviceCategories.slice(4);

  return (
    <section id="servicios" className="ux-section">
      <div className="ux-shell">
        <div className="mb-12 max-w-3xl space-y-4">
          <span className="ux-overline">Nuestros servicios</span>
          <h2 className="ux-h2">
            Curated{" "}
            <em
              className="text-[var(--color-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              treatments
            </em>
          </h2>
          <p className="ux-body max-w-xl">
            Cada servicio muestra objetivo, duración, precio y resultado
            esperado. Menos ruido, mejor decisión.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {bentoCategories.map((cat, i) => {
            const isWide = i % 2 === 0;
            const topService = services.find((s) => s.categoryId === cat.id);
            return (
              <motion.div
                key={cat.id}
                role="button"
                tabIndex={0}
                aria-label={`Ver servicios de ${cat.label.split("(")[0].trim()}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                  isWide ? "md:col-span-8" : "md:col-span-4"
                }`}
                style={{ minHeight: 340 }}
                onClick={() => openCategory(cat)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCategory(cat); } }}
              >
                <span className="sr-only" role="img" aria-label={`Imagen de ${cat.label.split("(")[0].trim()}`} />
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 grayscale group-hover:scale-105 group-hover:grayscale-0"
                  style={{
                    backgroundImage: `url('${categoryImages[cat.id] ?? ""}')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/40 to-transparent" />
                <div className="relative flex h-full min-h-[340px] flex-col justify-end p-6 sm:p-8">
                  <span className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[var(--color-primary)]">
                    {topService?.badge ?? `${services.filter((s) => s.categoryId === cat.id).length} servicios`}
                  </span>
                  <h3
                    className="text-2xl leading-tight text-[var(--color-text-primary)] sm:text-3xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {cat.label.split("(")[0].trim()}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--color-text-secondary)] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {cat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {extraCategories.map((cat, i) => {
            const topService = services.find((s) => s.categoryId === cat.id);
            return (
              <motion.div
                key={cat.id}
                role="button"
                tabIndex={0}
                aria-label={`Ver servicios de ${cat.label.split("(")[0].trim()}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: (bentoCategories.length + i) * 0.1 }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] md:col-span-6"
                style={{ minHeight: 300 }}
                onClick={() => openCategory(cat)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCategory(cat); } }}
              >
                <span className="sr-only" role="img" aria-label={`Imagen de ${cat.label.split("(")[0].trim()}`} />
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 grayscale group-hover:scale-105 group-hover:grayscale-0"
                  style={{
                    backgroundImage: `url('${categoryImages[cat.id] ?? ""}')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/40 to-transparent" />
                <div className="relative flex h-full min-h-[300px] flex-col justify-end p-6 sm:p-8">
                  <span className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[var(--color-primary)]">
                    {topService?.badge ?? `${services.filter((s) => s.categoryId === cat.id).length} servicios`}
                  </span>
                  <h3
                    className="text-2xl leading-tight text-[var(--color-text-primary)] sm:text-3xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {cat.label.split("(")[0].trim()}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/agendar"
            className="inline-flex items-center gap-2 text-sm tracking-wide text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)]"
          >
            Ver todos los servicios y reservar
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
