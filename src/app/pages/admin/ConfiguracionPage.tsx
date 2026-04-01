import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Bell, Building2, Save, Settings2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { services } from "../../data/spa";
import { useUpdateSettings, useSpaSnapshot } from "../../lib/spaStore";

const tabs = [
  { id: "negocio", label: "Negocio", icon: Building2 },
  { id: "operacion", label: "Operacion", icon: Settings2 },
  { id: "notificaciones", label: "Notificaciones", icon: Bell },
  { id: "seguridad", label: "Seguridad", icon: ShieldCheck },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function ConfiguracionPage() {
  const { settings } = useSpaSnapshot();
  const updateSettings = useUpdateSettings();
  const [activeTab, setActiveTab] = useState<TabId>("negocio");
  const [formState, setFormState] = useState(settings);

  useEffect(() => {
    setFormState(settings);
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings(formState);
      toast.success("Configuracion guardada.");
    } catch {
      toast.error("No se pudo guardar la configuracion.");
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
            <span className="ux-overline">Configuracion sin ruido</span>
            <h2 className="ux-h2 mt-3">Se eliminan subpantallas ornamentales y quedan solo ajustes con impacto real.</h2>
          </div>
          <button type="button" onClick={handleSave} className="ux-btn-primary w-fit">
            <Save size={16} />
            Guardar cambios
          </button>
        </div>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="ux-card p-4">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold ${
                  activeTab === tab.id
                    ? "bg-[var(--color-accent-soft)] text-[var(--color-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        <section className="space-y-6">
          {activeTab === "negocio" ? (
            <div className="ux-card grid gap-4 p-6 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <p className="ux-overline">Informacion publica</p>
                <h3 className="mt-3 text-xl font-semibold text-[var(--color-text-primary)]">Lo que el usuario ve y entiende del negocio.</h3>
              </div>
              <input
                value={formState.businessName}
                onChange={(event) => setFormState((current) => ({ ...current, businessName: event.target.value }))}
                className="ux-input"
                placeholder="Nombre comercial"
              />
              <input
                value={formState.phone}
                onChange={(event) => setFormState((current) => ({ ...current, phone: event.target.value }))}
                className="ux-input"
                placeholder="Telefono"
              />
              <input
                value={formState.email}
                onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
                className="ux-input"
                placeholder="Email"
              />
              <input
                value={formState.address}
                onChange={(event) => setFormState((current) => ({ ...current, address: event.target.value }))}
                className="ux-input"
                placeholder="Direccion"
              />
              <textarea
                value={formState.headline}
                onChange={(event) => setFormState((current) => ({ ...current, headline: event.target.value }))}
                className="ux-input min-h-28 resize-none lg:col-span-2"
                placeholder="Mensaje principal"
              />
            </div>
          ) : null}

          {activeTab === "operacion" ? (
            <div className="ux-card space-y-4 p-6">
              <p className="ux-overline">Reglas de reserva</p>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[24px] bg-[var(--color-surface-subtle)] p-5">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">Antelacion minima</p>
                  <input
                    type="number"
                    min={1}
                    value={formState.bookingLeadTimeHours}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        bookingLeadTimeHours: Number(event.target.value),
                      }))
                    }
                    className="ux-input mt-3"
                  />
                </div>
                <div className="rounded-[24px] bg-[var(--color-surface-subtle)] p-5">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">Ventana de cancelacion</p>
                  <input
                    type="number"
                    min={1}
                    value={formState.cancellationWindowHours}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        cancellationWindowHours: Number(event.target.value),
                      }))
                    }
                    className="ux-input mt-3"
                  />
                </div>
              </div>

              <div className="rounded-[24px] border border-[var(--color-border-subtle)] p-5">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">Catalogo activo</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {services.map((service) => (
                    <div key={service.id} className="rounded-2xl bg-[var(--color-surface-subtle)] px-4 py-3">
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">{service.name}</p>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {service.duration} min · ${service.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "notificaciones" ? (
            <div className="ux-card space-y-4 p-6">
              <p className="ux-overline">Recordatorios y feedback</p>
              <div className="rounded-[24px] border border-[var(--color-border-subtle)] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">Recordatorios automaticos</p>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      Mantiene al equipo y al cliente alineados sobre la reserva creada.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormState((current) => ({
                        ...current,
                        reminderEnabled: !current.reminderEnabled,
                      }))
                    }
                    className={`h-7 w-14 rounded-full p-1 transition-colors ${
                      formState.reminderEnabled ? "bg-[var(--color-primary)]" : "bg-[var(--color-border-medium)]"
                    }`}
                  >
                    <span
                      className={`block h-5 w-5 rounded-full bg-[var(--color-text-primary)] transition-transform ${
                        formState.reminderEnabled ? "translate-x-7" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "seguridad" ? (
            <div className="ux-card space-y-4 p-6">
              <p className="ux-overline">Criterio de confianza</p>
              <div className="grid gap-4">
                <div className="rounded-[24px] bg-[var(--color-surface-subtle)] p-5 text-sm leading-6 text-[var(--color-text-secondary)]">
                  El rediseño elimina confirmaciones falsas, recursos externos fragiles y puntos donde la interfaz prometia mas de lo que el sistema hacia.
                </div>
                <div className="rounded-[24px] bg-[var(--color-surface-subtle)] p-5 text-sm leading-6 text-[var(--color-text-secondary)]">
                  La cuenta administrativa se representa sin avatares remotos y con foco en permisos y estado del sistema.
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
