import { useState } from "react";
import { useRouter } from "next/router";
import { api, setAccessToken } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      // server returns accessToken in body
      if (res?.accessToken) {
        setAccessToken(res.accessToken);
        router.push("/tasks");
      } else {
        setError("Login succeeded but no accessToken returned");
      }
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 520 }}>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%" }} />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%" }} />
          </label>
        </div>
        <div>
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </div>
        {error && <div style={{ color: "crimson", marginTop: 10 }}>{error}</div>}
      </form>
    </div>
  );
}
