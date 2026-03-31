import { ZodError } from "zod";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/errors.js";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof ZodError) {
    return res.status(422).json({
      error: {
        code: "UNPROCESSABLE_ENTITY",
        message: "Validation failed",
        details: error.flatten(),
      },
      requestId: req.requestId,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      requestId: req.requestId,
    });
  }

  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    },
    requestId: req.requestId,
  });
};
