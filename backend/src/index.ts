import { app } from "./app.js";
import { env } from "./config/env.js";
import { startReminderJob } from "./jobs/reminder.job.js";

app.listen(env.PORT, () => {
  process.stdout.write(`[startup] backend listening on http://localhost:${env.PORT}\n`);
});

startReminderJob();
