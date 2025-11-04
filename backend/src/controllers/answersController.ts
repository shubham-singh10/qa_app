import type { Response, Request } from "express";
import type { AuthRequest } from "../utils/types.ts";
import Answer from "../models/Answer.ts";

// API to create answer
export const addAnswer = async (req: AuthRequest, res: Response) => {
    const { questionId, content } = req.body

    try {
        const answer = await Answer.create({ questionId, content, createdBy: req.user!.id })
        res.status(201).json({ status: true, answer })
    } catch (error) {
        res.status(400).json({ status: false, message: "something went wrong" })
    }
}

// API to get answer
export const getAnswerByQuestion = async (req: Request, res: Response) => {
    const { questionId } = req.params
    try {
        const answer = await Answer.find({ questionId }).populate("createdBy", "name")
        res.status(201).json({ status: true, answer })

    } catch (error) {
        res.status(400).json({ status: false, message: "something went wrong" })
    }
}