import { Router } from "express";
import * as authCtrl from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/register", validateBody(registerSchema), authCtrl.register);
router.post("/login", validateBody(loginSchema), authCtrl.login);
router.post("/refresh", authCtrl.refresh);
router.post("/logout", authCtrl.logout);

export default router;
