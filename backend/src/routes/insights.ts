import { Router } from "express";
import { createInsight, getInsights } from "../controllers/insightsController.ts";
import { protect } from "../middleware/authMiddleware.ts";
import { managerOnly } from "../middleware/roleMiddleware.ts";

const router = Router();
router.post("/", protect, managerOnly, createInsight);
router.get("/", protect, managerOnly, getInsights);

export default router;
