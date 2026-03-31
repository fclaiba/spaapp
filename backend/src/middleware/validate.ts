import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

type ValidationTarget = "body" | "query" | "params";

export const validate =
  (schema: ZodTypeAny, target: ValidationTarget = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    req[target] = schema.parse(req[target]);
    next();
  };
