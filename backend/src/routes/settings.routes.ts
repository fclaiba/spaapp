import { Role } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/client.js";
import { writeAuditLog } from "../lib/audit.js";
import { ok } from "../lib/http.js";
import { notFound } from "../lib/errors.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const updateSettingsSchema = z.object({
  businessName: z.string().optional(),
  headline: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  bookingLeadTimeHours: z.number().int().min(1).max(72).optional(),
  reminderEnabled: z.boolean().optional(),
  cancellationWindowHours: z.number().int().min(1).max(240).optional(),
});

export const settingsRouter = Router();

settingsRouter.get("/settings", async (_req, res, next) => {
  try {
    const settings = await prisma.settings.findFirst({
      orderBy: { createdAt: "asc" },
    });
    if (!settings) {
      return next(notFound("Settings not configured"));
    }
    return ok(res, settings);
  } catch (error) {
    return next(error);
  }
});

settingsRouter.patch(
  "/settings",
  requireAuth,
  requireRole(Role.admin),
  validate(updateSettingsSchema),
  async (req, res, next) => {
    try {
      const existing = await prisma.settings.findFirst();
      if (!existing) {
        return next(notFound("Settings not configured"));
      }

      const updated = await prisma.settings.update({
        where: { id: existing.id },
        data: {
          ...req.body,
          updatedByUserId: req.authUser?.id,
        },
      });

      await writeAuditLog({
        action: "settings.updated",
        entityType: "settings",
        entityId: updated.id,
        actorId: req.authUser?.id,
        requestId: req.requestId,
        before: existing,
        after: updated,
      });

      return ok(res, updated);
    } catch (error) {
      return next(error);
    }
  },
);
