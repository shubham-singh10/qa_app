import { Router } from "express";
import { addAnswer, getAnswerByQuestion } from "../controllers/answersController.ts";
import { protect } from "../middleware/authMiddleware.ts";

const router = Router();
router.post("/", protect, addAnswer);
router.get("/:questionId", getAnswerByQuestion);

export default router;
