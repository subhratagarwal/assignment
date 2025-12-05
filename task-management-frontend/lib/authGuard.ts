// lib/authGuard.ts
import Router from "next/router";
import { getAccessToken, setAccessToken } from "./api";

export async function ensureAuthOrRedirect() {
  if (getAccessToken()) return true;
  // try refresh silently
  try {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!resp.ok) throw new Error("no refresh");
    const body = await resp.json();
    if (body?.accessToken) {
      setAccessToken(body.accessToken);
      return true;
    }
  } catch (e) {
    // ignore
  }
  Router.replace("/login");
  return false;
}
