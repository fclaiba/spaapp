import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";
import { env } from "../config/env.js";

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: Role;
}

export const signAccessToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: "8h" });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
