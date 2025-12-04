import { Request, Response, NextFunction } from "express";

/**
 * Central error handler middleware.
 * Usage: app.use(errorHandler);
 *
 * Sends JSON with { error: string } and logs the error to console.
 */
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  try {
    // If the error is a Zod or validation error it might have details we can use.
    if (err && typeof err === "object") {
      if (err.name === "ValidationError" && err.errors) {
        return res.status(400).json({ error: "validation error", details: err.errors });
      }
    }

    console.error("Unhandled error:", err && err.stack ? err.stack : err);
    const status = err && err.status && Number(err.status) ? Number(err.status) : 500;
    const message = err && err.message ? String(err.message) : "internal server error";
    return res.status(status).json({ error: message });
  } catch (handlerErr) {
    console.error("Error in errorHandler:", handlerErr);
    return res.status(500).json({ error: "internal server error" });
  }
}