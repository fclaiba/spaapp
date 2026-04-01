import { Link } from "react-router";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Clock3, WalletCards, ArrowRight, Sparkles } from "lucide-react";
import { useModal } from "./ModalContext";
import { serviceCategories } from "../../data/spa";

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

export function ServiceDetailModal() {
  const { modal, close } = useModal();

  if (modal.type !== "service") return null;

  const { service, categoryId } = modal;
  const category = serviceCategories.find((c) => c.id === categoryId);
  const image = categoryImages[categoryId] ?? "";

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-0 sm:max-w-2xl rounded-2xl">
        <div className="relative h-48 sm:h-56 overflow-hidden rounded-t-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-[var(--color-surface)]/60 to-[var(--color-surface)]/10" />
          <div className="absolute bottom-4 left-6 right-6">
            {service.badge && (
              <span className="mb-2 inline-block rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                <Sparkles size={12} className="mr-1 inline" />
                {service.badge}
              </span>
            )}
            <DialogTitle
              className="text-3xl text-[var(--color-text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {service.name}
            </DialogTitle>
            <DialogDescription className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--color-primary)]">
              {category?.label}
            </DialogDescription>
          </div>
        </div>

        <div className="space-y-6 px-6 pb-6">
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {service.summary}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-[var(--color-surface-subtle)] p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
                Duración
              </p>
              <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]">
                <Clock3 size={18} className="text-[var(--color-primary)]" />
                {service.duration} min
              </p>
            </div>
            <div className="rounded-xl bg-[var(--color-surface-subtle)] p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
                Precio
              </p>
              <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]">
                <WalletCards size={18} className="text-[var(--color-primary)]" />
                ${service.price}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
              Resultados esperados
            </p>
            <div className="flex flex-wrap gap-2">
              {service.outcomes.map((o) => (
                <span
                  key={o}
                  className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)]"
                >
                  {o}
                </span>
              ))}
            </div>
          </div>

          <Link
            to={`/agendar?categoria=${categoryId}`}
            onClick={close}
            className="ux-btn-primary w-full"
          >
            Reservar este servicio
            <ArrowRight size={16} />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
