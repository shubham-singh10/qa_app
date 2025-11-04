import { Router } from "express";
import { createInsight, getInsights } from "../controllers/insightsController";
import { protect } from "../middleware/authMiddleware";
import { managerOnly } from "../middleware/roleMiddleware";

const router = Router();
router.post("/", protect, managerOnly, createInsight);
router.get("/", protect, managerOnly, getInsights);

export default router;
