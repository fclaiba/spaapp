import { Router } from "express";
import { ok } from "../lib/http.js";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  return ok(res, {
    status: "ok",
    service: "spaapp2-backend",
    timestamp: new Date().toISOString(),
  });
});

healthRouter.get("/ready", (_req, res) => {
  return ok(res, {
    status: "ready",
  });
});
