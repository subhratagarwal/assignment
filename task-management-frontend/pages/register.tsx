import { useState } from "react";
import { useRouter } from "next/router";
import { api, setAccessToken } from "../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { email, password, name });
      if (res?.accessToken) {
        setAccessToken(res.accessToken);
        router.push("/tasks");
      } else {
        // Some placeholder backends return no token. If so, redirect to login.
        router.push("/login");
      }
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 520 }}>
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%" }} />
          </label>
        </div>
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
          <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
        </div>
        {error && <div style={{ color: "crimson", marginTop: 10 }}>{error}</div>}
      </form>
    </div>
  );
}
