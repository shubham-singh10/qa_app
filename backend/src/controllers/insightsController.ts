import type { Response, Request } from "express";
import type { AuthRequest } from "../utils/types.ts";
import Insight from "../models/Insight.ts";

//API to craete a Insights
export const createInsight = async (req: AuthRequest, res: Response) => {
    const { questionId, summary } = req.body
    try {
        const inSight = await Insight.create({ questionId, summary, createdBy: req.user!.id })
        res.status(201).json({ status: true, inSight })
    } catch (error) {
        res.status(400).json({ status: false, message: "something went wrong" })
    }
}

//API to get Insights
export const getInsights = async (req: Request, res: Response) => {
    try {
        const inSights = await Insight.find().populate("createdBy", "name").sort({ createdAt: -1 })
        res.status(201).json({ status: true, inSights })
    } catch (error) {
        res.status(400).json({ status: false, message: "something went wrong" })
    }
}