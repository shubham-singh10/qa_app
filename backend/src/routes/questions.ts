import { Router } from "express";
import { createQuestion, getQuestion, getQuestionbyId } from "../controllers/questionsController.ts";
import { protect } from "../middleware/authMiddleware.ts";

const router = Router();
router.post("/", protect, createQuestion);
router.get("/", getQuestion);
router.get("/:id", getQuestionbyId)

export default router;
