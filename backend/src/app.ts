import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { requestContext } from "./middleware/request-context.js";
import { inMemoryRateLimit } from "./middleware/rate-limit.js";
import { errorHandler } from "./middleware/error-handler.js";
import { healthRouter } from "./routes/health.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { appointmentsRouter } from "./routes/appointments.routes.js";
import { clientsRouter } from "./routes/clients.routes.js";
import { settingsRouter } from "./routes/settings.routes.js";
import { paymentsRouter } from "./routes/payments.routes.js";
import { reportsRouter } from "./routes/reports.routes.js";
import { notificationsRouter } from "./routes/notifications.routes.js";
import { webhooksRouter } from "./routes/webhooks.routes.js";

export const app = express();

app.use(requestContext);
app.use(
  morgan("combined", {
    stream: {
      write: (message) => {
        process.stdout.write(`[http] ${message}`);
      },
    },
  }),
);
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
  }),
);
app.use(inMemoryRateLimit);

// Stripe webhook needs raw body.
app.use("/v1/webhooks/stripe", express.raw({ type: "application/json" }), webhooksRouter);
app.use(express.json());

app.use(healthRouter);
app.use("/v1", authRouter);
app.use("/v1", appointmentsRouter);
app.use("/v1", clientsRouter);
app.use("/v1", settingsRouter);
app.use("/v1", paymentsRouter);
app.use("/v1", reportsRouter);
app.use("/v1", notificationsRouter);

app.use(errorHandler);
