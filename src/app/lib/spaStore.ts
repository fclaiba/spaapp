import { useEffect, useState } from "react";

import {
  type AppointmentRecord,
  type AppointmentStatus,
  type ClientRecord,
  type LeadSource,
  type SettingsRecord,
  services,
  seedAppointments,
  seedClients,
  defaultSettings,
} from "../data/spa";

const APPOINTMENTS_KEY = "spa-app-appointments";
const CLIENTS_KEY = "spa-app-clients";
const SETTINGS_KEY = "spa-app-settings";
const STORE_EVENT = "spa-store-updated";

export interface BookingPayload {
  serviceId: string;
  date: string;
  time: string;
  customerName: string;
  email: string;
  phone: string;
  origin: LeadSource;
  notes?: string;
}

export interface ManualAppointmentPayload {
  serviceId: string;
  customerName: string;
  email: string;
  phone: string;
  origin: LeadSource;
  date: string;
  time: string;
  status?: AppointmentStatus;
  notes?: string;
}

export interface ClientInput {
  name: string;
  email: string;
  phone: string;
  preferredService: string;
  origin: LeadSource;
  notes?: string;
}

export interface SpaSnapshot {
  appointments: AppointmentRecord[];
  clients: ClientRecord[];
  settings: SettingsRecord;
}

const isBrowser = () => typeof window !== "undefined";

const safeRead = <T,>(key: string, fallback: T): T => {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const safeWrite = <T,>(key: string, value: T) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

const emitStoreUpdate = () => {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(STORE_EVENT));
};

const buildDateTime = (date: string, time: string) => {
  const isoString = new Date(`${date}T${time}:00`).toISOString();
  return isoString;
};

const getService = (serviceId: string) => {
  const service = services.find((item) => item.id === serviceId);
  if (!service) {
    throw new Error(`Unknown service "${serviceId}"`);
  }

  return service;
};

const readCustomAppointments = () => safeRead<AppointmentRecord[]>(APPOINTMENTS_KEY, []);

const writeCustomAppointments = (items: AppointmentRecord[]) => {
  safeWrite(APPOINTMENTS_KEY, items);
  emitStoreUpdate();
};

const readStoredClients = () => safeRead<ClientRecord[]>(CLIENTS_KEY, []);

const writeStoredClients = (items: ClientRecord[]) => {
  safeWrite(CLIENTS_KEY, items);
  emitStoreUpdate();
};

const deriveClientsFromAppointments = (appointments: AppointmentRecord[]) => {
  const map = new Map<string, ClientRecord>();

  appointments.forEach((appointment) => {
    const existing = map.get(appointment.email);
    const nextAppointment =
      new Date(appointment.startsAt).getTime() > Date.now()
        ? appointment.startsAt
        : existing?.nextAppointment;

    if (existing) {
      existing.totalVisits += 1;
      existing.totalSpent += appointment.price;
      existing.preferredService = appointment.serviceName;
      existing.nextAppointment = nextAppointment;
      if (appointment.notes) {
        existing.notes = appointment.notes;
      }
      return;
    }

    map.set(appointment.email, {
      id: `client-${appointment.id}`,
      name: appointment.customerName,
      email: appointment.email,
      phone: appointment.phone,
      preferredService: appointment.serviceName,
      totalVisits: 1,
      totalSpent: appointment.price,
      origin: appointment.origin,
      nextAppointment,
      notes: appointment.notes,
      createdAt: appointment.createdAt,
    });
  });

  return Array.from(map.values());
};

export const getSettings = () =>
  ({ ...defaultSettings, ...safeRead<Partial<SettingsRecord>>(SETTINGS_KEY, {}) }) satisfies SettingsRecord;

export const getAppointments = () => {
  const merged = new Map<string, AppointmentRecord>();

  seedAppointments.forEach((appointment) => merged.set(appointment.id, appointment));
  readCustomAppointments().forEach((appointment) => merged.set(appointment.id, appointment));

  return Array.from(merged.values()).sort(
    (left, right) => new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime(),
  );
};

export const getClients = () => {
  const derived = deriveClientsFromAppointments(getAppointments());
  const manualClients = readStoredClients();
  const merged = new Map<string, ClientRecord>();

  [...seedClients, ...manualClients, ...derived].forEach((client) => {
    const existing = merged.get(client.email);
    if (!existing) {
      merged.set(client.email, client);
      return;
    }

    merged.set(client.email, {
      ...existing,
      ...client,
      totalVisits: Math.max(existing.totalVisits, client.totalVisits),
      totalSpent: Math.max(existing.totalSpent, client.totalSpent),
      nextAppointment: existing.nextAppointment ?? client.nextAppointment,
    });
  });

  return Array.from(merged.values()).sort((left, right) => left.name.localeCompare(right.name));
};

export const getSpaSnapshot = (): SpaSnapshot => ({
  appointments: getAppointments(),
  clients: getClients(),
  settings: getSettings(),
});

export const saveBooking = (payload: BookingPayload) => {
  const service = getService(payload.serviceId);
  const appointment: AppointmentRecord = {
    id: `apt-${Date.now()}`,
    serviceId: service.id,
    serviceName: service.name,
    categoryId: service.categoryId,
    staff: service.categoryId === "laser" ? "Mateo Silva" : "Clara Vega",
    startsAt: buildDateTime(payload.date, payload.time),
    duration: service.duration,
    price: service.price,
    status: "Pendiente",
    customerName: payload.customerName,
    email: payload.email,
    phone: payload.phone,
    origin: payload.origin,
    notes: payload.notes,
    createdAt: new Date().toISOString(),
  };

  writeCustomAppointments([...readCustomAppointments(), appointment]);
  return appointment;
};

export const addManualAppointment = (payload: ManualAppointmentPayload) => {
  const service = getService(payload.serviceId);
  const appointment: AppointmentRecord = {
    id: `apt-${Date.now()}`,
    serviceId: service.id,
    serviceName: service.name,
    categoryId: service.categoryId,
    staff: service.categoryId === "laser" ? "Mateo Silva" : "Dra. Isabella Rossi",
    startsAt: buildDateTime(payload.date, payload.time),
    duration: service.duration,
    price: service.price,
    status: payload.status ?? "Confirmada",
    customerName: payload.customerName,
    email: payload.email,
    phone: payload.phone,
    origin: payload.origin,
    notes: payload.notes,
    createdAt: new Date().toISOString(),
  };

  writeCustomAppointments([...readCustomAppointments(), appointment]);
  return appointment;
};

export const updateAppointmentStatus = (appointmentId: string, status: AppointmentStatus) => {
  const customAppointments = readCustomAppointments();
  const existingCustom = customAppointments.find((appointment) => appointment.id === appointmentId);

  if (existingCustom) {
    writeCustomAppointments(
      customAppointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, status } : appointment,
      ),
    );
    return;
  }

  const seedAppointment = seedAppointments.find((appointment) => appointment.id === appointmentId);
  if (!seedAppointment) {
    return;
  }

  writeCustomAppointments([...customAppointments, { ...seedAppointment, status }]);
};

export const addClient = (payload: ClientInput) => {
  const clients = readStoredClients();
  const client: ClientRecord = {
    id: `client-${Date.now()}`,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    preferredService: payload.preferredService,
    totalVisits: 0,
    totalSpent: 0,
    origin: payload.origin,
    notes: payload.notes,
    createdAt: new Date().toISOString(),
  };

  writeStoredClients([...clients, client]);
  return client;
};

export const updateSettings = (payload: Partial<SettingsRecord>) => {
  safeWrite(SETTINGS_KEY, { ...getSettings(), ...payload });
  emitStoreUpdate();
};

export const getWeeklyOverview = () => {
  const weeks = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];
  return weeks.map((label, index) => {
    const appointments = getAppointments().filter((appointment) => {
      const start = new Date();
      start.setDate(start.getDate() - 28 + index * 7);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(start.getDate() + 7);

      const current = new Date(appointment.startsAt);
      return current >= start && current < end;
    });

    return {
      name: label,
      citas: appointments.length,
      ingresos: appointments.reduce((sum, appointment) => sum + appointment.price, 0),
    };
  });
};

export const getSourceDistribution = () => {
  const totals = new Map<LeadSource, number>();
  getAppointments().forEach((appointment) => {
    totals.set(appointment.origin, (totals.get(appointment.origin) ?? 0) + 1);
  });

  const totalAppointments = Array.from(totals.values()).reduce((sum, value) => sum + value, 0) || 1;

  return Array.from(totals.entries()).map(([name, value], index) => ({
    name,
    value: Math.round((value / totalAppointments) * 100),
    color: ["#111111", "#825b39", "#c28d58", "#d8c0a5", "#8aa08a"][index % 5],
  }));
};

export const useSpaSnapshot = () => {
  const [snapshot, setSnapshot] = useState<SpaSnapshot>(getSpaSnapshot());

  useEffect(() => {
    if (!isBrowser()) {
      return undefined;
    }

    const handleUpdate = () => setSnapshot(getSpaSnapshot());

    window.addEventListener("storage", handleUpdate);
    window.addEventListener(STORE_EVENT, handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener(STORE_EVENT, handleUpdate);
    };
  }, []);

  return snapshot;
};
