import { useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import type {
  AppointmentRecord,
  AppointmentStatus,
  ClientRecord,
  LeadSource,
  SettingsRecord,
} from "../data/spa";
import { defaultSettings, seedAppointments, seedClients } from "../data/spa";

export interface SpaSnapshot {
  appointments: AppointmentRecord[];
  clients: ClientRecord[];
  settings: SettingsRecord;
}

// ─── Hook: reactive snapshot ──────────────────────────────────────────────────

export function useSpaSnapshot(): SpaSnapshot {
  const { isAuthenticated } = useConvexAuth();
  const rawAppointments = useQuery(api.appointments.list, {});
  const rawSettings = useQuery(api.settings.get, {});
  const rawClients = useQuery(
    api.clients.list,
    isAuthenticated ? {} : "skip",
  );

  const appointments: AppointmentRecord[] = useMemo(
    () =>
      (rawAppointments ?? seedAppointments).map((a) => ({
        id: a.id as string,
        serviceId: a.serviceId,
        serviceName: a.serviceName,
        categoryId: a.categoryId,
        staff: a.staff,
        startsAt: a.startsAt,
        duration: a.duration,
        price: a.price,
        status: a.status as AppointmentStatus,
        customerName: a.customerName,
        email: a.email,
        phone: a.phone,
        origin: a.origin as LeadSource,
        notes: a.notes,
        createdAt: a.createdAt,
      })),
    [rawAppointments],
  );

  const clients: ClientRecord[] = useMemo(
    () =>
      (rawClients ?? (isAuthenticated ? [] : seedClients)).map((c) => ({
        id: c.id as string,
        name: c.name,
        email: c.email,
        phone: c.phone,
        preferredService: c.preferredService ?? "",
        totalVisits: c.totalVisits,
        totalSpent: c.totalSpent,
        origin: c.origin as LeadSource,
        nextAppointment: c.nextAppointment,
        notes: c.notes,
        createdAt: c.createdAt,
      })),
    [rawClients, isAuthenticated],
  );

  const settings: SettingsRecord = useMemo(
    () => rawSettings ?? defaultSettings,
    [rawSettings],
  );

  return useMemo(
    () => ({ appointments, clients, settings }),
    [appointments, clients, settings],
  );
}

// ─── Standalone hooks for write operations ────────────────────────────────────

export function useSaveBooking() {
  const bookMutation = useMutation(api.appointments.book);

  return async (payload: {
    serviceId: string;
    date: string;
    time: string;
    customerName: string;
    email: string;
    phone: string;
    origin: LeadSource;
    notes?: string;
  }): Promise<AppointmentRecord> => {
    const result = await bookMutation(payload);
    return {
      id: result.id as string,
      serviceId: result.serviceId,
      serviceName: result.serviceName,
      categoryId: result.categoryId,
      staff: result.staff,
      startsAt: result.startsAt,
      duration: result.duration,
      price: result.price,
      status: result.status as AppointmentStatus,
      customerName: result.customerName,
      email: result.email,
      phone: result.phone,
      origin: result.origin as LeadSource,
      notes: result.notes,
      createdAt: result.createdAt,
    };
  };
}

export function useAddManualAppointment() {
  const mutation = useMutation(api.appointments.addManual);

  return async (payload: {
    serviceId: string;
    customerName: string;
    email: string;
    phone: string;
    origin: LeadSource;
    date: string;
    time: string;
    status?: AppointmentStatus;
    notes?: string;
  }): Promise<AppointmentRecord> => {
    const result = await mutation(payload);
    return {
      id: result.id as string,
      serviceId: result.serviceId,
      serviceName: result.serviceName,
      categoryId: result.categoryId,
      staff: result.staff,
      startsAt: result.startsAt,
      duration: result.duration,
      price: result.price,
      status: result.status as AppointmentStatus,
      customerName: result.customerName,
      email: result.email,
      phone: result.phone,
      origin: result.origin as LeadSource,
      notes: result.notes,
      createdAt: result.createdAt,
    };
  };
}

export function useUpdateAppointmentStatus() {
  const mutation = useMutation(api.appointments.updateStatus);

  return async (appointmentId: string, status: AppointmentStatus): Promise<void> => {
    await mutation({ id: appointmentId as Id<"appointments">, status });
  };
}

export function useAddClient() {
  const mutation = useMutation(api.clients.add);

  return async (payload: {
    name: string;
    email: string;
    phone: string;
    preferredService?: string;
    origin: LeadSource;
    notes?: string;
  }): Promise<ClientRecord> => {
    const result = await mutation(payload);
    return {
      id: result.id as string,
      name: result.name,
      email: result.email,
      phone: result.phone,
      preferredService: result.preferredService ?? "",
      totalVisits: result.totalVisits,
      totalSpent: result.totalSpent,
      origin: result.origin as LeadSource,
      nextAppointment: result.nextAppointment,
      notes: result.notes,
      createdAt: result.createdAt,
    };
  };
}

export function useUpdateSettings() {
  const mutation = useMutation(api.settings.update);
  return mutation;
}

// ─── Analytics helpers (pure, based on cached appointments) ──────────────────

export function getWeeklyOverview(appointments: AppointmentRecord[]) {
  const weeks = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];
  return weeks.map((label, index) => {
    const filtered = appointments.filter((a) => {
      const start = new Date();
      start.setDate(start.getDate() - 28 + index * 7);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      const current = new Date(a.startsAt);
      return current >= start && current < end;
    });
    return {
      name: label,
      citas: filtered.length,
      ingresos: filtered.reduce((sum, a) => sum + a.price, 0),
    };
  });
}

export function getSourceDistribution(appointments: AppointmentRecord[]) {
  const totals = new Map<LeadSource, number>();
  appointments.forEach((a) => {
    totals.set(a.origin, (totals.get(a.origin) ?? 0) + 1);
  });
  const total = Array.from(totals.values()).reduce((sum, v) => sum + v, 0) || 1;
  return Array.from(totals.entries()).map(([name, value], index) => ({
    name,
    value: Math.round((value / total) * 100),
    color: ["#111111", "#825b39", "#c28d58", "#d8c0a5", "#8aa08a"][index % 5],
  }));
}
