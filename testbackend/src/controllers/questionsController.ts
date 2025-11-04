import type { Response, Request } from "express";
import type { AuthRequest } from "../utils/types.ts";
import Question from "../models/Question.ts";

// API to create a questions
export const createQuestion = async (req: AuthRequest, res: Response) => {
    const { title, description, tags } = req.body

    try {
        // create a ques.
        const question = await Question.create({
            title,
            description,
            tags,
            createdBy: req.user!.id
        })
        return res.status(201).json({ status: true, question })
    } catch (error) {
        return res.status(400).json({ status: false, message: "something went wrong." })
    }
}

// API to get a questions
export const getQuestion = async (req: Request, res: Response) => {
    const { q, tag } = req.query
    try {
        const filter: any = {}
        if (q) filter.title = { $regex: q, $options: "i" }
        if (tag) filter.tags = tag

        const questions = await Question.find(filter).populate("createdBy", "name email").sort({ createdAt: -1 })
        if (!questions) {
            return res.status(404).json({
                status: false,
                message: "Questions not found"
            });
        }
        return res.status(200).json({ status: true, questions })
    } catch (error) {
        return res.status(400).json({ status: false, message: "something went wrong" })
    }
}

// API to get a question with id
export const getQuestionbyId = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                status: false,
                message: "Invalid question ID"
            });
        }

        const question = await Question.findById(id).populate("createdBy", "name email").sort({ createdAt: -1 })

        if (!question) {
            return res.status(404).json({
                status: false,
                message: "Question not found"
            });
        }
        return res.status(200).json({ status: true, question })
    } catch (error) {
        return res.status(400).json({ status: false, message: "something went wrong" })
    }
}