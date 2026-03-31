import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../db/client.js";
import { signAccessToken } from "../lib/auth.js";
import { created, ok } from "../lib/http.js";
import { notFound, unauthorized } from "../lib/errors.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authRouter = Router();

authRouter.post("/auth/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return next(notFound("User not found"));
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return next(unauthorized("Invalid credentials"));
    }

    const token = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return created(res, {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
});

authRouter.get("/auth/me", requireAuth, async (req, res, next) => {
  try {
    const authUser = req.authUser;
    if (!authUser) {
      return next(unauthorized());
    }

    const user = await prisma.user.findUnique({ where: { id: authUser.id } });
    if (!user) {
      return next(notFound("User not found"));
    }

    return ok(res, {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });
  } catch (error) {
    return next(error);
  }
});
