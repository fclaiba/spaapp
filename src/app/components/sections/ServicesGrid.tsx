import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Clock3, WalletCards } from "lucide-react";
import { Link } from "react-router";
import { serviceCategories, services } from "../../data/spa";

export function ServicesGridSection() {
  const [selectedCategory, setSelectedCategory] = useState(serviceCategories[0].id);

  const filteredServices = useMemo(
    () => services.filter((service) => service.categoryId === selectedCategory),
    [selectedCategory],
  );

  return (
    <section id="servicios" className="ux-section">
      <div className="ux-shell">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="ux-overline">Servicios y resultados esperados</span>
            <h2 className="ux-h2">Elegir un tratamiento no deberia sentirse como adivinar entre nombres aspiracionales.</h2>
            <p className="ux-body">
              Cada servicio muestra objetivo, duracion, precio y resultado esperado. Menos ruido, mejor decision.
            </p>
          </div>
          <Link to="/agendar" className="ux-btn-secondary w-fit">
            Ir directo a reservar
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {serviceCategories.map((category) => {
            const isActive = category.id === selectedCategory;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`ux-interactive rounded-full px-4 py-2 text-sm font-semibold ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white"
                    : "border border-[var(--color-border-medium)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="mb-8 rounded-[28px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] p-5">
          <p className="text-sm text-[var(--color-text-secondary)]">
            {serviceCategories.find((category) => category.id === selectedCategory)?.description}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {filteredServices.map((service, index) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="ux-card overflow-hidden p-6"
            >
              <div className="flex flex-col gap-6">
                <div className="rounded-[28px] bg-[linear-gradient(135deg,#fff_0%,#f4ede5_60%,#e7d3bb_100%)] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="ux-badge">{serviceCategories.find((item) => item.id === service.categoryId)?.label}</span>
                        {service.badge ? (
                          <span className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                            {service.badge}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold text-[var(--color-text-primary)]">
                        {service.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{service.summary}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-[var(--color-border-subtle)] p-4">
                    <p className="ux-caption uppercase">Duracion</p>
                    <p className="mt-2 flex items-center gap-2 text-lg font-semibold">
                      <Clock3 size={18} className="text-[var(--color-accent)]" />
                      {service.duration} min
                    </p>
                  </div>
                  <div className="rounded-3xl border border-[var(--color-border-subtle)] p-4">
                    <p className="ux-caption uppercase">Precio</p>
                    <p className="mt-2 flex items-center gap-2 text-lg font-semibold">
                      <WalletCards size={18} className="text-[var(--color-accent)]" />
                      ${service.price}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">Lo que esperas conseguir</p>
                  <ul className="grid gap-2 sm:grid-cols-3">
                    {service.outcomes.map((outcome) => (
                      <li
                        key={outcome}
                        className="rounded-2xl bg-[var(--color-surface-subtle)] px-4 py-3 text-sm text-[var(--color-text-secondary)]"
                      >
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3 border-t border-[var(--color-border-subtle)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Cuando el usuario sabe que consigue y cuanto tarda, decide mas rapido.
                  </p>
                  <Link to={`/agendar?categoria=${service.categoryId}`} className="ux-btn-primary w-fit">
                    Elegir este servicio
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
