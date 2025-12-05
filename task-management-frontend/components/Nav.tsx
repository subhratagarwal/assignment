import Link from "next/link";
import Router from "next/router";
import { setAccessToken } from "../lib/api";

export default function Nav() {
  // components/Nav.tsx (update logout)
async function logout() {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {
    // ignore network errors
  }
  setAccessToken(null);
  Router.push("/login");
}


  return (
    <div style={{ padding: 10, borderBottom: "1px solid #eee", marginBottom: 12 }}>
      <Link href="/tasks"><a style={{ marginRight: 12 }}>Tasks</a></Link>
      <Link href="/login"><a style={{ marginRight: 12 }}>Login</a></Link>
      <Link href="/register"><a style={{ marginRight: 12 }}>Register</a></Link>
      <button onClick={logout} style={{ float: "right" }}>Logout</button>
    </div>
  );
}
