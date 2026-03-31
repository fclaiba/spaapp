import { Role } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/client.js";
import { writeAuditLog } from "../lib/audit.js";
import { notFound } from "../lib/errors.js";
import { ok } from "../lib/http.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const confirmationSchema = z.object({
  appointmentId: z.string().min(1),
});

export const notificationsRouter = Router();

notificationsRouter.post(
  "/notifications/confirmation-email",
  requireAuth,
  requireRole(Role.admin, Role.operator),
  validate(confirmationSchema),
  async (req, res, next) => {
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id: req.body.appointmentId },
        include: { client: true, service: true },
      });
      if (!appointment) {
        return next(notFound("Appointment not found"));
      }

      await writeAuditLog({
        action: "notification.confirmation_email_sent",
        entityType: "appointment",
        entityId: appointment.id,
        actorId: req.authUser?.id,
        requestId: req.requestId,
        after: {
          to: appointment.client.email,
          service: appointment.service.name,
          startsAt: appointment.startsAt.toISOString(),
        },
      });

      return ok(res, { sent: true });
    } catch (error) {
      return next(error);
    }
  },
);
