import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/tasks"); // redirect to /tasks immediately
  }, [router]);

  return null;
}
