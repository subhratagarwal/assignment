import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api, getAccessToken, setAccessToken } from "../lib/api";

type Task = {
  id: number;
  title: string;
  description?: string;
  status: string;
  dueDate?: string | null;
  createdAt: string;
};

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If not logged in (no access token), go to login page
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await api.get(`/tasks?page=${page}&pageSize=10${q ? `&q=${encodeURIComponent(q)}` : ""}`);
      setTasks(res.tasks || []);
    } catch (err) {
      // if 401, api client will try refresh; if still failing, redirect to login
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createTask() {
    if (!title) return;
    try {
      await api.post("/tasks", { title, description: "Created from frontend" });
      setTitle("");
      fetchList();
    } catch (err: any) {
      console.error(err);
    }
  }

  async function doLogout() {
    try {
      await api.post("/auth/logout", {});
    } finally {
      setAccessToken(null);
      router.push("/login");
    }
  }

  return (
    <main style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Tasks</h1>
        <button onClick={doLogout}>Logout</button>
      </header>

      <section style={{ marginTop: 12 }}>
        <input value={q} placeholder="Search title..." onChange={(e) => setQ(e.target.value)} />
        <button onClick={() => { setPage(1); fetchList(); }}>Search</button>
      </section>

      <section style={{ marginTop: 16 }}>
        <input placeholder="New task title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button onClick={createTask}>Create</button>
      </section>

      <section style={{ marginTop: 20 }}>
        {loading ? <div>Loading…</div> : (
          <ul>
            {tasks.map(t => (
              <li key={t.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                <strong>{t.title}</strong> <span style={{ color: "#888" }}>({t.status})</span>
                <div style={{ color: "#666" }}>{t.description}</div>
                <div style={{ fontSize: 12, color: "#aaa" }}>{new Date(t.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer style={{ marginTop: 16 }}>
        <button onClick={() => { if (page > 1) setPage(p => p - 1); }}>Prev</button>
        <span style={{ margin: "0 8px" }}>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </footer>
    </main>
  );
}
