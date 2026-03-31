import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { services } from "./seedData";

const STAFF_DEFAULT = "Equipo Medallo Spa";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function requireAuth(ctx: { auth: { getUserIdentity: () => Promise<unknown> } }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("No autenticado");
  return identity;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const list = query({
  args: {
    date: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let appointments = await ctx.db.query("appointments").order("desc").collect();

    if (args.date) {
      appointments = appointments.filter((a) => a.startsAt.startsWith(args.date!));
    }
    if (args.status) {
      appointments = appointments.filter((a) => a.status === args.status);
    }

    return appointments.map((a) => ({
      id: a._id,
      serviceId: a.serviceId,
      serviceName: a.serviceName,
      categoryId: a.categoryId,
      staff: a.staff,
      startsAt: a.startsAt,
      duration: a.duration,
      price: a.price,
      status: a.status,
      customerName: a.customerName,
      email: a.email,
      phone: a.phone,
      origin: a.origin,
      notes: a.notes,
      createdAt: new Date(a._creationTime).toISOString(),
    }));
  },
});

// ─── Public booking mutation ───────────────────────────────────────────────────

export const book = mutation({
  args: {
    serviceId: v.string(),
    date: v.string(),
    time: v.string(),
    customerName: v.string(),
    email: v.string(),
    phone: v.string(),
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
    const service = services.find((s) => s.id === args.serviceId);
    if (!service) throw new Error("Servicio no encontrado");

    const startsAt = `${args.date}T${args.time}:00`;

    // Upsert client
    const existing = await ctx.db
      .query("clients")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    let clientId: string;
    if (existing) {
      await ctx.db.patch(existing._id, {
        totalVisits: existing.totalVisits + 1,
        totalSpent: existing.totalSpent + service.price,
        nextAppointment: startsAt,
      });
      clientId = existing._id;
    } else {
      clientId = await ctx.db.insert("clients", {
        name: args.customerName,
        email: args.email,
        phone: args.phone,
        preferredService: service.name,
        totalVisits: 1,
        totalSpent: service.price,
        origin: args.origin,
        nextAppointment: startsAt,
      });
    }

    const appointmentId = await ctx.db.insert("appointments", {
      serviceId: service.id,
      serviceName: service.name,
      categoryId: service.categoryId,
      clientId,
      staff: STAFF_DEFAULT,
      startsAt,
      duration: service.duration,
      price: service.price,
      status: "Pendiente",
      customerName: args.customerName,
      email: args.email,
      phone: args.phone,
      origin: args.origin,
      notes: args.notes,
    });

    const appointment = await ctx.db.get(appointmentId);
    if (!appointment) throw new Error("Error al crear la cita");

    return {
      id: appointment._id,
      serviceId: appointment.serviceId,
      serviceName: appointment.serviceName,
      categoryId: appointment.categoryId,
      staff: appointment.staff,
      startsAt: appointment.startsAt,
      duration: appointment.duration,
      price: appointment.price,
      status: appointment.status,
      customerName: appointment.customerName,
      email: appointment.email,
      phone: appointment.phone,
      origin: appointment.origin,
      notes: appointment.notes,
      createdAt: new Date(appointment._creationTime).toISOString(),
    };
  },
});

// ─── Admin mutations (auth required) ─────────────────────────────────────────

export const addManual = mutation({
  args: {
    serviceId: v.string(),
    customerName: v.string(),
    email: v.string(),
    phone: v.string(),
    origin: v.union(
      v.literal("Instagram"),
      v.literal("Google"),
      v.literal("Referido"),
      v.literal("WhatsApp"),
      v.literal("Walk-in"),
    ),
    date: v.string(),
    time: v.string(),
    status: v.optional(
      v.union(
        v.literal("Pendiente"),
        v.literal("Confirmada"),
        v.literal("En sala"),
        v.literal("Completada"),
        v.literal("Cancelada"),
      ),
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const service = services.find((s) => s.id === args.serviceId);
    if (!service) throw new Error("Servicio no encontrado");

    const startsAt = `${args.date}T${args.time}:00`;

    const appointmentId = await ctx.db.insert("appointments", {
      serviceId: service.id,
      serviceName: service.name,
      categoryId: service.categoryId,
      staff: STAFF_DEFAULT,
      startsAt,
      duration: service.duration,
      price: service.price,
      status: args.status ?? "Pendiente",
      customerName: args.customerName,
      email: args.email,
      phone: args.phone,
      origin: args.origin,
      notes: args.notes,
    });

    const appointment = await ctx.db.get(appointmentId);
    if (!appointment) throw new Error("Error al crear la cita");

    return {
      id: appointment._id,
      serviceId: appointment.serviceId,
      serviceName: appointment.serviceName,
      categoryId: appointment.categoryId,
      staff: appointment.staff,
      startsAt: appointment.startsAt,
      duration: appointment.duration,
      price: appointment.price,
      status: appointment.status,
      customerName: appointment.customerName,
      email: appointment.email,
      phone: appointment.phone,
      origin: appointment.origin,
      notes: appointment.notes,
      createdAt: new Date(appointment._creationTime).toISOString(),
    };
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("appointments"),
    status: v.union(
      v.literal("Pendiente"),
      v.literal("Confirmada"),
      v.literal("En sala"),
      v.literal("Completada"),
      v.literal("Cancelada"),
    ),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    await ctx.db.patch(args.id, { status: args.status });
    const appointment = await ctx.db.get(args.id);
    if (!appointment) throw new Error("Cita no encontrada");

    return {
      id: appointment._id,
      serviceId: appointment.serviceId,
      serviceName: appointment.serviceName,
      categoryId: appointment.categoryId,
      staff: appointment.staff,
      startsAt: appointment.startsAt,
      duration: appointment.duration,
      price: appointment.price,
      status: appointment.status,
      customerName: appointment.customerName,
      email: appointment.email,
      phone: appointment.phone,
      origin: appointment.origin,
      notes: appointment.notes,
      createdAt: new Date(appointment._creationTime).toISOString(),
    };
  },
});

// ─── Internal helpers (used by other Convex modules) ─────────────────────────

export const getById = internalQuery({
  args: { id: v.id("appointments") },
  handler: async (ctx, args) => {
    const appointment = await ctx.db.get(args.id);
    if (!appointment) throw new Error("Cita no encontrada");
    return appointment;
  },
});
