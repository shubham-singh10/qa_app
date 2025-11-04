import express from 'express'
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.ts";
import authRoutes from "./routes/auth.ts"
import questionRoutes from "./routes/questions.ts"
import answerRoutes from "./routes/answers.ts"
import insightRoutes from "./routes/insights.ts"

const app = express()
app.use(cors({ origin: "*" }))
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/question", questionRoutes)
app.use("/api/answer", answerRoutes)
app.use("/api/insight", insightRoutes)

const PORT = process.env.PORT || 50001;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("DB connect error: ", error);
        process.exit(1);
    });