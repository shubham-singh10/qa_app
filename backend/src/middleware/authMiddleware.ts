import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import type { AuthRequest } from "../utils/types.ts";
import dotenv from "dotenv"
dotenv.config();

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized" })
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, role: "manager" | "member" }
        req.user = { id: decoded.id, role: decoded.role }
        next()
    } catch (error) {
        return res.status(401).json({ message: "invalid token" })
    }
}