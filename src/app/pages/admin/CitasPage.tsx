import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { services, type AppointmentStatus, type LeadSource } from "../../data/spa";
import { useAddManualAppointment, useUpdateAppointmentStatus, useSpaSnapshot } from "../../lib/spaStore";

const statusOptions: AppointmentStatus[] = ["Pendiente", "Confirmada", "En sala", "Completada", "Cancelada"];
const leadSources: LeadSource[] = ["Instagram", "Google", "Referido", "WhatsApp", "Walk-in"];

const isSameDay = (left: string, right: Date) => {
  const current = new Date(left);
  return (
    current.getDate() === right.getDate() &&
    current.getMonth() === right.getMonth() &&
    current.getFullYear() === right.getFullYear()
  );
};

export function CitasPage() {
  const { appointments } = useSpaSnapshot();
  const addManualAppointment = useAddManualAppointment();
  const updateStatus = useUpdateAppointmentStatus();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | "Todos">("Todos");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState({
    customerName: "",
    email: "",
    phone: "",
    serviceId: services[0]?.id ?? "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "10:00",
    origin: "Instagram" as LeadSource,
  });

  const filteredAppointments = useMemo(
    () =>
      appointments
        .filter((appointment) => isSameDay(appointment.startsAt, selectedDate))
        .filter((appointment) =>
          filterStatus === "Todos" ? true : appointment.status === filterStatus,
        )
        .filter((appointment) => {
          const term = searchTerm.trim().toLowerCase();
          if (!term) {
            return true;
          }

          return (
            appointment.customerName.toLowerCase().includes(term) ||
            appointment.serviceName.toLowerCase().includes(term) ||
            appointment.email.toLowerCase().includes(term)
          );
        })
        .sort((left, right) => new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime()),
    [appointments, filterStatus, searchTerm, selectedDate],
  );

  const submitAppointment = async () => {
    if (!formState.customerName || !formState.email || !formState.phone) {
      toast.error("Completa nombre, email y teléfono.");
      return;
    }

    try {
      await addManualAppointment(formState);
      toast.success("Cita creada y visible en la agenda.");
      setIsFormOpen(false);
      setFormState({
        customerName: "",
        email: "",
        phone: "",
        serviceId: services[0]?.id ?? "",
        date: format(new Date(), "yyyy-MM-dd"),
        time: "10:00",
        origin: "Instagram",
      });
    } catch {
      toast.error("No se pudo crear la cita en el backend.");
    }
  };

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="ux-card p-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="ux-overline">JTBD operativo</span>
            <h2 className="ux-h2 mt-3">Ver, filtrar y accionar sobre la agenda en la misma pantalla.</h2>
          </div>
          <button type="button" className="ux-btn-primary w-fit" onClick={() => setIsFormOpen((value) => !value)}>
            <Plus size={16} />
            {isFormOpen ? "Cerrar alta" : "Nueva cita"}
          </button>
        </div>

        {isFormOpen ? (
          <div className="mt-6 grid gap-4 rounded-[28px] bg-[var(--color-surface-subtle)] p-5 lg:grid-cols-3">
            <input
              value={formState.customerName}
              onChange={(event) => setFormState((current) => ({ ...current, customerName: event.target.value }))}
              placeholder="Nombre del cliente"
              aria-label="Nombre del cliente"
              className="ux-input"
            />
            <input
              value={formState.email}
              onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
              placeholder="Email"
              aria-label="Email"
              className="ux-input"
            />
            <input
              value={formState.phone}
              onChange={(event) => setFormState((current) => ({ ...current, phone: event.target.value }))}
              placeholder="Teléfono"
              aria-label="Teléfono"
              className="ux-input"
            />
            <select
              value={formState.serviceId}
              onChange={(event) => setFormState((current) => ({ ...current, serviceId: event.target.value }))}
              aria-label="Servicio"
              className="ux-input"
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={formState.date}
              onChange={(event) => setFormState((current) => ({ ...current, date: event.target.value }))}
              aria-label="Fecha"
              className="ux-input"
            />
            <input
              type="time"
              value={formState.time}
              onChange={(event) => setFormState((current) => ({ ...current, time: event.target.value }))}
              aria-label="Horario"
              className="ux-input"
            />
            <select
              value={formState.origin}
              onChange={(event) =>
                setFormState((current) => ({ ...current, origin: event.target.value as LeadSource }))
              }
              aria-label="Origen del cliente"
              className="ux-input"
            >
              {leadSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
            <div className="lg:col-span-2 flex justify-end">
              <button type="button" className="ux-btn-primary" onClick={submitAppointment}>
                <CheckCircle2 size={16} />
                Guardar cita
              </button>
            </div>
          </div>
        ) : null}
      </motion.section>

      <section className="ux-card p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="ux-btn-secondary px-3 py-3" onClick={() => setSelectedDate(addDays(selectedDate, -1))} aria-label="Día anterior">
              <ChevronLeft size={16} />
            </button>
            <div className="rounded-full bg-[var(--color-surface-subtle)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)]">
              {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
            </div>
            <button type="button" className="ux-btn-secondary px-3 py-3" onClick={() => setSelectedDate(addDays(selectedDate, 1))} aria-label="Día siguiente">
              <ChevronRight size={16} />
            </button>
            <button type="button" className="ux-btn-ghost" onClick={() => setSelectedDate(new Date())}>
              Hoy
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-[240px]">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="ux-input pl-11"
                placeholder="Buscar cliente o servicio"
                aria-label="Buscar cliente o servicio"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value as AppointmentStatus | "Todos")}
              aria-label="Filtrar por estado"
              className="ux-input"
            >
              <option value="Todos">Todos los estados</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <article key={appointment.id} className="ux-card p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="grid gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                    {format(new Date(appointment.startsAt), "HH:mm")}
                  </span>
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">{appointment.customerName}</span>
                  <span className="text-sm text-[var(--color-text-secondary)]">{appointment.serviceName}</span>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {appointment.staff} · {appointment.email} · {appointment.phone}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <span className="rounded-full bg-[var(--color-surface-subtle)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                  {appointment.origin}
                </span>
                <select
                  value={appointment.status}
                  onChange={async (event) => {
                    try {
                      await updateStatus(appointment.id, event.target.value as AppointmentStatus);
                      toast.success(`Estado actualizado a ${event.target.value}.`);
                    } catch {
                      toast.error("No se pudo actualizar el estado.");
                    }
                  }}
                  aria-label={`Estado de la cita, ${appointment.customerName}`}
                  className="ux-input min-w-[180px]"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {appointment.notes ? (
              <div className="mt-4 rounded-[24px] bg-[var(--color-surface-subtle)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                {appointment.notes}
              </div>
            ) : null}
          </article>
        ))}

        {filteredAppointments.length === 0 ? (
          <div className="ux-card flex flex-col items-center gap-3 p-10 text-center">
            <CalendarDays size={28} className="text-[var(--color-accent)]" />
            <p className="text-base font-semibold text-[var(--color-text-primary)]">No hay citas para esta vista.</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Cambia la fecha o los filtros para seguir trabajando.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
