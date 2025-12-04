// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { verifyRefreshToken } from "../utils/jwt";
import prisma from "../prismaClient";
import { comparePassword } from "../utils/hash";

/**
 * Register -> create user, issue tokens, set refresh cookie
 */
export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email and password required" });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "user exists" });

    const user = await authService.createUser(email, password, name);
    const tokens = await authService.createTokensForUser(user.id);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: false,
      maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY_DAYS || 30) * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ accessToken: tokens.accessToken, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
}

/**
 * Login -> validate user, issue tokens, set refresh cookie
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email and password required" });

    const user = await authService.validateUser(email, password);
    if (!user) return res.status(401).json({ error: "invalid credentials" });

    const tokens = await authService.createTokensForUser(user.id);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: false,
      maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY_DAYS || 30) * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken: tokens.accessToken, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
}

/**
 * Refresh -> client sends refresh cookie; we verify it and rotate tokens.
 */
export async function refresh(req: Request, res: Response) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "no refresh token" });

    // verify JWT signature/payload (throws if invalid)
    const payload: any = verifyRefreshToken(token);

    // find non-revoked, not-expired tokens for this user
    const candidates = await prisma.refreshToken.findMany({
      where: {
        userId: Number(payload.userId),
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    // find the DB row whose tokenHash matches the provided raw token
    let matchedRow = null;
    for (const c of candidates) {
      const ok = await comparePassword(token, c.tokenHash);
      if (ok) {
        matchedRow = c;
        break;
      }
    }

    if (!matchedRow) {
      return res.status(401).json({ error: "invalid refresh token" });
    }

    // revoke the matched token
    await prisma.refreshToken.update({ where: { id: matchedRow.id }, data: { revoked: true } });

    // issue new tokens and store hashed refresh token
    const tokens = await authService.createTokensForUser(Number(payload.userId));
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: false,
      maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY_DAYS || 30) * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken: tokens.accessToken });
  } catch (err) {
    console.error("refresh error:", err);
    return res.status(401).json({ error: "invalid refresh token" });
  }
}

/**
 * Logout -> revoke refresh token presented by client (if any) and clear cookie
 */
export async function logout(req: Request, res: Response) {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      // revoke matching stored hashed token(s)
      await authService.revokeRefreshTokenByRawToken(token);
    }
    res.clearCookie("refreshToken", { path: "/" });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
}
