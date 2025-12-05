import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import prisma from "../prismaClient";

/**
 * Named export requireAuth - verifies "Authorization: Bearer <token>"
 * and attaches req.user = { id, email, name }.
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = (req.headers.authorization || "").toString().trim();
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      return res.status(401).json({ error: "missing authorization" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "invalid token" });

    let payload: any;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      return res.status(401).json({ error: "invalid or expired token" });
    }

    const userId = Number(payload.userId);
    if (!userId) return res.status(401).json({ error: "invalid token payload" });

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
    if (!user) return res.status(401).json({ error: "user not found" });

    (req as any).user = user;

    return next();
  } catch (err) {
    console.error("requireAuth error:", err);
    return res.status(500).json({ error: "internal error" });
  }
};