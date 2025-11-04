import express from 'express'
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth"
import questionRoutes from "./routes/questions"
import answerRoutes from "./routes/answers"
import insightRoutes from "./routes/insights"

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "https://qa-app-xi.vercel.app"
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}
const app = express()
app.use(cors(corsOptions))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!');
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