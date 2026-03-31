import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const leadSource = v.union(
  v.literal("Instagram"),
  v.literal("Google"),
  v.literal("Referido"),
  v.literal("WhatsApp"),
  v.literal("Walk-in"),
);

const appointmentStatus = v.union(
  v.literal("Pendiente"),
  v.literal("Confirmada"),
  v.literal("En sala"),
  v.literal("Completada"),
  v.literal("Cancelada"),
);

export default defineSchema({
  ...authTables,

  appointments: defineTable({
    serviceId: v.string(),
    serviceName: v.string(),
    categoryId: v.string(),
    clientId: v.optional(v.id("clients")),
    staff: v.string(),
    startsAt: v.string(),
    duration: v.number(),
    price: v.number(),
    status: appointmentStatus,
    customerName: v.string(),
    email: v.string(),
    phone: v.string(),
    origin: leadSource,
    notes: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
  })
    .index("by_startsAt", ["startsAt"])
    .index("by_status", ["status"])
    .index("by_email", ["email"]),

  clients: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    preferredService: v.optional(v.string()),
    totalVisits: v.number(),
    totalSpent: v.number(),
    origin: leadSource,
    nextAppointment: v.optional(v.string()),
    notes: v.optional(v.string()),
  }).index("by_email", ["email"]),

  settings: defineTable({
    businessName: v.string(),
    headline: v.string(),
    phone: v.string(),
    email: v.string(),
    address: v.string(),
    bookingLeadTimeHours: v.number(),
    reminderEnabled: v.boolean(),
    cancellationWindowHours: v.number(),
  }),
});
