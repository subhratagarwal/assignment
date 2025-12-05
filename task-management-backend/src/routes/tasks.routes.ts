import { Router } from "express";
import * as taskCtrl from "../controllers/task.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema";

const router = Router();

router.get("/", requireAuth, taskCtrl.listTasks);
router.post("/", requireAuth, validateBody(createTaskSchema), taskCtrl.createTask);
router.get("/:id", requireAuth, taskCtrl.getTask);
router.patch("/:id", requireAuth, validateBody(updateTaskSchema), taskCtrl.updateTask);
router.delete("/:id", requireAuth, taskCtrl.deleteTask);

export default router;
