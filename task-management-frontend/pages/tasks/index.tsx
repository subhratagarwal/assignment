import { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import { api, getAccessToken } from "../../lib/api";

type Task = {
  id: number;
  title: string;
  description?: string | null;
  status: string;
  createdAt: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const res = await api.get("/tasks");
      setTasks(res.tasks || []);
    } catch (err: any) {
      setError(err?.message || "Could not load tasks");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/tasks", { title, description });
      setTitle("");
      setDescription("");
      await load();
    } catch (err: any) {
      setError(err?.message || "Could not create task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <Nav />
      <h1>Tasks</h1>
      <form onSubmit={createTask} style={{ marginBottom: 16 }}>
        <div>
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "60%", marginRight: 8 }} />
          <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "30%" }} />
          <button type="submit" disabled={loading}>Create</button>
        </div>
      </form>

      {error && <div style={{ color: "crimson" }}>{error}</div>}

      <ul>
        {tasks.map(t => (
          <li key={t.id} style={{ marginBottom: 8 }}>
            <strong>{t.title}</strong> — {t.status} <br/>
            <small>{t.description}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
