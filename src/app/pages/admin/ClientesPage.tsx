import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";

import { type LeadSource } from "../../data/spa";
import { useAddClient, useSpaSnapshot } from "../../lib/spaStore";

const leadSources: LeadSource[] = ["Instagram", "Google", "Referido", "WhatsApp", "Walk-in"];

export function ClientesPage() {
  const { clients, appointments } = useSpaSnapshot();
  const addClient = useAddClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    preferredService: "Evaluacion inicial",
    origin: "Instagram" as LeadSource,
    notes: "",
  });

  const filteredClients = useMemo(
    () =>
      clients.filter((client) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) {
          return true;
        }

        return (
          client.name.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term) ||
          client.phone.toLowerCase().includes(term)
        );
      }),
    [clients, searchTerm],
  );

  const submitClient = async () => {
    if (!formState.name || !formState.email || !formState.phone) {
      toast.error("Completa nombre, email y telefono.");
      return;
    }

    try {
      await addClient(formState);
      toast.success("Cliente agregado al directorio.");
      setIsFormOpen(false);
      setFormState({
        name: "",
        email: "",
        phone: "",
        preferredService: "Evaluacion inicial",
        origin: "Instagram",
        notes: "",
      });
    } catch {
      toast.error("No se pudo crear el cliente en el backend.");
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
            <span className="ux-overline">Base de relacion</span>
            <h2 className="ux-h2 mt-3">Los clientes dejan de ser una tabla fria y pasan a tener contexto accionable.</h2>
          </div>
          <button type="button" className="ux-btn-primary w-fit" onClick={() => setIsFormOpen((value) => !value)}>
            <Plus size={16} />
            {isFormOpen ? "Cerrar alta" : "Nuevo cliente"}
          </button>
        </div>

        {isFormOpen ? (
          <div className="mt-6 grid gap-4 rounded-[28px] bg-[var(--color-surface-subtle)] p-5 lg:grid-cols-3">
            <input
              value={formState.name}
              onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
              placeholder="Nombre completo"
              className="ux-input"
            />
            <input
              value={formState.email}
              onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
              placeholder="Email"
              className="ux-input"
            />
            <input
              value={formState.phone}
              onChange={(event) => setFormState((current) => ({ ...current, phone: event.target.value }))}
              placeholder="Telefono"
              className="ux-input"
            />
            <input
              value={formState.preferredService}
              onChange={(event) =>
                setFormState((current) => ({ ...current, preferredService: event.target.value }))
              }
              placeholder="Servicio preferido"
              className="ux-input"
            />
            <select
              value={formState.origin}
              onChange={(event) =>
                setFormState((current) => ({ ...current, origin: event.target.value as LeadSource }))
              }
              className="ux-input"
            >
              {leadSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
            <input
              value={formState.notes}
              onChange={(event) => setFormState((current) => ({ ...current, notes: event.target.value }))}
              placeholder="Notas internas"
              className="ux-input"
            />
            <div className="lg:col-span-3 flex justify-end">
              <button type="button" className="ux-btn-primary" onClick={submitClient}>
                Guardar cliente
              </button>
            </div>
          </div>
        ) : null}
      </motion.section>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="ux-card p-5">
          <p className="ux-caption uppercase">Clientes activos</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--color-text-primary)]">{clients.length}</p>
        </div>
        <div className="ux-card p-5">
          <p className="ux-caption uppercase">LTV promedio</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--color-text-primary)]">
            $
            {clients.length
              ? Math.round(
                  clients.reduce((sum, client) => sum + client.totalSpent, 0) / Math.max(clients.length, 1),
                )
              : 0}
          </p>
        </div>
        <div className="ux-card p-5">
          <p className="ux-caption uppercase">Citas totales</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--color-text-primary)]">{appointments.length}</p>
        </div>
      </div>

      <section className="ux-card overflow-hidden">
        <div className="border-b border-[var(--color-border-subtle)] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Directorio de clientes</h3>
              <p className="ux-body mt-1 text-sm">Busqueda simple y contexto suficiente para accionar.</p>
            </div>
            <div className="relative min-w-[260px]">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="ux-input pl-11"
                placeholder="Buscar por nombre, email o telefono"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 xl:grid-cols-2">
          {filteredClients.map((client) => (
            <article key={client.email} className="rounded-[28px] border border-[var(--color-border-subtle)] p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-semibold text-white">
                  {client.name
                    .split(" ")
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-[var(--color-text-primary)]">{client.name}</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">{client.preferredService}</p>
                    </div>
                    <span className="rounded-full bg-[var(--color-surface-subtle)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                      {client.origin}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-[var(--color-text-secondary)]">
                    <p className="flex items-center gap-2">
                      <Mail size={14} className="text-[var(--color-accent)]" />
                      {client.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={14} className="text-[var(--color-accent)]" />
                      {client.phone}
                    </p>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-[var(--color-surface-subtle)] px-4 py-3">
                      <p className="ux-caption uppercase">Visitas</p>
                      <p className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">{client.totalVisits}</p>
                    </div>
                    <div className="rounded-2xl bg-[var(--color-surface-subtle)] px-4 py-3">
                      <p className="ux-caption uppercase">Total</p>
                      <p className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">${client.totalSpent}</p>
                    </div>
                    <div className="rounded-2xl bg-[var(--color-surface-subtle)] px-4 py-3">
                      <p className="ux-caption uppercase">Proxima cita</p>
                      <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                        {client.nextAppointment ? "Agendada" : "Sin fecha"}
                      </p>
                    </div>
                  </div>

                  {client.notes ? (
                    <div className="mt-4 rounded-2xl bg-[var(--color-surface-subtle)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                      {client.notes}
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          ))}

          {filteredClients.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-[var(--color-border-medium)] p-10 text-center text-sm text-[var(--color-text-secondary)] xl:col-span-2">
              <Users size={24} className="mx-auto mb-3 text-[var(--color-accent)]" />
              No hay clientes que coincidan con la busqueda.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
