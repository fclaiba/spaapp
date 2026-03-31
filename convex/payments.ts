import { v } from "convex/values";
import { mutation } from "./_generated/server";

// ─── Confirm payment ─────────────────────────────────────────────────────────
// Called from frontend after payment (real or mock) is processed.

export const confirmPayment = mutation({
  args: {
    appointmentId: v.id("appointments"),
    paymentIntentId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.appointmentId, {
      status: "Confirmada",
      stripePaymentIntentId: args.paymentIntentId,
    });
  },
});
