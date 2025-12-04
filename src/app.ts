import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/tasks.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Mount routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// fallback & error handler
app.use((_req, res) => res.status(404).json({ error: "not found" }));
app.use(errorHandler);

export default app;