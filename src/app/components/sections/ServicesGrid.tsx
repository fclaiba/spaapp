import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { serviceCategories, services } from "../../data/spa";
import { useModal } from "../modals/ModalContext";

const categoryImages: Record<string, string> = {
  sueroterapia:
    "https://images.unsplash.com/photo-1763310225009-50214e3c99d9?w=800&q=80&auto=format&fit=crop",
  faciales:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80&auto=format&fit=crop",
  esteticos:
    "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80&auto=format&fit=crop",
  corporales:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop",
  laser:
    "https://images.unsplash.com/photo-1746806942799-b4db209e9a6b?w=800&q=80&auto=format&fit=crop",
};

const categoryLabels: Record<string, string> = {
  sueroterapia: "Sueroterapia",
  faciales: "Faciales",
  esteticos: "Estéticos",
  corporales: "Corporales",
  laser: "Láser",
};

const loopedCategories = [...serviceCategories, ...serviceCategories];

const SPEED = 0.6; // px per frame
const RESUME_DELAY = 1800; // ms after user stops interacting

export function ServicesGridSection() {
  const { openCategory } = useModal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const rafRef = useRef<number>(0);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const pause = () => {
    isPaused.current = true;
    clearTimeout(resumeTimer.current);
  };

  const scheduleResume = () => {
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      isPaused.current = false;
    }, RESUME_DELAY);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const tick = () => {
      if (!isPaused.current && el) {
        el.scrollLeft += SPEED;
        // Seamless loop: jump back when reaching halfway (duplicate start)
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resumeTimer.current);
    };
  }, []);

  // Drag-to-scroll
  const dragState = useRef({ active: false, startX: 0, startScroll: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    pause();
    dragState.current = {
      active: true,
      startX: e.clientX,
      startScroll: scrollRef.current?.scrollLeft ?? 0,
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragState.current.active || !scrollRef.current) return;
    const dx = e.clientX - dragState.current.startX;
    scrollRef.current.scrollLeft = dragState.current.startScroll - dx;
  };

  const onMouseUp = () => {
    dragState.current.active = false;
    scheduleResume();
  };

  return (
    <section id="servicios" className="ux-section overflow-hidden">
      <div className="ux-shell">
        <div className="mb-10 space-y-3">
          <span className="ux-overline">Nuestros servicios</span>
          <h2 className="ux-h2" style={{ fontFamily: "var(--font-display)" }}>
            Tratamientos que{" "}
            <em className="text-[var(--color-primary)]">transforman</em>
          </h2>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative w-full">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--color-background)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--color-background)] to-transparent" />

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto px-4 pb-4 pt-2 select-none"
          style={{ scrollbarWidth: "none", cursor: dragState.current.active ? "grabbing" : "grab" }}
          onMouseEnter={pause}
          onMouseLeave={() => {
            dragState.current.active = false;
            scheduleResume();
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onTouchStart={pause}
          onTouchEnd={scheduleResume}
        >
          {loopedCategories.map((cat, i) => {
            const count = services.filter((s) => s.categoryId === cat.id).length;
            const isOriginal = i < serviceCategories.length;
            return (
              <motion.div
                key={`${cat.id}-${i}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % serviceCategories.length) * 0.06 }}
                role="button"
                tabIndex={isOriginal ? 0 : -1}
                aria-label={`Ver tratamientos de ${categoryLabels[cat.id]}`}
                aria-hidden={!isOriginal}
                onClick={() => openCategory(cat)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openCategory(cat);
                  }
                }}
                className="group w-[300px] min-w-[300px] overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(212,175,55,0.12)] hover:border-[var(--color-primary)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] sm:w-[340px] sm:min-w-[340px]"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={categoryImages[cat.id] ?? ""}
                    alt={categoryLabels[cat.id]}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                  <span className="absolute bottom-3 left-4 rounded-full bg-white/20 px-3 py-1 text-[10px] uppercase tracking-wider text-white backdrop-blur-sm">
                    {count} tratamientos
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 p-5">
                  <div>
                    <h3
                      className="text-xl leading-snug text-[var(--color-text-primary)] transition-colors duration-300 group-hover:text-[var(--color-primary)]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {categoryLabels[cat.id]}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-tertiary)]">
                      {cat.description}
                    </p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="mt-1 shrink-0 text-[var(--color-text-tertiary)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-primary)]"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="ux-shell">
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
