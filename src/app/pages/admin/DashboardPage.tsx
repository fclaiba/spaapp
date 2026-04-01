import { motion } from "motion/react";
import { BarChart3, CalendarDays, TrendingUp, Users } from "lucide-react";

import { KPICard } from "../../components/dashboard/KPICard";
import { RecentClientsTable } from "../../components/dashboard/RecentClientsTable";
import { RevenueChart } from "../../components/dashboard/RevenueChart";
import { SourceChart } from "../../components/dashboard/SourceChart";
import { getSourceDistribution, getWeeklyOverview, useSpaSnapshot } from "../../lib/spaStore";

const isCurrentMonth = (isoDate: string) => {
  const date = new Date(isoDate);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

export function DashboardPage() {
  const { appointments, clients } = useSpaSnapshot();
  const weeklyOverview = getWeeklyOverview(appointments);
  const sourceDistribution = getSourceDistribution(appointments);

  const monthlyAppointments = appointments.filter((appointment) => isCurrentMonth(appointment.startsAt));
  const monthlyRevenue = monthlyAppointments.reduce((sum, appointment) => sum + appointment.price, 0);
  const newClients = clients.filter((client) => isCurrentMonth(client.createdAt)).length;
  const completionRate = appointments.length
    ? Math.round((appointments.filter((appointment) => appointment.status === "Completada").length / appointments.length) * 100)
    : 0;

  const upcomingAppointments = [...appointments]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 6);

  const topServices = [...appointments]
    .reduce<Map<string, number>>((accumulator, appointment) => {
      accumulator.set(appointment.serviceName, (accumulator.get(appointment.serviceName) ?? 0) + 1);
      return accumulator;
    }, new Map())
    .entries();

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="ux-card p-6 sm:p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="ux-overline">Estado del negocio</span>
            <h2 className="ux-h2">El dashboard deja de adornar y empieza a orientar decisiones.</h2>
            <p className="ux-body max-w-3xl">
              La prioridad del operador es ver volumen, ingresos, clientes nuevos y estado de citas sin navegar tres pantallas primero.
            </p>
          </div>
          <div className="rounded-[24px] bg-[var(--color-surface-subtle)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
            {appointments.length} citas totales registradas y {clients.length} clientes consolidados.
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Citas del mes" value={`${monthlyAppointments.length}`} trend="+ foco" icon={CalendarDays} delay={0.05} />
        <KPICard label="Ingreso mensual" value={`$${monthlyRevenue}`} trend="+ real" icon={TrendingUp} delay={0.1} />
        <KPICard label="Clientes nuevos" value={`${newClients}`} trend="+ activos" icon={Users} delay={0.15} />
        <KPICard
          label="Tasa completada"
          value={`${completionRate}%`}
          trend={completionRate >= 60 ? "estable" : "revisar"}
          icon={BarChart3}
          negative={completionRate < 60}
          delay={0.2}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <RevenueChart data={weeklyOverview} delay={0.25} />
        <SourceChart data={sourceDistribution} delay={0.3} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <RecentClientsTable clients={upcomingAppointments} delay={0.35} />

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.4 }}
          className="space-y-6"
        >
          <div className="ux-card p-6">
            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Servicios con mas demanda</h3>
            <div className="mt-4 space-y-3">
              {Array.from(topServices)
                .sort((left, right) => right[1] - left[1])
                .slice(0, 4)
                .map(([serviceName, count]) => (
                  <div key={serviceName} className="rounded-[24px] bg-[var(--color-surface-subtle)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">{serviceName}</p>
                      <span className="rounded-full bg-[var(--color-surface-subtle)] px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary)]">
                        {count} reservas
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="ux-card p-6">
            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Lectura rapida</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-text-secondary)]">
              <li className="rounded-[24px] bg-[var(--color-surface-subtle)] px-4 py-4">
                Si el operador entra aqui, debe saber en segundos cuantas citas nuevas llegaron.
              </li>
              <li className="rounded-[24px] bg-[var(--color-surface-subtle)] px-4 py-4">
                Los canales de origen ya no son decorativos: ayudan a entender de donde llega la demanda.
              </li>
              <li className="rounded-[24px] bg-[var(--color-surface-subtle)] px-4 py-4">
                El panel refleja reservas reales hechas desde el nuevo flujo de booking.
              </li>
            </ul>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
