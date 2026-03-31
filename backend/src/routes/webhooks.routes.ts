import { Router } from "express";
import Stripe from "stripe";
import { AppointmentStatus, PaymentStatus } from "@prisma/client";
import { env } from "../config/env.js";
import { prisma } from "../db/client.js";
import { writeAuditLog } from "../lib/audit.js";

const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY)
  : null;

export const webhooksRouter = Router();

webhooksRouter.post("/", async (req, res, next) => {
  try {
    if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
      return res.status(200).json({ received: true, skipped: "stripe_not_configured" });
    }

    const signature = req.header("stripe-signature");
    if (!signature) {
      return res.status(400).json({ error: "Missing stripe-signature header" });
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;
      const appointmentId = intent.metadata.appointmentId;
      if (appointmentId) {
        const existing = await prisma.appointment.findUnique({ where: { id: appointmentId } });
        if (existing && existing.paymentStatus !== PaymentStatus.paid) {
          await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
              paymentStatus: PaymentStatus.paid,
              status: existing.status === AppointmentStatus.Pendiente ? AppointmentStatus.Confirmada : existing.status,
            },
          });
          await writeAuditLog({
            action: "payment.succeeded",
            entityType: "appointment",
            entityId: appointmentId,
            after: { paymentStatus: PaymentStatus.paid },
          });
        }
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object;
      const appointmentId = intent.metadata.appointmentId;
      if (appointmentId) {
        await prisma.appointment.updateMany({
          where: { id: appointmentId },
          data: { paymentStatus: PaymentStatus.failed },
        });
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    return next(error);
  }
});
