import { Role } from "@prisma/client";
import { Router } from "express";
import Stripe from "stripe";
import { z } from "zod";
import { env } from "../config/env.js";
import { prisma } from "../db/client.js";
import { badRequest, notFound } from "../lib/errors.js";
import { ok } from "../lib/http.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const createPaymentSchema = z.object({
  appointmentId: z.string().min(1),
  mode: z.enum(["full", "partial"]).default("full"),
});

const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY)
  : null;

export const paymentsRouter = Router();

paymentsRouter.post(
  "/payments/intent",
  requireAuth,
  requireRole(Role.admin, Role.operator),
  validate(createPaymentSchema),
  async (req, res, next) => {
    try {
      if (!stripe) {
        return next(badRequest("Stripe is not configured"));
      }

      const { appointmentId, mode } = req.body;
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: { client: true, service: true },
      });
      if (!appointment) {
        return next(notFound("Appointment not found"));
      }

      const amount = mode === "partial" ? Math.round(appointment.price * 0.4 * 100) : appointment.price * 100;
      const intent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        metadata: {
          appointmentId: appointment.id,
          clientEmail: appointment.client.email,
          mode,
        },
      });

      await prisma.appointment.update({
        where: { id: appointment.id },
        data: {
          paymentIntentId: intent.id,
        },
      });

      return ok(res, {
        paymentIntentId: intent.id,
        clientSecret: intent.client_secret,
      });
    } catch (error) {
      return next(error);
    }
  },
);
