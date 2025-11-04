import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../utils/types.ts";

export const managerOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Not authorized" })
    if (req.user.role !== "manager") return res.status(403).json({ message: "Manager role required" })
    next()
}