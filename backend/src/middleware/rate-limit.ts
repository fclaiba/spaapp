import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/errors.js";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 120;

export const inMemoryRateLimit = (req: Request, _res: Response, next: NextFunction) => {
  const key = req.ip ?? "unknown";
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || now > current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (current.count >= MAX_REQUESTS) {
    return next(new AppError(429, "TOO_MANY_REQUESTS", "Too many requests"));
  }

  current.count += 1;
  buckets.set(key, current);
  return next();
};
