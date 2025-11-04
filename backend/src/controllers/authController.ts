import type { Request, Response } from "express";
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import User from "../models/User.ts";
import mongoose from "mongoose";
dotenv.config()

interface UserInterface {
    _id: string;
    role: "manager" | "member"
}
const signToken = (user: UserInterface) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "7d" })

//API to create a new user
export const register = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ status: false, message: "Email already registered." })

        //Create a new user
        const user = await User.create({ name, email, password, role })

        const userToken: UserInterface = {
            _id: (user._id as mongoose.Types.ObjectId).toString(),
            role: user.role,
        };

        res.status(201).json({ status: true, token: signToken(userToken), user: { role: user.role } })
    } catch (error) {
        res.json(400).json({ status: false, message: "something went wrong" })
    }
}

// API for login
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    console.log(req.body)
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ status: false, message: "Invalid credentials" })

        //Check Password
        const isMatch = await user.comparePassword(password)
        if (!isMatch) return res.status(400).json({ status: false, message: "Invalid Password" })

        const userToken: UserInterface = {
            _id: (user._id as mongoose.Types.ObjectId).toString(),
            role: user.role,
        };
        res.json({ status: true, token: signToken(userToken), user: { role: user.role } })
    } catch (error) {
        res.json(400).json({ status: false, message: "something went wrong" })
    }
}