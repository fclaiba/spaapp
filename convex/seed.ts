import { internalMutation } from "./_generated/server";

export const seedSettings = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("settings").first();
    if (existing) return { skipped: true };

    await ctx.db.insert("settings", {
      businessName: "MEDALLO SPA",
      headline: "Tu bienestar, nuestra prioridad.",
      phone: "+57 300 000 0000",
      email: "info@medallospa.com",
      address: "Nueva York, Estados Unidos",
      bookingLeadTimeHours: 4,
      reminderEnabled: true,
      cancellationWindowHours: 24,
    });

    return { seeded: true };
  },
});

export const seedTestData = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existingClients = await ctx.db.query("clients").first();
    if (existingClients) return { skipped: true, reason: "Ya hay datos de prueba" };

    // ── Clientes de prueba ───────────────────────────────────────────────────
    const clientIds: string[] = [];

    const clientsData = [
      {
        name: "Valentina Restrepo",
        email: "valentina@ejemplo.com",
        phone: "+57 300 111 2222",
        preferredService: "Suero de Vida",
        totalVisits: 4,
        totalSpent: 740,
        origin: "Instagram" as const,
        nextAppointment: offsetDate(3),
      },
      {
        name: "Catalina Gómez",
        email: "catalina@ejemplo.com",
        phone: "+57 300 333 4444",
        preferredService: "Facial Hydra",
        totalVisits: 2,
        totalSpent: 380,
        origin: "Google" as const,
        nextAppointment: offsetDate(5),
      },
      {
        name: "María José Herrera",
        email: "mariajose@ejemplo.com",
        phone: "+57 300 555 6666",
        preferredService: "Masaje Relajante",
        totalVisits: 6,
        totalSpent: 1080,
        origin: "Referido" as const,
        nextAppointment: offsetDate(7),
      },
      {
        name: "Juliana Ospina",
        email: "juliana@ejemplo.com",
        phone: "+57 300 777 8888",
        preferredService: "Vitamina C IV",
        totalVisits: 1,
        totalSpent: 220,
        origin: "WhatsApp" as const,
      },
      {
        name: "Sofía Montoya",
        email: "sofia@ejemplo.com",
        phone: "+57 300 999 0000",
        preferredService: "Exfoliación Corporal",
        totalVisits: 3,
        totalSpent: 525,
        origin: "Instagram" as const,
        nextAppointment: offsetDate(10),
      },
    ];

    for (const client of clientsData) {
      const id = await ctx.db.insert("clients", client);
      clientIds.push(id);
    }

    // ── Citas de prueba ──────────────────────────────────────────────────────
    const citasData = [
      {
        serviceId: "suero-vida",
        serviceName: "Suero de Vida",
        categoryId: "sueroterapia",
        clientId: clientIds[0],
        staff: "Equipo Medallo Spa",
        startsAt: `${offsetDate(1)}T09:00:00`,
        duration: 45,
        price: 185,
        status: "Confirmada" as const,
        customerName: "Valentina Restrepo",
        email: "valentina@ejemplo.com",
        phone: "+57 300 111 2222",
        origin: "Instagram" as const,
      },
      {
        serviceId: "facial-hydra",
        serviceName: "Facial Hydra",
        categoryId: "facial",
        clientId: clientIds[1],
        staff: "Equipo Medallo Spa",
        startsAt: `${offsetDate(2)}T10:30:00`,
        duration: 60,
        price: 190,
        status: "Pendiente" as const,
        customerName: "Catalina Gómez",
        email: "catalina@ejemplo.com",
        phone: "+57 300 333 4444",
        origin: "Google" as const,
      },
      {
        serviceId: "masaje-relajante",
        serviceName: "Masaje Relajante",
        categoryId: "masajes",
        clientId: clientIds[2],
        staff: "Equipo Medallo Spa",
        startsAt: `${offsetDate(3)}T14:00:00`,
        duration: 60,
        price: 180,
        status: "En sala" as const,
        customerName: "María José Herrera",
        email: "mariajose@ejemplo.com",
        phone: "+57 300 555 6666",
        origin: "Referido" as const,
      },
      {
        serviceId: "vitamina-c",
        serviceName: "Vitamina C IV",
        categoryId: "sueroterapia",
        clientId: clientIds[3],
        staff: "Equipo Medallo Spa",
        startsAt: `${offsetDate(4)}T12:00:00`,
        duration: 45,
        price: 220,
        status: "Pendiente" as const,
        customerName: "Juliana Ospina",
        email: "juliana@ejemplo.com",
        phone: "+57 300 777 8888",
        origin: "WhatsApp" as const,
      },
      {
        serviceId: "exfoliacion-corporal",
        serviceName: "Exfoliación Corporal",
        categoryId: "corporal",
        clientId: clientIds[4],
        staff: "Equipo Medallo Spa",
        startsAt: `${offsetDate(5)}T15:30:00`,
        duration: 75,
        price: 175,
        status: "Confirmada" as const,
        customerName: "Sofía Montoya",
        email: "sofia@ejemplo.com",
        phone: "+57 300 999 0000",
        origin: "Instagram" as const,
      },
      {
        serviceId: "suero-energia",
        serviceName: "Suero de Energía",
        categoryId: "sueroterapia",
        clientId: clientIds[0],
        staff: "Equipo Medallo Spa",
        startsAt: `${offsetDate(6)}T09:00:00`,
        duration: 45,
        price: 185,
        status: "Pendiente" as const,
        customerName: "Valentina Restrepo",
        email: "valentina@ejemplo.com",
        phone: "+57 300 111 2222",
        origin: "Instagram" as const,
      },
      {
        serviceId: "facial-anti-age",
        serviceName: "Facial Anti-Age",
        categoryId: "facial",
        clientId: clientIds[2],
        staff: "Equipo Medallo Spa",
        startsAt: `${offsetDate(8)}T17:00:00`,
        duration: 90,
        price: 250,
        status: "Confirmada" as const,
        customerName: "María José Herrera",
        email: "mariajose@ejemplo.com",
        phone: "+57 300 555 6666",
        origin: "Referido" as const,
      },
      {
        serviceId: "masaje-deep-tissue",
        serviceName: "Masaje Deep Tissue",
        categoryId: "masajes",
        clientId: clientIds[4],
        staff: "Equipo Medallo Spa",
        startsAt: `${offsetDate(10)}T10:30:00`,
        duration: 75,
        price: 210,
        status: "Pendiente" as const,
        customerName: "Sofía Montoya",
        email: "sofia@ejemplo.com",
        phone: "+57 300 999 0000",
        origin: "Instagram" as const,
      },
    ];

    for (const cita of citasData) {
      await ctx.db.insert("appointments", cita);
    }

    return { seeded: true, clients: clientIds.length, appointments: citasData.length };
  },
});

function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}
