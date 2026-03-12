import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  negative?: boolean;
  delay?: number;
}

export function KPICard({ label, value, trend, icon: Icon, negative, delay = 0 }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="ux-card p-6"
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="ux-caption uppercase tracking-[0.18em]">{label}</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-surface-subtle)]">
          <Icon size={18} className="text-[var(--color-accent)]" />
        </div>
      </div>

      <div className="flex items-end gap-3">
        <span className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] lg:text-4xl">{value}</span>
        <div
          className={`mb-1.5 flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
            negative ? "bg-[rgba(194,81,75,0.12)] text-[var(--color-danger)]" : "bg-[rgba(47,125,89,0.12)] text-[var(--color-success)]"
          }`}
        >
          <span>{trend}</span>
        </div>
      </div>
    </motion.div>
  );
}
