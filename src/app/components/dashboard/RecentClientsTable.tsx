import { motion } from "motion/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { type AppointmentRecord } from "../../data/spa";

interface RecentClientsTableProps {
  clients: AppointmentRecord[];
  delay?: number;
}

const statusStyles: Record<string, string> = {
  Pendiente: "bg-[rgba(163,106,10,0.12)] text-[var(--color-warning)]",
  Confirmada: "bg-[rgba(47,125,89,0.12)] text-[var(--color-success)]",
  "En sala": "bg-[rgba(143,94,56,0.12)] text-[var(--color-accent)]",
  Completada: "bg-[rgba(47,125,89,0.12)] text-[var(--color-success)]",
  Cancelada: "bg-[rgba(194,81,75,0.12)] text-[var(--color-danger)]",
};

export function RecentClientsTable({ clients, delay = 0 }: RecentClientsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="ux-card overflow-hidden"
    >
      <div className="border-b border-[var(--color-border-subtle)] p-6">
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Ultimas citas registradas</h3>
        <p className="ux-body mt-1 text-sm">Actividad reciente con contexto suficiente para actuar rapido.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)]">
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                Cliente
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                Servicio
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                Inicio
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                Origen
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                Estado
              </th>
              <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                Ingreso
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((appointment, index) => (
              <tr key={appointment.id} className="border-b border-[var(--color-border-subtle)] last:border-0">
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{appointment.customerName}</p>
                  <p className="ux-caption">{appointment.email}</p>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">{appointment.serviceName}</td>
                <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                  {format(new Date(appointment.startsAt), "dd MMM, HH:mm", { locale: es })}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">{appointment.origin}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusStyles[appointment.status] ?? "bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]"}`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-[var(--color-text-primary)]">
                  ${appointment.price}
                </td>
              </tr>
            ))}
            {clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-[var(--color-text-secondary)]">
                  Sin actividad reciente.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
