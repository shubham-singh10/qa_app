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

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "https://qa-app-s69w.vercel.app";
console.log("Allowed FRONTEND_ORIGIN: ", FRONTEND_ORIGIN);
app.use(express.json());

const corsOptions: cors.CorsOptions = {
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
    exposedHeaders: ["Content-Range", "X-Total-Count"],
    credentials: false
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", FRONTEND_ORIGIN);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

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