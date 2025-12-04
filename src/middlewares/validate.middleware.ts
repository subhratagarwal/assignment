import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodTypeAny } from "zod";

export const validateBody = (schema: ZodSchema<ZodTypeAny>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (err: any) {
      return res.status(400).json({ error: err.errors ?? err.message });
    }
  };
};
