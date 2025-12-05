// lib/api.ts
// Make sure this file is used by pages and imported as `import { api, getAccessToken, setAccessToken } from "../lib/api"`

type ApiResponse = any;

let accessToken: string | null = null;
export function setAccessToken(token: string | null) {
  accessToken = token;
}
export function getAccessToken() {
  return accessToken;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function doRefresh(): Promise<string | null> {
  try {
    const resp = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) return null;
    const body = await resp.json();
    if (body?.accessToken) {
      setAccessToken(body.accessToken);
      return body.accessToken;
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}, retry = true): Promise<ApiResponse> {
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const resp = await fetch(typeof input === "string" ? input : input, {
    ...init,
    headers,
    credentials: "include", // always include cookies for refresh flows
  });

  if (resp.status === 401 && retry) {
    // try refresh
    const newToken = await doRefresh();
    if (newToken) {
      // retry original request with new token
      headers.set("Authorization", `Bearer ${newToken}`);
      const retryResp = await fetch(typeof input === "string" ? input : input, {
        ...init,
        headers,
        credentials: "include",
      });
      if (!retryResp.ok) {
        const text = await retryResp.text();
        throw new Error(`Request failed: ${retryResp.status} ${text}`);
      }
      return retryResp.json();
    }
    // no new token, forward 401
    const text = await resp.text();
    throw new Error(`Unauthorized: ${text}`);
  }

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Request failed: ${resp.status} ${text}`);
  }
  return resp.json();
}

export const api = {
  get: async (path: string) => fetchWithAuth(`${API_BASE}${path}`, { method: "GET" }),
  post: async (path: string, body?: any) =>
    fetchWithAuth(`${API_BASE}${path}`, { method: "POST", body: JSON.stringify(body) }),
  patch: async (path: string, body?: any) =>
    fetchWithAuth(`${API_BASE}${path}`, { method: "PATCH", body: JSON.stringify(body) }),
  delete: async (path: string) => fetchWithAuth(`${API_BASE}${path}`, { method: "DELETE" }),
};

export default api;
