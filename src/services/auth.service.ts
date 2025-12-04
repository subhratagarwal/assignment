import prisma from "../prismaClient";
import { hashPassword, comparePassword } from "../utils/hash";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";

/**
 * Create a new user (hashes password)
 */
export async function createUser(email: string, password: string, name?: string) {
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });
  return user;
}

/**
 * Validate credentials and return user or null
 */
export async function validateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return null;
  return user;
}

/**
 * Create access + refresh tokens and store a hashed refresh token in DB.
 * Returns { accessToken, refreshToken } where refreshToken is the raw token
 * that must be sent to client (and later presented back).
 */
export async function createTokensForUser(userId: number) {
  const accessToken = signAccessToken({ userId });
  const refreshToken = signRefreshToken({ userId });

  // Hash the refresh token before storing
  const tokenHash = await hashPassword(refreshToken);

  const expiresMs = Number(process.env.REFRESH_TOKEN_EXPIRY_DAYS || 30) * 24 * 60 * 60 * 1000;
  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt: new Date(Date.now() + expiresMs),
      revoked: false,
    },
  });

  return { accessToken, refreshToken };
}

/**
 * Revoke refresh token rows that match a particular DB id.
 */
export async function revokeRefreshTokenById(id: number) {
  await prisma.refreshToken.updateMany({ where: { id }, data: { revoked: true } });
}

/**
 * Revoke any refresh tokens that match the raw token (compares against
 * stored hashed tokens). Useful for logout by presented token.
 */
export async function revokeRefreshTokenByRawToken(rawToken: string) {
  // find non-revoked, not-expired candidates
  const candidates = await prisma.refreshToken.findMany({
    where: { revoked: false, expiresAt: { gt: new Date() } },
  });

  for (const c of candidates) {
    const match = await comparePassword(rawToken, c.tokenHash);
    if (match) {
      await prisma.refreshToken.updateMany({ where: { id: c.id }, data: { revoked: true } });
    }
  }
}