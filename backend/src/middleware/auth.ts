import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/auth.js";
import { forbidden, unauthorized } from "../lib/errors.js";
import type { Role } from "@prisma/client";

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    return next(unauthorized());
  }

  try {
    const token = header.replace("Bearer ", "").trim();
    const payload = verifyAccessToken(token);
    req.authUser = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    return next();
  } catch {
    return next(unauthorized("Invalid access token"));
  }
};

export const requireRole =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.authUser) {
      return next(unauthorized());
    }

    if (!roles.includes(req.authUser.role)) {
      return next(forbidden());
    }

    return next();
  };
