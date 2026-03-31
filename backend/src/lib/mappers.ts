import { AppointmentStatus, LeadSource } from "@prisma/client";

const leadSourceMap: Record<string, LeadSource> = {
  Instagram: LeadSource.Instagram,
  Google: LeadSource.Google,
  Referido: LeadSource.Referido,
  WhatsApp: LeadSource.WhatsApp,
  "Walk-in": LeadSource.WalkIn,
  WalkIn: LeadSource.WalkIn,
};

const statusMap: Record<string, AppointmentStatus> = {
  Pendiente: AppointmentStatus.Pendiente,
  Confirmada: AppointmentStatus.Confirmada,
  "En sala": AppointmentStatus.EnSala,
  EnSala: AppointmentStatus.EnSala,
  Completada: AppointmentStatus.Completada,
  Cancelada: AppointmentStatus.Cancelada,
};

export const toLeadSource = (value: string) => leadSourceMap[value] ?? LeadSource.Instagram;
export const toAppointmentStatus = (value: string) =>
  statusMap[value] ?? AppointmentStatus.Pendiente;

export const fromLeadSource = (value: LeadSource) => (value === LeadSource.WalkIn ? "Walk-in" : value);
export const fromAppointmentStatus = (value: AppointmentStatus) =>
  value === AppointmentStatus.EnSala ? "En sala" : value;
