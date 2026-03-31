import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

async function requireAuth(ctx: { auth: { getUserIdentity: () => Promise<unknown> } }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("No autenticado");
  return identity;
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").first();
    if (!settings) {
      return {
        businessName: "MEDALLO SPA",
        headline: "Tu bienestar es nuestra prioridad.",
        phone: "+57 300 000 0000",
        email: "info@medallospa.com",
        address: "Medellín, Colombia",
        bookingLeadTimeHours: 4,
        reminderEnabled: true,
        cancellationWindowHours: 24,
      };
    }
    return {
      businessName: settings.businessName,
      headline: settings.headline,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      bookingLeadTimeHours: settings.bookingLeadTimeHours,
      reminderEnabled: settings.reminderEnabled,
      cancellationWindowHours: settings.cancellationWindowHours,
    };
  },
});

export const update = mutation({
  args: {
    businessName: v.optional(v.string()),
    headline: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    bookingLeadTimeHours: v.optional(v.number()),
    reminderEnabled: v.optional(v.boolean()),
    cancellationWindowHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const existing = await ctx.db.query("settings").first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("settings", {
        businessName: args.businessName ?? "MEDALLO SPA",
        headline: args.headline ?? "Tu bienestar es nuestra prioridad.",
        phone: args.phone ?? "+57 300 000 0000",
        email: args.email ?? "info@medallospa.com",
        address: args.address ?? "Medellín, Colombia",
        bookingLeadTimeHours: args.bookingLeadTimeHours ?? 4,
        reminderEnabled: args.reminderEnabled ?? true,
        cancellationWindowHours: args.cancellationWindowHours ?? 24,
      });
    }

    const updated = await ctx.db.query("settings").first();
    if (!updated) throw new Error("Error al actualizar configuración");

    return {
      businessName: updated.businessName,
      headline: updated.headline,
      phone: updated.phone,
      email: updated.email,
      address: updated.address,
      bookingLeadTimeHours: updated.bookingLeadTimeHours,
      reminderEnabled: updated.reminderEnabled,
      cancellationWindowHours: updated.cancellationWindowHours,
    };
  },
});
