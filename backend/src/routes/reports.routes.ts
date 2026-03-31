import { Role } from "@prisma/client";
import { Router } from "express";
import { stringify } from "csv-stringify/sync";
import { prisma } from "../db/client.js";
import { ok } from "../lib/http.js";
import { fromLeadSource } from "../lib/mappers.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const reportsRouter = Router();

reportsRouter.get("/reports/kpis", requireAuth, requireRole(Role.admin, Role.operator), async (_req, res, next) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalAppointments, monthlyAppointments, monthlyRevenue, clientCount, completedCount] =
      await Promise.all([
        prisma.appointment.count(),
        prisma.appointment.count({ where: { startsAt: { gte: startOfMonth } } }),
        prisma.appointment.aggregate({
          where: { startsAt: { gte: startOfMonth } },
          _sum: { price: true },
        }),
        prisma.client.count(),
        prisma.appointment.count({ where: { status: "Completada" } }),
      ]);

    return ok(res, {
      totalAppointments,
      monthlyAppointments,
      monthlyRevenue: monthlyRevenue._sum.price ?? 0,
      clientCount,
      completionRate: totalAppointments ? Math.round((completedCount / totalAppointments) * 100) : 0,
    });
  } catch (error) {
    return next(error);
  }
});

reportsRouter.get(
  "/reports/clients.csv",
  requireAuth,
  requireRole(Role.admin),
  async (_req, res, next) => {
    try {
      const clients = await prisma.client.findMany({
        orderBy: { createdAt: "desc" },
      });

      const csv = stringify(
        clients.map((client) => ({
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          origin: fromLeadSource(client.origin),
          totalVisits: client.totalVisits,
          totalSpent: client.totalSpent,
        })),
        { header: true },
      );

      res.setHeader("content-type", "text/csv; charset=utf-8");
      res.setHeader("content-disposition", "attachment; filename=clients.csv");
      return res.status(200).send(csv);
    } catch (error) {
      return next(error);
    }
  },
);

reportsRouter.get(
  "/reports/appointments.csv",
  requireAuth,
  requireRole(Role.admin),
  async (_req, res, next) => {
    try {
      const appointments = await prisma.appointment.findMany({
        include: { client: true, service: true },
        orderBy: { startsAt: "desc" },
      });

      const csv = stringify(
        appointments.map((appointment) => ({
          id: appointment.id,
          service: appointment.service.name,
          client: appointment.client.name,
          email: appointment.client.email,
          startsAt: appointment.startsAt.toISOString(),
          status: appointment.status,
          paymentStatus: appointment.paymentStatus,
          price: appointment.price,
        })),
        { header: true },
      );

      res.setHeader("content-type", "text/csv; charset=utf-8");
      res.setHeader("content-disposition", "attachment; filename=appointments.csv");
      return res.status(200).send(csv);
    } catch (error) {
      return next(error);
    }
  },
);
