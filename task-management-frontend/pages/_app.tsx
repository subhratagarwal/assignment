import "../styles/globals.css";
import type { AppProps } from "next/app";
// pages/_app.tsx
import { useEffect } from "react";
import { setAccessToken } from "../lib/api";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // try refresh once on app load
    (async () => {
      try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (!resp.ok) return;
        const body = await resp.json();
        if (body?.accessToken) setAccessToken(body.accessToken);
      } catch (e) {}
    })();
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;