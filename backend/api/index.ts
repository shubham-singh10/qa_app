import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';

import authRoutes from "../src/routes/auth"
import questionRoutes from "../src/routes/questions"
import answerRoutes from "../src/routes/answers"
import insightRoutes from "../src/routes/insights"

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your routes
app.use("/api/auth", authRoutes)
app.use("/api/question", questionRoutes)
app.use("/api/answer", answerRoutes)
app.use("/api/insight", insightRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

// Export for Vercel
export default app;