import cron from "node-cron";
import { prisma } from "../db/client.js";
import { writeAuditLog } from "../lib/audit.js";

const withinNext24Hours = (date: Date) => {
  const now = Date.now();
  const diff = date.getTime() - now;
  return diff > 0 && diff <= 24 * 60 * 60 * 1000;
};

export const startReminderJob = () => {
  cron.schedule("*/15 * * * *", async () => {
    const settings = await prisma.settings.findFirst();
    if (!settings?.reminderEnabled) {
      return;
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        status: {
          in: ["Pendiente", "Confirmada"],
        },
      },
      include: {
        client: true,
      },
    });

    const candidates = appointments.filter((item) => withinNext24Hours(item.startsAt));
    for (const appointment of candidates) {
      await writeAuditLog({
        action: "notification.reminder_scheduled",
        entityType: "appointment",
        entityId: appointment.id,
        after: {
          email: appointment.client.email,
          startsAt: appointment.startsAt.toISOString(),
        },
      });
    }
  });
};
