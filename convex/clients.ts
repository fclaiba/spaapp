import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

async function requireAuth(ctx: { auth: { getUserIdentity: () => Promise<unknown> } }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("No autenticado");
  return identity;
}

export const list = query({
  args: { search: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    let clients = await ctx.db.query("clients").order("asc").collect();

    if (args.search) {
      const term = args.search.toLowerCase();
      clients = clients.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term),
      );
    }

    return clients.map((c) => ({
      id: c._id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      preferredService: c.preferredService ?? "",
      totalVisits: c.totalVisits,
      totalSpent: c.totalSpent,
      origin: c.origin,
      nextAppointment: c.nextAppointment,
      notes: c.notes,
      createdAt: new Date(c._creationTime).toISOString(),
    }));
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    preferredService: v.optional(v.string()),
    origin: v.union(
      v.literal("Instagram"),
      v.literal("Google"),
      v.literal("Referido"),
      v.literal("WhatsApp"),
      v.literal("Walk-in"),
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const existing = await ctx.db
      .query("clients")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        phone: args.phone,
        preferredService: args.preferredService ?? existing.preferredService,
        origin: args.origin,
        notes: args.notes ?? existing.notes,
      });
      const updated = await ctx.db.get(existing._id);
      if (!updated) throw new Error("Cliente no encontrado");
      return {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        preferredService: updated.preferredService ?? "",
        totalVisits: updated.totalVisits,
        totalSpent: updated.totalSpent,
        origin: updated.origin,
        nextAppointment: updated.nextAppointment,
        notes: updated.notes,
        createdAt: new Date(updated._creationTime).toISOString(),
      };
    }

    const clientId = await ctx.db.insert("clients", {
      name: args.name,
      email: args.email,
      phone: args.phone,
      preferredService: args.preferredService,
      totalVisits: 0,
      totalSpent: 0,
      origin: args.origin,
      notes: args.notes,
    });

    const client = await ctx.db.get(clientId);
    if (!client) throw new Error("Error al crear el cliente");

    return {
      id: client._id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      preferredService: client.preferredService ?? "",
      totalVisits: client.totalVisits,
      totalSpent: client.totalSpent,
      origin: client.origin,
      nextAppointment: client.nextAppointment,
      notes: client.notes,
      createdAt: new Date(client._creationTime).toISOString(),
    };
  },
});
