import express from "express";
import {
    registerUser,
    registerExpert,
    loginUser,
    getUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/register-expert", registerExpert);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

export default router;
