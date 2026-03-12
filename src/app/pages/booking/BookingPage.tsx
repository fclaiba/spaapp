import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, CheckCircle2, ChevronRight, Clock3, Mail, Phone, User } from "lucide-react";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import * as z from "zod";

import { serviceCategories, services, type AppointmentRecord, type LeadSource } from "../../data/spa";
import { saveBooking } from "../../lib/spaStore";

const availableTimes = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00", "18:30"];

const formSchema = z.object({
  nombre: z.string().min(2, "Ingresa tu nombre completo."),
  email: z.string().email("Ingresa un email valido."),
  telefono: z.string().min(8, "Ingresa un telefono valido."),
  origen: z.enum(["Instagram", "Google", "Referido", "WhatsApp", "Walk-in"]),
  notas: z.string().max(240, "Usa un maximo de 240 caracteres.").optional(),
});

type FormValues = z.infer<typeof formSchema>;

const bookingSteps = [
  { id: 1, label: "Servicio" },
  { id: 2, label: "Horario" },
  { id: 3, label: "Confirmacion" },
];

export function BookingPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("categoria");
  const initialCategoryId = serviceCategories.some((category) => category.id === initialCategory)
    ? (initialCategory as string)
    : serviceCategories[0].id;

  const [step, setStep] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [confirmedAppointment, setConfirmedAppointment] = useState<AppointmentRecord | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      origen: "Instagram",
      notas: "",
    },
  });

  const next10Days = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => {
        const date = addDays(new Date(), index + 1);
        return {
          iso: format(date, "yyyy-MM-dd"),
          label: format(date, "EEE d MMM", { locale: es }),
          fullLabel: format(date, "EEEE d 'de' MMMM", { locale: es }),
        };
      }),
    [],
  );

  const servicesForCategory = useMemo(
    () => services.filter((service) => service.categoryId === selectedCategoryId),
    [selectedCategoryId],
  );

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? null,
    [selectedServiceId],
  );

  const selectedDateLabel = next10Days.find((date) => date.iso === selectedDate)?.fullLabel;

  const goToNextStep = () => setStep((current) => Math.min(current + 1, 3));
  const goToPrevStep = () => setStep((current) => Math.max(current - 1, 1));

  const handleSubmit = (values: FormValues) => {
    if (!selectedServiceId || !selectedDate || !selectedTime) {
      return;
    }

    const appointment = saveBooking({
      serviceId: selectedServiceId,
      date: selectedDate,
      time: selectedTime,
      customerName: values.nombre,
      email: values.email,
      phone: values.telefono,
      origin: values.origen as LeadSource,
      notes: values.notas,
    });

    setConfirmedAppointment(appointment);
  };

  if (confirmedAppointment && selectedService) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="ux-card p-8 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-subtle)]">
            <CheckCircle2 size={32} className="text-[var(--color-success)]" />
          </div>
          <p className="ux-overline mt-6">Reserva registrada</p>
          <h1 className="ux-h2 mt-4">Tu cita ya esta en el sistema y disponible para seguimiento.</h1>
          <p className="ux-body mx-auto mt-4 max-w-xl">
            Eliminamos la confirmacion falsa: esta reserva se guardo y ya puede verse desde el panel administrativo.
          </p>

          <div className="mx-auto mt-8 grid max-w-2xl gap-4 text-left sm:grid-cols-2">
            <div className="rounded-[24px] bg-[var(--color-surface-subtle)] p-5">
              <p className="ux-caption uppercase">Servicio</p>
              <p className="mt-2 text-base font-semibold text-[var(--color-text-primary)]">{selectedService.name}</p>
            </div>
            <div className="rounded-[24px] bg-[var(--color-surface-subtle)] p-5">
              <p className="ux-caption uppercase">Fecha y hora</p>
              <p className="mt-2 text-base font-semibold text-[var(--color-text-primary)]">
                {selectedDateLabel}, {selectedTime}
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--color-border-subtle)] p-5">
              <p className="ux-caption uppercase">Estado inicial</p>
              <p className="mt-2 text-base font-semibold text-[var(--color-text-primary)]">{confirmedAppointment.status}</p>
            </div>
            <div className="rounded-[24px] border border-[var(--color-border-subtle)] p-5">
              <p className="ux-caption uppercase">Referencia</p>
              <p className="mt-2 text-base font-semibold text-[var(--color-text-primary)]">{confirmedAppointment.id}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/dashboard/citas" className="ux-btn-primary">
              Ver la cita en admin
            </Link>
            <Link to="/" className="ux-btn-secondary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="ux-card p-6 sm:p-8">
        <div className="mb-8 flex flex-wrap gap-3">
          {bookingSteps.map((item) => (
            <div
              key={item.id}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                step === item.id
                  ? "bg-[var(--color-primary)] text-white"
                  : item.id < step
                    ? "bg-[var(--color-accent-soft)] text-[var(--color-text-primary)]"
                    : "bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]"
              }`}
            >
              {item.id}. {item.label}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="service"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-6"
            >
              <div>
                <p className="ux-overline">Paso 1</p>
                <h2 className="ux-h2 mt-3">Elige el servicio correcto sin leer de mas.</h2>
                <p className="ux-body mt-3">
                  Primero se decide el tratamiento. Todo lo demas aparece despues para reducir carga cognitiva.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {serviceCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategoryId(category.id);
                      setSelectedServiceId("");
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      selectedCategoryId === category.id
                        ? "bg-[var(--color-primary)] text-white"
                        : "border border-[var(--color-border-medium)] text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              <div className="grid gap-4">
                {servicesForCategory.map((service) => {
                  const isSelected = service.id === selectedServiceId;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`rounded-[28px] border p-5 text-left transition-all ${
                        isSelected
                          ? "border-[var(--color-accent)] bg-[var(--color-surface-subtle)]"
                          : "border-[var(--color-border-subtle)] hover:border-[var(--color-accent-soft)]"
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-[var(--color-text-primary)]">{service.name}</p>
                          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{service.summary}</p>
                        </div>
                        <div className="shrink-0 text-left sm:text-right">
                          <p className="text-xl font-semibold text-[var(--color-text-primary)]">${service.price}</p>
                          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{service.duration} min</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={goToNextStep} disabled={!selectedServiceId} className="ux-btn-primary disabled:cursor-not-allowed disabled:opacity-50">
                  Continuar
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-6"
            >
              <div>
                <p className="ux-overline">Paso 2</p>
                <h2 className="ux-h2 mt-3">Escoge una fecha y un horario disponibles.</h2>
                <p className="ux-body mt-3">
                  Solo mostramos las decisiones necesarias para completar la reserva.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">Fecha</p>
                  <div className="grid gap-3">
                    {next10Days.map((date) => (
                      <button
                        key={date.iso}
                        type="button"
                        onClick={() => setSelectedDate(date.iso)}
                        className={`rounded-[24px] border px-4 py-4 text-left ${
                          selectedDate === date.iso
                            ? "border-[var(--color-accent)] bg-[var(--color-surface-subtle)]"
                            : "border-[var(--color-border-subtle)]"
                        }`}
                      >
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{date.label}</p>
                        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{date.fullLabel}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">Horario</p>
                  <div className="grid grid-cols-2 gap-3">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        type="button"
                        disabled={!selectedDate}
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-[24px] border px-4 py-4 text-sm font-semibold ${
                          selectedTime === time
                            ? "border-[var(--color-accent)] bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)]"
                            : "border-[var(--color-border-subtle)] text-[var(--color-text-secondary)]"
                        } disabled:cursor-not-allowed disabled:opacity-40`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-3 border-t border-[var(--color-border-subtle)] pt-5 sm:flex-row">
                <button type="button" onClick={goToPrevStep} className="ux-btn-secondary">
                  Atras
                </button>
                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={!selectedDate || !selectedTime}
                  className="ux-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continuar
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-6"
            >
              <div>
                <p className="ux-overline">Paso 3</p>
                <h2 className="ux-h2 mt-3">Confirma tus datos y envia la reserva.</h2>
                <p className="ux-body mt-3">
                  Quitamos el checkout falso y dejamos una accion honesta: registrar la cita con datos utiles.
                </p>
              </div>

              <form id="booking-form" onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                    <input {...form.register("nombre")} className="ux-input pl-11" placeholder="Ej. Ana Lopez" />
                  </div>
                  {form.formState.errors.nombre ? (
                    <p className="mt-2 text-sm text-[var(--color-danger)]">{form.formState.errors.nombre.message}</p>
                  ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                      <input {...form.register("email")} type="email" className="ux-input pl-11" placeholder="tu@email.com" />
                    </div>
                    {form.formState.errors.email ? (
                      <p className="mt-2 text-sm text-[var(--color-danger)]">{form.formState.errors.email.message}</p>
                    ) : null}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]">Telefono</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                      <input {...form.register("telefono")} className="ux-input pl-11" placeholder="+54 11..." />
                    </div>
                    {form.formState.errors.telefono ? (
                      <p className="mt-2 text-sm text-[var(--color-danger)]">{form.formState.errors.telefono.message}</p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]">
                    Como nos encontraste
                  </label>
                  <select {...form.register("origen")} className="ux-input">
                    {["Instagram", "Google", "Referido", "WhatsApp", "Walk-in"].map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]">Notas</label>
                  <textarea
                    {...form.register("notas")}
                    className="ux-input min-h-28 resize-none"
                    placeholder="Alergias, preferencias o contexto que el equipo deba conocer."
                  />
                  {form.formState.errors.notas ? (
                    <p className="mt-2 text-sm text-[var(--color-danger)]">{form.formState.errors.notas.message}</p>
                  ) : null}
                </div>

                <div className="flex flex-col justify-between gap-3 border-t border-[var(--color-border-subtle)] pt-5 sm:flex-row">
                  <button type="button" onClick={goToPrevStep} className="ux-btn-secondary">
                    Atras
                  </button>
                  <button type="submit" className="ux-btn-primary" disabled={!form.formState.isValid}>
                    Confirmar reserva
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <aside className="space-y-5">
        <div className="ux-card p-6">
          <p className="ux-overline">Resumen</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-[24px] bg-[var(--color-surface-subtle)] p-4">
              <p className="ux-caption uppercase">Servicio</p>
              <p className="mt-2 text-base font-semibold text-[var(--color-text-primary)]">
                {selectedService?.name ?? "Selecciona un servicio"}
              </p>
            </div>
            <div className="rounded-[24px] bg-[var(--color-surface-subtle)] p-4">
              <p className="ux-caption uppercase">Fecha</p>
              <p className="mt-2 text-base font-semibold text-[var(--color-text-primary)]">
                {selectedDateLabel ?? "Elige una fecha"}
              </p>
            </div>
            <div className="rounded-[24px] bg-[var(--color-surface-subtle)] p-4">
              <p className="ux-caption uppercase">Hora</p>
              <p className="mt-2 text-base font-semibold text-[var(--color-text-primary)]">
                {selectedTime || "Elige un horario"}
              </p>
            </div>
          </div>

          {selectedService ? (
            <div className="mt-5 border-t border-[var(--color-border-subtle)] pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Duracion</span>
                <span className="font-semibold text-[var(--color-text-primary)]">{selectedService.duration} min</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Precio</span>
                <span className="font-semibold text-[var(--color-text-primary)]">${selectedService.price}</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="ux-card p-6">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-[var(--color-accent)]" />
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Que pasa despues</p>
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-text-secondary)]">
            <li className="rounded-2xl bg-[var(--color-surface-subtle)] px-4 py-3">
              Tu cita queda registrada inmediatamente.
            </li>
            <li className="rounded-2xl bg-[var(--color-surface-subtle)] px-4 py-3">
              El equipo la ve en el panel de citas y puede cambiar su estado.
            </li>
            <li className="rounded-2xl bg-[var(--color-surface-subtle)] px-4 py-3">
              El flujo ya no promete pagos o confirmaciones que no existen.
            </li>
          </ul>
        </div>

        <div className="ux-card p-6">
          <div className="flex items-center gap-2">
            <Clock3 size={18} className="text-[var(--color-accent)]" />
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Politica simple</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
            Reprogramacion o cancelacion sin costo hasta 24 horas antes del turno. Microcopy util en vez de clausulas invisibles.
          </p>
        </div>
      </aside>
    </div>
  );
}
