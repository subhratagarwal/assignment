import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-secret";
const ACCESS_EXP = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_EXP_DAYS = Number(process.env.REFRESH_TOKEN_EXPIRY_DAYS || 30);

export function signAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXP });
}

export function signRefreshToken(payload: object) {
  const seconds = REFRESH_EXP_DAYS * 24 * 60 * 60;
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: seconds + "s" });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}