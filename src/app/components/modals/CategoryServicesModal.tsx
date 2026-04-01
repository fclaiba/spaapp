import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Clock3, WalletCards, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { useModal } from "./ModalContext";
import { services } from "../../data/spa";

const ITEMS_PER_PAGE = 4;

const categoryImages: Record<string, string> = {
  sueroterapia:
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80&auto=format&fit=crop",
  faciales:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80&auto=format&fit=crop",
  esteticos:
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&q=80&auto=format&fit=crop",
  corporales:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80&auto=format&fit=crop",
  laser:
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80&auto=format&fit=crop",
};

export function CategoryServicesModal() {
  const { modal, close } = useModal();
  const [page, setPage] = useState(0);

  const isOpen = modal.type === "category";
  const category = isOpen ? modal.category : null;
  const categoryServices = useMemo(
    () => (category ? services.filter((s) => s.categoryId === category.id) : []),
    [category],
  );
  const image = category ? (categoryImages[category.id] ?? "") : "";

  const totalPages = Math.ceil(categoryServices.length / ITEMS_PER_PAGE);
  const pagedServices = categoryServices.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    if (!isOpen) setPage(0);
  }, [isOpen]);

  if (!isOpen || !category) return null;

  const categoryName = category.label.split("(")[0].trim();

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-0 sm:max-w-3xl rounded-2xl">
        {/* Hero image — grayscale → color */}
        <div className="relative h-48 shrink-0 overflow-hidden sm:h-64">
          <span className="sr-only" role="img" aria-label={`Imagen de ${categoryName}`} />
          <motion.div
            initial={{ filter: "grayscale(100%) scale(1.05)" }}
            animate={{ filter: "grayscale(0%) scale(1)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-[var(--color-surface)]/30 to-transparent" />

          <div className="absolute bottom-5 left-6 right-10">
            <span className="mb-1.5 block text-[10px] uppercase tracking-[0.35em] text-[var(--color-primary)]">
              {categoryServices.length} servicios
            </span>
            <DialogTitle
              className="text-2xl leading-tight text-[var(--color-text-primary)] sm:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {categoryName}
            </DialogTitle>
            <DialogDescription className="mt-1.5 max-w-lg text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {category.description}
            </DialogDescription>
          </div>
        </div>

        {/* Service list — paginated */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {pagedServices.map((service) => (
                <div
                  key={service.id}
                  className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3
                        className="text-lg text-[var(--color-text-primary)]"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {service.name}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {service.summary}
                      </p>
                    </div>
                    {service.badge && (
                      <span className="ux-badge shrink-0">{service.badge}</span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-tertiary)]">
                    <span className="flex items-center gap-1.5">
                      <Clock3 size={13} className="text-[var(--color-primary)]" />
                      {service.duration} min
                    </span>
                    <span className="flex items-center gap-1.5">
                      <WalletCards size={13} className="text-[var(--color-primary)]" />
                      ${service.price}
                    </span>
                  </div>

                  {service.outcomes.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {service.outcomes.map((o) => (
                        <span
                          key={o}
                          className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-2.5 py-1 text-[11px] text-[var(--color-text-secondary)]"
                        >
                          {o}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 border-t border-[var(--color-border-subtle)] pt-4">
                    <Link
                      to={`/agendar?categoria=${category.id}`}
                      onClick={close}
                      className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      Reservar este servicio
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination + footer CTA */}
        <div className="shrink-0 border-t border-[var(--color-border-subtle)] px-6 py-4">
          {totalPages > 1 && (
            <div className="mb-4 flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-primary)] disabled:opacity-30"
                aria-label="Página anterior"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${
                    page === i
                      ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-primary)] disabled:opacity-30"
                aria-label="Página siguiente"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          <Link
            to={`/agendar?categoria=${category.id}`}
            onClick={close}
            className="ux-btn-primary w-full"
          >
            Reservar en {categoryName}
            <ArrowRight size={16} />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
