import { Router } from "express";
import { register, login, getMe } from "./authController";
import { protect } from "../../../infrastructure/common/middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;
