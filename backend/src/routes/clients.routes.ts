import { Prisma, Role } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/client.js";
import { created, ok } from "../lib/http.js";
import { fromLeadSource, toLeadSource } from "../lib/mappers.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const listClientsQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

const createClientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  preferredService: z.string().min(2),
  origin: z.enum(["Instagram", "Google", "Referido", "WhatsApp", "Walk-in"]),
  notes: z.string().optional(),
});

type ClientRow = Prisma.ClientGetPayload<Record<string, never>>;

const mapClient = (client: ClientRow, appointmentCount?: number) => ({
  id: client.id,
  name: client.name,
  email: client.email,
  phone: client.phone,
  preferredService: client.preferredService ?? "Evaluacion inicial",
  totalVisits: client.totalVisits,
  totalSpent: client.totalSpent,
  origin: fromLeadSource(client.origin),
  nextAppointment: client.nextAppointment?.toISOString(),
  notes: client.notes ?? undefined,
  createdAt: client.createdAt.toISOString(),
  appointmentCount,
});

export const clientsRouter = Router();

clientsRouter.post(
  "/clients",
  requireAuth,
  requireRole(Role.admin, Role.operator),
  validate(createClientSchema),
  async (req, res, next) => {
    try {
      const payload = req.body;
      const client = await prisma.client.upsert({
        where: { email: payload.email },
        update: {
          name: payload.name,
          phone: payload.phone,
          preferredService: payload.preferredService,
          origin: toLeadSource(payload.origin),
          notes: payload.notes,
        },
        create: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          preferredService: payload.preferredService,
          origin: toLeadSource(payload.origin),
          notes: payload.notes,
        },
      });
      return created(res, mapClient(client));
    } catch (error) {
      return next(error);
    }
  },
);

clientsRouter.get(
  "/clients",
  requireAuth,
  requireRole(Role.admin, Role.operator),
  validate(listClientsQuerySchema, "query"),
  async (req, res, next) => {
    try {
      const { search, page, pageSize } = listClientsQuerySchema.parse(req.query);
      const skip = (page - 1) * pageSize;
      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
              { phone: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : undefined;

      const [total, clients] = await Promise.all([
        prisma.client.count({ where }),
        prisma.client.findMany({
          where,
          orderBy: { name: "asc" },
          skip,
          take: pageSize,
        }),
      ]);

      return ok(res, {
        items: clients.map((item) => mapClient(item)),
        meta: { total, page, pageSize },
      });
    } catch (error) {
      return next(error);
    }
  },
);

clientsRouter.get(
  "/clients/:id",
  requireAuth,
  requireRole(Role.admin, Role.operator),
  async (req, res, next) => {
    try {
      const client = await prisma.client.findUnique({
        where: { id: req.params.id },
        include: {
          appointments: {
            include: { service: true },
            orderBy: { startsAt: "desc" },
          },
        },
      });
      if (!client) {
        return res.status(404).json({
          error: { code: "NOT_FOUND", message: "Client not found" },
          requestId: req.requestId,
        });
      }

      return ok(res, {
        ...mapClient(client, client.appointments.length),
        appointments: client.appointments.map((appointment) => ({
          id: appointment.id,
          serviceName: appointment.service.name,
          startsAt: appointment.startsAt.toISOString(),
          status: appointment.status,
          price: appointment.price,
        })),
      });
    } catch (error) {
      return next(error);
    }
  },
);
