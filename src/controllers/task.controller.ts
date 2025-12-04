import { Request, Response } from "express";
import * as taskService from "../services/task.service";

export async function createTask(req: Request, res: Response) {
  try {
    const userId = Number(req.user?.id);
    const { title, description, dueDate } = req.body || {};
    if (!title) return res.status(400).json({ error: "title required" });
    const task = await taskService.createTask(userId, title, description, dueDate);
    return res.status(201).json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
}

export async function listTasks(req: Request, res: Response) {
  try {
    const userId = Number(req.user?.id);
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 10);
    const status = (req.query.status as string) || undefined;
    const q = (req.query.q as string) || undefined;

    const result = await taskService.listTasks(userId, { page, pageSize, status, q });
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
}


export async function getTask(req: Request, res: Response) {
  try {
    const userId = Number(req.user?.id);
    const id = Number(req.params.id);
    const task = await taskService.getTask(userId, id);
    if (!task) return res.status(404).json({ error: "not found" });
    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
}

export async function updateTask(req: Request, res: Response) {
  try {
    const userId = Number(req.user?.id);
    const id = Number(req.params.id);
    const result = await taskService.updateTask(userId, id, req.body || {});
    if ((result as any).count === 0) return res.status(404).json({ error: "not found or no change" });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const userId = Number(req.user?.id);
    const id = Number(req.params.id);
    const result = await taskService.deleteTask(userId, id);
    if ((result as any).count === 0) return res.status(404).json({ error: "not found" });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
}