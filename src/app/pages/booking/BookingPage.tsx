import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import * as z from "zod";
import { useMutation } from "convex/react";

import {
  serviceCategories,
  services,
  type AppointmentRecord,
  type AppointmentStatus,
  type LeadSource,
} from "../../data/spa";
import { useSaveBooking } from "../../lib/spaStore";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

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
  { id: 3, label: "Datos" },
  { id: 4, label: "Pago" },
];

// ─── Mock payment form ────────────────────────────────────────────────────────

interface MockPaymentFormProps {
  appointmentId: Id<"appointments">;
  price: number;
  serviceName: string;
  onSuccess: () => void;
  onBack: () => void;
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function MockPaymentForm({ appointmentId, price, serviceName, onSuccess, onBack }: MockPaymentFormProps) {
  const confirmPayment = useMutation(api.payments.confirmPayment);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormComplete =
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiry.length === 5 &&
    cvv.length >= 3 &&
    cardName.trim().length >= 2;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1800));

      // Confirm in DB
      await confirmPayment({
        appointmentId,
        paymentIntentId: `mock_${Date.now()}`,
      });

      onSuccess();
    } catch {
      setError("Error al procesar el pago simulado. Intenta nuevamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={(e) => { void handlePay(e); }} className="space-y-6">
      <div>
        <p className="ux-overline">Paso 4</p>
        <h2 className="ux-h2 mt-3">Paga para confirmar tu cita.</h2>
        <p className="ux-body mt-3">
          Tu reserva queda confirmada en cuanto el pago es aprobado.
        </p>
      </div>

      {/* Order summary */}
      <div className="rounded-[24px] bg-[var(--color-surface-subtle)] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
              Total a pagar
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{serviceName}</p>
          </div>
          <p className="text-2xl font-semibold text-[var(--color-text-primary)]">${price}</p>
        </div>
      </div>

      {/* Card fields */}
      <div className="space-y-4 rounded-[24px] border border-[var(--color-border-subtle)] p-5">
        <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] pb-4">
          <CreditCard size={18} className="text-[var(--color-accent)]" />
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">Datos de tarjeta</span>
          <Lock size={13} className="ml-auto text-[var(--color-text-tertiary)]" />
          <span className="text-[11px] text-[var(--color-text-tertiary)]">Simulado</span>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
            Número de tarjeta
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="4242 4242 4242 4242"
            className="ux-input font-mono tracking-widest"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
              Vencimiento
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/AA"
              className="ux-input"
            />
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
              CVV
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="123"
              className="ux-input"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
            Nombre en la tarjeta
          </label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Ej. ANA GARCIA"
            className="ux-input uppercase"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-2xl bg-[var(--color-surface-subtle)] px-4 py-3 text-sm text-[var(--color-danger)]">
          {error}
        </p>
      )}

      <div className="flex flex-col justify-between gap-3 border-t border-[var(--color-border-subtle)] pt-5 sm:flex-row">
        <button type="button" onClick={onBack} className="ux-btn-secondary" disabled={isProcessing}>
          Atras
        </button>
        <button
          type="submit"
          disabled={!isFormComplete || isProcessing}
          className="ux-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CreditCard size={16} />
          {isProcessing ? "Procesando pago..." : `Pagar $${price} y confirmar`}
        </button>
      </div>
    </form>
  );
}

// ─── BookingPage ──────────────────────────────────────────────────────────────

export function BookingPage() {
  const saveBooking = useSaveBooking();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("categoria");
  const initialCategoryId = serviceCategories.some((c) => c.id === initialCategory)
    ? (initialCategory as string)
    : serviceCategories[0].id;

  const [step, setStep] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [confirmedAppointment, setConfirmedAppointment] = useState<AppointmentRecord | null>(null);
  const [pendingAppointment, setPendingAppointment] = useState<AppointmentRecord | null>(null);

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
    () => services.filter((s) => s.categoryId === selectedCategoryId),
    [selectedCategoryId],
  );

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId) ?? null,
    [selectedServiceId],
  );

  const selectedDateLabel = next10Days.find((d) => d.iso === selectedDate)?.fullLabel;

  const goToNextStep = () => setStep((s) => Math.min(s + 1, 4));
  const goToPrevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (values: FormValues) => {
    if (!selectedServiceId || !selectedDate || !selectedTime) return;

    try {
      const appointment = await saveBooking({
        serviceId: selectedServiceId,
        date: selectedDate,
        time: selectedTime,
        customerName: values.nombre,
        email: values.email,
        phone: values.telefono,
        origin: values.origen as LeadSource,
        notes: values.notas,
      });

      setPendingAppointment(appointment);
      setStep(4);
    } catch {
      form.setError("root", {
        message: "No pudimos registrar la reserva. Intenta nuevamente.",
      });
    }
  };

  const handlePaymentSuccess = () => {
    if (!pendingAppointment) return;
    setConfirmedAppointment({ ...pendingAppointment, status: "Confirmada" as AppointmentStatus });
  };

  // ── Success screen ──────────────────────────────────────────────────────────

  if (confirmedAppointment && selectedService) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="ux-card p-8 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-subtle)]">
            <CheckCircle2 size={32} className="text-[var(--color-success)]" />
          </div>
          <p className="ux-overline mt-6">Pago aprobado</p>
          <h1 className="ux-h2 mt-4">Tu cita está confirmada.</h1>
          <p className="ux-body mx-auto mt-4 max-w-xl">
            El pago fue procesado y tu reserva quedó confirmada. El equipo ya la puede ver en el panel de citas.
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
            <div className="rounded-[24px] p-5" style={{ background: "linear-gradient(135deg, #d4af37, #f2ca50)" }}>
              <p className="ux-caption uppercase text-[#554300]/70">Estado</p>
              <p className="mt-2 text-base font-semibold text-[#554300]">{confirmedAppointment.status}</p>
            </div>
            <div className="rounded-[24px] border border-[var(--color-border-subtle)] p-5">
              <p className="ux-caption uppercase">Referencia</p>
              <p className="mt-2 truncate text-base font-semibold text-[var(--color-text-primary)]">
                {confirmedAppointment.id}
              </p>
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

  // ── Main flow ───────────────────────────────────────────────────────────────

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="ux-card p-6 sm:p-8">
        {/* Step indicator */}
        <div className="mb-8 flex flex-wrap gap-3">
          {bookingSteps.map((item) => (
            <div
              key={item.id}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                step === item.id
                  ? "bg-[var(--color-accent-soft)] text-[var(--color-primary)] border border-[var(--color-primary)]"
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
          {/* ── Step 1: Service ── */}
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
                        ? "bg-[var(--color-accent-soft)] text-[var(--color-primary)] border border-[var(--color-primary)]"
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
                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={!selectedServiceId}
                  className="ux-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continuar
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Schedule ── */}
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

          {/* ── Step 3: Personal data ── */}
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
                <h2 className="ux-h2 mt-3">Confirma tus datos para la reserva.</h2>
                <p className="ux-body mt-3">
                  Completá tu información y continuá al pago para confirmar la cita.
                </p>
              </div>

              <form id="booking-form" onSubmit={form.handleSubmit((v) => { void handleSubmit(v); })} className="grid gap-4">
                {form.formState.errors.root ? (
                  <p className="rounded-2xl bg-[var(--color-surface-subtle)] px-4 py-3 text-sm text-[var(--color-danger)]">
                    {form.formState.errors.root.message}
                  </p>
                ) : null}

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
                      <input {...form.register("telefono")} className="ux-input pl-11" placeholder="+57 300..." />
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
                  <button
                    type="submit"
                    className="ux-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!form.formState.isValid}
                  >
                    Ir al pago
                    <ChevronRight size={16} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ── Step 4: Payment ── */}
          {step === 4 && pendingAppointment && selectedService && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <MockPaymentForm
                appointmentId={pendingAppointment.id as Id<"appointments">}
                price={selectedService.price}
                serviceName={selectedService.name}
                onSuccess={handlePaymentSuccess}
                onBack={goToPrevStep}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Aside ── */}
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
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Como funciona</p>
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-text-secondary)]">
            <li className="rounded-2xl bg-[var(--color-surface-subtle)] px-4 py-3">
              Elige servicio, fecha y hora.
            </li>
            <li className="rounded-2xl bg-[var(--color-surface-subtle)] px-4 py-3">
              Completa tus datos y pasa al pago.
            </li>
            <li className="rounded-2xl bg-[var(--color-surface-subtle)] px-4 py-3">
              El pago confirma tu cita al instante.
            </li>
          </ul>
        </div>

        <div className="ux-card p-6">
          <div className="flex items-center gap-2">
            <Clock3 size={18} className="text-[var(--color-accent)]" />
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Politica simple</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
            Reprogramacion o cancelacion sin costo hasta 24 horas antes del turno.
          </p>
        </div>
      </aside>
    </div>
  );
}
