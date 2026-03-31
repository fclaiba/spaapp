import { Router } from "express";
import { AppointmentStatus, Prisma, Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../db/client.js";
import { created, ok } from "../lib/http.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { fromAppointmentStatus, fromLeadSource, toAppointmentStatus, toLeadSource } from "../lib/mappers.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { writeAuditLog } from "../lib/audit.js";

const createAppointmentSchema = z.object({
  serviceId: z.string().min(1),
  date: z.string().min(1),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  origin: z.enum(["Instagram", "Google", "Referido", "WhatsApp", "Walk-in"]),
  notes: z.string().max(240).optional(),
});

const createManualAppointmentSchema = z.object({
  serviceId: z.string().min(1),
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  origin: z.enum(["Instagram", "Google", "Referido", "WhatsApp", "Walk-in"]),
  date: z.string().min(1),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  status: z.enum(["Pendiente", "Confirmada", "En sala", "Completada", "Cancelada"]).optional(),
  notes: z.string().max(240).optional(),
});

const listAppointmentsQuerySchema = z.object({
  date: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  search: z.string().optional(),
});

const updateAppointmentStatusSchema = z.object({
  status: z.enum(["Pendiente", "Confirmada", "En sala", "Completada", "Cancelada"]),
});

const buildDateTime = (date: string, time: string) => new Date(`${date}T${time}:00`);

type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
  include: { service: true; client: true };
}>;

const mapAppointment = (appointment: AppointmentWithRelations) => ({
  id: appointment.id,
  serviceId: appointment.serviceId,
  serviceName: appointment.service.name,
  categoryId: appointment.service.categoryId,
  staff: appointment.staff,
  startsAt: appointment.startsAt.toISOString(),
  duration: appointment.duration,
  price: appointment.price,
  status: fromAppointmentStatus(appointment.status),
  customerName: appointment.client.name,
  email: appointment.client.email,
  phone: appointment.client.phone,
  origin: fromLeadSource(appointment.source),
  notes: appointment.notes ?? undefined,
  createdAt: appointment.createdAt.toISOString(),
});

async function upsertClient(input: {
  customerName: string;
  email: string;
  phone: string;
  origin: string;
  preferredService: string;
  notes?: string;
}) {
  const existing = await prisma.client.findUnique({ where: { email: input.email } });
  if (existing) {
    return prisma.client.update({
      where: { id: existing.id },
      data: {
        name: input.customerName,
        phone: input.phone,
        preferredService: input.preferredService,
        origin: toLeadSource(input.origin),
        notes: input.notes ?? existing.notes,
      },
    });
  }

  return prisma.client.create({
    data: {
      name: input.customerName,
      email: input.email,
      phone: input.phone,
      preferredService: input.preferredService,
      origin: toLeadSource(input.origin),
      notes: input.notes,
    },
  });
}

export const appointmentsRouter = Router();

appointmentsRouter.post("/appointments", validate(createAppointmentSchema), async (req, res, next) => {
  try {
    const idempotencyKey = req.header("x-idempotency-key");
    if (idempotencyKey) {
      const existingKey = await prisma.idempotencyKey.findUnique({ where: { key: idempotencyKey } });
      if (existingKey) {
        return ok(res, existingKey.response);
      }
    }

    const payload = req.body;
    const startsAt = buildDateTime(payload.date, payload.time);
    if (Number.isNaN(startsAt.getTime())) {
      return next(badRequest("Invalid date/time"));
    }

    const settings = await prisma.settings.findFirst();
    if (!settings) {
      return next(notFound("Settings not configured"));
    }

    const minAllowed = new Date(Date.now() + settings.bookingLeadTimeHours * 60 * 60 * 1000);
    if (startsAt < minAllowed) {
      return next(
        conflict(`Booking must be created at least ${settings.bookingLeadTimeHours} hours in advance.`),
      );
    }

    const service = await prisma.service.findUnique({ where: { externalId: payload.serviceId } });
    if (!service) {
      return next(notFound("Service not found"));
    }

    const staff = service.categoryId === "laser" ? "Mateo Silva" : "Clara Vega";
    const slotConflict = await prisma.appointment.findFirst({
      where: {
        staff,
        startsAt,
        status: { not: AppointmentStatus.Cancelada },
      },
    });
    if (slotConflict) {
      return next(conflict("Selected slot is already reserved for this specialist."));
    }

    const client = await upsertClient({
      customerName: payload.customerName,
      email: payload.email,
      phone: payload.phone,
      origin: payload.origin,
      preferredService: service.name,
      notes: payload.notes,
    });

    const appointment = await prisma.appointment.create({
      data: {
        serviceId: service.id,
        clientId: client.id,
        staff,
        startsAt,
        duration: service.duration,
        price: service.price,
        status: AppointmentStatus.Pendiente,
        source: toLeadSource(payload.origin),
        notes: payload.notes,
        idempotencyKey: idempotencyKey ?? undefined,
      },
      include: {
        service: true,
        client: true,
      },
    });

    await prisma.client.update({
      where: { id: client.id },
      data: {
        totalVisits: { increment: 1 },
        totalSpent: { increment: service.price },
        nextAppointment: startsAt,
      },
    });

    const response = mapAppointment(appointment);
    if (idempotencyKey) {
      await prisma.idempotencyKey.create({
        data: {
          key: idempotencyKey,
          scope: "appointments.create",
          response: response as unknown as object,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
    }

    return created(res, response);
  } catch (error) {
    return next(error);
  }
});

appointmentsRouter.post(
  "/appointments/manual",
  requireAuth,
  requireRole(Role.admin, Role.operator),
  validate(createManualAppointmentSchema),
  async (req, res, next) => {
    try {
      const payload = req.body;
      const service = await prisma.service.findUnique({ where: { externalId: payload.serviceId } });
      if (!service) {
        return next(notFound("Service not found"));
      }

      const client = await upsertClient({
        customerName: payload.customerName,
        email: payload.email,
        phone: payload.phone,
        origin: payload.origin,
        preferredService: service.name,
        notes: payload.notes,
      });

      const appointment = await prisma.appointment.create({
        data: {
          serviceId: service.id,
          clientId: client.id,
          staff: service.categoryId === "laser" ? "Mateo Silva" : "Dra. Isabella Rossi",
          startsAt: buildDateTime(payload.date, payload.time),
          duration: service.duration,
          price: service.price,
          status: toAppointmentStatus(payload.status ?? "Confirmada"),
          source: toLeadSource(payload.origin),
          notes: payload.notes,
          updatedByUserId: req.authUser?.id,
        },
        include: {
          service: true,
          client: true,
        },
      });

      await writeAuditLog({
        action: "appointment.manual_created",
        entityType: "appointment",
        entityId: appointment.id,
        actorId: req.authUser?.id,
        requestId: req.requestId,
        after: appointment,
      });

      return created(res, mapAppointment(appointment));
    } catch (error) {
      return next(error);
    }
  },
);

appointmentsRouter.get("/appointments", validate(listAppointmentsQuerySchema, "query"), async (req, res, next) => {
  try {
    const { date, status, source, search } = listAppointmentsQuerySchema.parse(req.query);
    const appointments = await prisma.appointment.findMany({
      where: {
        startsAt: date
          ? {
              gte: new Date(`${date}T00:00:00`),
              lt: new Date(`${date}T23:59:59`),
            }
          : undefined,
        status: status && status !== "Todos" ? toAppointmentStatus(status) : undefined,
        source: source ? toLeadSource(source) : undefined,
        OR: search
          ? [
              { client: { name: { contains: search, mode: "insensitive" } } },
              { client: { email: { contains: search, mode: "insensitive" } } },
              { service: { name: { contains: search, mode: "insensitive" } } },
            ]
          : undefined,
      },
      include: {
        service: true,
        client: true,
      },
      orderBy: {
        startsAt: "asc",
      },
    });

    return ok(res, appointments.map(mapAppointment));
  } catch (error) {
    return next(error);
  }
});

appointmentsRouter.patch(
  "/appointments/:id/status",
  requireAuth,
  requireRole(Role.admin, Role.operator),
  validate(updateAppointmentStatusSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const existing = await prisma.appointment.findUnique({
        where: { id },
        include: { client: true, service: true },
      });
      if (!existing) {
        return next(notFound("Appointment not found"));
      }

      const updated = await prisma.appointment.update({
        where: { id },
        data: {
          status: toAppointmentStatus(status),
          updatedByUserId: req.authUser?.id,
        },
        include: { client: true, service: true },
      });

      await writeAuditLog({
        action: "appointment.status_updated",
        entityType: "appointment",
        entityId: id,
        actorId: req.authUser?.id,
        requestId: req.requestId,
        before: { status: existing.status },
        after: { status: updated.status },
      });

      return ok(res, mapAppointment(updated));
    } catch (error) {
      return next(error);
    }
  },
);
